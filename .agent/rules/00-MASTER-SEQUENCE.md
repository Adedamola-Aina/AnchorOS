# ANCHOR OS - MASTER AGENT RULES

> ⚠️ **CRITICAL**: These rules are AUTOMATIC. Follow them on EVERY task without being asked.

---

## 📊 SINGLE SOURCE OF TRUTH

**Internal PM Dashboard**: `http://localhost:3001`

This dashboard is the **authoritative source** for:
- Bug tracking (duplicates, status, history)
- Feature requests (backlog, priorities)
- Kanban board state
- Environment parity (Dev/Staging/Production)
- Git history and deployments
- Velocity metrics

**ALWAYS query the dashboard before making decisions.**

---

## 🔴 MANDATORY SEQUENCE (AUTO-EXECUTE)

### PHASE 1: CONTEXT GATHERING

**STOP. You MUST do these steps FIRST. No exceptions.**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Query Dashboard Command Center                     │
│          curl http://localhost:3001/api/command-center      │
│          → Get full project state                           │
│          → Current sprint focus                             │
│          → Active alerts                                    │
│                                                             │
│  STEP 2: Read docs/PROJECT_STATUS.md                        │
│          → Current sprint details                           │
│          → In-progress tasks                                │
│          → Blockers                                         │
│                                                             │
│  STEP 3: Read docs/KNOWN_ISSUES.md                          │
│          → Check for DUPLICATES before logging new bugs     │
│          → Previous fix attempts                            │
│          → Related issues                                   │
│                                                             │
│  STEP 4: Read docs/ROADMAP.md                               │
│          → Task dependencies                                │
│          → Priorities                                       │
│          → What's already completed                         │
│                                                             │
│  STEP 5: Check Environment Parity                           │
│          curl http://localhost:3001/api/parity              │
│          → What's deployed where                            │
│          → What needs deployment                            │
└─────────────────────────────────────────────────────────────┘
```

**After gathering context, TELL THE USER:**
```
📋 Context Check Complete:

**Sprint**: [current focus]
**Task Status**: [tracked/not tracked/duplicate]
**Related Issues**: [BUG-XXX, FEAT-XXX or none]
**Dependencies**: [what must be done first]

**Environment Parity**:
- Dev: [version/status]
- Staging: [version/status]  
- Production: [version/status]

**Alerts**: [any from dashboard]
**Ready to proceed**: [Yes/No + reason if No]
```

---

### PHASE 2: PLANNING (BEFORE WRITING CODE)

**Create an implementation plan and CONFIRM with user:**

```
📝 Implementation Plan:

**Goal**: [What we're trying to achieve]

**Files to modify**:
- [ ] `src/...`
- [ ] `e2e/...`

**Tests to write**:
- [ ] Unit: [describe]
- [ ] E2E: [describe if needed]

**Risks**:
- [What could break]

**Sequence**:
1. Write failing test
2. Implement minimal code
3. Make test pass
4. Update docs

Shall I proceed? [WAIT FOR CONFIRMATION]
```

---

### PHASE 3: IMPLEMENTATION (TDD CYCLE)

**Follow this sequence strictly:**

```
┌─────────────────────────────────────────────────────────────┐
│  1. WRITE TEST FIRST                                        │
│     → Create failing test that defines expected behavior    │
│     → Run test → Confirm it FAILS                           │
│     → Tell user: "Test written and failing as expected"     │
│                                                             │
│  2. IMPLEMENT MINIMAL CODE                                  │
│     → Write just enough code to pass the test               │
│     → No extra features, no premature optimization          │
│                                                             │
│  3. RUN TEST                                                │
│     → Confirm test passes                                   │
│     → Run all related tests → Confirm nothing broke         │
│     → Tell user: "Tests passing"                            │
│                                                             │
│  4. REFACTOR (if needed)                                    │
│     → Clean up code                                         │
│     → Keep tests green                                      │
└─────────────────────────────────────────────────────────────┘
```

---

### PHASE 4: AFTER COMPLETION (AUTO-EXECUTE)

**MANDATORY updates. Do these AUTOMATICALLY:**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Update docs/PROJECT_STATUS.md                      │
│          → Move task from "In Progress" to "Completed"      │
│          → Add completion date                              │
│                                                             │
│  STEP 2: Update CHANGELOG.md                                │
│          → Add entry under [Unreleased]                     │
│          → Format: type(scope): description                 │
│                                                             │
│  STEP 3: If bug fix → Update docs/KNOWN_ISSUES.md           │
│          → Move from "Active" to "Recently Fixed"           │
│          → Add resolution details                           │
│          → Remove from backlog if it was there              │
│                                                             │
│  STEP 4: If feature → Update docs/ROADMAP.md                │
│          → Mark with ✅                                      │
│          → Update status                                    │
│          → Remove from FEATURE_SUGGESTIONS.md backlog       │
│                                                             │
│  STEP 5: Record Velocity                                    │
│          POST http://localhost:3001/api/velocity/record     │
│          → Track completion for metrics                     │
│                                                             │
│  STEP 6: Check Environment Parity                           │
│          GET http://localhost:3001/api/parity               │
│          → Report deployment status                         │
│          → Suggest next deployment if needed                │
└─────────────────────────────────────────────────────────────┘
```

**After updating, TELL THE USER:**
```
✅ Task Complete. Documents Updated:
- [x] PROJECT_STATUS.md - [what changed]
- [x] CHANGELOG.md - [entry added]
- [x] KNOWN_ISSUES.md - [if applicable]
- [x] ROADMAP.md - [if applicable]
- [x] FEATURE_SUGGESTIONS.md - [removed from backlog if applicable]
- [x] Velocity recorded

**Tests**: [X passing, 0 failing]

**Environment Status**:
| Environment | Has This Fix |
|-------------|--------------|
| Dev         | ✅           |
| Staging     | ❌           |
| Production  | ❌           |

**Next Step**: [Deploy to staging / Ready for production / Done]
```

---

## 🟡 WHEN YOU DON'T KNOW SOMETHING

**If you encounter uncertainty, STOP and ask. Use this format:**

```
🤔 Clarification Needed:

I'm uncertain about: [specific thing]

Options I see:
1. [Option A] - [pros/cons]
2. [Option B] - [pros/cons]

What I need to proceed:
- [specific information or decision]

Which would you prefer, or should I check [specific doc/code]?
```

**Common uncertainties to flag:**
- "I don't see this task in PROJECT_STATUS.md - should I add it?"
- "This might affect [other component] - should I check with you first?"
- "I found a related bug in KNOWN_ISSUES.md - should I address it too?"
- "The ROADMAP shows this depends on [X] - is that complete?"
- "I'm not sure which test pattern to use here - can you clarify?"

---

## 🐛 WHEN USER REPORTS A BUG

**Follow this sequence EXACTLY:**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Check for Duplicates                               │
│          GET http://localhost:3001/api/bugs                 │
│          → Search for similar descriptions                  │
│          → Check existing bug IDs                           │
│                                                             │
│  STEP 2: Check Git History                                  │
│          GET http://localhost:3001/api/git/search/{keyword} │
│          → Has this been fixed already?                     │
│          → Related commits?                                 │
│                                                             │
│  STEP 3: Check Environment Parity                           │
│          GET http://localhost:3001/api/parity               │
│          → Which environments are affected?                 │
│          → Is fix deployed somewhere but not everywhere?    │
└─────────────────────────────────────────────────────────────┘
```

**IF DUPLICATE FOUND:**
```
📋 Bug Analysis:

**Status**: This is a DUPLICATE of [BUG-XXX]

**Existing Bug**: [BUG-XXX] - [description]
**Current Status**: [Open/In Progress/Fixed]
**Priority**: [P0/P1/P2]

**Environment Status**:
| Env        | Affected | Fix Deployed |
|------------|----------|--------------|
| Dev        | ✅       | [Yes/No]     |
| Staging    | ✅       | [Yes/No]     |
| Production | ✅       | [Yes/No]     |

**Action**: No new bug created. Tracking existing [BUG-XXX].
```

**IF NEW BUG:**
```
📋 Bug Analysis:

**Status**: NEW BUG - No duplicates found

**Action Taken**:
1. Added to docs/KNOWN_ISSUES.md as [BUG-XXX]
2. Priority assigned: [P0/P1/P2] based on [reason]
3. Added to Kanban backlog

**Bug Details**:
- ID: [BUG-XXX]
- Description: [summary]
- Priority: [P0/P1/P2]
- Affected Environments: [list]

**Related**:
- Similar bugs: [none / BUG-XXX]
- Related commits: [none / list]
```

---

## ✨ WHEN USER REQUESTS A FEATURE

**Follow this sequence EXACTLY:**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Check Feature Backlog                              │
│          GET http://localhost:3001/api/features             │
│          → Search for similar requests                      │
│          → Check if already suggested                       │
│                                                             │
│  STEP 2: Check Roadmap                                      │
│          GET http://localhost:3001/api/roadmap              │
│          → Is this already planned?                         │
│          → Is it in progress?                               │
│          → Is it already completed?                         │
│                                                             │
│  STEP 3: Check Dependencies                                 │
│          → What would this feature need?                    │
│          → Does it depend on other planned work?            │
└─────────────────────────────────────────────────────────────┘
```

**IF DUPLICATE/EXISTING:**
```
📋 Feature Analysis:

**Status**: This feature is ALREADY TRACKED

**Location**: [ROADMAP.md / FEATURE_SUGGESTIONS.md]
**Current Status**: [Planned/In Progress/Completed]
**Priority**: [High/Medium/Low]

**Details**:
[Description of existing feature request]

**Action**: No new entry created. User informed of existing tracking.
```

**IF NEW FEATURE:**
```
📋 Feature Analysis:

**Status**: NEW FEATURE REQUEST

**Action Taken**:
1. Added to docs/FEATURE_SUGGESTIONS.md
2. Category: [Finance/UX/Security/etc.]
3. Priority: [High/Medium/Low] based on [reason]

**Feature Details**:
- Description: [summary]
- Category: [category]
- Priority: [priority]
- Dependencies: [list or none]

**Roadmap Impact**:
- Fits with: [related roadmap items]
- Blocks: [nothing / other items]
- Blocked by: [nothing / other items]
```

---

## 🔄 ENVIRONMENT PARITY AWARENESS

**Always be aware of what's deployed where:**

```
When completing ANY task, report:

📊 Environment Parity:

| Feature/Fix      | Dev | Staging | Production |
|------------------|-----|---------|------------|
| [This change]    | ✅  | ❌      | ❌         |

**Deployment Recommendation**:
- [x] Code complete and tested
- [ ] Deploy to Staging: `firebase deploy -P staging`
- [ ] Verify in Staging
- [ ] Deploy to Production: `firebase deploy -P production`
```

**Proactively mention:**
- "This fix is in Dev but NOT in Production - users are still affected"
- "This feature is in Staging - ready for production deploy"
- "There's a parity gap - Dev has fixes that Production doesn't"

---

## 🔵 QUICK REFERENCE

### Dashboard API Endpoints
| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `/api/command-center` | Full project state | Starting any task |
| `/api/bugs` | All bugs | User reports bug |
| `/api/features` | Feature backlog | User requests feature |
| `/api/roadmap` | Roadmap | Planning work |
| `/api/parity` | Environment status | Checking deployments |
| `/api/git/search/:keyword` | Search commits | Checking if fixed |
| `/api/velocity/record` | Record completion | Task complete |
| `/api/alerts` | Warnings | Before starting work |

### File Locations
| Document | Path | Read When | Update When |
|----------|------|-----------|-------------|
| Current Status | `docs/PROJECT_STATUS.md` | **EVERY TASK** | Task complete |
| Bug Tracking | `docs/KNOWN_ISSUES.md` | **EVERY TASK** | Bug fixed |
| Roadmap | `docs/ROADMAP.md` | **EVERY TASK** | Feature complete |
| Feature Backlog | `docs/FEATURE_SUGGESTIONS.md` | New features | Feature added/done |
| Changelog | `CHANGELOG.md` | - | **EVERY TASK** |
| Architecture | `docs/ARCHITECTURE_OVERVIEW.md` | Complex changes | Architecture changes |
| Schema | `docs/FIRESTORE_SCHEMA.md` | Database work | Schema changes |

### Test Commands
```bash
npm run test          # Unit tests (Vitest)
npm run e2e           # E2E tests (Playwright)
npm run lint          # Linting
npm run type-check    # TypeScript check
```

### Dashboard Commands
```bash
# Start dashboard
./tools/dashboard/dashboard.sh start

# Check dashboard status
./tools/dashboard/dashboard.sh status

# View dashboard logs
./tools/dashboard/dashboard.sh logs
```

### Commit Format
```
type(scope): brief description

Types: feat, fix, docs, style, refactor, test, chore
Example: fix(finance): prevent negative balance on transfer
```

---

## 🚫 FORBIDDEN ACTIONS

These actions are **NEVER** allowed:

1. ❌ Writing implementation code without a failing test first
2. ❌ Completing work without updating PROJECT_STATUS.md
3. ❌ Completing work without adding CHANGELOG.md entry
4. ❌ Deploying to production without staging verification
5. ❌ Ignoring errors or warnings
6. ❌ Using `any` type in TypeScript
7. ❌ Leaving console.log in production code
8. ❌ Making assumptions without checking docs first

---

## 📊 STATUS REPORTING FORMAT

**Always report status in this format:**

```
📊 Status Update:

Phase: [Context Check / Planning / Implementation / Completion]
Progress: [what's done / what's next]
Blockers: [none / describe blocker]
Tests: [X passing / Y failing]
Docs Updated: [list or "pending"]
```

---

## 🎯 SUMMARY: THE AUTOMATIC FLOW

```
USER REQUEST
     │
     ▼
┌─────────────────┐
│ PHASE 1: GATHER │ ← AUTO: Query Dashboard API + Read Docs
│ - command-center│     Check for duplicates
│ - parity        │     Check environment status
│ - PROJECT_STATUS│     Report findings to user
│ - KNOWN_ISSUES  │
│ - ROADMAP       │
└────────┬────────┘
         │
         ▼
    ┌────────────┐
    │ BUG REPORT?│──Yes──► Check duplicates → Log or report existing
    └─────┬──────┘
          │No
          ▼
    ┌────────────┐
    │ FEATURE?   │──Yes──► Check backlog → Log or report existing  
    └─────┬──────┘
          │No
          ▼
┌─────────────────┐
│ PHASE 2: PLAN   │ ← Create implementation plan
│ Confirm with    │     WAIT for user confirmation
│ user            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PHASE 3: BUILD  │ ← TDD: Test first, then implement
│ Test → Code →   │     Report progress
│ Test → Refactor │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PHASE 4: CLOSE  │ ← AUTO: Update all docs
│ - Update docs   │     Record velocity
│ - Record velocity│    Check parity
│ - Check parity  │     Report environment status
│ - Report status │     Suggest next deployment
└─────────────────┘
```

**This sequence is MANDATORY for every task.**
