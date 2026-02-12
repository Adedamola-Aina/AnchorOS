# Firestore Schema Documentation - Anchor OS

**Version**: 2.0 (Family Mode v3)  
**Last Updated**: January 26, 2026  
**Status**: Authoritative Reference  
**Firebase Projects**: anchor-os-dev-1c6ec (dev), anchor-os-staging (staging), anchor-os (production)

---

## Table of Contents

1. [Overview](#overview)
2. [Database Structure](#database-structure)
3. [Collection Schemas](#collection-schemas)
4. [Security Model](#security-model)
5. [Indexing Strategy](#indexing-strategy)
6. [Common Query Patterns](#common-query-patterns)
7. [Family Mode Architecture](#family-mode-architecture)
8. [Migration History](#migration-history)

---

## Overview

### Document Path Convention

All Anchor OS data is scoped under a single artifact path for multi-tenancy support:

```
/artifacts/anchor-os/{collections}
```

This allows multiple applications to coexist in the same Firebase project without collision.

### Collection Groups

Firestore supports **collection group queries** which allow querying across all collections with the same name, regardless of parent path. Anchor OS uses this for:

- `accounts` - Query all accounts shared with current user
- `finance` - Query all transactions on shared accounts
- `activity` - Query activity logs across all shared accounts

---

## Database Structure

```
firestore
└── artifacts/
    └── anchor-os/
        ├── users/
        │   └── {userId}/
        │       ├── (document: user profile)
        │       ├── settings/
        │       │   └── {docId}
        │       ├── family/
        │       │   └── {docId}
        │       ├── accounts/
        │       │   └── {accountId}/
        │       │       ├── (document: account data)
        │       │       └── activity/
        │       │           └── {activityId}
        │       ├── finance/
        │       │   └── {transactionId}
        │       ├── commitments/
        │       │   └── {taskId}
        │       ├── notifications/
        │       │   └── {notificationId}
        │       └── dashboard/
        │           └── {docId}
        ├── family_invitations/
        │   └── {inviteId}
        ├── family_connections/
        │   └── {connectionId}
        ├── invitations/ (legacy)
        │   └── {token}
        ├── audit_log/
        │   └── {logId}
        ├── feedback/
        │   └── {feedbackId}
        ├── rateLimits/
        │   └── {docId}
        └── mail/
            └── {docId}
```

---

## Collection Schemas

### 1. Users Collection

**Path**: `artifacts/anchor-os/users/{userId}`

**Purpose**: Store user profiles and settings

**Document Structure**:

```typescript
interface UserProfile {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  displayName: string;            // User's name
  photoURL?: string;              // Profile picture URL
  createdAt: string;              // ISO timestamp
  lastLogin?: string;             // ISO timestamp
  mfaEnabled: boolean;            // Two-factor auth status
  preferences?: {
    theme: 'light' | 'dark';
    currency: 'NGN' | 'USD';
    notifications: boolean;
  };
}
```

**Example**:

```json
{
  "uid": "user123",
  "email": "teeto@adedamola.us",
  "displayName": "Teeto",
  "createdAt": "2026-01-15T10:30:00Z",
  "lastLogin": "2026-01-26T08:45:00Z",
  "mfaEnabled": true,
  "preferences": {
    "theme": "dark",
    "currency": "NGN",
    "notifications": true
  }
}
```

**Security Rules**:
- Read/Write: Owner only (`request.auth.uid == userId`)

---

### 2. Accounts Collection

**Path**: `artifacts/anchor-os/users/{userId}/accounts/{accountId}`

**Purpose**: Store financial accounts (checking, savings, credit, etc.)

**Document Structure**:

```typescript
interface Account {
  id: string;                     // Auto-generated Firestore ID
  name: string;                   // Account name (e.g., "Emergency Fund")
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'salary';
  currency: 'NGN' | 'USD';
  balanceCents: number;           // Balance stored as cents (integer)
  color: string;                  // Hex color for UI (#3B82F6)
  scope: 'personal' | 'family';   // Visibility scope
  ownerId: string;                // User who owns this account
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  isArchived?: boolean;           // Soft delete flag
  
  // Family Mode v2 fields
  sharedWith?: Record<string, {
    grantedAt: string;            // ISO timestamp
    grantedBy: string;            // User ID who granted access
    permission?: 'read' | 'transact' | 'manage';
  }>;
  
  // Legacy sharing (deprecated, kept for backwards compatibility)
  shares?: Record<string, 'read' | 'transact' | 'manage'>;
  
  // Audit trail
  nameHistory?: Array<{
    date: string;
    oldName: string;
    newName: string;
    actorId: string;
    actorName: string;
  }>;
}
```

**Example**:

```json
{
  "id": "acc_xyz789",
  "name": "Joint Checking",
  "type": "checking",
  "currency": "NGN",
  "balanceCents": 250000000,
  "color": "#10B981",
  "scope": "family",
  "ownerId": "user123",
  "createdAt": "2026-01-20T14:00:00Z",
  "updatedAt": "2026-01-26T09:15:00Z",
  "sharedWith": {
    "user456": {
      "grantedAt": "2026-01-22T10:00:00Z",
      "grantedBy": "user123",
      "permission": "transact"
    }
  }
}
```

**Validation Rules** (from Firestore security rules):

```javascript
function isValidAccount(data) {
  return data.name is string && data.name.size() > 0
      && data.balanceCents is int
      && data.type in ['checking', 'savings', 'credit', 'investment', 'cash', 'salary']
      && (data.currency == 'NGN' || data.currency == 'USD');
}
```

**Security Rules**:
- Read: Owner OR shared member (`sharedWith[request.auth.uid]` exists)
- Create: Owner only
- Update: Owner OR manage permission (cannot change `sharedWith` unless owner)
- Delete: Owner only

**Indexing**: See [Indexing Strategy](#indexing-strategy)

---

### 3. Transactions Collection (Finance)

**Path**: `artifacts/anchor-os/users/{userId}/finance/{transactionId}`

**Purpose**: Store all financial transactions (income, expenses, transfers)

**Document Structure**:

```typescript
interface Transaction {
  id: string;                     // Auto-generated Firestore ID
  title: string;                  // Transaction description
  amountCents: number;            // Amount in cents (always positive)
  type: 'income' | 'expense' | 'transfer';
  category: string;               // User-defined category
  accountId: string;              // Account this belongs to
  accountName?: string;           // Denormalized for display
  currency: 'NGN' | 'USD';
  scope: 'personal' | 'family';   // Matches account scope
  date: string;                   // ISO timestamp (entry date)
  transactionDate?: string;       // ISO timestamp (actual transaction date)
  isBackdated?: boolean;          // True if transactionDate != date
  createdAt: string;              // ISO timestamp (audit)
  updatedAt?: string;             // ISO timestamp (optimistic locking)
  
  // Transfer-specific fields
  sourceAccountId?: string;       // For transfers: source account
  destinationAccountId?: string;  // For transfers: destination account
  linkedTransactionId?: string;   // For transfers: paired transaction ID
  linkedUserId?: string;          // For transfers: other user's ID
  
  // Family Mode fields
  accountShares?: Record<string, true>;  // Denormalized for collection group queries
  createdBy?: string;             // User who created this transaction
  createdByName?: string;         // Denormalized creator name
}
```

**Example - Expense**:

```json
{
  "id": "tx_abc123",
  "title": "Groceries at Shoprite",
  "amountCents": 2500000,
  "type": "expense",
  "category": "Food",
  "accountId": "acc_xyz789",
  "accountName": "Joint Checking",
  "currency": "NGN",
  "scope": "family",
  "date": "2026-01-26T14:30:00Z",
  "createdAt": "2026-01-26T14:30:00Z",
  "createdBy": "user456",
  "createdByName": "Alice",
  "accountShares": {
    "user123": true,
    "user456": true
  }
}
```

**Example - Transfer**:

```json
{
  "id": "tx_transfer_1",
  "title": "Transfer to Savings",
  "amountCents": 5000000,
  "type": "transfer",
  "category": "Transfer",
  "accountId": "acc_checking",
  "sourceAccountId": "acc_checking",
  "destinationAccountId": "acc_savings",
  "linkedTransactionId": "tx_transfer_2",
  "currency": "NGN",
  "scope": "personal",
  "date": "2026-01-26T15:00:00Z",
  "createdAt": "2026-01-26T15:00:00Z"
}
```

**Validation Rules**:

```javascript
function isValidTransaction(data) {
  return data.title is string && data.title.size() > 0
      && data.amountCents is int && data.amountCents >= 0
      && data.type in ['income', 'expense', 'transfer']
      && data.date is string;
}
```

**Security Rules**:
- Read: Owner OR shared account member (`accountShares[request.auth.uid]` exists)
- Create: Owner OR connected family member (for shared accounts)
- Update: Owner OR manage permission (shared members cannot update)
- Delete: Owner OR shared member with permission

**Critical Note**: The `accountShares` field is denormalized from the parent account's `sharedWith` map to enable **collection group queries**. This is essential for Family Mode to efficiently query all transactions across shared accounts.

---

### 4. Account Activity Collection

**Path**: `artifacts/anchor-os/users/{userId}/accounts/{accountId}/activity/{activityId}`

**Purpose**: Audit trail for shared account changes

**Document Structure**:

```typescript
interface AccountActivity {
  id: string;                     // Auto-generated Firestore ID
  accountId: string;              // Parent account ID
  accountOwnerId: string;         // Owner of the account
  action: ActivityAction;         // Type of action performed
  actorId: string;                // User who performed action
  actorName: string;              // Denormalized actor name
  timestamp: string;              // ISO timestamp
  details: {
    // For transactions
    transactionId?: string;
    transactionTitle?: string;
    amountCents?: number;
    currency?: string;
    type?: 'income' | 'expense' | 'transfer';
    
    // For edits
    previousTitle?: string;
    previousAmountCents?: number;
    
    // For account rename
    oldName?: string;
    newName?: string;
    
    // For sharing
    sharedWithName?: string;
    permission?: 'read' | 'transact' | 'manage';
  };
}

type ActivityAction =
  | 'transaction_added'
  | 'transaction_edited'
  | 'transaction_deleted'
  | 'account_renamed'
  | 'account_shared'
  | 'account_unshared';
```

**Example**:

```json
{
  "id": "activity_1",
  "accountId": "acc_xyz789",
  "accountOwnerId": "user123",
  "action": "transaction_added",
  "actorId": "user456",
  "actorName": "Alice",
  "timestamp": "2026-01-26T14:30:00Z",
  "details": {
    "transactionId": "tx_abc123",
    "transactionTitle": "Groceries at Shoprite",
    "amountCents": 2500000,
    "currency": "NGN",
    "type": "expense"
  }
}
```

**Security Rules**:
- Read: Owner OR shared account members
- Create: Owner OR shared account members (logged automatically by app)
- Update/Delete: Not allowed (append-only log)

**Design Note**: Activity logs are **append-only** to maintain audit integrity. They cannot be edited or deleted by clients.

---

### 5. Commitments Collection

**Path**: `artifacts/anchor-os/users/{userId}/commitments/{taskId}`

**Purpose**: Store user tasks and habits (daily, weekly, monthly, todo)

**Document Structure**:

```typescript
interface Commitment {
  id: string;                     // Auto-generated Firestore ID
  title: string;                  // Task description
  type: 'daily' | 'weekly' | 'monthly' | 'todo';
  completed: boolean;             // Current completion state
  category: 'personal' | 'family';
  createdAt: Date | string;       // ISO timestamp
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any';
  daysOfWeek?: string[];          // ['M', 'W', 'F'] for weekly tasks
  dayOfMonth?: number;            // 1-31 for monthly tasks
  daysOfMonth?: number[];         // Multiple days for monthly
  domain?: string;                // Health, Work, Bible, etc.
  reminderTime?: string;          // HH:mm format
  lastCompletedAt?: string;       // ISO timestamp
  currentStreak?: number;         // Consecutive completions
  longestStreak?: number;         // Best streak
}
```

**Example**:

```json
{
  "id": "task_morning_routine",
  "title": "Morning devotional",
  "type": "daily",
  "completed": true,
  "category": "personal",
  "createdAt": "2026-01-15T06:00:00Z",
  "timeOfDay": "morning",
  "domain": "Bible",
  "reminderTime": "06:00",
  "lastCompletedAt": "2026-01-26T06:15:00Z",
  "currentStreak": 12,
  "longestStreak": 45
}
```

**Validation Rules**:

```javascript
function isValidTask(data) {
   return data.title is string && data.title.size() > 0
      && data.completed is bool;
}
```

**Security Rules**:
- Read: Owner OR connected family member (if category='family')
- Create/Update: Owner only
- Delete: Owner only

---

### 6. Notifications Collection

**Path**: `artifacts/anchor-os/users/{userId}/notifications/{notificationId}`

**Purpose**: Store user notifications (account activity, reminders, system alerts)

**Document Structure**:

```typescript
interface Notification {
  id: string;                     // Auto-generated Firestore ID
  userId: string;                 // Recipient user ID
  type: 'family_activity' | 'account_shared' | 'reminder' | 'system';
  title: string;                  // Notification title
  message: string;                // Notification body
  createdAt: string;              // ISO timestamp
  read: boolean;                  // Read status
  dismissed: boolean;             // Dismissed status
  
  // Context-specific fields
  accountId?: string;             // Related account
  actorId?: string;               // User who triggered notification
  actorName?: string;             // Denormalized actor name
  actionUrl?: string;             // Deep link to relevant page
}
```

**Example**:

```json
{
  "id": "notif_abc123",
  "userId": "user123",
  "type": "family_activity",
  "title": "New Transaction",
  "message": "Alice added 'Groceries at Shoprite' to Joint Checking",
  "createdAt": "2026-01-26T14:30:00Z",
  "read": false,
  "dismissed": false,
  "accountId": "acc_xyz789",
  "actorId": "user456",
  "actorName": "Alice",
  "actionUrl": "/finance?account=acc_xyz789"
}
```

**Security Rules**:
- Read: Owner only
- Create: Owner OR Cloud Functions (admin SDK)
- Update: Owner only (can mark read/dismissed)
- Delete: Owner only

---

### 7. Family Invitations Collection

**Path**: `artifacts/anchor-os/family_invitations/{inviteId}`

**Purpose**: Manage Family Mode connection invitations

**Document Structure**:

```typescript
interface FamilyInvitation {
  id: string;                     // Auto-generated Firestore ID
  ownerUid: string;               // User who sent invitation
  ownerName: string;              // Sender's display name
  ownerEmail: string;             // Sender's email
  recipientEmail: string;         // Invited user's email
  inviteToken: string;            // Verification token (6-digit code)
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  createdAt: string;              // ISO timestamp
  expiresAt: string;              // ISO timestamp (48 hours)
  acceptedAt?: string;            // ISO timestamp
  revokedAt?: string;             // ISO timestamp
}
```

**Example**:

```json
{
  "id": "invite_abc123",
  "ownerUid": "user123",
  "ownerName": "Teeto",
  "ownerEmail": "teeto@adedamola.us",
  "recipientEmail": "alice@example.com",
  "inviteToken": "847291",
  "status": "pending",
  "createdAt": "2026-01-25T10:00:00Z",
  "expiresAt": "2026-01-27T10:00:00Z"
}
```

**Security Rules**:
- Read/Write: Authenticated users (simplified for dev/staging)
- Production: Owner OR recipient email matches

---

### 8. Family Connections Collection

**Path**: `artifacts/anchor-os/family_connections/{connectionId}`

**Purpose**: Represent established family relationships

**Connection ID Pattern**: Deterministic `{uid1}_{uid2}` where uid1 < uid2 lexicographically

**Document Structure**:

```typescript
interface FamilyConnection {
  id: string;                     // Deterministic: smaller_uid + '_' + larger_uid
  ownerUid: string;               // User who initiated connection
  memberUid: string;              // Connected family member
  ownerName: string;              // Denormalized owner name
  memberName: string;             // Denormalized member name
  status: 'active' | 'disconnected';
  connectedAt: string;            // ISO timestamp
  disconnectedAt?: string;        // ISO timestamp
}
```

**Example**:

```json
{
  "id": "user123_user456",
  "ownerUid": "user123",
  "memberUid": "user456",
  "ownerName": "Teeto",
  "memberName": "Alice",
  "status": "active",
  "connectedAt": "2026-01-25T12:00:00Z"
}
```

**Design Pattern**: Deterministic IDs prevent duplicate connections:

```typescript
// Always order UIDs lexicographically
const connectionId = [uid1, uid2].sort().join('_');

// Check for existing connection
const connectionExists = 
  await getDoc(doc(db, 'family_connections', connectionId));
```

**Security Rules**:
- Read/Write: Authenticated users (simplified for dev/staging)
- Production: Both users in connection

---

## Security Model

### Core Principles

1. **Zero Trust**: Every request is verified against Firestore security rules
2. **Principle of Least Privilege**: Users get minimum permissions needed
3. **Owner-Centric**: Data owner has full control
4. **Explicit Sharing**: Sharing requires deliberate, verified action
5. **Audit Trail**: All shared account actions are logged

### Permission Levels

#### Account Permissions

| Permission | Read | Create Transaction | Edit Transaction | Delete Transaction | Share Account | Rename Account |
|-----------|------|-------------------|-----------------|-------------------|---------------|----------------|
| **read** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **transact** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **manage** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **owner** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Security Rule Patterns

#### Collection-Level Queries

**Critical Issue**: Firestore security rules evaluate at the **document level**, but collection queries fail if **ANY** document in the result would violate rules.

```javascript
// ❌ WRONG: This query fails for shared accounts
// If user123 queries for ALL finance documents, and some belong to accounts
// they don't have access to, the ENTIRE query fails (not just those documents)
const transactions = await getDocs(
  collection(db, `users/${userId}/finance`)
);

// ✅ CORRECT: Use Cloud Functions with admin privileges
const getSharedAccountTransactions = httpsCallable(functions, 'getSharedAccountTransactions');
const result = await getSharedAccountTransactions({ accountId });
```

#### Collection Group Queries

**Solution**: Use collection group queries with permission maps:

```javascript
// Finance transactions have accountShares map for collection group queries
match /{path=**}/finance/{txId} {
  allow read: if request.auth != null 
              && request.auth.uid in resource.data.get('accountShares', {}).keys();
}
```

```typescript
// Query all transactions across shared accounts
const transactions = await getDocs(
  query(
    collectionGroup(db, 'finance'),
    where(`accountShares.${currentUserId}`, '==', true),
    orderBy('date', 'desc')
  )
);
```

### Family Mode Security Flow

1. **Invitation Phase**:
   - Owner creates invitation (stored in `family_invitations`)
   - 6-digit verification token generated
   - Token shared out-of-band (email, messaging, etc.)

2. **Acceptance Phase**:
   - Recipient enters token in app
   - Cloud Function validates token and creates connection
   - Connection document created in `family_connections`

3. **Account Sharing Phase**:
   - Owner explicitly shares account with connected member
   - Account's `sharedWith` map updated with permissions
   - All existing transactions get `accountShares` map updated
   - Activity log entry created

4. **Transaction Creation Phase**:
   - Shared member creates transaction on shared account
   - Transaction gets `accountShares` map from account
   - Activity log entry created
   - Notification sent to account owner

### Data Access Patterns

```typescript
// Pattern 1: Owner accessing their own data
const myAccounts = await getDocs(
  collection(db, `users/${currentUserId}/accounts`)
);

// Pattern 2: Shared member accessing shared accounts (collection group)
const sharedAccounts = await getDocs(
  query(
    collectionGroup(db, 'accounts'),
    where(`sharedWith.${currentUserId}`, '!=', null)
  )
);

// Pattern 3: Transactions on shared accounts (Cloud Function)
const result = await httpsCallable(functions, 'getSharedAccountTransactions')({
  accountId: 'acc_xyz789'
});

// Pattern 4: Activity log for shared account
const activity = await getDocs(
  collection(db, `users/${accountOwnerId}/accounts/${accountId}/activity`)
);
```

---

## Indexing Strategy

### Composite Indexes

Firestore requires composite indexes for queries with multiple conditions or orderBy clauses. These are defined in `config/firestore.indexes.json`:

#### Family Invitations

```json
{
  "collectionGroup": "family_invitations",
  "fields": [
    { "fieldPath": "ownerUid", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" }
  ]
}
```

**Query**: Get all pending invitations sent by user

```typescript
const invitations = await getDocs(
  query(
    collection(db, 'family_invitations'),
    where('ownerUid', '==', currentUserId),
    where('status', '==', 'pending')
  )
);
```

#### Notifications

```json
{
  "collectionGroup": "notifications",
  "fields": [
    { "fieldPath": "dismissed", "order": "ASCENDING" },
    { "fieldPath": "read", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

**Query**: Get unread, undismissed notifications ordered by date

```typescript
const notifications = await getDocs(
  query(
    collection(db, `users/${currentUserId}/notifications`),
    where('dismissed', '==', false),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  )
);
```

#### Finance Transactions

```json
{
  "collectionGroup": "finance",
  "fields": [
    { "fieldPath": "accountId", "order": "ASCENDING" },
    { "fieldPath": "date", "order": "DESCENDING" }
  ]
}
```

**Query**: Get recent transactions for specific account

```typescript
const transactions = await getDocs(
  query(
    collection(db, `users/${userId}/finance`),
    where('accountId', '==', accountId),
    orderBy('date', 'desc'),
    limit(50)
  )
);
```

### Field Overrides

**Shared Accounts**: Enable collection group queries on `sharedWith` map

```json
{
  "collectionGroup": "accounts",
  "fieldPath": "sharedWith",
  "indexes": [
    {
      "order": "ASCENDING",
      "queryScope": "COLLECTION_GROUP"
    }
  ]
}
```

---

## Common Query Patterns

### 1. Get User's Personal Accounts

```typescript
const accounts = await getDocs(
  query(
    collection(db, `users/${currentUserId}/accounts`),
    where('scope', '==', 'personal')
  )
);
```

### 2. Get All Shared Accounts (Owner + Member)

```typescript
// Owner's shared accounts
const ownedShared = await getDocs(
  query(
    collection(db, `users/${currentUserId}/accounts`),
    where('scope', '==', 'family')
  )
);

// Member's shared accounts (collection group query)
const memberShared = await getDocs(
  query(
    collectionGroup(db, 'accounts'),
    where(`sharedWith.${currentUserId}`, '!=', null)
  )
);
```

### 3. Get Recent Transactions for Account

```typescript
const transactions = await getDocs(
  query(
    collection(db, `users/${accountOwnerId}/finance`),
    where('accountId', '==', accountId),
    orderBy('date', 'desc'),
    limit(50)
  )
);
```

### 4. Get Activity Log for Shared Account

```typescript
const activity = await getDocs(
  query(
    collection(db, `users/${accountOwnerId}/accounts/${accountId}/activity`),
    orderBy('timestamp', 'desc'),
    limit(20)
  )
);
```

### 5. Get Unread Notifications

```typescript
const notifications = await getDocs(
  query(
    collection(db, `users/${currentUserId}/notifications`),
    where('dismissed', '==', false),
    orderBy('createdAt', 'desc')
  )
);
```

### 6. Check Family Connection Status

```typescript
const connectionId = [userId1, userId2].sort().join('_');
const connectionDoc = await getDoc(
  doc(db, 'family_connections', connectionId)
);

const isConnected = connectionDoc.exists() && 
                   connectionDoc.data().status === 'active';
```

---

## Family Mode Architecture

### Connection Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     INVITATION PHASE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Owner (User A)                    System                   │
│       │                               │                      │
│       │ 1. Create Invitation          │                      │
│       ├──────────────────────────────>│                      │
│       │                               │                      │
│       │ 2. Generate 6-digit Token     │                      │
│       │<──────────────────────────────┤                      │
│       │                               │                      │
│       │ 3. Share Token (SMS/Email)    │                      │
│       ├───────────────────────────────┼──────────>│         │
│       │                               │          Recipient   │
│       │                               │          (User B)    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     ACCEPTANCE PHASE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                       │ 4. Enter Token       │
│                                       │<─────────────────────┤
│                                       │                      │
│                                       │ 5. Validate & Connect│
│                                       │                      │
│       6. Notification                 │                      │
│       <───────────────────────────────┤                      │
│                                       │                      │
│                   Connection Created in Firestore            │
│              (family_connections/{uid1}_{uid2})             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Account Sharing Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   ACCOUNT SHARING PHASE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Owner                        System                Member  │
│    │                             │                    │      │
│    │ 1. Share Account            │                    │      │
│    ├────────────────────────────>│                    │      │
│    │    (accountId, memberId,    │                    │      │
│    │     permission: 'transact') │                    │      │
│    │                             │                    │      │
│    │ 2. Update sharedWith map    │                    │      │
│    │    in account document      │                    │      │
│    │<────────────────────────────┤                    │      │
│    │                             │                    │      │
│    │ 3. Backfill accountShares   │                    │      │
│    │    on existing transactions │                    │      │
│    │<────────────────────────────┤                    │      │
│    │                             │                    │      │
│    │ 4. Create activity log      │                    │      │
│    │    entry                    │                    │      │
│    │<────────────────────────────┤                    │      │
│    │                             │                    │      │
│    │                             │ 5. Send notification│      │
│    │                             ├───────────────────>│      │
│    │                             │                    │      │
│    │                             │ 6. Member sees account    │
│    │                             │    in shared list  │      │
│    │                             │                    │      │
└─────────────────────────────────────────────────────────────┘
```

### Transaction on Shared Account Flow

```
┌─────────────────────────────────────────────────────────────┐
│               SHARED ACCOUNT TRANSACTION                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Member                       System                 Owner   │
│    │                             │                     │     │
│    │ 1. Create Transaction       │                     │     │
│    ├────────────────────────────>│                     │     │
│    │    (on shared account)      │                     │     │
│    │                             │                     │     │
│    │ 2. Verify permission        │                     │     │
│    │    (transact or manage)     │                     │     │
│    │                             │                     │     │
│    │ 3. Create transaction doc   │                     │     │
│    │    with accountShares map   │                     │     │
│    │<────────────────────────────┤                     │     │
│    │                             │                     │     │
│    │ 4. Update account balance   │                     │     │
│    │    (atomic operation)       │                     │     │
│    │<────────────────────────────┤                     │     │
│    │                             │                     │     │
│    │ 5. Create activity log      │                     │     │
│    │<────────────────────────────┤                     │     │
│    │                             │                     │     │
│    │                             │ 6. Notify owner     │     │
│    │                             ├────────────────────>│     │
│    │                             │                     │     │
│    │                             │ 7. Owner sees in feed    │
│    │                             │                     │     │
└─────────────────────────────────────────────────────────────┘
```

### Data Consistency Patterns

#### Problem: Collection-Level Queries Fail with Partial Access

When a user queries their `finance` collection, Firestore checks security rules for **every document** in the collection. If the user doesn't have access to ANY document (e.g., transactions on accounts they don't own), the **entire query fails**.

**Example**:

```typescript
// ❌ This fails if user has ANY transactions they can't access
const allTransactions = await getDocs(
  collection(db, `users/${accountOwner}/finance`)
);
// Error: Missing or insufficient permissions
```

#### Solution 1: Collection Group Queries

Use collection group queries with denormalized permission maps:

```typescript
// ✅ Query across all users, but only get accessible documents
const myTransactions = await getDocs(
  query(
    collectionGroup(db, 'finance'),
    where(`accountShares.${currentUserId}`, '==', true)
  )
);
```

#### Solution 2: Cloud Functions

For complex queries, use Cloud Functions with admin privileges:

```typescript
// Cloud Function (runs with admin SDK - bypasses security rules)
export const getSharedAccountTransactions = onCall(async (request) => {
  const { accountId } = request.data;
  const userId = request.auth.uid;
  
  // Verify user has access to account
  const accountDoc = await admin.firestore()
    .doc(`users/${accountOwnerId}/accounts/${accountId}`)
    .get();
  
  if (!accountDoc.exists) return { transactions: [] };
  
  const account = accountDoc.data();
  const hasAccess = account.ownerId === userId || 
                   account.sharedWith?.[userId];
  
  if (!hasAccess) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'User does not have access to this account'
    );
  }
  
  // Fetch transactions with admin privileges
  const transactions = await admin.firestore()
    .collection(`users/${accountOwnerId}/finance`)
    .where('accountId', '==', accountId)
    .orderBy('date', 'desc')
    .limit(100)
    .get();
  
  return { transactions: transactions.docs.map(d => d.data()) };
});
```

---

## Migration History

### v1.0 - Initial Schema (Jan 2025)

- Basic user, account, transaction collections
- Personal scope only
- No family sharing

### v1.5 - Family Mode v1 (Legacy)

- Added `shares` map to accounts
- Direct sharing without connections
- No audit trail

### v2.0 - Family Mode v2 (Current)

- Added `family_invitations` collection
- Added `family_connections` collection
- Added `sharedWith` map with metadata
- Added `accountShares` denormalization
- Added `activity` subcollection
- Implemented collection group queries
- Enhanced security rules

**Migration Notes**:
- Legacy `shares` map kept for backwards compatibility
- New sharing uses `sharedWith` exclusively
- Cloud Function backfills `accountShares` on existing transactions

---

## Additional Resources

### Related Documentation

- **config/firestore.rules** - Full security rules implementation
- **config/firestore.indexes.json** - Complete index definitions
- **CLAUDE.md** - Development constitution
- **FAMILY_SHARING_V3_IMPLEMENTATION.md** - Detailed Family Mode spec

### Firebase Console Links

- **Development**: https://console.firebase.google.com/project/anchor-os-dev-1c6ec
- **Staging**: https://console.firebase.google.com/project/anchor-os-staging
- **Production**: https://console.firebase.google.com/project/anchor-os

### Schema Maintenance

This document should be updated when:
- New collections are added
- Field schemas change
- Security rules are modified
- New query patterns are established
- Indexes are added or changed

**Document Owner**: Anchor OS Core Team  
**Review Cadence**: After major features  
**Last Reviewed**: January 26, 2026
