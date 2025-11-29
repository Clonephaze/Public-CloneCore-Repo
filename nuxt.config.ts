export default defineNuxtConfig({
  compatibilityDate: '2024-11-17',

  alias: {
    '@': '/assets'
  },

  app: {
    head: {
      link: [
        // Primary heading font - loads first (used in hero, section titles)
        {
          rel: 'preload',
          href: '/fonts/urbanist-latin-900-normal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        // Body text font - second priority
        {
          rel: 'preload',
          href: '/fonts/urbanist-latin-400-normal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        // Semi-bold for buttons, labels, subheadings
        {
          rel: 'preload',
          href: '/fonts/urbanist-latin-600-normal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  css: [
    '@/styles/main.scss'
  ],

  devtools: { enabled: true },

  experimental: {
    payloadExtraction: true
  },

  nitro: {
    compressPublicAssets: true,
  },

  // Route rules for caching
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=86400' } },
  },

  icon: {
    serverBundle: 'remote'
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/index" as *;'
        }
      }
    },
    optimizeDeps: {
      include: [
        'motion',
      ]
    }
  },


  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/eslint',
    'nuxt-swiper',
    '@nuxt/image',
    '@sidebase/nuxt-auth'
  ],

  auth: {
    baseURL: '/api/auth',
    originEnvKey: 'AUTH_ORIGIN',
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: false
  },

  runtimeConfig: {
    // Server-side only
    authSecret: process.env.NUXT_AUTH_SECRET,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      repoOwner: process.env.GITHUB_REPO_OWNER,
      repoName: process.env.GITHUB_REPO_NAME,
      repoBranch: process.env.GITHUB_REPO_BRANCH || ''  // Optional: defaults to repo's default branch
    }
  },

  image: {
    provider: 'vercel',
    format: ['webp', 'avif'],
    quality: 80,
    screens: {
      'sprite-xs': 200,
      'sprite-sm': 280,
      xs: 320,
      sm: 400,
      'sprite-md': 560,
      md: 640,
      lg: 800,
      xl: 1024,
      xxl: 1280,
      '2xl': 1536
    }
  }
})