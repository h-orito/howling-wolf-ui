module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:nuxt/recommended'
  ],
  plugins: ['vue'],
  globals: {
    console: false
  },
  rules: {
    'vue/no-v-html': 'off', // 自前でエスケープ処理しているので無視する
    'vue/attributes-order': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'no-return-await': 'off',
    'no-unused-vars': 'off',
    camelcase: 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
