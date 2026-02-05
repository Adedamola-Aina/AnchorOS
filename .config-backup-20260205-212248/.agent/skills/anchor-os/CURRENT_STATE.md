---
name: anchor-current-state
description: Current project state, active bugs, deployment status. Load when starting work or checking project status.
---

# Anchor OS - Current State

**Last Updated**: 2026-01-29

---

## 🎯 CURRENT FOCUS

**Marketing Website** - Public presence for Anchor OS
- Status: Not Started
- Priority: P0
- Timeline: 5 weeks (Jan 27 - Mar 3, 2026)
- Dependencies: Mobile Optimization ✅ Complete

---

## 🐛 ACTIVE BUGS (In Dev/Staging - Need Testing)

**HIGH PRIORITY (P1)**:

| Bug ID | Description | Status |
|--------|-------------|--------|
| BUG-008 | Transaction History UI Inconsistency | Testing |
| BUG-009 | Dark Mode White Edge on Cards | Fix deployed, testing |
| BUG-010 | Transaction List Excessive Spacing | Testing |
| BUG-011 | Empty Transaction List Scroll Issue | Testing |

**LOW PRIORITY (P2)**:

| Bug ID | Description | Status |
|--------|-------------|--------|
| BUG-012 | Commitments Task Box Too Large | Testing |
| BUG-013 | Redundant Edit/Delete Icons on Mobile | Testing |
| BUG-014 | Transaction List Layout (Edge-to-Edge) | v2 testing |

**BACKLOG** (Not started):

| Bug ID | Description | Target |
|--------|-------------|--------|
| GAP-002 | Design System Color Token Fragmentation | 2026-02-05 |
| GAP-003 | Navigation Race Condition | 2026-02-05 |
| GAP-004 | Command Palette Recent Actions Stub | 2026-02-10 |

---

## 🚀 DEPLOYMENT STATUS

| Environment | Version | Status | URL |
|-------------|---------|--------|-----|
| **Production** | v1.5.0 | ✅ Stable | https://anchor-os.web.app |
| **Staging** | v1.5.2-dev | ⚠️ Testing | https://anchor-os-staging.web.app |
| **Dev** | v1.5.2-dev | ⚠️ Testing | https://anchor-os-dev-1c6ec.web.app |

**IMPORTANT**: 
- Production is on v1.5.0 (stable)
- Dev/Staging have bug fixes that need verification before prod
- NEVER deploy to production without explicit approval

---

## ⚠️ RECENT INCIDENT

**Date**: 2026-01-29
**Issue**: Untested code deployed to production without approval
**Resolution**: Production rolled back to stable commit `c189779`
**Lesson**: Always verify in staging, get explicit approval before prod

---

## ✅ RECENTLY COMPLETED

- **Mobile Optimization Phase 2** (2026-01-28)
  - Transaction search: 3-5s → 2ms
  - Haptic feedback, pull-to-refresh, swipe actions
  - 67 new unit tests

- **UX Design System Sprint** (2026-01-27)
  - Color tokens, dark mode, skeletons, animations
  - 15 UX improvements implemented

- **Internal PM Dashboard** (2026-01-26)
  - Browser: https://anchor.tail2fa2e.ts.net:3443/
  - Local API: http://localhost:3001
  - 6 tabs: Overview, Parity, Docs, Kanban, Git, Backlog

---

## 📊 KEY METRICS

- **Active Users**: 12 family members
- **Mobile Usage**: 75%
- **Desktop Usage**: 25%
- **Unit Tests**: 434 passing
- **E2E Tests**: All passing

---

## 🔧 VERIFICATION NEEDED

Before deploying staging → production, verify:

1. [ ] Dev has blue "DEVELOPMENT ENVIRONMENT" banner
2. [ ] Staging has yellow "STAGING ENVIRONMENT" banner
3. [ ] Finance page transaction list looks correct
4. [ ] Dark mode has no white edges on cards
5. [ ] Mobile swipe actions work
6. [ ] No redundant edit/delete icons on mobile
7. [ ] Commitments task boxes are compact
8. [ ] Empty states don't cause excessive scrolling
9. [ ] All E2E tests pass on staging
10. [ ] **Get explicit approval before production**

---

## 📋 DEPLOYMENT COMMANDS

```bash
# Dev
npm run deploy:dev

# Staging  
npm run deploy:staging

# Production (REQUIRES APPROVAL)
npm run deploy:production
```

---

## 🏗️ ARCHITECTURE NOTES

- **200-line limit**: All source files must be under 200 lines
- **Test coverage**: 80% minimum for new code
- **Security**: All DB operations through `secureDb.ts`
- **Mobile-first**: 75% of users are on mobile
