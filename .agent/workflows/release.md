---
description: How to track features/fixes during dev and release to staging/production
---

# Release Workflow

## During Development (Continuous)

As we complete each feature or fix:

1. **Mark done in ROADMAP.md**
   - Move item to `### ✅ Completed` section
   - Add date: `✅ Jan 26`

2. **Add to CHANGELOG.md under [Unreleased]**
   ```markdown
   ## [Unreleased]
   ### Added
   - Feature description (GAP-001)
   ### Fixed
   - Bug fix description (BUG-002)
   ```

3. **Dashboard auto-updates** from ROADMAP.md

## Ready to Deploy (Batch Release)

When ready to push a batch of changes:

### 1. Finalize Version
// turbo
```bash
# Check current version
cat package.json | grep '"version"'
```

### 2. Bump Version
```bash
# For features: minor bump (1.4.x → 1.5.0)
npm version minor --no-git-tag-version

# For bug fixes only: patch bump (1.5.0 → 1.5.1)
npm version patch --no-git-tag-version
```

### 3. Update CHANGELOG.md
Move `[Unreleased]` items to new version section:
```markdown
## [1.5.0] - 2026-01-26
### Added
- Mobile Optimization Phase 2 (v1.5.0)
- iOS keyboard avoidance (BUG-002)
### Fixed
- Fabric AI data wiring (GAP-001)
```

### 4. Deploy Pipeline
// turbo
```bash
npm run deploy:staging
```

After staging verification:
```bash
npm run deploy:prod
```

### 5. Tag Release (optional)
```bash
git add -A && git commit -m "release: v1.5.0"
git tag v1.5.0
```

## Version Meaning

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| New features | Minor (x.Y.0) | 1.4.0 → 1.5.0 |
| Bug fixes | Patch (x.y.Z) | 1.5.0 → 1.5.1 |
| Breaking changes | Major (X.0.0) | 1.5.0 → 2.0.0 |

## Files to Track

| File | Purpose | When Updated |
|------|---------|--------------|
| `docs/ROADMAP.md` | Progress tracking | After each task |
| `CHANGELOG.md` | Release notes | After each task |
| `package.json` | Version number | Before deploy |
