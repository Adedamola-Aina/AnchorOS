# CLAUDE AI - PROJECT MANAGEMENT INSTRUCTIONS

## 🎯 MANDATORY WORKFLOW

### BEFORE STARTING ANY WORK

**You MUST read these documents:**

**Priority 1 - Status & Roadmap (Source of Truth):**
1. `CLAUDE.md` - Development constitution (highest authority)
2. **Internal Dashboard**: https://anchor.tail2fa2e.ts.net:3443/
   - Project Status: `curl http://localhost:3001/api/command-center`
   - Roadmap: `curl http://localhost:3001/api/git/roadmap`
   - Bugs: `curl http://localhost:3001/api/git/bugs`
   - Browser: https://anchor.tail2fa2e.ts.net:3443/
3. **Git History**: Project truth is derived from commit messages (e.g., `feat: PWA-006`).

**Priority 2 - Technical Standards:**
5. `docs/TESTING_STRATEGY.md` - TDD protocol, test patterns, 80% coverage goal
6. `docs/FIRESTORE_SCHEMA.md` - Database schema, security rules, 8 collections
7. `docs/SECURITY.md` - Zero-trust model, threat analysis, security checklist
8. `docs/ERROR_HANDLING.md` - ErrorBoundary patterns, error strategies

**Priority 3 - Environment & Deployment:**
9. Dashboard `/api/parity` - What's deployed where (git ancestry-based)
10. `docs/ENVIRONMENT_SETUP.md` - Firebase hosting, env vars, build commands
11. `docs/VERSIONING.md` - Semantic versioning policy
12. `docs/ARCHITECTURE_OVERVIEW.md` - System architecture, Firebase CDN model

**DO NOT write code until you've confirmed you've read relevant docs for the task.**

---

### AFTER COMPLETING WORK

**You MUST perform these actions:**
- [ ] **Git Commit**: Use the correct ID (e.g., `feat: PWA-006 ...`) to update the dashboard automatically.
- [ ] If new planned work, add to `tools/dashboard/server/roadmap.json`
- [ ] Use deploy markers for deployments: `deploy(env): vX.X.X @ COMMIT_HASH`

**DO NOT** manually update deleted markdown files (`PROJECT_STATUS.md`, `ROADMAP.md`, `KNOWN_ISSUES.md`, `CHANGELOG.md`, `DEPLOYMENT_STATUS.md`, `FEATURE_SUGGESTIONS.md`).
**DO NOT** say "done" until Git commit with correct prefix is complete.

---

## 🚨 CRITICAL RULES

### Rule 1: NEVER START WITHOUT CHECKING DASHBOARD
❌ BAD: Start coding immediately
✅ GOOD: "Let me check the dashboard first..." [queries /api/command-center]

### Rule 2: NEVER FINISH WITHOUT CORRECT COMMIT
❌ BAD: "Bug fixed!" [no commit or wrong prefix]
✅ GOOD: "Bug fixed! Committing as `fix: BUG-XXX ...`"

### Rule 3: ALWAYS CHECK DEPENDENCIES
Before starting a feature, check `/api/git/roadmap` for:
- What does this depend on?
- What does this unblock?
- Why is this prioritized?

### Rule 4: TRACK EVERYTHING VIA GIT
If you:
- Fix a bug → Commit with `fix: BUG-XXX description`
- Complete a feature → Commit with `feat: FEAT-XXX description`
- Deploy anywhere → Use deploy marker: `deploy(env): vX.X.X @ HASH`
- New planned work → Add to `roadmap.json`

### Rule 5: ASSUME NOTHING
❌ Don't assume: "I remember we fixed this"
✅ Always verify: Check `/api/git/bugs`

### Rule 6: UNIFIED VERSIONING
All features are part of the whole app, not standalone modules.
❌ BAD: "Fabric AI v2.0", "Family Mode v3.0" 
✅ GOOD: "Anchor OS v1.5.0" (contains all features)

Features ship together, not in isolation. Reference app version, not module version.

### Rule 7: DEVELOPER TOOLS PARITY
When adding new features, update Developer Tools to simulate real-world behavior.

**Files to update:**
- `src/utils/seeder.ts` - Add test data for new features
- `src/features/settings/components/DeveloperTools.tsx` - Add simulation buttons

**Current capabilities:**
- Seed Data: Accounts, Transactions (60), Commitments (11)
- Family Simulation: Spouse, shared accounts, notifications
- Account Fixes: Scope corrections

**Rule**: If a feature can't be tested via Developer Tools, the feature is incomplete.

### Rule 8: INTAKE WORKFLOW (Bugs, Features, Requests)
When ANYTHING is reported (bug, feature request, suggestion, feedback):

---

**STEP 0: CHECK FOR DUPLICATES FIRST**
Before creating a new entry, check the dashboard:
- `curl http://localhost:3001/api/git/bugs` - Is this bug already tracked?
- `curl http://localhost:3001/api/git/features` - Is this feature already tracked?
- `curl http://localhost:3001/api/git/roadmap` - Is this already planned?

If duplicate found:
- Link to existing entry
- Do NOT create duplicate

---

**STEP 1: CLASSIFY THE REPORT**

| Type | ID Prefix | Tracking |
|------|-----------|----------|
| Bug | BUG-XXX | Git commit: `fix: BUG-XXX ...` |
| Regression | REG-XXX | Git commit: `fix: REG-XXX ...` |
| Technical Gap | GAP-XXX | Git commit: `feat: GAP-XXX ...` |
| Feature Request | FEAT-XXX | Git commit: `feat: FEAT-XXX ...` |
| Enhancement | UX-XXX | Git commit: `feat: UX-XXX ...` |
| User Feedback | N/A | `docs/USER_FEEDBACK.md` |

---

**STEP 2: ASSIGN ID**
- Check existing IDs: `curl http://localhost:3001/api/intake/next-id?type=bug`
- Or use roadmap.json to find highest existing ID for prefix
- Increment: BUG-001 → BUG-002, FEAT-001 → FEAT-002, etc.

---

**STEP 3: ADD TO ROADMAP & COMMIT**

For new planned work, add to `tools/dashboard/server/roadmap.json`:
```json
{
    "id": "BUG-XXX",
    "team": "Engineering",
    "priority": "P1",
    "title": "Short description",
    "status": "planned",
    "detectionPatterns": ["BUG-XXX", "keyword"],
    "effort": "medium",
    "impact": "high"
}
```

Then commit the fix with correct prefix:
```
fix: BUG-XXX Short description
feat: FEAT-XXX Short description
```

---

**STEP 4: SET PRIORITY**
- P0 (Critical) - App unusable, data loss, security, user-blocking
- P1 (High) - Major feature broken, significant UX issue
- P2 (Low) - Minor issues, polish, nice-to-have

---

**STEP 5: DASHBOARD AUTO-UPDATES**
The Dashboard (https://anchor.tail2fa2e.ts.net:3443/) reads directly from **Git Commit History**:
- `fix(scope): BUG-XXX ...` → Updates Bug Status
- `feat(scope): FEAT-XXX ...` → Updates Feature Status
- `deploy(env): vX.X.X @ HASH` → Updates Deployment Status

**You do NOT need to update markdown files.** Just commit correctly.

---

**QUICK REFERENCE: Report Type Decision Tree**
```
Is something BROKEN?
  └─ YES → Bug/Regression → commit as fix: BUG-XXX / REG-XXX
  └─ NO ↓

Is it a NEW CAPABILITY request?
  └─ YES → Feature Request → add to roadmap.json, commit as feat: FEAT-XXX
  └─ NO ↓

Is it an IMPROVEMENT to existing feature?
  └─ YES → Enhancement → commit as feat: UX-XXX
  └─ NO ↓

Is it FEEDBACK or OPINION?
  └─ YES → User Feedback → docs/USER_FEEDBACK.md
```

---

## 💬 COMMUNICATION TEMPLATES

### When Starting Work
```
"I'm starting work on [TASK]. Let me check the context first..."

[Checks /api/command-center, /api/git/bugs, /api/git/roadmap]

"Here's my understanding:
- Priority: [P0/P1/P2]
- Dependencies: [None / Requires X]
- Reason: [Why we're building this]
- Deploy Target: [Dev/Staging/Prod]

Proceeding with TDD approach. ETA: [X hours/days]"
```

### When Completing Work
```
"✅ Completed: [TASK]

Summary:
- Tests: ✅ All passing
- Git Commit: fix: BUG-XXX ... (dashboard auto-updated)
- Deploy: ✅ [Environment] @ [timestamp]

Ready for next task."
```

### When Blocked
```
"⚠️ Blocked on [TASK]

Issue: [Description]
Impact: [What this blocks]
Options:
A) [Option 1]
B) [Option 2]

Awaiting decision."
```

---

## 📋 DAILY CHECKLIST

### Morning (Before Any Code)
- [ ] Check `/api/command-center` (current project state)
- [ ] Check `/api/git/roadmap` (understand priorities)
- [ ] Check `/api/git/bugs` (don't reintroduce bugs)
- [ ] Check `/api/parity` (know what's deployed where)

### Evening (Before Ending Session)
- [ ] Commit all work with correct prefixes (dashboard auto-updates)
- [ ] Verify `/api/parity` reflects new deployments

---

## 🎯 SUCCESS CRITERIA

You're successful when:
- ✅ Never work on already-fixed bugs
- ✅ Never build features that conflict with priorities
- ✅ Always know what's deployed where
- ✅ Always understand dependencies before starting
- ✅ Always commit with correct prefixes (dashboard auto-updates)
- ✅ Never say "I don't remember" (check dashboard instead)

---

**Last Updated**: 2026-02-05
**Maintained By**: Teeto
**Purpose**: Ensure Claude AI never forgets context
