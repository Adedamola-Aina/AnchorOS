---
description: Deploy to an environment with proper git markers for dashboard tracking
---

# Deployment Workflow

## Dev Environment (Automatic)
Dev deployments are **automatic** - every commit is considered deployed to dev.

**Dev URLs:**
- Local: http://localhost:5173/
- Dev Tailscale: https://anchor.tail2fa2e.ts.net/
- Dev Firebase: https://anchor-os-dev-1c6ec.web.app/

**No marker commit needed** - the dashboard automatically tracks commits as "dev".

---

## Staging & Production (Explicit Markers Required)

### Deploy Marker Format
```
deploy(ENV): vX.X.X to PROJECT
```

### Deploy to Staging
```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting --project anchor-os-staging

# 3. Create marker
VERSION=$(node -p "require('./package.json').version")
git commit --allow-empty -m "deploy(staging): v$VERSION to anchor-os-staging"
git push origin master
```

### Deploy to Production
```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting --project anchor-os

# 3. Create marker
VERSION=$(node -p "require('./package.json').version")
git commit --allow-empty -m "deploy(production): v$VERSION to anchor-os"
git push origin master
```

---

## Quick Reference

| Environment | Marker Required | Detection |
|-------------|----------------|-----------|
| Local/Dev | ❌ No | Every commit = deployed |
| Staging | ✅ Yes | `deploy(staging): vX.X.X` |
| Production | ✅ Yes | `deploy(production): vX.X.X` |

## When User Says "Deploy to Staging/Production"
1. Build the app
2. Run firebase deploy to the target project
3. Create the marker commit
4. Push to master
