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

## STRONG SUSPICIONS (not yet confirmed)

- S-01 · AuthContext.tsx and FinanceContext.tsx under @ts-nocheck suggests fragile auth/finance state plumbing; quality unknown until typed review.
- S-02 · Account deletion completeness (Firestore subcollections, Storage artifacts, push tokens, third-party Mono links) unverified — classic incomplete-deletion risk.
- S-03 · `src/utils/seeder.ts` reachable via settings DeveloperTools — verify it is dev-gated and cannot seed production accounts.

## NEEDS DYNAMIC VERIFICATION (recorded limitations)

- Real push delivery, email delivery, billing-affected Functions, Mono bank webhooks, passkey ceremonies on real devices, iOS/Android behavior, production rules deployment parity, offline/install behavior of the SW.

## UNKNOWN

- Semantic correctness of 392-line Firestore rules (rules tests exist but content review pending).
- Whether every registered callable has a UI consumer and vice versa (functions registries not yet cross-mapped).
