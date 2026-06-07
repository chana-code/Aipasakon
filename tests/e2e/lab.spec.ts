import { test, expect } from '@playwright/test';

test.describe('AI Lab', () => {
  test('hub renders with section groups and lab cards', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.locator('h1')).toContainText('AI Lab');
    await expect(page.getByRole('heading', { name: 'AI คืออะไร' })).toBeVisible();
    await expect(page.locator('a[href="/lab/dissection-lab"]')).toBeVisible();
  });

  test('clicking a lab card opens its standalone page', async ({ page }) => {
    await page.goto('/lab');
    await page.locator('a[href="/lab/prompt-creator"]').first().click();
    await expect(page).toHaveURL(/\/lab\/prompt-creator$/);
    await expect(page.locator('iframe')).toBeVisible();
  });

  test('a standalone react lab page renders related chapters', async ({ page }) => {
    await page.goto('/lab/dissection-lab');
    await expect(page.getByText('บทเรียนที่เกี่ยวข้อง')).toBeVisible();
  });

  test('unknown lab id returns 404', async ({ page }) => {
    const res = await page.goto('/lab/does-not-exist');
    expect(res?.status()).toBe(404);
  });

  test('AI Lab appears in the top nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/lab"]').first()).toBeVisible();
  });
});
