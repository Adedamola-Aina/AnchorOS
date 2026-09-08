# HANDOFF — Next-pass plan

## Recommended deep-audit order (evidence-adjusted)

The default order is retained with one swap: **Commitments before Finance is reversed** — the static pass shows the heaviest @ts-nocheck concentration (67 files) and the balance-mutation risk (LedgerService, transfers, bank sync) in Finance, and Finance also feeds Family shared-data risk. Auth stays first because 28 auth/security-path files are @ts-nocheck and MFA/sign-out e2e is skipped.

1. **Auth / account lifecycle / identity / security — DONE (2026-09-07, 05-AUTH-SECURITY-DOMAIN.md)** — Session "Revoke" is cosmetic (A-03); recovery consume is non-atomic/replayable under race (A-01); recovery codes generated client-side (A-02); deleteAccount is non-transactional with incomplete erasure and zero tests (A-04); only "Not me" revokes refresh tokens; password-change/reset session effects UNVERIFIED (U-01). S-02 resolved as CONFIRMED (A-04). S-01 resolved as confirmed @ts-nocheck exposure (§9 of 05).
2. **Finance / financial integrity — DONE (2026-09-08, 06-FINANCE-FINANCIAL-INTEGRITY.md)** — 18 confirmed findings (FI-01…FI-18): webhook replay cache swallows legitimate Mono retries after handler failure (FI-01 HIGH); webhook HMAC computed over re-serialized JSON, not `req.rawBody` (FI-02 HIGH, fail-closed — channel validity in prod UNVERIFIED UH-01); Mono sync has no pagination/cursor/checkpoint (FI-03 HIGH); balance corrections computed from stale client snapshots on delete/update (FI-05/FI-07); no idempotency anywhere — offline-queue timeout-retry and concurrent syncs duplicate operations/imports (FI-06/FI-18); no reconciliation — imported transactions never corrected/removed (FI-08); deleteMyAccount never revokes Mono (FI-09, deepens A-04 — severity unchanged); ARCH-022 ledger not tamper-evident (FI-11); shared-transaction callable trusts client-supplied ownerId + skips amount validation (FI-10); cash-flow derivations currency-blind and count both transfer legs (FI-12). Batch-level atomicity of transfers IS sound; cross-user finance access rules-proven denied (emulator IDOR suite). No stop condition triggered.
3. **Family permissions / shared data isolation** — rules semantic review (family sections), un-skip family e2e with emulator fixtures, invitation lifecycle, shared finance permissions (finance-pass §10/§11 findings feed directly in here).
4. **Commitments/tasks** — BUG-023 optimistic updates, reminders scheduling, recurrence correctness.
5. **Fabric / Anchor AI** — privacy boundaries, permission checks on financial/family context, provider calls/costs, confirmation gating for actions.
6. **Settings / notifications / devices** — every setting → persisted value → consumer mapping; push token lifecycle; delivery effect.
7. **Home/dashboard/navigation** — widget calculations (ProductivityScore, BeyondBasics), unreachable-nav audit.
8. **UI/UX/design/accessibility** — touch targets, a11y, dark mode, responsive.
9. **Firebase/backend/PWA/native/performance** — callable reachability matrix, storage rules, SW offline, Capacitor vs SwiftUI parity.
10. **Final synthesis** — update scorecards, close finding ledger.

## Preconditions / inputs for next pass
- Emulator seed fixtures needed to un-skip family/finance e2e (F-03) — small infra task, safe, does not touch product code paths.
- Callable registry cross-map (UI consumer ↔ function) to be produced in pass 9.
- Finance-pass inputs for the Family pass: client-permission model & rules `shares`/`sharedWith` dual model (06 §10/§11), FI-10 callable, FI-14 family-readable conversion rows.
- **Reachability caveat (§10):** independent whole-repository reachability/dead-code analysis remains outstanding. Knip's current clean result is not repository-wide evidence — knip.json ignores functions/**, packages/**, e2e/**, tools/**, scripts/**, android/**, ios/**.
- Dependency reconciliation: authenticated Dependabot review required to reconcile the GitHub-reported 67-alert banner with the locally reproduced 19 moderate advisories (F-09) before any dependency remediation task.
- No product remediation until domain audits confirm findings; F-01/F-02/F-04/F-09 are the first likely remediation candidates. Finance remediation ordering: 06 §21 (FI-01/FI-02 first).

## Context control
This pass consumed the inventory/static slice only. Deep domain audits must run in fresh sessions, one domain per session, per Runtime v4 discipline.
