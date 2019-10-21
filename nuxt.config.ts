import { Configuration } from '@nuxt/types'

const nuxtConfig: Configuration = {
  mode: 'spa',

  env: require('dotenv').config({
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASEURL: process.env.FIREBASE_DATABASEURL,
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
    FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
    FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID,
    FIREBASE_APPID: process.env.FIREBASE_APPID
  }).parsed,

  /* Headers of the page */
  head: {
    titleTemplate: '汝は多忙なりや',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          '忙しい方向けのオプションルールを盛り込んだオンライン人狼が遊べるサービスです。'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /* Customize the progress-bar color */
  loading: { color: '#3B8070' },

  /* Global CSS */
  css: [
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'
  ],

  /* Plugins to load before mounting the App */
  plugins: [
    '~/plugins/axios',
    '~/plugins/vue-datetime',
    '~/plugins/message-utils'
  ],
  axios: {
    baseURL:
      process.env.WOLF4BUSY_API_BASEURL || 'http://localhost:8086/wolf4busy'
  },

  router: {
    middleware: ['authenticated']
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
    'cookie-universal-nuxt'
  ],
  styleResources: {
    scss: ['~/assets/sass/wolf4busy.scss']
  },
  /* Build configuration */
  buildModules: ['@nuxt/typescript-build'],

  build: {
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
