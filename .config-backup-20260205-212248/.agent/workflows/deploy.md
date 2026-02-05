---
description: How to deploy Anchor OS to Dev, Staging, or Production
---

# Deployment Workflow

## ⚠️ CRITICAL: NEVER USE THESE COMMANDS ⚠️

```bash
# ❌ NEVER DO THIS - deploys to ALL hosting targets
firebase deploy --only hosting

# ❌ NEVER DO THIS - same problem
firebase deploy --only hosting --project anchor-os-staging

# ❌ NEVER DO THIS - bypasses all checks
npm run build && firebase deploy
```

## ✅ ALWAYS USE THIS

Run from the project root:

```bash
./DEPLOY_PIPELINE.sh --env=<environment>
```

The pipeline handles:
1. ✅ Linting
2. ✅ Testing (Unit + E2E for staging/prod)
3. ✅ Building with CORRECT environment variables
4. ✅ Deploying to ONLY the correct hosting target
5. ✅ Dashboard sync

## Environments

| Environment | Flag | URL | Checks | Banner |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `development` | `anchor-os-dev-1c6ec.web.app` | Lint, Unit Test | BLUE |
| **Staging** | `staging` | `anchor-os-staging.web.app` | Lint, Unit Test, E2E | YELLOW |
| **Production** | `production` | `anchor-os.web.app` | Lint, Unit Test, E2E | NONE |

## Examples

**Deploy to Staging:**
```bash
./DEPLOY_PIPELINE.sh --env=staging
```

**Deploy to Production (requires explicit approval):**
```bash
./DEPLOY_PIPELINE.sh --env=production
```

## Production Deploy Safeguards

1. `.firebaserc` is configured so each project only has its OWN hosting target
2. The pipeline script validates environment before deploying
3. **Production deploys require explicit `--env=production` flag**
4. Never skip tests for production

## If You MUST Deploy Manually (Emergency Only)

```bash
# 1. Set correct environment
cp .env.staging .env

# 2. Build
npm run build

# 3. Deploy to ONLY the staging target
firebase deploy --only hosting:staging --project anchor-os-staging
```

**For production, ALWAYS get user approval first.**
