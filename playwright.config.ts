import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright設定
 *
 * E2Eテスト用ポート: 3010
 * ※ 通常の開発サーバー（3000）との競合を避けるため、E2Eテストでは3010を使用
 * ※ CI環境ではBASE_URL環境変数で上書き可能
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3010',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  expect: {
    timeout: 30000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev --port 3010',
        url: 'http://localhost:3010',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000
      }
})
