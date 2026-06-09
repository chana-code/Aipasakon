# How posting works (prepare + schedule)

Posts are **not** created at the moment they go live. Instead, a routine prepares posts in
advance and hands them to **Facebook's own scheduler** with exact publish times. Facebook
publishes each one on time **on its servers** — so the post appears at 08:00 / 18:00 even if
your laptop is off, asleep, or the app is closed. Timing is always accurate.

## The routine
A scheduled task **`aipasakon-content-routine`** runs once a day (whenever your Mac is on).
Each run it keeps **Facebook's scheduled queue filled ~2 days ahead** (the next four 08:00 /
18:00 Asia/Bangkok slots): for any upcoming slot not already queued, it writes a fresh post
and schedules it with Facebook for that slot.

Because Facebook holds the queue, your laptop only needs to be on **occasionally** (every day
or two) to top it up — the actual posts still fire exactly on time. If you're away longer than
the buffer, it simply refills and resumes when you're back.

## First-time: pre-approve the tools
Open **Scheduled → aipasakon-content-routine → Run now** once. It fills the next couple of
days of slots and saves the tool approvals so future runs never pause for permission.

## See / change what's scheduled
- Scheduled posts live in your Facebook Page → Planner/Scheduled posts — you can edit or delete
  any of them there before they publish.
- The routine records each scheduled post in `automation/ledger.json` (status `scheduled`).

## Pause / resume
- Pause: create the file `automation/PAUSED` (the routine checks it first). Already-scheduled
  posts will still publish — delete them in Facebook's Planner if you want to stop those too.
- Or disable the task in the Scheduled sidebar.

## Tune behaviour
Edit `automation/playbook.md` (voice, sources, quality bar, slot buffer). The slot times are in
`automation/pipeline/slots.ts` (08:00 & 18:00 Bangkok).

## Note on News links
A News post links to its blog at `aipasakon.com/blog/<slug>`. The routine pushes the blog when
it schedules the post; make sure the deploy branch updates so the blog is live before the slot
fires (otherwise the link 404s briefly).
