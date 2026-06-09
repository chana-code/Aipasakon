#!/bin/zsh
# AI ภาษาคน — one autonomous content run.
#   ./run.sh        -> dry-run (safe: drafts to a run dir, does NOT publish)
#   ./run.sh live   -> publish with finalize --live, then push so any blog deploys
#
# Requires: the `claude` CLI installed + logged in, and the machine awake at run time.
# The Meta token stays local (read from ../.env by the pipeline) and never leaves the Mac.
set -e
cd "/Users/admin/AI Page/website"

MODE="${1:-dry}"
if [ "$MODE" = "live" ]; then
  GOAL="run finalize with --live and then 'git push' so a News blog deploys"
else
  GOAL="run finalize WITHOUT --live (dry-run); do not publish"
fi

# Headless Claude executes the playbook for one run.
# Note: -p runs non-interactively; --dangerously-skip-permissions lets it run the
# pipeline commands unattended. Review the playbook before enabling live mode.
claude -p "Follow automation/playbook.md exactly and complete ONE run now. \
Pick the next track from automation/ledger.json, source and write the post \
(grounded in real sources, Thai, on-voice, no emoji), build the run dir files, \
then ${GOAL}. Enforce the Quality Gate: if nothing can pass, skip and log the reason." \
  --dangerously-skip-permissions

echo "[aipasakon] run finished ($MODE): $(date)"
