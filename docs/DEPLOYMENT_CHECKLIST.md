# DEPLOYMENT CHECKLIST - Anchor OS

**Version**: 1.0  
**Last Updated**: 2026-01-31  
**Purpose**: Prevent deploying to wrong environment

---

## 🚨 CRITICAL RULES

1. **NEVER use `npm run build`** - it defaults to production mode
2. **ALWAYS use environment-specific build commands**:
   - `npm run build:dev` for development
   - `npm run build:staging` for staging
   - `npm run build:production` for production
3. **ALWAYS verify the environment banner** after deployment
4. **NEVER deploy to production without testing on staging first**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Before ANY Deployment

- [ ] All tests passing (`npm run test:run`)
- [ ] No lint errors (`npm run lint`)
- [ ] App Check site key set in environment file (`VITE_FIREBASE_APP_CHECK_SITE_KEY`)
- [ ] Functions App Check enforcement enabled for non-dev (`functions/.env.staging` and `functions/.env.production` have `ENFORCE_APPCHECK=true`)
- [ ] **Roadmap Updated**: `roadmap.json` reflects features being deployed
- [ ] Git committed with descriptive message (e.g., `deploy(staging): v1.2.0`)
- [ ] Version bumped in package.json (if applicable)

---

## 🔧 DEPLOYMENT WORKFLOWS

### Deploy to Development

```bash
# Deploy to Development
./scripts/DEPLOY_PIPELINE.sh --env=development

# ✅ Should see BLUE banner: "DEVELOPMENT ENVIRONMENT"
```

**Environment Variables Used**:
- `VITE_APP_ENV=development`
- `VITE_FIREBASE_PROJECT_ID=anchor-os-dev-1c6ec`

---

### Deploy to Staging

```bash
# Deploy to Staging
./scripts/DEPLOY_PIPELINE.sh --env=staging

# ✅ Should see YELLOW banner: "STAGING ENVIRONMENT"
```

**Environment Variables Used**:
- `VITE_APP_ENV=staging`
- `VITE_FIREBASE_PROJECT_ID=anchor-os-staging`

---

### Deploy to Production

```bash
# Deploy to Production (fast)
./scripts/DEPLOY_PIPELINE.sh --env=production --skip-e2e

# ✅ Should see NO banner
```

**Environment Variables Used**:
- `VITE_APP_ENV=production`
- `VITE_FIREBASE_PROJECT_ID=anchor-os`

---

## 🎯 ENVIRONMENT INDICATORS

### Visual Confirmation

| Environment | Banner Color | Banner Text | URL |
|-------------|--------------|-------------|-----|
| **Development** | 🔵 Blue | "DEVELOPMENT ENVIRONMENT" | https://anchor-os-dev-1c6ec.web.app |
| **Staging** | 🟡 Yellow | "STAGING ENVIRONMENT" | https://anchor-os-staging.web.app |
| **Production** | ⚪ None | (no banner) | https://anchor-os.web.app |

### Console Verification

Open browser console and check for:

```
[Firebase] Initializing for development environment (anchor-os-dev-1c6ec)...
[Firebase] Initializing for staging environment (anchor-os-staging)...
[Firebase] Initializing for production environment (anchor-os)...
```

---

## ⚠️ COMMON MISTAKES

### ❌ WRONG: Using generic build command

```bash
# This defaults to production mode!
npm run build
firebase deploy --only hosting:staging
# Result: Staging has NO banner (looks like production)
```

### ✅ CORRECT: Using environment-specific build

```bash
# This uses .env.staging
npm run build:staging
firebase deploy --only hosting:staging
# Result: Staging has YELLOW banner
```

---

### ❌ WRONG: Deploying to wrong Firebase target

```bash
npm run build:staging
firebase deploy --only hosting:production  # WRONG TARGET!
# Result: Production has staging code
```

### ✅ CORRECT: Matching build and deploy targets

```bash
npm run build:staging
firebase deploy --only hosting:staging  # CORRECT TARGET
# Result: Staging has staging code
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### Immediate Checks (< 1 minute)

1. **Open the deployed URL**
2. **Verify environment banner** (or lack thereof for production)
3. **Check browser console** for Firebase initialization message
4. **Test login** with a test account

### Functional Checks (5-10 minutes)

1. **Finance Module**:
   - [ ] Can view accounts
   - [ ] Can add transaction
   - [ ] Can transfer between accounts
   - [ ] Can pay bill
2. **Commitments Module**:
   - [ ] Can view tasks
   - [ ] Can check in task
   - [ ] Can add new task
3. **Settings**:
   - [ ] Can toggle dark mode
   - [ ] Can update profile

---

## 📝 DEPLOYMENT MARKERS

To ensure the Dashboard tracks deployments correctly, you MUST create an empty commit after deployment:

**Format**: `deploy(env): version to project`

```bash
# Example for Staging
git commit --allow-empty -m "deploy(staging): v1.5.0 to anchor-os-staging"
git push origin master

# Example for Production
git commit --allow-empty -m "deploy(production): v1.5.0 to anchor-os"
git push origin master
```

**Note**: Development deployments are tracked automatically by every commit.

---

## 🚨 ROLLBACK PROCEDURE

If deployment has critical issues:

```bash
# 1. Identify previous working version
firebase hosting:channel:list

# 2. Rollback to previous version
firebase hosting:rollback

# 3. Verify rollback
# Open the URL and test

# 4. Document the rollback
# Create a rollback marker
git commit --allow-empty -m "rollback(production): reverted to v1.4.9"
git push
```

---

## 🛠️ TROUBLESHOOTING

### Issue: Environment banner not showing

**Symptom**: Deployed to staging but no yellow banner appears

**Diagnosis**:
```bash
# Check what build command was used
cat package.json | grep "build:"

# Check if .env.staging exists
cat .env.staging
```

**Solution**:
```bash
# Rebuild with correct command
npm run build:staging

# Redeploy
firebase deploy --only hosting:staging
```

---

### Issue: Wrong Firebase project

**Symptom**: Seeing data from wrong environment

**Diagnosis**:
```bash
# Check browser console
# Look for: [Firebase] Initializing for X environment (project-id)

# Check which project is active
firebase projects:list
firebase use
```

**Solution**:
```bash
# Rebuild with correct environment
npm run build:staging

# Ensure correct Firebase project
firebase use anchor-os-staging

# Redeploy
firebase deploy --only hosting:staging
```

---

## 📊 DEPLOYMENT MATRIX

| Build Command | `.env` File Used | `VITE_APP_ENV` | Firebase Project | Deploy Target | Banner |
|---------------|------------------|----------------|------------------|---------------|--------|
| `npm run build:dev` | `.env.development` | `development` | `anchor-os-dev-1c6ec` | `hosting:dev` | 🔵 Blue |
| `npm run build:staging` | `.env.staging` | `staging` | `anchor-os-staging` | `hosting:staging` | 🟡 Yellow |
| `npm run build:production` | `.env.production` | `production` | `anchor-os` | `hosting:production` | None |
| ❌ `npm run build` | None (defaults) | `production` | `anchor-os` | ANY | ⚠️ None (WRONG!) |

---

## 🎓 TRAINING CHECKLIST

For new team members or AI agents:

- [ ] Read this deployment checklist
- [ ] Understand the 3 environments (dev, staging, production)
- [ ] Know the correct build commands for each environment
- [ ] Understand environment indicators (banners)
- [ ] Practice deploying to dev environment
- [ ] Practice deploying to staging environment
- [ ] Know the rollback procedure
- [ ] Know how to verify deployments

---

**Maintained By**: Teeto  
**Review**: Before every deployment  
**Update**: When deployment process changes
