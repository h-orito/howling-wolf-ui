import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const isAnalyze = process.env.ANALYZE === 'true'
const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-24',
  devtools: { enabled: true },
  devServer: {
    port: 3000
  },

  app: {
    head: {
      titleTemplate: '%s | HOWLING WOLF',
      htmlAttrs: {
        lang: 'ja'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/image/icons/icon.png' },
        {
          rel: 'apple-touch-icon',
          href: '/image/icons/apple-touch-icon.png'
        },
        { rel: 'preconnect', href: 'https://apis.google.com' },
        { rel: 'preconnect', href: 'https://www.googleapis.com' },
        { rel: 'preconnect', href: 'https://identitytoolkit.googleapis.com' }
      ]
    }
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint', 'nuxt-vuefire', '@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    disable: isDev,
    manifest: {
      name: 'HOWLING WOLF - 人狼ゲーム',
      short_name: 'HOWLING WOLF',
      description: '人狼ゲームが無料で遊べるサービスです。',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      lang: 'ja',
      categories: ['games', 'entertainment'],
      icons: [
        {
          src: '/image/icons/icon.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/image/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/image/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/image/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'apple touch icon'
        }
      ]
    },
    workbox: {
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/__\/auth/, /^\/api\//],
      globPatterns: [
        '**/*.{js,css,png,jpg,jpeg,svg,ico,woff,woff2}',
        'index.html'
      ],
      globIgnores: ['**/node_modules/**'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/.*\.(woff|woff2|ttf|eot)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/.*\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ],
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'stats.html',
              open: false,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap'
            })
          ]
        : [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    build: {
      minify: 'esbuild',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/firebase')) {
              return 'firebase'
            }
            if (
              id.includes('node_modules/vee-validate') ||
              id.includes('node_modules/yup') ||
              id.includes('node_modules/@vee-validate')
            ) {
              return 'validation'
            }
            if (id.includes('node_modules/@vueuse')) {
              return 'vueuse'
            }
            if (id.includes('node_modules/@heroicons')) {
              return 'icons'
            }
          }
        }
      },
      chunkSizeWarningLimit: 500
    }
  },

  typescript: {
    typeCheck: true
  },

  pages: true,
  ssr: false,

  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false
    },
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      databaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL || ''
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        'http://localhost:8086/howling-wolf'
    }
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    },
    routeRules: {
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/img/**': {
        headers: {
          'cache-control':
            'public, max-age=604800, stale-while-revalidate=86400'
        }
      },
      '/fonts/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/**': {
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate'
        }
      }
    }
  }
})
