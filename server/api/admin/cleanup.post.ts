import { rm, readdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    if (process.env.NODE_ENV === 'production') {
        throw createError({
            statusCode: 403,
            message: 'This endpoint is only available in development mode'
        })
    }

    const body = await readBody<{ 
        imageFolder: string
        itemId: string
        paths?: string[]
    }>(event)

    if (!body.imageFolder || !body.itemId) {
        throw createError({
            statusCode: 400,
            message: 'Missing imageFolder or itemId'
        })
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(body.itemId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid itemId format'
        })
    }

    const targetDir = join(process.cwd(), 'public', 'images', body.imageFolder, body.itemId)

    try {
        if (body.paths && body.paths.length > 0) {
            for (const filePath of body.paths) {
                const fullPath = join(process.cwd(), 'public', filePath)
                if (fullPath.startsWith(targetDir)) {
                    try {
                        await rm(fullPath, { force: true })
                    } catch {
                        // Ignore errors for individual file deletions
                    }
                }
            }

            try {
                const remaining = await readdir(targetDir)
                if (remaining.length === 0) {
                    await rm(targetDir, { recursive: true, force: true })
                }
            } catch {
                // Directory may not exist, ignore
            }
        } else {
            await rm(targetDir, { recursive: true, force: true })
        }

        return {
            success: true,
            message: 'Cleanup completed'
        }
    } catch (error: unknown) {
        console.error('Error during cleanup:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw createError({
            statusCode: 500,
            message: `Failed to cleanup: ${errorMessage}`
        })
    }
})
