# MASTER FINDING REGISTER — AnchorOS Whole-Product Audit 2026-09

Date: 2026-09-09 · Branch: `audit/whole-product-2026-09` · Head: `f7a535f4ca68cf77c25e183073977d30c93aa5af`
Status: CANONICAL. This file is the single authoritative register of every confirmed finding from reports 00–11. Provenance is preserved; nothing was dropped. Detailed synthesis, dedup rationale, severity changes, stop conditions, blockers, waves: see `12-FINAL-SYNTHESIS-REMEDIATION-PLAN.md`.

## Counts

| Metric | Value |
|---|---|
| Raw confirmed findings collected | **105** (92 numbered domain findings + 13 reachability entries) |
| Cross-domain dedup reclassifications | 15 (14 numbered + 1 reachability) → `DUP`/`CHILD` |
| Canonical root findings | **89** |
| Closed without remediation | 1 (F-06 — resolved by report 11) |
| Pending approved retirement (PR #111) | 1 (F-08) |
| Open root findings | **87** |
| CRITICAL | 0 · **HIGH** 8 · **MEDIUM** 32 · **LOW** 33 · **INFO** 14 |
| Release blockers (P0) | 2 (FS-01, SN-01) |
| Unverified high-information items (UH/U) | 34 (+2 baseline suspicions resolved, 1 open: S-03) |

## Code legend (applies to every row)

**Norm (normalized severity):** CRITICAL / HIGH / MEDIUM / LOW / INFO — per the product-wide scale in report 12 §4.
**Conf:** HIGH / MED / LOW.
**Cat:** SEC security · PRIV privacy · INT data/financial integrity · CORR product correctness · CTRL control ineffective or claim-vs-reality · OPS operational/maintainability · VER verification/test gap · DEP dependency.
**Rel (dedup relation):** ROOT canonical defect · CHILD consequence/impact of a root (not counted twice) · DUP same defect independently rediscovered · RBD related-but-distinct (shares architecture, own remediation) · CLOSED resolved without remediation · RETIRED resolved by PR #111 on merge.
**INV (violated invariant):** IDN identity · REV revocation · SES session · FIN finance · WH webhooks · FAM family · COM commitments · OFF offline · TIME time · NOTIF notifications · FAB fabric · DEL deletion · TYPE type safety · — n/a.
**Impact:** X1 cross-user sensitive-data exposure · X2 cross-user write/state contamination · X3 own-account state corruption · X4 data loss · X5 erasure residue/over-retention · X6 privacy hardening · X7 security/quality control ineffective · X8 misleading output/UX · X9 operational/scale · X10 attack-surface enlargement.
**Prereq (failure/exploit prerequisites):** Q0 none (normal use) · Q1 shared/multi-device · Q2 race/timing window · Q3 stale cache/offline · Q4 legacy/data-dependent state · Q5 dev/staging only · Q6 external-provider behavior · Q7 secret knowledge required · Q8 partial failure mid-operation.
**Reach:** LIVE proven live code path · LIVE* live, production prevalence unverified · SURF deployed callable surface without product caller · DEAD unreachable · RETIRED-PENDING disappears with PR #111.
**Tests:** NONE · PARTIAL · MASKED (test exists but skipped) · SHAPE (shape-only).
**Repro / DynV:** PROVEN = statically proven from code · DATA = code-proven, manifestation depends on production data · DYN = requires dynamic/device verification (UH ref given).
**Bundle:** B1 family revocation · B2 device/token lifecycle · B3 time policy · B4 commitment idempotency · B5 account deletion · B6 finance ingestion · B7 balance-mutation correctness · B8 fabric isolation/learning · B9 shared-finance permission surface · B10 dead-code/security-surface · B11 session semantics · B12 notification content/preferences · B13 weekly-report authority · — none.
**Wave:** W0 architecture stabilization · W1 security stop conditions · W2 identity/deletion/session · W3 financial integrity · W4 commitments/time/notifications · W5 Fabric/product consistency · W6 cleanup/typing/CI/deps.

## Register — Baseline F-* (Phase 0/1, `FINDINGS.md` / 03-STATIC-INTEGRITY)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F-01 | UI capability stubs presented as controls ("coming soon" toasts) | Phase 0/1 | P3 | LOW | HIGH | CORR | Commitments/Finance UI | ROOT | — | X8 · Q0 · individual controls | LIVE | PARTIAL | PROVEN / NO | — | W6·B10 | No user-reachable control resolves only to a "coming soon" toast |
| F-02 | Optimistic updates not implemented (BUG-023); skipped unit tests | Phase 0/1 | P2 | MEDIUM | HIGH | CORR | Commitments/Finance | **DUP→C-01/C-02** | COM | X3 · Q0 · all toggle paths | LIVE | MASKED | PROVEN / NO | C-01,C-02 | W4·B4 | BUG-023 resolved as invariant (C-01/C-02); skipped tests restored & passing |
| F-03 | High-risk E2E suites hard-skipped (family/finance/auth/MFA) | Phase 0/1 | P2 | INFO | HIGH | VER | CI/test estate | ROOT | — | X7 · Q0 · highest-risk journeys unverified | LIVE | MASKED | PROVEN / with fixtures | W1..W4 | W1·B1 | Fixture infra exists; skipped suites un-skipped and green in CI |
| F-04 | Placeholder analytics id in dev/staging service worker | Phase 0/1 | P3 | LOW | HIGH | CORR | PWA | ROOT | — | X8 · Q0 · non-prod SW | LIVE | NONE | PROVEN / NO | — | W6 | Real measurement ids in non-prod SW or field removed |
| F-05 | Minimal offline capability (SW caches only shell) | Phase 0/1 | P3 | LOW | MED | CORR | PWA/offline | ROOT | OFF | X8 · Q3 · offline UX | LIVE | NONE | PROVEN / DYN (device install) | — | W6 | Documented offline contract or implemented runtime caching |
| F-06 | Knip green narrower than repository (test-entry masking + ignored areas) | Phase 0/1 | P3 | INFO | HIGH | VER | Tooling | **CLOSED** (report 11) | — | X7 · Q0 · dead-code signal | LIVE | PARTIAL | PROVEN / NO | R-01,R-12 | W6·B10 | Knip re-scoped post-cleanup; repo-wide claim honest |
| F-07 | 205 production files under `@ts-nocheck` (67 finance, 28 auth) | Phase 0/1 | P2 | LOW | HIGH | TYPE | Whole app | ROOT | TYPE | X7 · Q0 · unchecked security/finance boundaries | LIVE | — | PROVEN / NO | all waves | W2..W6 | Tier-1 suppression removed with wave PRs; count tracked per wave |
| F-08 | Duplicate parallel mobile implementations (Capacitor + SwiftUI) | Phase 0/1 | P2 | LOW | HIGH | CORR | Native/mobile | **RETIRED-PENDING (PR #111)** | — | X8 · Q0 · parity drift | RETIRED-PENDING | NONE | PROVEN / NO | R-13 | W0 | PR #111 merged; `apps/ios-native`, `.swift-version`, `ios-native.yml` gone |
| F-09 | Dependency advisory discrepancy: local 19–20 moderate vs GitHub 67 (20 high) | Phase 0/1 | P2 | MEDIUM | HIGH (local) / EXPLAINED (GitHub) | DEP | Dependencies | ROOT | TYPE | X10 · Q6/Q5 · product manifests carry 0 high; tooling manifests carry 64/67 | LIVE | PARTIAL | PROVEN / NO | — | W6·B10 | Reconciliation table accepted; product-manifest advisories triaged (report 12 §7) |

## Register — Auth / Account Lifecycle / Security A-* (report 05)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A-01 | MFA recovery-code replay window; non-atomic consume (read-modify-write) | 05 §11 | MEDIUM | MEDIUM | HIGH | SEC | MFA recovery | ROOT | SES | X1(MFA reset) · Q2 · one account whose email+code known | LIVE | PARTIAL (race untested) | PROVEN / NO | B11 | W2·B11 | Transactional consume; concurrent reuse impossible (emulator test) |
| A-02 | Recovery codes generated/hashed/persisted client-side; save failure swallowed | 05 §11 | MEDIUM | MEDIUM | HIGH | SEC | MFA recovery | ROOT | SES | X7 · Q8 · single account; user shown non-working codes | LIVE | NONE | PROVEN / NO | A-01 | W2·B11 | Server-side generation+hash+persist; save failure blocks enrollment |
| A-03 | Session "Revoke" deletes an audit record only — does not revoke tokens | 05 §11 | MEDIUM | MEDIUM | HIGH | SEC | Sessions | ROOT | SES,REV | X7 · Q1 · one device keeps access | LIVE | PARTIAL | PROVEN / NO | U-01,B11 | W2·B11 | Revoke ⇒ `revokeRefreshTokens`; regression test proves device cut off |
| A-04 | deleteAccount non-transactional, destructive ordering, incomplete erasure, zero tests | 05 §11 | HIGH | HIGH | HIGH | SEC,PRIV | Account deletion | ROOT | DEL,REV | X4/X5 · Q8 · full account + family + provider residue | LIVE | NONE | PROVEN / PARTLY DYN (U-04) | FI-09,SN-13 | W2·B5 | Idempotent orchestrated deletion; erasure contract test suite (tree/Storage/Mono/tokens) green |
| A-05 | Welcome-email write denied by rules; error swallowed | 05 §11 | LOW | LOW | HIGH | CORR | Auth/onboarding | ROOT | — | X8 · Q0 · per signup | LIVE | NONE | PROVEN / NO | SN-14 | W3 | Email routed via server path or control removed |
| A-06 | Auth-event record trusts client-declared method/user-agent | 05 §11 | LOW | LOW | HIGH | SEC | Auth events | ROOT | SES | X7 · Q0 · own session history/alerts | LIVE | NONE | PROVEN / NO | — | W6 | Method derived server-side from provider data |
| A-07 | Client-side login lockout trivially bypassable | 05 §11 | LOW | LOW | HIGH | SEC | Auth | ROOT | SES | X7 · Q7 · single account | LIVE | PARTIAL | PROVEN / NO | U-06 | W6 | Real protection documented + Firebase anti-abuse verified (U-06) |
| A-08 | Device attestation is a stub (`trusted:true`) and client side is unreachable | 05 §11 + 11 §6 | INFO→LOW | INFO | HIGH | CTRL | Devices/attestation | ROOT | — | X7 · Q0 · claimed SEC-006 control | DEAD (client) / LIVE (callable) | PARTIAL | PROVEN / NO | SN-10,R-02 | W6·B10 | Control implemented for a real consumer or claim withdrawn + dead client service deleted |

## Register — Finance / Financial Integrity FI-* (report 06)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FI-01 | Webhook replay cache marks events processed before handling → legitimate Mono retries lost | 06 §17 | HIGH | HIGH | HIGH | INT | Mono webhook | ROOT | WH | X3 · Q6/Q8 · webhook-driven refresh per connection | LIVE | NONE | PROVEN / NO | FI-02,B6 | W3·B6 | Mark-on-completion semantics; retry-after-handler-failure converges (contract test) |
| FI-02 | Webhook HMAC over re-serialized JSON instead of `req.rawBody` | 06 §17 | HIGH | HIGH | HIGH (code) / impact DYN (UH-01) | INT,WH | Mono webhook | ROOT | WH | X7(channel loss) · Q6 · whole real-time channel | LIVE | NONE | PROVEN / DYN (UH-01) | FI-01,B6 | W3·B6 | HMAC over raw bytes; fixture replay test; signature-failure metric |
| FI-03 | Mono sync has no pagination/cursor/checkpoint — page-2+ transactions never imported | 06 §17 | HIGH | HIGH | HIGH | INT | Mono sync | ROOT | FIN | X3 · Q6 · any account exceeding one page | LIVE | NONE | PROVEN / DYN (UH-02) | FI-08,B6 | W3·B6 | Cursor/paging-follow; total-vs-imported alert; backfill test |
| FI-04 | Linked-account balance overwrite races other balance writers (blind update) | 06 §17 | MEDIUM | MEDIUM | HIGH | INT | Bank sync | ROOT | FIN | X3 · Q2 · linked accounts w/ concurrent writers | LIVE | NONE | PROVEN / NO | B6 | W3·B6 | Non-destructive delta application or serialized sync; concurrency test |
| FI-05 | Delete reverses balance from client-memory snapshot, not persisted doc | 06 §17 | MEDIUM | MEDIUM | HIGH | INT | Transactions | ROOT | FIN | X3 · Q3 · per stale-cache delete | LIVE | MASKED | PROVEN / NO | B7 | W3·B7 | Reversal from persisted doc inside transaction; un-skipped test proves |
| FI-06 | Offline queue at-least-once with no idempotency key → duplicates/double deltas | 06 §17 | MEDIUM | MEDIUM | HIGH | INT,OFF | Finance offline | ROOT | OFF,FIN | X3 · Q3 · flaky-network flushes | LIVE | NONE | PROVEN / DYN (UH-FB02) | C-02,B7 | W3·B7 | Per-payload `requestId` enforced unique; timeout-retry test |
| FI-07 | Update applies balance correction to caller-supplied `accountId` without verifying tx's own account | 06 §17 | MEDIUM | MEDIUM | HIGH | INT | Transactions | ROOT | FIN | X3 · Q3 · two accounts drift | LIVE | NONE | PROVEN / NO | B7 | W3·B7 | Correction derived from tx doc's `accountId`; mismatch rejected |
| FI-08 | Imported transactions never corrected/removed after import | 06 §17 | MEDIUM | MEDIUM | HIGH | INT | Bank sync | ROOT | FIN | X3 · Q6 · all synced history | LIVE | NONE | PROVEN / NO | FI-03,B6 | W3·B6 | Upsert-by-`externalTransactionId`; provider-deletion policy |
| FI-09 | deleteMyAccount never revokes Mono connection — provider-side access survives deletion | 06 §17 | MEDIUM | MEDIUM | HIGH | PRIV | Deletion×bank | **CHILD→A-04** | DEL | X5 · Q8 · per deleted user | LIVE | NONE | PROVEN / NO | A-04,B5 | W2·B5 | Best-effort provider unlink enumerated in deletion flow |
| FI-10 | Shared-transaction callable trusts client `accountOwnerId`, ownerless-account bypass, no amount validation | 06 §17 | MEDIUM | MEDIUM | HIGH | INT,SEC | Shared finance | ROOT | FAM,FIN | X3/X1 · Q4 (ownerless docs) · shared accounts | LIVE (SURF) | NONE | PROVEN / DYN (UH-04) | FS-05,R-03,B9 | W3·B9 | Server-resolved owner + rules-equivalent validation + transactional writes |
| FI-11 | ARCH-022 ledger not tamper-evident, fire-and-forget, client-fabricable | 06 §17 | MEDIUM | MEDIUM | HIGH | CTRL | Ledger | ROOT | FIN | X7 · Q0 · forensic value of ledger | LIVE | SHAPE | PROVEN / NO | — | W3 | Ledger re-scoped honestly or server-side HMAC'd in-transaction |
| FI-12 | Cash-flow derivations currency-blind; count both transfer legs | 06 §17 | LOW | LOW | HIGH | CORR | Insights | ROOT | FIN | X8 · Q0 · multi-currency/transfer users | LIVE | PARTIAL | PROVEN / NO | B13 | W3 | Per-currency cash-flow; transfer legs excluded; unit test |
| FI-13 | `restoreSoftDeletedTransaction` unguarded client-supplied amount/type; dead code | 06 §17 | LOW | LOW | HIGH | INT | Transactions | ROOT | FIN | X3-if-revived · Q0 · none today | DEAD | NONE | PROVEN / NO | B10 | W6·B10 | Deleted (or re-implemented with persisted-state guard) |
| FI-14 | Conversion rows schema-inconsistent, forced `scope:'family'` → family-readable personal data | 06 §17 | LOW | MEDIUM | HIGH | PRIV,INT | Conversions | ROOT | FAM,FIN | X1 · Q1 · household + ex-members (via FS-01) | LIVE | NONE | PROVEN / NO | FS-06,B9 | W3·B9 | Rows scoped per source account; schema aligned; family-read test |
| FI-15 | Rules permit standalone transfer docs and zero-amount transactions | 06 §17 | INFO | INFO | HIGH | INT | Firestore rules | ROOT | FIN | X8 · Q0 · ledger hygiene | LIVE | NONE | PROVEN / NO | C-07 | W4 | Rules require transfer linkage + amount > 0 |
| FI-16 | Net-worth total is dominant-currency only; liabilities unmodeled | 06 §17 | INFO | INFO | HIGH | CORR | Insights | ROOT | FIN | X8 · Q0 · mixed-currency users | LIVE | PARTIAL | PROVEN / NO | — | W6 | Documented limitation or per-currency totals |
| FI-17 | App Check enforcement env-overridable; webhook intentionally App-Check-free | 06 §17 + 05 U-02 | INFO | INFO | HIGH | CTRL | Functions/App Check | ROOT | TYPE | X10 · Q5 · all callables | LIVE | PARTIAL | PROVEN / DYN (UH-F06) | — | W2/W6 | Prod enforcement verified and locked; override removed or dev-only |
| FI-18 | Sync dedupe check-then-write — concurrent syncs double-import | 06 §17 | MEDIUM | MEDIUM | HIGH | INT | Bank sync | ROOT | FIN | X3 · Q2 · manual sync during scheduled run | LIVE | NONE | PROVEN / NO | FI-03,B6 | W3·B6 | Per-connection lease or deterministic import doc IDs; concurrency test |

## Register — Family / Shared Data Isolation FS-* (report 07)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FS-01 | Disconnected ex-member retains rules-authoritative read of family-scoped accounts/finance/commitments/dashboard (**STOP CONDITION**) | 07 §19 | HIGH | HIGH | HIGH | SEC,PRIV | Family sharing | ROOT | FAM,REV | X1 · Q0 (disconnect alone) · every family-scoped resource per pair, indefinite | LIVE | CONTRADICTED (blind spot) | PROVEN / DYN (UH-F01 prevalence) | FS-01b,FS-04 | W1·B1 | Post-disconnect emulator suite denies ex-member read of scope/index/dashboard/commitments branches |
| FS-01b | Per-row `accountShares` snapshots never cleaned — stale read index survives revocation | 07 §19 | HIGH | HIGH | HIGH | SEC,PRIV | Family sharing | **CHILD→FS-01** | FAM,REV | X1 · Q0 · historical finance rows | LIVE | NONE | PROVEN / DYN (UH-F01) | FS-01,B1 | W1·B1 | Disconnect/unshare strips row indexes (or mirror rule removed); indexed-row denial test |
| FS-02 | Legacy `shares` channel live in rules/client, revocable by no server path | 07 §19 | MEDIUM | MEDIUM | HIGH | SEC | Permissions model | ROOT | FAM,REV | X1 · Q4 (legacy docs) · survives every revocation | LIVE* | NONE | PROVEN / DYN (UH-F01) | B1,B9 | W3·B1 | `sharedWith` single authority; legacy entries migrated/neutralized; revocation-complete test |
| FS-03 | `confirmConnection` lacks active-connection guard → dual active households | 07 §19 | MEDIUM | MEDIUM | HIGH | SEC | Family lifecycle | ROOT | FAM | X1 · Q2 · owner's scope-family surface to 2nd member | LIVE | NONE | PROVEN / DYN (UH-F04) | B1 | W3·B1 | Single-active-connection enforced at confirm+accept; test |
| FS-04 | Share/unshare and disconnect non-transactional → orphaned grants | 07 §19 | MEDIUM | MEDIUM | HIGH | SEC | Family lifecycle | ROOT | FAM,REV | X1 · Q2/Q8 · orphaned grants, unrecoverable by user | LIVE | NONE | PROVEN / NO | FS-01,B1 | W1·B1 | Transactional disconnect/share; idempotent/resumable; partial-failure test |
| FS-05 | FI-10 deepened: presence-not-permission, ignores connection state, invalid unindexed rows, non-transactional | 07 §19 | MEDIUM | MEDIUM | HIGH | INT,SEC | Shared finance | **DUP→FI-10** | FAM,FIN | X3 · Q0 (genuine grant) · shared accounts | LIVE | NONE | PROVEN / NO | FI-10,B9 | W3·B9 | Same acceptance as FI-10 (single remediation) |
| FS-06 | FI-14 deepened: conversion rows family-readable incl. post-disconnect; schema incomplete | 07 §19 | LOW→MEDIUM | MEDIUM | HIGH | PRIV | Conversions | **DUP→FI-14** | FAM,FIN | X1 · Q1 · personal conversion data | LIVE | NONE | PROVEN / NO | FI-14,B9 | W3·B9 | Same acceptance as FI-14 (single remediation) |
| FS-07 | `validateInvitationToken` unauthenticated despite registry claiming `auth:'required'` | 07 §19 | LOW | LOW | HIGH | SEC | Invitations | ROOT | IDN | X10 (oracle) · Q5/Q6 · invite status + owner name | LIVE | NONE | PROVEN / DYN (UH-F06) | — | W3 | Auth required (or documented pre-auth contract) + registry aligned |
| FS-08 | Shared-activity attribution client-authored; notifications misattribute actor | 07 §19 | LOW | LOW | HIGH | INT | Activity/notifications | ROOT | FAM | X7 · Q0 · audit-looking trail | LIVE | NONE | PROVEN / NO | SN-07,B12 | W4·B12 | Actor derived from `request.auth`/trigger data |
| FS-09 | Dev-tools family writers drift the data model (inert role key, rules-impossible auto-accept) | 07 §19 | LOW | LOW | HIGH | CORR | Dev tools | ROOT | — | X7 · Q5 · dev/staging data | LIVE (dev-gated) | NONE | PROVEN / NO | — | W6 | Simulation routed through real callables; auto-accept path deleted |
| FS-10 | Owner confirmation re-auth client-side only; `confirmConnection` ignores password field | 07 §19 | LOW | LOW | HIGH | SEC | Family lifecycle | ROOT | SES | X7 · Q1 (hijacked session) · durable privilege grant | LIVE | NONE | PROVEN / NO | U-01,B11 | W2·B11 | Server-side `auth_time` freshness enforced |
| FS-11 | `dashboard` subtree family-readable on existence; no writer located | 07 §19 | INFO | INFO | MED | SEC | Rules surface | ROOT | FAM | X1-if-populated · Q4 · partner dashboard docs | LIVE* | NONE | PROVEN / DYN (UH-F02) | FS-01,B1 | W1/W3 | Collection verified dead → rule branch removed, or scoped |
| FS-12 | Invitation secret transits inviter's client; third parties can lock invites | 07 §19 | LOW | LOW | HIGH | SEC | Invitations | ROOT | — | X10 · Q7/Q0 · denial-of-join | LIVE | NONE | PROVEN / NO | — | W3 | Code not returned to client; attempt counters keyed by caller |

## Register — Commitments / Task State C-* (report 08)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C-01 | Toggle not idempotent; streak double-increments per cycle (client-argued direction) | 08 §21 | HIGH | HIGH | HIGH | INT | Commitments | ROOT | COM | X3 · Q2/Q3 · all users, all types | LIVE | NONE | PROVEN / DYN (UH-C01) | C-02,F-02,B4 | W4·B4 | One completion/streak increment per cycle under duplicate/replay/concurrency (transaction test) |
| C-02 | Offline queue replays stale transitions; no idempotency/TTL/cap/cross-user cleanup | 08 §21 | HIGH | HIGH | HIGH | INT,OFF | Commitments offline | ROOT | OFF,COM | X3 · Q1/Q3 · offline + shared-device users | LIVE | PARTIAL (flush only) | PROVEN / DYN (UH-C03) | C-01,B4 | W4·B4 | Desired-state/op-log queue with applied markers, TTL, clear-on-logout, cross-tab claim; replay math test |
| C-03 | Stale-poll overwrites optimistic UI; rollback leaves wrong state; onSnapshot comment false | 08 §21 | MEDIUM | MEDIUM | HIGH | CORR | Commitments UI | ROOT | COM | X8 · Q2 · BUG-023 symptom persists | LIVE | MASKED | PROVEN / DYN (UH-C05) | C-01,B4 | W4·B4 | Listener or functional rollback; optimistic tests un-skipped |
| C-04 | Reset client-clock, blind, racy; can erase completion; month ignores year; time-threshold streak break | 08 §21 | MEDIUM | MEDIUM | HIGH | CORR | Recurrence | ROOT | COM,TIME | X4/X3 · Q2/Q3 · completions & streaks | LIVE | PARTIAL | PROVEN / NO | B4 | W4·B4 | Cycle-anchored reset (server or conditional update); year-aware; race test |
| C-05 | Server reminder scheduler evaluates user-local `reminderTime` against UTC | 08 §21 | MEDIUM | MEDIUM | HIGH | CORR | Reminders | ROOT | TIME,NOTIF | X8 · Q0 · all non-UTC users | LIVE | PARTIAL (TZ untested) | PROVEN / DYN (UH-C02) | SN-04,SN-11,FB-06,FB-16,B3 | W4·B3 | Per-user IANA tz used by scheduler; day-gate; TZ matrix test |
| C-06 | `daysOfWeek` format split — weekly tasks invisible to briefing/badge | 08 §21 | MEDIUM | MEDIUM | HIGH | CORR | Commitments/Fabric | ROOT | COM | X8 · Q0 · weekly-task users | LIVE | NONE | PROVEN / NO | FB-04,B4 | W4·B4 | Canonical day representation; producer/consumer bridge test |
| C-07 | Rules validate almost nothing (category/type/streaks/timestamps/arbitrary fields, unbounded title) | 08 §21 | MEDIUM | MEDIUM | HIGH | SEC,INT | Firestore rules | ROOT | COM,TYPE | X3/X1 (widen sharing) · Q0 · owner-writable surface | LIVE | NONE (0 rules tests) | PROVEN / DYN (UH-C06) | FI-15 | W4·B4 | Field allowlist + per-field validation; rules suite green; client stops writing protected fields in same PR |
| C-08 | Audit events decoupled from outcomes; edits/resets unaudited | 08 §21 | LOW | LOW | HIGH | OPS | Audit | ROOT | — | X7 · Q0 · trail completeness | LIVE | NONE | PROVEN / NO | — | W6 | Emit-after-success only; edits/resets audited |
| C-09 | Todo/recurring conflation — one-time tasks accrue streaks; "days" mislabeled | 08 §21 | LOW | LOW | HIGH | CORR | Commitments | ROOT | COM | X8 · Q0 · todo/monthly users | LIVE | NONE | PROVEN / NO | B4 | W4 | Type gate in toggle; per-type streak units |
| C-10 | Unbounded title accepted end-to-end | 08 §21 | LOW | LOW | HIGH | INT | Commitments | ROOT | TYPE | X9 · Q0 · storage hygiene | LIVE | NONE | PROVEN / NO | C-07 | W4·B4 | Rule-level size cap |
| C-11 | List fetch silently truncates at 100 commitments | 08 §21 | LOW | LOW | HIGH | CORR | Commitments | ROOT | — | X8 · Q0 · heavy users | LIVE | NONE | PROVEN / NO | — | W6 | Pagination or surfaced truncation |

## Register — Fabric / Anchor AI FB-* (report 09)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FB-01 | Singleton `FabricService` persists User A's patterns into User B's `fabric_behavior` | 09 §31 | MEDIUM | MEDIUM | HIGH | PRIV,SEC | Fabric service | ROOT | FAB,IDN | X2 · Q1 (user switch) · per-user learned state | LIVE | NONE (service-level) | PROVEN / DYN (UH-FB01) | B8 | W5·B8 | State reset/keyed per UID before any write; service-level switch test |
| FB-02 | Fabric learns events that never committed (offline queue, optimistic toggles), no event identity | 09 §31 | MEDIUM | MEDIUM | HIGH | INT | Fabric learning | ROOT | FAB,OFF | X3 (pattern bias) · Q3 · predictions | LIVE | NONE | PROVEN / DYN (UH-FB02) | C-01,C-02,FI-06,B8 | W5·B8 | Learning only on authoritative commit w/ event-id dedupe |
| FB-03 | Deletion/reversal permanently reinforces learned patterns | 09 §31 | LOW | LOW | HIGH | INT | Fabric learning | ROOT | FAB | X3 · Q0 · pattern quality | LIVE | NONE | PROVEN / NO | B8 | W5·B8 | Compensation events on delete; decay/rebuild |
| FB-04 | Weekly commitments invisible to briefing + badge (C-06 in Fabric consumers) | 09 §31 | MEDIUM | MEDIUM | HIGH | CORR | Fabric consumers | **DUP→C-06** | COM | X8 · Q0 · weekly-task users | LIVE | NONE | PROVEN / NO | C-06 | W4·B4 | Same acceptance as C-06 (single remediation) |
| FB-05 | Server weekly report integrity defects (all-time labeled weekly, ₦ hardcoded, idempotency-before-send, wrong week key/window) | 09 §31 | MEDIUM | MEDIUM | HIGH | CORR | Weekly report | ROOT | FIN,NOTIF | X8 · Q0 · all push users | LIVE | NONE | PROVEN / NO | FB-15,B13 | W4·B13 | Week-scoped query, currency-aware format, send-then-persist, canonical week key |
| FB-06 | Fabric nudges hardcode Africa/Lagos; budget compares partial month to full month | 09 §31 | MEDIUM | MEDIUM | HIGH | CORR | Fabric nudges | **DUP→C-05** (clock part); budget-math defect folded here | TIME,FIN | X8 · Q0 · all non-Lagos users | LIVE | NONE | PROVEN / NO | C-05,B3 | W4·B3 | Same acceptance as C-05 for clock; month-projection math for budget claim |
| FB-07 | Private data (task title, amounts) in FCM nudge/report bodies — lock-screen exposure | 09 §31 | LOW | MEDIUM | HIGH | PRIV | Notifications | ROOT | NOTIF,PRIV | X6 · Q1 · device holders | LIVE | NONE | PROVEN / DYN (UH-FB03) | SN-06,B12 | W4·B12 | Redacted/generic bodies (or hidden-content variant) across all 5 producers |
| FB-08 | "Clear data" leaves conversations, reports, mood, nudge logs | 09 §31 | MEDIUM | MEDIUM | HIGH | PRIV | Fabric data | ROOT | DEL | X5 · Q0 · user-initiated erasure | LIVE | NONE | PROVEN / NO | B8 | W5·B8 | Clear-data covers all Fabric-persisted personal data (or scope disclosed) |
| FB-09 | Dismissal doesn't prevent relearning; proactive-question dedupe session-only | 09 §31 | LOW | LOW | HIGH | CORR | Fabric | ROOT | FAB | X8 · Q0 · repeated prompts | LIVE | NONE | PROVEN / NO | B8 | W5 | Persisted dedupe; dismissal tombstones |
| FB-10 | Client-fabricable Fabric state (no rules allowlists); contained | 09 §31 | LOW | LOW | HIGH | SEC | Firestore rules | ROOT | TYPE | X7 · Q0 · advisory-only surface | LIVE | NONE | PROVEN / NO | C-07 | W5 | Field allowlists or documented trust model |
| FB-11 | Context window inconsistency: full-history init vs 500-row/1-year live sync | 09 §31 | LOW | LOW | HIGH | CORR | Fabric | ROOT | — | X8 · Q0 · long-history users | LIVE | NONE | PROVEN / DYN (UH-FB04) | — | W6 | Consistent, documented context window |
| FB-12 | Fabric self-learns on every Fabric view visit | 09 §31 | LOW | LOW | HIGH | CORR | Fabric | ROOT | FAB | X3 · Q0 · pattern pollution | LIVE | NONE | PROVEN / NO | B8 | W5 | View-visit learning removed |
| FB-13 | Persisted prediction `active` array write-only | 09 §31 | INFO | INFO | HIGH | OPS | Fabric | ROOT | — | X9 · Q0 · dead weight | LIVE | NONE | PROVEN / NO | — | W6 | Removed |
| FB-14 | Unreachable Fabric estate (monthly-review slice, SubscriptionDetector, goals, dead flag) | 09 §31 + 11 §6 | INFO | INFO | HIGH | OPS | Fabric dead code | ROOT | — | X9 · Q0 · none shipped | DEAD | MASKED (tests) | PROVEN / NO | R-01,B10 | W6·B10 | Deleted with tests; coverage baseline honest |
| FB-15 | Two divergent weekly-report schemas share `fabric_reports` | 09 §31 | LOW | LOW | HIGH | CORR | Weekly report | **DUP→FB-05** | FIN | X8 · Q0 · retention noise | LIVE | NONE | PROVEN / NO | FB-05,B13 | W4·B13 | Single schema + retention policy |
| FB-16 | Mixed clock domains: UTC fallback, device-local, Lagos-pinned | 09 §31 | LOW | LOW | HIGH | CORR | Fabric time | **DUP→C-05** | TIME | X8 · Q0 · cross-feature disagreement | LIVE | NONE | PROVEN / NO | C-05,B3 | W4·B3 | Same acceptance as C-05 |
| FB-17 | Scheduled Fabric jobs: unpaginated full-user iteration, N+1 reads, no checkpoint | 09 §31 | INFO | INFO | HIGH | OPS | Scheduled jobs | ROOT | — | X9 · Q0 · scale/cost | LIVE | NONE | PROVEN / NO | B3 | W5 | Pagination + checkpoint |

## Register — Settings / Notifications / Devices SN-* (report 10)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SN-01 | Logout/account-switch leaves FCM token registered — User A's notifications render while User B is active (**STOP CONDITION**) | 10 §35 | HIGH | HIGH | HIGH | PRIV,SEC | Devices/tokens | ROOT | NOTIF,REV | X1 · Q1 (shared device) · every push + foreground toast | LIVE | CONTRADICTED | PROVEN / DYN (UH-SN01/02/05) | SN-03,SN-08,B2 | W1·B2 | Token deregistered on logout/account-switch + delivery auth-scoped; two-account emulator/device test |
| SN-02 | "Email Notifications" toggle is the global push master switch; `.email`/`.frequency` dead | 10 §35 | MEDIUM | MEDIUM | HIGH | CORR | Preferences | ROOT | NOTIF | X8 · Q0 · all users toggling | LIVE | PARTIAL (cements bug) | PROVEN / NO | B12 | W1·B2 | Toggle semantics match labels; dead fields removed; test updated |
| SN-03 | Push toggle/UI state diverges from delivery state (three systems disagree) | 10 §35 | MEDIUM | MEDIUM | HIGH | CORR | Preferences/devices | ROOT | NOTIF | X8 · Q1 · silent non-delivery | LIVE | NONE | PROVEN / DYN (UH-SN01) | SN-01,B2 | W1·B2 | UI reflects persisted token state; per-account disable flag; state-machine test |
| SN-04 | Quiet hours/reminder matching in wrong clock domain (UTC/Lagos/device; no user tz) | 10 §35 | MEDIUM | MEDIUM | HIGH | CORR | Quiet hours | **CHILD→C-05** | TIME,NOTIF | X8 · Q0 · quiet-hour suppression itself | LIVE | NONE | PROVEN / DYN (UH-C02) | C-05,B3 | W4·B3 | Same acceptance as C-05; quiet-hours TZ matrix test |
| SN-05 | Family category toggle no-op; family in-app producers bypass preferences | 10 §35 | MEDIUM | MEDIUM | HIGH | CORR | Preferences | ROOT | NOTIF | X8 · Q0 · family users | LIVE | NONE | PROVEN / NO | B12 | W4·B12 | `createNotification` honors preferences/quiet hours; toggle consumer test |
| SN-06 | Sensitive ₦/task content in push bodies beyond FB-07 scope | 10 §35 | MEDIUM | MEDIUM | HIGH | PRIV | Notifications | **DUP→FB-07** | NOTIF,PRIV | X6 · Q1 · device holders | LIVE | NONE | PROVEN / NO | FB-07,B12 | W4·B12 | Same acceptance as FB-07 (single remediation across producers) |
| SN-07 | In-app family notifications disclose description + exact amount; owner-attribution | 10 §35 | MEDIUM | MEDIUM | HIGH | PRIV | Family notifications | ROOT | NOTIF,PRIV | X6 · Q1 · household members | LIVE | NONE | PROVEN / NO | FS-08,B12 | W4·B12 | Content minimized; correct actor attribution; preference-gated |
| SN-08 | Stale-token cleanup covers 2 error codes; unhandled permanent failures retried forever | 10 §35 | MEDIUM | MEDIUM | HIGH | OPS | Token lifecycle | ROOT | NOTIF | X9/X8 · Q6 · delivery gaps masked | LIVE | NONE | PROVEN / DYN (UH-C04) | SN-01,B2 | W1·B2 | Full error-code matrix + rotation handling; cleanup test |
| SN-09 | Unvalidated client-writable `notificationPreferences` can abort global reminders scheduler | 10 §35 | MEDIUM | MEDIUM | MED-HIGH | SEC | Preferences/rules | ROOT | NOTIF,TYPE | X9(DoS) · Q0 (self) / Q1 (third party) · all reminders | LIVE | NONE | PROVEN / DATA | C-07-class | W4·B12 | Rules validation + hardened parsing + per-user error isolation |
| SN-10 | FCM token registration accepts arbitrary token strings; bearer routing identifier | 10 §35 | LOW | LOW | HIGH | SEC | Devices | ROOT | NOTIF | X1 · Q7 (secret token knowledge) · both accounts' delivery | LIVE | NONE | PROVEN / NO | A-08,B2 | W6·B2 | Token validated at registration (shape + ownership of registration context) |
| SN-11 | Dual-channel commitment reminder with no cross-channel dedupe | 10 §35 | LOW | LOW | HIGH | CORR | Reminders | **CHILD→C-05** (channel authority decision) | NOTIF,TIME | X8 · Q0 · duplicate/skewed reminders | LIVE | NONE | PROVEN / NO | C-05,B3 | W4·B3 | Single authoritative channel or cross-channel claim dedupe |
| SN-12 | Missed-minute reminders silently dropped; partial-batch success marks all sent | 10 §35 | LOW | LOW | HIGH | CORR | Reminders | ROOT | NOTIF | X8 · Q0 · per-day reminders | LIVE | PARTIAL | PROVEN / NO | B3 | W4 | Retry window + per-token success marking |
| SN-13 | Account-deletion orphans: delivery claims, recurring rows, queued mail, in-flight window | 10 §35 | LOW | LOW | HIGH | PRIV | Deletion | **CHILD→A-04** | DEL | X5 · Q8 · per deleted user | LIVE | NONE | PROVEN / NO | A-04,B5 | W2·B5 | Claims TTL job + deletion sweep covers queues/claims |
| SN-14 | Welcome-email path dead (client writes to rules-denied `mail`) | 10 §35 | LOW | LOW | HIGH | CORR | Email | **DUP→A-05** | — | X8 · Q0 · per signup | LIVE | NONE | PROVEN / NO | A-05 | W3 | Same acceptance as A-05 (single remediation) |
| SN-15 | Payload content to console; token prefixes in Functions logs | 10 §35 | INFO | INFO | HIGH | PRIV | Logging | ROOT | — | X6 · Q0 · log access | LIVE | NONE | PROVEN / NO | — | W6 | Console payload logging removed/redacted |
## Register — Whole-Repository Reachability R-* (report 11; canonical IDs assigned at synthesis)

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | 13 orphaned production `src` modules + 13 orphaned tests (dashboard widgets, CategoryService, ExperimentService, transactionParser, useSocialSignIn, useAuthService…) | 11 §6/§16 | P3-class | INFO | HIGH | OPS | Frontend dead code | ROOT | — | X9/X7 (false feature signals, green tests for dead code) · Q0 · none shipped | DEAD | MASKED | PROVEN / NO | FB-14,B10 | W6·B10 | Deleted; knip re-scoped; coverage re-baselined |
| R-02 | Client device-attestation feature orphaned (zero callers) — deepens A-08 from "inert" to "unreachable" | 11 §6 | new | INFO | HIGH | CTRL | Devices | **CHILD→A-08** | — | X7 · Q0 · claimed control | DEAD | MASKED | PROVEN / NO | A-08,B10 | W6·B10 | Same acceptance as A-08 |
| R-03 | 10 deployed callables with no product caller (incl. `addTransactionToSharedAccount` carrying FI-10/FS-05, `migrateFamilyConnectionsV2`, `runMigration`/`rollbackMigration` admin verbs) | 11 §7/§20 | P2-class | LOW | HIGH | SEC,OPS | Functions | ROOT | IDN | X10 · Q5+auth · callable attack surface | SURF | PARTIAL | PROVEN / NO | FI-10,B10 | W6·B10 | Barrels pruned + redeploy; ops verbs operator-gated; retirements documented |
| R-04 | Registry/contract subsystem TEST_ONLY; registries can drift from real exports (proven by FS-07) | 11 §7 | new | INFO | HIGH | OPS | Functions infra | ROOT | TYPE | X7 · Q0 · contract documentation | LIVE (test-only) | PARTIAL | PROVEN / NO | FS-07 | W6 | Registry enforced in CI or documented as documentation-only |
| R-05 | Two CI workflows are template placeholders (appknox builds gitignored `android/`; mayhem references nonexistent script) | 11 §10/§23 | P3 | LOW | HIGH | OPS | CI | ROOT | — | X9 (false-red noise) · Q0 · CI signal | LIVE (CI) | — | PROVEN / NO | F-08 | W6 | Deleted or completed |
| R-06 | `stryker-setup-0.js` committed Stryker sandbox artifact at repo root | 11 §9 | P3 | LOW | HIGH | OPS | Repo hygiene | ROOT | — | X9 · Q0 · none | DEAD | — | PROVEN / NO | — | W6·B10 | Deleted |
| R-07 | `@anchor-os/types` package zero consumers (alias-only duplicate of src/types) | 11 §8/§23 | P3 | LOW | HIGH | OPS | Packages | ROOT | TYPE | X9 · Q0 · drift risk | DEAD | — | PROVEN / NO | — | W6·B10 | Package + alias removed |
| SN-16 | Native/Capacitor shells have no notification capability (restored row) | 10 §35 | INFO | INFO | HIGH | CORR | Capacitor | ROOT | NOTIF | X8 · Q0 · native users get zero reminders | LIVE | NONE | PROVEN / DYN (device) | F-08 | W6 | Documented parity gap or plugin added |
| R-08 | `public/firebase-messaging-sw.js` dead duplicate service worker (never registered; contains extra unguarded `JSON.parse`) | 11 §23 + 10 §37 | P3 | LOW | HIGH | OPS | Service worker | ROOT | — | X9/X10-if-revived · Q0 · none live | DEAD | NONE | PROVEN / NO | — | W6·B10 | Deleted; single-SW convention enforced |
| R-09 | Dead/vestigial functions & methods (`sendTemplatedEmail`, `monoClient.triggerSync`, `auditCommitments.edited`, `clearTaskQueue`/`getTaskQueueLength`, bcrypt recovery path, `normalizeInviteeEmail`, no-op `FieldEncryption` wiring) | 11 §7 + 06 §20 + 07 §21 + 10 §37 + 08 §23 | P3 | LOW | HIGH | OPS | Multiple | ROOT | — | X9/X7 (false signals) · Q0 · none | DEAD | PARTIAL | PROVEN / NO | B10 | W6·B10 | Deleted or wired; A-02 decision covers bcrypt path |
| R-10 | Dead feature flag `fabric_suggestions` (defined, no consumer) | 11 §13 | P3 | LOW | HIGH | OPS | Flags | ROOT | — | X9 · Q0 · none | DEAD | NONE | PROVEN / NO | — | W6 | Removed |
| R-11 | 9 duplicate-implementation pairs requiring architectural decisions (weekly report, bill-due, social sign-in, auth service, family migration, service worker, shares/sharedWith, reminder channels, shared types) | 11 §17 | P2-class | INFO | HIGH | OPS,VER | Architecture | ROOT | — | X9 (drift) · Q0 · both-live pairs | LIVE/DEAD mixed | — | PROVEN / NO | report 12 §11 | W0..W6 | Each decision recorded in decision register and executed in its wave |
| R-12 | Knip configuration gap (7 ignored areas + test-entry glob) — root cause of false green | 11 §3/§23 | P3 | LOW | HIGH | VER | Tooling | ROOT | — | X7 · Q0 · dead-code gate | LIVE | — | PROVEN / NO | F-06,R-01 | W6·B10 | Knip re-scoped; test-entry masking fixed; repo-wide claim honest |
| R-13 | `apps/ios-native` + `.swift-version` + `ios-native.yml` + ios scripts: legacy SwiftUI implementation tracked & CI-integrated | 11 §12/§21/§24 | new | INFO | HIGH | OPS | Mobile | **RETIRED-PENDING (PR #111)** | — | X9 · Q0 · parallel implementation | RETIRED-PENDING | — | PROVEN / NO | F-08 | W0 | PR #111 merged; tree/scripts/workflow removed; swift dependabot ecosystem removed |

## Re-audit addendum — RA-* (2026-09-17)

**Addendum, not a rewrite.** The 2026-09 corpus above is an immutable historical record (89 canonical roots, report 00–11 evidence). A post-remediation re-audit on 2026-09-17 found eight additional canonical roots that were **not** present in that corpus. They are recorded here with the same column set plus a trailing `Status` column, and were remediated immediately rather than scheduled into a wave. The historical counts above are unchanged and still describe the 2026-09 corpus.

| ID | Finding | Src | Orig | Norm | Conf | Cat | Subsystem | Rel | INV | Impact · Prereq · Blast | Reach | Tests | Repro/DynV | Deps | W·B | Acceptance | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RA-01 | Client-callable `resetRateLimit` let any authenticated user clear their own rate-limit bucket, nullifying the `checkRateLimit` client gate | re-audit 2026-09-17 | new | MEDIUM | HIGH | SEC | Functions / rate limit | ROOT | CTRL | X7 · Q0 · callable-enforced surface | LIVE (SURF) | NONE→ADDED | PROVEN / NO | R-03, AM-12 | W6·B10 | `resetRateLimit` not deployable; a client cannot clear its own block | **REMEDIATED** — PR #155 (issue #147) |
| RA-02 | `buildInvitationEmail` interpolated the user-controlled owner display name (and code/invite id) into email HTML unescaped | re-audit 2026-09-17 | new | MEDIUM | HIGH | SEC | Email / Family invitations | ROOT | — | X10 · Q0 · every invitation email | LIVE | NONE→ADDED | PROVEN / NO | R-09 | W3 | All user-derived email HTML values escaped; invite id URL-encoded | **REMEDIATED** — PR #157 (issue #146) |
| RA-03 | Anonymous passkey challenges all shared one `anon` rate-limit bucket (callable v2 often omits the socket IP); challenge not consumed on credential-not-found / verification-failure; cross-user credential resolution unaudited | re-audit 2026-09-17 | new | MEDIUM | HIGH | SEC | Auth / passkeys | ROOT | IDN, SES | X10 · Q0/Q7 · passkey availability and ceremony | LIVE | PARTIAL→ADDED | PROVEN / DYN | RA-04 | W2·B11 | Per-caller limit key; challenge single-use on every failure path; mismatch audited | **REMEDIATED** — PR #160 (issue #150) |
| RA-04 | `webhook_events` and `passkey_challenges` wrote `expiresAt` with no TTL policy; the webhook value was an ISO string (TTL ignores it); the index-catalog gate referenced a missing `docs/FIRESTORE_INDEXES.md` | re-audit 2026-09-17 | new | LOW | HIGH | OPS, PRIV | Retention / infra config | ROOT | — | X9/X5 · Q0 · unbounded collections | LIVE | NONE→GATE | PROVEN / NO | SN-13 | W6 | TTL policies present; timestamp field type correct; `check:indexes` green | **REMEDIATED** — PR #156 (issue #148) |
| RA-05 | Persisted React Query cache is device-global (`react-query-cache`, dehydrates everything but tasks/finance) and was never cleared on logout or account switch | re-audit 2026-09-17 | new | MEDIUM | HIGH | PRIV | Client cache / sessions | ROOT | SES, IDN | X1/X6 · Q1 (shared device) · cached user data | LIVE | NONE→ADDED | PROVEN / NO | C-02, SN-01 | W2·B11 | Cache cleared on every auth transition; no cross-account hydration | **REMEDIATED** — PR #161 (issue #149) |
| RA-06 | `withTimeout` cannot cancel a Firestore write, yet a timeout was surfaced as failure and the offline flush re-queued it, allowing a double-applied balance delta | re-audit 2026-09-17 | new | MEDIUM | HIGH | INT | Finance offline | ROOT | FIN, OFF | X3 · Q2/Q3 · balance mutations | LIVE | NONE→ADDED | PROVEN / NO | FI-06, FI-05 | W3·B7 | A timed-out offline write is not re-queued; uncertainty surfaced to the user | **REMEDIATED (mechanism)** — PR #158 (issue #152); server-side idempotency remains FI-06 |
| RA-07 | `getNotifications` accepted an unbounded client-supplied `limit` on an unbounded collection | re-audit 2026-09-17 | new | LOW | HIGH | SEC, OPS | Functions / notifications | ROOT | — | X9 · Q0 · per-call cost | LIVE | NONE→ADDED | PROVEN / NO | — | W6 | Limit clamped (1..100) with cursor | **REMEDIATED** — PR #154 (issue #151) |
| RA-08 | Live `public/sw.js` cached cross-origin/opaque responses unguarded, failed the whole install when one precache asset was missing, and logged FCM payloads/environment in production | re-audit 2026-09-17 | new | LOW | HIGH | CORR, OPS | PWA service worker | ROOT | OFF | X8/X10 · Q0/Q3 · every installed client | LIVE | NONE→ADDED | PROVEN / DYN | F-04, F-05, R-08 | W6 | Cacheable-only writes; resilient precache; no production payload logging | **REMEDIATED** — PR #159 (issue #153) |

## Cross-domain deduplication table (task 2 of synthesis)

| Overlap group | Canonical ROOT | Reclassified entries | Relation | Rationale |
|---|---|---|---|---|
| Account deletion erasure contract | **A-04** | FI-09, SN-13 | CHILD | Both are incomplete-erasure consequences of the same defective deletion flow; remediated in one orchestrated deletion PR |
| Family stale access after revocation | **FS-01** | FS-01b | CHILD | `accountShares` row-index residue is a component of the same revocation-completeness defect; same PR, same rules surface |
| Legacy permission channel | FS-02 (root in own right) | — | RELATED_BUT_DISTINCT to FS-01 | Same family architecture but requires its own model decision + migration; not fixable by the FS-01 rules predicate alone |
| Shared-transaction callable | **FI-10** | FS-05 | DUPLICATE | Report 07 independently deepened the same callable; one remediation |
| Conversion-row scoping | **FI-14** | FS-06 | DUPLICATE | Report 07 deepened FI-14 (raised family impact); one remediation |
| Timezone family | **C-05** | SN-04, FB-16, FB-06 (clock part), SN-11 | CHILD/DUP | One root: no per-user timezone in server jobs. SN-04 extends to quiet hours (same fix), FB-16 is the client-side expression, FB-06 is the Lagos-pinned producer (budget-math sub-defect tracked inside FB-06), SN-11 is the dual-channel consequence |
| Notification content privacy | **FB-07** | SN-06 | DUPLICATE | SN-06 confirms + extends producer list; one content-minimization remediation |
| Family in-app disclosure/attribution | SN-07 (privacy, root) + FS-08 (attribution, root) | — | RELATED_BUT_DISTINCT | Privacy content and attribution correctness are separately testable; remediated together in B12 |
| Device attestation | **A-08** | SN-10 (partial), R-02 | CHILD/RBD | Reachability proved client side unreachable (R-02 CHILD). SN-10's token-binding issue is RELATED_BUT_DISTINCT — it survives attestation removal and needs its own validation fix |
| Weekly report duplication | **FB-05** | FB-15 | DUPLICATE | Schema divergence is a facet of the weekly-report authority defect; decision B13 resolves both |
| Reminder channel duplication | C-05 (root) | SN-11 | CHILD | Dual-channel dedupe is solved by the same channel-authority decision |
| Welcome email dead path | **A-05** | SN-14 | DUPLICATE | Independently rediscovered in report 10 |
| Optimistic/BUG-023 | **C-01 + C-02** | F-02 | DUPLICATE | F-02's test gap and symptom class are subsumed by the C-01/C-02 invariant fix; test restoration is acceptance evidence |
| Day-format split | **C-06** | FB-04 | DUPLICATE | Fabric consumers confirmed the same root |
| App Check env override | **FI-17** | 05 U-02, UH-F06, UH-C06 | DUPLICATE (evidence folded) | Same root across three reports; UH items folded into the verification register |
| Knip gap | F-06 (CLOSED) + R-12 (config root) | — | — | F-06 observation closed by sweep; the configuration defect itself remains open as R-12 |
| SwiftUI parallel implementation | F-08 | R-13 | DUPLICATE | Both describe the same parallel-implementation finding; PENDING APPROVED RETIREMENT — PR #111 |

Result: 15 entries reclassified; canonical root count 89 (87 open + F-06 CLOSED + F-08 RETIRED-PENDING). No inherited impact is counted as a separate bug.

## Unverified high-information register (34 items + 1 open suspicion)

Full verification plan (method, precautions, decision impact): report 12 §18. These are NOT counted as confirmed findings.

| Ref | Question | Domain | Decision impact |
|---|---|---|---|
| U-01 | Do password change/reset revoke other-device sessions? | Auth/session | Whether Wave 2 adds `revokeRefreshTokens` on credential paths (assumed YES for planning) |
| U-02/FI-17/UH-F06/UH-C06 | Production App Check enforcement state | Platform | Reachability of FS-07 oracle, FS-12 lockout, C-07 mass assignment |
| U-03 | Rules emulator suites executed / semantic coverage | Rules | Rules confidence baseline |
| U-04 | Mono-side references after account deletion | Deletion/bank | Completes A-04 erasure contract |
| U-05 | Avatar Storage path/rules mismatch | Storage | Functional or open-path defect |
| U-06 | Firebase Auth brute-force/email-enumeration posture (recovery error oracle) | Auth | A-07 closure |
| UH-01 | Does the webhook signature ever validate in production? | Bank integration | FI-02: dead channel vs lucky channel — highest information value |
| UH-02 | Mono page size vs 6h volume | Bank integration | Quantifies FI-03 loss rate |
| UH-03 | Production secret configuration/rotation | Secrets | Ops hardening |
| UH-04 | Ownerless accounts (`ownerId` missing) in production | Finance | FI-10 ownerless-branch exploitability |
| UH-05 | Mono `data_status` handling on immature connections | Bank integration | Balance trust policy |
| UH-06 | `linkBankAccount` double-submit | Bank integration | Duplication risk |
| UH-F01 | Prevalence of `scope:'family'` / legacy `shares` / stale `accountShares` | Family | Real blast radius of FS-01/FS-01b/FS-02; migration size |
| UH-F02 | Is the `dashboard` collection populated? | Family/rules | FS-11 rule-branch removal |
| UH-F03 | Revoked-invite-overwrite window observed? | Family | Concurrency fix priority |
| UH-F04 | Multi-connection households in production | Family | FS-03 / decision AM-1 |
| UH-F05 | `getSharedAccountsWithMe` composite index availability | Family | 500s vs exposure |
| UH-C01 | Prevalence of corrupted streaks/completions | Commitments | Data-repair scope for C-01/C-02/C-04 |
| UH-C02 | Cloud Functions process timezone in production | Time | Confirms C-05 skew |
| UH-C03 | Background Sync tag behavior without open client | Offline | C-02 replay timing |
| UH-C04 | Duplicate-FCM delivery rate; token cleanup effectiveness | Notifications | SN-08/B2 validation |
| UH-C05 | Stale-poll overwrite frequency on real networks | Commitments | C-03 priority |
| UH-FB01 | Real-world reachability of FB-01 user-switch race | Fabric | Timing instrumentation |
| UH-FB02 | Offline-queue flush double-import on real devices | Finance/Fabric | FI-06/FB-02 amplification |
| UH-FB03 | Lock-screen visibility of nudge bodies per platform | Privacy | FB-07/SN-06 severity confirmation |
| UH-FB04 | All finance `date` values sortable ISO strings in production | Finance/data | Server report & live-sync correctness |
| UH-FB05 | `fabric_settings.enabled` prevalence | Fabric | FB-06/FB-17 cost & impact scale |
| UH-SN01 | End-to-end production FCM delivery ever exercised | Notifications | Push-domain liveness (SN-03 shows UI would not reveal failure) |
| UH-SN02 | Browser-profile token retention after uninstall-class events | Devices | SN-01 containment design |
| UH-SN03 | Trigger Email extension deployed? If not, ALL new-device security alerts silently never send | Security alerts | Potentially HIGH; verify before Wave 2 |
| UH-SN04 | iOS standalone PWA push behavior | Devices | SN-01 test matrix |
| UH-SN05 | SW push delivery after OS-level permission revocation while token persists | Devices | SN-01 severity calibration |
| S-03 | `seeder.ts` reachable via DeveloperTools — dev-gating verified? | Dev tools | Production data-model drift risk (open suspicion; FS-09-adjacent) |

## Severity-normalization changelog (differences from source reports)

| ID | Source → Normalized | Why |
|---|---|---|
| FB-07 | LOW → MEDIUM | Aggregated evidence across reports 09/10 (all 5 producers send sensitive content) + direct interaction with SN-01 shared-device exposure; material privacy exposure for a finance product |
| FI-14 | LOW → MEDIUM | Report 07 (FS-06) proved exposure persists post-disconnect and includes amounts/rates; raised on family-impact evidence |
| A-08 | INFO→LOW (05) → INFO | Reachability sweep proved the client side unreachable — no runtime effect; remaining issue is claim-vs-reality documentation |
| F-02 | P2 → MEDIUM, DUP→C-01/C-02 | Defect subsumed by C-01/C-02; retained as acceptance evidence (test restoration), not a separate bug |
| F-03 | P2 → INFO | Pure verification gap (no user-facing defect); retained at P1 priority because un-skipped E2E gates the security waves |
| F-07 | P2 → LOW | Suppression is defense-in-depth/maintainability; no demonstrated defect; Tier-1 files are typed as prerequisites inside their remediation waves |
| F-08 | P2 → RETIRED-PENDING | Architecture decision already made (PR #111); not an open remediation item |
| F-09 | P2 (GitHub banner UNVERIFIED) → MEDIUM (EXPLAINED) | Reconciliation completed this pass: GitHub 67 = 5 manifests incl. 3 internal-tooling manifests holding all 20 highs; product manifests carry 3 open moderate alerts |
| SN-06 | MEDIUM → DUP→FB-07 | Root unified at FB-07 (MEDIUM after raise) |
| FS-06 | LOW→MEDIUM (07) → DUP→FI-14 | Same root; FI-14 raised to MEDIUM instead |
| R-01..R-13 | unnumbered in report 11 → INFO/LOW | Reachability items normalized on the INFO/LOW scale; R-03 kept LOW (authenticated-only attack surface; remediation couples with FI-10) |

All other severities were re-evaluated against the product-wide scale and preserved; no historical label was preserved mechanically.
