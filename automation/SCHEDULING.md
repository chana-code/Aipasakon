# How the routine runs

This is automated by a **scheduled routine** (the same app feature as the `lg-clickbait`
routines): a task named **`aipasakon-content-routine`** that fires **08:00 and 18:00 daily**,
follows `automation/playbook.md`, posts one post, and pushes the result to GitHub.

It runs hands-off using the Meta token in the workspace `.env` — no branch merge, no cloud
secrets. Manage it from the **Scheduled** section in the Claude sidebar.

## First-time: pre-approve the tools
Open **Scheduled → aipasakon-content-routine → Run now** once. That posts the first one and
saves the tool approvals so the 08:00/18:00 runs never pause waiting for permission.

## Each run does
Pick next track (rotation tools → news → knowledge from `automation/ledger.json`) → source +
write (grounded, Thai, on-voice, no emoji) → Quality Gate (skip beats slop) → render branded
card → write companion blog for News/new-Tools → publish to the page → record in `ledger.json`
→ commit + push.

## Pause / resume
- Pause: create the file `automation/PAUSED` (the routine checks it first and stops).
- Or disable/delete the task in the Scheduled sidebar.
- Resume: delete `automation/PAUSED`.

## Change the times or wording
Edit the task in the Scheduled sidebar, or ask Claude to update it (it lives at
`~/.claude/scheduled-tasks/aipasakon-content-routine/SKILL.md`). The behaviour rules live in
`automation/playbook.md`; edit that to tune voice, sources, or the quality bar.

## Note on News links
A News post links to its companion blog at `aipasakon.com/blog/<slug>`. The blog is committed
on publish but only goes live after the site deploys — make sure the deploy branch is updated
so the link isn't a 404.

## Local fallback (optional, not needed)
`automation/scheduler/` has a macOS `launchd` job that runs the same pipeline locally if you
ever want it off the app scheduler.
