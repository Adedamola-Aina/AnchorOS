# Family Sharing V3 - Complete Redesign Specification

## Executive Summary
The current family sharing implementation has fundamental architectural issues. This document proposes a clean, simple redesign that guarantees invitees can see shared accounts and record transactions.

## Current Problems

### Root Cause Analysis
1. **Data Source Fragmentation**: Three different ways to fetch accounts (Cloud Function, Firestore query, UI state)
2. **Scope Field Dependency**: Complex logic depends on `scope` field matching exactly
3. **Query Filtering**: Frontend filters data that Security Rules already filter
4. **State Synchronization**: Shared accounts don't properly sync with main accounts list

## New Architecture (V3)

### Core Principle
**"Security Rules are the ONLY source of truth for access control. Frontend only displays what the user can read."**

### Data Model

#### 1. Accounts Collection
```typescript
// artifacts/anchor-os/users/{ownerUid}/accounts/{accountId}
{
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'salary' | 'investment';
  balanceCents: number;
  currency: 'NGN' | 'USD';
  ownerId: string;  // Required: Who owns this account
  sharedWith: {
    [memberUid]: {
      grantedAt: string;
      permissions: ['read', 'transact'];  // Explicit permissions
    }
  };
  isArchived: boolean;
}
```

**Key Changes:**
- Remove `scope` field entirely (source of confusion)
- `ownerId` is always required
- Explicit permissions in `sharedWith`

#### 2. Finance Collection (Transactions)
```typescript
// artifacts/anchor-os/users/{ownerUid}/finance/{transactionId}
{
  id: string;
  accountId: string;
  accountOwnerId: string;  // NEW: Denormalized for easy querying
  title: string;
  amountCents: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  date: string;
  createdBy: string;
  createdByName: string;
}
```

**Key Changes:**
- Remove `scope` field
- Add `accountOwnerId` for easier filtering
- Transactions live in account owner's collection

### Security Rules (Simplified)

```javascript
// Read account: Owner OR in sharedWith list
match /accounts/{accountId} {
  allow read: if request.auth.uid == userId 
              || request.auth.uid in resource.data.get('sharedWith', {}).keys();
  allow write: if request.auth.uid == userId;
}

// Read transaction: Owner OR member of the account
match /finance/{transactionId} {
  allow read: if request.auth.uid == userId 
              || isSharedAccountMember();
  allow create: if request.auth.uid == userId 
                || (isSharedAccountMember() && canTransact());
}

function isSharedAccountMember() {
  let tx = resource.data;
  let accountRef = /databases/$(database)/documents/artifacts/$(APP_ID)/users/$(tx.accountOwnerId)/accounts/$(tx.accountId);
  let account = get(accountRef);
  return request.auth.uid in account.data.get('sharedWith', {}).keys();
}

function canTransact() {
  let tx = request.resource.data;
  let accountRef = /databases/$(database)/documents/artifacts/$(APP_ID)/users/$(tx.accountOwnerId)/accounts/$(tx.accountId);
  let account = get(accountRef);
  return 'transact' in account.data.sharedWith[request.auth.uid].get('permissions', []);
}
```

### Frontend Architecture

#### Single Source of Accounts
```typescript
// useFinanceService.ts
export function useFinanceService(userId: string) {
  const { familyMemberUid } = useFamilySharing(userId);
  
  // My accounts (I own them)
  const myAccounts = useAccountsQuery(userId);
  
  // Shared accounts (someone shared with me)
  const sharedAccounts = useSharedAccountsQuery(familyMemberUid);
  
  // Simple merge - no filtering, no scope checks
  const allAccounts = useMemo(() => {
    return [...myAccounts, ...sharedAccounts];
  }, [myAccounts, sharedAccounts]);
  
  return { accounts: allAccounts };
}
```

#### Shared Accounts Query (Direct Firestore)
```typescript
// No Cloud Function needed!
export function useSharedAccountsQuery(ownerUid: string | null) {
  useEffect(() => {
    if (!ownerUid) return;
    
    // Query ALL accounts owned by spouse
    // Security Rules will filter to only show accounts where I'm in sharedWith
    const q = collection(db, 'artifacts', APP_ID, 'users', ownerUid, 'accounts');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const accounts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccounts(accounts);
    });
    
    return unsubscribe;
  }, [ownerUid]);
}
```

#### Transaction Recording
```typescript
export async function addTransaction(
  account: Account, 
  transaction: TransactionData
) {
  // Write to account owner's finance collection
  const targetUserId = account.ownerId;
  
  const txRef = doc(collection(db, 'artifacts', APP_ID, 'users', targetUserId, 'finance'));
  
  await setDoc(txRef, {
    ...transaction,
    accountId: account.id,
    accountOwnerId: account.ownerId,  // Denormalized for rules
    createdBy: currentUser.uid,
    createdByName: currentUser.displayName,
  });
}
```

## Migration Plan

### Phase 1: Update Database Schema (5 minutes)
1. Run script to add `ownerId` to all accounts (if missing)
2. Run script to add `accountOwnerId` to all transactions
3. Run script to remove `scope` field from accounts
4. Run script to remove `scope` field from transactions

### Phase 2: Update Security Rules (5 minutes)
1. Deploy new simplified rules
2. Test with Firebase Emulator

### Phase 3: Update Frontend (30 minutes)
1. Remove all `scope` references from queries
2. Update `useSharedAccountsQuery` to use direct Firestore (not Cloud Function)
3. Update `addTransaction` to always write to `account.ownerId`
4. Remove `SharedAccountsSection` component (use same list)
5. Test locally

### Phase 4: Deploy & Verify (10 minutes)
1. Deploy all changes
2. Owner shares account
3. Invitee refreshes
4. Verify account appears
5. Verify transaction recording works

## Success Criteria

✅ Invitee sees shared account immediately after owner shares
✅ Invitee can view all transaction history
✅ Invitee can record transactions
✅ Transactions appear in real-time for both users
✅ No scope mismatches
✅ No Cloud Functions needed for basic operations

## Why This Will Work

1. **Single Source of Truth**: Security Rules decide access, not frontend logic
2. **Direct Queries**: No Cloud Functions to fail or have logic bugs
3. **Simple Data Model**: No `scope` field to get wrong
4. **Denormalized Data**: `accountOwnerId` makes rules simple
5. **Real-time Sync**: Firestore snapshots for all data

---

**Estimated Implementation Time**: 1 hour
**Risk Level**: Low (simple, well-understood patterns)
**Rollback Plan**: Keep V2 code in git, can revert instantly
