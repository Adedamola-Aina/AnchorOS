# 06 — FINANCE / FINANCIAL INTEGRITY — Forensic Domain Audit

Date: 2026-09-08 · Branch: `audit/whole-product-2026-09` · Base for this pass: `12a6935`
Scope: Finance → accounts → balances → ledger → transfers → transactions → Mono/bank integration → webhook processing → financial authorization → data integrity.
**AUDIT ONLY — no product code, rules, deps, or tests were modified.**

---

## 1. Executive summary

AnchorOS finance is a **client-authoritative personal ledger with a server-side read-only bank-aggregation overlay** (Mono). All balances are integer minor units (`balanceCents` / `amountCents`) on `artifacts/anchor-os/users/{uid}/accounts`; transaction rows live on `.../finance`. Transfers are **representational** — they move numbers between AnchorOS accounts and never initiate external real-money movement; the Mono integration is read-only (balance + transaction pull, unlink) and cannot move funds. This caps the worst case of most findings at *internal ledger corruption / stale data*, not direct monetary loss.

The core mutation paths (single-account create/delete/update, cross-user transfers) are structurally sound: Firestore batches or `runTransaction`, rules-gated writes, and `increment()` (concurrency-safe per-op). However, the audit confirms **material integrity defects** in four areas:

1. **Mono webhook channel** — replay-protection marks events *processed before* handling (FI-01), the HMAC is computed over re-serialized JSON instead of raw request bytes (FI-02), and there is no freshness check. Forgery is properly resisted (HMAC-SHA512, constant-time compare, fail-closed), but **legitimate event delivery is fragile and lossy**.
2. **Sync/reconciliation** — no pagination, cursor, or checkpoint (FI-03); imports are never reconciled afterward (FI-08); dedupe is check-then-write with a concurrent-duplication window (FI-18); balance overwrite races with other server-side writers (FI-04).
3. **Client-trust leaks into balance math** — delete reverses balances from client-memory snapshots (FI-05); update applies corrections to a client-supplied accountId without verifying the transaction's own account (FI-07); the offline queue retries without idempotency (FI-06).
4. **Best-effort "controls" presented as guarantees** — the ARCH-022 ledger is not tamper-evident and is fire-and-forget (FI-11); App Check is env-overridable (cross-ref U-02).

Cross-user access is **well defended** in the effective rules (default-deny + per-user keyspace + permission predicates) with emulator proof of basic IDOR denial. The authorization defects found are *within-permission* integrity bugs (a permitted user corrupting shared state through stale client data), plus one callable that trusts a client-supplied owner ID (FI-10).

**No stop condition (§19) was triggered.** No unauthenticated financial access found, no forged-webhook path found, no production bank secret in git (`git ls-files` — only `.env.example` placeholders), no client path to real-money movement.

Verdict summary:

| Question | Verdict |
|---|---|
| Can transfers partially succeed and leave inconsistent state? | **Not the batch itself** (single batch/transaction), **yes at the edges** — ledger/audit writes fire-and-forget, offline-queue retries can double-apply (FI-06). |
| Can an unauthenticated party forge/replay a webhook that mutates financial data? | **Not proven possible** — HMAC-SHA512 over body with server secret, constant-time compare, fail-closed, Admin-SDK-only write targets. Replay protection exists but is lossy (FI-01) and not byte-correct (FI-02). |
| Can legitimate Mono retries cause duplicates/inconsistency? | **Yes, event loss** (FI-01: retry-after-failure acked as duplicate) and **duplicate imports** under concurrent syncs (FI-18). |
| Is reconciliation proven? | **No reconciliation exists.** Dedupe is the only mechanism; provider edits/deletes never propagate (FI-08); pagination gap can silently drop history (FI-03). |
| Is the ledger (ARCH-022) tamper-evident? | **No** (FI-11). |

## 2. Finance architecture / data-flow map

### 2.1 Canonical modules (React/TS product)

| Layer | Modules |
|---|---|
| UI | `src/features/finance/FinanceView.tsx`, `AccountDetailsView.tsx`, `AccountForm.tsx`, `TransactionForm.tsx` (+ `components/transactionForm/useTransactionSubmit.ts`), `MonthlyInsight.tsx`, `components/NetWorthCards.tsx`, `components/TransferDetails.tsx`, `RecurringOptions.tsx` |
| Context | `src/context/FinanceContext.tsx` (@ts-nocheck, re-exports `FinanceContextDefinition`) |
| Hooks | `useFinanceService` (facade) → `useFinanceData` (reads/derivations) + `useFinanceOperations` (mutations) + `useFinanceOfflineSync` (offline queue flush); `useBankConnection` (Mono callables); `useAccountActivity`; `financeActivityLogging` |
| Services | `FinanceService` (facade) → `AccountService`, `TransactionService` → `TransferOperations`, `TransactionUpdateOps`; `LedgerService` (ARCH-022); `AuditService` (`auditFinance`); `FieldEncryption` (SEC-005 — **currently disabled**, empty field lists `ENCRYPTED_ACCOUNT_FIELDS = ENCRYPTED_TRANSACTION_FIELDS = []`); `AccountPersonalizationService` |
| API | `src/api/FinanceOperationsApi.ts` (`restoreSoftDeletedTransaction`, `convertCurrencyAcrossAccounts`) |
| Utils | `moneyUtils.ts` (`toCents`/`fromCents`), `finance.ts` (`calculateNetWorth`, `calculateCashFlow`), `financeInsights.ts` (`getCashFlowAnalysis`), `offlineQueue.ts`(+Storage), `rateLimit.ts` (client), `features/finance/utils/permissions.ts` |
| Firestore access | All client writes via `utils/secureDb.ts` re-exports of raw Firebase SDK primitives (`writeBatch`, `runTransaction`, `increment`) — i.e., **client-side writes to Firestore gated by rules**, not via backend API |

### 2.2 Server side (Functions, `functions/src`)

| Module | Trigger | Role |
|---|---|---|
| `bankLink.ts` → `linkBankAccount` | callable (`secureOnCall`) | Exchange Mono widget auth code → create linked account + `bankConnections` doc |
| `bankUnlink.ts` → `unlinkBankAccount` | callable | Mono unlink (best-effort) → archive account, mark connection revoked |
| `bankSync.ts` → `syncBankTransactions` | schedule `every 6 hours` | Sync all active connections |
| `bankSync.ts` → `syncBankAccountNow` | callable | Manual per-account sync |
| `bankSyncConnection.ts` → `syncConnection` | internal | Shared sync core (fetch → dedupe → batch write → overwrite balance) |
| `bankWebhook.ts` → `monoWebhook` | HTTP `onRequest` (`cors:false`) | Mono webhook: HMAC verify → replay check → dispatch |
| `webhookHandlers.ts` | internal | `handleAccountUpdated`, `handleReauthorisation` (near-duplicate of sync core) |
| `mono/monoClient.ts` | internal | Mono REST client (`mono-sec-key` header; `https://api.withmono.com/v2`) |
| `mono/transactionMapper.ts` | internal | Narration cleanup, auto-categorization, dedupe mapping |
| `sharedTransactions.ts` → `addTransactionToSharedAccount` | callable | Family-member transaction + balance increment |
| `recurringApi.ts` | callables | CRUD for `recurring_transactions` (no balance effect on write) |
| `recurring.ts` → `processRecurringTransactions` | schedule `every day 00:00` | Materialize recurring tx + `increment` balance |
| `deleteAccount.ts` → `deleteMyAccount` | callable | Full user-tree erasure (finance portion in §14) |
| `rateLimit.ts` / `rateLimitCallables.ts` | callable | Firestore-backed distributed limits (finance keys: `bankLink`, `bankSync`, `bankUnlink`, `accountCreate`, `transactionCreate`, `recurring*`, `deleteAccount`) |

### 2.3 End-to-end flows

```
A) Manual transaction (client-authoritative):
   TransactionForm → useTransactionSubmit (toCents, validation)
   → useFinanceOperations.addTransaction → FinanceService.addTransaction
   → TransactionService.addTransaction → writeBatch:
        finance doc (rules: isValidTransaction + hasTransactPermission)
        accounts.balanceCents increment(±amount)          [same batch = atomic]
   → post-commit (fire-and-forget): auditFinance + LedgerService.record
   → offline path: if !navigator.onLine → IndexedDB queue → flush on 'online' (FI-06)

B) Transfer (representational, cross-user capable):
   TransactionService.addTransaction(type='transfer') → writeBatch:
        source finance doc (expense,'Transfer') @ users/{source.ownerId}/finance
        dest   finance doc (income, 'Transfer') @ users/{dest.ownerId}/finance
        source accounts increment(-amount); dest accounts increment(+destAmount)
   [one batch = atomic; rules per-doc; cross-user works iff shares permit; batch fails closed if any doc denied]

C) Mono link:
   Mono Connect widget (client, public key) → code
   → linkBankAccount callable → exchangeAuthCode → getAccountDetails
   → accounts doc (source:'linked', externalConnection.*) + bankConnections doc (Admin SDK)

D) Mono sync (server-authoritative for linked accounts):
   [6h schedule | syncBankAccountNow callable | monoWebhook]
   → syncConnection / handleAccountUpdated:
        getAccountDetails + getTransactions(paginate:false)
        → dedupe vs existing externalTransactionId (query)
        → batch.set new finance docs → accountRef.update(balanceCents = bank balance) [non-atomic sequence]

E) Recurring:
   rule CRUD (callables) → processRecurringTransactions (daily) → per-rule batch: finance doc + increment + nextRunAt advance
```

## 3. Financial data model

All finance state lives under `artifacts/anchor-os/users/{uid}/…` (per-user keyspace) plus app-level collections. Client-writable paths are rules-gated; Admin SDK (Functions) bypasses rules by design.

| Resource | Path | Writers | Schema highlights | Lifecycle |
|---|---|---|---|---|
| Accounts | `users/{uid}/accounts/{id}` | Client create (`isValidAccount`), client update (owner full; transact-perm only `balanceCents,updatedAt`; **linked accounts: client may not touch `balanceCents/externalConnection/source`** — rules :265-267), Admin SDK full | `name, type('checking'|'savings'|'credit'|'investment'|'cash'|'salary'), currency('NGN'|'USD'), balanceCents:int, ownerId, scope, shares{uid:perm}, sharedWith{uid:{permission,grantedAt}}, isArchived, source('manual'|'linked'), externalConnection{provider,externalAccountId,institutionName,institutionCode,lastSyncedAt,syncStatus,maskedAccountNumber}, nameHistory` | archive-only delete (`isArchived:true`) |
| Transactions | `users/{uid}/finance/{id}` | Client create/update/soft-delete (rules), Admin SDK (sync, recurring) | `title, amountCents:int>=0, type('income'|'expense'|'transfer'), category, accountId, accountName, currency, scope, date, createdAt, isSoftDeleted, deletedBy, deletedAt, createdBy, accountOwnerId, accountShares, linkId, linkedTransactionId, linkedUserId, source('synced'), externalTransactionId, narration, destinationAmountCents, exchangeRate, recurringTransactionId` | soft delete |
| Bank connections | `users/{uid}/bankConnections/{id}` | **Admin SDK only** (rules write:false); owner read | `provider:'mono', monoAccountId, anchorAccountId, userId, institutionName, linkedAt, status('active'|'reconnect_required'|'revoked'), lastSyncAt` | created at link; revoked at unlink; deleted with user tree |
| Ledger (ARCH-022) | `users/{uid}/ledger/{id}` | Client create only (owner; no update/delete) | `action, entityId, entityType, amountCentsDelta, snapshotBefore?, snapshotAfter, actorUid, ledgerDocId, timestamp, integrityHash` | append-only |
| Recurring rules | `artifacts/anchor-os/recurring_transactions/{id}` | Callables (owner-checked) | `userId, accountId, title, amountCents>0, type, category, frequency, interval, nextRunAt, status, lastRunAt, failureReason` | hard delete |
| Activity | `users/{uid}/accounts/{id}/activity/{id}` | Client create (append-only) | actor, action, amount | append-only |
| Webhook replay cache | `webhook_events/{fingerprint}` (root) | **Admin SDK only** (default deny) | `processedAt, expiresAt` | TTL 24h by convention — **no TTL policy / no deleter found** (unbounded growth) |
| Audit | `audit_log/{id}` | Admin SDK only | PII-scrubbed metadata | append-only |
| Rate limits | `rateLimits/{id}` | Admin SDK only | counters/windows | rolling |
| Storage | account artwork path (`storage.rules` artwork-only) | owner | card artwork | survives account archive |

### 3.1 Money representation

- **Integer minor units everywhere** (`amountCents`, `balanceCents`), created via `toCents()` = `Math.round(parseFloat(cleaned)*100)` (`src/utils/moneyUtils.ts`), handles comma/symbol variants; NaN → 0. Display divides by 100 at the edge (`fromCents`).
- **Rules enforce int**: `isValidAccount`/`isValidTransaction` require `balanceCents`/`amountCents is int`; `amountCents >= 0` (zero allowed; negatives rejected at create *and* update — rules run on the merged future doc for updates).
- Float touch-points (all rounded): Mono values (`Math.round(x*100)` at `bankLink.ts:82`, `bankSyncConnection.ts:81`, `webhookHandlers.ts:65`, `transactionMapper.ts:67`); `destinationAmountCents = Math.round(amountCents * rate)` with client-typed rate validated `> 0` and result `> 0` (`useTransactionSubmit.ts:88-92`).
- **Currency is explicit on every account and transaction doc**, but consistency is not validated (a transaction's `currency` need not match its account's; cross-currency transfers carry `destinationAmountCents` only when the UI detects differing currencies).
- NaN/Infinity: no path found writing non-finite cents (`increment(NaN)` rejected by Firestore; `toCents` clamps to 0). Overflow: Firestore int64, JS safe-integer range ≈ 90 trillion kobo — no realistic overflow.

### 3.2 Sources of truth (explicit)

- **Manual accounts**: the client is authoritative for `balanceCents` (owner can set any int via update). Deliberate design; integrity guarantees are therefore scoped to mutation paths, not the field.
- **Linked accounts**: Mono is authoritative for `balanceCents` (overwritten at sync); clients are rules-blocked from `balanceCents/externalConnection/source` on `source=='linked'` docs. However `hasTransactPermission` still lets a shared member *create* manual transactions on a linked shared account — the row persists while the next sync overwrite re-anchors the balance, silently discarding the manual delta (row remains, double-counts in cash-flow derivations). See FI-04b (§8).
- **Competing truths between syncs**: transaction rows on a linked account are local truth; balance is bank truth; nothing reconciles them (§8).

---

## 4. Ledger invariants

### 4.1 Intended invariants (from code + comments)

1. Every transaction's balance delta applied exactly once, atomically with the row (`TransactionService`, `TransferOperations`, `FinanceOperationsApi`, `recurring.ts`, sync modules).
2. Transfers conserve value: source −amount, dest +`destinationAmountCents ?? amountCents`, two linked rows (`linkId`, `linkedTransactionId`, `linkedUserId`).
3. Delete reverses the original contribution; update reapplies the diff (BUG-034/035/036 fixes).
4. ARCH-022 ledger: append-only, per-user, "tamper-evident" audit of mutations.
5. Linked (bank) accounts' balances/external state are server-only.

### 4.2 Where the invariants hold

- `addTransaction` (standard + transfer): one `writeBatch` with row(s) + balance increments → atomic; `increment` is server-side and race-free against concurrent increments.
- Transfer deletion / linked updates use `runTransaction` with `transaction.get` on the linked doc (BUG-035).
- Rules force `amountCents >= 0` and shape at the door; `ledger` is append-only by rules; `bankConnections` is Admin-SDK-only.

### 4.3 Where they break (confirmed — details in §17)

- Ledger writes are `void LedgerService.record(...)` **after** commit (`TransactionService.ts:74-80,139-146`), swallowing all errors (`LedgerService.ts:73-75`) → eventually-missing, never transactional with the mutation. FI-11.
- Delete reversal uses the **client-memory transaction object**, not the persisted doc (`TransactionService.ts:104-119`) → stale-amount reversal. FI-05.
- Update correction targets the **caller-supplied `accountId`**, never validated against the transaction's own `accountId` (`TransactionUpdateOps.ts:24-57`). FI-07.
- Offline retry has **no idempotency key** → double-apply after ambiguous timeout. FI-06.
- Sync overwrite races with other server-side writers (recurring scheduler, concurrent syncs). FI-04/FI-18.

### 4.4 Direct answer

> **Can a transfer or financial operation partially succeed and leave AnchorOS internally inconsistent?**
> The Firestore batch/transaction itself cannot partially commit — debit+credit+rows are atomic. **But the operation as a whole can still leave inconsistent persisted state** through five proven windows: (1) post-commit ledger/audit writes silently lost (invalidates ARCH-022 claims); (2) offline queue retry after ambiguous timeout duplicates the whole operation; (3) delete/update corrections computed from stale client data; (4) concurrent sync overwrites of `balanceCents`; (5) concurrent duplicate syncs double-importing transactions. None self-heal (no reconciliation); recovery requires manual fix or the next bank sync (linked accounts only).

---

## 5. Transfer atomicity & concurrency

| Path | UI entry | Boundary | Idempotency | Concurrency control | Verdict |
|---|---|---|---|---|---|
| Standard tx create | TransactionForm | one `writeBatch` | none (client-generated doc IDs) | `increment` per-op atomic | CONSISTENT; duplicate user request = two real transactions (expected for manual entry) |
| Transfer create | TransactionForm | one `writeBatch` (2 rows + 2 increments) | none | `increment` | CONSISTENT atomically; **cross-user batch fails closed** if any remote doc is rules-denied |
| Transfer delete | AccountDetailsView | `runTransaction` (linked) / `writeBatch` (simple) | none | transaction re-reads **linked** doc only; **primary row + amount come from client state** | FI-05 DRIFTED possible |
| Transfer edit | TransactionForm | `runTransaction` | none | re-reads both docs; correction vs persisted values | CONSISTENT except wrong-account targeting (FI-07) |
| Currency conversion | convertCurrency hook | one `writeBatch` | none | `increment` | CONSISTENT; schema-inconsistent rows (FI-14) |
| Restore | **no production caller** | `writeBatch` | none | none; no soft-deleted-state guard | FI-13 (dead code) |
| Offline create | offline queue | per-entry batch via `addTransaction` | **none** — payload-only queue | none | FI-06 DUPLICATED possible |
| Shared-account tx (callable) | family UI | two sequential Admin-SDK writes (`add` then `update`) — **not one batch** | none | `increment` on balance | partial-failure window: row created, balance update fails → DRIFTED, manual recovery only (`sharedTransactions.ts:95-103`) |
| Recurring materialization | scheduler | `db.batch()` chunks (≤450 ops) | per-rule atomic (row+increment+`nextRunAt` advance in same batch) — crash-safe on re-run | per-rule atomic | CONSISTENT (well-designed) |

**Client-provided balances / ownership:** the client never sends a target balance; corrections are deltas from read values — except FI-05/FI-13 which read from client state. Ownership metadata (`accountOwnerId`, `accountShares`, `linkedUserId`) derives from client account objects; every resulting write is independently rules-checked against the *addressed* path, so spoofing cannot escape permission predicates (verified against rules, §10). The exception is the shared-transaction callable (FI-10).

**Timestamp ordering:** `date`/`createdAt` are client ISO strings (`isValidTransaction` requires only `date is string`). Backdating is a supported feature; ordering assumptions are display-only. No server timestamps on finance rows (`serverTimestamp` unused in finance paths) — auditability gap, no integrity break proven.

## 6. Mono / bank connection lifecycle

| # | Step | Where | Client/Server | Auth & authz | Assessment |
|---|---|---|---|---|---|
| 1 | Connection initiation | Mono Connect widget (`connect.mono.co` in CSP) | Client | Widget handles bank credentials; AnchorOS never sees them | OK; public key only in client (`VITE_MONO_PUBLIC_KEY`) |
| 2 | Widget → auth code | widget callback | Client | — | code single-use/short-lived (Mono-side) |
| 3 | Code exchange | `linkBankAccount` callable | Server | `request.auth` required; App Check via `secureOnCall`; rate limit `bankLink` 5/hour | **Ownership binding by construction**: backend exchanges the code with `MONO_SECRET_KEY`; `monoAccountId` stored under the *caller's* `users/{uid}/bankConnections`. Duplicate check (`bankLink.ts:57-67`) is check-then-write — rapid double-submit could create two accounts (Mono code single-use likely prevents; UNPROVEN) |
| 4 | Account record creation | `bankLink.ts:78-100` | Server (Admin SDK) | — | `source:'linked'`; full account number/BVN from Mono response **not** persisted (only `maskedAccountNumber`) — good |
| 5 | Balance sync | `syncConnection` / `handleAccountUpdated` | Server | ownership derived from `bankConnections` doc | `Math.round(balance*100)`; overwrite semantics — FI-04 |
| 6 | Transaction sync | same | Server | same | dedupe by `externalTransactionId`; **no pagination** FI-03; **concurrent duplication window** FI-18 |
| 7 | Periodic refresh | `syncBankTransactions` schedule 6h | Server | n/a | iterates active connections; per-connection errors logged and swallowed (no alerting surface) |
| 8 | Manual refresh | `syncBankAccountNow` callable | Server | auth required; **ownership enforced by querying connections under `users/{uid}` only** (`bankSync.ts:68-77`); rate limit 10/day | Correct — user cannot sync another user's connection |
| 9 | Webhook processing | `monoWebhook` onRequest | Server | HMAC (`MONO_WEBHOOK_SECRET`); no App Check (correct — third-party caller) | see §7 |
| 10 | Reconnect/re-auth | `handleReauthorisation` / sync 401 handling | Server | — | marks `reconnect_required` on account + connection; UI surface display-only (unverified) |
| 11 | Disconnect | `unlinkBankAccount` callable | Server | auth required; **account read under caller's own `users/{uid}` path** (`bankUnlink.ts:24-32`); rate limit 3/day | Mono unlink best-effort — a failed revoke leaves provider access active while UI shows "unlinked" (silent, logged only); connection lookup filters `status=='active'` only — a `reconnect_required` connection is never marked `revoked` (stale row) |
| 12 | Account deletion (user) | `deleteMyAccount` | Server | reauth window 5 min; rate limit 2/day | deletes user tree incl. accounts/finance/bankConnections; **no Mono unlink call** → provider-side linkage survives (FI-09) |
| 13 | Provider-side revocation | Mono `POST /accounts/{id}/unlink` | Server | `mono-sec-key` header | only from explicit unlink (step 11); never from account deletion |

**Mono API calls** (`mono/monoClient.ts`): `POST /accounts/auth` (exchangeAuthCode), `GET /accounts/{id}` (getAccountDetails), `GET /accounts/{id}/transactions` (getTransactions — `start`/`end`/`paginate` params **never used by callers**), `POST /accounts/{id}/sync` (triggerSync — **defined, never called: dead code**), `POST /accounts/{id}/unlink` (unlinkAccount).

**Secrets**: `MONO_SECRET_KEY` / `MONO_WEBHOOK_SECRET` are Firebase Secret Manager params declared per-function (`secrets:` option); only `mono-sec-key` header usage; no secret is logged. Mono error bodies are thrown verbatim (`monoClient.ts:39`) and `console.error`'d by callers — may contain account metadata (low sensitivity, not scrubbed).

**Cross-user Mono operation?** Every callable scopes connection/account lookup under `request.auth.uid`'s own path; the webhook binds provider IDs → AnchorOS users via the server-only `bankConnections` collection (collectionGroup on `monoAccountId`). **No path found where a user can cause the backend to operate on another user's Mono account.**

## 7. Mono webhook security (high-priority target)

Endpoint: `monoWebhook` — `functions/src/bankWebhook.ts` (HTTP `onRequest`, `cors:false`, secrets `MONO_SECRET_KEY`+`MONO_WEBHOOK_SECRET`). Single handler; no other bank webhook exists.

**Proven properties (traced, not inferred):**
- Method gate: non-POST → 405 (`:42-45`).
- Signature: HMAC-SHA512 of the body with `process.env.MONO_WEBHOOK_SECRET`, constant-time compare with length pre-check (`verifySignature`, `:10-21`). Missing secret or header → fail-closed 401.
- Replay/duplicate: SHA-256 fingerprint of the body (first 32 hex) recorded in `webhook_events/{fp}` inside a Firestore transaction (`:27-37`); duplicate → 200 `{duplicate:true}`, no processing.
- Unknown events acked 200 without action (`:83`); missing `data.account._id` → 400.
- All writes by Admin SDK to rules-denied paths — clients cannot touch `webhook_events`, `bankConnections`, or linked accounts.
- Ownership lookup: `bankConnections` collectionGroup `where monoAccountId == X && status == 'active'` → binds provider event to exactly one AnchorOS user/account (`webhookHandlers.ts:9-28`). Unknown provider IDs logged and acked.
- Errors: handler exceptions → 500 (Mono retries); malformed JSON → throws before response → 500.

**Defects (confirmed, code-level):**
- **FI-01 — Replay cache marks the event processed BEFORE handling.** `isReplayEvent` writes the fingerprint, then `handleAccountUpdated` runs (`bankWebhook.ts:57-88`). If the handler throws (Mono outage, Firestore error, timeout/crash), response is 500 and Mono legitimately retries — but the retry hits the replay cache and is answered `200 {duplicate:true}`. **The event is permanently lost while appearing processed.** Consequence: missed `account_updated` syncs, stale balances/transactions with no error signal. State classification: DRIFTED (partially recoverable — the 6h scheduled sync re-pulls recent data; anything older than the single-page sync window is not recovered — FI-03).
- **FI-02 — HMAC computed over re-serialized JSON, not raw request bytes.** `const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)` (`:47`). Firebase v2 `onRequest` parses JSON into objects; the byte-faithful original is available as `req.rawBody` (Buffer) and is **not used**. `JSON.stringify(JSON.parse(bytes))` is not byte-identical to the original whenever Mono's body contains whitespace, unicode escapes, or different number formatting → HMAC mismatch → 401. Failure mode is fail-closed (no forgery path), but the channel is either (a) silently dead in production (only the 6h poll works) or (b) working by serialization luck — **undetermined without runtime evidence (UH-01)**. Either way the code is incorrect: the signature must be computed over `req.rawBody`.
- **FI-02b — No timestamp/freshness validation.** No verified freshness claim is checked. Replay within the same secret regime requires the secret (HMAC), so practical replay risk is low; the 24h replay TTL and absent freshness check are defense-in-depth gaps, not proven exploitable.
- **Observability**: invalid signatures/duplicates are `console.warn` only; no metric/alert surface.

**Direct answers:**
> *Can an unauthenticated third party forge, replay, or duplicate a bank webhook in a way that mutates financial data?* **No forgery path found** — HMAC secret is server-side, compare is constant-time; same-body replays are cached out; a distinct replayed body still needs a valid signature. Residual risk requires compromising `MONO_WEBHOOK_SECRET` (outside evidence).
> *Can legitimate Mono webhook retries cause duplicate transactions, duplicate account updates, or inconsistent balances?* **Yes — the inverse problem:** retries after handler failure are swallowed as duplicates (FI-01) → *missing* updates. Duplicate *imports* are separately possible via concurrent sync paths (FI-18). Balance updates are idempotent (overwrite).

## 8. Sync / reconciliation integrity

- **Authority model**: for linked accounts, Mono is authoritative for balance; local rows are append-only imports. There is **no reconciliation process**: nothing compares `sum(transaction deltas) vs balance`, nothing detects drift, nothing reports sync failure to the user beyond `externalConnection.syncStatus`.
- **Dedupe**: `mapAndDeduplicate` filters Mono rows whose `_id` is in `existingIds`, gathered from `finance where accountId==X && source=='synced'` selecting `externalTransactionId` (`bankSyncConnection.ts:50-63`). Identity = Mono `_id` (stable). Soft-deleted synced rows remain in the dedupe set (deleted rows not re-imported — defensible).
- **FI-03 — No pagination/cursor/checkpoint.** `getTransactions(monoAccountId, { paginate: false })` returns Mono's default first page; `paging.total/next` are typed but ignored (`monoTypes.ts:48-56`); no `start`/`end` window is ever passed. Transactions beyond page 1 are **never imported**, and no checkpoint would notice. A user with more transactions than one page between syncs permanently loses the overflow while the (authoritative) balance reflects them → silent, permanent transaction/balance divergence. Page size unverified (UH-02).
- **FI-08 — Imports are never updated or deleted.** Dedupe is existence-based: a transaction the bank later corrects (amount/date/narration) never updates the imported row (its `_id` is known). Mono-deleted/reversed transactions remain indefinitely. Only the balance self-corrects at next sync.
- **FI-18 — Dedupe is check-then-write; concurrent syncs double-import.** Two concurrent executions for the same connection (scheduled 6h + manual `syncBankAccountNow`, or webhook-triggered + scheduled; `handleAccountUpdated` and `syncConnection` are separate near-identical paths) both read the same `existingIds` before either writes, then both `batch.set` the same external transactions under new random doc IDs. No uniqueness constraint on `externalTransactionId` (Firestore has none). Result: DUPLICATED rows (double-counted in cash flow); balance self-corrects (last-writer-wins overwrite). No lock/lease on connections.
- **FI-04 — Balance overwrite races.** `accountRef.update({ balanceCents })` (Admin SDK) is a blind overwrite. Interleavings with the recurring scheduler's `increment` on the same account, or a just-committed client batch on a shared linked account, lose the increment (sync's read preceded their commit). The sync sequence itself is non-transactional (txns → balance → connection): failure between steps leaves imports with stale balance — RECOVERABLE on next sync.
- **FI-04b — Manual transactions on linked shared accounts.** Rules permit `hasTransactPermission` members to create manual rows on a linked account; the next sync's overwrite silently discards their balance effect while the rows persist and pollute income/expense derivations (not `source:'synced'`, so never deduped away).
- **Failure visibility**: sync errors are `console.error`'d and swallowed inside the scheduled loop (`bankSync.ts:41-47`); `syncStatus` becomes `reconnect_required` only via string-matching `401`/`REAUTHORISATION` in the error text (`bankSyncConnection.ts:39`) — brittle; other failures leave `syncStatus:'active'` with stale `lastSyncedAt`. **A failed sync appears successful.**
- **Pending transactions**: no concept of pending anywhere; Mono balance-vs-transaction timing differences are absorbed silently by the authoritative overwrite.
- **Ordering**: imported rows carry Mono `date`; no ordering guarantees enforced or needed (display sorts).

## 9. Net worth / balance derivation

### 9.1 Implementations found

| Derived value | Implementation | Inputs | Notes |
|---|---|---|---|
| Net worth | `calculateNetWorth` (`src/utils/finance.ts:78-104`), consumed by `useFinanceData.ts:111-115` | accounts (own + shared, deduped), **excludes `isArchived`** | per-currency buckets NGN/USD; `total` = **dominant currency only** (higher absolute value), no FX conversion — deliberate (F-017 note) |
| Cash flow (dashboard) | `getCashFlowAnalysis` (`src/utils/financeInsights.ts:17-46`) | last-7d vs prior-7d transactions, filters `isSoftDeleted` | **currency-blind** — sums NGN+USD cents into one number; **counts both legs of transfers** (no `category==='Transfer'` exclusion) → transfers inflate income AND expense |
| Cash flow (alt) | `calculateCashFlow` (`src/utils/finance.ts:109-140`) | last N days, type income/expense | same two defects; **does not filter `isSoftDeleted`** (relies on caller) |
| Monthly income/expense | FinanceView / MonthlyInsight helpers | month-filtered transactions | transfer-leg handling to re-verify in the UI pass (dashboard path confirmed above) |
| Fabric queries | `src/services/fabric/query/financeQueries.ts`, `accountQueries.ts` | own aggregation copies | separate implementations — divergence risk; semantic equivalence NOT proven here (deferred to Fabric domain audit) |

### 9.2 Invariant matrix

| Derived value | Authoritative inputs | Implementations | Consistent? | Test evidence |
|---|---|---|---|---|
| Net worth | `accounts.balanceCents` | `calculateNetWorth` (single src impl) | YES (archived excluded; per-currency) | `src/utils/finance.test.ts:98-150` (empty, mixed currency, negative cases) |
| Total (display) | same | same | BY DESIGN limited (dominant-currency shortcut, not FX) | selection logic tested |
| Cash flow | `finance.amountCents/type/date` | `getCashFlowAnalysis` + `calculateCashFlow` (2 impls) | **NO** — currency mixing, transfer-leg inflation, soft-delete filter divergence | partial trend-logic tests; no currency-mix case |
| Account balance | stored `balanceCents` | displayed directly | YES | — |
| Liabilities | none — no liability concept; `credit` type exists in rules but `CreateAccountPayload` cannot create it | — | N/A (not modeled); negative balances possible (rules allow any int) | no tests |
| Fabric aggregates | own queries | separate impls | UNPROVEN | engine tests cover mechanics, not cross-impl equivalence |

## 10. Financial authorization boundaries

Caller UID is always `request.auth.uid` (callables) or rules `request.auth.uid` (client writes). Client-supplied owner/account/transaction IDs are trusted only after independent predicates re-check the addressed document.

| Operation | Auth required | Ownership check | Cross-user (A sends B's ID) result |
|---|---|---|---|
| Create account | yes (rules) | path uid + `isValidAccount` | denied |
| Update account / balance | yes | owner full; manage-perm (share-map frozen); transact-perm only `balanceCents,updatedAt`; linked: client blocked from balance/external/source | denied (unless genuinely shared, then restricted) |
| Create transaction | yes | `hasTransactPermission(accountId)` resolved against the **addressed user's** accounts | denied — A writing `users/B/finance` needs transact-perm on B's account |
| Update/delete transaction | yes | `hasManagePermission(resource.data.accountId)` from the **persisted** doc | denied for non-managers |
| Read accounts/transactions | yes | owner / `accountShares` / `sharedWith` / family-scope + collection-group mirrors | denied (emulator-proven: `firestore-rules.security.emulator.ts:48-76`) |
| linkBankAccount | yes (callable) | code exchange binds to caller | n/a |
| syncBankAccountNow / unlinkBankAccount | yes (callable) | connection/account looked up **only under caller's `users/{uid}`** (`bankSync.ts:68`, `bankUnlink.ts:24`) | B's accountId → "No active bank connection"/"Account not found" → rejected |
| addTransactionToSharedAccount | yes (callable) | account read at client-supplied `accountOwnerId` path, then `ownerId==caller || sharedWith[caller]` (`sharedTransactions.ts:53-69`) | rejected unless genuinely shared; **FI-10**: `!accountData.ownerId` treated as owned-by-anyone; not-found vs permission-denied = enumeration oracle |
| recurring CRUD | yes (callable) | `existing.userId !== uid` → denied (`recurringApi.ts:65,123,150`) | rejected |
| Ledger append | yes (rules) | own path only | denied for others; **self-fabrication possible** (FI-11) |
| Mono webhook | n/a (HMAC) | provider-ID binding via server-only `bankConnections` | n/a — no user input |

**IDOR pattern scan** (`uid`, `userId`, `accountId`, `transactionId`, `familyId`, `monoAccountId`, external IDs): every callable scopes reads to the caller's keyspace or re-validates the addressed document's ownership/share maps. The only client-supplied owner-shaped input accepted without independent verification is `accountOwnerId` in the shared-transaction callable (FI-10) — and the share check still runs against the real account doc, so access requires a genuine grant. Client-side route guards/hidden UI are never load-bearing for finance writes (rules are), except **within-permission** stale-data integrity bugs (FI-05/FI-07): authorization-correct, integrity-broken.

---

## 11. Firestore rules — finance mapping (effective)

| Path | Access class | Key predicates / notes |
|---|---|---|
| `users/{uid}/accounts` | authenticated owner (C/R/U/D), shared read, transact/manage update | `isValidAccount` (int balance, currency enum, name, type enum incl. 'credit' — not client-creatable); owner update has **no affectedKeys restriction** (may set any balance — by design for manual accounts); linked-source guard blocks client balance/external/source changes (:265-267) |
| `users/{uid}/finance` | owner + shared members | create: `isValidTransaction` + `hasTransactPermission(accountId)`; update: manage-perm + full-doc `isValidTransaction` (revalidates merged doc — blocks negative amounts via update); delete: manage-perm; read: owner/`accountShares`/`sharedWith`/family-scope. **No field restrictions on create** → client may write `source:'synced'`, arbitrary `externalTransactionId` (poisons own dedupe set — self-DoS only), `scope`, `createdBy` etc. |
| `users/{uid}/bankConnections` | owner read, **write:false** | correct — Admin SDK only |
| `users/{uid}/ledger` | owner create/read, **update/delete:false** | append-only; owner may fabricate entries (FI-11) |
| `recurring_transactions` | owner CRUD with full shape validation | app-level collection |
| `accounts` / `finance` collection-groups | shared-member read mirrors | `sharedWith` / `accountShares` keyed |
| `activity` | owner/member create+read, append-only | — |
| `webhook_events`, `audit_log`, `rateLimits`, `mail`, `passkey_challenges` | **deny all (client)** | Admin SDK only |
| default | **deny all** | rules :388-390 |

**Server-authoritative fields a client can still mutate (findings-grade observations):** own manual-account `balanceCents` (unrestricted owner update — by design); own `finance` create fields `scope`/`source`/`externalTransactionId`/`createdBy`/`accountOwnerId`/`accountShares` unrestricted (self-scoped poisoning, except `scope:'family'` rows become family-readable — compounded by FI-14); `date`/`createdAt` client strings (backdating is a feature; no server timestamps in finance).

Rules verified against the writes traced in §5/§6; no rule changed. Emulator suites cover basic finance IDOR, family post-disconnect revocation, and default-deny.

## 12. Cloud Functions / server endpoints — finance inventory

| Function | Trigger | Auth | App Check | Authz | Input validation | Rate limit | Tx/batch | Idempotency | Tests |
|---|---|---|---|---|---|---|---|---|---|
| `linkBankAccount` | callable | `request.auth` | via `secureOnCall` (default-on prod/staging, env-overridable — cross-ref U-02) | caller-scoped | `code` string presence only | `bankLink` 5/h | none (sequential writes) | dup-connection check (check-then-write) | none (registry test only) |
| `unlinkBankAccount` | callable | yes | yes | caller-scoped account read | `accountId` string | `bankUnlink` 3/day | none (sequential writes) | none | none |
| `syncBankTransactions` | schedule 6h | n/a | n/a | all connections | n/a | n/a | per-chunk batches | dedupe (check-then-write) | none |
| `syncBankAccountNow` | callable | yes | yes | caller-scoped connection query | `accountId` string | `bankSync` 10/day | per-chunk batches | dedupe (check-then-write) | none |
| `monoWebhook` | HTTP POST | HMAC-SHA512 | none (correct for 3rd-party) | provider-ID → connection binding | minimal shape check (`event`, `data.account._id`) | none (HMAC is the only control) | per-chunk batches + txn on replay cache | replay cache (lossy — FI-01) | none |
| `addTransactionToSharedAccount` | callable | yes | yes | owner/sharedWith on real doc (FI-10 caveat) | partial (presence only; amount/type unvalidated — Admin SDK bypasses rules' `amountCents >= 0`) | `transactionCreate` 100/h | **none** — two sequential writes | none | none |
| `createRecurringTransaction` (+update/delete/toggle) | callables | yes | yes | `userId == uid` | `validateRecurringInput` | recurring* keys | single doc | none | none |
| `processRecurringTransactions` | schedule daily | n/a | n/a | all rules | `validateRule` per rule (pauses invalid) | n/a | per-rule atomic batches | nextRunAt advance = natural idempotency | none (helpers tested) |
| `deleteMyAccount` | callable | yes + 5-min reauth | yes | self only | n/a | `deleteAccount` 2/day | chunked deletes (non-transactional) | none (cross-ref A-04) | none |
| `checkRateLimit` | callable | yes | yes | caller-scoped | action/identifier | — | — | — | rateLimit tests |

Notes: no finance callable uses `runTransaction` for its multi-write sequences (client code does; server code does not, except the webhook replay-cache txn). Server-side amount validation is absent in `addTransactionToSharedAccount`; a negative `amountCents` from a member with write access would *increase* balance on 'expense' (folded into FI-10).

## 13. Client-side financial trust & @ts-nocheck intersections

Finance-critical files under `@ts-nocheck` (verified by direct header read):

| File | Weakened invariant |
|---|---|
| `src/context/FinanceContext.tsx` | central finance state plumbing (auth/finance coupling) — S-01 class |
| `src/hooks/useFinanceOperations.ts` | every mutation entrypoint; the stale-snapshot delete path (FI-05) sits behind this suppression |
| `src/api/FinanceOperationsApi.ts` | restore/convert balance math untyped — FI-13/FI-14 written here |
| `src/features/finance/utils/permissions.ts` | the entire client permission model (`canAdd/Edit/Delete/Manage`) — type errors here would silently invert access checks |
| `src/hooks/useBankConnection.ts` | Mono callable payloads untyped (loosely typed provider responses) |
| `src/features/finance/components/transactionForm/useTransactionSubmit.ts` | amount parsing / `toCents` / rate validation path |
| `src/services/financeTypes.ts` | payload contracts themselves suppressed |
| `functions/src/rateLimit.ts` | server-side limiter (finance keys) untyped |
| `functions/src/index.ts` | function barrel — registration typos would silently drop finance functions (mitigated by `callableRegistry.test.ts` asserting the finance set) |

Other client-trust observations:
- No localStorage/sessionStorage of finance state found in the finance path (offline queue is IndexedDB, payload-only).
- Optimistic mutation: none in finance (BUG-023 is commitments; finance waits for commit) — good; but offline queueing acts as deferred optimistic mutation without reconciliation (FI-06).
- Mock/dev paths: `src/utils/seeder.ts` reachability still open from S-03 (not re-audited here); no Mono mock path found in production code.
- `FieldEncryption` is effectively dead (empty field lists by explicit design comment) — SEC-005 claims must not be read as active controls.

---

## 14. Account-deletion intersection (deepening A-04, finance portion only)

Cross-references auth audit A-04 (`05-AUTH-SECURITY-DOMAIN.md:204-209`); finance-specific evidence:

- **What survives deletion**: `audit_log` finance entries (intentional; contains uid); `rateLimits` docs; **provider-side Mono linkage** (no `unlinkAccount` call — FI-09); Storage artwork (per A-04); telemetry references.
- **What is deleted**: the entire `users/{uid}` tree — accounts, finance rows, ledger, bankConnections, activity, notifications. AnchorOS-side financial records do NOT survive; the finance materiality of A-04 is *provider-side and audit-side*, not Firestore-side.
- **Webhooks after deletion**: Mono keeps emitting `account_updated` for the still-linked item; `handleAccountUpdated` finds no `active` connection → logs, acks 200 forever. No error, no cleanup — permanent silent orphan traffic.
- **Orphaning**: none within Firestore (tree delete complete for finance); the orphan is at Mono (active data-sharing consent with no owning app record).
- **Shared/family impact**: `revokeSharedAccess` removes only V2 `sharedWith.{uid}` entries (`deleteAccount.ts:41-43`); **legacy `shares` map entries are NOT removed** — a deleted user's legacy grant persists as stale permission metadata on other users' accounts (harmless access-wise once the Auth user is gone, but corrupt share state survives). Transactions the deleted user created on shared accounts remain with `createdBy: deletedUid` — historically correct but references a deleted identity.
- **Severity impact on A-04**: unchanged (HIGH stands); finance evidence adds concrete provider-side data-sharing impact and the legacy-`shares` cleanup gap.

## 15. Failure-injection matrix (critical mutation paths)

| # | Scenario | Persisted result | Classification |
|---|---|---|---|
| 1 | `addTransaction` throws before batch.commit | nothing written | CONSISTENT |
| 2 | Batch commit succeeds; audit/ledger writes fail | rows + balance correct; no ledger/audit entry (silent) | CONSISTENT core / ORPHANED audit trail (FI-11) |
| 3 | Offline add: `withTimeout(10s)` fires after commit succeeded; entry re-flushed later | **two identical transaction rows, balance moved twice** | DUPLICATED (FI-06) |
| 4 | Delete transaction using stale client cache (amount changed on another device) | soft-delete flag set; **balance reversed by the wrong amount** | DRIFTED (FI-05) |
| 5 | Update transaction with `accountId` param ≠ tx's real account | tx updated; **correction applied to wrong account** | DRIFTED (FI-07) |
| 6 | Mono handler throws after replay-cache write | Mono retry acked `duplicate` → event lost | DRIFTED / silent (FI-01) |
| 7 | Mono API succeeds; local batch write fails (mid-sync crash) | bank state unchanged locally; no dedupe residue; next sync retries | RECOVERABLE |
| 8 | Local txn batch commits; balance overwrite fails (sync step 2 of 3) | rows imported, balance stale | RECOVERABLE (next sync) |
| 9 | Scheduled sync + manual sync run concurrently, same connection | **same external transactions imported twice** (different doc IDs); balance last-writer-wins | DUPLICATED (FI-18) |
| 10 | Sync overwrite interleaves with recurring scheduler increment on same account | increment lost; balance = bank value (recurring row remains) | DRIFTED (FI-04) |
| 11 | Retry after ambiguous result (user re-submits transfer) | second independent transfer (both atomic) — expected semantics, no dup-guard | CONSISTENT (by design; note only) |
| 12 | Client disconnect mid-transfer batch | batch either committed or not (atomic) | CONSISTENT |
| 13 | Stale client transfers to archived destination account | archived ≠ deleted → allowed (UX/policy gap); rules-deleted account → batch fails closed | CONSISTENT / gap |
| 14 | Owner archives account mid-shared-member operation | archive is not access revocation → operations still pass | CONSISTENT / policy gap (documented) |
| 15 | `addTransactionToSharedAccount`: txn add succeeds, balance update fails | row without balance effect; no retry | DRIFTED (manual recovery) |
| 16 | Recurring scheduler crash mid-run | per-rule batches atomic; unprocessed rules re-run via nextRunAt | CONSISTENT |
| 17 | User deletes AnchorOS account while Mono link active | Firestore finance state erased; Mono linkage alive; webhooks acked-forever | ORPHANED (FI-09) |
| 18 | Malformed monetary input (NaN/'abc'/'1e999') | `toCents` → 0 → form validation rejects (`<= 0`); rules int check | CONSISTENT (defended) |

## 16. Test evidence

Existing suites: `src/services/__tests__/{TransactionService,TransferOperations,AccountService,FinanceService*,serverRateLimit}.test.*`, `src/services/LedgerService.test.ts`, `src/hooks/useFinance{Service,Operations,Data}.test.*`, `useBankConnection.test.ts`, `functions/src/mono/transactionMapper.test.ts`, rules emulator suites (`src/__tests__/firestore-rules.*.emulator.ts`), `e2e/finance.spec.ts`.

| Critical invariant | Status | Evidence / gap |
|---|---|---|
| Cross-user finance access denied | **PROVEN** (rules emulator) | `firestore-rules.security.emulator.ts:48-76` IDOR suite; default-deny suite |
| Balance updates preserve invariants | **PARTIALLY PROVEN** | TransferOperations/TransactionService tests assert increment calls incl. linked sync (BUG-034/035/036 cases); mocked happy-path only |
| Transfers are atomic | **UNPROVEN** | no test exercises partial failure or concurrent interleaving; atomicity is a platform property, not test-proven |
| Duplicate request does not duplicate operation | **CONTRADICTED BY IMPLEMENTATION** | no idempotency anywhere; FI-06/FI-18 duplication windows |
| Webhook authenticity enforced | **UNPROVEN** | zero tests for `bankWebhook` (grep: only callableRegistry name list); FI-02 byte-correctness undetermined |
| Webhook replay is safe | **CONTRADICTED BY IMPLEMENTATION** | FI-01: retry-after-failure swallowed |
| Duplicate provider transaction deduplicated | **PARTIALLY PROVEN** | `transactionMapper.test.ts` covers dedupe filter logic; sequential only — concurrent case untested and broken (FI-18) |
| Pagination does not lose/duplicate transactions | **CONTRADICTED BY IMPLEMENTATION** | no pagination exists (FI-03); no test |
| Account unlink/delete handles provider state | **PARTIALLY PROVEN (unlink) / UNPROVEN (deletion)** | unlink flow untested; deleteMyAccount has no tests (A-04) |
| Malformed monetary values rejected | **PARTIALLY PROVEN** | `toCents` + form validation at component level; rules int-check untested in emulator finance suite |
| Concurrent updates cannot lose balance changes | **UNPROVEN** | no concurrency tests in finance |
| Net-worth calculations correct | **PARTIALLY PROVEN** | `finance.test.ts` covers `calculateNetWorth` incl. mixed currency; cash-flow currency-mix case absent |
| Liabilities treated correctly | **UNPROVEN** | no liability concept; no tests |
| Deleted/archived accounts do not pollute totals | **PARTIALLY PROVEN** | net worth excludes archived (tested); cash flow transaction-based (moot) |
| Skipped finance tests | tracked | `useFinanceService.test.tsx:216` (sort order), `:432` (**delete reverses balance**), `e2e/finance.spec.ts:55` — F-02/F-03; the delete-reverses-balance skip directly masks the FI-05 class |

## 17. Confirmed findings

Format: ID · title · severity hypothesis · confidence · components · evidence · invariant/actual · scenario · impact · mitigations · test status · remediation direction.

### FI-01 · Webhook replay cache marks events processed before handling → legitimate Mono retries permanently lost · HIGH · high confidence
- **Components**: `functions/src/bankWebhook.ts:27-37,56-64,77-88`; `webhookHandlers.ts`.
- **Flow**: POST → signature OK → `isReplayEvent(fingerprint)` writes `webhook_events/{fp}` → `handleAccountUpdated` runs → throws → 500 → Mono retries → fingerprint exists → `200 {duplicate:true}`.
- **Expected**: event marked processed only after successful processing. **Actual**: mark-then-process; failure between the two is unrecoverable via the retry channel.
- **Scenario**: `account_updated` during a transient Firestore/Mono outage → 500 → retry swallowed → webhook-driven refresh lost silently.
- **Impact**: silent stale financial state until the next 6h poll — and only within the single-page window (FI-03). **Mitigations**: none (the 6h poll is accidental). **Tests**: none. **Remediation direction**: record attempt vs completion separately; release the replay claim on handler failure; make processing idempotent instead of pre-deduping.

### FI-02 · Webhook HMAC computed over re-serialized JSON instead of raw request bytes · HIGH (correctness) · high confidence (code) / impact UNVERIFIED (UH-01)
- **Components**: `functions/src/bankWebhook.ts:47`.
- **Evidence**: `const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)` — Firebase v2 parses JSON into objects; the byte-faithful `req.rawBody` exists, unused. HMAC over re-serialized bytes ≠ signature over original bytes whenever serialization differs (whitespace, escapes, number formats).
- **Expected**: verify over exact received bytes. **Actual**: fail-closed 401 on byte divergence → channel may be entirely non-functional in production, or functional only by serialization luck.
- **Impact**: loss of the real-time sync channel; no forgery path (fails closed). **Tests**: none. **Remediation direction**: use `req.rawBody`; contract tests with captured fixtures; metric on signature failures.

### FI-03 · Mono transaction sync has no pagination, cursor, or checkpoint — transactions beyond the first response page are never imported · HIGH · high confidence
- **Components**: `mono/monoClient.ts:65-77` (options never set by callers); `bankSyncConnection.ts:33`; `webhookHandlers.ts:34`; `mono/monoTypes.ts:48-56` (`paging` typed, ignored).
- **Expected**: sync captures all provider transactions since last checkpoint. **Actual**: single default page per sync; no `start`/`end` window; no cursor; no `paging.total` vs imported-count check.
- **Scenario**: active account exceeding one page between syncs (or historical backfill at link) → overflow rows never appear while the authoritative balance reflects them → permanent hidden divergence.
- **Impact**: missing history; wrong insights. Page size UNVERIFIED (UH-02). **Tests**: none. **Remediation direction**: follow `paging.next`; persist cursor/lookback; alert on total-vs-imported mismatch.

### FI-04 · Linked-account balance overwrite races with other balance writers (no concurrency control) · MEDIUM · high confidence
- **Components**: `bankSyncConnection.ts:80-86`; `webhookHandlers.ts:64-68`; interleaves with `recurring.ts` increments and client batches on shared linked accounts (transact-perm members may add rows to linked accounts).
- **Invariant**: each balance change applied exactly once. **Actual**: blind `update({balanceCents})` from a pre-commit read → concurrent increments lost; their rows persist (inflating income/expense derivations).
- **Scenario**: daily recurring expense at 00:00 vs a 6h sync overwrite on the same account → row exists, balance effect erased.
- **Mitigations**: none (no txn/lock). **Tests**: none. **Remediation direction**: derive linked balance from row-sum or reconcile overwrite vs row delta; serialize syncs per connection (FI-18).

### FI-05 · Transaction deletion reverses balance from client-memory snapshot, not the persisted document · MEDIUM · high confidence
- **Components**: `src/services/TransactionService.ts:104-131` (`txToDelete` from caller's array; only the *linked* doc is re-read inside `runTransaction`); entrypoint `useFinanceOperations.deleteTransaction` passes React state.
- **Invariant**: delete reverses exactly the persisted contribution. **Actual**: stale cache (edited on another device / changed between fetch and delete) → wrong `balanceAdj`.
- **Scenario**: device A edits 5.00→50.00; device B (cached 5.00) deletes → balance reversed by −5.00 instead of −50.00 → 45.00 drift.
- **Mitigations**: rules check permissions, not amounts. **Tests**: the test that would exercise this is skipped (`useFinanceService.test.tsx:432`). **Remediation direction**: read the persisted doc inside the transaction/batch and reverse from it (the BUG-035 pattern already used for the linked doc).

### FI-06 · Offline queue is at-least-once with no idempotency key → duplicate transactions and double balance mutation after ambiguous timeout · MEDIUM · high confidence
- **Components**: `src/utils/offlineQueue.ts` (`processQueueForUser` re-queues on any throw); `useFinanceOfflineSync.ts` (`withTimeout(…, 10_000)` around the commit); `useFinanceOperations.addTransaction` offline branch.
- **Invariant**: a queued financial operation applies at most once. **Actual**: commit succeeds server-side but exceeds 10s client-side (or drops post-commit) → throw → entry retained → re-submitted later → second row + second balance delta. No client dedupe key in the payload.
- **Impact**: duplicated expenses/income and wrong balances — most likely on flaky mobile connections (the feature's target population). **Tests**: none for timeout-retry. **Remediation direction**: client `requestId` per payload, enforced unique at flush (query-before-write or deterministic doc ID).

### FI-07 · Transaction update applies balance correction to the caller-supplied `accountId` without verifying the transaction's own account · MEDIUM · high confidence
- **Components**: `src/services/TransactionUpdateOps.ts:24-57` — tx doc is read but its `accountId` never compared with the parameter; correction lands on `accounts/{accountId}`; `canEditTransaction` also evaluates the parameter account.
- **Invariant**: corrections hit the transaction's real account. **Actual**: stale/incorrect param → delta moved to the wrong account (within-permission; rules independently enforce manage-perm on the persisted `resource.data.accountId`, so no cross-permission escalation).
- **Scenario**: UI/stale list passes wrong accountId → two accounts drift in opposite directions.
- **Tests**: none for mismatch. **Remediation direction**: use `txDoc.accountId` (+ its owner) for the correction; reject mismatches.

### FI-08 · Imported transactions are never updated, corrected, or removed after import · MEDIUM · high confidence
- **Components**: `bankSyncConnection.ts:50-63` + `webhookHandlers.ts:37-49` (existence-only dedupe); no update path for `source:'synced'` rows.
- **Invariant**: imported state reflects provider state or is marked stale. **Actual**: bank-corrected amounts/dates never propagate; bank-deleted/reversed transactions persist indefinitely; only balance self-corrects.
- **Impact**: permanently stale history; insights computed from wrong amounts. **Tests**: none. **Remediation direction**: upsert-by-`externalTransactionId` (deterministic doc ID or update pass); honor provider deletions per retention policy.

### FI-09 · `deleteMyAccount` never revokes the Mono connection — provider-side data access survives user deletion · MEDIUM (privacy/compliance) · high confidence
- **Components**: `functions/src/deleteAccount.ts` (no `monoUnlink` import/call); contrast `bankUnlink.ts:37-41`.
- **Actual**: user tree (incl. `bankConnections`) deleted; Mono item remains authorized at the provider; subsequent webhooks acked 200 forever (`webhookHandlers.ts:16-19`).
- **Impact**: bank data remains accessible/refreshable at Mono with no owning AnchorOS record (cross-ref A-04/U-04). **Tests**: none. **Remediation direction**: enumerate connections before tree delete; best-effort provider unlink as in the unlink flow.

### FI-10 · Shared-transaction callable trusts client-supplied `accountOwnerId`, treats ownerless accounts as owned-by-anyone, and skips server-side amount validation · MEDIUM · high confidence
- **Components**: `functions/src/sharedTransactions.ts:44-69,76-103`.
- **Evidence**: `sentOwnerId` from `request.data` selects the account path; `isOwner = accountData.ownerId === callerUid || !accountData.ownerId`; `amountCents`/`type` written via Admin SDK with no shape/range validation (bypasses rules' `amountCents >= 0` — a negative 'expense' would raise the balance).
- **Invariant**: ownership and amount validity enforced server-side. **Actual**: ownership is checked on a client-chosen path but against the real account doc (cross-user write still requires a genuine grant — not an IDOR); ownerless accounts (presence in production data UNVERIFIED — UH-04) would be transactable by any caller; not-found vs permission-denied = enumeration oracle.
- **Tests**: none. **Remediation direction**: derive owner from the account doc (or require `sentOwnerId == accountData.ownerId`); reuse rules-equivalent validation server-side; uniform error responses.

### FI-11 · ARCH-022 ledger is not tamper-evident, is fire-and-forget, and is client-fabricable — integrity-control claims are unsupported · MEDIUM (claim-vs-reality) · high confidence
- **Components**: `src/services/LedgerService.ts:42-76`; `src/utils/hashUtils.ts` (`createHash` = FNV-1a variant, own docstring: "not cryptographically secure"); `config/firestore.rules:229-233` (owner create allowed); call sites `TransactionService.ts:74-80,139-146` (`void`, post-commit).
- **Invariant implied**: tamper-evident, complete mutation log. **Actual**: (a) unkeyed hash recomputable by any client → entries can be fabricated with valid-looking `integrityHash`; (b) writes swallowed on error, never transactional with the mutation → incomplete by design; (c) no verification job exists anywhere.
- **Impact**: ledger cannot serve audit, reconciliation, or forensics; no direct financial-state impact (append-only side log). **Tests**: shape-only (`LedgerService.test.ts` — hash length). **Remediation direction**: move ledger writes server-side into the mutation transaction with an HMAC key, or re-scope documentation to "best-effort activity log".

### FI-12 · Cash-flow derivations are currency-blind and count both transfer legs · LOW · high confidence
- **Components**: `src/utils/financeInsights.ts:17-46` (dashboard), `src/utils/finance.ts:109-140` (`calculateCashFlow` — also lacks `isSoftDeleted` filter).
- **Actual**: NGN and USD cents summed into one number; a NGN→USD transfer books an 'expense' and an 'income' → both inflate (net inflated by rate spread). Divergent from `calculateNetWorth`'s per-currency model.
- **Impact**: misleading dashboard numbers for multi-currency users or frequent transfers; no balance corruption. **Tests**: trend logic partially tested; no currency-mix case. **Remediation direction**: exclude `category==='Transfer'` (or `linkId` pairs); bucket by currency like net worth.

### FI-13 · `restoreSoftDeletedTransaction` applies client-supplied amount/type with no state guard; currently dead code · LOW · high confidence
- **Components**: `src/api/FinanceOperationsApi.ts:6-25`; `useFinanceOperations.restoreTransaction` → **no production caller found** (grep: only test mocks of the context field).
- **Actual**: restores with caller-passed amount/type (not the stored doc's) and no check that the row is actually soft-deleted → double-restore double-credits. Dead today; dangerous if revived. **Remediation direction**: delete, or re-implement reading persisted state with an `isSoftDeleted === true` guard.

### FI-14 · Currency-conversion rows are schema-inconsistent and forced to `scope:'family'` (family-readable personal data) · LOW · high confidence
- **Components**: `src/api/FinanceOperationsApi.ts:28-76`.
- **Actual**: created docs omit `isSoftDeleted`, `accountOwnerId`, `accountShares`; hardcode `scope:'family'` even for personal accounts → family-connected members can read the other party's conversion rows (rules finance-read `scope=='family'` branch); activity collection-group read rule (`accountOwnerId == uid`) never matches these rows.
- **Tests**: none. **Remediation direction**: align the writer with `TransferOperations` schema; scope per source account.

### FI-15 · Rules permit standalone `type:'transfer'` finance docs and zero-amount transactions · INFO · high confidence
- **Components**: `config/firestore.rules:14-19,303-305`.
- **Actual**: no linkage requirement for `type:'transfer'` (a lone transfer row moves no balance, pollutes history); `amountCents >= 0` admits zero-amount rows. **Remediation direction**: require `destinationAccountId`/`linkId` for transfer type; `> 0` for manual rows.

### FI-16 · Net-worth "total" is dominant-currency only; liabilities not modeled · INFO · high confidence
- **Components**: `src/utils/finance.ts:78-104`; `CreateAccountPayload` (no 'credit' option though rules allow it).
- **Actual/impact**: mixed-currency users see a single-currency "total" (documented F-017 decision; no FX); no liability concept — negative balances are the only proxy. Display-level concern.

### FI-17 · App Check enforcement is env-overridable; webhook intentionally App-Check-free · INFO · cross-ref U-02
- **Components**: `functions/src/callable.ts:9-13,41-47`.
- **Actual**: `ENFORCE_APPCHECK=false` disables enforcement even for prod project IDs (deployment env UNVERIFIED). `monoWebhook` correctly omits App Check (third-party caller) — HMAC is its only control, which raises the importance of FI-02's correctness.

### FI-18 · Sync dedupe is check-then-write — concurrent syncs double-import the same transactions · MEDIUM · high confidence
- **Components**: `bankSyncConnection.ts:50-78`; `webhookHandlers.ts:37-62`; triggers (6h schedule + `syncBankAccountNow` + webhook) share no lock/lease; no uniqueness constraint on `externalTransactionId`.
- **Invariant**: one imported row per external transaction. **Actual**: two concurrent executions read the same `existingIds` before either writes → both import → DUPLICATED rows (double-counted in derivations); balance self-corrects via last-writer overwrite.
- **Scenario**: user taps "Sync now" while the scheduled job is mid-run.
- **Tests**: none. **Remediation direction**: per-connection lease (transactional lock on the connection doc) or deterministic doc IDs (`{connectionId}_{externalTransactionId}`) making writes idempotent.

## 18. Unverified high-risk behaviors

- **UH-01 — Does the webhook signature ever validate in production?** FI-02's byte-fragility means the channel is either dead or lucky. Determinable only with a captured Mono request replayed against the deployed function (or a signature-failure metric). If dead: all real-time sync is silently absent and only the 6h poll works. HIGH information value.
- **UH-02 — Mono transactions page size vs 6h volume.** FI-03's practical loss rate depends on Mono's default page size. If small, even modestly active accounts lose history continuously.
- **UH-03 — Production secret configuration.** `MONO_WEBHOOK_SECRET` / `MONO_SECRET_KEY` presence/rotation state in Secret Manager unverifiable from the repo. No stop condition: no secret material is committed.
- **UH-04 — Ownerless accounts (`ownerId` missing) in production data.** FI-10's ownerless-account exposure requires legacy docs lacking `ownerId` (rules `isValidAccount` does not require the field). A production data audit would confirm/deny exploitability.
- **UH-05 — Mono `data_status` handling.** `getAccountDetails` returns `meta.data_status`; nothing checks it before trusting the balance — stale-provisioning states are silently accepted. Behavior with immature connections UNVERIFIED.
- **UH-06 — `linkBankAccount` double-submit.** Mono auth-code single-use likely prevents duplicate linking; not proven (check-then-write at `bankLink.ts:57-67`).

## 19. Auth-audit cross-references

| Auth finding | Finance deepening |
|---|---|
| A-04 (deleteAccount non-transactional, incomplete erasure) | §14: finance Firestore records ARE fully deleted with the user tree; surviving material is provider-side (FI-09: no Mono revocation; webhooks acked-forever) + audit_log/rateLimits/legacy-`shares` residue. Severity unchanged (HIGH). |
| U-04 (Mono references after deletion) | Confirmed as FI-09 — no unlink call exists in the deletion path. |
| U-02 (App Check env override) | Applies to every finance callable (FI-17). |
| F-02/F-03 (skipped finance tests) | The skipped delete-reverses-balance test directly masks the FI-05 class. |
| S-01 (FinanceContext @ts-nocheck) | §13 inventory extends S-01 to the full finance-critical suppression set. |

## 20. Domain reachability / dead code (finance-scoped)

- `monoClient.triggerSync` — defined, never called (dead).
- `restoreSoftDeletedTransaction` / `restoreTransaction` — no production caller (dead; FI-13 documents its hazards).
- `FieldEncryption` finance wiring — invoked by code path but a no-op (empty field lists); `VITE_FIELD_ENCRYPTION_KEY` config effectively dead.
- Duplicate implementations: `handleAccountUpdated` ≈ `syncConnection` (divergent copies of sync logic — the webhook copy lacks reconnect handling); `getCashFlowAnalysis` vs `calculateCashFlow`; net-worth aggregation re-implemented in Fabric queries (equivalence unverified).
- `monoTypes.MonoTransactionsResponse.paging` — typed but unused.
- Legacy permission model (`shares` map) still live in rules + `permissions.ts` + deleteAccount gap — dual-model maintenance burden.
- No orphaned finance test files found; `e2e/finance.spec.ts` is active but rendering-focused.

## 21. Recommended later remediation ordering (no remediation performed)

1. **FI-01 + FI-02** (webhook correctness): raw-body HMAC + post-processing replay semantics — prerequisite to trusting any webhook test.
2. **FI-03 + FI-18** (sync completeness & idempotency): pagination/cursor + per-connection serialization or deterministic import IDs.
3. **FI-05 + FI-07 + FI-13** (persisted-state reversals): compute all balance corrections from persisted docs inside the transaction; un-skip `useFinanceService.test.tsx:432` afterwards.
4. **FI-06** (offline idempotency key).
5. **FI-04 + FI-08** (reconciliation model for linked accounts).
6. **FI-09** (Mono revocation in deleteMyAccount — bundle with A-04 remediation).
7. **FI-10** (callable hardening), **FI-11** (ledger re-scope), **FI-12/14** (derivation fixes).

## 22. Evidence appendix (key excerpts verified by direct read)

- `bankWebhook.ts:10-21` HMAC/constant-time; `:27-37` replay txn; `:47` re-serialized body; `:56-64` duplicate→200; `:77-88` dispatch/ack.
- `webhookHandlers.ts:10-14` collectionGroup binding; `:51-68` batch import + balance overwrite; `:77-95` reauthorisation.
- `bankSyncConnection.ts:31-47` fetch/401 string-match; `:50-78` dedupe+import; `:80-88` balance/connection overwrite.
- `bankSync.ts:27-50` schedule loop, swallowed errors; `:56-88` callable ownership scoping.
- `bankLink.ts:44-67` auth/dup-check; `:78-112` account+connection creation (masked number only).
- `bankUnlink.ts:24-56` caller-scoped unlink, best-effort revoke.
- `monoClient.ts:65-77` unused query options; `:80-85` dead triggerSync.
- `transactionMapper.ts:60-90` mapping/dedupe (Math.round on amounts).
- `TransactionService.ts:53-64` batch; `:74-80` void ledger; `:104-134` delete paths; `:158-171` linked delete (BUG-035).
- `TransferOperations.ts:63-121` transfer pair + increments; `:126-167` standard path.
- `TransactionUpdateOps.ts:31-64` correction logic; `:79-107` linked sync (BUG-034).
- `FinanceOperationsApi.ts:6-76` restore/convert.
- `offlineQueue.ts:41-77` re-queue-on-failure; `useFinanceOfflineSync.ts` 10s timeout.
- `LedgerService.ts:42-76` unkeyed hash + swallow; `hashUtils.ts:1-20` FNV-1a.
- `firestore.rules:7-19` validators; `:216-233` bankConnections/ledger; `:238-284` accounts; `:289-313` finance; `:350-360` collection-group mirrors; `:388-390` default deny.
- `deleteAccount.ts:19-57,109-159` deletion tree; no Mono unlink (grep-verified).
- `sharedTransactions.ts:44-103` client ownerId + two writes.
- `recurring.ts` per-rule atomic batches; `recurringApi.ts` owner checks.
- Tests: `TransactionService.test.ts` (BUG-035 case), `TransferOperations.test.ts`, `finance.test.ts:98-150`, `LedgerService.test.ts`, `transactionMapper.test.ts`, `firestore-rules.security.emulator.ts:48-76`; skipped: `useFinanceService.test.tsx:216,432`, `e2e/finance.spec.ts:55`.
- Secrets: `git ls-files` env audit — only `.env.example` (placeholders) tracked; no Mono secret material in repo.

*End of 06-FINANCE-FINANCIAL-INTEGRITY.md*

















