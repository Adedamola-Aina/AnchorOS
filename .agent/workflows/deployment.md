---
description: Deployment workflow - MUST follow dev → staging → production pipeline
---

# Deployment Workflow

## Pre-Deployment Checklist

Before deploying, ensure:
1. All tests pass: `npm test`
2. Build succeeds: `npm run build`
3. CHANGELOG.md has `[Unreleased]` section with all changes
4. KNOWN_ISSUES.md is up to date

---

## Deploy to Staging

### 1. Bump Version
```bash
# Check current version
cat package.json | grep '"version"'

# Bump to appropriate version
npm version minor --no-git-tag-version  # for features
npm version patch --no-git-tag-version  # for bug fixes only
```

### 2. Update CHANGELOG.md
Move `[Unreleased]` to versioned section:
```markdown
## [1.5.0] - 2026-01-26
### Added
- Mobile Optimization Phase 2
...
```

### 3. Deploy
// turbo
```bash
npm run deploy:staging
```

### 4. Update DEPLOYMENT_STATUS.md
After successful deploy:
- Update Staging version in "CURRENT STATE" table
- Move items from "PENDING CHANGES (Dev → Staging)" to "PENDING CHANGES (Staging → Production)"
- Add entry to "DEPLOYMENT HISTORY"

### 5. Verify
```bash
# Open staging URL
open https://anchor-os-staging.web.app
```

---

## Deploy to Production

### 1. Verify Staging
Confirm all features work on staging before deploying.

### 2. Deploy
// turbo
```bash
npm run deploy:production
```

### 3. Update DEPLOYMENT_STATUS.md
After successful deploy:
- Update Production version in "CURRENT STATE" table
- Clear "PENDING CHANGES (Staging → Production)" section
- Add entry to "DEPLOYMENT HISTORY"

### 4. Verify
```bash
open https://anchor-os.web.app
```

### 5. Tag Release
```bash
git add -A && git commit -m "release: v1.5.0"
git tag v1.5.0
git push origin v1.5.0
```

---

## Dashboard Auto-Update

The PM Dashboard reads from:
- `docs/DEPLOYMENT_STATUS.md` for environment parity
- `docs/ROADMAP.md` for kanban and progress
- `docs/KNOWN_ISSUES.md` for bugs

All updates are reflected automatically on refresh.

---

## Files Updated During Deploy

| File | When Updated | Purpose |
|------|--------------|---------|
| `package.json` | Before deploy | Version bump |
| `CHANGELOG.md` | Before deploy | Release notes |
| `docs/DEPLOYMENT_STATUS.md` | After deploy | Parity tracking |
| `docs/KNOWN_ISSUES.md` | After deploy | Mark bugs as deployed |
