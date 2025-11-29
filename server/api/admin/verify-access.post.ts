import { getServerSession } from '#auth'
import { Octokit } from 'octokit'

/**
 * Verify that the authenticated user has collaborator access to the repo
 */
export default defineEventHandler(async (event) => {
    const session = await getServerSession(event) as { accessToken?: string; user?: { name?: string; email?: string } } | null
    
    const accessToken = (session as Record<string, unknown>)?.accessToken as string | undefined
    
    if (!accessToken) {
        return { hasAccess: false, error: 'Not authenticated' }
    }

    const config = useRuntimeConfig()
    
    try {
        const octokit = new Octokit({
            auth: accessToken
        })

        const { data: user } = await octokit.rest.users.getAuthenticated()

        // Check if user is the repo owner
        if (user.login.toLowerCase() === config.github.repoOwner.toLowerCase()) {
            return { 
                hasAccess: true, 
                username: user.login,
                avatar: user.avatar_url,
                isOwner: true
            }
        }

        // Check if user is a collaborator with write access
        try {
            const { data: repoPermission } = await octokit.rest.repos.getCollaboratorPermissionLevel({
                owner: config.github.repoOwner,
                repo: config.github.repoName,
                username: user.login
            })
            
            const allowedPermissions = ['admin', 'write', 'maintain']
            if (allowedPermissions.includes(repoPermission.permission)) {
                return { 
                    hasAccess: true, 
                    username: user.login,
                    avatar: user.avatar_url,
                    permission: repoPermission.permission
                }
            }
            
            return { hasAccess: false, error: 'Insufficient permissions' }
        } catch {
            return { hasAccess: false, error: 'Not a collaborator' }
        }
    } catch (error) {
        console.error('Error verifying access:', error)
        return { hasAccess: false, error: 'Verification failed' }
    }
})
