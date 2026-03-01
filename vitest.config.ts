import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['**/*.{test,spec}.ts'],
    exclude: ['node_modules', '.old-nuxt2', '.firewolf-ui', 'e2e'],
    globals: true
  }
})
