import { Configuration } from '@nuxt/types'
require('dotenv').config()

const siteName = 'HOWLING WOLF'
const siteDesc = '人狼ゲームが無料で遊べるサービスです。'
const siteKeywords = '人狼,人狼ゲーム,長期人狼'
const baseUrl = process.env.HOWLING_WOLF_UI_BASEURL || 'http://localhost:3000'
const ogpImages = baseUrl + '/image/ogp/'
const manifestIcon = '/image/icons/icon-512.png'

const pwa = {
  icon: {
    iconFileName: manifestIcon
  },
  manifest: {
    lang: 'ja',
    name: siteName,
    short_name: siteName,
    description: siteDesc,
    background_color: '#ffffff',
    theme_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait'
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://polyfill.io/.*',
        handler: 'cacheFirst'
      },
      {
        urlPattern: '^https://fonts.(?:googleapis|gstatic).com/(.*)',
        handler: 'cacheFirst'
      },
      {
        urlPattern: 'https://cdn.jsdelivr.net/.*',
        handler: 'cacheFirst'
      },
      {
        urlPattern: '/.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'my-cache',
          cacheExpiration: {
            maxAgeSeconds: 24 * 60 * 60 * 30
          }
        }
      }
    ]
  }
}

const meta = [
  { charset: 'utf-8' },
  {
    name: 'viewport',
    content:
      'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'
  },
  {
    hid: 'description',
    name: 'description',
    content: siteDesc
  },
  { hid: 'keywords', name: 'keywords', content: siteKeywords },
  { hid: 'og:site_name', property: 'og:site_name', content: siteName },
  // OGP
  { hid: 'og:type', property: 'og:type', content: 'website' },
  { hid: 'og:url', property: 'og:url', content: baseUrl },
  { hid: 'og:title', property: 'og:title', content: siteName },
  { hid: 'og:description', property: 'og:description', content: siteDesc },
  {
    hid: 'og:image',
    property: 'og:image',
    content: `${ogpImages}top.jpg`
  },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: '@ort_dev' }
]
if (process.env.ENV !== 'production') {
  meta.push({
    hid: 'robots',
    name: 'robots',
    content: 'noindex,noarchive,nofollow'
  })
}

const nuxtConfig: Configuration = {
  mode: 'spa',

  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
    FIREBASE_DATABASEURL: process.env.FIREBASE_DATABASEURL || '',
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID || '',
    FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET || '',
    FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID || '',
    FIREBASE_APPID: process.env.FIREBASE_APPID || '',
    ENV: process.env.ENV || ''
  },

  /* Headers of the page */
  head: {
    titleTemplate: `${siteName}%s`,
    meta,
    link: [
      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: '/image/icons/apple-touch-icon.png'
      },
      { rel: 'icon', type: 'image/png', href: '/image/icons/icon.png' }
    ],
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#'
    }
  },

  pwa,

  /* Customize the progress-bar color */
  loading: { color: '#3B8070' },

  /* Global CSS */
  css: [
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css',
    '~/assets/sass/howlingwolf.scss',
    '~/assets/css/main.css'
  ],

  /* Plugins to load before mounting the App */
  plugins: ['~/plugins/axios'],

  axios: {
    baseURL:
      process.env.HOWLING_WOLF_API_BASEURL ||
      'http://localhost:8086/howling-wolf'
  },

  router: {
    middleware: ['authenticated', 'version']
  },

  /* Nuxt.js modules */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    ['nuxt-buefy', { materialDesignIcons: false }],
    // 各pageでsassの変数を使えるようにしたい
    '@nuxtjs/style-resources',
    // dotenv
    '@nuxtjs/dotenv',
    // cookie-universal-nuxt
    'cookie-universal-nuxt',
    // scroll
    ['vue-scrollto/nuxt', { duration: 500 }],
    // copy to clipboard
    'nuxt-clipboard2',
    // pwa
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/sitemap-module
    // ↓配列の最後でsitemapモジュールを宣言
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    hostname: 'https://howling-wolf.com',
    // 除外ディレクトリ、ページ
    exclude: [],
    // 動的なルーティングで生成したページ
    routes: []
  },

  styleResources: {
    scss: ['~/assets/sass/howlingwolf.scss']
  },

  loadingIndicator: {
    name: '~/static/html/loading-indicator.html'
  },

  /* Build configuration */
  buildModules: [
    [
      '@nuxt/typescript-build',
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true
      }
    ]
  ],
  // TODO google analytics https://github.com/nuxt-community/analytics-module

  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },
    /* You can extend webpack config here */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module!.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

export default nuxtConfig
