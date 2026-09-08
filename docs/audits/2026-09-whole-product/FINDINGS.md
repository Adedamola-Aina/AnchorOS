# FINDINGS — Whole-Product Audit, Phase 0/1

No product code was modified. All findings are documented, not fixed.

## CONFIRMED FINDINGS

### F-01 · Commitments/Finance · UI capability stubs presented as controls · P3 · high confidence
- Evidence: `src/features/commitments/CommitmentsView.tsx:92` — timeline "Focus" action → `showToast('Focus mode coming soon!', 'info')`; same file line 101 — "Learn more" → "exports will be available in the next update"; `src/features/finance/AccountDetailsView.tsx:118` — "Edit Account" owner menu item → `showToast('Rename coming soon', 'info')`.
- Impact: user-visible menu actions do nothing but announce unimplemented features. Honest but incomplete UX.
- Recommendation: implement or remove the entry points; track as product gaps.
- Acceptance: no user-reachable control resolves only to a "coming soon" toast.

### F-02 · Commitments · Optimistic updates explicitly not implemented (BUG-023) · P2 · high confidence
- Evidence: `src/hooks/useCommitmentService.test.tsx:321,371` — `it.todo('…BUG-023: optimistic updates not yet implemented')` plus two `it.skip` "— wip" variants; `src/hooks/useFinanceService.test.tsx:216,432` two `it.skip` covering transaction sort order and delete-reverses-balance.
- Impact: known behavior gap acknowledged in tests; UX latency/correctness on commitments and finance mutations unverified.
- Acceptance: BUG-023 resolved or formally accepted; skipped unit tests restored.

### F-03 · Family/Finance/Auth · High-risk E2E coverage hard-skipped · P2 · high confidence
- Evidence: `e2e/family-mode-sharing.spec.ts` — 7 `test.skip(true, …)` blocks pending family/shared-account fixtures; `e2e/finance.spec.ts:55` skip(true) for account creation; `e2e/auth.spec.ts:200,278,295` sign-out and MFA setup skips; `e2e/comprehensive.spec.ts` 5 conditional skips.
- Impact: the highest-risk journeys (family data isolation, shared finance, MFA, sign-out) have no active end-to-end verification.
- Recommendation: build emulator seed fixtures and un-skip; prioritize before family/finance deep audits.

### F-04 · PWA · Placeholder analytics id in service worker · P3 · confirmed
- Evidence: `public/sw.js:26,36` — `measurementId: "G-MEASUREMENT_ID"` literal for development and staging configs.
- Impact: messaging/analytics init with invalid measurement id in non-prod SW; likely harmless for FCM but misleading config.

### F-05 · PWA · Minimal offline capability · P3 · confirmed statically
- Evidence: `public/sw.js` caches only `/`, `/index.html`, favicon, manifest; no runtime/app-shell caching strategy beyond Firebase messaging; IndexedDB query persistence exists client-side (tasks/finance excluded from dehydration in `src/App.tsx:106-109`).
- Impact: offline behavior is partial; "offline-first" claims (if any in marketing) must be checked. NEEDS DYNAMIC VERIFICATION.

### F-06 · Testing/Tooling · Knip green is narrower than it appears · P3 · confirmed
- Evidence: `knip.json` ignores `functions/**, packages/**, e2e/**, tools/**, scripts/**, android/**, ios/**` and 10+ dependencies; knip also emitted 9 configuration hints (unused entry/project patterns).
- Impact: dead-code signal covers src/ only; Functions/native/packages reachability unverified by tooling.

### F-07 · Type safety · 205 production files under @ts-nocheck · P2 · confirmed
- Evidence: 03-STATIC-INTEGRITY.md inventory. 67 finance/commitment files, 28 auth/security files incl. AuthContext.tsx, FinanceApi.ts, CommitmentApi.ts, query-layer hooks.
- Impact: TypeScript strict is enforced only where @ts-nocheck is absent; the enforcement story overstates actual type safety in security/finance code. Do NOT bulk-remove; requires staged, domain-by-domain typing remediation.

### F-08 · Native · Duplicate parallel mobile implementations · P2 · confirmed structurally
- Evidence: Capacitor shells (`android/`, `ios/`, capacitor.config.ts) alongside `apps/ios-native/` SwiftUI app re-implementing Auth/MFA/passkeys, Fabric engines, and Finance natively (247 files).
- Impact: web/native parity risk is structural; behavior drift between two Fabric/Finance implementations is likely. NEEDS DYNAMIC VERIFICATION on device.

### F-09 · Dependencies · npm audit advisories; GitHub-reported Dependabot count not reproducible · P2 · confirmed (local) / UNVERIFIED (GitHub banner)
- Evidence (local, reproducible): `npm audit` (read-only, no fix applied) against current master lockfiles (package-lock.json last touched 2026-09-06 on master) reports **19 moderate advisories, 0 high, 0 critical** — root workspace 11, functions workspace 8.
- Affected packages: `qs` (remotely triggerable DoS; array-limit bypass), `uuid` (buffer bounds check v3/v5), `retry-request`, `teeny-request`, `google-gax`, `gaxios`, `@google-cloud/firestore`, `@google-cloud/storage`, `firebase-admin` (root + functions via the firebase-admin chain), plus `body-parser` (root) and `@lhci/cli` (root, dev tooling). All have `fixAvailable: true`. No upgrades performed per scope.
- Production vs development relevance: the `firebase-admin → @google-cloud/{firestore,storage} → qs/uuid/retry-request` chain is the **production runtime** of the Functions codebase, so the qs DoS class is production-relevant (server-side DoS exposure). `@lhci/cli` (Lighthouse CI) and `body-parser` (check actual import surface) are tooling/dev-leaning. npm's dev/prod flag was inconclusive (`dev: null`) — exact classification NEEDS DYNAMIC VERIFICATION per package.
- GitHub discrepancy: during Phase 0/1 the push output reported "GitHub found 67 vulnerabilities on Adedamola-Aina/AnchorOS's default branch (20 high, 40 moderate, 7 low)". This does **not** reproduce locally and the Dependabot alerts tab is not publicly accessible (HTTP 404 unauthenticated). The discrepancy may stem from Dependabot evaluating different lockfiles/workspaces (e.g., android/ios Gradle or CocoaPods ecosystems), different update states, or stale alerts. UNVERIFIED — not resolved by assumption.
- Impact: confirmed moderate server-side DoS exposure in the Functions dependency chain (qs); possible larger unverified exposure per GitHub. Dependencies must not be treated as healthy merely because lint/tsc/knip pass.
- Recommendation (for future remediation task, not this pass): run authenticated Dependabot review to reconcile the 67-alert count; prioritize `qs` in the Functions runtime chain; re-run `npm audit` after any lockfile change. No `npm audit fix`, no upgrades performed here.
- Acceptance: authenticated Dependabot count reconciled with local audit; production-relevant advisories triaged with owner-approved remediation.
- Status: CONFIRMED (local audit findings) + UNVERIFIED (GitHub 67/20-high banner).

## STRONG SUSPICIONS (not yet confirmed)

> 2026-09-07 update: S-01 and S-02 have since been INVESTIGATED in the auth domain pass — see docs/audits/2026-09-whole-product/05-AUTH-SECURITY-DOMAIN.md (S-02 → CONFIRMED as A-04; S-01 → confirmed suppression exposure, §9). Findings A-01…A-08 and U-01…U-06 are recorded there and are not re-listed here.

- S-01 · AuthContext.tsx and FinanceContext.tsx under @ts-nocheck suggests fragile auth/finance state plumbing; quality unknown until typed review.
- S-02 · Account deletion completeness (Firestore subcollections, Storage artifacts, push tokens, third-party Mono links) unverified — classic incomplete-deletion risk.
- S-03 · `src/utils/seeder.ts` reachable via settings DeveloperTools — verify it is dev-gated and cannot seed production accounts.

### 2026-09-08 — Family / Shared Data Isolation → `07-FAMILY-SHARED-DATA-ISOLATION.md`
Findings FS-01…FS-12 (confirmed, incl. FS-01b) and UH-F01…UH-F06 (unverified) — recorded there, not duplicated here. Headline: **FS-01 STOP CONDITION — disconnected ex-member retains rules-authoritative read of family-scoped accounts (balances), finance rows, commitments, and the ex-partner's dashboard** (`scope:'family'` + existence-only `isConnectedFamilyMember` + never-cleaned per-row `accountShares` indexes; HIGH). **FS-02** legacy `shares` channel is live in rules/client but revocable by no server path (MEDIUM, data-dependent). **FS-03** no active-connection guard in `confirmConnection` → dual-household drift (MEDIUM). **FS-04** disconnect/share non-transactional → orphaned grants (MEDIUM). **FS-05/FS-06** deepen FI-10/FI-14 at the family boundary. **FS-07/FS-10/FS-12** invite-pipeline residuals (LOW). No realistic invite takeover, cross-family write, or privilege escalation found. **One stop condition triggered; nothing remediated.**

## NEEDS DYNAMIC VERIFICATION (recorded limitations)

- Real push delivery, email delivery, billing-affected Functions, Mono bank webhooks, passkey ceremonies on real devices, iOS/Android behavior, production rules deployment parity, offline/install behavior of the SW.
- 2026-09-08 finance-pass additions: webhook signature byte-correctness in production (UH-01 in 06), Mono page-size loss rate (UH-02), production secret state (UH-03), ownerless-account prevalence (UH-04).
- 2026-09-08 family-pass additions: production prevalence of `scope:'family'`/`shares`/stale `accountShares` docs (UH-F01 in 07), `dashboard` collection population (UH-F02), revoked-vs-accept race reality (UH-F03), multi-connection households (UH-F04), sharedWith collectionGroup index availability (UH-F05), production App Check state (UH-F06, shared with FI-17).

## UNKNOWN

- Semantic correctness of 392-line Firestore rules (rules tests exist but content review pending).
- Whether every registered callable has a UI consumer and vice versa (functions registries not yet cross-mapped).

## DOMAIN PASS INDEX (detailed findings live in the domain documents)

### 2026-09-07 — Auth / Account Lifecycle / Security → `05-AUTH-SECURITY-DOMAIN.md`
Findings A-01…A-08 (confirmed) and U-01…U-06 (unverified) — recorded there, not duplicated here. S-01/S-02 resolved (see header note above).

### 2026-09-08 — Finance / Financial Integrity → `06-FINANCE-FINANCIAL-INTEGRITY.md`
Confirmed findings FI-01…FI-18 and unverified UH-01…UH-06 — recorded there. Headline: **FI-01** webhook replay cache loses legitimate Mono retries (HIGH), **FI-02** webhook HMAC over re-serialized JSON instead of raw bytes (HIGH, fail-closed), **FI-03** no pagination/cursor in Mono sync — transactions beyond page 1 never imported (HIGH), **FI-05/FI-07** balance reversals/corrections computed from stale client data (MEDIUM), **FI-06/FI-18** no idempotency: offline-queue retries and concurrent syncs duplicate financial operations (MEDIUM), **FI-11** ARCH-022 ledger is not tamper-evident (MEDIUM), **FI-09** deleteMyAccount never revokes Mono (deepens A-04, MEDIUM). No stop condition triggered. Transfers/transactions are atomic at the batch level; cross-user finance access rules-proven denied.

### 2026-09-08 — Family / Shared Data Isolation → `07-FAMILY-SHARED-DATA-ISOLATION.md`
Confirmed findings FS-01…FS-12 (incl. FS-01b) and unverified UH-F01…UH-F06 — recorded there. Headline: **FS-01 STOP CONDITION triggered** — disconnected ex-member retains rules-authoritative read of family-scoped accounts (incl. balances), finance rows (via one-way `scope:'family'` + existence-only `isConnectedFamilyMember` + never-cleaned row `accountShares` indexes), commitments, and the ex-partner's dashboard subtree (HIGH). **FS-02** legacy `shares` grants are read by rules/client but removable by no revocation path (MEDIUM, data-dependent — dual-model verdict: active dual architecture, not dead residue). **FS-03** `confirmConnection` lacks an active-connection guard → dual-household drift (MEDIUM). **FS-04** disconnect/share non-transactional → orphaned grants (MEDIUM). **FS-05** deepens FI-10 (presence-not-permission check, no connection check, non-transactional writes). **FS-06** deepens FI-14 (conversion rows family-readable incl. post-disconnect). **FS-07/FS-10/FS-12** invite residuals (validateInvitationToken unauthenticated, client-only confirm re-auth, code-to-inviter-client + third-party lockout; LOW). Invitation pipeline itself: no realistic reuse/guess/race/unintended-account acceptance. Fabric/AI: no family scope anywhere. One stop condition triggered; nothing remediated.