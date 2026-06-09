---

NOW: top up Facebook's scheduled queue so the page keeps posting on time on its own. The working directory is the repo root. You do NOT post immediately — you hand posts to Facebook with exact publish times, so they go live even if this machine is off.

1. `cd "/Users/admin/AI Page/website" && git pull`. If `automation/PAUSED` exists, stop and report "PAUSED".
2. Derive the page token and list what Facebook already has scheduled:
   - token: `npx tsx -e "import {loadMetaEnv,derivePageToken} from './automation/publish/pageToken'; (async()=>{const {systemUserToken,pageId}=loadMetaEnv(); console.log(await derivePageToken(systemUserToken,pageId))})()"`
   - queued: `GET https://graph.facebook.com/v21.0/<pageId>/scheduled_posts?fields=id,scheduled_publish_time&access_token=<token>`
3. Compute the next 4 slots (≈2 days): `npx tsx -e "import {nextSlots} from './automation/pipeline/slots'; console.log(nextSlots(new Date().toISOString(),4))"`.
4. For EACH of those 4 slots that is NOT already covered by a scheduled post (none within ~30 min of it):
   a. Pick the next track via `nextTrack(loadLedger('automation/ledger.json'))`.
   b. Source + write the post for that track, grounded in REAL sources (fetch the real article/README; use automation/scout/* and content/skills.json), Thai, AI ภาษาคน voice (read automation/voice-guide.md), NO emoji, declarative hook. Enforce the Quality Gate — if it can't pass, skip this slot and move on; never schedule weak content.
   c. Build `automation/runs/<YYYY-MM-DD>-<track>-<slotHHMM>/` with `card.json`, `caption.txt`, `meta.json` ({track, subject, sourceUrl?, angle?, blog?}). For News (and brand-new tools) include `blog`.
   d. Schedule it: `npx tsx automation/pipeline/finalize.ts <run-dir> --live --at=<slot ISO>`.
   e. For News, `git push origin HEAD` so the blog deploys before the slot fires.
5. Print a summary: each slot now filled (track, subject, scheduled time) and any skips. Never print the Meta token.
