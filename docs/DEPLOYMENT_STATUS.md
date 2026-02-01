# DEPLOYMENT STATUS

**Last Updated**: 2026-02-01 05:45 UTC

---

## 📊 CURRENT STATE

| Environment | Version | Firebase Site | URL | Last Deployed |
|-------------|---------|---------------|-----|---------------|
| **Production** | v1.5.5 | anchor-os | https://anchor-os.web.app | 2026-01-30 08:19 |
| **Staging** | v1.5.8 | anchor-os-staging | https://anchor-os-staging.web.app | 2026-01-31 06:24 |
| **Dev** | v1.6.0 | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app | 2026-02-01 05:32 |

**Code Flow**: Dev → Staging → Production (with approval)

---

## ⏳ PENDING CHANGES (Dev → Staging)

### v1.6.0 Multi-Team Sprint (2026-02-01)
- [ ] **GAP-002**: Design System Color Token Fragmentation - Migrated indigo to primary tokens
- [ ] **GAP-003**: Navigation Race Condition - requestAnimationFrame + 1300ms delay
- [ ] **GAP-004**: Command Palette Recent Actions - localStorage persistence

### v1.5.9 Features (2026-01-31)
- [ ] **BUG-024**: Exchange Rate Calculation 100x Inflation - Fixed dollars vs cents unit error
- [ ] **BUG-023**: Commitment Checkbox Requires Multiple Clicks - Polling-based fix
- [ ] **UX-020**: Task Completion Animation + Haptic Feedback
- [ ] **UX-019**: Currency Overflow Protection - Compact formatting

---

## ⏳ PENDING CHANGES (Staging → Production)

### v1.5.8 Features (2026-01-31)
- [ ] **REG-004**: Modal Focus Stealing Race Condition
- [ ] **ActivityFeed**: Crash Fix on amountCents
- [ ] **CategoryIcon**: Duplicate Category Icons Fix
- [ ] **TransactionList**: Overflow UI Fix
- [ ] **Edit/Delete**: Button Removal (swipe gestures preserved)

### v1.5.7 Features (2026-01-31)
- [ ] **REG-003**: CRITICAL - Modal Inputs Completely Unresponsive

### v1.5.6 Features (2026-01-31)
- [ ] **BUG-022**: Modal Keyboard Input Not Working
- [ ] **PullToRefresh**: Removal from Finance transaction list

---

## ⚠️ INCIDENT LOG

**Date**: 2026-01-29  
**Issue**: Untested code was deployed to production without approval  
**Resolution**: Production rolled back to stable commit `c189779`  
**Action Taken**: Staging/Dev redeployed with correct build modes (with environment banners)

---

## ✅ DEPLOYED TO PRODUCTION (v1.5.5)

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

## 📝 DEPLOYMENT HISTORY (Last 30 Days)

| Date | Version | Env | Type | Notes |
|------|---------|-----|------|-------|
| 2026-02-01 | v1.6.0 | Dev | **MULTI-TEAM SPRINT** | GAP-002: Color tokens, GAP-003: Navigation timing, GAP-004: Command Palette recent actions |
| 2026-01-31 | v1.5.8 | Staging | **UX FIXES** | REG-004, ActivityFeed crash, Unique category icons, Transaction list overflow, Edit/delete button removal |
| 2026-01-31 | v1.5.7 | Staging | **CRITICAL FIX** | REG-003: Fixed modal inputs completely unresponsive |
| 2026-01-31 | v1.5.6 | Staging | Bugfix | BUG-022: Modal keyboard fix, Removed PullToRefresh |
| 2026-01-30 | v1.5.5 | **Production** | Release | BUG-021: Service worker cache fix |
| 2026-01-29 | v1.5.3-ui-fix | Dev/Staging | Feature | UX-017: Scrollable List, Fixed BUG-008/010/011/012/013/014 |
| 2026-01-28 | v1.5.0 | **Production** | Release | Full code parity, all UX improvements |
| 2026-01-28 | v1.5.0 | Staging | Feature | UX improvements, Mobile gestures, OLED toggle |
| 2026-01-28 | v1.5.0 | Dev | Feature | UX improvements, Mobile gestures, OLED toggle |
| 2026-01-20 | v1.4.0 | Production | Release | Family Mode fixes |
| 2026-01-15 | v1.3.0 | Production | Release | Fabric AI |

---

**Maintained By**: Teeto  
**Update**: After every deployment
