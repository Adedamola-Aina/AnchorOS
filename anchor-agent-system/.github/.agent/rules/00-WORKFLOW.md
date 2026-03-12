# Anchor OS — Agent Workflow Rules
# REDIRECTED: This file now points to the canonical .anchor/ system.
# Maintained here for backward compatibility with ENGINEERING_EXECUTION_STANDARD.md

---

## Canonical Location

All workflow rules have moved to `.anchor/WORKFLOW.md`.

The complete GATHER → PLAN → BUILD → CLOSE workflow is defined there,
including all role assignments, dashboard integration, and phase exit conditions.

**Read: `.anchor/WORKFLOW.md`**

---

## Summary (Maintained Here For Quick Reference)

### Four Phases
1. GATHER — Query dashboard, check duplicates, read relevant docs
2. PLAN — Roles review by Risk Class, owner approves — STOP before BUILD
3. BUILD — TDD (red/green/refactor), roles implement, lint+test each commit
4. CLOSE — Full suite passes, security + SRE + DevOps + Tech Lead sign off

### Non-Negotiables
- All Firestore ops through `src/utils/secureDb.ts`
- Mobile-first: 375px, 44px touch targets
- Files ≤ 200 lines (ARCH-001)
- No `any` types, no `console.log` in production
- Never `firebase deploy` raw
- Never production deploy without owner approval
- TDD always — failing test before implementation

### Dashboard
`localhost:3001` | MCP: `get_project_state`, `get_bugs`, `get_features`, `get_next_id`
