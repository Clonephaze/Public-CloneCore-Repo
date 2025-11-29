import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

interface UploadedFile {
    path: string
    content: string  // Base64 encoded
    encoding: 'base64'
}

/**
 * Upload endpoint that works in both dev and production:
 * - In development: saves files to disk AND returns base64 for PR
 * - In production: returns base64 data only (for inclusion in PR commit)
 */
export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)
    
    if (!formData) {
        throw createError({
            statusCode: 400,
            message: 'No form data received'
        })
    }

    let itemId = ''
    let imageFolder = ''
    const files: { name: string; data: Buffer; type: string }[] = []

    for (const field of formData) {
        if (field.name === 'itemId' && field.data) {
            itemId = field.data.toString()
        } else if (field.name === 'imageFolder' && field.data) {
            imageFolder = field.data.toString()
        } else if (field.name === 'files' && field.data && field.filename) {
            files.push({
                name: field.filename,
                data: field.data,
                type: field.type || 'image/png'
            })
        }
    }

    if (!itemId || !imageFolder) {
        throw createError({
            statusCode: 400,
            message: 'Missing itemId or imageFolder'
        })
    }

    if (files.length === 0) {
        throw createError({
            statusCode: 400,
            message: 'No files received'
        })
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(itemId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid itemId format. Use only letters, numbers, hyphens, and underscores.'
        })
    }

    const isProduction = process.env.NODE_ENV === 'production'
    const savedPaths: string[] = []
    const uploadedFiles: UploadedFile[] = []

    try {
        for (const file of files) {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
            const webPath = `/images/${imageFolder}/${itemId}/${safeName}`
            const repoPath = `public${webPath}`  // Path in the repo
            
            // Convert to base64 for PR commit
            const base64Content = file.data.toString('base64')
            uploadedFiles.push({
                path: repoPath,
                content: base64Content,
                encoding: 'base64'
            })
            
            savedPaths.push(webPath)

            // In development, also save to disk for immediate preview
            if (!isProduction) {
                const targetDir = join(process.cwd(), 'public', 'images', imageFolder, itemId)
                await mkdir(targetDir, { recursive: true })
                const filePath = join(targetDir, safeName)
                await writeFile(filePath, new Uint8Array(file.data))
            }
        }

        return {
            success: true,
            message: `Successfully processed ${files.length} file(s)`,
            paths: savedPaths,
            files: uploadedFiles  // Include base64 files for PR creation
        }
    } catch (error: unknown) {
        console.error('Error uploading files:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw createError({
            statusCode: 500,
            message: `Failed to upload files: ${errorMessage}`
        })
    }
})
