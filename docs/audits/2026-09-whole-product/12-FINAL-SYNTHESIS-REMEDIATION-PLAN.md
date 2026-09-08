# 12 — FINAL SYNTHESIS & REMEDIATION PLAN — AnchorOS Whole-Product Audit 2026-09

Date: 2026-09-09 · Branch: `audit/whole-product-2026-09` · Head: `f7a535f4ca68cf77c25e183073977d30c93aa5af`
Mode: SYNTHESIS / RECONCILIATION / PLANNING ONLY. No product code, rules, dependencies, workflows, or PRs were modified.
Canonical finding data: `MASTER-FINDING-REGISTER.md`. Navigation index: `FINDINGS.md`. Next implementation step: `HANDOFF.md`.

---

## 1. Scope and method

This report closes the 2026-09 whole-product audit program (reports 00–11). It consolidates every confirmed finding, deduplicates cross-domain rediscoveries, normalizes severity on one product-wide scale, re-evaluates both stop conditions, resolves the F-09 dependency discrepancy with live evidence, integrates the reachability sweep, reconciles the SwiftUI retirement (PR #111), records the open architectural decisions, defines the product-wide invariants, the test-gap matrix, the `@ts-nocheck` strategy, remediation bundles and waves, the production-data verification plan, and the final release-readiness verdict.

Evidence sources: all eleven audit reports read in full; source/config inspected only to resolve contradictions; live `npm audit` (root + functions) and authenticated GitHub Dependabot API queries run read-only for §6 (F-09). Nothing was fixed.

**Architecture decision honored:** React 19 + TypeScript is the sole canonical product implementation (Web/PWA → Capacitor iOS/Android → Firebase). PR #111 (`chore(mobile): retire parallel SwiftUI application`, reviewed head `d9740c30cc3474cfb93e165515814fac96eae5f7`) is treated as APPROVED / PENDING MERGE. SwiftUI items are recorded as `PENDING APPROVED RETIREMENT — PR #111`, not as open remediation tasks, and were not re-audited.

## 2. Finding totals (full data in MASTER-FINDING-REGISTER.md)

| Metric | Value |
|---|---|
| Raw confirmed findings collected | 105 (92 numbered: F9/A8/FI18/FS13/C11/FB17/SN16 + 13 reachability entries R-*) |
| Dedup reclassifications | 15 (FS-01b, FI-09, FS-05, FS-06, FB-04, FB-06, FB-15, FB-16, SN-04, SN-06, SN-11, SN-13, SN-14, F-02, R-02) |
| Canonical root findings | **89** — open **87** (F-06 CLOSED, F-08 RETIRED-PENDING) |
| Normalized severity (open roots) | CRITICAL **0** · HIGH **8** · MEDIUM **32** · LOW **33** · INFO **14** |
| Release blockers (P0) | **2** — FS-01, SN-01 |
| Unverified high-information items | 34 (+ open suspicion S-03) |

The 8 HIGH findings: FS-01, SN-01 (both P0 blockers), A-04, C-01, C-02, FI-01, FI-02, FI-03.

## 3. Stop-condition re-evaluation (task 4)

### 3.1 FS-01 — Disconnected/revoked family member retains authoritative access — **RELEASE BLOCKER: YES (P0)**

- **Evidence status:** stands, fully code-proven (07 §19: `familyDisconnect.ts:32-55`, `firestore.rules:49-52,243,300,329,335`). `shareAccount` sets one-way `scope:'family'`; rows embed `accountShares[memberUid]`; disconnect flips status + removes `sharedWith` only; `isConnectedFamilyMember` checks doc existence only; connection doc persists. The rules-emulator post-disconnect test seeds only the `sharedWith` branch — the exact branches that grant access are untested (07 §18).
- **Exact affected paths:** read of every `scope:'family'` account doc **including balances** (rules :243), every family-scoped finance row (rules :300), every row whose `accountShares` index includes the ex-member (rules :298/:358-360), family-category commitments (rules :329-335), and the ex-partner's `dashboard` subtree (rules :334-337). Writes are correctly denied.
- **Normalized severity:** HIGH (persistent sensitive-data access after revocation). Not CRITICAL: requires a prior genuine connection; no unauthenticated path; no write access; blast radius is per connection pair.
- **Blast radius:** every household that ever shared accounts/commitments, historically and going forward; both parties mutually; indefinite duration. Production prevalence unverified (UH-F01) but the mechanism is unconditional.
- **Special conditions required:** none — a normal disconnect triggers it. No currently-logged-in attacker required; a stale/ex-member client or direct API access suffices.
- **Data categories exposed:** account balances, transaction history (amounts, counterparties, dates), family commitment content, dashboard documents, conversion rows (via FI-14).
- **Immediate containment:** none available without code change (a rules deploy IS the containment vehicle). Interim: support messaging that disconnect does not revoke historical reads; prioritize Wave 1. Optional stopgap: scheduled cleanup job resetting `scope` + stripping `accountShares` for disconnected connections ahead of the rules change.
- **Permanent remediation:** (a) `isConnectedFamilyMember` becomes status-aware (`get()`-based active check) or disconnect deletes the connection doc (decision AM-3); (b) disconnect transactionally resets `scope:'family'` and strips stale `accountShares` indexes (FS-01b); (c) one-time cleanup migration for existing disconnected connections (size informed by UH-F01); (d) idempotent/resumable disconnect (FS-04).
- **Required regression tests (emulator):** ex-member denied read on accounts/finance/commitments/dashboard/accountShares-indexed rows after disconnect; active member still allowed; disconnect batch-failure leaves no orphaned grants; deleteAccount path parity. Extend the previously-blind post-disconnect suite to seed `scope`, `accountShares`, `dashboard`.
- **Blocks release:** YES — violates the Revocation and Family invariants at the rules (authoritative) layer.

### 3.2 SN-01 — FCM token survives logout/account-switch — **RELEASE BLOCKER: YES (P0)**

- **Evidence status:** stands, fully code-proven (10 §35: `AuthContext.tsx:149-155` no token deregistration; `usePushNotifications.ts:33-55/69-85` foreground listener not auth-scoped; `public/sw.js:66-78` background rendering; all five server producers query `users/{uid}/fcmTokens` with no session-validity check).
- **Exact affected paths:** commitment reminders, bill reminders, 3 Fabric nudges, weekly report → OS-level SW rendering + App-level foreground toasts; delivery continues indefinitely (SN-08: cleanup covers only 2 FCM error codes).
- **Normalized severity:** HIGH (cross-user privacy boundary failure). Not CRITICAL: requires device sharing; no remote attacker; exposure is notification payload content (commitment titles, bill names, ₦ amounts — sensitive per FB-07/SN-06).
- **Blast radius:** every shared-browser/PWA install where a push-enabled user logs out and another account signs in; persists across sessions; compounding with FB-07 content.
- **Special conditions:** device sharing + A enabled push; no attacker action; no currently-logged-in attacker required (passive disclosure to the next device user).
- **Data categories exposed:** reminder titles (private tasks), bill names, spend totals/surplus amounts, completion percentages.
- **Immediate containment:** requires code. Interim: users can manually disable push before logout (undiscoverable); support messaging only.
- **Permanent remediation (bundle B2):** deregister/disable token docs on logout and account-switch (per-device, not per-account); server-side delivery gating (session-validity or per-device registration semantics); broaden token error-code cleanup (SN-08); push UI reflects persisted token state (SN-03); per-account disable flag replacing device-global localStorage; token-binding posture for SN-10 (decision AM-11).
- **Required regression tests:** two-account emulator test — logout as A → token doc removed/disabled → scheduler delivers nothing; login as B → no foreground toast of A's content; re-registration on next login as A; cleanup matrix for permanent FCM errors. Real-device verification tracked as UH-SN01/04/05.
- **Blocks release:** YES — stop condition "User A notifications can be delivered to User B's active device/account context."

## 4. Release blockers & priority classification (task 5)

Independent of source severity labels.

### P0 — BLOCK RELEASE / SECURITY

| ID | Reason | Affected users | Required remediation | Required test evidence | Deployment | Rollback |
|---|---|---|---|---|---|---|
| FS-01 (+FS-01b, FS-04) | Persistent rules-authoritative access to sensitive family data after revocation; disconnect UI explicitly claims revocation | Every household ever created | Status-aware family predicate (or connection deletion), scope reset, index strip, transactional disconnect, cleanup migration | Extended emulator post-disconnect suite (scope/index/dashboard/commitments branches) | Rules + functions deploy; cleanup migration staged | Rules revert restores prior behavior; cleanup additive/idempotent |
| SN-01 (+SN-03, SN-08) | Cross-user disclosure of notification content on shared devices; logout never revokes the delivery surface | Every push-enabled user on shared devices | Token deregistration on logout/account-switch + delivery gating + cleanup matrix | Two-account emulator test + token lifecycle unit tests + device smoke (UH-SN01) | Functions + client deploy | Client-only revert safe; server gating flag-gated |

### P1 — MUST FIX BEFORE BROADER USE

- **A-04** (+FI-09, SN-13): deletion destructive, non-transactional, incomplete, untested — data-loss failure mode on a core lifecycle action; erasure-contract invariant.
- **A-01, A-02, A-03 (+U-01 verification)**: recovery-code replay window; client-side recovery material; cosmetic session "Revoke"; establish credential-change revocation semantics — the session invariant.
- **C-01, C-02**: commitment streak corruption via duplicate/replay/offline paths — persistent user-visible corruption on a normal path.
- **FI-01, FI-02, FI-03 (+FI-18)**: webhook channel lossy/byte-fragile; sync drops history beyond page 1 — the bank channel cannot be trusted as shipped.
- **FI-06**: finance offline duplicates (money-state integrity).
- **FB-01**: cross-user Fabric write contamination.
- **FB-08**: "clear data" privacy control incomplete.
- **F-03** (test infrastructure): un-skipped high-risk E2E is a gate for the above.

### P2 — PRODUCT CORRECTNESS / ARCHITECTURE

C-03..C-07 (+FB-04), C-05 root (+SN-04/FB-06/FB-16/SN-11), FB-02, FB-05 (+FB-15), FB-07 (+SN-06), SN-02, SN-05, SN-07 (+FS-08), SN-09, FI-04, FI-05, FI-07, FI-08, FI-10 (+FS-05), FI-11, FI-14 (+FS-06), FS-02, FS-03, F-05, F-09 execution, R-11 decisions.

### P3 — CLEANUP / HARDENING

A-05 (+SN-14), A-06, A-07, A-08, F-01, F-04, F-07 program, FI-12, FI-13, FI-15, FI-16, FI-17, FS-07, FS-09, FS-10, FS-11, FS-12, C-08..C-11, FB-03, FB-09..FB-13, FB-17, SN-10, SN-12, SN-15, SN-16, R-01..R-12.

## 5. Severity normalization summary (task 3)

One scale applied across all reports; per-finding rationale in the register changelog. Highlights: FB-07 raised LOW→MEDIUM (all-producer evidence + SN-01 interaction); FI-14 raised LOW→MEDIUM (post-disconnect exposure proven by FS-06); A-08 settled at INFO (unreachable); F-07 LOW (defense-in-depth; Tier-1 typing is a wave prerequisite); F-03 INFO (verification gap, P1 gate); F-09 MEDIUM EXPLAINED. **No CRITICAL exists**: no unauthenticated sensitive-data path, no direct unauthorized monetary action, and no multi-tenant compromise was proven anywhere in the corpus.

## 6. Dependency security reconciliation — F-09 (task 6, mandatory) — **VERDICT: RESOLVED / EXPLAINED**

### 6.1 What was run (read-only)

- `npm audit --json` at repository root (root manifest + `packages/*` workspace): **11 moderate, 0 high, 0 critical**.
- `npm audit --json` in `functions/`: **9 moderate, 0 high, 0 critical** (baseline recorded 8 on 2026-09-08; the delta is one advisory against the `firebase-functions` range `>=5.0.0` — npm advisory-DB drift between the baseline date and this re-run, not a lockfile change).
- Manifest/lockfile inspection: root `package.json` (workspaces = `packages/*` only), `package-lock.json`, `functions/package.json` + lockfile, `packages/{types,ui}`, `tools/{mcp-server,dashboard/*}` manifests + **committed lockfiles**.
- `.github/dependabot.yml`: **four ecosystems configured** — npm `/`, npm `/functions`, github-actions `/`, **swift `/apps/ios-native`**.
- Authenticated GitHub API: `gh api repos/Adedamola-Aina/AnchorOS/dependabot/alerts?state=open` → **67 open alerts** (banner count reproduced exactly).

### 6.2 The reconciliation — the 67 is real and fully attributed

GitHub Dependabot scans **five npm manifests** in this repository. The local `npm audit` runs cover only two of them (root + functions; the root workspace declaration excludes `tools/**`, so npm audit has never seen the tooling manifests). Per-manifest breakdown of the 67 open alerts:

| Manifest | High | Moderate | Low | Total | Role |
|---|---|---|---|---|---|
| `tools/mcp-server/package-lock.json` | 9 | 21 | 3 | **33** | Internal engineering tooling (optional MCP console; DEV_ONLY per report 11 §9) |
| `tools/dashboard/client/package-lock.json` | 6 | 11 | 3 | **20** | Internal read-only observability dashboard (LIVE_OPERATIONAL, PM2-hosted, engineering-only) |
| `tools/dashboard/server/package-lock.json` | 5 | 5 | 1 | **11** | Same — server side |
| `package-lock.json` (root product) | 0 | 2 | 0 | **2** | **Product manifest** |
| `functions/package-lock.json` (product) | 0 | 1 | 0 | **1** | **Product manifest** |
| **Total** | **20** | **40** | **7** | **67** | Matches the push banner exactly (20 high / 40 moderate / 7 low) |

**All 20 high alerts live in internal engineering tooling manifests, zero in product manifests.**

Second counting difference: Dependabot raises one alert per (advisory × manifest). Several packages accumulate many alerts: `hono` (17 in mcp-server), `axios` (10 in dashboard/client), `fast-uri` (7), `qs` (3 advisories × 2 tooling manifests + 1 root). The 67 alerts reduce to **19 unique packages** (qs, uuid, browserslist, nanoid, fast-uri, postcss, postcss-selector-parser, js-yaml, hono, @hono/node-server, ip-address, brace-expansion, body-parser, axios, @babel/core, form-data, vite, esbuild, simple-git). `npm audit` conversely counts every package on a vulnerable *path* as a "vulnerability" entry (e.g. `firebase-admin`, `@google-cloud/firestore/storage`, `google-gax`, `gaxios`, `retry-request`, `teeny-request` are path entries stemming from the `qs`/`uuid` advisories) — the two counters are not directly comparable even for the same manifest.

### 6.3 Product-manifest alert detail

| Advisory / package | GitHub severity | Local audit severity | Manifest | Runtime/dev | Reachable? | Fixed version | Action |
|---|---|---|---|---|---|---|---|
| GHSA-w5hq-g745-h8pq `uuid` < 11.1.1 | medium | moderate (via chain) | functions | **runtime** (firebase-admin → @google-cloud chain) | Reachable in Functions process (buffer bounds check; not attacker-facing input path today) | 11.1.1 (via firebase-admin upgrade) | REQUIRES REGRESSION — bundle with firebase-admin upgrade |
| GHSA-q8mj-m7cp-5q26 `qs` ≤ 6.15.1 | medium | moderate (3 advisories locally incl. remotely-triggerable DoS) | root | **development** (Dependabot scope; reached via dev-side body-parser chain) | Not reachable from shipped client bundle; DoS class relevant only if exposed server-side | 6.15.2 | SAFE PATCH (lockfile-range bump) |
| `firebase-functions` ≥ 5.0.0 (npm DB only; not in GitHub's open set) | moderate | moderate | functions | runtime | Reachable (Functions framework) | fixAvailable (major) | REQUIRES REGRESSION — compatibility matrix with firebase-admin |
| `firebase-admin` chain (local path entries: @google-cloud/firestore, @google-cloud/storage, google-gax, gaxios, retry-request, teeny-request, uuid, qs/body-parser) | (no additional GitHub alerts) | moderate | root + functions | **runtime for functions** | Functions runtime reachable; qs DoS class is the production-relevant item | firebase-admin 14.3.0 (root) / 10.3.0 (functions, constrained by firebase-functions pairing) | MAJOR UPGRADE — deliberate, staged |
| `@lhci/cli` → uuid | moderate | moderate | root | dev (CI tooling) | Not runtime | 0.6.1 (major path — evaluate/accept) | ACCEPT / MONITOR or pinned upgrade |
| `body-parser` (root chain) | moderate | moderate | root | dev-leaning | Verify import surface (none in shipped client) | fixAvailable | REMOVE WITH DEAD CODE candidate / SAFE PATCH |
| tools/* advisories (browserslist, nanoid, fast-uri, hono, axios, js-yaml, ip-address, simple-git, form-data, vite, esbuild, postcss, @babel/core, brace-expansion, body-parser, @hono/node-server, qs, uuid) | 20 high / 38 mod / 7 low | not covered by local npm audit run | tools/mcp-server, tools/dashboard/{client,server} | Internal tooling only; never shipped to users; dashboard is read-only, engineering-network-scoped | Not runtime-reachable by product users | All have fixes; mostly minor/patch | SAFE PATCH sweep for tooling manifests (or ACCEPT if tooling is dev-only) |

### 6.4 Answers to the mandated questions

- **Multiple manifests?** Yes — five npm manifests; the swift ecosystem config exists but contributes no open vulnerability alerts.
- **Historical/stale graphs?** No evidence of stale alerts: ranges match current committed lockfiles (spot-checked qs/uuid against local audit ranges).
- **Already fixed in current branch?** No — the audit branch touches no lockfiles; all 67 remain open.
- **Tied to PR #111 retirements?** The swift dependabot *ecosystem* contributes no alerts but its config entry should be removed when PR #111 lands (housekeeping, not alert count).
- **Duplicate advisories across manifests?** Yes — qs, uuid, body-parser appear in several manifests; GitHub counts once per manifest.
- **Dev vs runtime (product manifests):** GitHub scopes root qs/uuid as **development**; the only product **runtime**-scoped open alert is `uuid` in functions. Local audit flags the functions `firebase-admin → qs` chain as production-relevant (server-side DoS class) — retained as the priority product item.
- **High/critical reachable count (product):** **0**.
- **Lockfile vs manifest divergence:** none found; both product lockfiles committed and current relative to manifests.

### 6.5 F-09 verdict: **RESOLVED / EXPLAINED**

The GitHub 67/20-high banner and the local 19–20-moderate audit are **both correct and mutually explained**: different manifest scope (5 vs 2) plus different counting semantics (per-advisory-per-manifest vs per-path). Residual unknowns are operational only (UH-03 secret state; whether `tools/dashboard` is reachable beyond the engineering network). The F-09 acceptance criterion "authenticated Dependabot count reconciled with local audit" is met.

## 7. Dependency remediation plan (task 7) — grouped, not executed

| Category | Items | Notes |
|---|---|---|
| SAFE PATCH | root `qs` → ≥6.15.2 via lockfile bump; `body-parser` chain bump; tools/* manifests patch/minor sweep (browserslist, nanoid, postcss, js-yaml, form-data, ip-address, brace-expansion, axios, fast-uri, hono, simple-git, esbuild, @babel/core, @hono/node-server) | Tooling sweep is internal-only; smoke each tool after bump |
| REQUIRES REGRESSION | functions `uuid` (via firebase-admin pairing); `firebase-functions` advisory fix; root `firebase-admin` chain intermediate steps | Touches Functions runtime: emulator integration tests + staging deploy before prod |
| MAJOR UPGRADE | `firebase-admin` 14.x (root) / 10.3.0 pairing (functions); staged migration with Admin API diff review | Never bundle with P0/P1 security fixes; dedicated PR + staged deploy |
| REMOVE WITH DEAD CODE | `@lhci/cli` uuid path (if Lighthouse config revisited); `body-parser` if import surface is dev-only; swift dependabot ecosystem entry with PR #111 | Pair deletions with R-09/R-13 cleanups |
| ACCEPT / MONITOR | `@lhci/cli` downgrade alternative; any tooling advisory whose fix forces a major tooling migration while the tool stays engineering-only; npm DB `firebase-functions` advisory until its pairing fix is scheduled | Record acceptance owner + revisit date in Wave 6 |

Dependency work is scheduled in **Wave 6** (except the swift-ecosystem removal, which is Wave 0 with PR #111).

## 8. Reachability sweep integration (task 8)

Report 11's findings are integrated into the register as R-01..R-13 and split by remediation posture:

**Safe cleanup candidates (high-confidence orphans — W6·B10):** 13 orphaned `src` modules + their 13 tests (R-01, incl. the FB-14 estate), `stryker-setup-0.js` (R-06), `public/firebase-messaging-sw.js` (R-08), dead `fabric_suggestions` flag (R-10), `@anchor-os/types` + alias (R-07), vestigial functions/methods (R-09: `sendTemplatedEmail`, `monoClient.triggerSync`, `auditCommitments.edited`, `clearTaskQueue`/`getTaskQueueLength`, bcrypt recovery path — with A-02, `normalizeInviteeEmail`, no-op `FieldEncryption` wiring), `restoreSoftDeletedTransaction` (FI-13). Deletion risk LOW; unlocks honest coverage/mutation baselines.

**Security-relevant orphan surfaces (deployed, authenticated-only — R-03):** 10 callables without product callers. Deletion priority ordered by risk reduction: (1) `addTransactionToSharedAccount` — resolve **together with FI-10/FS-05** in Wave 3 (retire, or harden if a consumer is planned); (2) `runMigration`/`rollbackMigration`/`getMigrationStatus`/`listMigrations` — operator-gate (admin-grade verbs); (3) `migrateFamilyConnectionsV2` — retire after the migration-authority decision (AM-5) and data audit; (4) `getNotifications`/`dismissNotification`/`listActiveSessions`/`syncBankTransactions`/`syncEmailToProfile` — retire or wire deliberately; (5) `checkFirestoreQuota`/`warmUpFunctions`/`health` — keep (operational). Retirement requires a Functions deploy (barrel export removal) — stage with a functions release.

**Stale CI/config (false-red or impossible — R-05/R-12):** `appknox.yml` and `mayhem-for-api.yml` are template placeholders → delete or complete; document the `checkmarx` secret requirement; re-scope Knip (test-entry glob + 7 ignored areas) after the deletion wave.

**Architectural duplicates (both live — decisions required, not deletion):** the 9 pairs in R-11 (weekly report, bill-due, social sign-in, auth service, family migration, service worker, shares/sharedWith, reminder channels, shared types) feed the decision register §10.

Deletion priority weighting used: attack-surface reduction > test-signal improvement > dependency removal > maintenance burden > risk of removal.

## 9. SwiftUI retirement reconciliation (task 9)

Status: **PENDING APPROVED RETIREMENT — PR #111** (`chore(mobile): retire parallel SwiftUI application`, reviewed head `d9740c30cc3474cfb93e165515814fac96eae5f7`). This is NOT an undecided architecture question and is not counted as an open remediation item.

- Items that **automatically resolve when PR #111 merges:** F-08 (duplicate parallel mobile implementation), R-13 (`apps/ios-native`, `.swift-version`, `ios-native.yml`, `ios:sync`/`ios:open` scripts), the swift Dependabot ecosystem entry, and the report-10 native-parity caveat insofar as it referenced the SwiftUI app's notification capability (the Capacitor-shell notification gap itself remains, SN-16).
- **Pre-#111 branch-state wording:** statements in reports 01/02/03/11 that `apps/ios-native` is "tracked", "CI-integrated", "LEGACY_REACHABLE", or that its future is an "architectural decision pending" (11 §12/§21/§24) describe the audit branch's base, which predates the retirement decision; they are superseded by this section.
- No PR #111 changes were made from this task; PR #111 is not merged here.

## 10. Architectural decisions required before remediation (task 10)

Decision register — recommendations are explicit; each is a precondition for its wave:

| # | Decision | Options | Recommendation | Reason | Affected findings | Migration consequence | Rollback complexity |
|---|---|---|---|---|---|---|---|
| AM-1 | Family membership model | (a) enforce single-active-household; (b) model N-member households | **(a) single active connection** now; design (b) later behind the same predicate | Product is pair-oriented; (a) is a guard clause vs a schema migration; existence-only rules make (b) unsafe to leave open | FS-01, FS-03, UH-F04 | Reject second confirmations; no data migration | Low (guard removal) |
| AM-2 | `shares` vs `sharedWith` authority | (a) `sharedWith` sole authority, neutralize legacy `shares`; (b) keep dual read forever | **(a)** — keep rules read of `shares` during transition, add server cleanup of legacy entries, remove the rules branch after the UH-F01 prevalence check | `shares` has no revoker; dual model is the root of rules/client divergence | FS-02, FS-05, R-11 | One-time cleanup migration (data-dependent size) | Medium |
| AM-3 | Revocation mechanism | (a) status-aware `isConnectedFamilyMember` (get-based); (b) delete connection doc on disconnect | **(a)** status-aware predicate + explicit scope/index cleanup; keep doc for history/audit | Preserves disconnect history; avoids re-share races on deleted docs; (b) is the fallback if rules `get()` cost is unacceptable | FS-01, FS-01b, FS-04, FS-11 | Cleanup migration for existing disconnected pairs | Medium |
| AM-4 | Weekly report authority | (a) server canonical; (b) client canonical | **(a) server** (`weeklyReport.ts` fixed per FB-05); remove client `WeeklyReportEngine` output | Server job is the delivery path; one schema in `fabric_reports` | FB-05, FB-15, R-11 | Drop client-written report docs | Low |
| AM-5 | Legacy migration callable vs framework | (a) framework (`runMigration`) only; (b) keep legacy callable | **(a)** — retire `migrateFamilyConnectionsV2` (registry already `replacedBy`); operator-gate migration verbs | Two deployed mutation paths for one domain is drift risk | R-03, R-11 | None (callable already unused) | Low |
| AM-6 | Service worker authority | (a) `sw.js` only; (b) dual | **(a)** — delete `firebase-messaging-sw.js` (R-08) | Never registered; duplicate carries an unguarded `JSON.parse` | R-08 | None | Low |
| AM-7 | Reminder delivery authority | (a) server FCM authoritative, client channel removed; (b) dual with cross-channel dedupe | **(a)** server authoritative; client in-page reminder becomes a render of server state | Server channel has dedupe/claims infra; the dual channel caused C-05/SN-11/SN-12 | C-05, SN-11, SN-12 | None (client channel is additive today) | Low |
| AM-8 | Bill-due calculation authority | (a) shared computation module; (b) keep two implementations | **(a)** one shared computation (server pipeline for delivery, client import for display) | Two divergent "due soon" windows | R-11 | None | Low |
| AM-9 | Timezone source of truth | (a) write IANA tz to `profile.timezone` + single resolution util; (b) UTC-everywhere | **(a)**; fallback = device offset captured at write time | The field exists but is never written; every server producer needs it | C-05, SN-04, FB-06, FB-16, C-04 | Backfill `profile.timezone` (default + prompt) | Medium |
| AM-10 | Notification preference schema authority | (a) `notificationPreferences` with rules allowlist + hardened parser; (b) new schema | **(a)** — keep the canonical object; validate at boundary; rename controls (SN-02); drop dead fields | One schema exists; the defect is semantics + validation, not structure | SN-02, SN-05, SN-09 | Remove `.email`/`.frequency`/`.lastDigestAt` | Low |
| AM-11 | Session/device model | (a) real token revocation on revoke/logout/credential-change + per-device token docs; (b) cosmetic session list retained | **(a)** — `revokeSession` calls `revokeRefreshTokens`; logout/account-switch deregisters FCM token; producers gate on delivery eligibility | The revocation invariant is violated end-to-end (A-03, SN-01, U-01) | A-03, SN-01, SN-03, SN-10, U-01, FS-10 | Token doc schema gains device/session identifiers | Medium |
| AM-12 | Deployed orphan callables | retire vs keep vs gate | Retire product-duplicates; operator-gate migration verbs; keep ops endpoints | Attack-surface reduction with zero consumer impact | R-03, FI-10 | Barrel removal = functions deploy | Low |
| AM-13 | App Check enforcement | (a) enforce in prod, restrict override to non-prod; (b) status quo | **(a)** — verify current prod state first (UH-F06), then lock | The override nullifies FS-07/FS-12/C-07 mitigations | FI-17, U-02, UH-F06/C06 | Env config change only | Low |

## 11. Product-wide invariants (task 11) — remediation acceptance gates

Every wave PR must state which invariants it touches and demonstrate them with tests. CI should grow a per-domain invariant suite as waves land.

| # | Invariant | Definition (testable form) |
|---|---|---|
| INV-1 | **Identity** | A UID may access only resources explicitly authorized to it (rules + server ownership resolution; no client-supplied owner paths) |
| INV-2 | **Revocation** | Revocation/logout/removal removes authoritative (rules/server) access, not only UI visibility |
| INV-3 | **Session** | Security-sensitive account events (password change/reset, MFA change, explicit revoke) have defined, tested session-invalidating behavior |
| INV-4 | **Finance** | One logical financial event produces one internally consistent state transition (idempotent under retry/race; corrections from persisted state) |
| INV-5 | **Webhooks** | Authenticity (raw-byte HMAC), idempotency (mark-on-completion), and retry semantics are explicit and tested |
| INV-6 | **Family** | Share grants have one authoritative model (`sharedWith`) and complete revocation semantics (scope, row indexes, mirror rules) |
| INV-7 | **Commitments** | One recurrence cycle produces at most one completion/streak increment, under duplicate/replay/concurrency |
| INV-8 | **Offline** | Retrying an already-committed logical action never applies it twice (idempotency keys enforced at flush) |
| INV-9 | **Time** | One canonical timezone policy (per-user IANA) drives schedules, recurrence, reports, and quiet hours |
| INV-10 | **Notifications** | A token belongs to the correct authenticated user/device lifecycle; preferences (incl. quiet hours) are enforced by every producer |
| INV-11 | **Fabric** | Learned state cannot cross authenticated users and never learns failed/uncommitted actions |
| INV-12 | **Deletion** | Account deletion (and clear-data) has an explicit, testable erasure contract covering tree, Storage, tokens, claims, queues, provider links |
| INV-13 | **Type safety** | Security/integrity-critical boundaries must not depend on unchecked shapes (Tier-1 `@ts-nocheck` removed as waves touch them) |

## 12. Test-gap master matrix (task 12)

Focus: tests required to **prove remediation**. "Skipped" = exists but disabled.

| Area | Test | Type | Covers | Status | Fixture gap | When |
|---|---|---|---|---|---|---|
| Auth/session | Credential-change revokes other devices (U-01) | integration | A-03, U-01, INV-3 | Missing | none | Wave 2 |
| Auth/session | `revokeSession` actually revokes | functions unit + integration | A-03 | Missing | none | Wave 2 |
| Auth/session | Concurrent recovery-code consume (race) | functions unit | A-01, A-02 | Missing | none | Wave 2 |
| Account deletion | deleteAccount erasure contract (tree/Storage/tokens/Mono/claims/queues) + partial-failure resume | emulator + functions | A-04, FI-09, SN-13, INV-12 | Missing entirely | emulator seed harness | Wave 2 |
| Firestore rules | Post-disconnect denial incl. `scope`/`accountShares`/`dashboard`/family-commitments branches | rules emulator | FS-01, FS-01b, FS-11, INV-2/6 | Blind spot (seeds only sharedWith) | seed branches | **Before/with Wave 1** |
| Family revocation | Disconnect batch-failure/orphan-grant; share-vs-disconnect race | functions/emulator | FS-04, FS-03 | Missing | none | Wave 1 |
| Family revocation | `shares` legacy cleanup completeness | emulator | FS-02 | Missing | legacy fixtures | Wave 3 |
| Finance idempotency | Offline-queue timeout-retry applies once (`requestId`) | integration | FI-06, INV-8/4 | Missing | flaky-network sim | Wave 3 |
| Finance idempotency | Concurrent sync double-import | functions | FI-18, FI-03 | Missing | none | Wave 3 |
| Webhook | Signature over raw bytes (fixture replay); retry-after-failure convergence | functions contract | FI-01, FI-02, INV-5 | Missing | captured Mono fixture | Wave 3 |
| Finance correctness | Reversal from persisted doc (un-skip `useFinanceService.test.tsx:216,432`) | unit | FI-05, FI-07 | Skipped | none | Wave 3 |
| Commitments | Toggle duplicate/replay/concurrency (one increment per cycle) | transaction unit | C-01, F-02, INV-7 | Missing | none | Wave 4 |
| Commitments | Offline queue replay math (desired-state, TTL, logout clear, cross-tab) | unit/integration | C-02 | Missing (flush-only) | IDB harness | Wave 4 |
| Commitments | Reset race + year branch | unit | C-04 | Partial (mocked clock) | clock harness | Wave 4 |
| Firestore rules | Commitments field allowlist + size caps | rules emulator | C-07, C-10, FI-15 | Missing (0 tests) | none | Wave 4 |
| Timezone | Reminder/quiet-hours TZ matrix (Lagos/UTC/UTC+8/UTC−5/DST) | functions | C-05, SN-04, FB-06/16, INV-9 | Partial (fixed clock) | TZ harness | Wave 4 |
| Notifications/device | Two-account logout→switch token lifecycle | emulator + functions | SN-01, SN-03, SN-08, INV-10 | Missing | multi-account fixture | **Before/with Wave 1** |
| Notifications | Token cleanup error-code matrix | unit | SN-08 | Missing | none | Wave 1 |
| Fabric | User-switch service isolation (A→B init window) | service-level unit | FB-01, INV-11 | Missing | none | Wave 5 |
| Fabric | Learning only on commit (event-id dedupe) | unit | FB-02, FB-03 | Missing | none | Wave 5 |
| Dependency/build | `npm audit` gate + lockfile diff check in CI (incl. tools/*) | CI | F-09 | Missing | none | Wave 6 |
| E2E gates | Un-skip family-mode-sharing (7), finance account creation, auth sign-out/MFA | E2E | F-03; gates W1–W4 | Skipped | family/shared-account seed fixtures | With each wave |

## 13. `@ts-nocheck` remediation strategy (task 13)

Baseline: 205 production files (report 03); reachability proved the burden is **live code** — 0 of the 13 orphaned modules carry suppression (report 11 §18). Do NOT bulk-remove.

| Tier | Population | Examples | Strategy |
|---|---|---|---|
| **Tier 1** — security/auth/session/rules-adjacent/finance/family/write-core/notification boundaries | ~100 files: finance (~56), auth (~14), api layer (31, incl. FinanceApi/CommitmentApi/AuthProfileApi), write-path hooks | `AuthContext.tsx`, `AuthGate.tsx`, `useMfaOperations.ts`, `MfaRecoveryApi.ts`, `functions/src/rateLimit.ts`, `FinanceContext.tsx`, `CommitmentApi.ts`, `permissions.ts`, `usePushNotifications.ts`, `NotificationContext.tsx` | Removed **as a prerequisite of the wave that fixes the related invariant** — typing lands in the same PR as the fix so the compiler guards the change (e.g. `AuthContext`/`usePushNotifications` typed in Wave 1 before editing logout; `TransactionService`/`TransferOperations` typed in Wave 3 before balance-math edits) |
| **Tier 2** — core product state + Fabric | remaining hooks/state (~37), Fabric services, TaskContext/FabricContext | `useCommitmentService.ts`, `FabricService.ts`, `queryClient.ts`, `persister.ts` | Removed in Waves 4–5 with their feature work; small dedicated typing PRs (≤10 files) allowed per wave |
| **Tier 3** — presentation/UI-only | settings components (60), commitments views (18), onboarding (14), dashboard (11), shared (22), utils (19) | view components | Batched in Wave 6; mechanical; lint gate added so the count can only go down |

Rule: every wave PR that touches a suppressed file must remove its `@ts-nocheck` (or justify an explicit waiver in the PR description). Track the count in each wave's definition of done.

## 14. Remediation coupling graph (task 14)

Bundles — findings that must be solved together because separate remediation would be unsafe or inefficient:

| Bundle | Findings | Why coupled |
|---|---|---|
| **B1 Family revocation** | FS-01 + FS-01b + FS-04 (+ FS-02 execution, FS-11) | Same rules surface and same callable (`familyDisconnect.ts`); a status-aware predicate without index/scope cleanup leaves FS-01b open; non-transactional disconnect (FS-04) can re-orphan grants the predicate fix was meant to close |
| **B2 Notification/device lifecycle** | SN-01 + SN-03 + SN-08 (+ SN-02 semantics, SN-10 posture) | Token deregistration without UI-state alignment (SN-03) recreates "ON shown, no delivery"; the cleanup matrix (SN-08) is what makes deregistration durable; both touch the same token doc schema (AM-11) |
| **B3 Time policy** | C-05 + SN-04 + FB-06 + FB-16 (+ SN-11, FB-17) | One timezone source of truth (AM-9) must be adopted by all producers simultaneously or quiet-hours/reminder behavior diverges further |
| **B4 Commitment idempotency** | C-01 + C-02 (+ C-03, C-04, F-02, C-07 rules clamp) | Same root (client-argued toggle + transition queue); the rules field clamp (C-07) must land with the client change that stops writing protected fields or toggles start failing (08 §24 constraint) |
| **B5 Account deletion** | A-04 + FI-09 + SN-13 (+ FS-02 parity) | One deletion orchestrator; fixing the transaction boundary without provider revocation and claim/queue cleanup leaves the erasure contract broken |
| **B6 Finance ingestion** | FI-01 + FI-02 + FI-03 + FI-18 (+ FI-04, FI-08) | Webhook semantics, sync pagination, and dedupe idempotency define each other (mark-on-completion requires idempotent imports); separate fixes would be reworked by the next one |
| **B7 Balance-mutation correctness** | FI-05 + FI-07 + FI-06 (+ FI-13 deletion) | All are "compute from persisted state inside the transaction" — one shared pattern + test harness |
| **B8 Fabric isolation/learning** | FB-01 + FB-02 + FB-03 | One learning-event pipeline fix (authoritative commit + event identity + user-keyed state) resolves all three |
| **B9 Shared-finance permission surface** | FI-10 + FS-05 + FI-14/FS-06 (+ R-03 callable retirement) | One callable/schema hardening; retiring the orphan surface is an alternative branch of the same decision (AM-12) |
| **B10 Dead-code / security-surface** | R-01..R-12 + A-08 + FI-13 + FB-14 | One deletion wave; knip re-scope must follow deletions; A-08's dead client service deletes with R-01 |
| **B11 Session semantics** | A-03 + U-01 + FS-10 (+ A-01 revocation-on-recovery) | All are "security event ⇒ token revocation"; one revocation helper + tests |
| **B12 Notification content/preferences** | FB-07 + SN-06 + SN-05 + SN-07 + FS-08 + SN-02 | One producer-side content/preference policy across all 5 push + 4 in-app producers |
| **B13 Weekly-report authority** | FB-05 + FB-15 (+ FI-12 derivations) | One report implementation + schema |

## 15. Remediation waves (task 15) — 7 waves

### Wave 0 — Branch/architecture stabilization (no product fixes)
- **Objective:** clean remediation base.
- **Actions:** land PR #111 (SwiftUI retirement); merge the audit documentation branch to master after CTO review; record decisions AM-1..AM-13 as accepted/rejected; create the production-data verification tickets (§17).
- **Findings closed:** F-08, R-13 (both PENDING APPROVED RETIREMENT).
- **Tests:** full CI green on post-#111 master. **Deploy:** none (CI/config-only). **Rollback:** revert PR #111.
- **DoD:** master contains no `apps/ios-native`; swift dependabot ecosystem removed; decision register signed off.

### Wave 1 — Security stop conditions (P0)
- **Objective:** close FS-01 and SN-01.
- **Findings:** FS-01, FS-01b, FS-04 (bundle B1); SN-01, SN-03, SN-08 (bundle B2) — two PRs, one branch.
- **Decisions:** AM-1, AM-3, AM-11. **Files:** `config/firestore.rules`, `functions/src/familyDisconnect.ts`/`familySharing.ts`, cleanup migration; `AuthContext.tsx`, `usePushNotifications.ts`, token doc schema, the 5 producers' delivery gating, `reminderTokenCleanup.ts`.
- **Migrations:** scope-reset + `accountShares`-strip for existing disconnected pairs; token-doc backfill.
- **Deploy:** rules + functions + client, staged dev → staging → prod; the rules deploy is the FS-01 containment moment. **Tests:** the two "Before/with Wave 1" rows of §12; Tier-1 typing (AuthContext, usePushNotifications, permissions.ts) lands first in the same PRs. **Observability:** family rules-denial metrics; token deregistration events; delivery-gating counters.
- **Rollback:** rules revert; client revert; migrations idempotent.
- **DoD:** extended emulator suites green in CI; two-account device smoke passes; both stop conditions formally re-tested and closed.

### Wave 2 — Identity / deletion / recovery / session (P1)
- **Findings:** A-04 (+FI-09, SN-13 — B5); A-01, A-02, A-03 (+U-01, FS-10 — B11). **Decisions:** AM-13 (verify then lock App Check).
- **Files:** `functions/src/deleteAccount.ts` (orchestration + resume marker), `mfaRecovery.ts`, `sessionManagement.ts`, `authEvents.ts`, Storage sweep, claims TTL job.
- **Tests:** deletion erasure-contract suite; recovery race; revoke-revokes; credential-change revocation. **Deploy:** functions-only. **Rollback:** resume-marker design is forward-compatible.
- **DoD:** erasure contract documented + tested; U-01 answered; no unrevoked-session path on credential events.

### Wave 3 — Financial integrity (P1/P2)
- **Findings:** B6 (FI-01, FI-02, FI-03, FI-18, FI-04, FI-08); B7 (FI-05, FI-06, FI-07); B9 (FI-10 + FS-05, FI-14/FS-06, FI-13); FI-11, FI-12; FS-02 execution (AM-2), FS-03 (AM-1), FS-07/FS-10/FS-12.
- **PRs:** (3a) webhook + sync; (3b) balance mutations; (3c) shared-finance surface + family permission convergence. **Precondition:** UH-01/UH-02 verification informs 3a. **Deploy:** functions + rules (shares branch) + client. **Tests:** §12 finance rows + fixture-based webhook contract test.
- **DoD:** INV-4/5/6 suites green; skipped finance tests restored.

### Wave 4 — Commitment / time / notification correctness (P2)
- **Findings:** B4 (C-01, C-02, C-03, C-04, C-07, C-09, C-10, F-02); B3 (C-05, SN-04, FB-06, FB-16, SN-11 — AM-7/AM-9); C-06 (+FB-04); B13 (FB-05, FB-15); B12 (SN-02, SN-05, SN-07/FS-08, SN-09, SN-12).
- **PRs:** (4a) commitment toggle/offline/rules clamp; (4b) timezone policy + reminder channel authority; (4c) notification content/preferences + weekly report. **Migrations:** `profile.timezone` backfill; preference dead-field removal. **Deploy:** functions + rules + client.
- **DoD:** INV-7/9/10 suites green; BUG-023 closed as invariant; TZ matrix test in CI.

### Wave 5 — Fabric / product consistency (P2)
- **Findings:** B8 (FB-01, FB-02, FB-03); FB-08, FB-09, FB-10, FB-11, FB-12, FB-17, FB-13.
- **Files:** `FabricService.ts` (user-keyed reset), learning-event pipeline, `clearFabricData`, rules allowlists. **DoD:** INV-11 suite green; clear-data covers all Fabric data.

### Wave 6 — Cleanup / typing / CI / dependency hardening (P3)
- **Findings:** R-01..R-12 (B10), F-01, F-04, F-05, F-07 completion, A-05/06/07/08, C-08, C-11, FB-14, SN-15/16, FI-15/16 + FI-17 execution, S-03 check, dependency plan (§7), stale CI (R-05), knip re-scope (R-12), orphan-callable retirement (AM-12).
- **PRs:** several small ones — deletions; typing batches; dependency upgrades with the firebase-admin MAJOR migration as its own staged PR.
- **DoD:** knip honest repo-wide; `@ts-nocheck` at Tier-3-only floor; 0 reachable high product-manifest alerts; orphan surfaces retired.

## 16. Wave size / PR policy (task 16)

- **One remediation branch per wave** (or sub-wave where a wave has 3 PR groups, e.g. Wave 3a/3b/3c); branch name `remediation/waveN-<slug>`, forked from master (post-#111); rebase onto master as it moves; **no force pushes**.
- **Expected PR size:** ≤ ~400 changed product lines excluding tests/migrations; tests may double it. Larger → split by bundle.
- **Migrations get a dedicated PR** when they touch production data at scale (FS-01 cleanup, timezone backfill) — separate review, dry-run count query first (§17), idempotent, resumable.
- **Atomicity rule:** rules + callable + client changes for one invariant land **in one PR** — partial landing creates the divergence the audit found (e.g. the C-07 clamp without the client change breaks toggles).
- **Deploy staging:** rules deploy first (staging), run the extended emulator suite against the deployed artifact, then prod; functions follow the same ladder; never deploy client + rules + functions to prod simultaneously without the smoke checklist.
- **CTO review checkpoint:** before each wave's first PR (scope sign-off) and mandatorily for Wave 1, Wave 2, and the firebase-admin MAJOR upgrade.
- **Hygiene:** no unrelated cleanup inside security fixes (cleanup lives in Wave 6 PRs only); every PR lists invariants touched (INV-x) and findings closed (register IDs).

## 17. Production data verification plan (task 17) — plan only, NOT executed

Read-only, authorized access only; aggregate counts preferred over document dumps; no PII in tickets/logs; record query + date + result hash in the audit folder.

| # | Question | Data required | Read-only method | Precautions | Decision impact |
|---|---|---|---|---|---|
| V1 | Prevalence of stale `scope:'family'` on disconnected pairs | `family_connections` where status ≠ active | count query | aggregate only | Sizes FS-01 cleanup migration (AM-3) |
| V2 | Legacy `shares` entries in the wild | accounts with non-empty `shares` | count + field-shape sample (no values) | aggregate | AM-2 rules-branch removal timing |
| V3 | Stale `accountShares` row indexes | finance rows with `accountShares` under disconnected grants | collectionGroup count | aggregate | FS-01b migration size |
| V4 | Multi-active family connections (UH-F04) | owners with >1 active connection | count | aggregate | AM-1 guard + user comms |
| V5 | Ownerless accounts (UH-04) | accounts missing `ownerId` | count | aggregate | FI-10 ownerless-branch exploitability |
| V6 | Mono volume / page truncation (UH-02) | imported counts vs provider totals per connection | reconcile counts | none | FI-03 remediation urgency |
| V7 | Webhook signature real-world behavior (UH-01) | signature-failure metric / captured replay in staging | metrics + staging replay test | no secret material in logs | FI-02: dead vs lucky channel |
| V8 | FCM token retention (UH-SN02) | token docs age distribution | count | aggregate | SN-01 containment design |
| V9 | Malformed `notificationPreferences` prevalence (SN-09) | docs failing parser schema | dry-run parser over docs | aggregate | SN-09 hardening urgency |
| V10 | Production App Check state (UH-F06) | deployed env / enforcement config | deployment config review | none | AM-13; FS-07/FS-12/C-07 reachability |
| V11 | Security-alert email extension deployed (UH-SN03) | `mail` queue consumers / extension config | Firebase console check | none | Potentially HIGH gap; before Wave 2 |
| V12 | `fabric_settings.enabled` prevalence (UH-FB05) | count enabled | count | aggregate | FB-06/FB-17 scale |
| V13 | Corrupted streaks/completions prevalence (UH-C01) | docs where streak inconsistent with completions | heuristic scan | aggregate | Wave 4 data-repair scope |
| V14 | Functions TZ (UH-C02) / finance date format (UH-FB04) / `dashboard` population (UH-F02) | process TZ probe; date-format scan; doc existence | probes | aggregate | C-05 skew; FB-05 correctness; FS-11 rule removal |

## 18. Release readiness scorecard (task 18)

GREEN = material blockers resolved, not merely audited. This task remediates nothing, so remediation-pending domains stay RED/AMBER.

| Domain | Status | Basis |
|---|---|---|
| Architecture | AMBER | Canonical stack decided; PR #111 pending merge; 13 decisions accepted-pending-execution |
| Auth | AMBER | No takeover path proven; A-01/A-02 open; Firebase posture unverified (U-06) |
| Account lifecycle/deletion | AMBER | A-04 P1: destructive/incomplete/untested deletion |
| Sessions | RED | Revocation invariant violated (A-03, U-01; tied to the P0 SN-01 lifecycle) |
| MFA/recovery | AMBER | Replay window A-01; client-side material A-02 |
| Finance | AMBER | No unauthorized-money path; integrity debt FI-04..FI-08/11/14/18 |
| Bank integration/webhooks | RED | Channel correctness broken as shipped (FI-01/02/03 HIGH) — trust in bank data cannot be established |
| Family/sharing | **RED** | **FS-01 P0 stop condition** |
| Commitments | AMBER | C-01/C-02 HIGH streak corruption; no server authority |
| Fabric | AMBER | FB-01 cross-user contamination; FB-02/03/08 |
| Notifications/devices | **RED** | **SN-01 P0 stop condition**; SN-02/03/08/09 |
| Firestore rules | RED | Existence-only family predicate (FS-01); commitments/rules validation gap (C-07) |
| CI/build | AMBER | Gates green but narrowed (knip); stale workflows; no dependency gate |
| Dependencies | AMBER | F-09 RESOLVED/EXPLAINED; product runtime advisories open (moderate); tooling manifests hold all highs |
| Dead code/reachability | AMBER | Mapped & classified (R-*); orphan deployed surfaces live until Wave 6 |
| Type safety | AMBER | 205 production files suppressed; Tier-1 program attached to waves |
| Test coverage | AMBER | Broad estate but high-risk E2E skipped (F-03); remediation-proving tests missing (§12) |

## 19. Final audit verdict (task 19)

1. **Is AnchorOS currently production-ready?** **NO.**
2. **What specifically prevents it?** Two P0 stop conditions — FS-01 (rules-authoritative family data survives revocation) and SN-01 (User A's notifications render while User B uses the device) — plus a session-revocation invariant not enforced anywhere (A-03/U-01), an untrustworthy bank-integration channel (FI-01/02/03), persistent commitment-streak corruption (C-01/C-02), a destructive/incomplete account-deletion contract (A-04), and cross-user Fabric contamination (FB-01).
3. **Smallest defensible path to production-ready:** Wave 0 → Wave 1 (both P0 bundles) → Wave 2 (deletion/session/recovery) → the finance webhook/sync bundle (Wave 3a: FI-01/02/03/18) — the **production gate**. Everything else can follow.
4. **Can safely wait until after that point:** Waves 4–6 in full (commitment/time/notification correctness, Fabric consistency, cleanup/typing/dependencies) and all P3 items.
5. **Known risks requiring production-data verification:** §17 V1–V14 — highest information value: UH-F01 (family grant prevalence), UH-01 (webhook signature behavior), UH-SN03 (security-alert email delivery — potentially HIGH), App Check state (UH-F06).
6. **Major unknown subsystems remaining?** **NO.** All production surfaces were mapped and audited across reports 00–11; every capability row in report 01 resolved to a domain pass or a reachability verdict.
7. **Is further broad audit discovery justified?** **NO.** The corpus is complete and internally reconciled; remaining unknowns are the targeted verification items in §17 — data queries, not audits. New discovery is justified only for net-new product surfaces after remediation begins.

---

*End of 12-FINAL-SYNTHESIS-REMEDIATION-PLAN.md — AUDIT DISCOVERY PHASE: COMPLETE.*











