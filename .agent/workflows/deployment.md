---
description: Deployment workflow - MUST follow dev → staging → production pipeline
---

# 🚨 CRITICAL: Deployment Protocol

**NEVER deploy untested changes directly to production.**

## Environment Hierarchy

```
DEV (development) → STAGING → PRODUCTION
     ↓                ↓           ↓
   Testing         Verification   Live Users
   Experiments     Final QA       Stable Only
```

## Rules (MUST BE FOLLOWED)

### 1. Production is READ-ONLY for Development
- ❌ NO fixes deployed directly to production
- ❌ NO testing in production
- ❌ NO experimental features in production
- ✅ Production only receives verified, tested code

### 2. Development Flow
All changes MUST follow this order:

1. **Develop in DEV environment**
   ```bash
   npm run dev  # Local development
   firebase use anchor-os-dev  # If using dev project
   ```

2. **Test in DEV**
   - Run unit tests: `npm run test`
   - Run E2E tests: `npm run test:e2e`
   - Manual verification

3. **Deploy to STAGING**
   ```bash
   firebase use anchor-os-staging
   npm run build
   firebase deploy --only hosting,functions
   ```

4. **Verify in STAGING**
   - URL: https://anchor-os-staging.web.app
   - Full E2E test suite must pass
   - Manual smoke testing required

5. **Deploy to PRODUCTION (only after staging verification)**
   ```bash
   firebase use anchor-os
   npm run build
   firebase deploy --only hosting,functions
   ```
   - URL: https://anchor-os.web.app

### 3. Emergency Hotfixes
Even emergency fixes MUST go through staging first:
1. Create fix in dev
2. Quick test locally
3. Deploy to staging
4. Verify fix works
5. Only then deploy to production

### 4. Pre-Production Checklist
Before ANY production deployment:
- [ ] All unit tests pass locally
- [ ] Build completes without errors
- [ ] Changes deployed and tested in staging
- [ ] E2E smoke tests pass on staging
- [ ] No debug/diagnostic code included
- [ ] No console.log statements (except errors)
- [ ] No hardcoded test data or IDs

## Firebase Project IDs
| Environment | Project ID | URL |
|-------------|------------|-----|
| Production | `anchor-os` | https://anchor-os.web.app |
| Staging | `anchor-os-staging` | https://anchor-os-staging.web.app |
| Development | `anchor-os-dev-1c6ec` | https://anchor-os-dev-1c6ec.web.app |

## Switching Environments
```bash
# Check current project
firebase use

# Switch to environment
firebase use anchor-os           # Production
firebase use anchor-os-staging   # Staging
firebase use anchor-os-dev       # Development
```

---

**Remember: Production is for USERS, not for TESTING.**
