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
| `npm run check:dead-code` (knip) | PASS exit 0, zero findings — **but knip.json ignores functions/, packages/, e2e/, tools/, scripts/**, so reachability of those surfaces is NOT covered by knip. See F-06. |
| `git diff --check` | PASS (clean) |

## Provisional health scorecard (first pass)

Most domains remain GREY by design: static inspection alone cannot confirm behavior.

| Domain | Status | Rationale |
|---|---|---|
| Auth | AMBER | Large, layered implementation (AuthContext, MFA, passkeys, rate limit, social auth, recovery, functions-side sessionManagement/passkeyAuth) + rules/e2e/security tests. BUT 28 production auth/security-path files carry `@ts-nocheck` incl. AuthContext.tsx. Deep verification required. |
| Account lifecycle | GREY | deleteAccount function + DangerZone exist; completeness of data deletion unverified. |
| Onboarding | GREY | OnboardingView, steps, invite acceptance exist with tests. Unverified. |
| Identity/Security | AMBER | Sessions, auth-event history, device attestation present; revocation behavior unverified. |
| Home/Dashboard | GREY | Widgets (AssetAllocation, BeyondBasics, ProductivityScore, CompletionRing, RecentActivity) exist with unit tests; E2E coverage of dashboard exists. Unverified behaviorally. |
| Commitments | AMBER | Full feature surface + tests; but "Focus mode" is a declared-coming-soon stub (F-01) and optimistic-update tests are skipped (F-02). |
| Finance | AMBER | Very large surface (accounts, transactions, recurring, transfers, bank link via Mono, shared accounts) with tests; heavy @ts-nocheck concentration (67 files). Highest static-risk concentration in the product. |
| Family Mode | GREY | V2 functions, invitations, migrations, rules tests, e2e; many family e2e tests are hard-skipped pending fixtures (F-03). |
| Fabric/Anchor AI | GREY | Large engine estate (QueryEngine, insights, predictions, briefing) + query-coverage gate at 99%. Unverified behaviorally. |
| Settings | GREY | Many panels; settings-with-no-consumer audit not yet done. |
| Notifications | GREY | FCM SW, push tokens, reminders pipeline in functions, preference toggles. Delivery effect unverified. |
| Design System | GREEN (static) | Shared components + docs/DESIGN_TOKENS.md + tailwind config; consistent conventions observed. |
| UI/UX | GREY | Mobile-first shell, 44px targets claimed; unverified. |
| Accessibility | GREY | AccessibilityControls + useAccessibility exist; unverified. |
| Firebase/Data | AMBER | 392-line Firestore rules + 51-line storage rules + rules emulator test suites + index catalog checks. Rules content not yet semantically reviewed. |
| Functions | GREY | ~50 function modules incl. bank webhooks (Mono), MFA recovery, family, reminders, rate limiting. Reachability of every callable unverified. |
| PWA | AMBER | sw.js + manifest + InstallPrompt + messaging SW. Placeholder measurementId (F-04); minimal offline asset caching. |
| Native/Mobile | GREY | Full Capacitor android/ios trees AND a separate apps/ios-native SwiftUI app (parallel implementation — parity risk). Unverified. |
| Performance | GREY | Lighthouse CI config + virtualized lists exist; unverified. |
| Testing | AMBER | Extremely extensive unit/e2e/rules estate; but multiple hard `test.skip(true, …)` e2e families and skipped optimistic-update tests mean coverage claims need per-domain verification. |
| Dependencies | GREEN (static) | lint/tsc/knip green. |
| Privacy | GREY | privacy-first claim; FieldEncryption service exists; verification pending. |
| Error handling | GREEN (static) | ErrorBoundary, FeatureErrorBoundary, captureError convention, /500 route, e2e error specs. |
