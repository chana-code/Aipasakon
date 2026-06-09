# AI ภาษาคน — Content Automation Toolkit

Runtime-agnostic building blocks for the organic content pipeline (Plan 1).
The orchestration/scheduling brain is Plan 2.

## Modules
- `cards/` — branded card renderer (HTML/CSS → PNG, 3 themes, auto-fit Thai text).
- `ledger/` — git-backed JSON state: rotation, dedupe, knowledge rotation, tool angles.
- `publish/` — Meta page photo publisher (dry-run by default; `--live` to post).

## Render a card
    npm run card:render -- <config.json> <out.png>
`config.json` is a `CardConfig` (see `types.ts`): `{ track, kicker, hook: HookSpan[] }`.
`track` is one of tools | news | knowledge. Mark the punch phrase with `style:"mark"`,
key terms with `style:"accent"`, and set `nowrap:true` on multi-word terms that must
not split (e.g. "super computer").

## Publish (dry-run by default)
    npm run publish:post -- <card.png> <caption.txt>                            # dry run, prints intended call
    FB_PAGE_TOKEN=... npm run publish:post -- <card.png> <caption.txt> --live   # actually posts

Page is fixed to AI ภาษาคน (992580240609596). The token is read from `FB_PAGE_TOKEN`
and is never logged or committed.

## Tests
    npx vitest run tests/unit/automation
