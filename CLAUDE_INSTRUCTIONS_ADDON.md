# CLAUDE AI - PROJECT MANAGEMENT INSTRUCTIONS

## 🎯 MANDATORY WORKFLOW

### BEFORE STARTING ANY WORK

**You MUST read these documents:**

**Priority 1 - Status & Roadmap (Source of Truth):**
1. `CLAUDE.md` - Development constitution (highest authority)
2. **Internal Dashboard**: http://localhost:3001
   - Project Status: `curl http://localhost:3001/api/command-center`
   - Roadmap: `curl http://localhost:3001/api/roadmap`
   - Bugs: `curl http://localhost:3001/api/bugs`
3. **Git History**: Project truth is derived from commit messages (e.g., `feat: PWA-006`).

**Priority 2 - Technical Standards:**
5. `docs/TESTING_STRATEGY.md` - TDD protocol, test patterns, 80% coverage goal
6. `docs/FIRESTORE_SCHEMA.md` - Database schema, security rules, 8 collections
7. `docs/SECURITY.md` - Zero-trust model, threat analysis, security checklist
8. `docs/ERROR_HANDLING.md` - ErrorBoundary patterns, error strategies

**Priority 3 - Environment & Deployment:**
9. `docs/DEPLOYMENT_STATUS.md` - What's deployed where (dev/staging/prod)
10. `docs/ENVIRONMENT_SETUP.md` - Firebase hosting, env vars, build commands
11. `docs/VERSIONING.md` - Semantic versioning policy
12. `docs/ARCHITECTURE_OVERVIEW.md` - System architecture, Firebase CDN model

**DO NOT write code until you've confirmed you've read relevant docs for the task.**

---

### AFTER COMPLETING WORK

**You MUST perform these actions:**
- [ ] **Git Commit**: Use the correct ID (e.g., `feat: PWA-006 ...`) to update the dashboard automatically.
- [ ] `CHANGELOG.md` - Document the change.
- [ ] `docs/DEPLOYMENT_STATUS.md` - Record deployment (if applicable).

**DO NOT** manually update `PROJECT_STATUS.md`, `ROADMAP.md`, or `KNOWN_ISSUES.md` (they are deprecated).
**DO NOT** say "done" until Git and Deployment checks are complete.

---

## 🚨 CRITICAL RULES

### Rule 1: NEVER START WITHOUT READING
❌ BAD: Start coding immediately
✅ GOOD: "Let me check the context first..." [reads docs]

### Rule 2: NEVER FINISH WITHOUT UPDATING
❌ BAD: "Bug fixed!" [docs not updated]
✅ GOOD: "Bug fixed! Updating docs..." [updates docs]

### Rule 3: ALWAYS CHECK DEPENDENCIES
Before starting a feature, check docs/ROADMAP.md for:
- What does this depend on?
- What does this unblock?
- Why is this prioritized?

### Rule 4: TRACK EVERYTHING
If you:
- Fix a bug → Update KNOWN_ISSUES.md
- Complete a feature → Update ROADMAP.md + PROJECT_STATUS.md
- Deploy anywhere → Update DEPLOYMENT_STATUS.md
- Respond to feedback → Update USER_FEEDBACK.md

### Rule 5: ASSUME NOTHING
❌ Don't assume: "I remember we fixed this"
✅ Always verify: Read KNOWN_ISSUES.md

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
Before creating a new entry, search these files:
- `docs/KNOWN_ISSUES.md` - Is this bug already logged?
- `docs/FEATURE_SUGGESTIONS.md` - Is this feature already suggested?
- `docs/ROADMAP.md` - Is this already planned/in progress?
- `docs/USER_FEEDBACK.md` - Has this been reported before?

If duplicate found:
- Link to existing entry
- Update existing entry with new context if needed
- Do NOT create duplicate

---

**STEP 1: CLASSIFY THE REPORT**

| Type | ID Prefix | File |
|------|-----------|------|
| Bug | BUG-XXX | `docs/KNOWN_ISSUES.md` |
| Regression | REG-XXX | `docs/KNOWN_ISSUES.md` |
| Technical Gap | GAP-XXX | `docs/KNOWN_ISSUES.md` |
| Feature Request | REQ-XXX | `docs/FEATURE_SUGGESTIONS.md` |
| Enhancement | (Use existing ID) | `docs/FEATURE_SUGGESTIONS.md` |
| User Feedback | N/A | `docs/USER_FEEDBACK.md` |

---

**STEP 2: ASSIGN ID**
- Check last ID in the target file
- Increment: BUG-001 → BUG-002, REQ-001 → REQ-002, etc.

---

**STEP 3: ADD TO APPROPRIATE FILE**

**For Bugs (KNOWN_ISSUES.md):**
```markdown
### [BUG-XXX] Short description
- **Reported**: YYYY-MM-DD
- **Reporter**: [Teeto / User / Agent]
- **Impact**: What's broken
- **Root Cause**: Why it's happening (if known)
- **Fix**: Proposed solution
- **Assigned**: [Teeto / Unassigned]
- **Target**: YYYY-MM-DD
- **Status**: [Not Started / Investigating / In Progress / Fixed]
- **Workaround**: Temporary fix (if any)
```

**For Feature Requests (FEATURE_SUGGESTIONS.md):**
```markdown
#### [REQ-XXX] Feature Name
- **Requested**: YYYY-MM-DD
- **Requester**: [Teeto / User]
- **Category**: [Finance / Auth / UI / etc.]
- **Priority**: [High / Medium / Low]
- **Suggestion**: What they want
- **Impact**: Why it matters
- **Effort**: [Low / Medium / High]
- **Status**: [Backlog / Under Review / Planned / In Progress]
```

---

**STEP 4: SET PRIORITY**
- 🔴 P0 (Critical) - App unusable, data loss, security, user-blocking
- 🟡 P1 (High) - Major feature broken, significant UX issue
- 🟢 P2 (Low) - Minor issues, polish, nice-to-have

---

**STEP 5: ASSIGN OWNER**
- Teeto (Owner/Lead) - Default for most items
- Agent (AI Assistant) - Research, documentation, implementation

---

**STEP 6: DASHBOARD AUTO-UPDATES**
The Dashboard (http://localhost:3001) reads directly from **Git Commit History**:
- `fix(scope): BUG-XXX ...` → Updates Bug Status
- `feat(scope): REQ-XXX ...` → Updates Feature Status
- `deploy(env): ...` → Updates Deployment Status

**You do NOT need to update markdown files.** Just commit correctly.

---

**QUICK REFERENCE: Report Type Decision Tree**
```
Is something BROKEN?
  └─ YES → Bug/Regression → KNOWN_ISSUES.md
  └─ NO ↓

Is it a NEW CAPABILITY request?
  └─ YES → Feature Request → FEATURE_SUGGESTIONS.md
  └─ NO ↓

Is it an IMPROVEMENT to existing feature?
  └─ YES → Enhancement → FEATURE_SUGGESTIONS.md (update existing)
  └─ NO ↓

Is it FEEDBACK or OPINION?
  └─ YES → User Feedback → USER_FEEDBACK.md
```

---

## 💬 COMMUNICATION TEMPLATES

### When Starting Work
```
"I'm starting work on [TASK]. Let me check the context first..."

[Reads PROJECT_STATUS.md, ROADMAP.md, KNOWN_ISSUES.md]

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
- Deploy: ✅ [Environment] @ [timestamp]
- Docs Updated:
  - docs/PROJECT_STATUS.md (marked complete)
  - CHANGELOG.md (added entry)
  - docs/KNOWN_ISSUES.md (moved bug to fixed)

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

Updated PROJECT_STATUS.md with blocker. Awaiting decision."
```

---

## 📋 DAILY CHECKLIST

### Morning (Before Any Code)
- [ ] Read PROJECT_STATUS.md (current state)
- [ ] Check ROADMAP.md (understand why)
- [ ] Review KNOWN_ISSUES.md (don't reintroduce bugs)
- [ ] Check DEPLOYMENT_STATUS.md (know what's where)
- [ ] Scan USER_FEEDBACK.md (understand pain points)

### Evening (Before Ending Session)
- [ ] Update PROJECT_STATUS.md (mark progress)
- [ ] Update CHANGELOG.md (document changes)
- [ ] Update KNOWN_ISSUES.md (if bugs fixed)
- [ ] Update DEPLOYMENT_STATUS.md (if deployed)

---

## 🎯 SUCCESS CRITERIA

You're successful when:
- ✅ Never work on already-fixed bugs
- ✅ Never build features that conflict with priorities
- ✅ Always know what's deployed where
- ✅ Always understand dependencies before starting
- ✅ Always update docs after completing work
- ✅ Never say "I don't remember" (check docs instead)

---

**Last Updated**: 2026-01-26
**Maintained By**: Teeto
**Purpose**: Ensure Claude AI never forgets context
