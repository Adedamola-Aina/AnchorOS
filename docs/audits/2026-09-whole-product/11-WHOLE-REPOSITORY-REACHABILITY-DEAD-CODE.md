# 11 — Whole-Repository Reachability / Dead-Code / Stale-Infrastructure Sweep

Date: 2026-09-08 · Branch: `audit/whole-product-2026-09` · Base: `6ca1911ab6c56035995cd2a460e9d183930496c6`
Scope: every tracked area — `src/**`, `functions/**`, `packages/**`, `e2e/**`, `tools/**`, `scripts/**`, `.github/**`, `config/**`, `public/**`, root files, Firebase/Capacitor/Vite/test configuration, workflows, service workers, migration tooling.

**AUDIT ONLY.** Nothing deleted, refactored, uninstalled, or reconfigured. Temporary analysis scripts ran from `/tmp` and were not committed.

---

## 1. Executive summary

The repository is **substantially live**: of ~400 non-test `src` modules, **13 are provably orphaned** (zero static *and* dynamic importers — all masked from Knip by its test-entry glob, and every one carrying a dedicated test file for code nothing ships); of 81 non-test Functions source files, **all are deployment-reachable** (the barrel exports every runtime entry; non-exported files are internal infrastructure), but **~10 deployed callables have no product caller** and remain externally invokable attack surface. Three configuration surfaces are template residue that cannot work as committed (Appknox, Mayhem-for-API, plus a rules branch and a package with no consumer). One feature flag (`fabric_suggestions`) is dead. Eight duplicate-implementation pairs require architectural decisions rather than deletion. The long-standing caveat is now closed: **Knip's clean result is misleading in a specific, documented way** (test-entry masking + 7 ignored top-level areas), and this pass replaces it with an evidence-backed map.

**Headline discoveries:**
1. **13 orphaned production modules + 13 orphaned test files** — including the *entire client-side device-attestation feature* (`src/services/deviceAttestation.ts` has zero callers → SEC-006 is not merely inert but unreachable, deepening A-08/SN-10) and the FB-14 Fabric dead estate (MonthlyReviewModal, SubscriptionDetector, monthly-review trigger).
2. **`stryker-setup-0.js` is a Stryker-generated sandbox artifact committed to the repo root** (self-describing: "This file is copied to the sandbox dir"); `-1`/`-2` variants exist untracked in the working tree — accidental-commit class.
3. **Two CI workflows are literal template placeholders** (Appknox `./gradlew build # Update this…` against a gitignored `android/`; Mayhem `./run_your_api.sh & # <- ✏️ update this` — no such script exists).
4. **`@anchor-os/types` package has zero consumers** (only its own index) despite a tsconfig path alias.
5. **Suspected-dead code disproven as live:** `billReminderUtils` (client), `getSharedAccountsWithMe`, `validateInvitationToken`, devtools `fixSharedAccountScopes`, and the whole scripts/ set (every script has a package.json/Husky/CI consumer).

---

## 2. Methodology

1. **Entrypoint inventory first** (§4) — nothing classified dead before every legitimate entrypoint class was enumerated.
2. **Knip executed and bounded** (§3) — recorded what it covers and, critically, what its configuration structurally cannot see.
3. **Mechanical orphan scan** — for each of 407 non-test `src` modules, counted non-test referencing files by basename for *both* static (`from '…/stem'`) and dynamic (`import('…/stem')`) forms; 28 initial zero-importer candidates re-scanned with dynamic-import patterns → **13 confirmed orphans**, 15 disproven (route lazies, `main.tsx`-level utilities).
4. **Backend export matrix** — every `functions/src/*.ts` checked against the `index.ts` barrel; non-exported files checked as internal imports; every deployed callable name cross-referenced against client invocation sites (`httpsCallable(functions, '…')`, multiline-aware extraction → 30 distinct client-called names).
5. **Configuration/CI cross-reference** — every script, workflow, and public asset grepped against `package.json`, `.husky/`, `.github/workflows/`, `firebase.json`, `vite.config.ts`, `capacitor.config.ts`, `index.html`.
6. **Generated-artifact discrimination** — `git check-ignore` + `git ls-files` to separate tracked residue (e.g. `stryker-setup-0.js`) from expected untracked output (`dist/`, `android/`, `ios/`, `coverage/`, `functions/lib`).
7. **Convention-risk discipline** — files loaded by convention (service workers, HTML-referenced assets, Firebase-discovered exports, XcodeGen project, PM2 ecosystem) classified by their convention consumer, never by import-grep absence.

**Evidence quality note:** every classification below names its evidence class. Documentation-only references are explicitly *not* treated as reachability.

## 3. Existing Knip coverage / gaps

`npx knip` result: **zero findings, 9 configuration hints** (all nine confirm the ignored areas and two redundant entries).

Covers: `src/**` only, entering from `src/main.tsx`, `src/App.tsx`, rules-emulator tests, and `**/*.test.{ts,tsx}`.

Structurally does NOT cover (from `knip.json`):
- `functions/**`, `packages/**`, `tools/**`, `scripts/**`, `e2e/**`, `android/**`, `ios/**` — all `ignore`d (~460 tracked files beyond src).
- Root JS artifacts (`stryker-setup-0.js`) — outside the `project` glob.
- **Test-entry masking (the decisive gap):** every `*.test.*` file is an *entry*, so any module imported **only by its own test** counts as used. All 13 orphans in §6 are invisible to Knip for exactly this reason.
- No analysis of script/CI/config references, service-worker conventions, Firebase export discovery, or binary-only dependency usage (`lhci`, `firebase` CLI).

Verdict: Knip's PASS is true only for its narrowed slice; it must not be cited as repository-wide evidence (upgrades F-06 from caveat to demonstrated false-negative class).

## 4. Entrypoint inventory

| Class | Entrypoints |
|---|---|
| Web/product | `index.html` → `src/main.tsx` → `src/App.tsx` (route registry, lazy views); `public/sw-register.js` → `/sw.js`; `public/manifest.webmanifest`; hosting rewrites → `privacy.html`, `terms.html`; `public/__firebase-config.js` (Vite-plugin generated, imported by both SWs); Capacitor loads bundled `dist/` |
| Backend | `functions/src/index.ts` barrel — 37 export statements ≈ **50 deployed functions** (callables, schedulers, Firestore triggers, webhook) discovered by Firebase via `firebase.json` (`codebase: anchor-os-functions`, predeploy build, nodejs22) |
| Packages | `packages/ui` (`@anchor-os/ui`), `packages/types` (`@anchor-os/types`) — main/exports `src/index.ts`, consumed via workspaces + tsconfig paths |
| CLI/scripts | 13 tracked `scripts/` files + 4 `tools/ci/` scripts; all invoked from `package.json`, `.husky/*` (pre-commit guard), or workflows |
| CI/CD | 10 workflows + `dependabot.yml`, `CODEOWNERS`, issue/PR templates, `copilot-instructions.md` |
| Tests | `config/vitest.config.ts`, `config/vitest.rules.config.ts` (emulator suites `src/__tests__/*.emulator.ts`), `config/playwright.config.ts` (`e2e/*.spec.ts` + snapshots + fixtures), `functions/vitest.config.ts`, `config/stryker*.mjs`, `src/analytics/contract.test.ts` (via `analytics:validate`) |
| Config-driven | `firebase.json` (hosting dev/production targets, emulators, rules/indexes), `config/vite.config.ts` (Firebase-SW-config generator, Sentry plugin, visualizer), `capacitor.config.ts`, `config/lighthouserc.cjs`, `config/stryker*.mjs`, commitlint, Husky, `tools/dashboard/ecosystem.config.cjs` (PM2), `apps/ios-native/project.yml` (XcodeGen) |
| Operational | `tools/dashboard` (PM2 engineering console — root `.pm2/` present), `tools/mcp-server` (standalone MCP telemetry console, own lockfile), `scripts/DEPLOY_PIPELINE.sh`, `scripts/firebase-wrapper.sh` (deploy guard), seed/repair scripts |

## 5. Repository classification summary

| Area | Files reviewed | LIVE | LEGACY | DUPLICATE | ORPHANED | STALE_CONFIG | UNKNOWN |
|---|---|---|---|---|---|---|---|
| `src` non-test (407 modules) | 407 | 392 (incl. 6 DEV_ONLY) | 0 | 4 | **13** | 0 | 0 |
| `src` tests (310) | 310 | 296 | 0 | 0 | **13** (§16) | 0 | 1 (paths suite) |
| `functions/src` non-test (81) | 81 | 71 (runtime+infra) | 1 (familyMigration) | 2 | 0 | 0 | 0 |
| `packages/*` | 9 | 4 (ui: 4) | 0 | 0 | **5 (types pkg)** | 0 | 0 |
| `scripts/` + `tools/ci` | 17 | 17 | 0 | 0 | 0 | 0 | 0 |
| root artifacts | 3 | 0 | 0 | 0 | **1** (stryker-setup-0.js) | 0 | 2 (.swift-version, untracked -1/-2) |
| `public/` | 12 | 11 | **1** (firebase-messaging-sw.js) | 1 (SW pair) | 0 | 0 | 0 |
| `.github` (18) | 18 | 15 | 0 | 0 | 0 | **2** (appknox, mayhem) | 1 (checkmarx efficacy) |
| `config/` (21) | 21 | 21 | 0 | 0 | 0 | 0 | 0 |
| `e2e/` (35) | 35 | 35 (incl. documented hard-skips) | 0 | 0 | 0 | 0 | 0 |
| `tools/dashboard`, `tools/mcp-server` (12 tracked) | 12 | 12 (operational) | 0 | 0 | 0 | 0 | 0 |
| `apps/ios-native` (247) | sampled | — | **LEGACY_REACHABLE (decision pending)** | — | 0 | 0 | — |
| root + config files | ~20 | 19 | 1 (.swift-version) | 0 | 0 | 0 | 0 |

## 6. Frontend reachability (13 confirmed orphans)

Mechanically scanned all 407 non-test `src` modules (static + dynamic import patterns, excluding tests). 13 have **zero** referencing files anywhere in `src`, `index.html`, or `public`:

| # | Orphan | Evidence | Note |
|---|---|---|---|
| 1 | `src/services/deviceAttestation.ts` | zero static+dynamic importers; `isDeviceTrusted`/`attestDevice` have no caller | **Client attestation feature fully unreachable** — deepens A-08/SN-10 from "inert" to "dead" |
| 2 | `src/features/auth/useSocialSignIn.ts` | zero importers; live path is `context/auth/socialAuth.ts` used by AuthContext | duplicate (§17) |
| 3 | `src/hooks/useAuthService.ts` | zero importers; live path is `AuthContext.tsx` | duplicate (§17) |
| 4 | `src/features/dashboard/components/ProductivityScoreCard.tsx` | zero importers | dashboard widget never rendered (Phase-1 GREY row resolved) |
| 5 | `src/features/dashboard/components/CompletionRing.tsx` | zero importers | |
| 6 | `src/features/dashboard/components/RecentActivityList.tsx` | zero importers | |
| 7 | `src/features/finance/components/AccountOverviewPanel.tsx` | zero importers | |
| 8 | `src/features/fabric/MonthlyReviewModal.tsx` | zero importers | FB-14 dead estate confirmed |
| 9 | `src/hooks/useMonthlyReviewTrigger.ts` | zero importers | FB-14 confirmed |
| 10 | `src/services/fabric/SubscriptionDetector.ts` | zero importers | FB-14 confirmed |
| 11 | `src/services/fabric/transactionParser.ts` | zero importers | |
| 12 | `src/services/CategoryService.ts` | zero importers | singleton service never instantiated |
| 13 | `src/services/experiments/ExperimentService.ts` | zero importers | |

Route-level views (FabricView, DashboardView, SettingsView, MarketingLanding, error views, OnboardingView, AcceptInviteView, shells) were initial candidates and **disproven as live** — each is consumed by exactly one lazy route registration in `App.tsx` (1 dynamic-import ref each). `sentryPiiScrubber`/`webVitals` are disproven via `main.tsx`.

## 7. Backend / Firebase Functions reachability

**Export matrix.** All 81 non-test `functions/src` files are reachable: 33 modules are exported by the `index.ts` barrel (≈50 deployed functions across callables/schedulers/triggers/webhook); the 27 non-exported files are all imported internally (`callable.ts`, `config.ts`, `helpers.ts`, `rateLimit.ts`, `reminder*` internals, `authAlertDetection` ← authEvents, `emailQueue` ← authAlert/family, `webhookHandlers` ← bankWebhook, `passkeyAuthHelpers`, `recurringHelpers/Validation`, `familyInvitationValidation`, `invitationEmailBuilder`, `bankSyncConnection`, `billReminders`, `fabricNudgeHelpers`, `types.ts`). No orphaned Functions module exists. The `functions/lib` + `functions/coverage` outputs are untracked (generated).

**Registry/contract subsystem is TEST_ONLY:** `callableRegistry.ts` ← consumed by `registries/*` (10 domain registries) and `callableContracts.ts`; `callableContracts.ts` is consumed **only by `callableContracts.test.ts`**. The registries are contract documentation with test enforcement, not runtime enforcement (`secureOnCall` never consults them). Classification: TEST_ONLY (valuable — keep), with a documented divergence risk: the registry can drift from actual exports (e.g. `validateInvitationToken` registry mismatch already noted in pass 07).

**Callable ↔ client-caller matrix (deployed callables with NO product caller):**

| Function/endpoint | Trigger/export | Client caller | Backend caller | Tests | Classification |
|---|---|---|---|---|---|
| `getNotifications` | callable | **none** (client reads inbox via `onSnapshot`) | none | none | **ORPHANED CLIENT CALLER, DEPLOYED SURFACE** |
| `dismissNotification` | callable | **none** (client updates `dismissed` via rules) | none | none | **ORPHANED… DEPLOYED** |
| `listActiveSessions` | callable | none (`revokeSession` IS called) | none | none | ORPHANED… DEPLOYED |
| `syncBankTransactions` | callable | none | none (webhook path separate) | none | ORPHANED… DEPLOYED / ops-candidate |
| `syncEmailToProfile` | callable | none | none | none | ORPHANED… DEPLOYED |
| `addTransactionToSharedAccount` | callable | none (pass 07 finding) | none | none | ORPHANED… DEPLOYED (known) |
| `migrateFamilyConnectionsV2` | callable ("kept for backward compat") | none | none | none | **LEGACY_REACHABLE, DEPLOYED** |
| `listMigrations`/`getMigrationStatus`/`runMigration`/`rollbackMigration` | callables | none (DevTools calls only `fixSharedAccountScopes`) | none | present | LIVE_OPERATIONAL (admin), deployed |
| `checkFirestoreQuota` | callable | none | none | present | LIVE_OPERATIONAL |
| `warmUpFunctions` | callable | none | none | present | LIVE_OPERATIONAL |
| `health` | callable/HTTP | none | none | present | LIVE_OPERATIONAL |
| `monoWebhook` | HTTPS webhook | external (Mono) | — | present | **LIVE_BACKEND (external trigger)** |
| `validateInvitationToken` | callable | yes (AcceptInviteView) | — | present | LIVE (registry mismatch documented in 07) |

All other exported callables have verified client callers (30 distinct names extracted across `src`, multiline-aware). Schedulers (`processReminders`, `processBillReminders`, 3 fabric nudges, `generateWeeklyReport`, `cleanupExpiredInvitations`) and the trigger (`onSharedTransactionWrite`) are platform-invoked — LIVE_BACKEND.

**Security framing (§20):** the "ORPHANED CLIENT CALLER, DEPLOYED SURFACE" rows are **not dead code in the security sense** — every one remains authenticated-only (per `secureOnCall` + rules), but they enlarge the callable attack surface, consume registry/contract space, and (for `getNotifications`/`dismissNotification`) duplicate a capability the client implements directly through Firestore. Highest-interest rows for the final synthesis: `migrateFamilyConnectionsV2` (legacy data mutation), `addTransactionToSharedAccount` (pass 07/06 integrity findings attached), `runMigration`/`rollbackMigration` (admin-grade verbs, no client gate beyond auth — registry marks domain migrations; gating was flagged in pass 07).

## 8. Package / workspace reachability

| Package | Consumers | Verdict |
|---|---|---|
| `@anchor-os/ui` (packages/ui, 4 source files) | **45 importing files** in `src` (Card, Button, ToggleSwitch, etc.) | LIVE_PRODUCT |
| `@anchor-os/types` (packages/types) | **ZERO importers** in `src`, `functions`, `packages`, `config` — only its own `src/index.ts`; referenced solely by a `tsconfig.app.json` path alias | **ORPHANED package** (medium confidence — alias could mask dynamic use; none found) |

`packages/types` is the second package-level orphan in the audit (first was the retired `.anchor` system). It duplicates types that live in `src/types/index.ts` — also a DUPLICATE-class candidate (settings/commitment types re-declared in two places, drift risk; actual divergence not fully diffed here → recorded, not quantified).

## 9. Scripts / tooling

Every tracked script is referenced; **no dead scripts found**:

| Script | Consumer | Classification |
|---|---|---|
| `DEPLOY_PIPELINE.sh` | `deploy:*` package scripts | LIVE_OPERATIONAL |
| `firebase-wrapper.sh` | deploy guard (intercepts direct `firebase deploy`) | LIVE_OPERATIONAL |
| `pre-commit-test-guard.sh` | `.husky/pre-commit` | LIVE_BUILD_CI |
| `test-pre-commit-guard.sh` | self-verifying harness for the guard | TEST_ONLY (of a live guard) |
| `test-with-emulator.sh` | `test:integration` | LIVE_BUILD_CI |
| `seed-dev-data.cjs` | dev/staging seeding | LIVE_OPERATIONAL |
| `dev-serve.sh` | manual dev workflow (Tailscale) | DEV_ONLY (intentional) |
| `bump-version.sh` | release flow | LIVE_OPERATIONAL |
| `verify-build-env.sh` | deploy pipeline env check | LIVE_BUILD_CI |
| `generate-module-coverage.mjs` | `coverage:modules` | LIVE_BUILD_CI |
| `ios-native-sync.sh` | `ios:sync` / `ios:open` | LIVE_OPERATIONAL (mobile residue §12) |
| `scripts/ci/classify-changes.js` + `.node-suite.mjs` | `ci-cd.yml`, `staging-deploy.yml` | LIVE_BUILD_CI |
| `tools/ci/check-rules-coverage.ts` | `test:rules:ci`, `check:rules-coverage` | LIVE_BUILD_CI |
| `tools/ci/check-index-catalog.ts` / `check-index-usage.ts` | `check:indexes` / `check:index-usage` | LIVE_BUILD_CI |
| `tools/ci/fetch_failed_logs.sh` | `ci-failure-email.yml` | LIVE_BUILD_CI |
| `tools/dashboard` (server/client/ecosystem) | PM2 (root `.pm2/` active) | LIVE_OPERATIONAL |
| `tools/mcp-server` | optional MCP console | DEV_ONLY/operational, self-contained |
| `tools/ui-capture/index.ts` | `ui:capture` | DEV_ONLY |

**Root artifact exception:** `stryker-setup-0.js` is tracked at repo root and self-describes as a Stryker vitest sandbox file ("This file is copied to the sandbox dir, don't import anything local!") — referenced by NO config (stryker configs do not list it) and only by `classify-changes.js` as a *name classifier*. It is a **generated artifact accidentally committed** — ORPHANED/GENERATED, HIGH-confidence deletion candidate. `stryker-setup-1.js`/`-2.js` exist in the working tree **untracked** (local residue only). `.swift-version` (6.3.0) at root: no referencing config located; mobile residue, LOW-confidence candidate.

## 10. CI / workflows

| Workflow | Trigger | Verdict | Evidence |
|---|---|---|---|
| `ci-cd.yml` | push/PR master/staging/develop | LIVE_BUILD_CI | uses classify-changes, rules/index checks |
| `merge-gate.yml` | PR master/staging | LIVE_BUILD_CI | gate semantics |
| `staging-deploy.yml` | push master | LIVE_BUILD_CI | classify + deploy path |
| `ci-failure-email.yml` | workflow_run failure | LIVE_BUILD_CI | uses `tools/ci/fetch_failed_logs.sh` |
| `weekly-health.yml` | weekly cron + dispatch | LIVE_BUILD_CI (mutation step explicitly "disabled"; full E2E shard×4 vs `STAGING_URL`) | steps read |
| `ios-native.yml` | paths `apps/ios-native/**` | LIVE_BUILD_CI — but see §12 (targets the tracked SwiftUI-era app) | working-directory `apps/ios-native`, XcodeGen, `ci_scripts/ci_stub_plists.sh` (exists) |
| `codacy.yml` | push/PR/cron | LIVE_BUILD_CI (generic scan) | |
| `checkmarx-one.yml` | push master | UNKNOWN/conditionally live — depends on `CX_*` secrets; efficacy unverifiable from repo | secrets refs |
| `appknox.yml` | push master | **STALE_CONFIG** — runs `./gradlew build # Update this to build your Android or iOS application` (template placeholder) at repo root; `android/` is **gitignored/generated** and no Capacitor sync step exists in the workflow → cannot build what isn't there | template comment + `git check-ignore android` |
| `mayhem-for-api.yml` | push master | **STALE_CONFIG** — runs `./run_your_api.sh & # <- ✏️ update this`; **no `run_your_api.sh` exists anywhere tracked** | template comment + file absence |

Both stale scanners are permanently red/no-op noise on master pushes and produce no merge/security signal (root-causes the earlier "external/mobile scanner failures" observation as template residue, not tool misconfiguration).

## 11. Service workers / workers

| File | Registered? | Classification |
|---|---|---|
| `public/sw.js` | YES — only registration (`sw-register.js` → `/sw.js`); also the SW used by `getToken` | LIVE_PRODUCT (PWA cache + FCM background) |
| `public/firebase-messaging-sw.js` | NO registration anywhere in tracked code | **ORPHANED** duplicate messaging SW (10 §37); contains an unguarded `JSON.parse(payload.data.actions)` absent from the live SW |
| `public/__firebase-config.js` | imported by both SWs; generated at build/dev by the Vite plugin | GENERATED |
| `ios/App/App/public/firebase-messaging-sw.js` | inside the **gitignored** Capacitor iOS shell | GENERATED (expected-untracked) |
| `dist/sw.js`, `dist/assets/firebase-push-*.js` | build output | GENERATED |

One live SW, one orphaned duplicate, no conflicting registrations. `boot-splash-failsafe.js`, `manifest.webmanifest`, `privacy.html`, `terms.html`, icons — all referenced — LIVE_PRODUCT.

## 12. Capacitor / mobile residue

- Root `android/`, `ios/`, `dist/` are **gitignored generated shells** — GENERATED, expected-untracked; CI does not materialize them (which is what breaks Appknox, §10).
- `apps/ios-native/` (247 tracked files: XcodeGen `project.yml`, `ci_scripts/*`, Core/Features/App, tests+fixtures) is **tracked and CI-integrated** (`ios-native.yml`; `scripts/ios-native-sync.sh` wired to `ios:sync`/`ios:open`). The brief states the SwiftUI product is retired; repository state contradicts full retirement — recorded as **LEGACY_REACHABLE with an active build pipeline, architectural decision pending** (retirement capability audit NOT reopened per instructions).
- `.swift-version` at repo root: no located consumer; legacy residue, LOW confidence.
- `capacitor.config.ts`, `cap:*` scripts, `@capacitor/*` deps + `@capawesome/capacitor-badge` — LIVE (declared architecture; badge plugin live per pass 10).

## 13. Feature flags / config flags

`src/features/flags/featureFlags.ts` defines exactly two flags (plus `VITE_FLAG_DISABLE_ALL` global kill):

| Flag | Default | Readers | Verdict |
|---|---|---|---|
| `anchor_ai_enabled` | ON in all envs (100% rollout) | `useFeatureFlag('anchor_ai_enabled')` → `SettingsView.tsx` | **LIVE** (gates the Anchor AI settings surface; rollout machinery effectively unused since always-on) |
| `fabric_suggestions` | ON in all envs (100% rollout) | **zero callers** outside the flag module | **DEAD FLAG** — FB-14 confirmed at flag level; gates no code path |

No permanently-disabled flags; no dangerous production overrides found (kill-switch only ever narrows). Environment-gated paths (`import.meta.env.VITE_APP_ENV !== 'production'` → DeveloperTools; dev CORS allowlist in `callable.ts`) are intentional DEV_ONLY branches — both branches reachable, correctly scoped.

## 14. Migrations / legacy schemas

| Item | State | Classification |
|---|---|---|
| Migration framework (`functions/src/migrations/`: registry, runner, store, callables, `001_family_v2.ts`) | 1 registered migration (family V2); callables deployed, admin-invokable, no client caller | **LIVE_OPERATIONAL** (rollback path exists via `rollbackMigration`) |
| `familyMigration.ts` (`migrateFamilyConnectionsV2`) | exported by barrel, deployed, zero client callers, self-described "kept for backward compat" | **LEGACY_REACHABLE, DEPLOYED** — duplicate migration path (§17); no auto-deletion (may be needed if legacy family data persists in production) |
| Legacy `shares` permission model (rules + client readers, no revocation path) | active dual architecture per pass 07 §7 | LEGACY_REACHABLE (FS-02 — unchanged) |
| Fabric legacy resources (`fabric_monthly_reviews` etc.) | FB-14 dead estate; now **corroborated**: `MonthlyReviewModal`, `SubscriptionDetector`, `useMonthlyReviewTrigger` unreachable client-side | ORPHANED (client), rules branches remain (§15) |

Completed migrations are NOT classified deletable — the framework retains rollback semantics by design.

## 15. Firestore rules / indexes reachability (rules-reachability only)

| Rules branch | Located writers/readers | Classification |
|---|---|---|
| `users/{uid}/settings/{docId}` (owner rw) | **no client writer or reader located** in `src` (grep across collection/db paths) | **RULE-ONLY / NO LOCATED PRODUCT CONSUMER** |
| `users/{uid}/dashboard/{document=**}` | read/write paths documented as live in 07 (FS-01 exposure) | ACTIVE |
| Fabric branches (`fabric_behavior/predictions/conversations/reports/analytics/nudge_log/mood_entries`) | live per pass 09 | ACTIVE |
| `fabric_monthly_reviews`-class resources | client producers dead (§6) | RULE-ONLY for those specific docs |
| `family/{docId}` (dev tools simulation) | referenced by DeveloperTools (DEV_ONLY) | LIVE (dev-only) |
| `feedback` (read false, create false) | callable writes via Admin SDK; rules deny both — deliberate | ACTIVE (deny-by-design) |
| Legacy `shares` reads | live readers, no writer/revoker | LEGACY_LIVE (FS-02) |

No rules edited. Indexes: `config/firestore.indexes.json` checked by live CI tooling — LIVE_BUILD_CI.

## 16. Tests / fixtures / orphaned tests

- **13 orphaned test files** — each tests one of the §6 orphaned modules and is its module's *only* consumer: `useSocialSignIn.test.ts`, `CompletionRing.test.tsx`, `ProductivityScoreCard.test.tsx`, `RecentActivityList.test.tsx`, `MonthlyReviewModal.test.tsx`, `AccountOverviewPanel.test.tsx`, `useAuthService.test.ts`, `useMonthlyReviewTrigger.test.ts`, `CategoryService.test.ts`, `deviceAttestation.test.ts` (client), `ExperimentService.test.ts`, `SubscriptionDetector.test.ts`, `transactionParser.test.ts`. These are the direct products of Knip's test-entry masking — green tests for dead code.
- Distinction preserved: `functions/src/deviceAttestation.test.ts` tests the **deployed** stub callable (LIVE_BACKEND surface) — not orphaned.
- Documented hard-skipped e2e families (F-03) remain valuable-not-orphaned; no new orphaned suites found. `e2e/__snapshots__`/`fixtures` consumed by config — LIVE_BUILD_CI.
- Live production code with zero tests (previously established, unchanged): `deleteAccount.ts` notification path, reminders orchestrator, familyTriggers — restated for the remediation map only.

## 17. Duplicate implementations

| Capability | Canonical path | Alternate path | Both reachable? | Divergence / decision needed |
|---|---|---|---|---|
| Weekly report generation | `functions/src/weeklyReport.ts` (scheduled, persists `fabric_reports`) | `src/services/fabric/WeeklyReportEngine.ts` (client, via FabricService) | **YES — both live** | Divergent metrics/schemas (FB-05/FB-15); decision: single source or documented dual-output |
| Bill-due detection | `functions/src/billReminders.ts` (`getBillsDueSoon`, push) | `src/features/finance/utils/billReminderUtils.ts` (`getUpcomingBills`, panel) | **YES — both live** | Parallel "recurring expense due soon" logic; windows/edge semantics differ |
| Social sign-in | `src/context/auth/socialAuth.ts` (AuthContext) | `src/features/auth/useSocialSignIn.ts` | NO — alternate orphaned | Deletion-safe after confirmation |
| Auth session/profile service | `src/context/AuthContext.tsx` | `src/hooks/useAuthService.ts` | NO — alternate orphaned | Deletion-safe |
| Family migration path | `functions/src/migrations/` framework (`001_family_v2`) | `functions/src/familyMigration.ts` (`migrateFamilyConnectionsV2`) | YES — both deployed | Two migration mechanisms for one domain; decide authoritative path before touching legacy data |
| Service worker | `public/sw.js` | `public/firebase-messaging-sw.js` | NO — duplicate orphaned | Delete-candidate; LOW convention risk |
| Account-sharing permission model | `sharedWith` map | legacy `shares` map + row `accountShares` | YES — both live (07 §7) | Dual model, one-way divergence (FS-02), unchanged |
| Commitment reminder channels | server FCM (`processReminders`) | client in-page (`useTaskReminders`) | YES — both live | Dual scheduling, no cross-channel dedupe (SN-11) |
| Shared types | `src/types/index.ts` | `packages/types` | NO — package zero-consumer | Package-level duplicate of types |

Soft duplicate candidate (LOW, not forced): `AccountNotificationsApi` vs `FamilyNotificationApi` — two overlapping subscription layers over the same inbox collection with different filters/order fields (the `date`-vs-`createdAt` mismatch from pass 10 lives here).

## 18. `@ts-nocheck` by reachability

395 `@ts-nocheck` files across `src` + `functions/src`, mapped to classes:
- **Live critical:** finance (~56), auth (~14), api (31), hooks (37) — F-07's exposure is overwhelmingly LIVE code; remediation must treat it as live-risk.
- **Live noncritical:** settings components (60), shared (22), utils (19), commitments (18), onboarding (14), dashboard (11).
- **Dead/orphaned: 0 of the 13 orphaned modules carry `@ts-nocheck`** — deleting the dead set does not reduce F-07's count.
- **Tests/tooling:** ~14 (`__tests__` helpers, configs).
- **Legacy:** `functions/src/index.ts` (barrel), `familyMigration.ts` (via module header classes).

Implication: the `@ts-nocheck` remediation program is entirely a live-code program; there are no easy wins in the dead set.

## 19. Dependency reachability (usage only; vulnerability reconciliation deferred)

- **No unused runtime dependencies found.** Spot-verified live usage: `@tanstack/react-query*` (incl. devtools), `qrcode.react`, `web-vitals` (main.tsx), `idb-keyval`, `framer-motion`, `zod`, `@sentry/react` + `@sentry/vite-plugin` (vite config), `rollup-plugin-visualizer` (`build:analyze`), `@tanstack/react-virtual`.
- **Binary-only deps correctly retained:** `@lhci/cli` (lighthouse scripts), `firebase` CLI (rules/emulators/deploy), `tsx` (tools/ci), `knip`, `commit-and-tag-version`, husky/commitlint, stryker trio, playwright, `@firebase/rules-unit-testing`, `fast-check`, `@testing-library/*`.
- **Retained-for-removed-architecture candidates:** none confirmed beyond `.swift-version` and the tracked `apps/ios-native` tree (§12).
- Deletion decisions belong to the final dependency-reconciliation task, pairing this usage evidence with the F-09 vulnerability discrepancy.

## 20. Externally reachable orphan surfaces

| Function/endpoint | Product caller | Still deployed/exported? | Security relevance |
|---|---|---|---|
| `getNotifications`, `dismissNotification` | none | YES (barrel) | duplicate of client Firestore path; authenticated; adds surface + rate-limit entries |
| `listActiveSessions`, `syncBankTransactions`, `syncEmailToProfile` | none | YES | authenticated ops verbs, unexercised — behavior-drift risk |
| `addTransactionToSharedAccount` | none | YES | carries pass 06/07 integrity findings (FI-10/FS-05) — highest-interest orphan |
| `migrateFamilyConnectionsV2` | none | YES | legacy data mutation callable, authenticated-only |
| `listMigrations`/`runMigration`/`rollbackMigration`/`getMigrationStatus` | none | YES | admin-grade verbs, auth-only gating (registry gap noted in 07) |
| `checkFirestoreQuota`, `warmUpFunctions`, `health` | none | YES | operational; harmless but unexercised |
| `monoWebhook` | external (Mono) | YES | LIVE_BACKEND — audited in 06 |

None are unauthenticated; **no new security stop condition discovered** in this sweep.

## 21. High-confidence deletion candidates (28 files + 1 package)

All satisfy the HIGH bar: no static caller, no dynamic caller, no build/config entry, no backend export/trigger, no CI/operational consumer, no external contract.

| Candidate | Path | Why unreachable | Dependencies unlocked | Risk if deleted later |
|---|---|---|---|---|
| 1–13 | The 13 orphaned `src` modules (§6 table) | zero static+dynamic importers outside tests | removes false "feature exists" signals (dashboard widgets, attestation, experiments) | LOW |
| 14–26 | The 13 matching test files (§16) | subject dead; only consumer of the dead module | removes green-tests-for-dead-code noise from coverage/mutation baselines | LOW |
| 27 | `stryker-setup-0.js` (repo root) | Stryker sandbox artifact accidentally committed; no config reference | clean root | NONE |
| 28 | `public/firebase-messaging-sw.js` | never registered; superseded by `sw.js` | removes a confusing second messaging SW | LOW (verify no external hosting reference first) |
| 29 | `@anchor-os/types` package (5 files) | zero importers repo-wide; path alias unused | removes workspace + tsconfig alias | MEDIUM (remove alias together) |
| 30 | `fabric_suggestions` flag definition | zero readers | flag surface reduction | LOW |

LOW-confidence candidates: `.swift-version` (root), `settings/{docId}` rules branch (RULE-ONLY — rules not edited here), untracked `stryker-setup-1/2.js` (local cleanup only).

## 22. Medium/low-confidence candidates

- `apps/ios-native/**` + `ios-native.yml` + `ios-native-sync.sh` — LEGACY_REACHABLE; deletion blocked on the retirement decision (out of scope here).
- `familyMigration.ts` legacy callable — LEGACY_REACHABLE; blocked on confirming production family-V1 data is fully migrated (check migration status in prod first).
- `getNotifications`/`dismissNotification` callables — deployed orphans; removal is a **deploy-time** decision (index.ts export removal + deploy), not a file deletion.
- `AccountNotificationsApi`/`FamilyNotificationApi` merge — soft duplicate; reconcile the `date`/`createdAt` order-field mismatch first.
- Weekly-report and bill-due consolidation — keep both layers until the §17 dedupe decisions.

## 23. Stale configuration

| File | Expected target | Actual target state | Classification |
|---|---|---|---|
| `.github/workflows/appknox.yml` | builds `android/` via gradlew | `android/` gitignored/generated; no sync step; template comment left in | STALE_CONFIG |
| `.github/workflows/mayhem-for-api.yml` | runs `./run_your_api.sh` | script does not exist anywhere tracked | STALE_CONFIG |
| `config/firestore.rules` `/settings/{docId}` | guards a settings subcollection | no client writer/reader located | STALE_CONFIG (RULE-ONLY) — verify no backend writer before any change |
| `knip.json` | repository-wide dead-code gate | 7 areas ignored + test-entry masking | STALE_CONFIG (coverage gap) |
| `packages/types` + tsconfig alias | shared types package | zero consumers | STALE_CONFIG (alias w/o consumer) |

## 24. Unknown / dynamically referenced candidates

- `checkmarx-one.yml` efficacy (secrets-dependent) — UNKNOWN.
- `apps/ios-native` future — UNKNOWN by decision (architectural).
- External callers of the deployed-surface orphans cannot be excluded from repo evidence alone (only Mono webhook identified) — residual UNKNOWN acknowledged; hence "surfaces", not "dead".
- Untracked working-tree residue (`stryker-setup-1/2.js`, `reports/`, `playwright-report/`, `test-results/`, `coverage/`, `functions/coverage`) — GENERATED/local; not findings.

## 25. Remediation dependency map (planning only)

1. Dead-code deletion wave (§21 items 1–28) — independent, LOW risk, unlocks honest coverage baselines.
2. `@anchor-os/types` removal — pair with tsconfig alias edit.
3. Deployed-orphan callable retirement (§20) — requires a **deploy** (barrel export removal), coordinate with a functions release; `addTransactionToSharedAccount` should be resolved together with its 06/07 findings.
4. Duplicate consolidation (§17 rows 1, 2, 5, 7, 8) — architectural decisions first (report source of truth, bill-due rule sharing, migration authority, permission model, reminder channel ownership).
5. CI hygiene: delete or complete `appknox.yml` + `mayhem-for-api.yml`; document the `checkmarx` secret requirement.
6. Knip hardening: re-scope after deletions; add functions/packages/tools/scripts as workspaces or drop the repo-wide claim (closes F-06 properly).
7. `apps/ios-native` retirement decision — gates `.swift-version`, `ios-native.yml`, `ios:sync` scripts.

## 26. Evidence appendix

Methods (all output transient, nothing committed): per-area `git ls-files` counts (total **1360 tracked** — src 710 [310 tests, 407 non-test modules], functions 121 [115 ts, 34 tests], apps 247, tools 79, docs 55, e2e 35, config 21, .github 18, scripts 13, public 12, packages 9); `npx knip` (clean, 9 hints); per-module static+dynamic importer scans (patterns `from '…stem'` and `import('…stem')`, tests excluded); multiline-aware `httpsCallable` extraction → 30 client-called names; barrel-export diff for all `functions/src/*.ts`; `git check-ignore android ios dist`; `git ls-files | grep stryker` (only `-0` tracked); config/CI cross-reference greps (`package.json`, `.husky/`, `.github/workflows/`, `firebase.json`, `vite.config.ts`, `capacitor.config.ts`, `index.html`); feature-flag reader grep; `@anchor-os/*` consumer grep; 13-package dependency spot-grep. Key reads: `knip.json`, `package.json`, `firebase.json`, `functions/src/index.ts`, `config/stryker.config.mjs`, `tools/dashboard/ecosystem.config.cjs`, `tools/mcp-server/package.json`, `src/features/flags/featureFlags.ts`, all 10 workflow files (headers + step bodies), script headers. Nothing modified outside `docs/audits/`.






