# ANCHOR OS - CODING STANDARDS

## TypeScript Rules

- **Strict mode**: Always enabled
- **No `any`**: Use proper types or `unknown`
- **Explicit returns**: Always specify return types
- **Null safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)

```typescript
// ❌ BAD
function getData(id) {
  return data[id];
}

// ✅ GOOD
function getData(id: string): DataType | undefined {
  return data[id] ?? undefined;
}
```

---

## React Component Patterns

### File Structure
```
src/features/{feature}/
├── {Feature}View.tsx        # Main view component
├── {Feature}View.test.tsx   # Tests
├── components/              # Sub-components
│   ├── {Component}.tsx
│   └── {Component}.test.tsx
└── hooks/                   # Feature-specific hooks
    └── use{Hook}.ts
```

### Component Template
```typescript
import { type FC } from 'react';

interface {Component}Props {
  // Props with JSDoc comments
}

export const {Component}: FC<{Component}Props> = ({ prop1, prop2 }) => {
  // 1. Hooks at top
  // 2. Derived state
  // 3. Effects
  // 4. Handlers
  // 5. Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

---

## Tailwind CSS Rules

- **Mobile-first**: Start with mobile styles, add `md:` and `lg:` for larger
- **Design tokens**: Use `colors.ts` values, not arbitrary colors
- **Spacing**: Use consistent spacing scale (4, 8, 12, 16, 24, 32, 48)
- **No inline styles**: Use Tailwind classes or CSS modules

```tsx
// ❌ BAD
<div style={{ padding: '17px', color: '#3a7bd5' }}>

// ✅ GOOD
<div className="p-4 text-primary-600 md:p-6 lg:p-8">
```

---

## Error Handling

**Every async operation must have error handling:**

```typescript
// ❌ BAD
const data = await fetchData();

// ✅ GOOD
try {
  const data = await fetchData();
  return { success: true, data };
} catch (error) {
  console.error('[fetchData] Error:', error);
  return { success: false, error: getErrorMessage(error) };
}
```

---

## Imports Order

1. React/external libraries
2. Internal components
3. Hooks
4. Utils/helpers
5. Types
6. Styles

```typescript
// External
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Components
import { Button } from '@/components/ui';
import { AccountCard } from './components/AccountCard';

// Hooks
import { useFinanceService } from '@/hooks/useFinanceService';

// Utils
import { formatCurrency } from '@/utils/format';

// Types
import type { Account } from '@/types';
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `AccountCard.tsx` |
| Hooks | camelCase with `use` | `useFinanceService.ts` |
| Utils | camelCase | `formatCurrency.ts` |
| Constants | SCREAMING_SNAKE | `MAX_ACCOUNTS` |
| Types/Interfaces | PascalCase | `AccountType` |
| Test files | `*.test.ts(x)` | `AccountCard.test.tsx` |

---

## Firebase/Firestore Patterns

```typescript
// Always use secureDb wrapper
import { secureDb } from '@/utils/secureDb';

// Never raw Firestore access
// ❌ BAD
const doc = await getDoc(doc(db, 'accounts', id));

// ✅ GOOD  
const account = await secureDb.getAccount(userId, accountId);
```

---

## Performance Guidelines

- **Memoization**: Use `useMemo`/`useCallback` for expensive operations
- **Lazy loading**: Use `React.lazy()` for route-level code splitting
- **Virtual lists**: Use virtualization for lists > 50 items
- **Image optimization**: Use appropriate sizes and lazy loading
