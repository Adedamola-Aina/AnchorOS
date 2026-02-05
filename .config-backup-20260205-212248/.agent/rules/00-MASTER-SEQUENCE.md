---
trigger: always_on
---

# ANCHOR OS - MANDATORY WORKFLOW

> ⚠️ **YOU MUST FOLLOW THIS WORKFLOW ON EVERY TASK. NO EXCEPTIONS.**

---

## 🛑 STOP - READ THIS FIRST

Before doing ANYTHING, you MUST:

1. **CHECK** the dashboard for current project state
2. **CHECK** for duplicates before logging bugs/features
3. **REPORT** your findings to the user
4. **WAIT** for confirmation before implementing
5. **COMMIT** with correct prefixes after completing work (dashboard auto-updates)

**If you skip any step, STOP and go back.**

---

## 📋 PHASE 1: BEFORE STARTING (MANDATORY)

### For ANY task, check project state FIRST:
```bash
# Command Center - unified project view
curl -s http://localhost:3001/api/command-center

# Current bugs from git history
curl -s http://localhost:3001/api/git/bugs

# Roadmap with auto-detected progress
curl -s http://localhost:3001/api/git/roadmap

# Environment parity (dev/staging/prod)
curl -s http://localhost:3001/api/parity
```

### For BUG REPORTS, also check:
- Check `/api/git/bugs` for existing tracked bugs
- Search git: `curl http://localhost:3001/api/git/search/{keyword}`
- If duplicate, tell user: "This is already tracked as [BUG-XXX]"

### For FEATURE REQUESTS, also check:
- Check `roadmap.json` (`/api/git/roadmap`) for planned items
- Check `/api/git/features` for tracked features
- If duplicate, tell user: "This is already planned/tracked"

### REPORT to user:
```
📋 Context Check:
- Current State: [from /api/command-center]
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

### Git commit with correct prefix — dashboard auto-updates:
- `fix: BUG-XXX description` → Bug tracked and deployed automatically
- `feat: FEAT-XXX description` → Feature tracked automatically
- `deploy(env): vX.X.X @ COMMIT_HASH` → Deployment recorded

### If new planned work, add to `tools/dashboard/server/roadmap.json`

### REPORT to user:
```
✅ Task Complete.

**Files Changed:**
- [list code files]

**Git Commit**: `fix: BUG-XXX ...` (dashboard auto-updated)

**Tests:** [X passing]
**Ready for:** [dev/staging/production]
```

---

## 🚨 CRITICAL REMINDERS

### Before EVERY task:
- [ ] Did I check `/api/command-center`?
- [ ] Did I check `/api/git/bugs` for duplicates?
- [ ] Did I check `/api/git/roadmap`?
- [ ] Did I report findings to user?

### After EVERY task:
- [ ] Did I commit with correct prefix (fix:/feat:/etc)?
- [ ] Did I tell user what I committed?

### NEVER:
- ❌ Start coding without checking dashboard first
- ❌ Finish without committing with correct prefixes
- ❌ Deploy to production without approval
- ❌ Create files over 200 lines
- ❌ Skip writing tests

---

## 🔧 INTERNAL DASHBOARD

**Dashboard URL**: https://anchor.tail2fa2e.ts.net:3443/

The Internal PM Dashboard shows:
- Current bugs and their status (from git history)
- Feature backlog (from git + roadmap.json)
- Environment parity (dev/staging/prod via git ancestry)
- Git timeline and deploy markers
- Velocity metrics and cycle time

**Query via terminal** (local server on port 3001):
```bash
curl http://localhost:3001/api/command-center
curl http://localhost:3001/api/git/bugs
curl http://localhost:3001/api/parity
curl http://localhost:3001/api/git/kanban
```

**Browser access**: https://anchor.tail2fa2e.ts.net:3443/

---

## 💡 IF YOU FORGET

If you find yourself about to write code and realize you didn't:
1. Check the dashboard → STOP, go check it
2. Check for duplicates → STOP, go check
3. Get confirmation → STOP, ask user

If you just finished and realize you didn't:
1. Commit with correct prefix → DO IT NOW before saying "done"
2. Report updates → TELL THE USER what you committed

**The workflow is: CHECK → PLAN → CONFIRM → BUILD → COMMIT → REPORT**
