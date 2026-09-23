# AnchorOS Data Model

Durable Firestore domain contract. Full field-level schemas and historical migrations live in Git history (`docs/FIRESTORE_SCHEMA.md`) and in `config/firestore.rules` / `config/firestore.indexes.json` — the executable authorities.

## Path convention

All data is scoped under one artifact path for multi-tenancy:

```
/artifacts/anchor-os/{collections}
```

## Structure

```
artifacts/anchor-os/
├── users/{userId}                  # profile: uid, email, displayName, mfaEnabled, preferences
│   ├── settings/{docId}
│   ├── family/{docId}
│   ├── accounts/{accountId}
│   │   └── activity/{activityId}   # audit trail per account
│   ├── finance/{transactionId}
│   ├── commitments/{taskId}
│   ├── notifications/{notificationId}
│   └── dashboard/{docId}
├── family_invitations/{inviteId}   # top-level: cross-user invites
├── family_connections/{connectionId}
├── invitations/ (legacy) /{token}
├── audit_log/{logId}
├── rateLimits/{docId}
└── mail/{docId}                    # Trigger Email extension
```

## Collection contracts

| Collection | Purpose | Access |
|---|---|---|
| `users/{uid}` | Profile + preferences (theme, currency NGN/USD, notifications) | Owner only |
| `users/{uid}/accounts/{id}` | Accounts: name, balance (cents), type, currency, `scope: personal \| family` | Owner; shared readers per granted permission |
| `.../accounts/{id}/activity` | Immutable activity log for shared awareness | Owner + shared members |
| `users/{uid}/finance/{id}` | Transactions: amount (cents), type (income/expense/transfer), category, date, linked transfer ID | Owner + shared members (read/transact per permission) |
| `users/{uid}/commitments/{id}` | Commitments/habits with frequency + streaks | Owner (+ family per sharing rules) |
| `users/{uid}/notifications` | Per-user, per-user-dismissable shared-activity notices | Owner only |
| `family_invitations` | Pending invites (unique token, expiry) | Functions-managed |
| `family_connections` | Accepted household links + roles | Functions-managed; read by members |

## Security coupling (summary)

- Owner-based access by default (`request.auth.uid == userId`); family access granted **only** through explicit sharing predicates in `config/firestore.rules`.
- Permission levels: read / transact / manage — enforced server-side; the client can only widen visibility by the owner's explicit share.
- Collection-group queries (`accounts`, `finance`, `activity`) are rule-restricted to prevent cross-household exfiltration.
- Full rules: `config/firestore.rules`; index definitions: `config/firestore.indexes.json` (composite indexes for shared-account queries, recent transactions, unread notifications).

## Consistency patterns

- Transfers write two linked transactions transactionally; editing/deleting one updates/removes the other.
- Disconnect/revoke resets `scope` and strips stale `accountShares` entries.
- Audit events for sensitive actions are appended to `audit_log` via Cloud Functions.

## Analytics contract

Aggregate surfaces (dashboard net worth, 7-day cash flow, trends) are **derived views** of the collections above — they introduce no independent source of truth and must remain recomputable from `accounts` + `finance` + `commitments`.