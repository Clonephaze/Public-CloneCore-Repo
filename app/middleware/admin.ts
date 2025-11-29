/**
 * Middleware to protect admin routes
 * - Requires GitHub authentication
 * - Verifies user has collaborator access to the repo
 * - In development mode, allows bypass for easier testing
 */
export default defineNuxtRouteMiddleware(async (to) => {
    // Only protect /admin routes (except login page)
    if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
        return
    }

    // In development mode, skip auth checks for easier local testing
    // Note: PR creation will still require valid GitHub token
    if (import.meta.dev) {
        return
    }

    const { status, getSession } = useAuth()

    // If not authenticated, redirect to login
    if (status.value !== 'authenticated') {
        return navigateTo('/admin/login')
    }

    // Get fresh session to ensure we have the token
    const session = await getSession()
    
    if (!session) {
        return navigateTo('/admin/login')
    }

    // Verify repo access on the server
    // Use useRequestHeaders to forward cookies for SSR
    try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
        
        const response = await $fetch('/api/admin/verify-access', {
            method: 'POST',
            headers
        })
        
        if (!response.hasAccess) {
            return navigateTo('/admin/login?error=unauthorized')
        }
    } catch {
        // If verification fails, redirect to login
        return navigateTo('/admin/login?error=verification-failed')
    }
})
