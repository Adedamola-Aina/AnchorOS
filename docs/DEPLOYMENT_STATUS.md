# DEPLOYMENT STATUS

**Last Updated**: 2026-01-29 15:00 UTC

---

## ⚠️ DEPLOYMENT INCIDENT

**Date**: 2026-01-29 ~14:35 UTC  
**Issue**: Untested bug fixes (BUG-008 through BUG-013) were deployed to Production without approval  
**Action Required**: Verify fixes work in production or rollback if issues found  
**Status**: Monitoring

---

## 📊 CURRENT STATE

| Environment | Version | Firebase Site | URL | Health |
|-------------|---------|---------------|-----|--------|
| **Production** | v1.5.2-untested | anchor-os | https://anchor-os.web.app | ⚠️ Verify |
| **Staging** | v1.5.2-untested | anchor-os-staging | https://anchor-os-staging.web.app | ⚠️ Verify |
| **Dev** | v1.5.2-untested | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app | ⚠️ Verify |

**Code Parity**: All environments at commit `a232e4d` (untested UI changes)

---

## 🔴 BUGS IN PRODUCTION (Untested)

The following bug fixes were deployed without proper E2E/manual testing:

| Bug ID | Description | Status |
|--------|-------------|--------|
| BUG-008 | Transaction History UI Inconsistency | Code deployed, needs verification |
| BUG-009 | Dark Mode White Edge on Cards | Code deployed, needs verification |
| BUG-010 | Transaction List Excessive Spacing | Code deployed, needs verification |
| BUG-011 | Empty Transaction List Scroll Issue | Code deployed, needs verification |
| BUG-012 | Commitments Task Box Too Large | Code deployed, needs verification |
| BUG-013 | Redundant Edit/Delete Icons on Mobile | Code deployed, needs verification |

---

## ⏳ PENDING VERIFICATION

- [ ] **Manual test Finance page** - Check transaction list appearance
- [ ] **Manual test Account Detail** - Verify transaction history matches Finance page
- [ ] **Manual test Dark Mode** - Check for white edges on cards
- [ ] **Manual test Mobile** - Verify swipe actions work, no edit/delete icons
- [ ] **Manual test Commitments** - Check task box sizing
- [ ] **Manual test Empty States** - Verify no excessive scrolling

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
| 2026-01-28 | v1.5.0 | **Production** | Release | Full code parity, all UX improvements |
| 2026-01-28 | v1.5.0 | Staging | Feature | UX improvements, Mobile gestures, OLED toggle |
| 2026-01-28 | v1.5.0 | Dev | Feature | UX improvements, Mobile gestures, OLED toggle |
| 2026-01-28 | v1.5.0-dev | Local | Bugfix | BUG-007: Modal inputs fix, Dashboard enhancements |
| 2026-01-27 | v1.5.0-dev | Dev | Feature | ARCH-001-003: 200-line rule, Error boundaries, Tests |
| 2026-01-26 | v1.5.0-dev | Dev | Feature | Mobile Optimization, 5 bug fixes |
| 2026-01-26 | v1.5.0-dev | Dev | Feature | PM Dashboard, Codebase Audit |
| 2026-01-24 | v1.4.0 | Staging | Hotfix | Testing |
| 2026-01-20 | v1.4.0 | Production | Release | Family Mode fixes |
| 2026-01-15 | v1.3.0 | Production | Release | Fabric AI |

---

**Maintained By**: Teeto
**Update**: After every deployment

