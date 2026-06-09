---

NOW: complete exactly ONE content run following the playbook above. The working directory is the repo root.

1. Determine the next track from `automation/ledger.json` using `nextTrack` in `automation/ledger/ledger.ts`. You can compute it with:
   `npx tsx -e "import {loadLedger,nextTrack} from './automation/ledger/ledger'; console.log(nextTrack(loadLedger('automation/ledger.json')))"`
2. Source + write the post for that track, grounded in REAL sources (fetch the actual article / repo README; use the helpers in `automation/scout/*` and `content/skills.json`). Write in Thai, in the AI ภาษาคน voice (read `automation/voice-guide.md`), with NO emoji and a declarative hook. Enforce the Quality Gate — if nothing can pass, SKIP and print the reason. Do not post weak content.
3. Build a run dir `automation/runs/<YYYY-MM-DD>-<track>/` containing `card.json` (a CardConfig), `caption.txt`, and `meta.json` (`{ track, subject, sourceUrl?, angle?, blog? }` — include `blog` only for News or a brand-new tool).
4. Read the environment variable `RUN_MODE`. If it equals `live`, run `npx tsx automation/pipeline/finalize.ts <run-dir> --live`. Otherwise run `npx tsx automation/pipeline/finalize.ts <run-dir>` (dry-run; does not publish).
5. Print a one-line summary: track, subject, and whether it posted / was a dry-run / was skipped (with the reason). Never print the Meta token.
