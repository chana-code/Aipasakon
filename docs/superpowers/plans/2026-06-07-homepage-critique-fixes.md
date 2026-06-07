# Homepage Critique Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the actionable findings from the homepage `impeccable critique` — site-wide typography drift, hero visual self-inconsistency, an un-pausable rotating headline, the unresolved "book vs landing" strategy, and the missing anti-pattern detector.

**Architecture:** The site loads exactly one type system in `app/globals.css` → `styles/colors_and_type.css`: **Prompt** (everything) + **JetBrains Mono** (code only). Many components instead hardcode Tailwind arbitrary classes `font-['Noto_Serif_Thai',serif]` and `font-['DM_Sans',sans-serif]`. Because Tailwind v4 puts utilities in a cascade *layer* and `colors_and_type.css` is imported *after* it (unlayered), the unlayered `h1,h2,h3 { font-family: var(--font-display) }` rules win on headings — but there is **no** unlayered `font-family` on `p`, so the drift classes win on body text, spans, links, and buttons, rendering fonts that are not bundled (they only resolve on machines that happen to have them installed). The fix removes the drift classes so those elements inherit Prompt from `<body>`, guarded by a Playwright test that fails on any off-system font. The remaining tasks tone down the hero, make the rotating band pausable, add an honest "cover → book" bridge, and give the project its own anti-pattern lint.

**Tech Stack:** Next.js (App Router, RSC) · Tailwind CSS v4 · framer-motion · Playwright (e2e) · Vitest (unit) · Node ESM scripts.

---

## File Structure

**Created:**
- `tests/e2e/typography.spec.ts` — Playwright guard: no element on key pages may compute an off-system font.
- `tests/e2e/hero.spec.ts` — Playwright assertions for the toned-down hero + pausable band + bridge.
- `scripts/fix-font-drift.mjs` — one-shot deterministic codemod that strips the drift font classes.
- `scripts/check-antipatterns.mjs` — project-owned anti-pattern linter (exports `scanAntipatterns`, plus a CLI).
- `tests/unit/design/antipatterns.test.ts` — unit test that the codebase is anti-pattern clean.
- `components/landing/ChapterPeek.tsx` — interior-styled "this is what reading here feels like" bridge.

**Modified:**
- 23 `.tsx` files under `app/` and `components/` — drift font classes removed (by the codemod, not by hand).
- `components/landing/Hero.tsx` — remove glow blobs, calm the gradient.
- `components/landing/SpecialtyBand.tsx` — add pause-on-hover/focus + a testable `data-paused` attribute.
- `app/page.tsx` — insert `<ChapterPeek />` between `<VisualRow />` and `<AboutScene />`.
- `PRODUCT.md` — record the "homepage is the cover" decision so it stops reading as a violation.
- `package.json` — add `lint:design` script.

**Responsibility boundaries:** the codemod owns the mechanical site-wide edit (one place, re-runnable); each visual change lives in its own component; the linter is the durable regression guard so this drift can't silently return.

---

## Pre-flight (read once, do not skip)

- [ ] **Confirm the dev server contract.** `playwright.config.ts` already sets `baseURL: http://localhost:3000`, `webServer: npm run dev`, `reuseExistingServer: true`, project `chromium`. No config change needed; Playwright will boot the server itself.
- [ ] **Known-stale test, do not "fix" here.** `tests/e2e/smoke.spec.ts` line 3-7 expects an *old* homepage (`/AI ไม่ยาก/`, `เริ่มจากตรงนี้`) from `components/home/`, but `app/page.tsx` renders `components/landing/`. That test may already be red and is **out of scope** — do not edit it. If it fails, leave it; note it in the final report.
- [ ] **Run the existing suite once to capture the baseline:**

Run: `npm run test` then `npm run test:e2e`
Expected: record which tests currently pass/fail so you can tell new breakage from pre-existing.

---

## Task 1: Typography guard test (red first)

**Files:**
- Test: `tests/e2e/typography.spec.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/typography.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

/**
 * The design system bundles ONLY Prompt + JetBrains Mono (see styles/colors_and_type.css).
 * No rendered text element may resolve to any other family. This catches the
 * font-['Noto_Serif_Thai',serif] / font-['DM_Sans',sans-serif] drift and any future regression.
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
        if (forbidden.test(fam)) {
          bad.push({ tag: el.tagName, text: text.slice(0, 30), font: fam });
        }
      });
      // de-dupe identical (tag, font) rows to keep the failure message readable
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
```

- [ ] **Step 2: Run the test to verify it FAILS**

Run: `npm run test:e2e -- typography.spec.ts`
Expected: FAIL — at least `/` and `/about` report offenders such as `{ tag: "P", font: "\"Noto Serif Thai\", serif" }` and `{ tag: "SPAN", font: "\"DM Sans\", sans-serif" }`. (Headings will NOT appear — they already inherit Prompt via the unlayered cascade. Body/spans/links/buttons will.)

- [ ] **Step 3: Commit the red test**

```bash
git add tests/e2e/typography.spec.ts
git commit -m "test: add typography guard for off-system fonts (currently red)"
```

---

## Task 2: Strip the drift font classes site-wide (make Task 1 green)

**Files:**
- Create: `scripts/fix-font-drift.mjs`
- Modify (by running the script): all `.tsx` under `app/` and `components/` containing the drift classes (23 files).

- [ ] **Step 1: Write the codemod**

Create `scripts/fix-font-drift.mjs`:

```js
#!/usr/bin/env node
// One-shot codemod: remove the two off-system Tailwind font classes so elements
// inherit Prompt from <body>. Safe + idempotent. Re-running is a no-op.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['app', 'components'];
const FORBIDDEN_CLASSES = [
  "font-['Noto_Serif_Thai',serif]",
  "font-['DM_Sans',sans-serif]",
];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith('.tsx')) acc.push(full);
  }
  return acc;
}

let filesChanged = 0;
let totalRemoved = 0;

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    let src = fs.readFileSync(file, 'utf8');
    const before = src;
    let removedHere = 0;

    for (const cls of FORBIDDEN_CLASSES) {
      // Count occurrences, then remove every literal instance.
      const parts = src.split(cls);
      removedHere += parts.length - 1;
      src = parts.join('');
    }

    if (src !== before) {
      // Tidy: collapse the double spaces our removals can leave inside class strings.
      src = src.replace(/className=("|`)([^"`]*?)\1/g, (m, q, body) =>
        `className=${q}${body.replace(/ {2,}/g, ' ').replace(/(^ | $)/g, '')}${q}`
      );
      // A const that held ONLY a drift class is now an empty string literal — leave it.
      // (`const SERIF = "";` is harmless; `${SERIF}` still interpolates to "".)
      fs.writeFileSync(file, src, 'utf8');
      filesChanged++;
      totalRemoved += removedHere;
      console.log(`  ${file}: removed ${removedHere}`);
    }
  }
}

console.log(`\nfix-font-drift: ${totalRemoved} class instances removed across ${filesChanged} files`);
```

- [ ] **Step 2: Run the codemod**

Run: `node scripts/fix-font-drift.mjs`
Expected: prints per-file removals and a summary line, e.g. `~126 class instances removed across 23 files`. (Counts may differ slightly; the summary just must be non-zero.)

- [ ] **Step 3: Verify NO drift classes remain anywhere**

Run: `grep -rEc "Noto_Serif_Thai|DM_Sans" app components || echo "CLEAN"`
Expected: `CLEAN` (grep finds nothing and exits non-zero, so the `|| echo` fires).

- [ ] **Step 4: Type-check + build still pass (the empty consts must not break compilation)**

Run: `npx tsc --noEmit`
Expected: PASS, no errors. (`const SERIF = "";` with `${SERIF}` usage is valid TypeScript.)

- [ ] **Step 5: Run the guard test to verify it now PASSES**

Run: `npm run test:e2e -- typography.spec.ts`
Expected: PASS on all four pages — no off-system fonts render.

- [ ] **Step 6: Sanity-check the hero in the browser (no visual regression)**

Run: `npm run dev` (if not already running), open `http://localhost:3000`
Expected: hero headline, greeting, and body all render in Prompt; nothing fell back to a system serif. Confirm Thai text still looks correct.

- [ ] **Step 7: Commit**

```bash
git add scripts/fix-font-drift.mjs app components
git commit -m "fix: strip off-system font classes site-wide so text inherits Prompt"
```

---

## Task 3: Calm the hero — remove glow blobs, reduce the gradient

**Files:**
- Modify: `components/landing/Hero.tsx` (the `<section>` background + the two glow `<div>`s)
- Test: `tests/e2e/hero.spec.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/hero.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('hero has no decorative glow blobs', async ({ page }) => {
  await page.goto('/');
  // The banned pattern was <div class="... blur-3xl rounded-full ...">.
  await expect(page.locator('section .blur-3xl')).toHaveCount(0);
});
```

- [ ] **Step 2: Run it to verify it FAILS**

Run: `npm run test:e2e -- hero.spec.ts -g "glow blobs"`
Expected: FAIL — count is 2 (the two existing blur blobs).

- [ ] **Step 3: Edit `components/landing/Hero.tsx`**

Replace the section opening + the two glow blobs. Find this block (currently lines ~41-50):

```tsx
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FBF9F4 0%, #EAF8F6 48%, #FDF6E0 100%)',
      }}
    >
      {/* soft glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#14B5AB]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#E8C547]/10 blur-3xl" />

```

Replace with (calm 2-stop paper wash, blobs deleted):

```tsx
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(170deg, #FBF9F4 0%, #F4F1E9 100%)',
      }}
    >

```

- [ ] **Step 4: Run the test to verify it PASSES**

Run: `npm run test:e2e -- hero.spec.ts -g "glow blobs"`
Expected: PASS — `.blur-3xl` count is 0.

- [ ] **Step 5: Visual confirm**

Open `http://localhost:3000`.
Expected: hero background is a quiet warm wash; the doodles + avatar now carry all the visual energy. No glowing color halos.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Hero.tsx tests/e2e/hero.spec.ts
git commit -m "fix: calm hero background, remove decorative glow blobs (anti-reference)"
```

---

## Task 4: Make the rotating headline pausable

**Files:**
- Modify: `components/landing/SpecialtyBand.tsx`
- Test: `tests/e2e/hero.spec.ts` (append)

- [ ] **Step 1: Append the failing test**

Add to `tests/e2e/hero.spec.ts`:

```ts
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
  await page.waitForTimeout(3200); // longer than one 2.6s rotation
  expect(await phrase.textContent()).toBe(first);
});
```

- [ ] **Step 2: Run to verify FAIL**

Run: `npm run test:e2e -- hero.spec.ts -g "rotating band"`
Expected: FAIL — `[data-rotating-band]` does not exist yet.

- [ ] **Step 3: Replace `components/landing/SpecialtyBand.tsx` entirely**

```tsx
'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LABEL = 'ผมถนัด';
const PHRASES = [
  'อธิบาย AI เป็นภาษาคน',
  'ทำเรื่องยาก ให้เข้าใจง่าย',
  'ใช้ AI ได้จริงในงาน',
  'เล่าจากมุมคนทำธุรกิจ',
];

export function SpecialtyBand() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI(n => (n + 1) % PHRASES.length), 2600);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <section className="border-y border-[#E8E2D4] bg-[#FBF9F4]">
      <div
        data-rotating-band
        data-paused={paused ? 'true' : 'false'}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        tabIndex={0}
        aria-label="ความถนัดของผม (วางเมาส์เพื่อหยุด)"
        className="mx-auto flex max-w-[1200px] flex-col items-start gap-2 px-6 py-12 outline-none md:flex-row md:items-baseline md:gap-6 md:py-16"
      >
        <span className="text-[15px] font-medium uppercase tracking-[0.2em] text-[#00143C]/45">
          {LABEL}
        </span>
        <div className="relative h-[44px] overflow-hidden md:h-[60px]">
          {reduce ? (
            <span data-phrase className="block text-[30px] font-bold text-[#14B5AB] md:text-[44px]">
              {PHRASES[0]}
            </span>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={i}
                data-phrase
                className="block text-[30px] font-bold text-[#14B5AB] md:text-[44px]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.6, 0.2, 1] }}
              >
                {PHRASES[i]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
```

Note: the old `SERIF` const was removed (its only use is gone). The phrase styling is unchanged except the dead `${SERIF}` interpolation is dropped — Prompt is inherited.

- [ ] **Step 4: Run to verify PASS**

Run: `npm run test:e2e -- hero.spec.ts -g "rotating band"`
Expected: PASS — `data-paused` flips to `true` on hover; reduced-motion keeps a single static phrase.

- [ ] **Step 5: Commit**

```bash
git add components/landing/SpecialtyBand.tsx tests/e2e/hero.spec.ts
git commit -m "fix: pause rotating headline on hover/focus (WCAG 2.2.2)"
```

---

## Task 5: Resolve "book vs landing" — document the decision + add the bridge

The critique recommendation: keep the playful landing as the **cover**, make the handoff to the calm reading surface **honest** by previewing it, and **record the decision** so it stops reading as a rule violation.

**Files:**
- Modify: `PRODUCT.md` (add a decision note under Design Principles)
- Create: `components/landing/ChapterPeek.tsx`
- Modify: `app/page.tsx` (insert `<ChapterPeek />`)
- Test: `tests/e2e/hero.spec.ts` (append)

- [ ] **Step 1: Record the decision in `PRODUCT.md`**

In `PRODUCT.md`, immediately after Design Principle 1 ("The book test."), insert this paragraph (keep existing numbering intact):

```markdown
> **Cover vs. body (decided 2026-06-07).** The homepage is the *cover and author introduction*: warm, personal, lightly animated. The "book test" applies in full force to the interior reading surfaces (`/[level]/[topic]`), which must stay calm and editorial. These two registers are intentionally different — a book has a cover that looks nothing like its body pages. The homepage must include at least one honest preview of the reading surface (see `ChapterPeek`) so the transition from cover to body is a promise kept, not a surprise.
```

- [ ] **Step 2: Write the failing test**

Append to `tests/e2e/hero.spec.ts`:

```ts
test('homepage previews the real reading surface (cover→book bridge)', async ({ page }) => {
  await page.goto('/');
  const peek = page.locator('[data-chapter-peek]');
  await expect(peek).toBeVisible();
  // It must link into an actual chapter, not just decorate.
  await expect(peek.locator('a[href^="/foundations/"]')).toBeVisible();
});
```

- [ ] **Step 3: Run to verify FAIL**

Run: `npm run test:e2e -- hero.spec.ts -g "reading surface"`
Expected: FAIL — `[data-chapter-peek]` does not exist.

- [ ] **Step 4: Create `components/landing/ChapterPeek.tsx`**

A faithful, static preview of the interior reading surface, built from DESIGN.md tokens (card `#FFFFFF`, navy ink `#00143C`, teal link `#00958F`, yellow TL;DR mark `#FDF6E0`/`#E8C547`, Prompt body 17px/1.75). It deliberately looks like a chapter, not a landing card.

```tsx
import Link from 'next/link';

/** Cover→book bridge: shows visitors what the calm reading surface actually feels like. */
export function ChapterPeek() {
  return (
    <section className="bg-[#F4F1E9]/50 border-y border-[#E8E2D4]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-[28px] font-bold text-[#00143C] md:text-[34px]">
            อ่านแล้วเป็นยังไง
          </h2>
          <p className="text-[16px] text-[#00143C]/60">
            ข้างในไม่ใช่หน้าโฆษณา แต่เป็นหนังสือที่อ่านสบายตา นี่คือตัวอย่างจริง
          </p>
        </div>

        {/* The preview is styled exactly like an interior chapter, not a landing card. */}
        <div
          data-chapter-peek
          className="mx-auto max-w-[680px] rounded-[10px] border border-[#E8E2D4] bg-white p-8 md:p-12"
        >
          <span
            className="inline-block rounded px-3 py-1 text-xs font-bold"
            style={{ background: 'rgba(20,181,171,0.10)', color: '#00958F' }}
          >
            Level 1 · พื้นฐาน
          </span>
          <h3 className="mt-4 mb-5 text-[28px] font-bold leading-[1.3] text-[#00143C]">
            AI คืออะไร
          </h3>

          {/* TL;DR — the teacher's-mark system from DESIGN.md */}
          <div
            className="mb-6 rounded-r-md border-l-[3px] px-5 py-4"
            style={{ borderColor: '#E8C547', background: '#FDF6E0' }}
          >
            <p className="text-[15px] leading-[1.7] text-[#00143C]">
              <strong className="font-semibold">สรุปสั้น ๆ:</strong>{' '}
              AI คือโปรแกรมที่เรียนรู้รูปแบบจากตัวอย่างจำนวนมาก แล้วเอารูปแบบนั้นมาทายสิ่งที่ยังไม่เคยเห็น ไม่ใช่สมองกล ไม่ใช่เวทมนตร์
            </p>
          </div>

          <p className="mb-4 text-[17px] leading-[1.75] text-[#00143C]/85">
            ลองนึกถึงตอนที่คุณดูรูปแมวมาเป็นพันรูป พอเจอแมวตัวใหม่ที่ไม่เคยเห็น คุณก็ยังรู้ว่ามันคือแมว AI ทำงานคล้าย ๆ กัน มันไม่ได้ "เข้าใจ" แมวแบบที่เราเข้าใจ แต่มันจับรูปแบบได้เก่งมาก
          </p>
          <p className="text-[17px] leading-[1.75] text-[#00143C]/85">
            ตลอดเล่มนี้ เราจะค่อย ๆ เปิดดูว่ารูปแบบพวกนั้นถูกเก็บไว้ที่ไหน และเครื่องเอามันมาใช้ตอบคำถามเราได้ยังไง ทีละขั้น เป็นภาษาคน
          </p>

          <Link
            href="/foundations/what-is-ai"
            className="mt-8 inline-flex items-center gap-1 text-[15px] font-medium text-[#00958F] no-underline transition-all hover:gap-2"
          >
            อ่านบทเต็ม
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

Note: the `border-l-[3px]` here is the **TL;DR teacher's-mark**, which DESIGN.md explicitly sanctions ("TL;DR boxes: yellow left border 3px"). This is the one legitimate left-border in the system; the anti-pattern linter in Task 6 must not flag the mark color. (It only flags side-stripes used as card/list accents — see the linter's allowlist.)

- [ ] **Step 5: Insert into `app/page.tsx`**

Replace the file contents with:

```tsx
import { Hero } from '@/components/landing/Hero';
import { SpecialtyBand } from '@/components/landing/SpecialtyBand';
import { ContentCards } from '@/components/landing/ContentCards';
import { VisualRow } from '@/components/landing/VisualRow';
import { ChapterPeek } from '@/components/landing/ChapterPeek';
import { AboutScene } from '@/components/landing/AboutScene';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SpecialtyBand />
      <ContentCards />
      <VisualRow />
      <ChapterPeek />
      <AboutScene />
    </>
  );
}
```

- [ ] **Step 6: Run to verify PASS**

Run: `npm run test:e2e -- hero.spec.ts -g "reading surface"`
Expected: PASS — the peek is visible and links to `/foundations/what-is-ai`.

- [ ] **Step 7: Re-run the typography guard (the new component must be Prompt too)**

Run: `npm run test:e2e -- typography.spec.ts`
Expected: PASS — `ChapterPeek` uses no font classes, so it inherits Prompt.

- [ ] **Step 8: Commit**

```bash
git add PRODUCT.md components/landing/ChapterPeek.tsx app/page.tsx tests/e2e/hero.spec.ts
git commit -m "feat: add cover→book ChapterPeek bridge; document homepage register decision"
```

---

## Task 6: Project-owned anti-pattern lint (replace the missing detector)

The impeccable skill's own `detect.mjs` is broken in this install (`bundled detector not found` — its `detector/detect-antipatterns.mjs` is not shipped). That is a skill-packaging issue outside this repo. Rather than depend on it, give the project a small, owned linter that guards the specific bans relevant here so the drift cannot silently return.

**Files:**
- Create: `scripts/check-antipatterns.mjs`
- Create: `tests/unit/design/antipatterns.test.ts`
- Modify: `package.json` (add `lint:design`)

- [ ] **Step 1: Write the failing unit test**

Create `tests/unit/design/antipatterns.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { scanAntipatterns } from '../../../scripts/check-antipatterns.mjs';

describe('design anti-pattern lint', () => {
  it('codebase is clean of banned patterns', () => {
    const findings = scanAntipatterns(['app', 'components']);
    expect(findings, JSON.stringify(findings, null, 2)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it FAILS (module missing)**

Run: `npm run test -- antipatterns`
Expected: FAIL — cannot resolve `scripts/check-antipatterns.mjs`.

- [ ] **Step 3: Implement `scripts/check-antipatterns.mjs`**

```js
#!/usr/bin/env node
// Lightweight, project-owned anti-pattern lint. Guards the bans that matter for AI ภาษาคน.
import fs from 'node:fs';
import path from 'node:path';

const RULES = [
  {
    id: 'off-system-font',
    // The Noto Serif Thai / DM Sans drift this plan removed. Must never come back.
    re: /font-\['Noto_Serif_Thai'|font-\['DM_Sans'/,
    msg: "off-system font class — use Prompt (inherited); see DESIGN.md",
  },
  {
    id: 'gradient-text',
    re: /bg-clip-text|background-clip:\s*text/,
    msg: 'gradient text is banned — use a solid color, emphasize with weight/size',
  },
  {
    id: 'side-stripe-border',
    // Colored side-stripe accent thicker than 1px on cards/lists. The TL;DR mark
    // (border-l-[3px] with the yellow mark color) is the ONE allowed use, so we
    // exempt lines that also carry the mark color #E8C547.
    re: /border-[lr]-\[(?:[2-9]|\d{2,})px\]/,
    allowIf: /E8C547|--mark/,
    msg: 'side-stripe border accent is banned (TL;DR mark excepted)',
  },
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

export function scanAntipatterns(roots) {
  const findings = [];
  for (const root of roots) {
    for (const file of walk(root)) {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, idx) => {
        for (const rule of RULES) {
          if (rule.re.test(line) && !(rule.allowIf && rule.allowIf.test(line))) {
            findings.push({ rule: rule.id, file: `${file}:${idx + 1}`, msg: rule.msg });
          }
        }
      });
    }
  }
  return findings;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const findings = scanAntipatterns(['app', 'components', 'styles']);
  if (findings.length) {
    for (const f of findings) console.error(`✗ [${f.rule}] ${f.file} — ${f.msg}`);
    console.error(`\n${findings.length} anti-pattern(s) found.`);
    process.exit(1);
  }
  console.log('✓ no anti-patterns found');
}
```

- [ ] **Step 4: Run the unit test to verify it PASSES**

Run: `npm run test -- antipatterns`
Expected: PASS — Task 2 already removed all font drift; no gradient text or banned side-stripes exist (the ChapterPeek TL;DR mark is exempted via `allowIf`).

- [ ] **Step 5: Verify the CLI works standalone**

Run: `node scripts/check-antipatterns.mjs && echo "CLI OK"`
Expected: prints `✓ no anti-patterns found` then `CLI OK`.

- [ ] **Step 6: Add the npm script**

In `package.json`, add to `"scripts"` (after `"lint"`):

```json
    "lint:design": "node scripts/check-antipatterns.mjs",
```

- [ ] **Step 7: Commit**

```bash
git add scripts/check-antipatterns.mjs tests/unit/design/antipatterns.test.ts package.json
git commit -m "feat: add project anti-pattern lint (lint:design) guarding font + visual bans"
```

---

## Final verification

- [ ] **Step 1: Full unit suite**

Run: `npm run test`
Expected: all unit tests pass, including `antipatterns`.

- [ ] **Step 2: Full e2e suite**

Run: `npm run test:e2e`
Expected: `typography.spec.ts` and `hero.spec.ts` all green. Pre-existing `smoke.spec.ts` "home renders hero and three doors" may still be red (stale, out of scope — see Pre-flight). No *new* failures.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Design lint**

Run: `npm run lint:design`
Expected: `✓ no anti-patterns found`.

- [ ] **Step 5: Report**

Summarize what changed, which tests prove it, and explicitly call out the pre-existing stale `smoke.spec.ts` home test if it is still red.

---

## Self-Review (completed by plan author)

**Spec coverage** — every actionable critique finding maps to a task:
- P1 typography drift (site-wide) → Tasks 1–2 (guard test + codemod).
- P2 hero glow blobs + gradient → Task 3.
- P2 book-vs-landing strategy → Task 5 (PRODUCT.md decision + ChapterPeek bridge).
- P3 rotating-headline pause → Task 4.
- Minor: broken detector → Task 6 (project-owned replacement; skill-packaging gap noted as external).
- Minor: stale `smoke.spec.ts` home test → flagged in Pre-flight + Final verification, intentionally not changed.
- Minor: dev "unrecoverable error → full reload" → NOT included; it was a dev-only symptom with no page console errors. Out of scope by design; investigate separately if it persists.

**Placeholder scan** — no TBD/TODO/"handle edge cases"; every code step has complete code; every run step has an expected result.

**Type/identifier consistency** — `scanAntipatterns(roots)` is defined in Task 6 Step 3 and called with the same signature in Step 1 and Step 5. `data-rotating-band`, `data-paused`, `data-phrase` (Task 4) and `data-chapter-peek` (Task 5) match between component and test. `fix-font-drift.mjs` `FORBIDDEN_CLASSES` strings match the grep in Task 2 Step 3 and the linter rule in Task 6.
