---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,e2e/**"
---

# Testing Conventions for Anchor OS

- TDD is mandatory: write failing test FIRST, then implement
- Unit tests: Vitest in `src/**/*.test.ts` — target 80% coverage
- E2E tests: Playwright in `e2e/*.spec.ts` — cover critical user flows
- Integration: `npm run test:integration` with Firebase emulators
- Mutation: `npm run test:mutation` with Stryker — score > 70%
- Rules: `npm run test:rules` for Firestore security rules
- Test files are exempt from the 200-line limit
- Always test: happy path, edge cases (null, empty), error states, mobile viewport
- Run tests: `npm run test -- --run` (not the whole suite for single file changes)
