import { test, expect } from '@playwright/test';

test.describe('auth pages', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('เข้าสู่ระบบ');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('signup page renders', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('สมัครสมาชิก');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('password reset page renders', async ({ page }) => {
    await page.goto('/auth/reset');
    await expect(page.locator('h1')).toContainText('รีเซ็ตรหัสผ่าน');
  });

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login');
    const signupLink = page.locator('a[href*="/signup"]');
    await expect(signupLink).toBeVisible();
  });

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup');
    const loginLink = page.locator('a[href*="/login"]');
    await expect(loginLink).toBeVisible();
  });

  test('/learn redirects to /login when unauthenticated', async ({ page }) => {
    await page.goto('/learn');
    await expect(page).toHaveURL(/\/login/);
  });
});
