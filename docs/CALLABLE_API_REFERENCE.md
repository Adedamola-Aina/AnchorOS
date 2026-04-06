# Callable API Reference

> Source of truth: `functions/src/callableRegistry.ts`
> Generated from: ARCH-025 callable registry | Last updated: 2026-04-06
> Total functions: 50 | Callables: 33 | Scheduled: 9 | Triggers: 1 | Webhooks: 1

---

## Authentication & Security

All callable functions enforce **Firebase App Check** in production and staging.
Authentication is via Firebase Auth ID token (automatically attached by the Firebase SDK).

| Security Layer | Enforcement |
|---------------|-------------|
| App Check | Required in prod/staging, optional in dev |
| Auth Token | Required for all callable functions (except `health`) |
| Rate Limiting | Per-function limits (see individual entries) |
| CORS | Strict origin list in prod/staging, open in dev |

---

## Domains

| Domain | Functions | Description |
|--------|-----------|-------------|
| [auth](#auth-events) | 3 | Sign-in event recording and security alerts |
| [bank](#bank-integration) | 5 | Mono bank account linking and transaction sync |
| [fabric](#fabric-ai) | 4 | Behavioral nudges and weekly insight reports |
| [family](#family-mode) | 11 | Invitations, connections, sharing, notifications |
| [finance](#finance) | 7 | Transactions, recurring rules, shared accounts |
| [infra](#infrastructure) | 4 | Rate limiting, audit logging, health check |
| [migration](#migration-framework) | 4 | Versioned schema migration runner |
| [mfa](#mfa) | 1 | Multi-factor authentication recovery |
| [notifications](#notifications) | 5 | Push notifications, reminders, bill alerts |
| [passkey](#passkey-webauthn) | 4 | WebAuthn registration and assertion |
| [user](#user-account) | 2 | Account deletion and feedback |

---

## Auth Events

### `recordAuthEvent`
Record a sign-in or security event for the user's audit history.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `reportUnrecognisedSignIn`
Flag a sign-in event as unrecognised by the user, triggering security review.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `dismissAuthEvent`
Dismiss an auth event from the user's security log.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

---

## Bank Integration

### `linkBankAccount`
Link a bank account via Mono. Initiates the bank authentication flow.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `unlinkBankAccount`
Unlink a previously linked bank account.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `syncBankTransactions`
Scheduled sync of bank transactions from linked accounts.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `syncBankAccountNow`
Manually trigger an immediate bank account sync.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `monoWebhook`
Webhook receiver for Mono bank event notifications.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Webhook (HTTP) |
| Auth | Webhook signature |
| Rate Limit | — |
| Status | Stable |

---

## Fabric AI

### `fabricStreakNudge`
Scheduled nudge for savings streak encouragement via push notification.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `fabricBudgetNudge`
Scheduled nudge for budget threshold alerts via push notification.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `fabricSurplusNudge`
Scheduled nudge for surplus allocation suggestions.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `generateWeeklyReport`
Generate and deliver a weekly Fabric insight report per user.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

---

## Family Mode

### `createFamilyInvitation`
Create a family connection invitation sent via email.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `createInvitation` — 5/hour |
| Status | Stable |

### `revokeInvitation`
Revoke a pending family invitation (owner only).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `revokeInvitation` — 5/hour |
| Status | Stable |

### `validateInvitationToken`
Validate a family invitation token (used by recipient).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `tokenValidation` — 10/hour |
| Status | Stable |

### `acceptInvitation`
Accept a family connection invitation.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `invite` — 10/day |
| Status | Stable |

### `confirmConnection`
Confirm a pending family connection (owner verification step).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `shareAccount`
Share or unshare a financial account with a family member.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required (owner) |
| Rate Limit | `shareAccount` — 20/hour |
| Status | Stable |

### `getSharedAccountsWithMe`
List accounts shared with the current user by family members.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `getSharedAccounts` — 60/min |
| Status | Stable |

### `disconnectFamily`
Remove or leave a family connection.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `disconnectFamily` — 3/hour |
| Status | Stable |

### `onSharedTransactionWrite`
Firestore trigger: sync notifications when a shared transaction is written.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Firestore Trigger |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `cleanupExpiredInvitations`
Scheduled cleanup of expired family invitations (>30 days).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `migrateFamilyConnectionsV2`
⚠️ **DEPRECATED** — One-time V1→V2 family connection migration. Use `runMigration` with id `"001"` instead.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `familyMigration` |
| Status | **Deprecated** — replaced by `runMigration` |

---

## Finance

### `addTransactionToSharedAccount`
Add a transaction to a shared account (family member permission required).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `transactionCreate` — 100/hour |
| Status | Stable |

### `createRecurringTransaction`
Create a recurring transaction rule (e.g., monthly rent, weekly savings).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `transactionCreate` — 100/hour |
| Status | Stable |

### `updateRecurringTransaction`
Update an existing recurring transaction rule.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `deleteRecurringTransaction`
Delete a recurring transaction rule.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `toggleRecurringTransaction`
Enable or disable a recurring transaction rule.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `processRecurringTransactions`
Scheduled processing of due recurring transactions.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `fixSharedAccountScopes`
Fix scope field on shared account transactions. Internal maintenance tool.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | **Internal** |

---

## Infrastructure

### `health`
Health check endpoint. Returns service status and uptime.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | None |
| Rate Limit | — |
| Status | Stable |

### `logAuditEvent`
Log a security or audit event to the immutable audit trail.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `checkRateLimit`
Check rate limit status for a specific bucket. Internal utility.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | **Internal** |

### `resetRateLimit`
Reset a rate limit bucket. Internal admin utility.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | **Internal** |

---

## Migration Framework

### `listMigrations`
List all registered migrations with metadata (id, name, description, createdAt).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `getMigrationStatus`
Get the current status of a specific migration (pending/running/completed/failed/rolled_back).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

**Input**: `{ migrationId: string }`

### `runMigration`
Run a registered migration forward. Supports dry-run mode.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `familyMigration` |
| Status | Stable |

**Input**: `{ migrationId: string, dryRun?: boolean }`

### `rollbackMigration`
Rollback a previously completed migration (best-effort for Firestore).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `familyMigration` |
| Status | Stable |

**Input**: `{ migrationId: string }`

---

## MFA

### `recoverMfaWithCode`
Recover MFA access using a backup recovery code.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `mfaRecovery` — 5/hour |
| Status | Stable |

---

## Notifications

### `getNotifications`
Fetch notifications with optional dismissed filter and limit.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `getNotifications` — 60/min |
| Status | Stable |

### `dismissNotification`
Dismiss a notification by ID.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `dismissNotification` — 30/min |
| Status | Stable |

### `sendTemplatedEmail`
Send a templated email notification. Internal — used by other functions.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `emailSend` — 5/hour |
| Status | **Internal** |

### `processReminders`
Scheduled processing of push notification reminders.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

### `processBillReminders`
Scheduled processing of bill reminder notifications.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Scheduled |
| Auth | — (system) |
| Rate Limit | — |
| Status | Stable |

---

## Passkey (WebAuthn)

### `issuePasskeyChallenge`
Issue a WebAuthn challenge for passkey-based sign-in.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `verifyPasskeyAssertion`
Verify a WebAuthn assertion response for passkey sign-in.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `completePasskeyRegistration`
Complete passkey registration with server-side attestation verification.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

### `deletePasskey`
Delete a registered passkey from the user's account.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

---

## User Account

### `deleteMyAccount`
Permanently delete user account and all associated data (GDPR compliance).

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | `deleteAccount` — 2/day |
| Status | Stable |

### `submitFeedback`
Submit user feedback or bug report.

| Property | Value |
|----------|-------|
| Version | v1 |
| Trigger | Callable |
| Auth | Required |
| Rate Limit | — |
| Status | Stable |

---

## Error Codes

All callable functions return structured errors via Firebase `HttpsError`:

| Code | HTTP Status | Meaning |
|------|------------|---------|
| `unauthenticated` | 401 | Missing or invalid auth token |
| `permission-denied` | 403 | Authenticated but not authorized for this action |
| `not-found` | 404 | Requested resource does not exist |
| `already-exists` | 409 | Resource already exists (e.g., duplicate invitation) |
| `failed-precondition` | 412 | Precondition not met (e.g., no active connection) |
| `resource-exhausted` | 429 | Rate limit exceeded |
| `invalid-argument` | 400 | Invalid or missing input data |
| `internal` | 500 | Unexpected server error |

---

## Versioning Policy (ARCH-025)

- All callables start at **v1** and are tracked in `functions/src/callableRegistry.ts`
- Breaking changes require a new version (e.g., `shareAccountV2`)
- Deprecated callables include a `deprecationNotice` and `replacedBy` field
- Deprecated callables remain operational for at least one release cycle
- The callable registry test (`callableRegistry.test.ts`) enforces completeness — every export must have a registry entry
