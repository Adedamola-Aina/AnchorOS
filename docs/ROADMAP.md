# ANCHOR OS ROADMAP

**Last Updated**: 2026-01-27

---

## 🎯 CURRENT FOCUS: Marketing Website

**Why Now**: Mobile optimization complete, need public presence

**Timeline**: 5 weeks (Jan 27 - Mar 3, 2026)
**Status**: 🚧 Not Started

---

## 📋 Q1 2026 (Jan - Mar)

### ✅ Completed
- [x] **ARCH-001** (Jan 27) - 22 files refactored, pre-commit hook enforces 200-line rule
- [x] **Family Mode** - Spouse sharing, family accounts
- [x] **Fabric AI Magic Suggestions** - GAP-001 fixed Jan 26
- [x] **Internal PM Dashboard** (Jan 26) - http://localhost:3001
- [x] **Codebase Audit** (Jan 26) - 82 suggestions documented
- [x] **Mobile Optimization** (v1.5.0) - iOS keyboard fix, full-screen modals, Lighthouse 95

### 🚧 In Progress
- [ ] **Marketing Website**
  - Dependencies: Mobile Optimization ✅
  - Priority: P0
  - Effort: 5 weeks

- [ ] **Code Quality: 200-Line Compliance** (25 files)
  - Priority: P2
  - Effort: 4 weeks
  - **Phase 1 (P0 - Critical)**:
    - [x] Refactor `server/docReader.js` (756 lines → 4 files) ✅
    - [ ] Refactor `server/index.js` (654 lines → 4 files)
  - **Phase 2 (P1 - High)**:
    - [ ] Refactor `CommitmentsView.test.tsx` (818 lines → 3 files)
    - [ ] Refactor `FinanceView.test.tsx` (590 lines → 2 files)
    - [ ] Refactor `useFinanceService.test.tsx` (502 lines → 2 files)
    - [ ] Refactor `EnterpriseKanban.tsx` (468 lines → 3 files)
    - [ ] Refactor `FeatureBacklog.tsx` (351 lines → 2 files)
    - [ ] Refactor `gitAnalyzer.js` (337 lines → 2 files)
  - **Phase 3 (P2 - Medium)**: 13 files (230-320 lines each)
  - **Phase 4 (P3 - Low)**: 3 files (201-211 lines each)

### 📋 Planned
- [ ] **Enhanced Fabric AI**
  - Dependencies: Mobile Optimization ✅
  - Priority: P1
  - Effort: 3 weeks

---

## 💡 Feature Backlog (82 Suggestions)

Full backlog tracked in: [docs/FEATURE_SUGGESTIONS.md](file:///root/anchor-os/docs/FEATURE_SUGGESTIONS.md)

**Dashboard View**: http://localhost:3001 → Feature Backlog tab

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

