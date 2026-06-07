# Homepage Critique Fixes + Brand Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Make every element render in **Prompt** (kill the off-system font drift), (2) **pivot the brand** from "calm textbook" to a **landing-page design** — codified *from the actual landing page*, with the "book test" retired, (3) make the rotating headline pausable (WCAG), and (4) give the project a regression lint.

**Direction decision (founder, 2026-06-07):** The brand IS the landing page. Do **not** invent a new mood and do **not** redesign the landing's visuals — *observe what's already there* (warm, playful, hand-illustrated personal brand) and write the brand docs to match it. The "book / textbook" framing is dropped. Brand docs come **first**, before any other change.

**Architecture:** The site loads exactly one type system in `app/globals.css` → `styles/colors_and_type.css`: **Prompt** (everything) + **JetBrains Mono** (code only). Components hardcoded Tailwind arbitrary classes `font-['Noto_Serif_Thai',serif]` and `font-['DM_Sans',sans-serif]`. Because Tailwind v4 puts utilities in a cascade *layer* and `colors_and_type.css` is imported *after* it (unlayered), the unlayered `h1,h2,h3 { font-family: var(--font-display) }` rules win on headings — but there is **no** unlayered `font-family` on `p`, so the drift classes win on body text, spans, links, and buttons, rendering fonts that are not bundled (they only resolve on machines that happen to have them installed). The fix removes the drift classes so those elements inherit Prompt, guarded by a Playwright test that fails on any off-system font.

**Tech Stack:** Next.js (App Router, RSC) · Tailwind CSS v4 · framer-motion · Playwright (e2e) · Vitest (unit) · Node ESM scripts.

---

## Current status (already applied to the working tree)

- ✅ **Font codemod already run.** `scripts/fix-font-drift.mjs` exists and has been executed: 125 drift-class instances removed across 23 files; grep is clean; `tsc` has no new errors; live computed fonts are Prompt on `/` and `/about`. **Not committed.**
- ⛔ **Not yet done:** the Playwright font guard test (Task 1), the brand-doc pivot (Task 3), the rotating-headline pause (Task 4), the anti-pattern lint (Task 5).

> Because the codemod already ran, Task 1's guard test will pass immediately rather than starting red. That is fine — the test's job is permanent regression protection. If you want to *see* it go red first, `git stash` the `app/`+`components/` changes, run the test, then `git stash pop`.

---

## Scope changes from the original critique plan

- ❌ **REMOVED — "Calm the hero / remove glow blobs / reduce gradient."** Superseded by the brand pivot: the founder wants the landing kept as-is. Do not change the hero's visuals.
- ❌ **REMOVED — "Cover → book ChapterPeek bridge."** It was premised on a textbook interior the brand no longer claims. No `ChapterPeek` component.
- 🔄 **CHANGED — the strategy task is now "codify the landing-page brand"** (rewrite `PRODUCT.md` + `DESIGN.md` from the actual landing), not "document a cover-vs-book decision."

---

## File Structure

**Created:**
- `scripts/fix-font-drift.mjs` — ✅ already created/run. Idempotent codemod removing drift font classes.
- `tests/e2e/typography.spec.ts` — Playwright guard: no element on key pages may compute an off-system font.
- `tests/e2e/specialty-band.spec.ts` — Playwright assertions for the pausable rotating band.
- `scripts/check-antipatterns.mjs` — project-owned anti-pattern linter (exports `scanAntipatterns`, plus a CLI).
- `tests/unit/design/antipatterns.test.ts` — unit test that the codebase is anti-pattern clean.

**Modified:**
- 23 `.tsx` files under `app/` and `components/` — ✅ drift font classes already removed by the codemod.
- `PRODUCT.md` — rewrite to a landing-page brand register; retire the "book test".
- `DESIGN.md` — rewrite Aesthetic Direction + Mood + Product Context to match the landing; keep all color/type/spacing/motion tokens (they already match); add a Decisions Log entry.
- `components/landing/SpecialtyBand.tsx` — add pause-on-hover/focus + a testable `data-paused` attribute (non-visual).
- `package.json` — add `lint:design` script.

**Responsibility boundaries:** brand docs are the source of truth and change first; the codemod owns the mechanical site-wide font edit; the rotating-band change is a self-contained accessibility addition; the linter is the durable regression guard.

---

## Pre-flight (read once, do not skip)

- [ ] **Confirm the dev server contract.** `playwright.config.ts` sets `baseURL: http://localhost:3000`, `webServer: npm run dev`, `reuseExistingServer: true`, project `chromium`. No config change needed.
- [ ] **Known-stale test, do not "fix" here.** `tests/e2e/smoke.spec.ts` (lines 3-7) expects an *old* homepage (`/AI ไม่ยาก/`, `เริ่มจากตรงนี้`) from `components/home/`, but `app/page.tsx` renders `components/landing/`. It may already be red and is **out of scope** — leave it, note it in the final report.
- [ ] **Baseline the suite:** Run `npm run test` then `npm run test:e2e`; record current pass/fail so new breakage is distinguishable.

---

## Task 1: Typography guard test (permanent regression guard)

**Files:**
- Test: `tests/e2e/typography.spec.ts` (create)

- [ ] **Step 1: Write the test**

Create `tests/e2e/typography.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run it (expected PASS — codemod already applied)**

Run: `npm run test:e2e -- typography.spec.ts`
Expected: PASS on all four pages. (To watch it fail first, see the note in "Current status".)

- [ ] **Step 3: Commit**

(The font codemod + 23-file edit are already committed in `a3cabdf`. Only the new test file is uncommitted.)

```bash
git add tests/e2e/typography.spec.ts
git commit -m "test: add font-drift guard (no off-system fonts on key pages)"
```

---

## Task 2: Codify the landing-page brand (docs first — DO THIS BEFORE visual/UX work)

Rewrite the brand docs to describe the brand that *already exists on the landing page*. No visual changes in this task — read the components, then write what you see.

**Files:**
- Read first: `components/landing/Hero.tsx`, `SpecialtyBand.tsx`, `ContentCards.tsx`, `VisualRow.tsx`, `AboutScene.tsx`, `Doodle.tsx`, `NowPlaying.tsx`
- Modify: `PRODUCT.md`, `DESIGN.md`

- [ ] **Step 1: Observe the landing and list the actual identity**

Read the files above and **describe what is actually there now** (the landing is under active edit — e.g. the sticky note was recently removed and the lo-fi player pinned to the viewport corner, so verify, don't assume). Expected identity: warm off-white paper background, teal accent + navy ink + teacher's-yellow, a hand-drawn **line-art avatar of อ๋อง (Ong)**, floating hand-drawn **doodles** (star, flower, rainbow, paper plane, squiggle), a **lo-fi "now playing"** mini-player, gentle framer-motion fade-up / float / bob motion, Prompt type throughout. Mood: a friendly, characterful personal brand — *"a sharp business person explaining AI like a warm, slightly playful friend."* Not a textbook, not corporate SaaS. List only the elements you actually see in the current code.

- [ ] **Step 2: Rewrite `PRODUCT.md` — retire the book test**

In `PRODUCT.md` make exactly these replacements:

**(a) Replace the entire `## Product Purpose` section body with:**

```markdown
A Thai-language AI education brand fronted by a warm, personal landing experience. The brand surfaces (homepage, about, marketing pages) sell approachability and personality — the feeling that a sharp, friendly business person is going to make AI make sense for you. Learning content lives behind that front door. Success looks like a first-time visitor thinking "this feels made for me, not for engineers" and clicking in.
```

**(b) Replace `## Brand Personality` body with:**

```markdown
Warm, clear, human, and a little playful. The voice of a trusted colleague who happens to know a lot about AI — confident and approachable, never performatively technical, never dumbed down. The personality is allowed to show: hand-drawn doodles, a lo-fi soundtrack, a real human avatar. Friendly, not corporate.
```

**(c) In `## Design Principles`, DELETE principle 1 ("The book test…") entirely and replace it with:**

```markdown
1. **The friendly-guide test.** Every brand surface should feel like a warm, confident personal brand — approachable, characterful, alive. If it feels like a dry textbook or a generic corporate SaaS page, it's wrong.
```

Keep principles 2-5 but **delete principle 1's old "If it looks like a landing page, it's wrong"** wording wherever it appears, and in principle 4 keep "Thai-first."

**(d) In `## Anti-references`, DELETE these two lines** (they contradict the intentional hand-drawn warmth + soft accents the landing actually uses):

```
- Purple/blue gradients and glowing effects (every AI site)
- Glassmorphism, floating prompt boxes, generic node diagrams
```

**and replace them with:**

```markdown
- Purple/blue gradients (the "every AI site" look) — our warmth is hand-drawn, not glow-blob gradients
- Glassmorphism, floating prompt boxes, generic node diagrams
```

Leave the remaining anti-references (icon grids, AI brain illustrations, SaaS landing templates, Udemy/Coursera gamification chrome, dark-mode tech-bro) as-is — they still hold.

- [ ] **Step 3: Rewrite `DESIGN.md` — Aesthetic Direction + Mood + Product Context**

In `DESIGN.md`:

**(a)** In `## Product Context`, replace the `Project type` line:

```markdown
- **Project type:** Personal-brand landing experience for an AI education product
```

**(b)** Replace the `## Aesthetic Direction` `Direction` and `Mood` lines with:

```markdown
- **Direction:** Warm Personal-Brand Landing — a friendly, hand-illustrated personal brand. Approachable and alive, never corporate or textbook-dry.
- **Mood:** A sharp business person explaining AI like a warm, slightly playful friend at a relaxed desk. Confident, human, characterful.
```

**(c)** Append a row to the `## Decisions Log` table:

```markdown
| 2026-06-07 | Pivoted brand from calm-textbook to landing-page design | Founder decision: the brand IS the landing page. "Book test" retired in favor of the "friendly-guide test". Brand codified from the actual landing components (avatar, doodles, lo-fi widget, warm pastel). Color/type/spacing/motion tokens unchanged — they already matched. |
```

**Do NOT change** the Typography, Color, Spacing, Layout, or Motion token sections — they already describe the landing correctly (Prompt, paper/teal/navy/yellow, framer-motion fade-up). This task is positioning text only.

- [ ] **Step 4: Sanity check**

Run: `grep -niE "book test|textbook, not" PRODUCT.md DESIGN.md`
Expected: no remaining "book test" references (the `tframework`/content notes elsewhere in the repo are out of scope).

- [ ] **Step 5: Commit**

```bash
git add PRODUCT.md DESIGN.md
git commit -m "docs: pivot brand to landing-page design, retire the book test"
```

---

## Task 3: Make the rotating headline pausable (WCAG 2.2.2 — non-visual)

This adds a pause control only; it does not change how the band looks. Safe under the "don't redesign the landing" constraint.

**Files:**
- Modify: `components/landing/SpecialtyBand.tsx`
- Test: `tests/e2e/specialty-band.spec.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/specialty-band.spec.ts`:

```ts
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
  await page.waitForTimeout(3200); // > one 2.6s rotation
  expect(await phrase.textContent()).toBe(first);
});
```

- [ ] **Step 2: Run to verify FAIL**

Run: `npm run test:e2e -- specialty-band.spec.ts`
Expected: FAIL — `[data-rotating-band]` does not exist yet.

- [ ] **Step 3: Replace `components/landing/SpecialtyBand.tsx` entirely**

(Note: the `SERIF` const is already gone — removed by the font codemod. Styling/layout is unchanged; only pause logic + test hooks are added.)

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

- [ ] **Step 4: Run to verify PASS**

Run: `npm run test:e2e -- specialty-band.spec.ts`
Expected: PASS — `data-paused` flips to `true` on hover; reduced-motion stays on one static phrase.

- [ ] **Step 5: Commit**

```bash
git add components/landing/SpecialtyBand.tsx tests/e2e/specialty-band.spec.ts
git commit -m "fix: pause rotating headline on hover/focus (WCAG 2.2.2)"
```

---

## Task 4: Project-owned anti-pattern lint (regression guard)

The impeccable skill's own `detect.mjs` is broken in this install (`bundled detector not found` — a skill-packaging issue outside this repo). Give the project a small owned linter so the font drift cannot silently return. Keep its rules aligned with the **rewritten** `DESIGN.md` (Task 2) — i.e., the font guard is the firm rule; do not add visual bans the new brand allows.

**Files:**
- Create: `scripts/check-antipatterns.mjs`
- Create: `tests/unit/design/antipatterns.test.ts`
- Modify: `package.json`

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

- [ ] **Step 2: Run to verify FAIL (module missing)**

Run: `npm run test -- antipatterns`
Expected: FAIL — cannot resolve `scripts/check-antipatterns.mjs`.

- [ ] **Step 3: Implement `scripts/check-antipatterns.mjs`**

```js
#!/usr/bin/env node
// Project-owned anti-pattern lint. Firm rule: no off-system fonts (must stay Prompt).
// Plus two cross-brand bans that still hold per DESIGN.md anti-references.
import fs from 'node:fs';
import path from 'node:path';

const RULES = [
  {
    id: 'off-system-font',
    re: /font-\['Noto_Serif_Thai'|font-\['DM_Sans'/,
    msg: "off-system font class — use Prompt (inherited); see DESIGN.md",
  },
  {
    id: 'gradient-text',
    re: /bg-clip-text|background-clip:\s*text/,
    msg: 'gradient text is banned — solid color, emphasize with weight/size',
  },
  {
    id: 'ai-brain-illustration',
    re: /brain|neural-net(work)?\.(svg|png|jpg)/i,
    msg: 'AI brain / neural-net illustration is an anti-reference (DESIGN.md)',
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
      fs.readFileSync(file, 'utf8').split('\n').forEach((line, idx) => {
        for (const rule of RULES) {
          if (rule.re.test(line)) {
            findings.push({ rule: rule.id, file: `${file}:${idx + 1}`, msg: rule.msg });
          }
        }
      });
    }
  }
  return findings;
}

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

- [ ] **Step 4: Run the unit test to verify PASS**

Run: `npm run test -- antipatterns`
Expected: PASS — the font codemod already cleared the drift; no gradient-text or brain illustrations exist.

- [ ] **Step 5: Verify the CLI**

Run: `node scripts/check-antipatterns.mjs && echo "CLI OK"`
Expected: `✓ no anti-patterns found` then `CLI OK`.

- [ ] **Step 6: Add the npm script**

In `package.json` `"scripts"`, after `"lint"`, add:

```json
    "lint:design": "node scripts/check-antipatterns.mjs",
```

- [ ] **Step 7: Commit**

```bash
git add scripts/check-antipatterns.mjs tests/unit/design/antipatterns.test.ts package.json
git commit -m "feat: add project anti-pattern lint (lint:design) guarding the Prompt-only rule"
```

---

## Final verification

- [ ] **Unit suite:** `npm run test` → all pass incl. `antipatterns` (pre-existing `convert.test.ts` cast error is out of scope).
- [ ] **E2E suite:** `npm run test:e2e` → `typography.spec.ts` + `specialty-band.spec.ts` green; pre-existing `smoke.spec.ts` home test may still be red (stale, out of scope).
- [ ] **Build:** `npm run build` succeeds.
- [ ] **Design lint:** `npm run lint:design` → `✓ no anti-patterns found`.
- [ ] **Report:** summarize changes; explicitly note the stale `smoke.spec.ts` home test if still red.

---

## Self-Review (completed by plan author)

**Direction coverage:**
- "All fonts → Prompt" → Tasks 1 + the already-run codemod.
- "Brand = landing page, observe it, drop the book" → Task 2 (rewrites PRODUCT.md + DESIGN.md from the actual components; retires the book test; keeps existing tokens).
- "Brand docs first" → Task 2 precedes the only behavioral change (Task 3) and the lint (Task 4).
- WCAG rotating-pause → Task 3 (explicitly non-visual, so it respects "don't redesign the landing").
- Broken detector → Task 4 (project-owned replacement; skill-packaging gap noted as external).

**Removed vs. original plan:** the "calm hero / remove glow blobs" task and the "ChapterPeek cover→book bridge" are deleted, with a Scope-changes section explaining why (both contradicted the founder's pivot).

**Placeholder scan:** every code/doc step shows the actual content; every run step states the expected result.

**Type/identifier consistency:** `scanAntipatterns(roots)` signature matches across Task 4 steps. `data-rotating-band`, `data-paused`, `data-phrase` match between `SpecialtyBand.tsx` and `specialty-band.spec.ts`. The font-class literals match across `fix-font-drift.mjs`, the Playwright guard, and the linter rule.

**Open flag for the founder:** `/about` still contains book-era copy ("ทำไมต้องเป็นตำรา ไม่ใช่คอนเทนต์"). That's content, not covered here — worth a separate copy pass once the brand docs land.
