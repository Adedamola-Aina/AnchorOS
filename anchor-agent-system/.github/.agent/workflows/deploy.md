# Deploy Workflow
# REDIRECTED: Full deploy checklist in docs/DEPLOYMENT_CHECKLIST.md
# DevOps agent: .anchor/agents/09-devops.md

## Quick Reference

```bash
# Development
npm run deploy:dev
# Verify: BLUE banner

# Staging  
npm run deploy:staging
# Verify: YELLOW banner

# Production (Tech Lead approval required)
npm run deploy:production
# Verify: no banner
```

## Gates Required Before Production
1. `npm run test -- --run` — 100% pass
2. `npm run lint` — zero errors
3. `npm run lighthouse` — no budget regression
4. Staging verified first
5. Tech Lead (Role 12) signed off
6. Dashboard: `get_environment_parity` shows staging == expected

Full checklist: `docs/DEPLOYMENT_CHECKLIST.md`
