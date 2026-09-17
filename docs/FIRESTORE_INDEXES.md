# Firestore Index Catalog

Canonical documentation for every composite index and field override in
`config/firestore.indexes.json`. `npm run check:indexes`
(`tools/ci/check-index-catalog.ts`) fails if an entry here is missing.

## Composite indexes

| Collection group | Fields | Purpose |
|---|---|---|
| `family_invitations` | `ownerUid` + `status` | Pending invitations for an owner |
| `family_invitations` | `status` + `expiresAt` | Expiry sweep of pending invitations |
| `family_connections` | `ownerUid` + `status` | Active connection lookup (owner side) |
| `family_connections` | `memberUid` + `status` | Active connection lookup (member side) |
| `notifications` | `dismissed` + `read` + `createdAt` | Undismissed/unread feed ordering |
| `notifications` | `dismissed` + `createdAt` | Undismissed feed ordering |
| `notifications` | `accountId` + `date` | Per-account notification history |
| `finance` | `scope` + `date` | Family/scope-filtered transaction lists |
| `finance` | `category` + `date` | Category-filtered transaction lists |
| `finance` | `type` + `date` | Type-filtered transaction lists |
| `finance` | `amountCents` + `date` | Amount-sorted transaction lists |
| `finance` | `accountId` + `date` | Per-account transaction lists |

## Field overrides

| Collection group | Field | Override | Purpose |
|---|---|---|---|
| `accounts` | `sharedWith` | COLLECTION + COLLECTION_GROUP ascending | Shared-account lookups and collection-group queries |
| `reminder_delivery_claims` | `expiresAt` | TTL | Auto-expire reminder delivery claims |
| `passkeys` | `credentialId` | COLLECTION + COLLECTION_GROUP ascending | Credential resolution during passkey assertion |
| `webhook_events` | `expiresAt` | TTL | Auto-expire Mono webhook replay-cache documents (RA-04) |
| `passkey_challenges` | `expiresAt` | TTL | Auto-expire issued WebAuthn challenges (RA-04) |

## TTL notes

Firestore TTL policies only apply to fields stored as timestamps. Writers must
persist a `Date`/`Timestamp` (not an ISO string) for the field to be expired:

- `functions/src/reminderClaim.ts` — reminder delivery claims.
- `functions/src/bankWebhook.ts` — webhook replay cache (`expiresAt` is a `Date`).
- `functions/src/passkeyAuth.ts` — issued passkey challenges.
