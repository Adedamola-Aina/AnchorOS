# DEPLOYMENT STATUS

**Last Updated**: 2026-01-26 22:50 UTC

---

## 📊 CURRENT STATE

| Environment | Version | Firebase Site | URL | Health |
|-------------|---------|---------------|-----|--------|
| **Production** | v1.4.0 | anchor-os | https://anchor-os.web.app | ✅ |
| **Staging** | v1.5.0-dev | anchor-os-staging | https://anchor-os-staging.web.app | ✅ |
| **Dev** | v1.5.0-dev | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app | ✅ |

---

## ⏳ PENDING CHANGES (Dev → Staging)

No pending changes. Dev and Staging are in sync.

---

## ⏳ PENDING CHANGES (Staging → Production)

These changes are on Staging but NOT deployed to Production:

### Features
- [ ] Mobile Optimization Phase 2 (iOS keyboard, full-screen modals)
- [ ] Fabric AI Data Wiring (GAP-001 fix)
- [ ] PM Dashboard enhancements (Recently Fixed, clickable bugs)
- [ ] Single Source of Truth (ROADMAP.md consolidation)
- [ ] Intake Workflow (Rule 8 enhancement)

### Bug Fixes (5 total)
- [ ] BUG-002: Mobile keyboard covers input fields
- [ ] BUG-003: Account edit buttons hidden on mobile
- [ ] BUG-004: Settings 2FA text misaligned
- [ ] BUG-005: Settings Contact button misaligned
- [ ] GAP-001: Fabric AI Data Wiring

**Ready to deploy**: Run `npm run deploy:production` after verifying staging.

---

## 🚀 DEPLOYMENT COMMANDS

| Environment | Command | URL |
|-------------|---------|-----|
| **Dev** | `npm run deploy:dev` | https://anchor-os-dev-1c6ec.web.app |
| **Staging** | `npm run deploy:staging` | https://anchor-os-staging.web.app |
| **Production** | `npm run deploy:production` | https://anchor-os.web.app |

---

## 🔧 LOCAL DEVELOPMENT

**For Teeto Only (Tailscale)**:
- URL: https://anchor.tail2fa2e.ts.net
- Access: Private (Tailscale network)
- Monitoring: https://beszel.tail2fa2e.ts.net

**Local Dev Server**:
```bash
npm run dev
# Starts at http://localhost:5173
```

---

## 📋 DEPLOYMENT PIPELINE

### Development → Staging
```bash
# 1. Build and deploy to dev
npm run deploy:dev

# 2. Test on dev environment
# https://anchor-os-dev-1c6ec.web.app

# 3. Build and deploy to staging
npm run deploy:staging
```

### Staging → Production
```bash
# 1. Test on staging
# https://anchor-os-staging.web.app

# 2. After approval, deploy to production
npm run deploy:production

# 3. Verify production
# https://anchor-os.web.app
```

---

## 📝 DEPLOYMENT HISTORY (Last 30 Days)

| Date | Version | Env | Type | Notes |
|------|---------|-----|------|-------|
| 2026-01-26 | v1.5.0-dev | Dev | Feature | Mobile Optimization, 5 bug fixes |
| 2026-01-26 | v1.5.0-dev | Dev | Feature | PM Dashboard, Codebase Audit |
| 2026-01-24 | v1.4.0 | Staging | Hotfix | Testing |
| 2026-01-20 | v1.4.0 | Production | Release | Family Mode fixes |
| 2026-01-15 | v1.3.0 | Production | Release | Fabric AI |

---

**Maintained By**: Teeto
**Update**: After every deployment

