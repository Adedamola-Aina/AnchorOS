---
description: Deploy to an environment with proper git markers for dashboard tracking
---

# Deployment Workflow

This workflow creates standardized git markers so the dashboard can automatically track what's deployed where.

## Deploy Marker Format

**All deploys MUST create a commit with this exact format:**

```
deploy(ENV): vX.X.X to FIREBASE_PROJECT

- Brief summary of what's included
```

Examples:
- `deploy(production): v1.5.5 to anchor-os`
- `deploy(staging): v1.5.8 to anchor-os-staging`
- `deploy(dev): v1.6.0 to anchor-os-dev-1c6ec`

## Deployment Steps

### 1. Build the Application
// turbo
```bash
cd /root/anchor-os && npm run build
```

### 2. Deploy to Firebase
// turbo
```bash
# For Production:
firebase deploy --only hosting --project anchor-os

# For Staging:
firebase deploy --only hosting --project anchor-os-staging

# For Dev:
firebase deploy --only hosting --project anchor-os-dev-1c6ec
```

### 3. Create Deploy Marker Commit
// turbo
```bash
# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Create marker commit (choose one):

# Production deploy:
git commit --allow-empty -m "deploy(production): v$VERSION to anchor-os"

# Staging deploy:
git commit --allow-empty -m "deploy(staging): v$VERSION to anchor-os-staging"

# Dev deploy:
git commit --allow-empty -m "deploy(dev): v$VERSION to anchor-os-dev-1c6ec"
```

### 4. Push the Marker
// turbo
```bash
git push origin master
```

## Quick Commands

### Deploy to Staging (Most Common)
```bash
npm run build && \
firebase deploy --only hosting --project anchor-os-staging && \
VERSION=$(node -p "require('./package.json').version") && \
git commit --allow-empty -m "deploy(staging): v$VERSION to anchor-os-staging" && \
git push origin master
```

### Deploy to Production
```bash
npm run build && \
firebase deploy --only hosting --project anchor-os && \
VERSION=$(node -p "require('./package.json').version") && \
git commit --allow-empty -m "deploy(production): v$VERSION to anchor-os" && \
git push origin master
```

## Dashboard Detection

The dashboard will look for these patterns:
- `deploy(production):` → Sets production version marker
- `deploy(staging):` → Sets staging version marker  
- `deploy(dev):` → Sets dev version marker

This ensures the dashboard always knows exactly what's deployed where.
