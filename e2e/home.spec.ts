import { test, expect } from '@playwright/test'

test('トップページが表示される', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/HOWLING WOLF/)
})

test('ルールページに遷移できる', async ({ page }) => {
  await page.goto('/rule')
  await expect(page.locator('text=ルール')).toBeVisible()
})
