# DEPLOYMENT STATUS

**Last Updated**: 2026-01-29 22:17 UTC

---

## 📊 CURRENT STATE

| Environment | Version | Firebase Site | URL | Health |
|-------------|---------|---------------|-----|--------|
| **Production** | v1.5.4 | anchor-os | https://anchor-os.web.app | ✅ Stable |
| **Staging** | v1.5.4 | anchor-os-staging | https://anchor-os-staging.web.app | ✅ Verified |
| **Dev** | v1.5.4 | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app | ✅ Verified |

**Code Flow**: Dev → Staging → Production (with approval)

---

## ⚠️ INCIDENT RESOLVED

**Date**: 2026-01-29  
**Issue**: Untested code was deployed to production without approval  
**Resolution**: Production rolled back to stable commit `c189779`  
**Action Taken**: Staging/Dev redeployed with correct build modes (with environment banners)

---

## 🧪 BUGS IN DEV/STAGING (Testing Required)

The following bug fixes are deployed to Dev/Staging for testing:

| Bug ID | Description | Priority | Status | Last Deployed |
|--------|-------------|----------|--------|---------------|
| BUG-008 | Transaction History UI Inconsistency | HIGH | **FIXED** (Dev/Staging) | 2026-01-29 |
| REG-002 | Virtual List Stacking (Mobile) | CRITICAL | **FIXED** (Dev/Staging) | 2026-01-29 |
| BUG-009 | Dark Mode White Edge on Cards | HIGH | **FIXED** | 2026-01-29 |
| BUG-010 | Transaction List Excessive Spacing | HIGH | **FIXED** | 2026-01-29 |
| BUG-011 | Empty Transaction List Scroll Issue | HIGH | Testing in Dev/Staging | 2026-01-29 |
| BUG-012 | Commitments Task Box Too Large | LOW | Testing in Dev/Staging | 2026-01-29 |
| BUG-013 | Redundant Edit/Delete Icons on Mobile | LOW | Testing in Dev/Staging | 2026-01-29 |
| BUG-014 | Transaction List Layout (Edge-to-Edge) | LOW | v2 deployed - Testing | 2026-01-29 |

### Verification Environments
| Environment | URLs |
|-------------|------|
| **Dev (Local)** | http://100.112.129.21:5173 • https://anchor.tail2fa2e.ts.net |
| **Dev (Firebase)** | https://anchor-os-dev-1c6ec.web.app |
| **Staging** | https://anchor-os-staging.web.app |

---

## ⏳ PENDING CHANGES (Dev → Staging)
- [ ] **ARCH-007**: Optimistic Updates (Recurring Transactions)
- [ ] **ARCH-012**: Performance Benchmarking Infrastructure
- [ ] **ARCH-014**: Bundle Analysis Tools
- [ ] **ARCH-015**: Architecture Decision Records
- [ ] **ARCH-016**: Telemetry Instrumentation
- [ ] **BRAND-002**: App Icon Polish

## ⏳ PENDING CHANGES (Staging → Production)
- [ ] **UX-017**: Independent Transaction Scroll
- [ ] **BUG-008**: Transaction History UI Inconsistency
- [ ] **BUG-009**: Dark Mode White Edge
- [ ] **BUG-010**: Transaction List Spacing
- [ ] **BUG-011**: Empty List Scroll
- [ ] **BUG-012**: Commitment Task Box Sizing
- [ ] **BUG-013**: Mobile Icon Redundancy
- [ ] **BUG-014**: Transaction List Layout
- [ ] **FIN-003**: Recurring Transactions

---

## ✅ VERIFICATION CHECKLIST (Before Staging → Prod)

- [ ] Dev environment has blue "DEVELOPMENT ENVIRONMENT" banner
- [ ] Staging environment has yellow "STAGING ENVIRONMENT" banner
- [ ] Manual test Finance page - Check transaction list appearance
- [ ] Manual test Account Detail - Verify transaction history matches Finance page
- [ ] Manual test Dark Mode - Check for white edges on cards
- [ ] Manual test Mobile - Verify swipe actions work, no edit/delete icons visible
- [ ] Manual test Commitments - Check task box sizing
- [ ] Manual test Empty States - Verify no excessive scrolling
- [ ] Manual test Scroll Chaining - Verify page doesn't scroll when transaction list reaches bottom
- [ ] All E2E tests pass on Staging
- [ ] Get explicit approval before production deployment

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
| 2026-01-29 | v1.5.3-ui-fix | Dev/Staging | Feature | UX-017: Scrollable List, Fixed BUG-008/010/011/012/013/014 |
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

