---
description: How to manually trigger a sync of the Internal PM Dashboard
---

# Dashboard Manual Sync

**Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ (browser) | http://localhost:3001 (API)

The dashboard automatically updates after every deployment via `DEPLOY_PIPELINE.sh`. However, if you need to force an update (e.g., after a manual documentation change or if the pipeline failed to sync), follow this workflow.

## Command

Run from any terminal with access to localhost:

```bash
curl -X POST http://localhost:3001/api/refresh
```

## How It Works

1.  Connects to the Dashboard API running on port 3001.
2.  Triggers a git fetch/pull to ensure parity.
3.  Re-scans all markdown files in `docs/`.
4.  Re-analyzes git history for the timeline.

## Verification

Check the status endpoint to confirm the update:

```bash
curl http://localhost:3001/api/status
```

You should see the latest commit hash and timestamp.
