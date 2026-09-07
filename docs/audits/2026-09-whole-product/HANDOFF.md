# HANDOFF — Next-pass plan

## Recommended deep-audit order (evidence-adjusted)

The default order is retained with one swap: **Commitments before Finance is reversed** — the static pass shows the heaviest @ts-nocheck concentration (67 files) and the balance-mutation risk (LedgerService, transfers, bank sync) in Finance, and Finance also feeds Family shared-data risk. Auth stays first because 28 auth/security-path files are @ts-nocheck and MFA/sign-out e2e is skipped.

1. **Auth / account lifecycle / identity / security** — verify session revoke actually revokes (server-side), MFA recovery, passkey ceremonies, email verification flows; review AuthContext under suppression.
2. **Finance / financial integrity** — LedgerService invariants, transfer atomicity, delete-reverses-balance (skipped test), bank sync/webhook authorization (Mono), recurring engine.
3. **Family permissions / shared data isolation** — rules semantic review (family sections), un-skip family e2e with emulator fixtures, invitation lifecycle, shared finance permissions.
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
- **Reachability caveat (§10):** independent whole-repository reachability/dead-code analysis remains outstanding. Knip's current clean result is not repository-wide evidence — knip.json ignores functions/**, packages/**, e2e/**, tools/**, scripts/**, android/**, ios/**.
- Dependency reconciliation: authenticated Dependabot review required to reconcile the GitHub-reported 67-alert banner with the locally reproduced 19 moderate advisories (F-09) before any dependency remediation task.
- No product remediation until domain audits confirm findings; F-01/F-02/F-04/F-09 are the first likely remediation candidates.

## Context control
This pass consumed the inventory/static slice only. Deep domain audits must run in fresh sessions, one domain per session, per Runtime v4 discipline.
