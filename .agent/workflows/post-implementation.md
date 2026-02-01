---
description: Post-implementation checklist - update all PM dashboard data sources after completing work
---

# Post-Implementation Dashboard Update

**⚠️ MANDATORY**: Run this after EVERY implementation or deployment to keep dashboard in sync.

---

## 1. Update DEPLOYMENT_STATUS.md

// turbo
```bash
# Check actual deployed versions
firebase hosting:channel:list -P anchor-os 2>/dev/null | head -5
firebase hosting:channel:list -P anchor-os-staging 2>/dev/null | head -5
firebase hosting:channel:list -P anchor-os-dev-1c6ec 2>/dev/null | head -5
```

Update `docs/DEPLOYMENT_STATUS.md`:
- [ ] **Environment Table**: Correct version numbers and timestamps
- [ ] **Pending Changes (Dev → Staging)**: List new features ready to promote
- [ ] **Pending Changes (Staging → Production)**: List features awaiting approval
- [ ] **Deployment History**: Add new row for today's deployment

---

## 2. Verify Data Integrity

// turbo
```bash
# Check if your recent commit was picked up
curl -s http://localhost:3001/api/git/timeline | grep "$(git rev-parse --short HEAD)"
```

**If commit is missing:**
- Wait 30 seconds (dashboard poll interval)
- Run `pm2 restart anchor-dashboard` if stuck

---

## 6. Restart Dashboard

// turbo
```bash
pm2 restart anchor-dashboard
```

---

## 7. Verify Dashboard

// turbo
```bash
# Check environment parity
curl -s http://localhost:3001/api/parity | python3 -m json.tool | head -10

# Check command center
curl -s http://localhost:3001/api/command-center | python3 -m json.tool | head -20

# Check bugs
curl -s http://localhost:3001/api/bugs | python3 -m json.tool | head -20
```

---

## 8. Commit Documentation Updates

```bash
git add docs/
git commit -m "docs: Update PM dashboard data sources post-implementation"
```

---

## Quick Reference: Files to Update

| Implementation Type | Files to Update |
|---------------------|-----------------|
| **Bug Fix** | KNOWN_ISSUES.md, PROJECT_STATUS.md, CHANGELOG.md |
| **Feature** | FEATURE_SUGGESTIONS.md, ROADMAP.md, PROJECT_STATUS.md, CHANGELOG.md |
| **Deployment** | DEPLOYMENT_STATUS.md, PROJECT_STATUS.md |
| **Gap Fix** | KNOWN_ISSUES.md, PROJECT_STATUS.md, CHANGELOG.md |
| **Task** | ROADMAP.md, PROJECT_STATUS.md, CHANGELOG.md |

---

**Note**: The PM dashboard reads from these markdown files. If they're outdated, the dashboard shows stale data.
