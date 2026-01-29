# DEPLOYMENT STATUS

**Last Updated**: 2026-01-29 11:00 UTC

---

## 📊 CURRENT STATE

| Environment | Version | Firebase Site | URL | Health |
|-------------|---------|---------------|-----|--------|
| **Production** | v1.5.0 | anchor-os | https://anchor-os.web.app | ✅ |
| **Staging** | v1.5.0 | anchor-os-staging | https://anchor-os-staging.web.app | ✅ |
| **Dev** | v1.5.0 | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app | ✅ |

**Code Parity**: All environments deployed from commit `c189779` (Jan 28, 2026)

---

## 🚀 LATEST DEPLOYMENT (Jan 28, 2026 ~14:30 UTC)

### Deployed to ALL ENVIRONMENTS (Dev, Staging, Production):
- ✅ **Full Code Parity** achieved across all environments
- ✅ **ARCH-001 Fix**: 6 files refactored under 200-line limit
- ✅ **REG-001 Fix**: XSS E2E test selectors updated for new UI flow
- ✅ **BUG-007 Fix**: Modal inputs on mobile now work
- ✅ **UX Design System**: Color tokens, OLED mode, skeletons, buttons
- ✅ **Mobile Gestures**: Pull-to-refresh, swipe actions, haptic feedback
- ✅ **Dependency Updates**: React 19.2.4, Vitest 4.0.18
- ✅ **434 unit tests passing**

---

## ⏳ PENDING CHANGES (Dev → Staging)

No pending changes. Dev and Staging are in sync.

---

## ⏳ PENDING CHANGES (Staging → Production)

No pending changes. All environments have code parity.

**Next release will include**: Any new work after Jan 28, 2026.

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

