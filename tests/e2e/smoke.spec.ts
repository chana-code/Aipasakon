import { test, expect } from '@playwright/test';

test('home renders hero and three doors', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AI ไม่ยาก/ })).toBeVisible();
  await expect(page.getByText('เริ่มจากตรงนี้')).toBeVisible();
});

test('chapter page renders with depth toggle', async ({ page }) => {
  await page.goto('/foundations/what-is-an-llm');
  await expect(page.getByRole('heading', { name: 'LLM คืออะไร' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Surface' })).toBeVisible();

  await page.getByRole('tab', { name: 'Deeper' }).click();
  await expect(page.getByText('ลึกขึ้นหน่อย')).toBeVisible();
});

test('curriculum, glossary, videos, about, 404', async ({ page }) => {
  await page.goto('/curriculum');
  await expect(page.getByRole('heading', { name: 'หลักสูตร' })).toBeVisible();

  await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: 'คำศัพท์' })).toBeVisible();

  await page.goto('/videos');
  await expect(page.getByRole('heading', { name: 'วิดีโอ' })).toBeVisible();

  await page.goto('/about');
  await expect(page.getByRole('heading', { name: 'AI ภาษาคน' })).toBeVisible();

  await page.goto('/does-not-exist-XYZ');
  await expect(page.getByText('หน้านี้ยังไม่ได้เขียน')).toBeVisible();
});
