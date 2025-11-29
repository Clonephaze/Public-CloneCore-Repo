import { getServerSession } from '#auth'
import { Octokit } from 'octokit'
import type { Session } from 'next-auth'

interface SessionWithToken extends Session {
    accessToken?: string
}

interface FileChange {
    path: string
    content: string
    encoding?: 'base64' | 'utf-8'
}

interface CreatePRBody {
    title: string
    description: string
    files: FileChange[]
    category: 'webProjects' | 'addons' | 'artworks'
}

/**
 * Create a pull request with file changes
 * - Creates a new branch
 * - Commits all file changes
 * - Opens a PR
 */
export default defineEventHandler(async (event) => {
    const session = await getServerSession(event) as SessionWithToken | null
    
    if (!session?.accessToken) {
        throw createError({
            statusCode: 401,
            message: 'Not authenticated'
        })
    }

    const body = await readBody<CreatePRBody>(event)
    
    if (!body.title || !body.files || body.files.length === 0) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: title, files'
        })
    }

    const config = useRuntimeConfig()
    const octokit = new Octokit({
        auth: session.accessToken as string
    })

    const owner = config.github.repoOwner
    const repo = config.github.repoName
    const repoBranch = (config.github as { repoBranch?: string }).repoBranch

    try {
        let baseBranch = repoBranch
        if (!baseBranch) {
            const { data: repoData } = await octokit.rest.repos.get({ owner, repo })
            baseBranch = repoData.default_branch
        }

        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${baseBranch}`
        })
        const baseSha = refData.object.sha

        const timestamp = Date.now()
        const branchName = `admin/${body.category}-update-${timestamp}`

        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: baseSha
        })

        const { data: baseCommit } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: baseSha
        })

        const blobs = await Promise.all(
            body.files.map(async (file) => {
                const { data: blob } = await octokit.rest.git.createBlob({
                    owner,
                    repo,
                    content: file.content,
                    encoding: file.encoding || 'utf-8'
                })
                return {
                    path: file.path,
                    sha: blob.sha,
                    mode: '100644' as const,
                    type: 'blob' as const
                }
            })
        )

        const { data: newTree } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: baseCommit.tree.sha,
            tree: blobs
        })

        const { data: newCommit } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: body.title,
            tree: newTree.sha,
            parents: [baseSha]
        })

        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: `heads/${branchName}`,
            sha: newCommit.sha
        })

        const { data: pr } = await octokit.rest.pulls.create({
            owner,
            repo,
            title: body.title,
            body: body.description || 'Changes submitted via Admin Panel',
            head: branchName,
            base: baseBranch
        })

        return {
            success: true,
            pullRequest: {
                number: pr.number,
                url: pr.html_url,
                title: pr.title
            }
        }

    } catch (error) {
        console.error('Error creating PR:', error)
        throw createError({
            statusCode: 500,
            message: error instanceof Error ? error.message : 'Failed to create pull request'
        })
    }
})
