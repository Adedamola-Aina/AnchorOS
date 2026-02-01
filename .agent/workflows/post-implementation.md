---
description: Post-implementation checklist - update all PM dashboard data sources after completing work
---

# Post-Implementation Dashboard Update

**⚠️ MANDATORY**: Run this after EVERY implementation or deployment to keep dashboard in sync.

---

## 1. Verify Deployment & Git Marker

// turbo
```bash
# Check if your features are detected in the Dashboard Timeline
curl -s http://localhost:3001/api/git/timeline | grep "$(git rev-parse --short HEAD)"
```

**If missing:**
- Ensure you committed with `feat:`, `fix:`, or `deploy:` prefix.
- Wait 30 seconds for dashboard polling.

---

## 2. Restart Dashboard (to force sync)

// turbo
```bash
pm2 restart anchor-dashboard
```

---

## 3. Verify Dashboard Status

// turbo
```bash
# Check environment parity (Git Source of Truth)
curl -s http://localhost:3001/api/parity-git | python3 -m json.tool

# Check Command Center Unified View
curl -s http://localhost:3001/api/command-center | python3 -m json.tool | head -20
```

---

## 4. Final Sanity Check

- [ ] Does the **Environment Parity** widget show your feature in the correct column?
- [ ] Does the **Roadmap** show your feature as "Completed" (green)?
- [ ] (If deployed) Is the version correct in **Deployment Status**?

**Note**: The Dashboard now relies entirely on Git History and `roadmap.json`. No markdown file updates required.
