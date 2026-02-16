# AGENT WORKFLOW COMMITMENT

**Created**: 2026-01-31  
**Purpose**: Ensure AI agent always follows Anchor OS development constitution

---

## 🎯 MANDATORY PRE-WORK CHECKLIST

**BEFORE writing ANY code, I MUST:**

- [ ] Read `CLAUDE.md` - Development constitution (highest authority)
- [ ] Check **Internal Dashboard** (http://localhost:3001) for current Roadmap/Parity status
- [ ] Check `roadmap.json` (server/roadmap.json) for dependencies and status
- [ ] Check for duplicates via Dashboard Search or `tools/dashboard/server/roadmap.json`
- [ ] Understand dependencies and ripple effects

**If fixing a bug:**
- [ ] Search Dashboard: Is this already logged as `BUG-XXX`?
- [ ] Write failing test FIRST (TDD mandate)

**If building a feature:**
- [ ] Check Dashboard Roadmap: Is this already planned?
- [ ] Understand why we're building this
- [ ] Write failing test FIRST (TDD mandate)

---

## ✅ MANDATORY POST-WORK CHECKLIST

**AFTER completing ANY work, I MUST:**

- [ ] Run `npm test` to ensure ALL tests pass
- [ ] **Commit with Semantic Message**: `feat(scope): UX-123 message` (triggers dashboard)
- [ ] Verify Dashboard shows updated status (Environment Parity)
- [ ] Verify `roadmap.json` status is correct (if applicable)

**DO NOT update Markdown files manually (Project Status, Changelog). Git is the Source of Truth.**

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
- Bug reports → `git log --oneline --grep="BUG-"` or Dashboard `/api/git/bugs`
- Feature requests → Dashboard `/api/git/features`
- Planned work → Dashboard `/api/command-center`

### Rule 5: Track via Git & Roadmap
**Git History is the Source of Truth:**
- **Bug Fix**: Commit with `fix(scope): BUG-123 description`
- **Feature**: Commit with `feat(scope): UX-123 description`
- **Dashboard**: Verify the dashboard picks up your commit automatically.

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
| **BUG** | BUG-XXX | Git commit with `fix:` prefix |
| **REGRESSION** | REG-XXX | Git commit with `fix:` prefix |
| **GAP** | GAP-XXX | Git commit with `fix:` or `feat:` prefix |
| **FEATURE** | FEAT-XXX | Git commit with `feat:` prefix |
| **TASK** | TASK-XXX | Git commit with `chore:` or `refactor:` prefix |

**Always check git history for duplicates first!**

---

## 💬 COMMUNICATION TEMPLATES

### Starting Work
```
"Let me check the context first..."
[Checks Dashboard, roadmap.json, CLAUDE.md]

"Here's my understanding:
- ID: [UX-XXX / BUG-XXX]
- Priority: [P0/P1/P2]
- Reason: [Why we're building this]

Proceeding with TDD approach."
```

### Completing Work
```
"✅ Completed: [TASK]

Summary:
- Tests: ✅ All passing
- Commit: `feat(ui): UX-123 - Implemented adaptive height`
- Verification: Dashboard updated, Parity checker confirms Dev status.

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

### 🏛️ Constitution & Core Standards
- `CLAUDE.md` - **Development constitution (HIGHEST AUTHORITY)**
- `CLAUDE_INSTRUCTIONS_ADDON.md` - **Mandatory workflow instructions**
- `docs/ENGINEERING_EXECUTION_STANDARD.md` - Engineering excellence standards

### 📊 Current State & Planning
- **Dashboard** - `https://anchor.tail2fa2e.ts.net:3443/` - Live project state
- `docs/VERSIONING.md` - Version policy and current versions
- `docs/USER_FEEDBACK.md` - User feedback and requests
- **Git commits** - Source of truth for bugs, features, and changelog

### 🏗️ Architecture & Design
- `docs/ARCHITECTURE_OVERVIEW.md` - System architecture (50KB - comprehensive!)
- `docs/FIRESTORE_SCHEMA.md` - Database schema, 8 collections, security rules
- `docs/ANCHOR_FINANCE_SPEC.md` - Finance module specification
- `docs/adr/FAMILY_SHARING_V3_REDESIGN.md` - Family sharing architecture
- `docs/adr/FAMILY_SHARING_V3_IMPLEMENTATION.md` - Family sharing implementation
- `docs/architecture/` - Additional architecture docs

### 🎨 Design System
- `docs/DESIGN_PHILOSOPHY.md` - Calm computing principles
- `docs/DESIGN_TOKENS.md` - Color system, spacing, typography tokens
- `docs/BUTTON_GUIDELINES.md` - Button component standards
- `docs/ICON_GUIDELINES.md` - Icon usage and consistency
- `docs/TYPOGRAPHY_GUIDE.md` - Typography hierarchy and usage

### 🧪 Testing & Quality
- `docs/TESTING_STRATEGY.md` - **TDD protocol, 80% coverage goal**
- `docs/ERROR_HANDLING.md` - ErrorBoundary patterns, error strategies

### 🔒 Security & Performance
- `docs/SECURITY.md` - **Zero-trust model, threat analysis, security checklist**
- `docs/VERSIONING.md` - Semantic versioning policy

### 🛠️ Development & Deployment
- `docs/ENVIRONMENT_SETUP.md` - Firebase hosting, env vars, build commands
- `docs/DEVELOPER_TOOLS.md` - Developer tools and simulation
- `docs/DASHBOARD_AUTOMATION_PLAN.md` - Dashboard automation roadmap
- `docs/DASHBOARD_AUTOMATION_SUMMARY.md` - Automation implementation status

### 📝 Architecture Decision Records
- `docs/adr/` - ADR templates and decisions

---

## 🎯 WHEN TO READ WHICH DOCS

### Before ANY Task
**ALWAYS READ:**
1. `CLAUDE.md` - Constitution
2. Dashboard or `docs/VERSIONING.md` - Current versions & state
3. `git log --oneline -20` - Recent work

### Before Implementing Features
**ALSO READ:**
- `docs/ARCHITECTURE_OVERVIEW.md` - Understand system design
- `docs/FIRESTORE_SCHEMA.md` - Database structure
- `docs/TESTING_STRATEGY.md` - Test requirements
- Component-specific docs (Finance, Family, etc.)

### Before UI/Design Work
**ALSO READ:**
- `docs/DESIGN_PHILOSOPHY.md` - Design principles
- `docs/DESIGN_TOKENS.md` - Color/spacing system
- `docs/BUTTON_GUIDELINES.md` - Component standards
- `docs/TYPOGRAPHY_GUIDE.md` - Text hierarchy

### Before Security-Sensitive Work
**ALSO READ:**
- `docs/SECURITY.md` - Security checklist
- `docs/FIRESTORE_SCHEMA.md` - Security rules

### Before Deployment
**ALSO READ:**
- `Dashboard (`/api/parity`)` - Current deployments
- `docs/ENVIRONMENT_SETUP.md` - Deployment process
- `docs/VERSIONING.md` - Version numbering

---

**This is my commitment. I will follow this workflow on EVERY task, EVERY time, without exception.**

**Last Updated**: 2026-01-31  
**Maintained By**: Agent  
**Purpose**: Never forget the constitution
