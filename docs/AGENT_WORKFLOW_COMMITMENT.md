# AGENT WORKFLOW COMMITMENT

**Created**: 2026-01-31  
**Purpose**: Ensure AI agent always follows Anchor OS development constitution

---

## 🎯 MANDATORY PRE-WORK CHECKLIST

**BEFORE writing ANY code, I MUST:**

- [ ] Read `CLAUDE.md` - Development constitution (highest authority)
- [ ] Read `docs/PROJECT_STATUS.md` - Current sprint, priorities, what's in progress
- [ ] Read `docs/ROADMAP.md` - Why we're building this, dependencies
- [ ] Read `docs/KNOWN_ISSUES.md` - Active bugs (don't reintroduce or duplicate!)
- [ ] Check for duplicates in relevant docs
- [ ] Understand dependencies and ripple effects

**If fixing a bug:**
- [ ] Check `docs/KNOWN_ISSUES.md` - Is this already logged?
- [ ] Write failing test FIRST (TDD mandate)

**If building a feature:**
- [ ] Check `docs/FEATURE_SUGGESTIONS.md` - Is this already suggested?
- [ ] Check `docs/ROADMAP.md` - Is this already planned?
- [ ] Understand why we're building this
- [ ] Write failing test FIRST (TDD mandate)

---

## ✅ MANDATORY POST-WORK CHECKLIST

**AFTER completing ANY work, I MUST:**

- [ ] Update `docs/PROJECT_STATUS.md` - Mark task complete, update timestamp
- [ ] Update `CHANGELOG.md` - Document the change
- [ ] Update `docs/KNOWN_ISSUES.md` - Move bug to "Recently Fixed" (if applicable)
- [ ] Update `docs/DEPLOYMENT_STATUS.md` - Record deployment (if applicable)
- [ ] Update `docs/ROADMAP.md` - Mark feature complete (if applicable)
- [ ] Verify all tests pass
- [ ] Commit with structured message

**DO NOT say "done" until ALL relevant docs are updated.**

---

## 🚨 CRITICAL RULES I WILL NEVER VIOLATE

### Rule 1: TDD Mandate
**NEVER write implementation code without a failing test first.**
- Write test → See it fail → Write minimal code → See it pass → Refactor

### Rule 2: 200-Line Rule
**No file exceeds 200 lines.** If it does, split it. No exceptions.

### Rule 3: Systems Thinking
**Before changing ANY code, answer:**
1. What imports this module?
2. What does this module import?
3. What state does this affect?
4. What user flows pass through here?
5. What happens if this fails?

### Rule 4: Check for Duplicates
**ALWAYS search before creating:**
- Bug reports → `docs/KNOWN_ISSUES.md`
- Feature requests → `docs/FEATURE_SUGGESTIONS.md`
- Planned work → `docs/ROADMAP.md`

### Rule 5: Document Everything
**Track ALL work:**
- Fix a bug → Update `KNOWN_ISSUES.md`
- Complete a feature → Update `ROADMAP.md` + `PROJECT_STATUS.md`
- Deploy anywhere → Update `DEPLOYMENT_STATUS.md`

### Rule 6: Security First
**Every line of code must be secure:**
- Validate all input (Zod schemas)
- Encode all output (React auto-escapes)
- Verify auth on protected routes
- Never log sensitive data

### Rule 7: Performance Budget
**Respect the limits:**
- Total JS Bundle: < 500 KB gzipped
- Initial Load: < 200 KB gzipped
- FCP: < 1.5s, LCP: < 2.5s, TTI: < 3.5s

---

## 📋 ISSUE CLASSIFICATION

When user reports something, classify correctly:

| Type | ID Format | Destination |
|------|-----------|-------------|
| **BUG** | BUG-XXX | `docs/KNOWN_ISSUES.md` |
| **REGRESSION** | REG-XXX | `docs/KNOWN_ISSUES.md` (Regressions) |
| **GAP** | GAP-XXX | `docs/KNOWN_ISSUES.md` (Gaps) |
| **FEATURE** | FEAT-XXX | `docs/FEATURE_SUGGESTIONS.md` |
| **TASK** | TASK-XXX | `docs/PROJECT_STATUS.md` |

**Always check for duplicates first!**

---

## 💬 COMMUNICATION TEMPLATES

### Starting Work
```
"Let me check the context first..."
[Reads CLAUDE.md, PROJECT_STATUS.md, ROADMAP.md, KNOWN_ISSUES.md]

"Here's my understanding:
- Priority: [P0/P1/P2]
- Dependencies: [None / Requires X]
- Reason: [Why we're building this]

Proceeding with TDD approach."
```

### Completing Work
```
"✅ Completed: [TASK]

Summary:
- Tests: ✅ All passing
- Docs Updated:
  - docs/PROJECT_STATUS.md ✅
  - CHANGELOG.md ✅
  - docs/KNOWN_ISSUES.md ✅ (if applicable)

Ready for next task."
```

---

## 🎯 SUCCESS CRITERIA

I'm successful when:
- ✅ Never work on already-fixed bugs
- ✅ Never build features that conflict with priorities
- ✅ Always know what's deployed where
- ✅ Always understand dependencies before starting
- ✅ Always update docs after completing work
- ✅ Never say "I don't remember" (check docs instead)
- ✅ Always follow TDD (test first, then code)
- ✅ Always respect the 200-line rule
- ✅ Always think about security and performance

---

## 📚 KEY DOCUMENTS (Always Available)

**Constitution & Standards:**
- `CLAUDE.md` - Development constitution
- `CLAUDE_INSTRUCTIONS_ADDON.md` - Workflow instructions

**Current State:**
- `docs/PROJECT_STATUS.md` - What's happening now
- `docs/ROADMAP.md` - What's planned and why
- `docs/KNOWN_ISSUES.md` - Active bugs
- `docs/DEPLOYMENT_STATUS.md` - What's deployed where

**Technical Standards:**
- `docs/TESTING_STRATEGY.md` - TDD protocol
- `docs/FIRESTORE_SCHEMA.md` - Database schema
- `docs/SECURITY.md` - Security checklist
- `docs/ERROR_HANDLING.md` - Error boundaries

---

**This is my commitment. I will follow this workflow on EVERY task, EVERY time, without exception.**

**Last Updated**: 2026-01-31  
**Maintained By**: Agent  
**Purpose**: Never forget the constitution
