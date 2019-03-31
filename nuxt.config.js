export default {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '汝は多忙なりや？',
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

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#3B8070' },

  /*
   ** Global CSS
   */
  css: ['assets/wolf4busy.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios'],

  axios: {
    host: process.env.WOLF4BUSY_API_HOST || 'localhost',
    port: process.env.WOLF4BUSY_API_PORT || 8086
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    [
      'nuxt-buefy',
      {
        defaultIconPack: 'fas'
      }
    ]
  ],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
