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
