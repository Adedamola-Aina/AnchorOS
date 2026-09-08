# AnchorOS Whole-Product Audit — Executive Status (Phase 0/1)

Date: 2026-09-07 · Branch: `audit/whole-product-2026-09` · Base master: `74ea144dbfba41d3fdf76c448057eabcdc3b6ea6`

## Phase 0 — Sync result

- master fast-forwarded `a8ccfb9 → 74ea144` (Engineering Platform v4 merge). Working tree clean. Local == origin/master == expected canonical SHA.
- Audit branch `audit/whole-product-2026-09` created fresh (did not previously exist).
- Canonical instructions read (AGENTS.md, .clinerules/00-core.md, .clineignore). Retired `.anchor` system NOT restored (its removal was part of the v4 merge).
- No product code, rules, functions, or config modified. Audit docs only.

## Phase 1 — Summary

This pass established a full structural map of the production system (see 02-ARCHITECTURE-MAP.md), a capability inventory (01), a static-integrity sweep (03), and a first-pass feature→test traceability matrix (04). All findings are in FINDINGS.md. No capability was behaviorally verified yet — deep dynamic verification is deferred to domain audit passes (HANDOFF.md).

## Automated baseline (exact)

| Gate | Result |
|---|---|
| `npm run lint` | PASS (exit 0, no output) |
| `npx tsc --noEmit -p config/tsconfig.app.json` | PASS (exit 0, no output) |
| `npm run check:dead-code` (knip) | PASS exit 0, zero findings — **but knip.json ignores functions/, packages/, e2e/, tools/, scripts/**, so reachability of those surfaces is NOT covered by knip. See F-06. Independent whole-repository reachability/dead-code analysis remains outstanding; knip's clean result is not repository-wide evidence. |
| `git diff --check` | PASS (clean) |

## Provisional health scorecard (first pass)

Most domains remain GREY by design: static inspection alone cannot confirm behavior.

| Domain | Status | Rationale |
|---|---|---|
| Auth | AMBER (audited 2026-09-07 — see 05-AUTH-SECURITY-DOMAIN.md) | 10 mechanisms mapped; sessions NOT revoked by "Revoke" (A-03), recovery consume non-atomic (A-01), client-side recovery material (A-02); deep findings documented, none remediated. |
| Account lifecycle | AMBER (audited 2026-09-07 — see 05) | deleteAccount confirmed non-transactional with incomplete erasure and NO unit tests (A-04). |
| Onboarding | GREY | OnboardingView, steps, invite acceptance exist with tests. Unverified. |
| Identity/Security | AMBER (audited 2026-09-07 — see 05) | Only "Not me" revokes tokens; device attestation inert (A-08); auth-event spoofable (A-06). |
| Home/Dashboard | GREY | Widgets (AssetAllocation, BeyondBasics, ProductivityScore, CompletionRing, RecentActivity) exist with unit tests; E2E coverage of dashboard exists. Unverified behaviorally. |
| Commitments | AMBER | Full feature surface + tests; but "Focus mode" is a declared-coming-soon stub (F-01) and optimistic-update tests are skipped (F-02). |
| Finance | AMBER (audited 2026-09-08 — see 06-FINANCE-FINANCIAL-INTEGRITY.md) | Full finance/mono/webhook forensic pass: 18 confirmed findings (3 HIGH: webhook replay-loss FI-01, webhook HMAC over re-serialized bytes FI-02, no sync pagination FI-03); no idempotency/reconciliation anywhere (FI-06/08/18); ledger not tamper-evident (FI-11); batch atomicity of transfers sound; cross-user access rules-proven denied; no stop condition. |
| Family Mode | GREY | V2 functions, invitations, migrations, rules tests, e2e; many family e2e tests are hard-skipped pending fixtures (F-03). |
| Fabric/Anchor AI | GREY | Large engine estate (QueryEngine, insights, predictions, briefing) + query-coverage gate at 99%. Unverified behaviorally. |
| Settings | GREY | Many panels; settings-with-no-consumer audit not yet done. |
| Notifications | GREY | FCM SW, push tokens, reminders pipeline in functions, preference toggles. Delivery effect unverified. |
| Design System | AMBER (static) | Shared components + docs/DESIGN_TOKENS.md + tailwind config confirm structural presence and consistent naming conventions observed on read. This establishes design-system presence ONLY: token adherence, responsive consistency, accessibility, reduced-motion support, and cross-screen visual consistency have not yet been audited. |
| UI/UX | GREY | Mobile-first shell, 44px targets claimed; unverified. |
| Accessibility | GREY | AccessibilityControls + useAccessibility exist; unverified. |
| Firebase/Data | AMBER | 392-line Firestore rules + 51-line storage rules + rules emulator test suites + index catalog checks. Rules content not yet semantically reviewed. |
| Functions | GREY | ~50 function modules incl. bank webhooks (Mono), MFA recovery, family, reminders, rate limiting. Reachability of every callable unverified. |
| PWA | AMBER | sw.js + manifest + InstallPrompt + messaging SW. Placeholder measurementId (F-04); minimal offline asset caching. |
| Native/Mobile | GREY | Full Capacitor android/ios trees AND a separate apps/ios-native SwiftUI app (parallel implementation — parity risk). Unverified. |
| Performance | GREY | Lighthouse CI config + virtualized lists exist; unverified. |
| Testing | AMBER | Extremely extensive unit/e2e/rules estate; but multiple hard `test.skip(true, …)` e2e families and skipped optimistic-update tests mean coverage claims need per-domain verification. |
| Dependencies | AMBER | lint/tsc/knip pass, but dependency health is NOT evidenced by those gates. Local `npm audit` on current master lockfiles reports 19 moderate advisories (11 root + 8 functions, 0 high/critical), concentrated in the firebase-admin → @google-cloud/{firestore,storage} transitive chain (qs DoS, uuid) — production-runtime relevant for Functions. GitHub's Dependabot banner reported "67 vulnerabilities (20 high)" during Phase 0/1; this is UNVERIFIED — the Dependabot tab is not publicly accessible (HTTP 404 unauthenticated) and local audit does not reproduce it. See F-09. |
| Privacy | GREY | privacy-first claim; FieldEncryption service exists; verification pending. |
| Error handling | AMBER | Structural mechanisms present (ErrorBoundary, FeatureErrorBoundary, captureError convention, /500 route, e2e error specs); semantic failure/recovery behavior (what users actually experience on partial failure, retries, offline, function errors) is unverified. |
