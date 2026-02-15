# Analytics Contract - Anchor OS

Version: 2026-02-14

## Scope

This contract defines product analytics events for core journeys:

- Auth
- Onboarding
- Finance
- Family sharing
- Notification preferences

## Event Schema Source

Canonical schema is implemented in `src/analytics/contract.ts`.

Validation entrypoint:

- Runtime/API usage: `validateAnalyticsEvent(...)`
- Telemetry helper: `logProductEvent(...)` in `src/services/telemetry/index.ts`

## Canonical Events (v2026-02-14)

- `auth_sign_in_succeeded` `{ method: 'password' | 'mfa' }`
- `auth_sign_in_failed` `{ method: 'password' | 'mfa', reason: string }`
- `onboarding_started` `{ source: 'new_user' | 'resume' }`
- `onboarding_completed` `{ durationMs: number }`
- `finance_transaction_created` `{ accountId: string, amountCents: number, type: 'income' | 'expense' | 'transfer' }`
- `finance_transaction_deleted` `{ transactionId: string }`
- `family_invite_sent` `{ channel: 'email' | 'link' }`
- `notification_permission_changed` `{ enabled: boolean }`

## Governance Rules

- Additive changes only for patch releases.
- Breaking changes require contract version bump and migration note.
- Unknown event names must fail validation.
