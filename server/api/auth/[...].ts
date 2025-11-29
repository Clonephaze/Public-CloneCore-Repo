import GitHubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
    secret: process.env.NUXT_AUTH_SECRET || 'dev-secret',
    providers: [
        // @ts-expect-error - NextAuth types
        GitHubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'read:user user:email repo'
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // @ts-expect-error - Adding custom property
            session.accessToken = token.accessToken
            return session
        }
    },
    pages: {
        signIn: '/admin/login'
    }
})
