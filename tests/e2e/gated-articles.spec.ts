import { test, expect } from '@playwright/test';

// These assert the LOGGED-OUT behavior, which holds regardless of Supabase keys
// (placeholder keys are treated as logged-out).

test('locked card appears on its section index', async ({ page }) => {
  await page.goto('/what-is-ai');
  await expect(page.getByText('ตัวอย่างบทความสำหรับสมาชิก')).toBeVisible();
});

test('article page shows the sign-in wall when logged out', async ({ page }) => {
  await page.goto('/articles/sample-locked');
  await expect(page.getByText('เข้าสู่ระบบเพื่ออ่านบทความนี้')).toBeVisible();
  // Body content must NOT be present.
  await expect(page.getByText('นี่คือเนื้อหาที่จะปรากฏหลังจากผู้อ่านเข้าสู่ระบบแล้ว')).toHaveCount(0);
});

test('raw gated endpoint is blocked when logged out', async ({ request }) => {
  const res = await request.get('/api/gated/sample-locked');
  expect(res.status()).toBe(401);
});

test('unknown article slug 404s', async ({ page }) => {
  const res = await page.goto('/articles/no-such-article');
  expect(res?.status()).toBe(404);
});
