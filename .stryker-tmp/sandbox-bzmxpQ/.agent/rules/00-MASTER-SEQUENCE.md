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

### For ANY task, read these files FIRST:
```
docs/PROJECT_STATUS.md    → Current sprint, what's in progress
docs/KNOWN_ISSUES.md      → Existing bugs (check for duplicates!)
docs/ROADMAP.md           → Planned features, priorities
```

### For BUG REPORTS, also check:
- Is this bug already listed in `docs/KNOWN_ISSUES.md`?
- Search for similar descriptions (BUG-008 through BUG-014 are active)
- If duplicate, tell user: "This is already tracked as [BUG-XXX]"

### For FEATURE REQUESTS, also check:
- Is this in `docs/FEATURE_SUGGESTIONS.md`?
- Is this in `docs/ROADMAP.md`?
- If duplicate, tell user: "This is already planned/tracked"

### REPORT to user:
```
📋 Context Check:
- Current Sprint: [from PROJECT_STATUS.md]
- Related Issues: [any duplicates found]
- Dependencies: [if any]
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

### YOU MUST UPDATE THESE FILES:

**Always update:**
- `docs/PROJECT_STATUS.md` - Mark task complete, add to "Recently Completed"
- `CHANGELOG.md` - Add entry under [Unreleased]

**If bug fix:**
- `docs/KNOWN_ISSUES.md` - Move bug to "Recently Fixed" section

**If feature complete:**
- `docs/ROADMAP.md` - Mark with ✅
- `docs/FEATURE_SUGGESTIONS.md` - Remove from backlog if it was there

### REPORT to user:
```
✅ Task Complete. 

**Files Changed:**
- [list code files]

**Docs Updated:**
- [ ] PROJECT_STATUS.md - [describe update]
- [ ] CHANGELOG.md - [entry added]
- [ ] KNOWN_ISSUES.md - [if applicable]
- [ ] ROADMAP.md - [if applicable]

**Tests:** [X passing]
**Ready for:** [dev/staging/production]
```

---

## 🚨 CRITICAL REMINDERS

### Before EVERY task:
- [ ] Did I read PROJECT_STATUS.md?
- [ ] Did I check KNOWN_ISSUES.md for duplicates?
- [ ] Did I check ROADMAP.md?
- [ ] Did I report findings to user?

### After EVERY task:
- [ ] Did I update PROJECT_STATUS.md?
- [ ] Did I add CHANGELOG.md entry?
- [ ] Did I update KNOWN_ISSUES.md (if bug)?
- [ ] Did I update ROADMAP.md (if feature)?
- [ ] Did I tell user what I updated?

### NEVER:
- ❌ Start coding without reading docs first
- ❌ Finish without updating docs
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
