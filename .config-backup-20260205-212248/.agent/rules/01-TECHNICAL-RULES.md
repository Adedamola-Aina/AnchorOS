# ANCHOR OS - TECHNICAL RULES

> **NOTE**: See `00-MASTER-SEQUENCE.md` for the mandatory workflow sequence.
> This file contains technical standards and stack information.

---

## 📏 ARCHITECTURE MANDATES

### ARCH-001: 200-Line Rule
**All source files MUST be under 200 lines.**

- ✅ Production code in `src/` must be under 200 lines
- ✅ Test files may exceed 200 lines (for comprehensive coverage)
- ✅ If a file approaches 200 lines, extract logic into separate files

**How to check:**
```bash
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n | tail -20
```

### ARCH-002: Error Boundaries
All major views must have feature error boundaries.

### ARCH-003: Service Layer Testing
Service layer must have unit + integration tests.

---

## 🧪 TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE)

```
RED    → Write a failing test FIRST
GREEN  → Write minimal code to pass
REFACTOR → Clean up, keep tests green
```

**NEVER write implementation code without a failing test.**

- Unit tests: `src/**/*.test.ts` (Vitest)
- E2E tests: `e2e/*.spec.ts` (Playwright)
- Coverage target: 80% minimum

---

## 🛠️ TECH STACK

- **Frontend**: TypeScript, React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Functions, Hosting)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: LXC 107 (Proxmox), Tailscale-only access

---

## 📱 MOBILE-FIRST (75% of users are mobile)

- Design for mobile viewport FIRST
- Touch targets: minimum 44px
- Test on mobile before desktop
- Use responsive breakpoints

---

## 🔐 SECURITY-FIRST

- Zero-trust: validate ALL inputs
- Never hardcode API keys or secrets
- Firestore rules must be tested
- Use `secureDb.ts` for all database operations

---

## ❌ FORBIDDEN ACTIONS

1. ❌ Start work without checking dashboard (`/api/command-center`)
2. ❌ Finish work without committing with correct prefix
3. ❌ Write code without tests
4. ❌ Deploy to production without staging validation
5. ❌ Reintroduce known bugs (check `/api/git/bugs`)
6. ❌ Use `any` type in TypeScript
7. ❌ Commit with failing tests
8. ❌ Skip error handling

---

## ✅ AFTER COMPLETING WORK

**Commit with correct prefix** — dashboard auto-updates:
- `fix: BUG-XXX description` → Bug tracked automatically
- `feat: FEAT-XXX description` → Feature tracked automatically
- `deploy(env): vX.X.X @ HASH` → Deployment recorded

> **Note**: `PROJECT_STATUS.md`, `KNOWN_ISSUES.md`, `ROADMAP.md`, and `CHANGELOG.md` have been deleted. Git commits with correct prefixes are the single source of truth.

**Run before committing:**
```bash
npm run test          # Unit tests
npm run e2e           # E2E tests (if applicable)
npm run lint          # Linting
```

---

## 📝 COMMIT FORMAT

```
type(scope): brief description

Types: feat, fix, docs, style, refactor, test, chore
Example: fix(finance): prevent negative account balance
```

---

## 🎯 QUALITY CHECKLIST

Before saying "done", verify:

- [ ] Tests written and passing
- [ ] No TypeScript errors
- [ ] Docs updated
- [ ] Mobile-friendly
- [ ] Error handling in place
- [ ] No console.log in production code
