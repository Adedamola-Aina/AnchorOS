# ANCHOR OS — MANDATORY WORKFLOW

Every task follows these 4 phases. No skipping. No reordering. No proceeding without the required outputs.

## What Counts as a Task

A **task** is any user request that involves reading code, writing code, modifying files, running commands, or making decisions about the project. Each of these starts from Phase 1:
- "Fix this bug" → new task
- "Also update that file" → new task (even mid-conversation)
- "Deploy to staging" → new task
- "What does this code do?" → NOT a task (pure question, no workflow needed)
- "Delete those docs" → new task

**If in doubt, start from Phase 1.** It takes 10 seconds and prevents every anti-pattern.

## Scope Changes Mid-Task

If the user changes scope during Phase 3 (BUILD):
1. Stop building immediately
2. Commit or stash any work in progress
3. Start Phase 1 for the new scope

Do NOT silently absorb new requests into the current task.

## Phase 1 — GATHER

**Do this BEFORE any coding, planning, or analysis.**

Required actions:
1. Run `get_project_state` MCP tool (or `curl -s http://localhost:3001/api/command-center | head -100`)
2. Check for duplicates: `get_bugs` + `get_features` (always, not just when creating new items)
3. Read relevant docs from the reference table in `03-DOCUMENTS.md`

Required output to user:
- Dashboard state summary (versions, env parity, active alerts)
- Relevant existing bugs/features/roadmap items
- "Phase 1 complete. Moving to Phase 2."

**Do NOT skip this even if you think you know the state. Anti-pattern #13.**

---

## Phase 2 — PLAN

**Present the plan and WAIT for user confirmation before proceeding.**

Required output to user:
- Files to create or modify (with full paths)
- Tests to write (what behavior each test verifies)
- Deploy target: dev / staging / production / none
- Risks assessed from multiple role perspectives (name conflicts between them)
- Phase 3 approach: TDD (default) or stated exception with justification

**Do NOT write any code until the user confirms. This is a gate.**

---

## Phase 3 — BUILD

**Default: RED → GREEN → REFACTOR (TDD)**

1. Write a failing test for the expected behavior
2. Write the minimum code to make it pass
3. Refactor for clarity without changing behavior
4. Repeat for each distinct behavior

**Exception protocol** (for config, docs, tooling, build artifacts with no existing test harness):
- State explicitly: "Phase 3 exception: [category]. No test harness exists for [what]. Reason: [why TDD doesn't apply]."
- If the same exception recurs, log a gap to track adding test coverage later

**Do NOT write implementation without a failing test unless you have explicitly stated an exception in Phase 2.**

---

## Phase 4 — CLOSE

Required actions:
1. Run tests: `npm run test -- --run`
2. Run lint: `npm run lint`
3. Commit with the correct prefix (see `02-TECHNICAL.md` for prefixes)
4. Verify dashboard detection: `get_project_state` or `curl -s http://localhost:3001/api/command-center | head -10`
5. Push to origin if appropriate

Required output to user:
- Test results (pass/fail count)
- Commit hash and message
- Dashboard detection confirmed
- "Phase 4 complete."

---

## Phase Gates

| Transition | Gate |
|------------|------|
| 1 → 2 (Gather → Plan) | Must have dashboard state + duplicate check done |
| 2 → 3 (Plan → Build) | Must have explicit user confirmation |
| 3 → 4 (Build → Close) | Must have passing tests or stated exception |
| 4 → Next task | Must restart from Phase 1 for every new task |

## Session Length (Non-Negotiable)

After completing 4-5 tasks in a single conversation, tell the user:

> "We've completed [N] tasks in this session. To keep context fresh and avoid drift, I recommend starting a new conversation for the next piece of work. This ensures I reload all project rules and get the latest dashboard state."

A **task** = one complete cycle through the 4 phases (GATHER → PLAN → BUILD → CLOSE). Quick questions, clarifications, and planning discussions do NOT count as tasks.

Why this exists: Long conversations cause context drift — instructions fade from the context window, mistakes compound, and the agent stops thinking like a distinguished engineer and starts pattern-matching from earlier in the thread. A fresh conversation forces a full reload of rules, anti-patterns, and project state.

---

## Deployment Gate (Additional)

```
Dev → Staging → [VERIFY on staging] → [GET EXPLICIT "YES, DEPLOY TO PRODUCTION"] → Production
```

Use ONLY `npm run deploy:{env}`. Never raw `firebase deploy`. See `.github/.agent/workflows/deploy.md` for the full checklist.
