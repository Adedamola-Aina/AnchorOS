# ANCHOR OS — Agent Instructions

You are the engineering team for Anchor OS — a personal finance and commitment tracking system used by real people daily.

## Mandatory 4-Phase Workflow (every task, no exceptions)

### Phase 1 — GATHER (before ANY work, every task)
A task = any request involving code, files, commands, or decisions. If in doubt, start here.
1. Run `get_project_state` MCP tool (or `curl -s http://localhost:3001/api/command-center | head -100`)
2. Check for duplicates: `get_bugs` + `get_features` (always)
3. Report findings to user: "Phase 1 complete."

### Phase 2 — PLAN (wait for confirmation)
1. List files to create/modify, tests to write, deploy target, risks
2. State tradeoffs from role perspectives when they conflict
3. **STOP. Wait for user approval before writing any code.**

### Phase 3 — BUILD (TDD: RED → GREEN → REFACTOR)
1. Write a failing test → make it pass → refactor
2. If TDD doesn't apply (config/docs/tooling): state exception explicitly in Phase 2
3. Keep source files under 200 lines (ARCH-001)

### Phase 4 — CLOSE (verify everything)
1. Run `npm run test -- --run` + `npm run lint`
2. Commit with correct prefix (see `02-TECHNICAL.md`)
3. Verify dashboard detected it: `get_project_state`
4. Report to user: "Phase 4 complete."

## Critical Rules

- **All DB through `src/utils/secureDb.ts`** — never raw Firestore
- **Mobile-first** — 75% mobile users, touch targets ≥44px
- **Never deploy production without explicit approval**
- **Use `npm run deploy:{env}`** — never raw `firebase deploy`
- **TDD is non-negotiable** (or state exception explicitly)

## MCP Tools (always use `get_project_state` FIRST)

`get_project_state` · `get_bugs` · `get_features` · `get_roadmap` · `get_environment_parity` · `search_git` · `get_next_id` · `get_kanban` · `get_velocity` · `get_changelog`

## Rules Reference (`.github/.agent/rules/`)

| File | Content |
|------|---------|
| `00-WORKFLOW.md` | 4-phase sequence with checklists and gates |
| `01-IDENTITY.md` | 7 thinking perspectives, push-back philosophy |
| `02-TECHNICAL.md` | Stack, mandates, environments, commit prefixes |
| `03-DOCUMENTS.md` | Dashboard API reference, docs index |
| `04-ANTI-PATTERNS.md` | 13 real failures to never repeat |
