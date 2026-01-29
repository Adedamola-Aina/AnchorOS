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

1. ❌ Start work without reading docs
2. ❌ Finish work without updating docs
3. ❌ Write code without tests
4. ❌ Deploy to production without staging validation
5. ❌ Reintroduce bugs from KNOWN_ISSUES.md
6. ❌ Use `any` type in TypeScript
7. ❌ Commit with failing tests
8. ❌ Skip error handling

---

## ✅ AFTER COMPLETING WORK

**ALWAYS update these files:**

1. `docs/PROJECT_STATUS.md` - Mark task complete
2. `CHANGELOG.md` - Add entry under [Unreleased]
3. `docs/KNOWN_ISSUES.md` - If bug was fixed
4. `docs/ROADMAP.md` - If feature was completed

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
