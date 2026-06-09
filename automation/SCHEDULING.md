# Turning on the routine (GitHub Actions)

The routine lives in the repo at `.github/workflows/content-routine.yml` and runs on
GitHub's cloud cron — **08:00 and 18:00 Asia/Bangkok, every day** — with no dependency
on any local machine. Each run, Claude follows `automation/playbook.md`, builds the post,
and (when live) publishes + commits the ledger/blog back.

## Activation (one-time)

1. **Get the code onto `main`.** Scheduled workflows only fire from the default branch,
   and the site deploys from `main` (so News blogs go live there too).
   → push this branch and merge it to `main`.

2. **Add two repository secrets** (GitHub → repo → Settings → Secrets and variables → Actions → New secret):
   - `META_SYSTEM_USER_TOKEN` — the value from the workspace `.env` (the non-expiring page system-user token).
   - `CLAUDE_CODE_OAUTH_TOKEN` — generate locally with `claude setup-token`, paste the result.
     (This lets the runner write content with your Claude plan — no separate API bill.)

3. **Start in soft-launch (dry-run).** Leave it in dry mode at first:
   - It already defaults to `dry`. Optionally add a repo **variable** `CONTENT_MODE = dry`.
   - Trigger a few manual runs: Actions tab → "AI ภาษาคน content routine" → Run workflow → `dry`.
   - Review each: the caption prints in the run log; the card is uploaded as the
     **`draft-cards`** artifact. Nothing is published.

4. **Go live** once the drafts look right:
   - Set the repo variable `CONTENT_MODE = live` (or run-workflow with mode `live`).
   - From then on the 2×/day cron publishes automatically and commits the ledger + any blog.

## Kill switch
- Commit an empty file `automation/PAUSED` → the routine checks it first and stops.
- Or just disable the workflow in the Actions tab.

## What each run does
Follows `automation/playbook.md`: pick next track (rotation tools → news → knowledge) →
source + write (grounded, Thai, on-voice, no emoji) → Quality Gate (skip beats slop) →
render branded card → write companion blog for News/new-Tools → publish → record in
`ledger.json` → commit/push.

## Local fallback (only if you ever want it off GitHub)
`automation/scheduler/` also contains a macOS `launchd` job + `run.sh` that runs the same
pipeline locally (token never leaves the Mac, but the Mac must be awake). Not needed if the
GitHub routine is on.
