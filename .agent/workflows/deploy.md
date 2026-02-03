---
description: How to deploy Anchor OS to Dev, Staging, or Production
---

# Deployment Workflow

**STOP**: Do NOT use `firebase deploy` manually. Do NOT use `scripts/deploy.sh`.
**ALWAYS** use the pipeline script. It handles linting, testing, building (with correct environment variables), and targeting.

## Command

Run from the project root:

```bash
./DEPLOY_PIPELINE.sh --env=<environment>
```

## Environments

| Environment | Flag | URL | Checks | Banner |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `development` | `anchor-os-dev-1c6ec.web.app` | Lint, Unit Test | BLUE |
| **Staging** | `staging` | `anchor-os-staging.web.app` | Lint, Unit Test, E2E | YELLOW |
| **Production** | `production` | `anchor-os.web.app` | Lint, Unit Test, E2E | NONE |

## Automatic Dashboard Sync

After a successful deployment, the pipeline automatically calls `POST /api/refresh` on the Internal Dashboard (localhost:3001) to update the Environment Parity and Deployment Timeline. You do not need to do this manually.

## Examples

**Deploy to Staging:**
```bash
./DEPLOY_PIPELINE.sh --env=staging
```

**Deploy to Production (fast):**
```bash
./DEPLOY_PIPELINE.sh --env=production --skip-e2e
```
