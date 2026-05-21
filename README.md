# AI ภาษาคน — Website

Public reader for the AI ภาษาคน curriculum. Thai-first textbook, four levels.

- **Stack:** Next.js 15, TypeScript, Tailwind CSS, MDX
- **Content:** lives in `/content/` as MDX (chapters) and JSON (videos, glossary)
- **Spec:** `../docs/superpowers/specs/2026-05-21-ai-pasa-kon-website-design.md`

## Develop

    npm install
    npm run dev          # http://localhost:3000

## Test

    npm test             # unit tests (Vitest)
    npm run test:e2e     # smoke tests (Playwright)

## Build

    npm run build        # generates static pages + search index

## Deployment

The site is configured for Vercel. To deploy:

1. Push this repo to GitHub (private).
2. Import the GitHub repo into Vercel (free tier).
3. Vercel auto-detects Next.js. The build command (`npm run build`) generates the Pagefind index.
4. Point your domain at Vercel's DNS instructions when you have one.

## Plan B and C (next)

This is Plan A — the public reader, no auth, no DB. Auth and interactive learning ship in Plan B and C (see `../docs/superpowers/plans/`).

## Adaptations from the original plan

Notes for future maintainers (these decisions are baked into the code):

- **Node version pinned to 20.11+** via `.nvmrc` and `engines` field. Vitest 4 requires Node 20.19+; we use Vitest 2.1.9 + jsdom 25 for compatibility.
- **Tailwind 4** (CSS-first) instead of the Tailwind 3 JS config the plan was written for. Theme tokens live in `app/globals.css` inside `@theme inline` blocks.
- **PostCSS workaround** in `vitest.config.ts` (`css.postcss.plugins: []` at the top level, not inside `test:`) to stop Vitest from trying to load the Tailwind 4 PostCSS plugin during tests.
- **Frontmatter date coercion** in `lib/content/chapters.ts` — gray-matter auto-parses YAML dates into JS `Date` objects; we stringify them back to `YYYY-MM-DD` before Zod validation.
