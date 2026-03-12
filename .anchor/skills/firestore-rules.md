# Skill: Firestore Security Rules
# How to write, extend, and test security rules in Anchor OS.
# File: config/firestore.rules

## Core Principle (Family V3)
Security Rules are the ONLY source of truth for access control.
The frontend displays what the user can read. It does not filter independently.

## Rule Pattern

```javascript
// Standard user-owns-data pattern
match /artifacts/anchor-os/users/{userId}/{collection}/{docId} {
  // Owner has full access
  allow read, write: if request.auth.uid == userId;
}

// Shared account pattern (Family Mode V3)
match /artifacts/anchor-os/users/{userId}/accounts/{accountId} {
  // Owner: full access
  allow read, write: if request.auth.uid == userId;
  
  // Family member: read if in sharedWith map
  allow read: if request.auth.uid in resource.data.get('sharedWith', {}).keys();
}

// Transaction with family member access
match /artifacts/anchor-os/users/{userId}/finance/{txnId} {
  allow read, write: if request.auth.uid == userId;
  
  // Family member can read+write if they have 'transact' permission on the account
  allow read, write: if request.auth.uid in 
    get(/databases/$(database)/documents/artifacts/anchor-os/users/$(userId)/accounts/$(resource.data.accountId))
      .data.get('sharedWith', {}).keys();
}
```

## Rules for Fabric AI Collections

```javascript
// fabric_settings: user-owned, private
match /artifacts/anchor-os/users/{userId}/fabric_settings/{docId} {
  allow read, write: if request.auth.uid == userId;
}

// fabric_activity: user-owned, private behavioral data
match /artifacts/anchor-os/users/{userId}/fabric_activity/{docId} {
  allow read, write: if request.auth.uid == userId;
}

// fabric_mood: user-owned (fixed in v1.10.0 from raw Firestore)
match /artifacts/anchor-os/users/{userId}/fabric_mood/{docId} {
  allow read, write: if request.auth.uid == userId;
}
```

## Writing Rules Tests

```typescript
// src/test/rules/accounts.rules.test.ts
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Accounts rules', () => {
  it('owner can read their own account', async () => {
    const db = testEnv.authenticatedContext('user-123').firestore();
    await assertSucceeds(getDoc(doc(db, 'artifacts/anchor-os/users/user-123/accounts/acc-1')));
  });

  it('other user cannot read private account', async () => {
    const db = testEnv.authenticatedContext('user-456').firestore();
    await assertFails(getDoc(doc(db, 'artifacts/anchor-os/users/user-123/accounts/acc-1')));
  });

  it('family member can read shared account', async () => {
    // Set up: account has sharedWith: { 'user-456': { permissions: ['read'] } }
    const db = testEnv.authenticatedContext('user-456').firestore();
    await assertSucceeds(getDoc(doc(db, 'artifacts/anchor-os/users/user-123/accounts/acc-shared')));
  });
});
```

## Running Rules Tests
```bash
npm run test:rules
# Starts Firebase Emulator and runs rules tests
```
