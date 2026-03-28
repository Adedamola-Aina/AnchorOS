# Anchor OS — Claude Code Instructions
# ⛔ READ THIS ENTIRE FILE BEFORE TAKING ANY ACTION ⛔
# Auto-loaded by Claude Code at session start.

---

## THIS SESSION IS LOCKED

Every new session starts with ALL file writes BLOCKED by the harness.

```
gather.lock missing  →  cannot write or edit ANY file
plan.lock missing    →  cannot write or edit src/ or functions/src/
```

Attempting `Write` or `Edit` before these locks are set will FAIL with a
blocked-tool error. This is intentional. The workflow enforces itself.

---

## MANDATORY SESSION START — COMPLETE IN ORDER, NO SKIPPING

### PHASE 1 — GATHER (unlocks: gather.lock)

```bash
# Step 1 — Query dashboard (source of truth for ALL project state)
curl -s http://localhost:3001/api/command-center | head -100
# OR via MCP: get_project_state

# Step 2 — Read entry point and workflow
# Read: .anchor/INDEX.md
# Read: .anchor/WORKFLOW.md

# Step 3 — Duplicate check (never create a duplicate ticket)
# get_bugs + get_features  →  is this already tracked?

# Step 4 — Read relevant docs for this task domain
# Finance → docs/ANCHOR_FINANCE_SPEC.md
# Auth    → docs/SECURITY.md
# Schema  → docs/FIRESTORE_SCHEMA.md
# UI      → docs/DESIGN_PHILOSOPHY.md + docs/DESIGN_TOKENS.md
# Functions → docs/ENGINEERING_EXECUTION_STANDARD.md

# Step 5 — Classify risk  (.anchor/skills/risk-classification.md)
# Class A = data model, auth, shared finances, Fabric AI core  →  all 12 roles
# Class B = new feature, Cloud Function, financial UI          →  roles 1–9 + 10
# Class C = polish, copy, config, tests for existing behavior  →  roles 1, 3, 5, 7

# Step 6 — Report findings, then unlock file writes:
touch .claude/gather.lock
```

⛔ **DO NOT run `touch .claude/gather.lock` before steps 1–5 are genuinely complete.**
Running it early is an anti-pattern. The lock is a promise, not a formality.

---

### PHASE 2 — PLAN (unlocks: plan.lock for src/ and functions/src/)

Output this template completely. Then **STOP AND WAIT** for owner response.

```markdown
## Task Plan: [FEAT-XXX / BUG-XXX]

**Risk Class**: A / B / C
**Rationale**: [one sentence]
**Success Metric**: [one measurable outcome tied to user behavior]
**Guardrail Metrics**: [up to 3 non-regression constraints]
**Rollout Plan**: dev → staging → prod
**Rollback Plan**: [trigger condition + exact action, executable in < 5 min]
**Observability**: [what telemetry confirms this is working]
**Files to modify**: [list]
**Tests to write**: [list — failing test names, written before implementation]
**Roles reviewed**: [list of roles that signed off — per risk class matrix]
```

⛔ **DO NOT write code until owner replies: APPROVED.**
Only after APPROVED:
```bash
touch .claude/plan.lock
```

---

## ABSOLUTE RULES (Every Violation Has Caused a Production Incident)

| Rule | Why |
|------|-----|
| ALL Firestore ops → `src/utils/secureDb.ts` | Security audit failure if bypassed |
| Mobile-first — 375px baseline, 44px touch targets | 75% of users on mobile |
| TypeScript strict — zero `any` types | Type errors hiding in prod |
| Files ≤ 200 lines (ARCH-001) — split proactively | PostWrite hook will warn; plan to split |
| Tests BEFORE implementation (TDD) | Untested paths shipped to prod |
| `npm run deploy:{env}` only — NEVER `firebase deploy` | Wrong environment deployed 2026-01-29 |
| NEVER deploy production without explicit owner approval | Rolled back 2026-01-29 |
| NEVER `console.log` in production code | Leaks data, pollutes logs |
| No hardcoded secrets, IDs, or environment values | Security incident |

---

## WORKFLOW AT A GLANCE

```
CLASSIFY (risk A/B/C — .anchor/skills/risk-classification.md)
    ↓
GATHER  (dashboard + docs + duplicate check)
    → touch .claude/gather.lock
    ↓
PLAN    (role reviews + plan template output)
    → STOP — wait for owner: APPROVED
    → touch .claude/plan.lock
    ↓
BUILD   (TDD: failing test → implementation → refactor)
    ↓
CLOSE   (SET → Security → SRE → DevOps → Tech Lead sign-offs)
```

Full phase definitions: `.anchor/WORKFLOW.md`
Role activation matrix: `.anchor/skills/risk-classification.md`
12 agent personas: `.anchor/agents/01-pm.md` through `12-techlead.md`

---

## MCP TOOLS

```
get_project_state · get_bugs · get_features · get_roadmap
get_environment_parity · get_kanban · get_velocity
get_changelog · get_next_id · search_git
```

---

## KEY FILES

```
.anchor/INDEX.md              → Start here (entry point)
.anchor/WORKFLOW.md           → Full phase definitions
.anchor/agents/               → 12 role definitions
.anchor/skills/               → 6 reusable skills
src/utils/secureDb.ts         → ONLY Firestore access layer
config/firestore.rules        → Security rules
docs/ARCHITECTURE_OVERVIEW.md → System architecture
docs/FIRESTORE_SCHEMA.md      → Data model
```

---

## SESSION LIMIT

4–5 tasks max per session. Start a fresh session to prevent context drift.
Re-read `.anchor/INDEX.md` at the start of every new session.
The workflow resets (both locks cleared) on every session start.
