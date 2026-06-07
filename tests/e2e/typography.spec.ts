import { test, expect } from '@playwright/test';

/**
 * The design system bundles ONLY Prompt + JetBrains Mono (styles/colors_and_type.css).
 * No rendered text element may resolve to any other family. Guards against the
 * font-['Noto_Serif_Thai',serif] / font-['DM_Sans',sans-serif] drift ever returning.
 */
const PAGES = ['/', '/curriculum', '/about', '/foundations/what-is-ai'];

for (const path of PAGES) {
  test(`no off-system fonts render on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('load');

    const offenders = await page.evaluate(() => {
      // Bundled families are Prompt + JetBrains Mono; anything matching these is drift.
      const forbidden = /Noto Serif|DM Sans/i;
      const bad: { tag: string; cls: string; text: string; font: string }[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        const text = (el.textContent || '').trim();
        if (!text) return;
        const fam = getComputedStyle(el).fontFamily || '';
        if (forbidden.test(fam)) {
          bad.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 40),
            text: text.slice(0, 30),
            font: fam,
          });
        }
      });
      // De-dupe by tag+class+font so the failure message stays short but locatable.
      const seen = new Set<string>();
      return bad.filter((b) => {
        const k = b.tag + '|' + b.cls + '|' + b.font;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    });

    expect(offenders, `Off-system fonts found:\n${JSON.stringify(offenders, null, 2)}`).toEqual([]);
  });
}
