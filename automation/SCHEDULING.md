# Turning on the 2×/day autopilot

Everything to *produce and publish* a post is built and proven. The only remaining
choice is **where the twice-a-day timer runs**, because that touches your Meta token.
Three options, simplest/safest first.

## Option A — Local Mac timer (recommended; token never leaves your machine)
A `launchd` job runs the pipeline on your Mac at 08:00 and 18:00. The token stays in
the local `.env` — nothing sensitive goes to any cloud.
- **Pros:** most secure (token never leaves the Mac); zero extra accounts.
- **Cons:** your Mac must be awake at those times.
- **Enable:**
  1. `chmod +x automation/scheduler/run.sh`
  2. Test once, safely: `automation/scheduler/run.sh` (dry-run — drafts, doesn't post)
  3. After the soft-launch looks good, add `live` to the plist args, then:
     `cp automation/scheduler/com.aipasakon.content.plist ~/Library/LaunchAgents/ && launchctl load ~/Library/LaunchAgents/com.aipasakon.content.plist`
  4. Pause anytime: `touch automation/PAUSED` (the playbook checks it first).

## Option B — GitHub Actions (cloud cron; runs even when the Mac is off)
A scheduled workflow runs the pipeline in the cloud.
- **Pros:** always-on; no machine dependency.
- **Cons:** requires putting the **Meta page token into GitHub repo secrets** (a security
  decision only you should make) and a Playwright step for card rendering. Writing would
  use the Claude API (needs an Anthropic API key as a secret).
- Not set up yet — needs your OK to place the token in cloud secrets.

## Option C — Always-on server / cloud VM
Same as A but on a machine that's always on. Most robust, most setup.

---

## Soft launch (do this first, any option)
The playbook starts in **soft-launch**: the first ~5 runs draft the card + caption and
send them to you instead of publishing. Once you're happy with the live-in-the-wild
quality, switch to live (Option A step 3, or the equivalent).

## Kill switch
`touch automation/PAUSED` halts all runs immediately. Delete the file to resume.

## What each run does
Follows `automation/playbook.md`: pick next track (rotation: tools → news → knowledge) →
source + write (grounded, Thai, on-voice, no emoji) → Quality Gate (skip beats slop) →
render branded card → write companion blog for News/new-Tools → publish → record in
`ledger.json` → commit.
