# Firestore Composite Index Catalog

> Source of truth: `config/firestore.indexes.json`
> Maintained by: DB Engineer (Role 06) | Last updated: 2026-04-06
> CI check: `npm run check:indexes`

---

## Composite Indexes (12)

### family_invitations

| # | Fields | Query Location | Purpose |
|---|--------|---------------|---------|
| 1 | `ownerUid` ASC, `status` ASC | `src/api/FamilyInvitationApi.ts` → `subscribeToOwnerPendingInvitations` | Real-time subscription to invitations sent by owner (pending/awaiting_confirmation) |
| 2 | `status` ASC, `expiresAt` ASC | `functions/src/familyTriggers.ts` → `cleanupExpiredInvitations` | Scheduled cleanup of expired invitations (>30 days) |

### family_connections

| # | Fields | Query Location | Purpose |
|---|--------|---------------|---------|
| 3 | `ownerUid` ASC, `status` ASC | `src/api/FamilyConnectionApi.ts` → `subscribeToActiveFamilyConnection` | Real-time subscription to active connections where user is owner |
| 4 | `memberUid` ASC, `status` ASC | `src/api/FamilyConnectionApi.ts` → `subscribeToActiveFamilyConnection` | Real-time subscription to active connections where user is member |

### notifications

| # | Fields | Query Location | Purpose |
|---|--------|---------------|---------|
| 5 | `dismissed` ASC, `read` ASC, `createdAt` DESC | `src/api/FamilyNotificationApi.ts` → `subscribeToUnreadNotifications` | Fetch unread + undismissed family notifications, newest first |
| 6 | `dismissed` ASC, `createdAt` DESC | `functions/src/notifications.ts` → `getNotifications` | Cloud Function: fetch notifications filtered by dismissed status |
| 7 | `accountId` ASC, `date` DESC | `src/api/AccountNotificationsApi.ts` → `subscribeToAccountNotifications` | Account-specific notification feed, newest first |

### finance

| # | Fields | Query Location | Purpose |
|---|--------|---------------|---------|
| 8 | `scope` ASC, `date` DESC | `functions/src/familySharing.ts` → `markSharedTransactions` | Filter transactions by scope (personal/family) |
| 9 | `category` ASC, `date` DESC | `src/api/FinanceApi.ts` → `searchTransactions` | Advanced search: filter by category with date ordering |
| 10 | `type` ASC, `date` DESC | `src/api/FinanceApi.ts` → `searchTransactions` | Advanced search: filter by type (income/expense/transfer) |
| 11 | `amountCents` ASC, `date` DESC | `src/api/FinanceApi.ts` → `searchTransactions` | Advanced search: filter by amount range |
| 12 | `accountId` ASC, `date` DESC | `src/services/AccountService.ts` → `renameAccount`, `src/api/FinanceApi.ts` → `subscribeToTransactions` | Account transaction list + bulk rename cascade |

---

## Field Overrides (3)

| Collection | Field | Type | Query Location | Purpose |
|-----------|-------|------|---------------|---------|
| `accounts` | `sharedWith` | Collection Group | `functions/src/familySharing.ts` → `getSharedAccounts`, `functions/src/deleteAccount.ts` → `revokeSharedAccess` | Cross-user shared account lookup |
| `reminder_delivery_claims` | `expiresAt` | TTL | Firestore automatic | Auto-delete expired reminder claim tokens |
| `passkeys` | `credentialId` | Collection Group | `functions/src/passkeyAuthHelpers.ts` → `findCredentialByCredentialId` | WebAuthn fallback: find credential across all users |

---

## Adding a New Index

1. Add the index entry to `config/firestore.indexes.json`
2. Add a row to this document with: fields, query location, and purpose
3. Run `npm run check:indexes` to verify catalog coverage
4. Run `npm run check:index-usage` to verify query cross-reference
5. Deploy indexes: `firebase deploy --only firestore:indexes`

---

## Index Audit (DB-001)

> Last audited: 2026-04-06 | Tool: `npm run check:index-usage`

### Audit Result

| Status | Count | Details |
|--------|-------|---------|
| ✅ Used | 12/12 composite | All composite indexes have matching queries in `src/` or `functions/src/` |
| ✅ Used | 2/3 overrides | `passkeys.credentialId` + `reminder_delivery_claims.expiresAt` (TTL) confirmed |
| ℹ️ Note | 1/3 overrides | `accounts.sharedWith` — used via Firestore security rules for collection group queries, not detectable via code search |

### Optimization Notes

- **No unused indexes detected.** All 12 composite indexes serve active queries.
- **finance collection** has 5 indexes — highest density. These support `searchTransactions` advanced filters (category, type, amount, scope) and account-based transaction list. All required for the current feature set.
- **notifications collection** has 3 indexes. Index #5 (`dismissed+read+createdAt`) and #6 (`dismissed+createdAt`) overlap on `dismissed+createdAt`. Index #5 adds `read` for finer-grained unread filtering. Both are required — #5 for client-side unread badge, #6 for Cloud Function notification list.
- **Denormalization trade-offs**: The `scope` field on finance documents was added for family sharing (v2). It creates an additional index (#8) but avoids expensive client-side filtering. Net positive for 75% mobile user base.

### When to Re-Audit

- After adding new collections or composite indexes
- After removing a feature that used indexed queries
- Quarterly as part of SRE review

## Removing an Index

1. Search codebase for all queries using the index fields
2. Confirm no query depends on the composite index
3. Remove from `config/firestore.indexes.json` and this document
4. Run `npm run check:indexes` to verify
