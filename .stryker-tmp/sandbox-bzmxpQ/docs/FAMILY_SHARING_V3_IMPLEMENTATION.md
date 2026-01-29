# Family Mode V3 - Implementation Guide

## Step-by-Step Implementation

### Step 1: Run Database Migration (10 minutes)

```bash
cd /root/anchor-os
npx ts-node scripts/migrate-to-v3.ts
```

This will:
- Add `ownerId` to all accounts
- Add `accountOwnerId` to all transactions  
- Remove `scope` field from all documents

### Step 2: Update Firestore Rules (5 minutes)

Replace the accounts section (lines 99-118) with:

```javascript
// V3: Accounts - Clean & Simple
match /accounts/{accountId} {
  // Read: Owner OR in sharedWith map
  allow read: if request.auth.uid == userId 
                || request.auth.uid in resource.data.get('sharedWith', {}).keys();
  
  // Only owner can create/update/delete
  allow create, update: if request.auth.uid == userId;
  allow delete: if request.auth.uid == userId;
}
```

Replace the finance section (lines 122-171) with:

```javascript
// V3: Transactions - Clean & Simple
match /finance/{transactionId} {
  // Read: Owner OR shared account member
  allow read: if request.auth.uid == userId || isSharedAccountMember();
  
  // Create: Owner OR shared member with transact permission  
  allow create: if (request.auth.uid == userId || canTransact()) 
                && isValidTransaction(request.resource.data);
  
  // Update/Delete: Only creator or owner
  allow update, delete: if request.auth.uid == userId 
                          || request.auth.uid == resource.data.createdBy;
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
  let permissions = account.data.sharedWith[request.auth.uid].get('permissions', []);
  return 'transact' in permissions;
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules --project anchor-os
```

### Step 3: Update Frontend Queries (20 minutes)

**File: `src/hooks/queries/useFinanceQueries.ts`**

Remove scope filters from ALL queries:

```typescript
// Line 99-105: Family Transactions Query
const q = query(
    collection(db, 'artifacts', APP_ID, 'users', familyMemberId, 'finance'),
    where('date', '>=', start),
    where('date', '<=', end),
    // REMOVED: where('scope', '==', 'family'),
    orderBy('date', 'desc')
);

// Line 138-141: Family Accounts Query  
const q = collection(db, 'artifacts', APP_ID, 'users', familyMemberId, 'accounts');
// REMOVED: where('scope', '==', 'family')

// Line 214-219: Recent Family Transactions
const q = query(
    collection(db, 'artifacts', APP_ID, 'users', familyMemberId, 'finance'),
    // REMOVED: where('scope', '==', 'family'),
    orderBy('date', 'desc'),
    limit(limitCount)
);
```

### Step 4: Update Transaction Creation (10 minutes)

**File: `src/features/finance/TransactionForm.tsx`**

Line 152 - Remove scope logic entirely:

```typescript
await addTransaction({
    title,
    amountCents: amountCents,
    type,
    category: type === 'transfer' ? 'Transfer' : category,
    accountId: selectedAccId,
    accountName: account.name,
    currency: account.currency,
    // REMOVED: scope: account.scope === 'family' ? 'family' : ...,
    date: isoDate,
    destinationAccountId: type === 'transfer' ? destinationAccId : undefined,
} as any);
```

**File: `src/services/FinanceService.ts`**

Update `addTransaction` to always include `accountOwnerId`:

```typescript
// Line 236-249: Standard Transaction
const { destinationAccountId: _, ...transactionData } = payload;
const txRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance'));
batch.set(txRef, {
    ...transactionData,
    id: txRef.id,
    date: transactionDate,
    createdAt,
    isBackdated,
    accountName: sourceAccount.name,
    accountOwnerId: sourceAccount.ownerId || userId,  // ADDED
    currency: sourceAccount.currency,
    createdBy: userId,
    createdByName: profile.name || profile.email,  // ADDED
    isSoftDeleted: false,
    accountShares: sourceAccount.shares || {},
});
```

### Step 5: Remove SharedAccountsSection (5 minutes)

**File: `src/features/finance/FinanceView.tsx`**

Lines 244-251 - Delete this entire section:

```typescript
// DELETE THIS:
<SharedAccountsSection
  ownerName={familyMemberName || 'Family'}
  onSelectAccount={(acc) => setSelectedAccount({
    ...acc,
    ownerId: acc.ownerUid,
  } as AnchorAccount)}
/>
```

Shared accounts now appear in the main accounts list automatically!

### Step 6: Update useFinanceService (15 minutes)

**File: `src/hooks/useFinanceService.ts`**

Simplify the merge logic (lines 130-150):

```typescript
const mergedAccounts = useMemo(() => {
    const userAccs = userAccounts || [];
    const familyAccs = familyAccounts || [];
    
    // Simple merge - no filtering!
    // Security Rules already filtered what we can read
    return [...userAccs, ...familyAccs];
}, [userAccounts, familyAccounts]);
```

### Step 7: Deploy & Test

```bash
# Build
npm run build:production

# Deploy
firebase deploy --only hosting --project anchor-os
```

**Test Checklist:**
- [ ] Owner shares account
- [ ] Invitee refreshes - sees account immediately
- [ ] Invitee clicks account - sees transaction history
- [ ] Invitee records transaction - appears for both users
- [ ] Owner sees transaction with "by {InviteeName}" label
- [ ] Real-time updates work

## Why V3 Works

1. **Security Rules = Source of Truth**: If Firestore returns it, you can see it
2. **No Scope Field**: Can't get wrong what doesn't exist
3. **Direct Queries**: No Cloud Functions to fail
4. **Denormalized Data**: `accountOwnerId` makes rules simple
5. **Real-time Sync**: Firestore snapshots handle everything

## Rollback Plan

```bash
git checkout main  # Return to V2
firebase deploy --only firestore:rules,hosting --project anchor-os
```

Data is backwards compatible - V2 can still read V3 data.

---

**Estimated Total Time**: 1 hour
**Confidence Level**: Very High (proven patterns)
