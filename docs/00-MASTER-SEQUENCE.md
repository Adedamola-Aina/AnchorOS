
# ANCHOR OS - MANDATORY WORKFLOW

> ⚠️ **YOU MUST FOLLOW THIS WORKFLOW ON EVERY TASK. NO EXCEPTIONS.**

---

## 🛑 STOP - READ THIS FIRST

Before doing ANYTHING, you MUST:

1. **READ** the relevant docs (listed below)
2. **CHECK** for duplicates before logging bugs/features
3. **REPORT** your findings to the user
4. **WAIT** for confirmation before implementing
5. **UPDATE** docs after completing work

**If you skip any step, STOP and go back.**

---

## 📋 PHASE 1: BEFORE STARTING (MANDATORY)

### For ANY task, CHECK DASHBOARD FIRST:
Query the internal dashboard for real-time status (Git-based Source of Truth):
```bash
curl http://localhost:3001/api/command-center  # Unified View
curl http://localhost:3001/api/git/bugs        # Known Issues (from Git)
curl http://localhost:3001/api/git/roadmap     # Roadmap (Auto-detected)
```

### For BUG REPORTS, also check:
- Is this bug already listed in the Dashboard? (`/api/git/bugs`)
- Search for similar descriptions in Git history.

### For FEATURE REQUESTS, also check:
- Is this in the Roadmap? (`/api/git/roadmap`)
- Is this in the Backlog? (`/api/features`)

### REPORT to user:
```
📋 Context Check (Dashboard):
- Sprint Status: [from /api/command-center]
- Active Issues: [from /api/git/bugs]
- Roadmap Item: [if applicable]
- Ready to proceed: Yes/No
```

---

## 📋 PHASE 2: PLANNING (MANDATORY)

Before writing ANY code:

1. Create an implementation plan
2. List files to modify
3. List tests to write
4. **WAIT for user confirmation**

```
📝 Implementation Plan:
- Goal: [what we're doing]
- Files: [list]
- Tests: [list]
- Risks: [what could break]

Shall I proceed?
```

**DO NOT write code until user confirms.**

---

## 📋 PHASE 3: IMPLEMENTATION

Follow TDD:
1. Write failing test FIRST
2. Implement minimal code
3. Make test pass
4. Refactor if needed

---

## 📋 PHASE 4: AFTER COMPLETION (MANDATORY)

### YOU MUST DO THIS:

**1. COMMIT TO GIT (The Source of Truth)**
   - Use meaningful messages with tags:
     - `feat: ...` for features
     - `fix: BUG-XXX ...` for bugs
     - `docs: ...` for documentation
   - **This AUTOMATICALLY updates the Dashboard.**

**2. SYNC DASHBOARD**
   - Run: `curl -X POST http://localhost:3001/api/refresh`
   - Verify update at `http://localhost:3001/api/command-center`

### REPORT to user:
```
✅ Task Complete.

**Files Changed:**
- [list code files]

**Dashboard Updated:**
- [x] Git Commit: [Message]
- [x] Dashboard Synced

**Tests:** [X passing]
**Ready for:** [dev/staging/production]
```

---

## 🚨 CRITICAL REMINDERS

### Before EVERY task:
- [ ] Did I check the Dashboard Context?
- [ ] Did I check for duplicates in Git/Dashboard?
- [ ] Did I report findings to user?

### After EVERY task:
- [ ] Did I COMMIT to Git with correct tags?
- [ ] Did I SYNC the Dashboard (`/api/refresh`)?
- [ ] Did I tell user what I updated?

### NEVER:
- ❌ Start coding without checking Dashboard first
- ❌ Finish without committing + syncing
- ❌ Deploy to production without approval
- ❌ Create files over 200 lines
- ❌ Skip writing tests

---

## 📊 CURRENT PROJECT STATE

**Read `docs/PROJECT_STATUS.md` for latest, but key points:**

- **Current Focus**: Marketing Website (P0)
- **Active Bugs in Testing**: BUG-008 through BUG-014
- **Production**: v1.5.0 (stable)
- **Dev/Staging**: v1.5.2-dev (testing)

**Active Bug IDs** (check before logging new):
- BUG-008: Transaction History UI Inconsistency
- BUG-009: Dark Mode White Edge
- BUG-010: Transaction List Spacing
- BUG-011: Empty List Scroll
- BUG-012: Task Box Too Large
- BUG-013: Redundant Icons
- BUG-014: Transaction List Layout

---

## 🔧 INTERNAL DASHBOARD

The Internal PM Dashboard at `http://localhost:3001` shows:
- Current bugs and their status
- Feature backlog
- Environment parity
- Git history

**If you can execute commands**, query it:
```bash
curl http://localhost:3001/api/command-center
curl http://localhost:3001/api/bugs
curl http://localhost:3001/api/parity
```

**If you cannot execute commands**, ask user to check dashboard or read the docs directly.

---

## 💡 IF YOU FORGET

If you find yourself about to write code and realize you didn't:
1. Read the docs → STOP, go read them
2. Check for duplicates → STOP, go check
3. Get confirmation → STOP, ask user

If you just finished and realize you didn't:
1. Update docs → DO IT NOW before saying "done"
2. Add changelog → DO IT NOW
3. Report updates → TELL THE USER what you updated

**The workflow is: READ → PLAN → CONFIRM → BUILD → UPDATE → REPORT**
