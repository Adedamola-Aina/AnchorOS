---
name: deployment
description: Deploy to any environment. Use when deploying to dev, staging, or production. Enforces verification checklist.
---

# Deployment Workflow

## Pipeline (mandatory order)
Dev → Staging → [VERIFY on staging] → [GET EXPLICIT APPROVAL] → Production

## Commands
- Development: `npm run deploy:dev`
- Staging: `npm run deploy:staging`
- Production: `npm run deploy:production` ⚠️ REQUIRES EXPLICIT APPROVAL

**NEVER** run raw `firebase deploy`. Anti-patterns #1, #11, #12.

## Pre-Deploy Checklist
- [ ] `npm run test -- --run` passes
- [ ] `npm run lint` clean
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run test:e2e` passes (for staging/production)
- [ ] Dashboard parity: `curl -s http://localhost:3001/api/parity`

## Staging Verification (before production)
1. Dev: blue "DEVELOPMENT ENVIRONMENT" banner
2. Staging: yellow "STAGING ENVIRONMENT" banner
3. Finance page transaction list renders correctly
4. Dark mode: no white edges on cards
5. Mobile swipe actions work
6. Commitments task boxes compact
7. Empty states: no excessive scrolling

## Post-Deploy
```bash
git commit --allow-empty -m "deploy(ENV): vVERSION @ $(git rev-parse --short HEAD)"
curl -s http://localhost:3001/api/parity
```
