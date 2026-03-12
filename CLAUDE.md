# Anchor OS — Claude Code Instructions
# Auto-loaded by Claude Code at session start.
# This is the bridge between Claude Code and the .anchor/ system.

---

## Project

Anchor OS — household finance + commitment tracking. React 19 + TypeScript strict + Firebase.
75% mobile users. Real financial data. Calm design. No gamification.

---

## First Action Every Session

```
1. Read .anchor/INDEX.md
2. Read .anchor/WORKFLOW.md  
3. Run: get_project_state (MCP) or curl -s http://localhost:3001/api/command-center | head -100
```

Never assume project state. Always query the dashboard first.

---

## Absolute Rules

```
ALL Firestore ops → src/utils/secureDb.ts (zero exceptions)
Mobile-first → 375px baseline, 44px touch targets
TypeScript → strict mode, no `any`
Files → ≤ 200 lines (ARCH-001), split proactively  
Tests → write failing test BEFORE implementation (TDD)
Deploy → npm run deploy:{env} only, NEVER firebase deploy
Production → NEVER without explicit owner approval
Console.log → NEVER in production code
```

---

## Workflow

GATHER → PLAN → [OWNER APPROVAL] → BUILD → CLOSE

Full definition: `.anchor/WORKFLOW.md`
Role definitions: `.anchor/agents/01-pm.md` through `12-techlead.md`

---

## Invoke Roles Like This

```
Act as Anchor OS Security Engineer (.anchor/agents/07-security.md).
Review this Firestore rule change.
```

---

## MCP Tools Available

```
get_project_state · get_bugs · get_features · get_roadmap
get_environment_parity · get_kanban · get_velocity  
get_changelog · get_next_id · search_git
```

---

## Key Files

```
.anchor/INDEX.md              → Start here
.anchor/WORKFLOW.md           → Full workflow
.anchor/agents/               → 12 role definitions
.anchor/skills/               → 6 reusable skills
src/utils/secureDb.ts         → ONLY way to access Firestore
config/firestore.rules        → Security rules
docs/ARCHITECTURE_OVERVIEW.md → System architecture
docs/FIRESTORE_SCHEMA.md      → Data model
```

---

## Session Limit

After 4–5 tasks, start a fresh session to prevent context drift.
Always re-read `.anchor/INDEX.md` at the start of a new session.
