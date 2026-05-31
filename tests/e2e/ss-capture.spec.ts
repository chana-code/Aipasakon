import { test } from '@playwright/test';

const shots = [
  { url: '/', name: 'home' },
  { url: '/login', name: 'login' },
  { url: '/signup', name: 'signup' },
  { url: '/auth/reset', name: 'reset-password' },
  { url: '/learn', name: 'learn-redirect' },
  { url: '/foundations/what-is-ai', name: 'chapter-what-is-ai' },
  { url: '/foundations', name: 'foundations-index' },
  { url: '/using-ai', name: 'using-ai-index' },
];

for (const s of shots) {
  test(`screenshot ${s.name}`, async ({ page }) => {
    await page.goto(s.url);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/ss-${s.name}.png`, fullPage: true });
  });
}
