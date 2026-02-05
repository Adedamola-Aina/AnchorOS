---
name: anchor-dashboard-integration
description: Deep integration with Anchor OS Internal PM Dashboard. Load when working with bugs, features, kanban, environment parity, or project tracking.
---

# Anchor OS Dashboard Integration

## Overview

The **Internal PM Dashboard** is the **SINGLE SOURCE OF TRUTH** for:
- Bug tracking and prioritization
- Feature requests and backlog
- Kanban board state
- Environment parity (Dev/Staging/Production)
- Git history and deployments
- Velocity metrics
- Documentation health

**Dashboard URLs:**
- **Browser**: https://anchor.tail2fa2e.ts.net:3443/
- **Local API**: http://localhost:3001

**ALWAYS check the dashboard before making decisions about bugs, features, or project state.**

---

## Dashboard API Reference

Base URL: `http://localhost:3001` (local) or `https://anchor.tail2fa2e.ts.net:3443` (remote)

### Core Data Endpoints

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/command-center` | **MASTER ENDPOINT** - All project data | Starting any task |
| `GET /api/summary` | Quick project summary | Status checks |
| `GET /api/alerts` | Proactive alerts & warnings | Before starting work |

### Bug & Issue Tracking

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/bugs` | All bugs from KNOWN_ISSUES.md | User reports bug |
| `GET /api/bugs/priority-suggestions` | AI-suggested bug priorities | Triaging bugs |
| `GET /api/git/search/:bugId` | Find commits related to bug | Checking if fixed |

### Feature & Roadmap

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/roadmap` | Roadmap from ROADMAP.md | Planning work |
| `GET /api/features` | Feature backlog | User requests feature |
| `GET /api/board` | Kanban board state | Task management |
| `GET /api/kanban-enhanced` | Merged bugs + features board | Full task view |

### Environment & Deployment

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/parity` | Feature parity across envs | Checking deployment state |
| `GET /api/environment` | Full environment status | Pre-deployment |
| `GET /api/git/commits` | Recent commits | Checking changes |
| `GET /api/git/timeline` | Deployment timeline | Release planning |

### Health & Velocity

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/health` | File health, code quality | Code review |
| `GET /api/velocity/stats` | Development velocity | Sprint planning |
| `GET /api/docs` | Documentation freshness | Doc updates |
| `GET /api/dependencies` | Package health | Security checks |

### Actions (POST)

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `POST /api/velocity/record` | Record task completion | Task done |
| `POST /api/archive/run` | Archive old items | Cleanup |
| `POST /api/docs/sync` | Force doc sync | After major changes |

---

## Decision Workflows

### When User Reports a Bug

```
1. FETCH /api/bugs
   → Check if bug already exists in KNOWN_ISSUES.md
   → Check for similar descriptions

2. FETCH /api/git/search/{keywords}
   → Check if already fixed in commits
   → Check if related commits exist

3. IF DUPLICATE:
   → Tell user: "This appears to be tracked as [BUG-XXX]"
   → Show current status and any related commits

4. IF NEW BUG:
   → Add to docs/KNOWN_ISSUES.md
   → Assign priority based on /api/bugs/priority-suggestions patterns
   → Report: "Logged as [BUG-XXX] with priority [P0/P1/P2]"
```

### When User Requests a Feature

```
1. FETCH /api/features
   → Check if feature already in FEATURE_SUGGESTIONS.md
   → Check for similar requests

2. FETCH /api/roadmap
   → Check if already planned or in progress

3. IF DUPLICATE:
   → Tell user: "This is already tracked in [location]"
   → Show current status

4. IF NEW FEATURE:
   → Add to docs/FEATURE_SUGGESTIONS.md
   → Determine priority based on impact
   → Report: "Logged as feature request in backlog"
```

### When Checking Environment Parity

```
1. FETCH /api/parity
   → Get feature deployment status across Dev/Staging/Production

2. REPORT FORMAT:
   Feature              Dev    Staging    Production
   ─────────────────────────────────────────────────
   Family Mode Fix       ✅      ✅          ❌
   Mobile Navigation     ✅      ❌          ❌

3. HIGHLIGHT:
   → Features in Dev but not Staging (ready for staging deploy)
   → Features in Staging but not Production (ready for prod deploy)
   → Discrepancies that need attention
```

### When Task is Completed

```
1. POST /api/velocity/record
   → Record completion for velocity tracking

2. UPDATE docs/ROADMAP.md
   → Move item to completed
   → Mark with ✅

3. UPDATE docs/KNOWN_ISSUES.md (if bug fix)
   → Move to "Recently Fixed"

4. FETCH /api/parity
   → Report what environments now have the fix

5. SUGGEST:
   → "Ready to deploy to staging" if only in dev
   → "Ready to deploy to production" if in staging
```

---

## Response Formats

### Bug Report Response
```
📋 Bug Analysis:

**Duplicate Check**: [Found existing / No duplicates]
**Related Commits**: [X commits found / None]
**Existing Bug ID**: [BUG-XXX or N/A]

**Action Taken**:
- [Added to KNOWN_ISSUES.md as BUG-XXX]
- [Priority: P1 (High)]
- [Added to Kanban backlog]

**Environment Status**:
- Dev: [Not deployed]
- Staging: [Not deployed]
- Production: [Affected]
```

### Feature Request Response
```
📋 Feature Analysis:

**Duplicate Check**: [Found existing / No duplicates]
**Roadmap Status**: [Planned / Not planned]

**Action Taken**:
- [Added to FEATURE_SUGGESTIONS.md]
- [Category: Finance / UX / etc.]
- [Priority: Medium]

**Dependencies**:
- [Requires X to be completed first]
```

### Environment Parity Response
```
📊 Environment Parity Report:

| Feature | Dev | Staging | Prod |
|---------|-----|---------|------|
| Fix A   | ✅  | ✅      | ✅   |
| Fix B   | ✅  | ✅      | ❌   |
| Fix C   | ✅  | ❌      | ❌   |

**Ready for Staging**: Fix C
**Ready for Production**: Fix B
**Action Needed**: Deploy Fix B to production
```

---

## Integration Rules

### ALWAYS Do:
1. ✅ Check dashboard before claiming something is/isn't tracked
2. ✅ Use dashboard data to prevent duplicates
3. ✅ Update dashboard docs when completing work
4. ✅ Report environment parity when relevant
5. ✅ Record velocity data for completed tasks

### NEVER Do:
1. ❌ Assume bug/feature doesn't exist without checking
2. ❌ Complete work without updating tracking docs
3. ❌ Ignore environment parity in deployment decisions
4. ❌ Make up bug IDs - use the actual IDs from dashboard

---

## Quick Commands

For the agent to use internally:

```bash
# Check full project state
curl http://localhost:3001/api/command-center

# Check for existing bug
curl http://localhost:3001/api/bugs | jq '.parsed'

# Check feature backlog
curl http://localhost:3001/api/features

# Check environment parity
curl http://localhost:3001/api/parity

# Check recent commits for keyword
curl http://localhost:3001/api/git/search/family-mode

# Record task completion
curl -X POST http://localhost:3001/api/velocity/record \
  -H "Content-Type: application/json" \
  -d '{"itemId": "TASK-123", "completedDate": "2026-01-29"}'
```
