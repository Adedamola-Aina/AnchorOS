# ANCHOR OS DEVELOPMENT CONSTITUTION

## Preamble

This document establishes the inviolable principles, protocols, and standards governing all development work on Anchor OS. Every engineer, AI agent, or contributor working on this codebase operates under these rules. There are no exceptions.

The philosophy is simple: **We build software that works like magic because we engineer it like scientists.** Every line of code is deliberate. Every feature is tested. Every change is understood in context. We are not hackers throwing code at problems—we are architects building a cathedral.

---

## 🛠 Project Tracking (Single Source of Truth)

- **Project Status (Source of Truth)**: [Internal Dashboard](http://localhost:3001) - *Git-driven automation*
- **Architecture (System Design)**: [ARCHITECTURE.md](file:///root/anchor-os/ARCHITECTURE.md) - *Structural Reference*
- **Changelog (History)**: [CHANGELOG.md](file:///root/anchor-os/CHANGELOG.md) - *Release Records*
- **UX Standards**: [adaptive_layout_patterns.md](file:///root/.gemini/antigravity/knowledge/anchor_os_ux_ui/artifacts/adaptive_layout_patterns.md)

Always consult these documents before starting new work.

---

# PART I: THE ENGINEERING MINDSET

## Article 1: The Distinguished Engineer Standard

All work on Anchor OS must meet the standard of a Distinguished Engineer—the top 1% of software professionals. This means:

### 1.1 Systems Thinking
Before writing any code, you must understand:
- What problem are we solving?
- Who is affected by this change?
- What components touch this code?
- What could break if this changes?
- What will this look like in 6 months? 12 months?

### 1.2 The Ripple Effect Doctrine
No code exists in isolation. Every function, component, and module is part of a living system. Before implementing anything:

```
MANDATORY QUESTIONS:
1. What imports this module?
2. What does this module import?
3. What state does this affect?
4. What user flows pass through here?
5. What happens if this fails?
```

### 1.3 The "Explain It To Me" Test
If you cannot explain a change in plain English to a non-technical stakeholder, you do not understand it well enough to implement it. Write the explanation first, then write the code.

### 1.4 The Reversibility Principle
Every change should be reversible. Prefer:
- Feature flags over hard deployments
- Soft deletes over hard deletes
- Additive changes over breaking changes
- Migration paths over big-bang rewrites

---

# PART II: TEST-DRIVEN DEVELOPMENT PROTOCOL

## Article 2: The TDD Mandate

**CARDINAL RULE: No implementation code shall be written without a failing test first.**

This is not a suggestion. This is law.

### 2.1 The Red-Green-Refactor Cycle

```
┌─────────────────────────────────────────────────────────┐
│  1. RED    │ Write a test that fails                    │
│  2. GREEN  │ Write minimal code to make it pass         │
│  3. REFACTOR │ Clean up without changing behavior       │
│  4. REPEAT │ Until feature is complete                  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Test Categories and Requirements

#### Unit Tests (Vitest)
- **Coverage Target**: 80% minimum for new code
- **Location**: `src/**/*.test.ts` or `src/**/*.test.tsx`
- **Scope**: Single function or component in isolation
- **Mocking**: Mock all external dependencies (Firebase, APIs, etc.)

```typescript
// CORRECT: Focused, isolated unit test
describe('toCents', () => {
  it('converts dollars to cents', () => {
    expect(toCents('100.50')).toBe(10050);
  });

  it('handles empty string', () => {
    expect(toCents('')).toBe(0);
  });

  it('handles invalid input gracefully', () => {
    expect(toCents('not-a-number')).toBe(0);
  });
});
```

#### Integration Tests (Vitest)
- **Location**: `src/**/*.integration.test.ts`
- **Scope**: Multiple modules working together
- **Mocking**: Mock only external services, not internal modules

#### End-to-End Tests (Playwright)
- **Location**: `e2e/*.spec.ts`
- **Scope**: Full user journeys through the application
- **Environment**: Real browser, test database
- **Naming**: `{feature}.spec.ts`

```typescript
// CORRECT: BDD-style E2E test
test.describe('Account Creation', () => {
  test('user can create a new checking account', async ({ page }) => {
    // Given: User is logged in and on Finance page
    await loginAsTestUser(page);
    await page.goto('/finance');

    // When: User creates a new account
    await page.getByRole('button', { name: 'Add Account' }).click();
    await page.getByLabel('Account Name').fill('My Checking');
    await page.getByLabel('Balance').fill('1000');
    await page.getByRole('button', { name: 'Create' }).click();

    // Then: Account appears in the list
    await expect(page.getByText('My Checking')).toBeVisible();
    await expect(page.getByText('$1,000.00')).toBeVisible();
  });
});
```

### 2.3 The Bug Fix Protocol

**NEVER provide a blind fix.** Every bug fix follows this sequence:

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Write a failing test that reproduces the bug   │
│  STEP 2: Verify the test fails for the right reason     │
│  STEP 3: Implement the minimal fix                      │
│  STEP 4: Verify the test passes                         │
│  STEP 5: Verify no other tests broke                    │
│  STEP 6: Document the root cause                        │
└─────────────────────────────────────────────────────────┘
```

Example:
```typescript
// Bug: Transaction amounts display incorrectly for values over 999,999

// STEP 1: Reproduction test
describe('formatCurrency - Bug #142', () => {
  it('correctly formats amounts over 999,999', () => {
    // This test should FAIL before the fix
    expect(formatCurrency(1500000, 'NGN')).toBe('₦1,500,000.00');
  });
});

// STEP 3: The fix (only after test exists)
export const formatCurrency = (amount: number, currency: Currency): string => {
  // Fix: Use Intl.NumberFormat for proper large number handling
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
```

### 2.4 Test Quality Standards

Tests must be:
- **Deterministic**: Same input = same output, every time
- **Independent**: No test depends on another test's state
- **Fast**: Unit tests < 100ms, Integration < 1s, E2E < 30s
- **Readable**: Test name describes the behavior being verified
- **Maintainable**: Use page objects and helpers to reduce duplication

```typescript
// BAD: Vague, implementation-focused
test('test1', async () => { ... });

// GOOD: Behavioral, clear intent
test('displays error message when login fails with wrong password', async () => { ... });
```

---

# PART III: CODE ARCHITECTURE STANDARDS

## Article 3: The Modularity Doctrine

### 3.1 Single Responsibility Principle
Every file, function, and component does ONE thing well.

```typescript
// BAD: God component doing everything
const FinanceView = () => {
  // 500 lines handling accounts, transactions, charts, modals...
};

// GOOD: Composed of focused components
const FinanceView = () => (
  <FinanceLayout>
    <AccountList />
    <TransactionList />
    <FinanceCharts />
  </FinanceLayout>
);
```

### 3.2 The 200-Line Rule
No single file should exceed 200 lines of code. If it does, it's doing too much. Split it.

**There are NO exceptions.** This rule is enforced by a pre-commit hook in `.husky/pre-commit`.

### 3.3 Dependency Direction
Dependencies flow DOWN, never UP or SIDEWAYS.

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Pages / Views (FinanceView, DashboardView)    │
│      ↓                                                  │
│  LAYER 2: Features / Components (AccountCard, Modal)    │
│      ↓                                                  │
│  LAYER 3: Hooks (useFinanceService, useAuth)            │
│      ↓                                                  │
│  LAYER 4: Services (FinanceService, AuthService)        │
│      ↓                                                  │
│  LAYER 5: Utilities (formatCurrency, validation)        │
│      ↓                                                  │
│  LAYER 6: Types (AnchorAccount, AnchorTransaction)      │
└─────────────────────────────────────────────────────────┘
```

A component in Layer 2 MUST NOT import from Layer 1.
A utility in Layer 5 MUST NOT import from Layers 1-4.

### 3.4 The Import Audit
Before adding any import, ask:
1. Is this import necessary?
2. Am I importing from the correct layer?
3. Could this create a circular dependency?
4. Is there a lighter alternative?

```typescript
// BAD: Importing entire library for one function
import _ from 'lodash';
const result = _.isEmpty(value);

// GOOD: Import only what you need
import isEmpty from 'lodash/isEmpty';
const result = isEmpty(value);

// BEST: Use native when possible
const result = value == null || value.length === 0;
```

---

# PART IV: DESIGN PHILOSOPHY

## Article 4: The Calm Computing Manifesto

Anchor OS follows the principle of **Calm Computing**. The interface should feel like a trusted assistant, not a slot machine.

### 4.1 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Clarity over cleverness** | Every UI element has obvious purpose |
| **Quiet over loud** | No unnecessary animations, notifications, or colors |
| **Useful over impressive** | Features exist to help, not to show off |
| **Respectful over manipulative** | No dark patterns, no guilt, no urgency tricks |
| **Progressive disclosure** | Show complexity only when needed |

### 4.2 The Dependency Fabric
Features reveal themselves only when prerequisites are met. Users never see broken states or disabled features without explanation.

```typescript
// BAD: Show disabled button without explanation
<Button disabled={!hasFamily}>Share Account</Button>

// GOOD: Don't show the feature until it's usable
{hasFamily && <Button>Share Account</Button>}

// BEST: Show helpful guidance when prerequisite missing
{hasFamily ? (
  <Button>Share Account</Button>
) : null} // Feature simply doesn't exist yet
```

### 4.3 Color Usage
- **Semantic colors only**: Green = success, Red = danger, Amber = warning
- **Neutral by default**: Most UI is slate/gray
- **Accent sparingly**: Blue/Indigo for primary actions only
- **No decoration colors**: If a color doesn't convey meaning, don't use it

### 4.4 Typography Hierarchy
```
H1: 2.25rem (36px) - Page titles only
H2: 1.5rem (24px) - Section headers
H3: 1.125rem (18px) - Card titles
Body: 0.875rem (14px) - Default text
Small: 0.75rem (12px) - Metadata, timestamps
Micro: 0.625rem (10px) - Labels, badges
```

### 4.5 Spacing System
Use Tailwind's spacing scale consistently:
- `gap-2` (8px) - Between related items
- `gap-4` (16px) - Between groups
- `gap-6` (24px) - Between sections
- `p-4` (16px) - Card padding
- `p-6` (24px) - Section padding

---

# PART V: SECURITY PROTOCOL

## Article 5: The Security-First Mandate

Security is not a feature. It is a foundation. Every line of code must be written with security in mind.

### 5.1 Input Validation
**Trust nothing. Validate everything.**

```typescript
// REQUIRED: Validate all user input
import { z } from 'zod';

const TransactionSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  amountCents: z.number().int().positive().max(999999999),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string().min(1).max(50),
  date: z.string().datetime(),
});

// Use before processing
const validated = TransactionSchema.parse(userInput);
```

### 5.2 Output Encoding
**Never render raw user content.**

```typescript
// BAD: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// GOOD: React auto-escapes
<div>{userContent}</div>

// For rich text, use a sanitizer
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### 5.3 Authentication Checks
Every protected route, API call, and data access must verify authentication.

```typescript
// REQUIRED: Auth check pattern
const { user } = useAuth();

if (!user) {
  return <Navigate to="/login" />;
}

// REQUIRED: In services
async function getUserData(userId: string) {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== userId) {
    throw new Error('Unauthorized');
  }
  // ... proceed
}
```

### 5.4 Firestore Security Rules
The database is the last line of defense. Rules must be:
- **Default deny**: `allow read, write: if false;`
- **Explicit allow**: Only grant what's needed
- **Validated**: Use schema validation in rules

```javascript
// REQUIRED PATTERN
match /users/{userId}/accounts/{accountId} {
  // Only owner can read
  allow read: if request.auth.uid == userId;
  
  // Validate data on write
  allow create: if request.auth.uid == userId
                && isValidAccount(request.resource.data);
  
  // Owner can update, with validation
  allow update: if request.auth.uid == userId
                && isValidAccount(request.resource.data);
  
  // Owner can delete
  allow delete: if request.auth.uid == userId;
}
```

### 5.5 Sensitive Data Handling
- **Never log sensitive data**: No passwords, tokens, or PII in console.log
- **Never store secrets in code**: Use environment variables
- **Encrypt at rest**: Use Firestore's encryption
- **Secure in transit**: HTTPS only

### 5.6 The Security Checklist
Before any PR is merged, verify:

```
[ ] Input validation on all user inputs
[ ] Output encoding on all rendered content
[ ] Authentication verified on protected routes
[ ] Authorization verified on data access
[ ] No sensitive data in logs
[ ] No secrets in code
[ ] Firestore rules updated if schema changed
[ ] XSS vectors considered and mitigated
[ ] CSRF protection in place (Firebase handles this)
[ ] Rate limiting considered for expensive operations
```

---

# PART VI: PERFORMANCE STANDARDS

## Article 6: The Performance Budget

### 6.1 Bundle Size Limits
```
Total JS Bundle: < 500 KB gzipped
Initial Load: < 200 KB gzipped
Lazy-loaded chunks: < 100 KB each
```

### 6.2 Runtime Performance
```
First Contentful Paint (FCP): < 1.5s
Largest Contentful Paint (LCP): < 2.5s
Time to Interactive (TTI): < 3.5s
Cumulative Layout Shift (CLS): < 0.1
```

### 6.3 React Performance Rules

```typescript
// RULE 1: Memoize expensive computations
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// RULE 2: Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// RULE 3: Use React.memo for pure components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});

// RULE 4: Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 6.4 Firestore Performance Rules
```typescript
// RULE 1: Limit queries
const q = query(collection, orderBy('date'), limit(50));

// RULE 2: Use pagination, not fetch-all
const nextPage = query(collection, orderBy('date'), startAfter(lastDoc), limit(50));

// RULE 3: Avoid reading entire documents when you need one field
// Use Cloud Functions for aggregations

// RULE 4: Batch writes
const batch = writeBatch(db);
items.forEach(item => batch.set(ref, item));
await batch.commit();
```

### 6.5 Firestore Infrastructure Standards

**CARDINAL RULE: All Firestore indexes must be pre-deployed before the code that requires them.**

Firestore composite indexes take 1-10 minutes to build. In a production-grade system, users should NEVER encounter "index required" errors. This is achieved through Index-First Development.

#### 6.5.1 Index-First Development

```
┌─────────────────────────────────────────────────────────────────────┐
│  BEFORE writing any query with WHERE + ORDER BY:                    │
│                                                                     │
│  1. IDENTIFY  │ The collection, filter fields, and sort order       │
│  2. DEFINE    │ Add the index to firestore.indexes.json             │
│  3. DEPLOY    │ Deploy indexes BEFORE deploying code                │
│  4. VERIFY    │ Check Firebase Console that index is ENABLED        │
│  5. IMPLEMENT │ Only then write the query in code                   │
└─────────────────────────────────────────────────────────────────────┘
```

#### 6.5.2 Index Definition Pattern

All indexes are defined in `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "finance",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "accountId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**When is an index required?**
- Any query with `where()` + `orderBy()` on different fields
- Any query with multiple `where()` clauses on different fields
- Any Collection Group query (across user boundaries)

#### 6.5.3 CI/CD Index Deployment

The deployment workflow MUST deploy indexes before hosting:

```bash
# Correct deployment order:
firebase deploy --only firestore:indexes   # 1. Deploy indexes FIRST
# Wait for indexes to build (check status in CI)
firebase deploy --only firestore:rules     # 2. Deploy rules
firebase deploy --only hosting             # 3. Deploy app LAST
```

#### 6.5.4 Index Monitoring Checklist

```
[ ] All required indexes defined in firestore.indexes.json
[ ] Indexes deployed to ALL environments (dev, staging, prod)
[ ] No "index required" errors in production logs
[ ] New queries reviewed for index requirements before merge
[ ] Collection Group indexes enabled for family sharing queries
```

#### 6.5.5 Common Index Scenarios

| Query Pattern | Index Required |
|---------------|----------------|
| `where('userId', '==', x)` | ❌ No (single field) |
| `where('status', '==', x).orderBy('date')` | ✅ Yes (compound) |
| `where('a', '==', x).where('b', '==', y)` | ✅ Yes (compound) |
| `collectionGroup('accounts').where(...)` | ✅ Yes + field override |

---

# PART VII: CODE STYLE GUIDE

## Article 7: Consistency is King

### 7.1 TypeScript Standards

```typescript
// ALWAYS use explicit types for function parameters and returns
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

// ALWAYS use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string;
}

// PREFER type for unions and intersections
type Status = 'pending' | 'active' | 'completed';
type UserWithRole = User & { role: Role };

// NEVER use `any` - use `unknown` if type is truly unknown
function processData(data: unknown): void {
  if (isValidData(data)) {
    // now TypeScript knows the type
  }
}
```

### 7.2 React Component Structure

```typescript
// STANDARD COMPONENT STRUCTURE
import { useState, useEffect, useMemo } from 'react';
import { SomeIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import type { ComponentProps } from './types';

interface Props {
  title: string;
  onAction: () => void;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ title, onAction, variant = 'primary' }: Props) {
  // 1. Hooks first
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // 2. Derived state / memos
  const displayName = useMemo(() => user?.name ?? 'Guest', [user]);

  // 3. Effects
  useEffect(() => {
    // side effect
  }, [dependency]);

  // 4. Event handlers
  const handleClick = () => {
    onAction();
    setIsOpen(false);
  };

  // 5. Early returns for loading/error states
  if (!user) return null;

  // 6. Main render
  return (
    <div className="...">
      <h2>{title}</h2>
      <Button onClick={handleClick}>{displayName}</Button>
    </div>
  );
}
```

### 7.3 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `AccountCard`, `TransactionList` |
| Hooks | camelCase with `use` prefix | `useFinanceService`, `useAuth` |
| Functions | camelCase, verb-first | `calculateTotal`, `formatCurrency` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Types/Interfaces | PascalCase | `AnchorAccount`, `UserProfile` |
| Files | kebab-case or PascalCase for components | `finance-utils.ts`, `AccountCard.tsx` |
| Test files | Same as source with `.test` suffix | `AccountCard.test.tsx` |

### 7.4 Import Order

```typescript
// 1. React and framework imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. External library imports
import { collection, query } from 'firebase/firestore';
import { z } from 'zod';

// 3. Internal absolute imports (aliases)
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';

// 4. Relative imports
import { AccountCard } from './components/AccountCard';
import { formatCurrency } from './utils';

// 5. Type imports (always last)
import type { AnchorAccount } from '@/types';
```

### 7.5 Comment Standards

```typescript
// GOOD: Explains WHY, not WHAT
// We use a 5-minute buffer because Firebase timestamps can have clock drift
const SYNC_BUFFER_MS = 5 * 60 * 1000;

// GOOD: Documents non-obvious behavior
// Returns null instead of throwing to allow graceful degradation in UI
function safeParseAmount(value: string): number | null {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// BAD: Explains WHAT (the code already says this)
// Adds two numbers together
function add(a: number, b: number): number {
  return a + b;
}

// REQUIRED: JSDoc for exported functions
/**
 * Converts a dollar amount string to cents.
 * @param amount - The amount as a string (e.g., "100.50")
 * @returns The amount in cents as an integer
 * @throws Never throws - returns 0 for invalid input
 */
export function toCents(amount: string): number {
  // implementation
}
```

---

# PART VIII: THE REVIEW BOARD

## Article 8: Multi-Perspective Validation

Before any significant change is merged, it must pass review by these "virtual board members" - perspectives that must be considered:

### 8.1 The QA Architect
**Questions to answer:**
- Is there a test for every behavior?
- Do tests cover edge cases?
- Are tests deterministic and fast?
- Is the test suite still passing?

**Checklist:**
```
[ ] Unit tests written and passing
[ ] Integration tests written and passing
[ ] E2E tests written and passing
[ ] No flaky tests introduced
[ ] Coverage meets threshold (80%+)
```

### 8.2 The Security Officer (CISO)
**Questions to answer:**
- Is user input validated?
- Is output properly encoded?
- Are auth checks in place?
- Could this be exploited?

**Checklist:**
```
[ ] Input validation implemented
[ ] No XSS vectors
[ ] Auth/authz verified
[ ] No sensitive data exposure
[ ] Firestore rules reviewed
```

### 8.3 The Performance Engineer
**Questions to answer:**
- Does this impact load time?
- Are there unnecessary re-renders?
- Is the query efficient?
- Does this scale?

**Checklist:**
```
[ ] Bundle size impact assessed
[ ] No N+1 queries
[ ] Memoization used where appropriate
[ ] Lazy loading for heavy components
```

### 8.4 The UX Designer
**Questions to answer:**
- Is this intuitive?
- Does it follow our design system?
- Is it accessible?
- Does it feel calm, not chaotic?

**Checklist:**
```
[ ] Follows design system
[ ] Accessible (keyboard, screen reader)
[ ] Responsive (mobile, tablet, desktop)
[ ] Loading and error states handled
[ ] Empty states are helpful
```

### 8.5 The Architect
**Questions to answer:**
- Does this fit the architecture?
- Are dependencies correct?
- Is this maintainable?
- Will this make sense in 6 months?

**Checklist:**
```
[ ] Follows layer architecture
[ ] No circular dependencies
[ ] Single responsibility maintained
[ ] Code is documented
[ ] Change is reversible
```

---

# PART IX: THE DEVELOPMENT WORKFLOW

## Article 9: From Idea to Production

### 9.1 The Standard Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. UNDERSTAND  │ Read the requirement. Ask questions. Clarify.     │
│  2. ANALYZE     │ Identify affected components. Map dependencies.   │
│  3. DESIGN      │ Write the approach in plain English first.        │
│  4. TEST FIRST  │ Write failing tests for the expected behavior.    │
│  5. IMPLEMENT   │ Write minimal code to pass tests.                 │
│  6. REFACTOR    │ Clean up while keeping tests green.               │
│  7. REVIEW      │ Run through the Review Board checklist.           │
│  8. DOCUMENT    │ Update docs, changelog, and comments.             │
│  9. DEPLOY      │ Stage first, then production.                     │
│  10. MONITOR    │ Watch for errors and performance issues.          │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 The Pre-Implementation Questions

Before writing ANY code, answer these questions:

```markdown
## Pre-Implementation Checklist

### Understanding
- [ ] I can explain this feature/fix in one sentence
- [ ] I know who this benefits and why
- [ ] I have identified acceptance criteria

### Impact Analysis
- [ ] I have listed all files that will change
- [ ] I have identified all components that consume this code
- [ ] I understand the data flow affected
- [ ] I have considered error scenarios

### Approach
- [ ] I have written my approach in plain English
- [ ] I have considered alternative approaches
- [ ] I have chosen the simplest solution that works

### Testing Strategy
- [ ] I know what tests I will write
- [ ] I have identified edge cases
- [ ] I know how to verify this works
```

### 9.3 The Commit Protocol

```
Format: <type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code change that neither fixes nor adds
- test: Adding or updating tests
- docs: Documentation only
- style: Formatting, no code change
- perf: Performance improvement
- chore: Maintenance tasks

Examples:
feat(finance): add transaction pagination
fix(auth): handle session expiry gracefully
test(commitments): add streak calculation tests
refactor(hooks): extract shared account logic
```

### 9.4 The Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing locally
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Bundle size within budget

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass on staging
- [ ] Manual smoke test on staging

### Security
- [ ] No secrets in code
- [ ] Firestore rules deployed
- [ ] Auth flows verified

### Documentation
- [ ] CHANGELOG updated
- [ ] README updated if needed
- [ ] Code comments added

### Deployment
- [ ] Deployed to staging
- [ ] Verified on staging
- [ ] Deployed to production
- [ ] Verified on production
- [ ] Monitoring checked
```

### 9.5 The MANDATORY Deployment Script

**⚠️ CRITICAL: NEVER run build/deploy commands manually. ALWAYS use the deployment script.**

```bash
# Use the deployment script - it ensures correct build for each environment
./scripts/deploy.sh dev       # Deploy to dev (blue banner)
./scripts/deploy.sh staging   # Deploy to staging (yellow banner)
./scripts/deploy.sh prod      # Deploy to production (requires confirmation)
./scripts/deploy.sh all       # Deploy to dev AND staging (rebuilds for each)
```

**WHY THIS MATTERS:**
The dist/ folder contains the LAST built artifact. If you:
1. Run `npm run build:dev`
2. Run `firebase deploy --only hosting:dev`  
3. Run `firebase deploy --only hosting:staging` ← **WRONG! Still uses dev build!**

You've just deployed the dev build to staging. The deployment script prevents this by:
- **Building immediately before deploying** for each environment
- **Never reusing the dist/ folder** across environments
- **Color-coded output** to confirm which environment you're deploying to

```
┌─────────────────────────────────────────────────────────────────────┐
│  🚫 FORBIDDEN - Never do this:                                      │
│     npm run build:dev && firebase deploy --only hosting:dev         │
│     firebase deploy --only hosting:staging  ← WRONG BUILD!          │
├─────────────────────────────────────────────────────────────────────┤
│  ✅ CORRECT - Always do this:                                       │
│     ./scripts/deploy.sh dev                                         │
│     ./scripts/deploy.sh staging                                     │
│  OR                                                                 │
│     ./scripts/deploy.sh all  ← Deploys both with correct builds     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PART X: EMERGENCY PROTOCOLS

## Article 10: When Things Go Wrong

### 10.1 Production Incident Response

```
SEVERITY 1 (Critical): App is down or data is corrupted
→ Roll back immediately
→ Notify stakeholders
→ Investigate root cause
→ Write post-mortem

SEVERITY 2 (High): Major feature broken, significant user impact
→ Assess if rollback is needed
→ Hot-fix if safe, otherwise roll back
→ Write incident report

SEVERITY 3 (Medium): Minor feature broken, workaround exists
→ Fix in next release
→ Document workaround
→ Add regression test

SEVERITY 4 (Low): Cosmetic issue, no functional impact
→ Add to backlog
→ Fix when convenient
```

### 10.2 The Rollback Protocol

```bash
# If something goes wrong in production:

# 1. Identify the last known good version
git log --oneline -10

# 2. Roll back Firebase hosting
firebase hosting:rollback

# 3. If functions are affected
firebase deploy --only functions --project anchor-os

# 4. Verify rollback worked
# Check production site manually

# 5. Investigate and fix properly
# Never hot-fix production without tests
```

### 10.3 The Post-Mortem Template

```markdown
## Incident Post-Mortem

**Date**: [Date]
**Duration**: [How long was the incident]
**Severity**: [1-4]
**Affected Users**: [Number or percentage]

### What Happened
[Clear description of the incident]

### Timeline
- HH:MM - [Event]
- HH:MM - [Event]

### Root Cause
[Technical explanation of why this happened]

### Resolution
[How was it fixed]

### Lessons Learned
- [Lesson 1]
- [Lesson 2]

### Action Items
- [ ] [Action to prevent recurrence]
- [ ] [Test to add]
- [ ] [Process to improve]
```

---

# APPENDIX A: QUICK REFERENCE

## The Golden Rules

1. **Test First**: No implementation without a failing test
2. **Understand First**: No code without understanding the system
3. **Security Always**: Validate input, encode output, verify auth
4. **Simplicity Wins**: The simplest solution that works is best
5. **Measure Impact**: Every change has ripple effects—know them

## The Forbidden Practices

❌ Never commit code without tests
❌ Never use `any` type
❌ Never log sensitive data
❌ Never trust user input
❌ Never skip the review checklist
❌ Never deploy directly to production
❌ Never ignore failing tests
❌ Never add dependencies without justification

## The Required Practices

✅ Always write tests first
✅ Always validate user input
✅ Always handle errors gracefully
✅ Always consider accessibility
✅ Always document non-obvious code
✅ Always run the full test suite
✅ Always deploy to staging first
✅ Always monitor after deployment

---

# APPENDIX B: FILE TEMPLATES

## New Component Template

```typescript
/**
 * ComponentName
 * 
 * Brief description of what this component does.
 * 
 * @example
 * <ComponentName title="Hello" onAction={() => {}} />
 */

import { useState } from 'react';
import type { ComponentNameProps } from './types';

export function ComponentName({ title, onAction }: ComponentNameProps) {
  const [state, setState] = useState(false);

  const handleAction = () => {
    onAction();
  };

  return (
    <div className="...">
      {title}
    </div>
  );
}
```

## New Hook Template

```typescript
/**
 * useHookName
 * 
 * Brief description of what this hook provides.
 * 
 * @example
 * const { data, loading, error } = useHookName(id);
 */

import { useState, useEffect, useCallback } from 'react';

interface UseHookNameResult {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useHookName(id: string): UseHookNameResult {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchData(id);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
```

## New Test Template

```typescript
/**
 * Tests for ComponentName
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  describe('rendering', () => {
    it('renders the title', () => {
      render(<ComponentName title="Test Title" onAction={() => {}} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onAction when clicked', () => {
      const onAction = vi.fn();
      render(<ComponentName title="Test" onAction={onAction} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('handles empty title gracefully', () => {
      render(<ComponentName title="" onAction={() => {}} />);
      // Assert expected behavior
    });
  });
});
```

---

**This Constitution is effective immediately and applies to all development work on Anchor OS.**

*Last Updated: January 2026*
*Version: 1.0*
