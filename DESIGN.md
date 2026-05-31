# Design System — AI ภาษาคน

## Product Context
- **What this is:** Thai-language AI textbook website -- a 4-level curriculum from zero AI knowledge to reading research papers
- **Who it's for:** Thai working professionals who want to understand AI without drowning in hype or jargon
- **Space/industry:** AI education, single-author knowledge publishing
- **Project type:** Editorial reading experience (textbook, not course platform)
- **Memorable thing:** "คนนี้อธิบาย AI แบบที่อ่านรู้เรื่อง" -- warmth and approachability. Every design decision serves this.

## Aesthetic Direction
- **Direction:** Thai Editorial -- the look of a well-edited Thai nonfiction book, not a SaaS landing page
- **Decoration level:** Intentional -- subtle texture through typography and spacing, not ornament
- **Mood:** A trusted senior colleague explaining hard ideas at a desk after work. Calm authority with human warmth.
- **Anti-patterns:** No purple gradients, no 3-column icon grids, no centered-everything, no decorative blobs, no AI brain illustrations, no glassmorphism, no floating prompt boxes, no generic node diagrams

## Typography
- **Display/Hero (Thai):** Noto Serif Thai (weight 600-700) -- serif Thai at display size signals "book, not blog." Key visual differentiator from every other Thai AI content site.
- **Display/Hero (Latin):** Source Serif 4 (weight 600) -- pairs with Noto Serif Thai for mixed-language headlines
- **Body (Thai):** IBM Plex Sans Thai Looped (weight 400) -- the "looped" variant reads more naturally for long-form Thai prose than the unlooped version. Warmer and more human.
- **Body (Latin):** DM Sans (weight 400) -- cleaner than Inter at small sizes, pairs well with Plex
- **UI/Labels:** Same as body
- **Data/Tables:** DM Sans with tabular-nums feature
- **Code:** JetBrains Mono (weight 400-500) -- more personality than IBM Plex Mono, better ligatures
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;500;600;700&family=IBM+Plex+Sans+Thai+Looped:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  ```
- **Scale:**
  - Display: 52px / line-height 1.15 / letter-spacing -0.01em
  - H1: 36px / line-height 1.25
  - H2: 28px / line-height 1.3
  - H3: 21px / line-height 1.4
  - H4: 17px / line-height 1.5
  - Body: 17px / line-height 1.75 (Thai needs generous line-height)
  - UI: 15px / line-height 1.5
  - Small/Meta: 13px / line-height 1.5
  - Mono: 14.5px / line-height 1.7
- **Font stacks (CSS):**
  ```css
  --font-display: "Noto Serif Thai", "Source Serif 4", Georgia, serif;
  --font-body: "IBM Plex Sans Thai Looped", "DM Sans", system-ui, sans-serif;
  --font-latin-display: "Source Serif 4", "Noto Serif Thai", Georgia, serif;
  --font-latin-body: "DM Sans", "IBM Plex Sans Thai Looped", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  ```

## Color
- **Approach:** Restrained -- teal as the single accent, used with discipline like a teacher's underline
- **Paper (page bg):** #FBF9F4 -- warm off-white, easier on the eye for long prose
- **Paper 2 (sunken/sidebar):** #F4F1E9
- **Card (reading surface):** #FFFFFF
- **Navy 900 (primary ink):** #00143C -- body text, headings
- **Navy 800:** #0A2150
- **Navy 700 (secondary text):** #1E3463
- **Navy 600 (muted/captions):** #5B6577 -- warmer than the previous #3E5482
- **Navy 500 (disabled):** #8A8678
- **Teal 700 (link hover):** #006B7A
- **Teal 600 (link, active):** #00958F
- **Teal 500 (primary accent):** #14B5AB -- buttons, level-1 markers, active states only
- **Teal 100:** #D6F3F0
- **Teal 50 (subtle wash):** #EAF8F6
- **Mark (teacher's yellow):** #E8C547 -- TL;DR left border, key-term underlines
- **Mark BG:** #FDF6E0 -- TL;DR box fill
- **Mark Border:** #E8D9A0
- **Level colors:** L1 teal #14B5AB, L2 blue #2D7CD6, L3 burnt orange #B45A1A, L4 plum #7A3FA0
- **Status:** stub #94896E, drafting #C18A2E, reviewed #14B5AB, stable #2A7A3F
- **Semantic aliases:**
  ```css
  --fg-1: var(--navy-900);
  --fg-2: var(--navy-700);
  --fg-3: var(--navy-600);
  --fg-link: var(--teal-600);
  --fg-link-hover: var(--teal-700);
  --bg-page: var(--paper);
  --bg-sunk: var(--paper-2);
  --bg-card: var(--card);
  --accent: var(--teal-500);
  --mark: #E8C547;
  --mark-bg: #FDF6E0;
  ```
- **Dark mode:** Deferred. Token structure supports it (see preview page for proof-of-concept).

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable -- slightly more generous than current
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96)
- **Key change:** Increase vertical rhythm between homepage sections. Hero top padding: 120px (was 96px). Section gaps: 72px minimum.

## Layout
- **Approach:** Grid-disciplined with editorial touches
- **Grid:** Asymmetric hero (60/40), 3-column doors, 4-column curriculum spine
- **Max content width:** 1180px (page), 680px (prose column)
- **Nav:** 48px height (reduced from 56px), frosted glass background, faded border
- **Hero heading:** 52px (reduced from 64px) -- Thai text wraps to 2 lines instead of 5-6
- **Chapter pages:** Sidebar ToC (220px, sticky) + reading column layout. ToC moves to top on mobile.
- **Card differentiation:**
  - Door cards: level-colored 3px left edge, hover lifts border color
  - Curriculum cards: level-colored left edge + number badge
  - Latest reviewed cards: clean, teal top-border on hover
- **Border radius:** sm:4px, md:6px, lg:10px, pill:999px -- restrained, not bubbly

## Motion
- **Approach:** Minimal-functional
- **Easing:** cubic-bezier(.2, .6, .2, 1) -- calm, no bounces
- **Duration:** fast: 120ms, default: 180ms
- **Transitions:** color, border-color, background only. No entrance animations, no scroll-driven effects.

## Teacher's Mark System
The yellow `--mark` color is the key design innovation. Use it for:
- TL;DR boxes: yellow left border (3px) + yellow-tinted background
- Key terms: yellow bottom-border (2px) on first occurrence in a chapter
- Pull-quotes or important callouts (sparingly)

Do NOT use mark for: buttons, nav elements, level indicators, or any interactive state. The mark is a reading aid, not a UI color.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-22 | Initial design system created | Created by /design-consultation based on competitive research (Stripe Docs, Brilliant.org, Tailwind, gwern.net) + cross-model design review (Codex + Claude subagent). Both outside voices independently converged on Noto Serif Thai. |
| 2026-05-22 | Serif Thai for display only, sans for body | Thai serif body text is risky for zero-knowledge readers. Serif at display size gives "book" feel without sacrificing readability. |
| 2026-05-22 | Yellow mark system over teal-everything | Teal was overused and lost meaning. Yellow mark creates a distinct "teacher's annotation" visual layer. |
| 2026-05-22 | 52px hero heading (down from 64px) | Thai glyphs are taller than Latin. 64px caused 5-6 line wraps. 52px wraps to 2 clean lines. |
| 2026-05-22 | Sidebar ToC for chapter pages | Inline ToC broke reading flow. Sticky sidebar follows Stripe/Tailwind docs pattern -- proven for long-form content. |
