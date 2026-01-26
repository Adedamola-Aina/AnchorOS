# Testing Strategy - Anchor OS

**Version**: 1.0  
**Last Updated**: January 26, 2026  
**Status**: Authoritative Reference  

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Test-Driven Development Protocol](#test-driven-development-protocol)
3. [Test Categories](#test-categories)
4. [Coverage Goals & SLAs](#coverage-goals--slas)
5. [Testing Patterns & Conventions](#testing-patterns--conventions)
6. [Running Tests](#running-tests)
7. [CI/CD Integration](#cicd-integration)
8. [Common Pitfalls & Solutions](#common-pitfalls--solutions)

---

## Philosophy

> **"We build software that works like magic because we engineer it like scientists."**  
> — CLAUDE.md Constitution, Article 1

Testing is not optional in Anchor OS. It is the foundation of our engineering culture. Every feature, bug fix, and refactor begins with a test. This is enforced through our **Test-Driven Development (TDD) Mandate** from CLAUDE.md Article 2.

### Core Principles

1. **No Implementation Without Tests**: All code must have corresponding tests written FIRST (Red-Green-Refactor cycle)
2. **Tests as Documentation**: Tests describe system behavior better than comments
3. **Fast Feedback Loops**: Tests run in < 5 seconds for rapid iteration
4. **Confidence in Changes**: Comprehensive tests enable fearless refactoring
5. **Production-Grade Quality**: Every test meets the Distinguished Engineer Standard

---

## Test-Driven Development Protocol

### The Red-Green-Refactor Cycle

All development follows this mandatory cycle:

```
┌─────────────────────────────────────────────────────────┐
│  1. RED    │ Write a test that fails                    │
│  2. GREEN  │ Write minimal code to make it pass         │
│  3. REFACTOR │ Clean up without changing behavior       │
│  4. REPEAT │ Until feature is complete                  │
└─────────────────────────────────────────────────────────┘
```

### Bug Fix Protocol

**NEVER provide a blind fix.** Every bug fix follows this sequence:

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Write a failing test that reproduces the bug   │
│  STEP 2: Verify the test fails for the right reason     │
│  STEP 3: Implement the minimal fix                      │
│  STEP 4: Verify the test passes                         │
│  STEP 5: Verify no other tests broke                    │
│  STEP 6: Document the root cause in commit message      │
└─────────────────────────────────────────────────────────┘
```

**Example:**

```typescript
// Bug #142: Transaction amounts display incorrectly for values over 999,999

// STEP 1: Reproduction test (THIS MUST FAIL FIRST)
describe('formatCurrency - Bug #142', () => {
  it('correctly formats amounts over 999,999', () => {
    expect(formatCurrency(1500000, 'NGN')).toBe('₦1,500,000.00');
  });
});

// STEP 3: Implement fix (only after test exists)
export const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// STEP 6: Commit message
// fix: correctly format large transaction amounts over 999,999
// 
// Root cause: Manual string concatenation didn't handle number formatting
// Solution: Use Intl.NumberFormat for proper locale-aware formatting
// Tests: Added regression test in formatCurrency.test.ts
```

---

## Test Categories

Anchor OS uses three distinct test categories, each serving a specific purpose:

### 1. Unit Tests (Vitest)

**Purpose**: Test individual functions or components in complete isolation

**Location**: `src/**/*.test.ts` or `src/**/*.test.tsx`

**Scope**: Single function, hook, or component

**Mocking Strategy**: Mock ALL external dependencies (Firebase, APIs, context, etc.)

**Execution Time**: < 100ms per test

**When to Use**:
- Pure utility functions (`format.ts`, `validation.ts`, `moneyUtils.ts`)
- React hooks (`useResponsive`, `useFabricSuggestions`)
- Isolated components (`ErrorBoundary`, `BottomNavigation`)
- Business logic (`financeInsights.ts`, `sanitize.ts`)

**Example Pattern**:

```typescript
// src/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, toCents, fromCents } from './format';

describe('formatCurrency', () => {
  it('formats NGN currency with proper symbol', () => {
    expect(formatCurrency(50000, 'NGN')).toBe('₦500.00');
  });

  it('formats USD currency with proper symbol', () => {
    expect(formatCurrency(50000, 'USD')).toBe('$500.00');
  });

  it('handles zero amounts', () => {
    expect(formatCurrency(0, 'NGN')).toBe('₦0.00');
  });

  it('handles negative amounts', () => {
    expect(formatCurrency(-10000, 'NGN')).toBe('-₦100.00');
  });

  it('formats large amounts with proper separators', () => {
    expect(formatCurrency(150000000, 'NGN')).toBe('₦1,500,000.00');
  });
});

describe('toCents', () => {
  it('converts dollar strings to cents', () => {
    expect(toCents('100.50')).toBe(10050);
    expect(toCents('0.99')).toBe(99);
  });

  it('handles empty string as zero', () => {
    expect(toCents('')).toBe(0);
  });

  it('handles invalid input gracefully', () => {
    expect(toCents('not-a-number')).toBe(0);
    expect(toCents('$100')).toBe(0); // Requires clean number input
  });
});
```

**Key Characteristics**:
- Tests ONE thing
- No setup required
- No external dependencies
- Fast execution
- Deterministic output

---

### 2. Integration Tests (Vitest)

**Purpose**: Test multiple modules working together

**Location**: `src/**/*.integration.test.ts`

**Scope**: Multiple services, hooks, or components interacting

**Mocking Strategy**: Mock ONLY external services (Firebase, Cloud Functions), not internal modules

**Execution Time**: < 1s per test

**When to Use**:
- Service interactions (`FinanceService` + `AccountService` + Firestore)
- Context providers with hooks (`AuthContext` + `useAuth`)
- Complex component flows with multiple child components
- State management across modules

**Example Pattern**:

```typescript
// src/services/__tests__/FinanceService.integration.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFinanceService } from '@/hooks/useFinanceService';
import { FinanceContext } from '@/context/FinanceContext';
import { mockFirestoreCollection } from '@/test/mocks/firebase';

describe('FinanceService Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFirestoreCollection.mockClear();
  });

  it('creates transaction and updates account balance atomically', async () => {
    // Arrange: Setup context with initial account
    const initialAccounts = [
      { id: 'acc-1', name: 'Checking', balanceCents: 100000, currency: 'NGN' }
    ];

    const wrapper = ({ children }) => (
      <FinanceContext.Provider value={{ accounts: initialAccounts }}>
        {children}
      </FinanceContext.Provider>
    );

    const { result } = renderHook(() => useFinanceService(), { wrapper });

    // Act: Create expense transaction
    await result.current.createTransaction({
      title: 'Groceries',
      amountCents: 5000,
      type: 'expense',
      accountId: 'acc-1',
      category: 'Food',
    });

    // Assert: Transaction created AND account balance updated
    await waitFor(() => {
      expect(mockFirestoreCollection).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Groceries', amountCents: 5000 })
      );
      expect(result.current.accounts[0].balanceCents).toBe(95000);
    });
  });

  it('handles Family Mode shared account transactions', async () => {
    // Test that shared account transactions trigger activity logs
    // and update balances for both owner and shared member
  });
});
```

**Key Characteristics**:
- Tests module interactions
- Real internal dependencies
- Mocked external services
- Validates data flow
- Tests transaction boundaries

---

### 3. End-to-End Tests (Playwright)

**Purpose**: Test complete user journeys through real browser

**Location**: `e2e/*.spec.ts`

**Scope**: Full application flows from user perspective

**Mocking Strategy**: None - uses real Firebase test project

**Execution Time**: < 30s per test

**When to Use**:
- Critical user flows (authentication, account creation, transactions)
- Multi-step wizards (onboarding, Family Mode setup)
- Cross-page navigation
- Mobile responsive behavior
- Security-critical features (MFA, Family sharing permissions)

**Example Pattern**:

```typescript
// e2e/finance.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsTestUser, createTestAccount } from './helpers';

test.describe('Finance - Account Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, 'test@example.com');
    await page.goto('/finance');
  });

  test('user can create a new checking account', async ({ page }) => {
    // Given: User is on Finance page
    await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();

    // When: User creates a new account
    await page.getByRole('button', { name: 'Add Account' }).click();
    await page.getByLabel('Account Name').fill('Emergency Fund');
    await page.getByLabel('Account Type').selectOption('savings');
    await page.getByLabel('Initial Balance').fill('5000');
    await page.getByLabel('Currency').selectOption('USD');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Then: Account appears in the list with correct balance
    await expect(page.getByText('Emergency Fund')).toBeVisible();
    await expect(page.getByText('$5,000.00')).toBeVisible();
    await expect(page.getByText('Savings')).toBeVisible();
  });

  test('prevents creating account with invalid data', async ({ page }) => {
    // When: User tries to create account with empty name
    await page.getByRole('button', { name: 'Add Account' }).click();
    await page.getByLabel('Initial Balance').fill('1000');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Then: Error message shown, account not created
    await expect(page.getByText('Account name is required')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible(); // Modal still open
  });
});

test.describe('Finance - Transaction Flow', () => {
  test('user can record income and see balance update', async ({ page }) => {
    // Test complete transaction flow with balance updates
  });

  test('user can transfer between accounts', async ({ page }) => {
    // Test transfer with atomic balance updates
  });
});
```

**Key Characteristics**:
- Tests from user perspective
- Real browser interactions
- Validates complete flows
- Tests accessibility (screen readers, keyboard nav)
- Uses BDD-style (Given-When-Then)

---

## Coverage Goals & SLAs

### Coverage Targets

| Category | Minimum Coverage | Target Coverage | Enforcement |
|----------|-----------------|----------------|-------------|
| **Critical Paths** | 100% | 100% | Blocking |
| **Business Logic** | 80% | 90% | Blocking |
| **UI Components** | 60% | 80% | Warning |
| **Utilities** | 90% | 100% | Blocking |
| **Overall** | 70% | 85% | Warning |

**Critical Paths** include:
- Authentication flows (login, signup, MFA)
- Transaction creation and balance updates
- Family Mode sharing and permissions
- Data validation and sanitization
- Security-sensitive operations

### Performance SLAs

| Test Type | Max Duration | Typical Duration | Failure Threshold |
|-----------|-------------|------------------|-------------------|
| **Unit Test** | 100ms | 10-50ms | 200ms |
| **Integration Test** | 1s | 200-500ms | 2s |
| **E2E Test** | 30s | 10-20s | 60s |
| **Full Unit Suite** | 5s | 2-3s | 10s |
| **Full E2E Suite** | 10min | 5-7min | 15min |

**Current Stats** (as of Jan 2026):
- 44 test files
- 415+ test cases
- Unit test suite: ~3s
- E2E test suite: ~8min

### Test Quality Metrics

Tests must meet these standards:

1. **Deterministic**: Same input → same output, every time
2. **Independent**: No test depends on another test's state
3. **Fast**: Meets SLA targets above
4. **Readable**: Test name describes the behavior being verified
5. **Maintainable**: Uses helpers and fixtures to reduce duplication

---

## Testing Patterns & Conventions

### Naming Conventions

```typescript
// ✅ GOOD: Describes behavior, not implementation
describe('formatCurrency', () => {
  it('formats NGN currency with Naira symbol', () => { });
  it('formats negative amounts with minus sign', () => { });
  it('handles null input by returning empty string', () => { });
});

// ❌ BAD: Vague, implementation-focused
describe('formatter tests', () => {
  it('test1', () => { });
  it('works', () => { });
  it('currency thing', () => { });
});
```

### Test Structure (AAA Pattern)

```typescript
it('updates account balance when transaction is created', () => {
  // Arrange: Set up test data
  const account = { id: 'acc-1', balanceCents: 100000 };
  const transaction = { amountCents: 5000, type: 'expense' };

  // Act: Perform the action
  const updatedBalance = calculateNewBalance(account, transaction);

  // Assert: Verify the outcome
  expect(updatedBalance).toBe(95000);
});
```

### Firebase Mocking Patterns

All Firebase services are pre-mocked in `src/test/setup.ts`. Individual tests can override:

```typescript
import { vi } from 'vitest';
import { getDoc } from 'firebase/firestore';

// Override default mock for specific test
vi.mocked(getDoc).mockResolvedValueOnce({
  exists: () => true,
  data: () => ({
    id: 'acc-1',
    name: 'Checking',
    balanceCents: 100000,
  }),
});
```

### React Component Testing Patterns

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('catches errors and displays fallback UI', () => {
    // Arrange: Component that will throw
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act: Render component that throws
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert: Error UI shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('allows user to retry after error', async () => {
    // Test retry functionality
  });
});
```

### Hook Testing Patterns

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useResponsive } from './useResponsive';

describe('useResponsive', () => {
  it('detects mobile viewport', () => {
    // Arrange: Mock window.matchMedia for mobile
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    // Act: Render hook
    const { result } = renderHook(() => useResponsive());

    // Assert: Mobile detected
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });
});
```

### E2E Testing Patterns

```typescript
// e2e/helpers.ts - Reusable test utilities
export async function loginAsTestUser(page: Page, email: string = 'test@anchor.com') {
  await page.goto('/');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('TestPassword123!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/dashboard');
}

export async function createTestAccount(page: Page, name: string, balance: number) {
  await page.getByRole('button', { name: 'Add Account' }).click();
  await page.getByLabel('Account Name').fill(name);
  await page.getByLabel('Initial Balance').fill(String(balance));
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText(name)).toBeVisible();
}

// e2e/finance.spec.ts - Using helpers
test('user can create account and add transaction', async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto('/finance');
  await createTestAccount(page, 'Checking', 1000);
  // ... rest of test
});
```

---

## Running Tests

### Development Workflow

```bash
# Run unit tests in watch mode (recommended during development)
npm run test

# Run all unit tests once
npm run test:run

# Run tests with UI (interactive browser interface)
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npm run test src/utils/format.test.ts

# Run integration tests with emulator
npm run test:integration
```

### Pre-Commit Checklist

Before committing code:

```bash
# 1. Run full unit test suite
npm run test:run

# 2. Check coverage
npm run test:coverage

# 3. Run affected E2E tests
npm run test:e2e -- auth.spec.ts  # If auth code changed

# 4. Lint code
npm run lint

# 5. Build to verify no type errors
npm run build
```

### Debugging Tests

#### Unit Tests (Vitest)

```typescript
// Add .only to focus on single test
it.only('formats currency correctly', () => {
  // This test runs alone
});

// Add .skip to temporarily disable test
it.skip('complex edge case', () => {
  // This test is skipped
});

// Use console.log (will show in test output)
it('debugs calculation', () => {
  const result = calculateBalance();
  console.log('Result:', result); // Shows in terminal
  expect(result).toBe(100000);
});
```

#### E2E Tests (Playwright)

```bash
# Run with headed browser (see what's happening)
npm run test:e2e:headed

# Run with debug mode (pause execution)
PWDEBUG=1 npm run test:e2e

# Generate trace (visual timeline of test)
npm run test:e2e -- --trace on

# View test report after failure
npx playwright show-report
```

---

## CI/CD Integration

### GitHub Actions (Future)

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3  # Upload coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### LXC Deployment Testing

Current manual process (to be automated):

```bash
# SSH into LXC 107 (Anchor OS container)
ssh root@192.168.0.57

# Pull latest code
cd /root/anchor-os
git pull

# Run test suite
npm run test:run

# If tests pass, build and deploy
npm run build:staging
systemctl restart anchor-os
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Flaky E2E Tests

**Problem**: Tests pass locally but fail in CI randomly

**Solution**:
```typescript
// ❌ BAD: Hard timeouts
await page.waitForTimeout(1000); // Brittle!

// ✅ GOOD: Wait for specific conditions
await page.waitForURL('/dashboard');
await expect(page.getByText('Welcome')).toBeVisible();
```

### Pitfall 2: Over-Mocking in Integration Tests

**Problem**: Mocking internal modules defeats the purpose of integration tests

**Solution**:
```typescript
// ❌ BAD: Mocking internal service
vi.mock('@/services/FinanceService');

// ✅ GOOD: Only mock external dependencies (Firebase)
vi.mock('firebase/firestore');
// Let internal modules interact naturally
```

### Pitfall 3: Testing Implementation Details

**Problem**: Tests break when internal refactoring happens

**Solution**:
```typescript
// ❌ BAD: Tests internal state
expect(component.state.isLoading).toBe(false);

// ✅ GOOD: Tests user-visible behavior
expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
```

### Pitfall 4: Not Using Test Data Builders

**Problem**: Duplicate setup code across tests

**Solution**:
```typescript
// Create test/factories/account.ts
export const buildAccount = (overrides = {}) => ({
  id: 'test-acc-1',
  name: 'Test Account',
  type: 'checking',
  balanceCents: 100000,
  currency: 'NGN',
  ...overrides,
});

// Use in tests
const account = buildAccount({ name: 'Savings', type: 'savings' });
```

### Pitfall 5: Ignoring Firestore Security Rules in Tests

**Problem**: Tests pass but features fail in production due to security rules

**Solution**:
- Run integration tests against Firebase Emulator with real security rules
- Use `npm run test:integration` which starts emulator first
- Test with different user permissions (owner vs. shared member)

---

## Additional Resources

### Documentation References

- **CLAUDE.md** - Full TDD protocol (Article 2)
- **vitest.config.ts** - Unit test configuration
- **playwright.config.ts** - E2E test configuration
- **src/test/setup.ts** - Global test mocks and setup

### External Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Kent C. Dodds - Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)

---

## Maintenance & Updates

This document should be updated when:
- New test patterns are established
- Coverage goals change
- New testing tools are introduced
- Significant test infrastructure changes occur

**Document Owner**: Anchor OS Core Team  
**Review Cadence**: Quarterly  
**Last Reviewed**: January 26, 2026
