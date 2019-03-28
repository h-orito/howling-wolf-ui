module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/vue',
    'prettier/@typescript-eslint'
  ],
  globals: {
    console: false
  },
  rules: {
    'no-console': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false
      }
    ]
  }
}
