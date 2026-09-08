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
| Commitments | AMBER (audited 2026-09-08 — see 08-COMMITMENTS-TASK-STATE-INTEGRITY.md) | Full surface mapped (UI→service→optimistic cache→transaction→poll sync→offline queue→reminders→Fabric). **BUG-023 NOT solved as an invariant** — improved for the single-click online path only; 11 confirmed findings (2 HIGH: C-01 non-idempotent toggle double-applies streaks across duplicate/replay/concurrent paths, C-02 offline queue replays stale transitions with no idempotency/TTL and survives logout); server reminder scheduler compares user-local times against UTC (C-05); weekly tasks invisible to DailyBriefingEngine/badge via day-format split (C-06); rules validate only title+completed (C-07); no server-side reset exists — recurrence is client-clock/lazy (C-04). No stop condition. |
| Finance | AMBER (audited 2026-09-08 — see 06-FINANCE-FINANCIAL-INTEGRITY.md) | Full finance/mono/webhook forensic pass: 18 confirmed findings (3 HIGH: webhook replay-loss FI-01, webhook HMAC over re-serialized bytes FI-02, no sync pagination FI-03); no idempotency/reconciliation anywhere (FI-06/08/18); ledger not tamper-evident (FI-11); batch atomicity of transfers sound; cross-user access rules-proven denied; no stop condition. |
| Family Mode | AMBER (audited 2026-09-08 — see 07-FAMILY-SHARED-DATA-ISOLATION.md) | Invitation pipeline structurally sound (server-only writes, verified-email binding, bcrypt+lock) — no realistic takeover. **STOP CONDITION: disconnected ex-member retains rules-authoritative read of family-scoped accounts/finance/commitments/dashboard** (FS-01, HIGH: scope+'accountShares' channels never revoked); legacy `shares` un-revocable (FS-02); non-transactional disconnect/share (FS-04); no active-connection guard (FS-03); sharing E2E remains hard-skipped (F-03). |
| Fabric/Anchor AI | AMBER (audited 2026-09-08 — see 09-FABRIC-ANCHOR-AI.md) | Full Fabric forensic pass: **no external LLM/model provider exists anywhere in the audited path — Fabric is 100% deterministic client-side logic + 4 scheduled backend jobs.** 17 confirmed findings (0 HIGH; 6 MEDIUM: FB-01 singleton user-switch race can write User A's patterns under User B's UID, FB-02 learns never-committed offline/optimistic events, FB-04 weekly tasks invisible to briefing/badge = C-06 confirmed in current code, FB-05 server weekly-report integrity, FB-06 Lagos-hardcoded nudge scheduling, FB-08 clear-data leaves conversations/reports/mood); no stop condition; 333/333 Fabric tests pass. |
| Settings | AMBER (audited 2026-09-08 — see 10-SETTINGS-NOTIFICATIONS-DEVICES.md) | One canonical preference object but inverted "Email Notifications" master toggle (SN-02), dead email/frequency controls, family category toggle has no consumer (SN-05), unvalidated preference writes can abort the reminders scheduler (SN-09), last-writer-wins whole-object concurrency. |
| Notifications | AMBER (audited 2026-09-08 — see 10-SETTINGS-NOTIFICATIONS-DEVICES.md) | Full pass: 16 findings (1 HIGH **SN-01 STOP CONDITION**: logout/account-switch never deregisters the FCM token — User A's pushes render on the device after User B signs in, foreground handler not auth-scoped). Quiet hours evaluated in UTC (reminders/bills/weekly) and Lagos (Fabric) — never the user's timezone (SN-04, carries C-05/FB-06); sensitive ₦ amounts/titles in push bodies extended beyond FB-07 (SN-06); family in-app producers bypass all preferences (SN-05); token cleanup covers only 2 FCM error codes (SN-08). Capacitor/local notifications: NOT used — native shells have no notification channel (SN-16). No stop-triggering remediation performed. |
| Design System | AMBER (static) | Shared components + docs/DESIGN_TOKENS.md + tailwind config confirm structural presence and consistent naming conventions observed on read. This establishes design-system presence ONLY: token adherence, responsive consistency, accessibility, reduced-motion support, and cross-screen visual consistency have not yet been audited. |
| UI/UX | GREY | Mobile-first shell, 44px targets claimed; unverified. |
| Accessibility | GREY | AccessibilityControls + useAccessibility exist; unverified. |
| Firebase/Data | AMBER | 392-line Firestore rules + 51-line storage rules + rules emulator test suites + index catalog checks. Family/shared sections semantically audited (07 §12): default-deny and party-isolation hold; family predicate is existence-only — drives FS-01. |
| Functions | AMBER (reachability verified 2026-09-08 — see 11-WHOLE-REPOSITORY-REACHABILITY-DEAD-CODE.md) | ~50 deployed functions; barrel-export matrix proves all 81 non-test Functions source files deployment-reachable (no orphaned Functions modules); 10 deployed callables have NO product caller (externally reachable orphan surfaces incl. `addTransactionToSharedAccount`, `migrateFamilyConnectionsV2`, migration admin verbs); registry/contract subsystem is TEST_ONLY. Family callables inventoried in 07 §13. |
| PWA | AMBER | sw.js + manifest + InstallPrompt + messaging SW. Placeholder measurementId (F-04); minimal offline asset caching. |
| Native/Mobile | GREY | Full Capacitor android/ios trees AND a separate apps/ios-native SwiftUI app (parallel implementation — parity risk). Unverified. |
| Performance | GREY | Lighthouse CI config + virtualized lists exist; unverified. |
| Testing | AMBER | Extremely extensive unit/e2e/rules estate; but multiple hard `test.skip(true, …)` e2e families and skipped optimistic-update tests mean coverage claims need per-domain verification. |
| Dependencies | AMBER | lint/tsc/knip pass, but dependency health is NOT evidenced by those gates. Local `npm audit` on current master lockfiles reports 19 moderate advisories (11 root + 8 functions, 0 high/critical), concentrated in the firebase-admin → @google-cloud/{firestore,storage} transitive chain (qs DoS, uuid) — production-runtime relevant for Functions. GitHub's Dependabot banner reported "67 vulnerabilities (20 high)" during Phase 0/1; this is UNVERIFIED — the Dependabot tab is not publicly accessible (HTTP 404 unauthenticated) and local audit does not reproduce it. See F-09. |
| Privacy | GREY | privacy-first claim; FieldEncryption service exists; verification pending. |
| Error handling | AMBER | Structural mechanisms present (ErrorBoundary, FeatureErrorBoundary, captureError convention, /500 route, e2e error specs); semantic failure/recovery behavior (what users actually experience on partial failure, retries, offline, function errors) is unverified. |

## Phase 2 — Final synthesis (2026-09-09) — PROGRAM COMPLETE

**AUDIT DISCOVERY PHASE: COMPLETE.** All domain audits (reports 00–11) are reconciled in `12-FINAL-SYNTHESIS-REMEDIATION-PLAN.md` with the canonical register in `MASTER-FINDING-REGISTER.md`.

| Metric | Result |
|---|---|
| Raw findings | 105 confirmed (92 numbered + 13 reachability) + 34 unverified items |
| Canonical roots | 89 (87 open) — 0 CRITICAL · 8 HIGH · 32 MEDIUM · 33 LOW · 14 INFO |
| Release blockers (P0) | **FS-01** (family revocation leak) and **SN-01** (FCM token survives logout/account-switch) |
| F-09 dependencies | **RESOLVED / EXPLAINED** — GitHub 67 alerts = 5 manifests (3 internal-tooling manifests hold all 20 highs); product manifests carry 3 open moderate alerts |
| Verdict | **NOT production-ready.** Production gate = Wave 0 (land PR #111) → Wave 1 (P0 bundles) → Wave 2 (deletion/session/recovery) → Wave 3a (webhook/sync FI-01/02/03/18) |
| Next action | Remediation Wave 1 — first branch `remediation/wave1-family-revocation` (see HANDOFF). No further audit discovery is justified. |

Provisional scorecard deltas vs Phase 1: Sessions, Family/sharing, Notifications/devices, Firestore rules, Bank integration/webhooks now **RED** (confirmed stop conditions/broken channel); all others AMBER per report 12 §18.
