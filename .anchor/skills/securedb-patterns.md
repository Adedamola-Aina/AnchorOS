# Skill: secureDb Patterns
# The ONLY way to access Firestore in Anchor OS.
# File: src/utils/secureDb.ts (65 lines)

## The Rule
Every single Firestore operation — read, write, update, delete, subscribe —
goes through `src/utils/secureDb.ts`. There are no exceptions.

Raw Firestore imports (`getDoc`, `setDoc`, `collection`, `onSnapshot`, etc.)
are NEVER used in application code. If you see one, it's a bug.

## Why
- Central audit point for all database access
- Consistent error handling and logging
- Security review has a single surface to audit
- Anti-pattern #8 in AGENTS.md — bypassing this caused a security audit failure

## Usage Pattern

```typescript
// ✅ CORRECT — all DB ops through secureDb
import { secureDb } from '@/utils/secureDb';

// Reading
const account = await secureDb.get('accounts', accountId, userId);

// Writing
await secureDb.set('accounts', accountId, userId, accountData);

// Updating
await secureDb.update('accounts', accountId, userId, { balanceCents: newBalance });

// Deleting
await secureDb.delete('accounts', accountId, userId);

// Subscribing (real-time)
const unsubscribe = secureDb.subscribe('accounts', userId, (accounts) => {
  setAccounts(accounts);
});

// Querying
const transactions = await secureDb.query('finance', userId, [
  where('accountId', '==', accountId),
  orderBy('date', 'desc'),
  limit(50)
]);
```

```typescript
// ❌ WRONG — never do this
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '@/libs/firebase';

const ref = doc(db, `artifacts/anchor-os/users/${userId}/accounts/${accountId}`);
const snap = await getDoc(ref);
```

## Mood Operations (Recent Fix — v1.10.0)
Mood data was previously going through raw Firestore. It was fixed in v1.10.0
as anti-pattern #8. All mood ops now go through secureDb:

```typescript
// ✅ CORRECT (post v1.10.0)
await secureDb.set('fabric_mood', moodId, userId, moodEntry);
```

## If secureDb Doesn't Have the Method You Need
Add the method to `src/utils/secureDb.ts` — do NOT bypass it.
The file is 65 lines. Adding a method keeps it the single surface.
