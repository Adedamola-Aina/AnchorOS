---
name: anchor-dashboard-integration
description: Deep integration with Anchor OS Internal PM Dashboard. Load when working with bugs, features, kanban, environment parity, or project tracking.
---

# Anchor OS Dashboard Integration

## Overview

The **Internal PM Dashboard** is the **SINGLE SOURCE OF TRUTH** for:
- Bug tracking and prioritization (from git commit history)
- Feature requests and backlog (from git + `roadmap.json`)
- Kanban board state (auto-derived from deployment status)
- Environment parity (Dev/Staging/Production via git ancestry)
- Git history and deployments
- Velocity metrics and cycle time
- Documentation health

**All data is git-automated. No manual markdown files to maintain.**

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
| `GET /api/summary` | Quick project summary (git-automated) | Status checks |
| `GET /api/alerts` | Proactive alerts & warnings | Before starting work |

### Bug & Issue Tracking (Git-Automated)

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/git/bugs` | All bugs from git (BUG-XXX, REG-XXX) | User reports bug |
| `GET /api/bugs/priority-suggestions` | Priority suggestions | Triaging bugs |
| `GET /api/git/search/:bugId` | Find commits related to bug | Checking if fixed |

### Feature & Roadmap (Git-Automated)

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/git/roadmap` | Roadmap with auto-detection from git | Planning work |
| `GET /api/git/features` | All features from git history | User requests feature |
| `GET /api/git/kanban` | Kanban board from git | Task management |
| `GET /api/git/backlog` | Feature backlog from git | Backlog review |
| `GET /api/git/changelog` | Auto-generated changelog | Release notes |

### Environment & Deployment

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/parity` | Feature parity via git ancestry | Checking deployment |
| `GET /api/environment` | Full environment status | Pre-deployment |
| `GET /api/git/commits` | Recent commits | Checking changes |
| `GET /api/git/timeline` | Deployment timeline | Release planning |

### Health & Velocity

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `GET /api/health` | File health, code quality | Code review |
| `GET /api/velocity/stats` | Development velocity & cycle time | Sprint planning |
| `GET /api/progress` | Roadmap progress (git-automated) | Progress tracking |
| `GET /api/dependencies` | Package health | Security checks |

### Actions (POST)

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `POST /api/velocity/record` | Record task completion | Task done |
| `POST /api/velocity/auto-detect` | Backfill velocity from git | After major deploys |
| `POST /api/refresh` | Clear all caches | After manual changes |
| `POST /api/intake` | Submit new item to roadmap.json | New items |

---

## Decision Workflows

### When User Reports a Bug

```
1. FETCH /api/git/bugs → Check if already tracked
2. FETCH /api/git/search/{keywords} → Check if fixed in commits
3. IF DUPLICATE → Tell user: "Tracked as [BUG-XXX]"
4. IF NEW → Commit with: fix: BUG-XXX description
```

### When User Requests a Feature

```
1. FETCH /api/git/features → Check if already tracked
2. FETCH /api/git/roadmap → Check if planned in roadmap.json
3. IF DUPLICATE → Tell user: "Already tracked"
4. IF NEW → Add to roadmap.json via POST /api/intake
```

### When Task is Completed

```
1. GIT COMMIT with correct prefix (fix:/feat:/etc)
2. POST /api/velocity/record (optional)
3. FETCH /api/parity → Report deployment status
4. SUGGEST → "Ready to deploy to [env]"
```

---

## Quick Commands

```bash
curl http://localhost:3001/api/command-center     # Full project state
curl http://localhost:3001/api/git/bugs           # All bugs
curl http://localhost:3001/api/git/features       # All features
curl http://localhost:3001/api/parity             # Environment parity
curl http://localhost:3001/api/git/search/keyword # Search commits
curl -X POST http://localhost:3001/api/refresh    # Clear caches
```
