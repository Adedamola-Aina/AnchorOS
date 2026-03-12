# Anchor OS — Authoritative Workflow
# Every task follows this. No exceptions.
# Supersedes: AGENTS.md workflow, .github/.agent/rules/00-WORKFLOW.md

---

## The Four Phases

```
GATHER ──► PLAN ──► [OWNER APPROVAL] ──► BUILD ──► CLOSE
```

Each phase has: who runs it, what they do, what the dashboard provides, and the exit condition.

---

## PHASE 0 — CLASSIFY (Before Everything)

**Who**: Tech Lead (Role 12) + PM (Role 01)  
**Dashboard call**: `get_project_state` → confirms current sprint state  

Assign a Risk Class before any other phase begins:

| Class | Definition | Required Roles | Example |
|-------|-----------|----------------|---------|
| **A** | Data model, auth, shared finances, prod infra, Fabric AI core | All 12 roles | New Firestore collection, Family Mode change, secureDb change |
| **B** | New feature, Cloud Function, any UI touching financial data | Roles 1–9 + 10 if UI | New transaction type, reminder system, new Fabric card |
| **C** | UI polish, copy, config, docs, test additions | Roles 1, 3, 5, 7 | Button color, error message text, new test file |

**Exit condition**: Risk class recorded in task doc. No work begins without it.

---

## PHASE 1 — GATHER

**Who**: Engineer (Role 04) reads; PM (Role 01) confirms scope  
**Time**: Before any planning or code

### Steps

1. **Query the dashboard** (source of truth for project state):
   ```bash
   curl -s http://localhost:3001/api/command-center | head -100
   # OR use MCP tools:
   get_project_state   → overall health, active sprint, blockers
   get_bugs            → all known bugs (check for duplicates)
   get_features        → all features (check for duplicates)
   get_roadmap         → what's planned, what's deferred
   get_kanban          → what's in progress right now
   get_velocity        → team throughput (pacing reference)
   ```

2. **Check for duplicates**: Is this bug/feature already tracked?
   - If yes: link to it, do not create a new ID
   - If no: `get_next_id` → reserve the correct ID prefix (BUG-XXX, FEAT-XXX, etc.)

3. **Read relevant docs** from `docs/` based on the task domain:
   - Finance work → `docs/ANCHOR_FINANCE_SPEC.md`
   - Schema work → `docs/FIRESTORE_SCHEMA.md`
   - Auth/security → `docs/SECURITY.md`
   - UI → `docs/DESIGN_PHILOSOPHY.md` + `docs/DESIGN_TOKENS.md`
   - Cloud Functions → `docs/ENGINEERING_EXECUTION_STANDARD.md`

4. **Report findings**: What exists, what's relevant, what the risk class is.

**Exit condition**: Duplicate check complete. Docs read. Risk class confirmed.

---

## PHASE 2 — PLAN

**Who**: Role assignments depend on Risk Class (see matrix below)  
**Time**: After GATHER, before any code  
**Rule**: STOP and wait for owner approval before proceeding to BUILD.

### Role Activation By Risk Class

#### Risk Class A — All roles review in sequence:
```
① PM (01)          → Feature spec, success metric, guardrail metrics, rollout plan
② Architect (02)   → System design, file structure, no pattern violations
③ Designer (03)    → UI/UX spec (if UI), mobile layout, design tokens
④ DB Engineer (06) → Schema changes, indexes, atomic operation design
⑤ Security (07)    → Threat model, rules design, zero-trust verification
⑥ SRE (08)         → Observability plan, rollback plan, reliability design
```

#### Risk Class B — Subset:
```
① PM (01)          → Feature spec + metrics
② Architect (02)   → Design review
③ Designer (03)    → If UI involved
④ DB Engineer (06) → If schema involved
⑤ Security (07)    → Always for any data-touching feature
⑥ SRE (08)         → Rollback plan required
```

#### Risk Class C — Lightweight:
```
① PM (01)          → Confirm it's worth doing
② Designer (03)    → If UI
③ Security (07)    → Quick check — does this touch any auth or data path?
```

### PLAN Deliverable (Required Before Approval)

```markdown
## Task Plan: [FEAT-XXX / BUG-XXX]

**Risk Class**: A / B / C
**Success Metric**: [one measurable outcome]
**Guardrail Metrics**: [up to 3 non-regression constraints]
**Rollout Plan**: [staged path: dev → staging → prod]
**Rollback Plan**: [trigger condition + exact action, executable in < 5 min]
**Observability**: [what telemetry will confirm it's working]
**Files to modify**: [list]
**Tests to write**: [list]
**Roles reviewed**: [list of roles that signed off on plan]
```

**⛔ STOP HERE. Do not write code until owner approves this plan. ⛔**

---

## PHASE 3 — BUILD

**Who**: Engineer (Role 04) leads; SET (Role 05) alongside; Backend (11) and Mobile (10) as needed  
**Rule**: TDD always. Write failing test first. Then code. Then refactor.

### TDD Cycle (Mandatory)

```
1. RED    — Write a failing test that describes the desired behavior
2. GREEN  — Write the minimal code to make it pass
3. REFACTOR — Clean up without changing behavior
4. REPEAT — Until the feature is complete
```

### Build Checklist (Per Phase of Work)

- [ ] Test written and failing before implementation
- [ ] Implementation makes test pass
- [ ] All existing tests still pass
- [ ] No file exceeds 200 lines (split proactively)
- [ ] All Firestore ops through `secureDb.ts`
- [ ] No `any` types introduced
- [ ] No `console.log` in production code
- [ ] `npm run test -- --run` passes
- [ ] `npm run lint` passes
- [ ] Commit: `feat(scope): FEAT-XXX description` or `fix(scope): BUG-XXX description`

### Dashboard Ping After Each Commit

After committing, the dashboard auto-detects the commit prefix.
Verify with: `get_changelog` → confirms dashboard registered the commit.

### For Cloud Functions Work (Role 11 active):

Additional checks:
- [ ] Function is idempotent (safe to retry)
- [ ] App Check enforcement present
- [ ] Rate limiting applied (`functions/src/rateLimit.ts` pattern)
- [ ] Firestore transactions used for multi-step atomic ops
- [ ] Tested with Firebase emulator
- [ ] Node 22 compatibility verified

### For UI Work (Role 10 active):

Additional checks:
- [ ] Tested at 375px viewport
- [ ] Touch targets ≥ 44px
- [ ] No native `<select>` used (button pickers instead — BUG-107 pattern)
- [ ] iOS Safari keyboard behavior works
- [ ] Dark mode tested
- [ ] Accessibility: ARIA labels, `data-testid` attributes

---

## PHASE 4 — CLOSE

**Who**: SET (05) → Security (07) → SRE (08) → DevOps (09) → Tech Lead (12)  
**Rule**: All gates must pass. Dashboard must confirm. Tech Lead signs off last.

### Close Sequence

#### Step 1 — SET/QA Final Verification (Role 05)
```bash
npm run test -- --run          # All unit tests
npm run test:e2e               # All E2E tests  
npm run test:rules             # Firestore security rules
npm run test:mutation          # Mutation testing (master branch)
npm run test:coverage          # Coverage report
```
Required: 100% pass rate. Coverage: 80%+ statement, 70%+ branch, 90%+ function.

#### Step 2 — Security Sign-Off (Role 07)
- New Firestore rules reviewed and tested
- No data access path without rule coverage
- Threat model satisfied
- App Check and rate limits in place for any new Functions

#### Step 3 — SRE Sign-Off (Role 08)
- Telemetry emitting correctly
- Rollback plan is executable (test it mentally: can you reverse this in 5 min?)
- No Lighthouse CI regression: `npm run lighthouse`
- Offline/degraded mode handled

#### Step 4 — DevOps Deploy (Role 09)

**For staging**:
```bash
npm run deploy:staging
# Verify yellow "STAGING ENVIRONMENT" banner
# Verify dashboard: get_environment_parity → staging == dev
```

**For production** (requires Tech Lead sign-off first):
```bash
npm run deploy:production
# Verify no environment banner
# Verify dashboard: get_changelog → deploy commit registered
```

Rules:
- Never `firebase deploy` raw
- Never `npm run build` (defaults to production without env vars)
- Always verify environment banner post-deploy
- Staging must pass before production

#### Step 5 — Tech Lead Final Sign-Off (Role 12)

Before approving production deploy, confirm:
- [ ] All applicable roles have signed off
- [ ] Implementation matches the approved PLAN exactly
- [ ] No AGENTS.md anti-patterns introduced
- [ ] SHIP_GATES Definition of Done satisfied: working, measured, reversible, owned
- [ ] Dashboard shows correct state post-deploy
- [ ] Sign-off record completed (see `.anchor/skills/commit-format.md`)

---

## Anti-Patterns (Real Production Failures — Never Repeat)

These are documented incidents. Every role is responsible for preventing their relevant ones.

| # | Anti-Pattern | Caught By | Incident |
|---|-------------|-----------|---------|
| 1 | Deploy without approval | Role 09 + 12 | Rolled back 2026-01-29 |
| 2 | Create duplicate bug without checking dashboard | GATHER phase | Ongoing noise |
| 3 | Code without reading relevant docs | GATHER phase | Multiple regressions |
| 4 | Shared account double-counted in net worth | Role 06 | Data integrity bug |
| 5 | Breaking 200-line rule | Role 02 + 04 | Maintainability debt |
| 6 | Implementation before tests | Role 04 + 05 | Untested paths in prod |
| 7 | Desktop-first UI | Role 03 + 10 | 75% mobile users affected |
| 8 | Bypassing secureDb.ts | Role 04 + 07 | Security audit failure |
| 9 | Optimistic updates without rollback | Role 04 + 08 | Data loss risk |
| 10 | Updating deleted doc files | Role 12 | Git is source of truth |
| 11 | Raw `firebase deploy` | Role 09 | Wrong environment deployed |
| 12 | Production deploy without full test suite | Role 05 + 09 | Incident 2026-02-09 |
| 13 | Skipping GATHER phase | All roles | Duplicates, missed context |

---

## Commit Format (Dashboard Auto-Detects)

```
fix(scope): BUG-XXX short description
feat(scope): FEAT-XXX short description
refactor(scope): description
test(scope): description
docs(scope): description
chore(scope): description
deploy(env): vX.X.X @ HASH
```

Scope examples: `finance`, `fabric`, `family`, `mobile`, `auth`, `functions`, `security`

---

## Session Management

- After 4–5 tasks in one session: start a fresh conversation
- Always re-read `.anchor/INDEX.md` at the start of a new session
- Dashboard state is real-time; agent memory is not — always query dashboard, don't assume
