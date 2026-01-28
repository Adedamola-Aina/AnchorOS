# ANCHOR OS ROADMAP

**Last Updated**: 2026-01-28

---

## 🎯 CURRENT FOCUS: Marketing Website

**Why Now**: Mobile optimization complete, need public presence

**Timeline**: 5 weeks (Jan 27 - Mar 3, 2026)
**Status**: 🚧 Not Started

---

## 📋 Q1 2026 (Jan - Mar)

### ✅ Completed
- [x] **ARCH-001** (Jan 27) - 22 files refactored, pre-commit hook enforces 200-line rule
- [x] **ARCH-002** (Jan 27) - Feature error boundaries implemented across all major views
- [x] **ARCH-003** (Jan 27) - Service layer tests: 69 unit + 15 integration tests (100% pass rate)
- [x] **Family Mode** - Spouse sharing, family accounts
- [x] **Fabric AI Magic Suggestions** - GAP-001 fixed Jan 26
- [x] **Internal PM Dashboard** (Jan 26) - http://localhost:3001
- [x] **Codebase Audit** (Jan 26) - 82 suggestions documented
- [x] **Mobile Optimization Phase 1** (v1.5.0) - iOS keyboard fix, full-screen modals, Lighthouse 95
- [x] **Mobile Optimization Phase 2** (v1.5.1 - Jan 28):
  - BUG-001 Fixed: Transaction search 2ms for 1000+ txns (was 3-5s)
  - UX-006: Haptic feedback hook (`useHaptic`)
  - UX-008: Pull-to-refresh component
  - UX-009: Transaction swipe actions (edit/delete)
  - 67 new unit tests, 100% pass rate

### 🚧 In Progress
- [ ] **Marketing Website**
  - Dependencies: Mobile Optimization ✅
  - Priority: P0
  - Effort: 5 weeks

### ✅ Completed
- [x] **Code Quality: 200-Line Compliance (ARCH-001)** ✅
  - Completed: 2026-01-27
  - Result: **0 Anchor OS source files exceed 200 lines**
  - Status: 100% compliant with ARCH-001 mandate
  - Note: 10 test files exceed 200 lines (acceptable for comprehensive test coverage)
  - Verified: All production code in `src/` is under 200 lines


### 📋 Planned
- [ ] **Enhanced Fabric AI**
  - Dependencies: Mobile Optimization ✅
  - Priority: P1
  - Effort: 3 weeks

---

## 💡 Feature Backlog (76 Remaining)

Full backlog tracked in: [docs/FEATURE_SUGGESTIONS.md](file:///root/anchor-os/docs/FEATURE_SUGGESTIONS.md)

**Dashboard View**: http://localhost:3001 → Feature Backlog tab

**Completed**: 6 of 82 suggestions implemented (ARCH-001, ARCH-002, ARCH-003, UX-006, UX-008, UX-009)

### Top Candidates for Q2 2026

| ID | Feature | Impact | Effort |
|----|---------|--------|--------|
| AUTH-001 | Google/Apple Sign-In | 30-50% signup conversion ↑ | Medium |
| FIN-001 | Budget Tracking | Core financial planning | High |
| TASK-002 | Habit Streaks & Gamification | Engagement ↑ | Medium |
| FAM-001 | Family Activity Feed | Connection ↑ | Medium |
| AUTH-002 | Passkey / Biometric Auth | Modern security | High |

---

## 📅 Q2 2026 (Apr - Jun)

### Candidates (Under Consideration)
- [ ] **Social Sign-In** (AUTH-001) - Google/Apple OAuth
- [ ] **Budget Tracking** (FIN-001) - Set & track monthly budgets
- [ ] **Habit Streaks** (TASK-002) - Gamification for engagement
- [ ] CSV/PDF Export
- [ ] Bill Reminders

---

## 🚫 WILL NOT BUILD

- **Cryptocurrency Exchange** - Too volatile
- **Tax Filing** - Too complex
- **Social Features** - Privacy-first design

---

**Review**: Every Sunday at 10:00

