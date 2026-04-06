# Anchor OS — Uptime Monitoring Configuration (SRE-003)

## Overview

External uptime monitoring is configured to detect production downtime
within 10 minutes, even before user reports surface the issue.

## Monitoring Targets

| Endpoint | Probe Interval | Alert Threshold |
|----------|---------------|-----------------|
| `https://anchor-os.web.app` | 5 minutes | 2 consecutive failures |
| `https://anchor-os.web.app/api/health` | 5 minutes | 2 consecutive failures |
| `https://us-central1-anchor-os-production.cloudfunctions.net/getNotifications` | 5 minutes | 2 consecutive failures |

## Provider: UptimeRobot (Free Tier)

1. Sign in at https://uptimerobot.com
2. Click **Add New Monitor** for each target above
3. Settings per monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: e.g. `Anchor OS Web`, `Anchor OS Functions`
   - **URL**: see targets above
   - **Monitoring Interval**: 5 minutes
   - **Alert Contact**: configure email + Slack webhook (see below)

## Alert Channels

### Email Alert
- Add `alerts@anchor-os.com` (or the owner's email) as a contact in UptimeRobot
- Trigger: 2 consecutive failures (10 min window)

### Slack Alert
```
Webhook URL: [configure in your Slack workspace → Incoming Webhooks]
Channel: #ops-alerts
```

## Cloud Function Health Probe

The `getNotifications` function is used as the Functions health probe since
it requires authentication; unauthenticated calls return 403 (expected).
Monitor for non-5xx responses.

For a dedicated health endpoint, add this to `functions/src/index.ts`:

```typescript
// SRE-003: Health probe endpoint (public, no auth required)
export const health = onRequest({ cors: false }, (_req, res) => {
    res.status(200).json({ status: 'ok', ts: Date.now() });
});
```

## Freshping Alternative

If using Freshping (https://freshping.io):
1. Add each URL under **Checks** → **Add Check**
2. Interval: 1 minute (free tier supports this)
3. Alert policy: notify after 1 failure

## Status Page (Optional)

Both UptimeRobot and Freshping provide public status pages.
Configure at: `https://status.anchor-os.web.app`

## Runbook: Downtime Response

1. **Alert fires** → check Firebase Console → Hosting / Functions logs
2. **Hosting down** → `npm run deploy:production` to re-deploy
3. **Functions down** → check Cloud Functions logs for error rate
4. **Database issue** → check Firestore in Firebase Console
5. Post incident summary to #ops-alerts within 24 hours

## References
- SRE-003 (Roadmap)
- Firebase Status: https://status.firebase.google.com
- UptimeRobot docs: https://uptimerobot.com/help/

---

## Firestore Quota Monitoring (SRE-004)

### Overview

Scheduled Cloud Function (`checkFirestoreQuota`) runs every 6 hours to
evaluate Firestore usage against configurable thresholds.

### Alert Thresholds

| Metric | Warning (80%) | Critical (95%) |
|--------|--------------|----------------|
| Daily reads | 40,000 | 47,500 |
| Daily writes | 16,000 | 19,000 |
| Daily deletes | 16,000 | 19,000 |
| Storage | 858 MB | 1,020 MB |

### Metrics Storage

- Snapshots: `artifacts/anchor-os/quota_metrics/{timestamp}`
- Alerts: `artifacts/anchor-os/quota_alerts/{timestamp}`

### Runbook: Quota Alert Response

1. **Warning fires** → Review usage patterns in Firebase Console
2. **Critical fires** → Identify top-consuming queries, consider index optimization
3. **Reads spike** → Check for missing composite indexes or unscoped queries
4. **Writes spike** → Look for runaway batch operations or trigger loops
5. Post root cause to #ops-alerts within 24 hours

---

## Cold Start Profiling & Keep-Warm (SRE-005)

### Keep-Warm Scheduler

`warmUpFunctions` runs every 5 minutes to prevent cold starts on critical
paths. Cloud Functions v2 shares containers across the codebase, so warming
one function warms all.

### Warm Targets

| Function | Reason |
|----------|--------|
| health | Public endpoint, used by uptime probes |
| getNotifications | High-traffic user callable |
| processReminders | Runs every 1 minute, must be warm |
| logAuditEvent | Security-critical, low latency required |
| getSharedAccountsWithMe | Family mode, frequent access |

### Cold Start Metrics

- Stored in structured logs with label `coldstart.profiling: true`
- Query in Cloud Logging: `jsonPayload."coldstart.profiling" = true`
- Warm-up log: `artifacts/anchor-os/warmup_log/{timestamp}`
