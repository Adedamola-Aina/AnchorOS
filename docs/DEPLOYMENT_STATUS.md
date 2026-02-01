# DEPLOYMENT STATUS

**Last Updated**: 2026-02-01 05:35 UTC

---

## 📊 CURRENT STATE

| Environment | Version | Firebase Site | URL | Health | Last Deployed |
|-------------|---------|---------------|-----|--------|---------------|
| **Production** | v1.5.9 | anchor-os | https://anchor-os.web.app | ✅ Stable | 2026-01-30 08:19 |
| **Staging** | v1.5.9 | anchor-os-staging | https://anchor-os-staging.web.app | ✅ Deployed | 2026-01-31 06:24 |
| **Dev** | v1.6.0 | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app | ✅ Deployed | 2026-02-01 05:32 |

**Code Flow**: Dev → Staging → Production (with approval)

---

## ⏳ PENDING CHANGES (Dev → Staging)

### v1.6.0 Multi-Team Sprint (Ready for Staging)

#### GAP-002: Design System Color Token Fragmentation ✅
- Migrated `indigo-*` to `primary-*` tokens across 4 components
- Files: `CategoryIcon.tsx`, `RecurringTransactionsList.tsx`, `RecurringOptions.tsx`, `NotificationSettings.tsx`

#### GAP-003: Navigation Race Condition ✅
- Replaced flaky `setTimeout(100)` with `requestAnimationFrame` + 1300ms delay
- Files: `CommitmentsView.tsx`

#### GAP-004: Command Palette Recent Actions ✅
- Implemented localStorage persistence with auto-deduplication
- "Recent" section appears at top when no query entered
- Files: `CommandPalette.tsx`

#### TASK-002: Habit Streaks & Gamification ✅
- Already implemented (discovered during sprint)
- No code changes needed, updated documentation

---

## ⏳ PENDING CHANGES (Staging → Production)

_Production and Staging are at parity (v1.5.9)_

**Note**: v1.5.9 was fully deployed to production on 2026-01-30. Includes:
- ✅ BUG-022: Modal keyboard input fix
- ✅ BUG-023: Commitment checkbox fix (polling-based)
- ✅ UX-019: Currency overflow protection (compact formatting)
- ✅ UX-020: Task completion animation + haptic feedback
- ✅ REG-003/004: Modal focus/input regressions

---

## ⚠️ INCIDENT RESOLVED

**Date**: 2026-01-29  
**Issue**: Untested code was deployed to production without approval  
**Resolution**: Production rolled back to stable commit `c189779`  
**Action Taken**: Staging/Dev redeployed with correct build modes (with environment banners)

---

## ✅ DEPLOYED TO PRODUCTION (v1.5.9)

### Bug Fixes
| Bug ID | Description | Priority | Status |
|--------|-------------|----------|--------|
| BUG-008 | Transaction History UI Inconsistency | HIGH | ✅ **DEPLOYED** |
| REG-002 | Virtual List Stacking (Mobile) | CRITICAL | ✅ **DEPLOYED** |
| BUG-009 | Dark Mode White Edge on Cards | HIGH | ✅ **DEPLOYED** |
| BUG-010 | Transaction List Excessive Spacing | HIGH | ✅ **DEPLOYED** |
| BUG-011 | Empty Transaction List Scroll Issue | HIGH | ✅ **DEPLOYED** |
| BUG-012 | Commitments Task Box Too Large | LOW | ✅ **DEPLOYED** |
| BUG-013 | Redundant Edit/Delete Icons on Mobile | LOW | ✅ **DEPLOYED** |
| BUG-014 | Transaction List Layout (Edge-to-Edge) | LOW | ✅ **DEPLOYED** |
| BUG-015 | Real-time Updates Latency | HIGH | ✅ **DEPLOYED** |
| BUG-016 | Exchange Rates Ignored | HIGH | ✅ **DEPLOYED** |

### Architecture & Features
| Item | Description | Status |
|------|-------------|--------|
| ARCH-007 | Optimistic Updates (Recurring Transactions) | ✅ **DEPLOYED** |
| ARCH-012 | Performance Benchmarking Infrastructure | ✅ **DEPLOYED** |
| ARCH-014 | Bundle Analysis Tools | ✅ **DEPLOYED** |
| ARCH-015 | Architecture Decision Records | ✅ **DEPLOYED** |
| ARCH-016 | Telemetry Instrumentation | ✅ **DEPLOYED** |
| BRAND-002 | App Icon Polish | ✅ **DEPLOYED** |
| UX-017 | Independent Transaction Scroll | ✅ **DEPLOYED** |
| FIN-003 | Recurring Transactions | ✅ **DEPLOYED** |

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
| 2026-02-01 | v1.6.0 | Dev | **MULTI-TEAM SPRINT** | GAP-002: Color tokens, GAP-003: Navigation timing, GAP-004: Command Palette recent actions, TASK-002: Streaks (already implemented) |
| 2026-01-31 | v1.5.9 | Dev/Staging | **REASSURANCE RELEASE** | BUG-023: Commit checkbox, UX-019/20: Currency overflow + Haptic feedback |
| 2026-01-31 | v1.5.8 | Dev/Staging | **UX FIXES** | REG-004: Modal focus stealing fix, ActivityFeed crash fix, Unique category icons, Transaction list overflow fix, Edit/delete button removal (swipe gestures preserved) |
| 2026-01-31 | v1.5.7 | Dev/Staging | **CRITICAL FIX** | REG-003: Fixed modal inputs completely unresponsive (pointer-events-none blocking all interactions) |
| 2026-01-31 | v1.5.6 | Dev/Staging | Bugfix | BUG-022: Modal keyboard fix, Removed PullToRefresh |
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

