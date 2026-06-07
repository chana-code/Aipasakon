import { test, expect } from '@playwright/test';

/**
 * The design system bundles ONLY Prompt + JetBrains Mono (styles/colors_and_type.css).
 * No rendered text element may resolve to any other family. Guards against the
 * font-['Noto_Serif_Thai',serif] / font-['DM_Sans',sans-serif] drift ever returning.
 */
const PAGES = ['/', '/curriculum', '/about', '/foundations/what-is-ai'];
const FORBIDDEN = /Noto Serif|DM Sans/i;

for (const path of PAGES) {
  test(`no off-system fonts render on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const offenders = await page.evaluate((forbiddenSource) => {
      const forbidden = new RegExp(forbiddenSource, 'i');
      const bad: { tag: string; text: string; font: string }[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        const text = (el.textContent || '').trim();
        if (!text) return;
        const fam = getComputedStyle(el).fontFamily || '';
        if (forbidden.test(fam)) bad.push({ tag: el.tagName, text: text.slice(0, 30), font: fam });
      });
      const seen = new Set<string>();
      return bad.filter((b) => {
        const k = b.tag + '|' + b.font;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }, FORBIDDEN.source);

    expect(offenders, `Off-system fonts found:\n${JSON.stringify(offenders, null, 2)}`).toEqual([]);
  });
}
