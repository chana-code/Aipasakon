import { test, expect } from '@playwright/test';

test('rotating band exposes a pause state and pauses on hover', async ({ page }) => {
  await page.goto('/');
  const band = page.locator('[data-rotating-band]');
  await expect(band).toHaveAttribute('data-paused', 'false');
  await band.hover();
  await expect(band).toHaveAttribute('data-paused', 'true');
});

test('rotating band is static under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const phrase = page.locator('[data-rotating-band] [data-phrase]');
  const first = await phrase.textContent();
  // Wait past one full 2600ms rotation cycle (+600ms buffer). Under reduced motion
  // no interval runs, so the phrase must stay identical. Don't tighten below ~2.6s.
  await page.waitForTimeout(3200);
  expect(await phrase.textContent()).toBe(first);
});
