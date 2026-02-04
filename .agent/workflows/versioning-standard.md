---
description: Standard versioning and deploy marker protocol for environment tracking
---

# Versioning & Deploy Marker Standard

## Version Philosophy

| Environment | Format | Example | Meaning |
|-------------|--------|---------|---------|
| **Production** | `vX.Y.Z` | `v1.5.12` | Stable, tested, live |
| **Staging** | `vX.Y.Z+1` or `vX.Y.Z+1-dev` | `v1.5.13-dev` | Testing, pre-production |
| **Development** | `vX.Y.Z+1-dev` | `v1.5.13-dev` | Latest with untested work |

## Critical Rules

1. **Production version is SACRED** - Never bump production version until actually deployed
2. **Dev/Staging get version bumps** - When new features are deployed to dev/staging, bump package.json
3. **Markers are MANDATORY** - Every deploy must have a marker commit

## Deploy Marker Format

```bash
# Staging deployment marker
git commit --allow-empty -m "deploy(staging): vX.Y.Z-dev to anchor-os-staging

[List of features/fixes deployed]"

# Production deployment marker
git commit --allow-empty -m "deploy(production): vX.Y.Z to anchor-os

[Release notes]"

# Dev deployment marker (optional, for significant deploys)
git commit --allow-empty -m "deploy(dev): vX.Y.Z-dev to anchor-os-dev-1c6ec

[Description]"
```

## Workflow

### When deploying to Dev/Staging (new work):
```bash
# 1. Bump version for new work
npm version X.Y.Z-dev --no-git-tag-version

# 2. Build
npm run build:staging

# 3. Deploy
firebase deploy --only hosting:staging -P anchor-os-staging

# 4. Create marker commit (so dashboard can track)
git add package.json package-lock.json
git commit -m "deploy(staging): vX.Y.Z-dev to anchor-os-staging

[Features deployed]"
```

### When promoting to Production:
```bash
# 1. Remove -dev suffix, finalize version
npm version X.Y.Z --no-git-tag-version

# 2. Build production
npm run build:prod

# 3. Deploy
firebase deploy --only hosting:production -P anchor-os

# 4. Create marker
git commit -m "deploy(production): vX.Y.Z to anchor-os

[Release notes]"

# 5. Tag for release
git tag vX.Y.Z
```

## Dashboard Detection

The dashboard (`envChecker.js`) detects deploy status by:
1. Looking for `deploy(environment): vX.X.X` patterns in commit messages
2. Using version strings to mark deployment boundaries
3. Showing `devOnly` count for items not yet in staging/production

## Example State

After deploying WEB-003 to staging but NOT production:
```
Production: v1.5.12  (stable)
Staging:    v1.5.13-dev (testing animations)
Dev:        v1.5.13-dev (latest)
```
