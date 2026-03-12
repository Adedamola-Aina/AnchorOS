# Skill: TDD Cycle for Anchor OS
# Red → Green → Refactor. Always. No exceptions.
# Reference: docs/TESTING_STRATEGY.md

---

## The Mandate

Write the failing test FIRST. Then write the implementation.
If you write implementation before tests, the work does not count as done.

---

## Test File Locations

| Type | Location | Tool |
|------|----------|------|
| Unit (utils, services, hooks) | Colocated: `src/utils/foo.test.ts` | Vitest |
| Unit (components) | Colocated: `src/features/X/Y.test.tsx` | Vitest |
| Integration (services) | `src/services/__tests__/` | Vitest + emulator |
| Firestore rules | `src/test/rules/` via `vitest.rules.config.ts` | Firebase Emulator |
| E2E (user flows) | `e2e/X.spec.ts` | Playwright |

---

## The AAA Pattern (Every Test)

```typescript
it('does the expected thing', () => {
  // ARRANGE — set up the conditions
  const input = buildTestInput({ amount: 5000 });
  
  // ACT — execute the behavior
  const result = formatCurrency(input.amount, 'NGN');
  
  // ASSERT — verify the outcome
  expect(result).toBe('₦5,000.00');
});
```

---

## Bug Fix Protocol

Never fix a bug without a reproduction test first.

```
1. Write test that reproduces the bug → verify it FAILS
2. Confirm it fails for the right reason
3. Implement the fix
4. Verify test now PASSES
5. Verify no other tests broke
6. Commit: fix(scope): BUG-XXX — include root cause in message
```

---

## Coverage Targets

| Metric | Target | Command |
|--------|--------|---------|
| Statement | 80%+ | `npm run test:coverage` |
| Branch | 70%+ | `npm run test:coverage` |
| Function | 90%+ | `npm run test:coverage` |
| Line | 80%+ | `npm run test:coverage` |

---

## E2E Selector Priority

Use in this order (most to least stable):

1. `data-testid="..."` — immune to text/style changes. Use this first.
2. `getByRole('button', { name: '...' })` — accessible and semantic
3. `getByLabel('...')` / `getByPlaceholder('...')` — form inputs
4. `getByText('...')` — fragile, use only when above aren't possible
5. `page.locator('text=...')` — avoid entirely

---

## Running Tests

```bash
# Unit tests (watch mode during BUILD)
npm run test

# Unit tests (single run for CI / CLOSE phase)
npm run test -- --run

# E2E tests
npm run test:e2e

# Firestore rules tests (requires emulator)
npm run test:rules

# Coverage report
npm run test:coverage

# Mutation testing (master branch, CLOSE phase)
npm run test:mutation

# All integration (with emulator)
npm run test:integration
```

---

## Performance SLAs

| Test Type | Max Duration |
|-----------|-------------|
| Unit test | < 100ms |
| Integration test | < 1s |
| Full unit suite | < 5s |
| E2E suite | < 2 min |

Flaky tests are not tolerated. If a test is flaky, fix it before merging.
