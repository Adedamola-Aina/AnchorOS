# DEPLOYMENT STATUS

**Last Updated**: 2026-01-28 10:30 UTC

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

### Features (New - Jan 28)
- [ ] UX-006: Haptic Feedback (useHaptic hook with 5 patterns)
- [ ] UX-008: Pull-to-Refresh (PullToRefresh component)
- [ ] UX-009: Transaction Swipe Actions (SwipeableRow + SwipeableTransactionItem)
- [ ] ThemeToggle hideOled option (OLED hidden on auth page)

### Features (Jan 27)
- [ ] UX-001: Unified Color Token System (semantic tokens)
- [ ] UX-002: Dark Mode Polish + OLED variant
- [ ] UX-003: Skeleton Loading States (6 variants)
- [ ] UX-004: Empty State Illustrations
- [ ] UX-011: Consistent Button Styles (CVA-based)
- [ ] UX-012: Animation System (tailwindcss-animate)
- [ ] UX-013: Typography Scale Audit
- [ ] UX-014: Icon Consistency Audit
- [ ] ARCH-001: 200-Line Rule Enforcement
- [ ] ARCH-002: Feature-Level Error Boundaries
- [ ] ARCH-003: Service Layer Tests (84 tests)
- [ ] BUG-006: Text Overflow Fix

### Previous Sprint
- [ ] Mobile Optimization Phase 2 (iOS keyboard, full-screen modals)
- [ ] Fabric AI Data Wiring (GAP-001 fix)
- [ ] PM Dashboard enhancements (Recently Fixed, clickable bugs)
- [ ] Single Source of Truth (ROADMAP.md consolidation)

### Bug Fixes
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
| 2026-01-28 | v1.5.0-dev | Staging | Feature | UX improvements, Mobile gestures, OLED toggle |
| 2026-01-28 | v1.5.0-dev | Dev | Feature | UX improvements, Mobile gestures, OLED toggle |
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

