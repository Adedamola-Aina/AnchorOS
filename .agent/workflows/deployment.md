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

## 🔧 Automated Deployment Commands

### Deploy to DEV
// turbo
```bash
firebase use anchor-os-dev-1c6ec
npm run build:dev
firebase deploy --only hosting,firestore:rules
node scripts/seed-users.cjs dev
```

### Deploy to STAGING  
// turbo
```bash
firebase use anchor-os-staging
npm run build:staging
firebase deploy --only hosting,firestore:rules
node scripts/seed-users.cjs staging
```

### Deploy to PRODUCTION (requires staging verification first)
```bash
firebase use anchor-os
npm run build:production
firebase deploy --only hosting,firestore:rules
```

## Rules (MUST BE FOLLOWED)

### 1. Production is READ-ONLY for Development
- ❌ NO fixes deployed directly to production
- ❌ NO testing in production
- ❌ NO experimental features in production
- ✅ Production only receives verified, tested code

### 2. Development Flow
All changes MUST follow this order:

1. **Develop locally**
   ```bash
   npm run dev -- --host 0.0.0.0  # Local development server
   ```

2. **Test locally**
   - Run unit tests: `npm run test`
   - Run E2E tests: `npm run test:e2e`
   - Manual verification at http://localhost:5173

3. **Deploy to DEV** (uses `build:dev` mode)
   // turbo
   ```bash
   firebase use anchor-os-dev-1c6ec
   npm run build:dev
   firebase deploy --only hosting,firestore:rules
   node scripts/seed-users.cjs dev
   ```

4. **Deploy to STAGING** (uses `build:staging` mode)
   // turbo
   ```bash
   firebase use anchor-os-staging
   npm run build:staging
   firebase deploy --only hosting,firestore:rules
   node scripts/seed-users.cjs staging
   ```

5. **Verify in STAGING**
   - URL: https://anchor-os-staging.web.app
   - Test with: `owner@anchor.local` / `password123`
   - Manual smoke testing required

6. **Deploy to PRODUCTION** (uses `build:production` mode)
   ```bash
   firebase use anchor-os
   npm run build:production
   firebase deploy --only hosting,firestore:rules
   ```

### 3. Emergency Hotfixes
Even emergency fixes MUST go through staging first:
1. Create fix locally
2. Quick test locally
3. Deploy to staging (automated)
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

## Environment Configuration

### Firebase Project IDs
| Environment | Project ID | URL | Build Command |
|-------------|------------|-----|---------------|
| Production | `anchor-os` | https://anchor-os.web.app | `npm run build:production` |
| Staging | `anchor-os-staging` | https://anchor-os-staging.web.app | `npm run build:staging` |
| Development | `anchor-os-dev-1c6ec` | https://anchor-os-dev-1c6ec.web.app | `npm run build:dev` |
| Local | N/A | http://localhost:5173 | `npm run dev` |

### Test Credentials (DEV & STAGING only)
| Email | Password | Role |
|-------|----------|------|
| `owner@anchor.local` | `password123` | Family Owner |
| `member@anchor.local` | `password123` | Family Member |

### Environment Variables
Each environment uses its own `.env` file:
- `.env.development` → Dev Firebase project
- `.env.staging` → Staging Firebase project  
- `.env.production` → Production Firebase project

**CRITICAL:** Always use the correct build command for each environment:
- `npm run build:dev` for dev
- `npm run build:staging` for staging
- `npm run build:production` for production

Using the wrong build command will connect to the WRONG Firebase project!

## Switching Environments
```bash
# Check current project
firebase use

# Switch to environment
firebase use anchor-os           # Production
firebase use anchor-os-staging   # Staging
firebase use anchor-os-dev-1c6ec # Development
```

## Post-Deployment Verification

After deploying to any environment, verify:
1. ✅ Login works with test credentials
2. ✅ All core features are functional (Dashboard, Finance, Commitments, Settings)
3. ✅ URL shows correct path (logout should redirect to `/`)
4. ✅ Console shows correct Firebase project connection

---

**Remember: Production is for USERS, not for TESTING.**
**Dev and Staging should always mirror production features and behaviors.**
