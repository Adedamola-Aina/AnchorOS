---
name: deploy
description: Deploy to any environment. Enforces the verification checklist.
---

# Deploy Workflow

## Pre-Deploy Checklist
- [ ] All unit tests passing: `npm run test -- --run`
- [ ] Lint clean: `npm run lint`
- [ ] E2E tests passing (if applicable): `npm run test:e2e`
- [ ] Dashboard parity checked: `curl -s http://localhost:3001/api/parity`
- [ ] No TypeScript errors: `npx tsc --noEmit`

## Deploy Commands
```bash
# Development
npm run deploy:dev

# Staging
npm run deploy:staging

# Production — REQUIRES EXPLICIT APPROVAL
npm run deploy:production
```

## Post-Deploy
```bash
# Record deployment in git
git commit --allow-empty -m "deploy(ENV): vVERSION @ $(git rev-parse --short HEAD)"

# Verify dashboard detected it
curl -s http://localhost:3001/api/parity
```

## Production Verification Checklist
Before approving production deploy, verify on staging:
1. Dev has blue "DEVELOPMENT ENVIRONMENT" banner
2. Staging has yellow "STAGING ENVIRONMENT" banner  
3. Finance page transaction list renders correctly
4. Dark mode has no white edges on cards
5. Mobile swipe actions work
6. Commitments task boxes are compact
7. Empty states don't cause excessive scrolling
