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

## 2. Update KNOWN_ISSUES.md

For bugs/gaps that were fixed:
- [ ] Add "(FIXED YYYY-MM-DD)" to title
- [ ] Change status to "✅ FIXED"
- [ ] Remove Assigned/Target fields

---

## 3. Update FEATURE_SUGGESTIONS.md

For features that were completed:
- [ ] Add "✅ IMPLEMENTED" to title
- [ ] Update Team Voting Template table

---

## 4. Update ROADMAP.md

For completed items:
- [ ] Change `[ ]` to `[x]`
- [ ] Add strike-through to table rows

---

## 5. Update PROJECT_STATUS.md

- [ ] Update "Last Updated" timestamp
- [ ] Move completed items to "Recently Completed" section
- [ ] Clear "In Progress" if work completed

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
