---
name: testing
description: TDD workflow and testing strategy. Use when writing tests, debugging test failures, or improving coverage.
---

# Testing Strategy

## TDD Cycle (mandatory for all code changes)
1. **RED**: Write a failing test for the expected behavior
2. **GREEN**: Write minimum code to make it pass
3. **REFACTOR**: Clean up without changing behavior
4. Repeat for each distinct behavior

## Exception Protocol
For config, docs, tooling with no test harness:
"Phase 3 exception: [category]. No test harness for [what]. Reason: [why]."

## Test Types
| Type | Location | Tool | Target |
|------|----------|------|--------|
| Unit | `src/**/*.test.ts` | Vitest | 80% coverage |
| E2E | `e2e/*.spec.ts` | Playwright | Critical flows |
| Integration | `npm run test:integration` | Firebase emulators | Services |
| Mutation | `npm run test:mutation` | Stryker | Score > 70% |
| Rules | `npm run test:rules` | Vitest | Firestore rules |

## Commands
- Single test: `npm run test -- --run path/to/test.test.ts`
- All unit: `npm run test -- --run`
- E2E: `npm run test:e2e`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`

## What to Test
- Happy path for every feature
- Edge cases: null, undefined, empty arrays, zero values
- Error states: network failure, permission denied, invalid data
- Mobile: 375px viewport, touch interactions
- Family Mode: owner vs shared viewer permissions
