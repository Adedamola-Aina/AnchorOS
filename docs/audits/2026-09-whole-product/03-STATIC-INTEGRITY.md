# Static Integrity (Phase 1)

## TypeScript suppression inventory

Counts from grep over src/, functions/src/, packages/, apps/ (node_modules and functions/coverage excluded):

| Category | Files |
|---|---|
| `@ts-nocheck` — all files | 403 |
| `@ts-nocheck` — production (non-test) | 205 |
| `@ts-nocheck` — production auth/security/notification paths | 28 (incl. src/context/AuthContext.tsx, useMfaOperations.ts, usePushNotifications.ts, NotificationContext.tsx, AuthGate.tsx, SecuritySettings.tsx, passkey-adjacent api files) |
| `@ts-nocheck` — production finance/commitment paths | 67 (incl. FinanceApi.ts, FinanceOperationsApi.ts, CommitmentApi.ts, CommitmentView tree, most finance/components) |
| `@ts-ignore` / `@ts-expect-error` (repo-owned files) | 6 occurrences in 6 test files only (src/utils/webVitals.test.ts, stagingConsoleCapture tests, error.test.ts, nativeBehavior.test.ts, telemetry/index.test.ts) |

Key observation: tsc strict passes **because** 205 production files disable checking entirely. The suppression belt is concentrated exactly where AGENTS.md declares security sensitivity (auth: 28 files; finance/commitments: 67 files). The effective type-checked surface of the production app is far smaller than the repository implies. NOT remediated in this pass (per scope).

Notable production @ts-nocheck files: src/context/AuthContext.tsx, src/context/FinanceContext.tsx, src/context/NotificationContext.tsx, src/api/FinanceApi.ts, src/api/CommitmentApi.ts, src/hooks/queries/{useFinanceQueries,useTaskQueries}.ts, src/config/persister.ts, src/config/queryClient.ts, src/components/auth/AuthGate.tsx, src/features/flags/featureFlags.ts.

## TODO / stub / placeholder sweep

- ~58 raw matches; after filtering product-term "todo" (TaskType 'todo') and UI placeholder props, remaining real items are listed in FINDINGS (F-01 focus-mode stub, rename stub, export stub).
- `it.todo` test placeholders: useCommitmentService.test.tsx (BUG-023 optimistic updates not implemented), CommitmentsView.test.tsx (completed-toggle animation) — see F-02.
- No `FIXME`/`HACK`/`XXX` matches in production src.

## Skipped tests

- Unit: src/hooks/useFinanceService.test.tsx: two `it.skip` (transactions sorting; delete-reverses-balance). useCommitmentService.test.tsx: two `it.skip` optimistic-update tests.
- E2E: e2e/comprehensive.spec.ts (5 conditional skips), e2e/finance.spec.ts:55 `test.skip(true, …)` account creation, e2e/family-mode-sharing.spec.ts (7 hard skips pending family fixtures), e2e/auth.spec.ts (sign-out skip, MFA setup skips). These represent coverage holes in exactly the high-risk domains (family sharing, finance, auth).

## eslint-disable

- 10 repo-owned suppressions, mostly `react-hooks/set-state-in-effect` and `react-hooks/incompatible-library` (VirtualTransactionList, TaskList), one file-level `static-components` (FamilyNotificationBanner), one `@typescript-eslint/no-require-imports` (functions/src/passkeyAuthHelpers.ts). Low count; individually plausible. Verified contextually — no findings raised on these alone.

## Feature flags

- features/flags: only two flags (fabric_suggestions, anchor_ai_enabled), both enabled-by-default with 100% rollout in all environments. No permanently-off gates found in the flag layer. The flag system itself carries @ts-nocheck.

## Hard-coded values / config

- public/sw.js contains Firebase web API keys for dev/staging/prod — these are public client identifiers (normal for Firebase), recorded for completeness, not a finding.
- public/sw.js dev/staging `measurementId: "G-MEASUREMENT_ID"` is a literal placeholder string (F-04).
- functions/lib/ and functions/coverage/ exist in the working tree (untracked build artifacts; .clineignore'd; not committed — verified via git ls-files).

## Dead code / reachability

- knip exits 0 with zero findings, but knip.json ignores functions/**, packages/**, e2e/**, tools/**, scripts/**, android/**, ios/** and many dependencies — knip's green result covers only src/. Independent reachability of Functions callables, native code, and packages/ui remains unverified (F-06).
- tools/dashboard + tools/mcp-server are declared optional/read-only engineering tooling per AGENTS.md — classified as intentional non-product surface.

## Failure-shaped implementation candidates

See FINDINGS.md F-01..F-08. Confirmed so far: two "coming soon" UI stubs, skipped optimistic-update tests with a BUG-023 marker, PWA placeholder analytics id, sw.js minimal offline cache, duplicate parallel native implementation (apps/ios-native vs Capacitor) with parity risk.
