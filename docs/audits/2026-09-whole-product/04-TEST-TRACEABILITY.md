# Test Traceability — first-pass matrix

Test estates observed: vitest unit/integration (src/**, functions/src), Firestore/Storage rules emulator suites (src/__tests__/*.emulator.ts via config/vitest.rules.config.ts), Playwright e2e (e2e/), visual regression snapshots, stryker mutation configs, lighthouse CI, query-coverage gate (99% statements on Fabric QueryEngine). Counts are NOT treated as verification.

| Capability | Unit | Integration | Rules | E2E | Negative/failure | Security | Confidence |
|---|---|---|---|---|---|---|---|
| Auth (sign in/up/social) | Yes (AuthContext, socialAuth, rate limit) | Partial | — | auth.spec.ts, auth_security.spec.ts | Partial (rate-limit tests) | Yes (auth_security) | AMBER — but MFA/passkey e2e conditionally skipped |
| Passkeys/WebAuthn | Yes (passkeyUtils, usePasskeyAuth; functions passkeyAuth*) | Yes (functions callable tests) | — | Not observed | Partial | Partial | GREY |
| MFA / recovery | Yes (useMfaOperations, mfaRecovery) | Yes | — | Skipped when flag/state off (auth.spec.ts:278+) | Partial | Partial | GREY |
| Session mgmt / revoke | functions sessionManagement tests | Yes | — | sign-out e2e hard-skipped | Partial | Partial | GREY (revoke UI→backend effect unverified) |
| Onboarding / invite accept | Yes (OnboardingView, steps) | Partial | — | onboarding.spec.ts | Partial | — | GREY |
| Account deletion | functions deleteAccount (tests not observed in listing) | — | — | Not observed | Not observed | Not observed | GREY — data-deletion completeness unverified |
| Dashboard | Yes (widgets, useBeyondBasics) | — | — | dashboard.spec.ts, visual snapshots | Partial | — | GREY |
| Commitments CRUD | Yes (TaskContext, useCommitmentService, APIs) | Yes | — | commitments.spec.ts, backlog_advanced.spec.ts | Partial; optimistic-update tests skipped (BUG-023) | — | AMBER |
| Finance core (accounts/txns/transfers) | Yes (FinanceService, LedgerService, TransferOperations…) | Yes (FinanceService.integration) | — | finance.spec.ts (partially skipped), finance_regressions | Yes (FinanceApi.error.test) | Partial (permissions.ts tests) | AMBER — heaviest @ts-nocheck concentration |
| Recurring / bills | Yes (RecurringApi, billReminderUtils; functions recurring, billReminders) | Yes | — | Not deeply observed | Partial | — | GREY |
| Bank link (Mono) | Yes (transactionMapper, monoClient) | — | — | Not observed (external provider) | — | — | GREY — requires live Mono/webhook verification |
| Family mode / sharing | Yes (FamilyConnection/Invitation APIs, functions family*) | Yes | Yes (firestore-rules.family.emulator) | family*.spec.ts — 7+ hard skips pending fixtures | Partial | Yes (rules security suite) | AMBER — e2e hole exactly where risk is |
| Fabric / Anchor AI | Yes (engines, QueryEngine with 99% coverage gate) | Yes | Yes (fabric rules suite) | fabric.spec.ts | Partial | Partial (privacy boundaries) | GREY |
| Settings | Yes (panels) | — | — | settings.spec.ts | Partial | Partial | GREY |
| Notifications / reminders | Yes (contexts, fcmTokenService; functions reminder* well-tested incl. transaction claim test) | Yes | — | Not observed | Partial | — | GREY — real push delivery unverifiable statically |
| Firestore rules | — | — | Yes (core/security/family/fabric emulator suites + rules-coverage checker) | — | Yes (negative rules tests expected) | Yes | AMBER — semantic review pending |
| PWA / offline | Partial (useVersionCheck) | — | — | Not observed | — | — | GREY |
| Native (Capacitor + SwiftUI) | — | — | — | — | — | — | GREY — no automated native test surface observed |
| Analytics/telemetry | Yes (contract tests) | — | — | — | — | — | GREEN (static) |

Distinguish: code coverage exists broadly; behavioral, failure-mode, and security coverage is uneven; end-to-end coverage for family/finance/MFA is partially disabled via skips.
