# Anchor OS — GitHub Copilot Instructions
# Auto-loaded by Copilot in every chat session in this workspace.
# This file is the bridge between Copilot and the .anchor/ system.

---

## Project Identity

You are working on **Anchor OS** — a household finance and commitment tracking platform.
React 19 + TypeScript strict + Firebase. 75% mobile users. Real people's financial data.
Calm design. No gamification. Privacy-first.

**Current version**: See `src/version.ts`
**Environments**: dev (anchor-os-dev-1c6ec.web.app) · staging · production (anchor-os.web.app)

---

## Your First Action Every Session

Before responding to ANY task, do this:

1. Read `.anchor/INDEX.md` — the single entry point for all instructions
2. Read `.anchor/WORKFLOW.md` — the workflow you must follow
3. Query the dashboard for project state:
   ```
   get_project_state   (MCP tool)
   OR
   curl -s http://localhost:3001/api/command-center | head -100
   ```

**Never assume project state. Always query the dashboard.**

---

## The Non-Negotiables

These are production incident lessons. Violating them breaks real users:

| Rule | Why It Matters |
|------|---------------|
| All Firestore ops through `src/utils/secureDb.ts` | Security + audit trail |
| Mobile-first: 375px baseline, 44px touch targets | 75% of users are on mobile |
| TypeScript strict — no `any` types | Type safety in financial data |
| Files ≤ 200 lines (ARCH-001) | Maintainability |
| No `console.log` in production code | Privacy + performance |
| Never `firebase deploy` raw | Wrong environment risk |
| TDD: failing test before implementation | Catches edge cases early |
| Never deploy production without owner approval | Real users, real money |

---

## Workflow Summary

```
GATHER (query dashboard) 
  → PLAN (roles review, owner approves) 
  → BUILD (TDD, roles implement) 
  → CLOSE (all gates pass, deploy)
```

Full workflow: `.anchor/WORKFLOW.md`
Role definitions: `.anchor/agents/01-pm.md` through `12-techlead.md`

---

## How to Invoke Roles

```
Act as Anchor OS [Role Name] (.anchor/agents/XX-name.md). [task context]
```

Examples:
```
Act as Anchor OS Security Engineer (.anchor/agents/07-security.md). 
Review this Firestore rule change for the new budget collection.

Act as Anchor OS Senior Engineer (.anchor/agents/04-engineer.md).
Implement FEAT-015 following TDD. All DB ops through secureDb.ts.

Act as Anchor OS Tech Lead (.anchor/agents/12-techlead.md).
Final sign-off for BUG-109. Confirm Definition of Done is met.
```

---

## Key Directories

```
src/features/{feature}/     Feature modules (auth, finance, commitments, fabric, etc.)
src/services/               AccountService, TransactionService, FabricService
src/services/fabric/        Anchor AI engines (Behavioral, Insights, Predictions)
src/utils/secureDb.ts       ALL database operations — no exceptions
src/hooks/                  Custom React hooks
src/types/                  TypeScript type definitions
functions/src/              Cloud Functions (reminders, family, recurring, AI callable)
config/firestore.rules      Firestore security rules
e2e/                        Playwright E2E tests
.anchor/                    All AI agent instructions (this system)
```

---

## Dashboard MCP Tools

```
get_project_state       Overall health, sprint state, blockers
get_bugs                All tracked bugs — check before creating BUG-XXX
get_features            All tracked features — check before creating FEAT-XXX  
get_roadmap             Planned / deferred items
get_environment_parity  Dev vs staging vs prod differences
get_kanban              What's in-progress right now
get_velocity            Team throughput
get_changelog           Recent commits as detected by dashboard
get_next_id             Next available ID (always use this, never manually increment)
search_git              Search commit history
```

---

## Commit Format (Dashboard Auto-Detects These)

```
fix(scope): BUG-XXX description
feat(scope): FEAT-XXX description  
refactor(scope): description
test(scope): description
docs(scope): description
deploy(env): vX.X.X @ HASH
```

Scopes: `finance` · `fabric` · `family` · `mobile` · `auth` · `functions` · `security` · `dashboard` · `settings`

---

## Files This Copilot Config Connects To

- `.anchor/INDEX.md` — Master index
- `.anchor/WORKFLOW.md` — Authoritative workflow
- `.anchor/agents/` — 12 role definitions
- `.anchor/skills/` — 6 reusable skill files
- `docs/` — Reference documentation (architecture, schema, security, testing)
- `CONTRIBUTING.md` — Commit conventions, PR governance
