# 07 — FAMILY / SHARED DATA ISOLATION — Forensic Domain Audit

Date: 2026-09-08 · Branch: `audit/whole-product-2026-09` · Base for this pass: `4de568a`
Scope: Family/household → membership → invitations → roles → shared accounts → shared finance → ownership → removal/revocation → data isolation → authorization consistency.
**AUDIT ONLY — no product code, rules, deps, or tests were modified.**

---

## ⛔ STOP CONDITION TRIGGERED (§20)

> **"Removed/revoked user retains authoritative access to sensitive data" — PROVEN at code level (FS-01, HIGH).**

After a family disconnect, the ex-member retains **rules-granted, authoritative read access** to the ex-partner's family-scoped account documents (including balances), all family-scoped finance rows, and — via a never-cleaned per-row index — every transaction row that existed on the shared account at the time of each write. Root causes, each verified by direct read:

1. `disconnectFamily` (`functions/src/familyDisconnect.ts:32-55`) marks the connection `status:'disconnected'` but **never deletes the connection document**, and never resets `scope:'family'` on previously shared accounts.
2. `isConnectedFamilyMember` (`config/firestore.rules:49-52`) tests **document existence only** — no `status == 'active'` predicate.
3. Rules therefore keep granting: account read when `scope=='family'` (`:243`), finance read when `scope=='family'` (`:300`), **all** of the ex-partner's `dashboard` docs (`:335`), and family-category commitments (`:329`).
4. Transaction rows written while the member had access embed `accountShares[memberUid]` (`src/services/TransferOperations.ts:69-91`, `:160`) which no revocation path ever removes — the finance read rules at `:298` and the collection-group mirror at `:358-360` honor it forever.

Per the task's stop conditions: **documented exactly, not remediated.** The rest of this report completes the domain map and records all other findings; no stop condition other than FS-01 triggered (invite takeover, cross-family write, privilege escalation, unauthenticated private-data access: none found).

---

## 1. Executive summary

AnchorOS "Family Mode" is **not a multi-member household**. It is a **pairwise 1:1 connection** (owner ↔ single member, V2 `family_connections`) with an invitation pipeline built on Firestore auto-ID "tokens" plus a bcrypt-hashed 6-digit verification code, and an account-sharing overlay (`sharedWith` map on the owner's account docs) whose effective permission is **always `transact`**. A V1 model (`spouseId` + users-side `family/config` + legacy `shares` account map) still exists in rules, seeder, dev-tools, and two migration paths.

The invitation/confirmation pipeline is **structurally sound** — server-side-only writes (rules deny all client writes to `family_invitations`/`family_connections`), email-binding of the accepting account (verified email must equal `inviteeEmail`), bcrypt-coded one-time secret with 5-attempt lock, owner-only confirm, server-side expiry/revocation/lock checks. **No realistic unauthorized family takeover was found.**

Isolation, however, is **weaker than the connection lifecycle implies**, because authorization is spread across **four overlapping grants** — `sharedWith` (V2), `shares` (legacy), `scope=='family'` (per-doc flag), and embedded `accountShares` per-row indexes — evaluated by rules that treat **connection-doc existence** as the family predicate. Only the `sharedWith` channel is revoked on disconnect; the other three survive it. The result is the FS-01 revocation failure above: cleanup of the strongest, most explicit grant (`sharedWith`) masks persistence of the weaker, broader, implicit ones.

Verdict summary:

| Question | Verdict |
|---|---|
| Can an unauthenticated party read family/invitation state? | **Not the private data** — invites/connections read-restricted to parties; `validateInvitationToken` lacks an auth check but is App-Check-gated by default in prod and returns only display-name/expiry (FS-07). |
| Can a valid invite be reused, raced, guessed, or accepted by an unintended account? | **Not realistically** — email-verified binding + bcrypt 6-digit code + 5-attempt lock + server-side status checks; double-accept blocked by status; cross-account accept blocked by email uniqueness. Residuals: FS-07 (validity oracle), FS-12 (third-party lockout), code returned to inviter client (FS-12 note). |
| Can a member read private data beyond the share? | **YES, post-revocation (FS-01)** — scope/index-based reads survive disconnect. During an active connection, reads of family-scoped accounts/finance/commitments/dashboard are the intended model. |
| Can a member write beyond their share? | **Not via rules** — writes re-resolve the account doc and require manage/transact (sharedWith/shares-keyed); FI-10 callable is the exception class (FS-05, deepened). |
| Can the two permission models (`shares`/`sharedWith`) disagree into broader access? | **Yes (FS-02)** — legacy `shares` is read by rules + client but **revoked by no server path**; drift is one-way (revocation can never catch up). Exploitability requires legacy data (UH-F01-class). |
| Does account deletion clean family state? | **Better than disconnect** — connection docs are deleted (killing existence-based grants), but legacy `shares` grants given to the deleted user persist as stale metadata, and awaiting-confirmation invites addressed to the deleted user persist (deepens A-04, §15). |
| Is there family-scoped Fabric/AI exposure? | **No** — fabric collections are owner-only RW; "family" insights are client-derived from shared transactions the user already has read access to (§11). |

---

## 2. Family architecture / data-flow map

### 2.1 Canonical V2 implementation (the live product)

**Household shape**: exactly two parties. `family_connections/{ownerUid_memberUid}` (`functions/src/familyConnectionConfirm.ts:61-71`). One active connection per user is enforced only at invite-creation time (`familyInvitations.ts:40`) — **not** at confirm time (FS-03). Roles: connection `owner` and `member`; **no admin/manager roles exist** anywhere in the product.

**Invitation flow (UI → Function → Firestore):**

```text
InviteFamilyMember.tsx (Settings)                      [client, @ts-nocheck]
  → reauthenticateWithCredential (client-side only)
  → httpsCallable('createFamilyInvitation')
    → familyInvitations.ts: pending-invite dedupe (same owner+invitee),
      active-connection guard, getActiveConnection(ownerUid) check
    → family_invitations/{autoId} = {ownerUid, ownerEmail, ownerDisplayName,
      inviteeEmail, status:'pending', verificationCodeHash (bcrypt),
      verificationAttempts:0, expiresAt:+7d}
    → queueEmail(invite link /accept-invite?token={autoId} + 6-digit code)
    → returns {inviteId, verificationCode} to the INVITER'S client (FS-12)

AcceptInviteView.tsx (/accept-invite?token=)           [client, @ts-nocheck]
  → httpsCallable('validateInvitationToken')  ← NO auth check (FS-07)
  → user signs in/up; httpsCallable('acceptInvitation', {inviteId, code})
    → familyConnection.ts: status/locked/expiry checks server-side,
      verified-email == inviteeEmail binding (case-normalized), bcrypt compare,
      5 failed attempts → status:'locked', success → status:'awaiting_confirmation'
      + inviteeUid stamped on invite
  → owner Settings → PendingConfirmation.tsx
    → reauthenticate (client) → httpsCallable('confirmConnection', {confirmed})
      → familyConnectionConfirm.ts: ownerUid match, status check,
        connection set (id = ownerUid_inviteeUid, status:'active'),
        invite → 'accepted', notifications to both parties
```

**Sharing flow:** owner Finance → AccountCard → `useFamilySharing.shareAccount` → `FamilyConnectionApi.shareFamilyAccount` → httpsCallable(`shareAccount`) → `familySharing.ts:22-82`: `getActiveConnection` (status=='active') + owner-side check → account `{sharedWith.{memberUid}:{grantedAt,grantedBy,permission:'transact'}}` **+ `scope:'family'` (never unset)** → notification + audit log.

**Shared-finance read/write (member side):** `useSharedAccounts` → httpsCallable(`getSharedAccountsWithMe`) (collectionGroup over `sharedWith.{uid}.grantedAt`) → direct Firestore subscriptions to `users/{ownerUid}/finance` and `.../accounts/{id}` (`SharedAccountSubscriptionsApi.ts`) — authorized by rules' `sharedWith`/`accountShares`/`scope=='family'` predicates, **not** by any server filter. Writes go through the **plain client path** (`TransactionService.addTransaction` → rules `hasTransactPermission`), *not* through `addTransactionToSharedAccount` (no client caller found — grep across `src/`: only function registry/contracts/tests reference it). Disconnect/leave: `FamilySettingsV2.handleDisconnect` → `disconnectFamily` callable.

### 2.2 Legacy / parallel mechanisms (all still wired)

| Mechanism | Surface | Status |
|---|---|---|
| V1 `users/{uid}/family/config` (`spouseId`) | rules `:156-160` (owner RW), `seeder.ts:26-34`, `migrateFamilyConnectionsV2` + migration framework `001_family_v2` | Legacy; readable/writable by owner; feeds migration |
| Legacy `shares` map on account docs | rules `hasLegacyPermission` (`:127-129`, `:134/:141-142`, `:241`), client `permissions.ts:19-22`, initialized `{}` by `AccountService.addAccount`, written only by seeder/dev-tools | **Live in authorization, dead in revocation (FS-02)** |
| `addTransactionToSharedAccount` callable | `sharedTransactions.ts`, registered in finance registry, callable contracts test | **No client caller** — orphaned privileged path, still deployable (FS-05) |
| `fixSharedAccountScopes` callable | dev-tools "Fix Now" button | Live, self-scoped |
| DevTools family simulation | `SimulateFamilyAction` / `AutoAcceptInvitationAction` | `VITE_APP_ENV !== 'production'` gated (`SettingsView.tsx:196`); AutoAccept is **rules-impossible** client-side (orphaned) (FS-09) |
| `migrateFamilyConnectionsV2` callable | registry marks `deprecated` → replaced by `runMigration('001')` | Legacy residue |

---

## 3. Family data model

| Resource (path) | Owner / parties | Authoritative membership source | Authoritative role source | Writers | Readers | Lifecycle / deletion | Notes |
|---|---|---|---|---|---|---|---|
| `family_connections/{ownerUid_memberUid}` | both parties | **AUTHORITATIVE membership+role record** (`status:'active'`) | `ownerUid` vs `memberUid` | Admin SDK only (`confirmConnection`, `disconnectFamily`, migrations, deleteAccount) | rules: parties only (`:93-95`); client subscriptions (`FamilyConnectionApi`) | disconnect = status-update (**doc retained**); account deletion = doc deleted | Existence-based rules consumers ignore status (FS-01) |
| `family_invitations/{autoId}` | owner (creator), invitee (by email/uid) | invitation lifecycle state | `ownerUid` only | Admin SDK only | rules: owner, or invitee by `inviteeEmail == token.email` / `inviteeUid` (`:79-82`) | accepted/locked/revoked/expired → status flips; scheduled job deletes >30d-old (`familyTriggers.ts:122-129`); deleteAccount deletes owner-invites + email-matched invitees | `inviteeUid` stamped only at accept |
| `users/{uid}/accounts/{id}.sharedWith` | account owner | derived grant (revocable) | `sharedWith[uid].permission` ('transact' only value ever written by V2) | `shareAccount` callable, `disconnectFamily` (remove), `deleteAccount.revokeSharedAccess` (remove), devtools (drifted shape, FS-09) | rules (`:242`, `:255-262`, `:275-279`, `:293`), collection-group mirror `:350-352`, client `permissions.ts`, `getSharedAccountsWithMe` | removed on disconnect/unshare/deleteAccount | The **only** fully revocable grant |
| `users/{uid}/accounts/{id}.shares` | account owner | **legacy grant** | value string 'manage'/'transact' (write), any non-null (read) | NO server writer; seeder (`seeder.ts:51`), devtools; initialized `{}` at create | rules (`:134/:141-142`, `:241`), client `permissions.ts:19-22` | **never removed by any revocation path** | FS-02 |
| `users/{uid}/accounts/{id}.scope` | account owner | **implicit family-broadcast flag** | — | `shareAccount` (sets 'family'), `fixSharedAccountScopes`, client account create (personal/family), seeder, devtools | rules account/finance read branches (`:243`, `:300`) | **never reset by disconnect/unshare** | FS-01 |
| `users/{uid}/finance/{txId}.accountShares` | account owner | **per-row frozen snapshot** of both share maps at write time | — | client `TransferOperations`/`processStandardTransaction` (both maps' keys); FI-10 callable **omits** it | rules `:298`, collection-group mirror `:358-360` | never updated/cleaned after grants change | Stale-index read grant survives revocation (FS-01b) |
| `users/{uid}/finance` rows | path owner | path = resource owner | — | client (owner/member via rules), Admin SDK (FI-10 callable, bank sync) | owner + rules predicates above | soft-delete flag; no cascade on family events | `scope:'family'` rows are family-readable regardless of grant (FI-14/FS-06) |
| `users/{uid}/commitments/{id}` | task owner | path owner | — | owner only (rules `:330-331`) | owner + `category=='family'` && isConnectedFamilyMember (`:329`) | owner-only delete | Read-only family sharing; `category` is owner-declared |
| `users/{uid}/dashboard/**` | user | path owner | — | owner only (rules `:336`); **no client writer found in src/** | owner + isConnectedFamilyMember (`:335`) | — | Existence-based read of partner's whole dashboard subtree (FS-01/§12); data presence UNPROVEN |
| `users/{uid}/notifications` | recipient | path owner | — | Admin SDK (family events, triggers); owner create/update-flag | owner only | dismissed/read flags; no cascade on family removal | Stale notification residue after removal (§15) |
| `users/{uid}/family/config` (V1) | user | legacy | `spouseId` | owner (rules `:159`), seeder, devtools | seeder, migration | never cleaned by V2 disconnect | V1 residue |
| `users/{uid}/activity` + `accounts/{id}/activity` | account owner | path owner | — | owner or sharedWith member (rules `:274-279`); client `activityLogger` (client-supplied actorId/actorName) | owner (nested `:274`), collection-group `:367-370` (`accountOwnerId==uid`) | append-only | Spoofable attribution within-permission (FS-08) |

### 3.1 Duplicated representations — which copy is authoritative?

| Representation | Copies | Authoritative? |
|---|---|---|
| Membership | `family_connections` doc (status) · rules' existence test · client `connection` snapshot state | **`family_connections` doc** — but rules degrade it to existence (FS-01); client UI uses its own snapshot (stale-UI only) |
| Role (family) | `ownerUid`/`memberUid` fields | connection doc fields — single source, OK |
| Resource ownership | `accounts/{id}` path segment (`users/{uid}`) · `ownerId` field · finance-row `accountOwnerId` | **path segment** (rules key on path; `ownerId` defaults to path in `accountOwnerUid` `:119-121`); `accountOwnerId` on rows is advisory (never validated against path — FI-10) |
| Share grant | `sharedWith` map · `shares` map · `scope=='family'` · `accountShares` per-row | **`sharedWith`** is the only governed grant; the other three are un-revoked shadows → architectural risk recorded (FS-02/FS-01) |
| Share grant (row mirror) | `accountShares` on finance rows | derived snapshot — **drifts by design**, never reconciled |
| Family ID | connection doc ID (`ownerUid_memberUid`) | single source; but rules never need it (existence test uses both UID orders) |

**Recorded architectural risk:** the code does not establish one authoritative share grant. Four representations coexist; exactly one is revocable. Every revocation finding below follows from this.

---

## 4. Membership lifecycle (transitions 1-16)

| # | Transition | Frontend initiator | Backend / write | Auth | Authorization | Tx boundary | Failure states observed | Tests |
|---|---|---|---|---|---|---|---|---|
| 1 | Create family (invite) | `InviteFamilyMember` (re-auth client-side) | `createFamilyInvitation` — invite doc set | yes | caller is inviter; verified own email | none (sequential) | email-queue failure still returns code (FS-12); dedupe check-then-write race → two invites to same email | none (unit) — e2e validates UI only |
| 2 | Validate invite link | `AcceptInviteView` | `validateInvitationToken` — read-only | **none in handler** (FS-07); registry says 'required' | n/a (read) | read-only | n/a | none |
| 3 | Accept invite | `AcceptInviteView` | `acceptInvitation` — invite update | yes | verified email == `inviteeEmail` (case-normalized); status=='pending', not locked, not expired | none | non-transactional get-then-update; attempt-counter lost-update race on concurrent wrong codes | 1 unit test (wrong-email rejection) |
| 4 | Failed code ×5 | — | `acceptInvitation` — status→'locked' | yes | n/a | none | lock is terminal; **any party knowing the inviteId can burn the 5 attempts and lock the invite (FS-12)** | none |
| 5 | Confirm connection | `PendingConfirmation` (re-auth client-side) | `confirmConnection` — connection set + invite update | yes | `invite.ownerUid == caller`; status=='awaiting_confirmation'; inviteeUid present | **none — two separate writes** | partial failure → connection exists, invite still awaiting (retry heals); **no active-connection guard → second household possible (FS-03)** | none |
| 6 | Reject connection | `PendingConfirmation` | `confirmConnection(confirmed:false)` — invite→'rejected' | yes | owner only | single update | invitee notification depends on inviteeUid present | none |
| 7 | Revoke invite | `PendingConfirmation` (cancel) | `revokeInvitation` — invite→'revoked' | yes | owner only; status=='pending' | single update | revoked invite rejects accept + validate | none |
| 8 | Expiry | scheduled `cleanupExpiredInvitations` daily 03:00 + accept-time check | status→'expired'; >30d → delete | n/a | status query | per-batch | between expiry and 03:00 job, accept-time check still rejects (server-side) — correct | none |
| 9 | Share account | `AccountCard` → `useFamilySharing` | `shareAccount` — account update | yes | `connection.ownerUid == caller` (owner-side only); active connection | single update | **race vs disconnect → orphaned grant (FS-04)**; `scope:'family'` set permanently | e2e skipped (F-03) |
| 10 | Unshare account | `AccountCard` | `shareAccount(share:false)` | yes | owner only; active connection | single update | `sharedWith` removed; `scope:'family'` **retained**; row `accountShares` retained (FS-01b) | e2e skipped |
| 11 | Member leaves / owner removes | `FamilySettingsV2.handleDisconnect` | `disconnectFamily` — connection→'disconnected' + batch remove `sharedWith[memberUid]` from owner's accounts | yes | either party; role inferred server-side | **none — two phases** (status update, then grant batch) | **scope/accounts/rows/dashboard grants survive (FS-01)**; grant-removal batch failure after status flip → sharedWith retained with no connection (ORPHANED; no retry — re-disconnect precondition fails) | rules emulator tests post-disconnect — but only the `sharedWith` branch (§18) |
| 12 | "Ownership transfer" | **does not exist** | — | — | — | — | No transfer path for connection owner OR account ownership; account owner fixed at creation | n/a |
| 13 | Family deletion | **does not exist** | closest = disconnect | — | — | — | n/a | — |
| 14 | Account deletion, ordinary member | DangerZone → `deleteMyAccount` | `revokeSharedAccess` (remove sharedWith[uid] grants **given to** user) + `deleteFamilyArtifacts` (connections owner+member queries, invites owner + email match) + user tree delete | yes + 5-min reauth | self only | chunked batches, non-transactional (A-04) | **connection-doc deletion kills existence-based grants correctly** (unlike disconnect); legacy `shares[deletedUid]` retained on others' accounts; `awaiting_confirmation` invites with `inviteeUid=deleted` persist (§15) | none (A-04) |
| 15 | Account deletion, family owner | same | as above — member side loses existence-based grants automatically; owner's accounts deleted with tree | same | same | same | member retains NOTHING rules-authoritative from owner's family scope (docs gone) — correct | none |
| 16 | Account deletion, invite creator | same | owner-invites deleted; owner-connections deleted | same | same | same | invites where deleted user was **invitee** persist if their auth email ≠ `inviteeEmail` (renamed email) — stale pending invite to a possibly-recycled address (LOW, §15) | none |

**Duplicate-acceptance across accounts:** impossible by email uniqueness in Firebase Auth + verified-email binding (`familyConnection.ts:58-62`); the single unit test covers exactly this.

**Leave/remove races:** both parties calling `disconnectFamily` concurrently → first flips status, second gets "No active family connection" → CONSISTENT. Removal concurrent with member's shared-record write → write is rules-checked against `sharedWith` at write time; if it lands before the removal batch commits, the write succeeds and the grant is then removed (write remains, grant gone) → CONSISTENT for the future, no cleanup of the created row's `accountShares` (FS-01b applies).

---

## 5. Invitation security

| Property | Finding |
|---|---|
| Invite identifier | Firestore auto-ID (20-char, high-entropy) used directly as `token` in `/accept-invite?token=` URL. Embedded in invitation email; URL/referrer leakage caveat noted (not observed exploitable). |
| Secret | 6-digit numeric code, `randomInt(100000, 999999)` (`helpers.ts:12-14`) — ~2^20 space; **bcrypt-hashed at rest**; delivered by email **and returned in the `createFamilyInvitation` response to the inviter's client** (FS-12). |
| Expiration | +7 days; checked server-side at accept (`familyConnection.ts:49-52`) and in validation; daily cleanup marks/deletes. **Expired invites are actually rejected server-side.** |
| One-time use | status machine pending→awaiting_confirmation→accepted; accept rejects non-pending. Pending invites whose owner deletes their *account* are deleted with it (deleteAccount). No path leaves a valid invite pointing at a deleted family — n/a in a 1:1 model. |
| Recipient/email binding | **Strong**: accept requires `email_verified` AND `auth.token.email == inviteeEmail` (lowercased, trimmed) (`familyConnection.ts:54-62`). |
| Role encoded in invite | None — role is fixed by `shareAccount` post-connection ('transact'). **No role-escalation-during-acceptance path exists** (invite carries no role; member cannot modify invites — client writes denied by rules `:84`). |
| Replay | code single-use via status transition; double-accept idempotent for same uid. |
| Brute force | 5 attempts (bcrypt compare) → `status:'locked'`; `codeVerification` rate limit 5/15min keyed by **inviteId** (`familyConnection.ts:32`, `rateLimit.ts:19`). Keyed per-invite: any authenticated party knowing the inviteId can deliberately exhaust attempts and lock someone else's invite (FS-12, LOW). |
| Revocation | `revokeInvitation` owner-only, pending-only; validate + accept both reject 'revoked'. |
| Enumeration | `validateInvitationToken` has **no `request.auth` check** despite registry `auth:'required'` — unauthenticated validity oracle per exact inviteId (locked/revoked/accepted/expired distinctions), returning `ownerDisplayName` + expiry. Mitigated by default App Check enforcement in prod/staging (cross-ref FI-17/U-02) + `tokenValidation` rate limit keyed by token. FS-07 (LOW). |
| Logging | comprehensive audit_log entries (created/revoked/locked/failed/success), PII-key scrubbing in metadata (`helpers.ts:52-78`). |
| Removed users rejoining via old invites | accepted/revoked invites are dead; a *removed* (disconnected) member can be re-invited via a fresh invite — intended. Old invite IDs are never resurrected. |

**Direct answer:** *Could a valid invitation be reused, transferred, guessed, raced, or accepted by an unintended account?* **No realistic path found.** Transfer requires the invitee's verified email account; guessing requires the auto-ID *and* the 6-digit code with a 5-attempt budget; racing is bounded by the status machine. Residual weaknesses: FS-07 (oracle), FS-12 (code-to-inviter-client; third-party lockout).

---

## 6. Role / privilege model and authorization matrix

Roles that exist: **connection owner**, **member** (effectively `transact` on shared accounts), **legacy `shares` grantee** ('manage'/'transact'/'read' strings). There are no admin/manager/viewer/editor roles. UI-visible roles map 1:1 to these.

| Action | UI gate | Firestore rules | Backend function | Effective layer |
|---|---|---|---|---|
| View family/connection | `FamilyConnectedState` | connection read: parties only (`:93-95`) | — | rules + UI |
| View member list | same | same | — | rules + UI |
| Invite user | owner-side button hidden if connection exists | invite writes: **false** | `createFamilyInvitation` (active-connection guard) | function (UI hide not load-bearing) |
| Revoke invite | owner UI | writes false | `revokeInvitation` (owner only) | function |
| Confirm/reject connection | owner UI (+ client re-auth) | writes false | `confirmConnection` (owner only; **no server re-auth** — password field ignored, FS-10) | function |
| Remove member / leave | `FamilySettingsV2` | writes false | `disconnectFamily` (either party) | function |
| Change role | **no UI exists** | — | — | not a product capability |
| Transfer ownership | **no UI exists** | — | — | not a product capability |
| Delete family | no distinct capability | — | `disconnectFamily` | function |
| View shared account | `useSharedAccounts` | `:240-243` (owner / shares / sharedWith / scope+existence) | `getSharedAccountsWithMe` (sharedWith-keyed) | rules (function is redundant read) |
| Create shared transaction | `TransactionService` + `canAddTransaction` (UI) | `hasTransactPermission` (`:303-305`) | FI-10 callable (no client caller) | **rules** (UI check cosmetic) |
| Edit/delete shared transaction | `canEdit/DeleteTransaction` (UI) | `hasManagePermission` on persisted `resource.data.accountId` (`:308-312`) | — | **rules** (member with 'transact' cannot — correct) |
| Share personal account | `useFamilySharing` | account update manage-perm with sharedWith/shares **frozen** (`:255-256`) | `shareAccount` (owner only) | function + rules |
| Revoke account share | `shareAccount(false)` | same | same | function + rules |
| View shared commitments | `CommitmentsView` category filter | `:329` (family category + existence) | — | rules |
| Edit/delete commitments | UI | **owner-only** (`:330-331`) | — | rules (family read ≠ family write) |
| Family-scoped Fabric/AI data | — | fabric_* owner-only (`:186-214`) | — | rules (no family scope) |
| View notifications/security events | bell + `FamilyNotificationApi` | `:318-326` recipient-only | Admin SDK writes | rules |

**Permissions enforced only in UI:** none load-bearing for writes — every mutating path re-verifies in rules or a callable. UI-only state: `canAddTransaction`/`permissions.ts` (cosmetic pre-checks), `useFamilySharing.isOwner` (UI affordance), `FamilySettingsV2` disconnect confirmation. Note `permissions.ts` — the entire client permission model — is `@ts-nocheck` (§17).

---

## 7. `shares` vs `sharedWith` — dual permission model (priority investigation)

**Verdict: ACTIVE DUAL ARCHITECTURE, not dead residue.** Both fields are read by the live ruleset and the live client permission model; exactly one is written by the live product; **neither legacy writer nor any revocation path keeps them convergent.**

### 7.1 Field-by-field trace

**`sharedWith` (V2)**
- **Created**: `shareAccount` callable (`familySharing.ts:54-61`) — always `permission:'transact'`, and simultaneously sets `scope:'family'`. Devtools `SimulateFamilyAction` writes a drifted shape (`role:'transact'` — wrong key, no `grantedAt`) (FS-09).
- **Read**: rules — account read (`:242`), manage-perm (`:124-125`, `:134-136`), transact-perm (`:138-145`), share-freeze comparisons on update (`:255-262`), activity nested rules (`:275-279`), finance `isSharedAccountMember` (`:290-294`), collection-group account mirror (`:351`); functions — `getSharedAccountsWithMe` (query), `revokeSharedAccess` (query), `onSharedTransactionWrite` (notification targets), FI-10 callable; client — `permissions.ts:15-17`, `useSharedAccounts`, `financeActivityLogging`.
- **Updated/removed**: `shareAccount(false)` (`:70`), `disconnectFamily` (`familyDisconnect.ts:48-53`), `deleteAccount.revokeSharedAccess` (`deleteAccount.ts:40-57`). **All three remove only this field.**

**`shares` (legacy)**
- **Created**: by **no server path**. `AccountService.addAccount` initializes `shares:{}` (`AccountService.ts:48-51`); only `src/utils/seeder.ts:51` and devtools write entries (`{spouseId:'read'}`).
- **Read**: rules — `hasLegacyPermission` (`:127-129`) inside `hasManagePermission`/`hasTransactPermission` (`:131-145`), account read (`:241`); client — `permissions.ts:19-22`.
- **Updated/removed**: **nothing.** `disconnectFamily`, `shareAccount(false)`, and `revokeSharedAccess` never touch it.

**`accountShares` (row-embedded snapshot)** — written by client transaction paths from the **union** of both maps (`TransferOperations.ts:18-31`), read by rules `:298` and `:359`; never cleaned.

### 7.2 Compatibility matrix

| Resource/path | `shares` used? | `sharedWith` used? | Writer(s) | Authorization source | Revocation path | Drift possible? |
|---|---|---|---|---|---|---|
| `users/{u}/accounts/{id}` read | YES (`:241`) | YES (`:242`) + scope branch (`:243`) | callable/devtools/seeder | rules | sharedWith: yes; shares: **NO**; scope: **NO** | **YES** |
| `users/{u}/accounts/{id}` update (manage) | YES (`:134`) | YES (`:134`) | client | rules (both maps frozen for non-owners) | shares: **NO** | **YES** |
| `users/{u}/accounts/{id}` update (balance, transact) | YES (`:141-142`) | YES (`:143-144`) | client | rules | shares: **NO** | **YES** |
| `users/{u}/finance/{tx}` read | — (via `accountShares` snapshot `:298`) | YES (`isSharedAccountMember` `:299`) + scope (`:300`) | client/Admin SDK | rules | sharedWith (new reads via `:293`): yes; row `accountShares`: **NO**; scope: **NO** | **YES** |
| `users/{u}/finance/{tx}` create | — | YES (`hasTransactPermission`) | client | rules | n/a | — |
| `users/{u}/finance/{tx}` update/delete | YES | YES | client | rules (persisted `resource.data.accountId`) | shares: **NO** | **YES** |
| `/{path=**}/accounts/{id}` mirror | no | YES (`:351`) | — | rules | yes | low |
| `/{path=**}/finance/{tx}` mirror | — (via `accountShares`) | — | client | rules | **NO** (stale index) | **YES (FS-01b)** |
| `accounts/{id}/activity` read/create | no | YES (`:275-279`) | client | rules | yes | low |
| FI-10 callable | **ignored entirely** | YES (presence only, any value) | — | function | inherits sharedWith removal | (see FS-05) |
| Client `permissions.ts` | YES (fallback) | YES (priority) | — | client (cosmetic) | n/a | cosmetic only |

### 7.3 Direct answers

> *Can the two permission models disagree in a way that produces broader access than intended?* **Yes.** `shares` and `sharedWith` are read conjunctively (either grants), so any `shares` entry that outlives its intent is a live grant; and because `shareAccount` *also* sets `scope:'family'` while unshare/disconnect never unset it, even full removal of both maps leaves the broadest grant (scope) in place. The models cannot converge back after a grant is made: revocation is a subset of what grant creation writes.

> *Can a user removed from a family retain access through the other representation?* **Yes** — via `scope:'family'` (account + finance reads) and via stale `accountShares` row indexes (historical finance reads); via legacy `shares` only where such entries exist (UH-F01: legacy-data prevalence unverified). See FS-01/FS-02.

> *Can a client directly mutate either?* Only `shares`/`sharedWith`/`scope` on the **client's own account docs** (owner update has no affectedKeys restriction — by-design manual-account model). A shared member's update is frozen against both maps (`:255-256`, `:261-262`). No non-owner path mutates another user's grant fields. `scope` is owner-settable to `family` on own accounts — self-scoping only (compounds FS-06).

---

## 8. Authorization / IDOR analysis (identifier substitution)

For each identifier, "A substitutes B's ID": **server/rules proof of membership + role + ownership + family-association required.**

| Identifier | Operation(s) | Independent proof? | Result |
|---|---|---|---|
| `familyId` | no familyId parameter exists anywhere (1:1 model; connection resolved from caller UID) | n/a | n/a |
| `inviteId` | revoke/confirm/accept | revoke+confirm: `invite.ownerUid === caller` (`familyInvitations.ts:99`, `familyConnectionConfirm.ts:31`); accept: email binding + code | **proof holds** |
| `userId`/`memberId` | disconnect (no param); devtools only | connection resolved server-side from caller | **proof holds** |
| `ownerId` | none in V2 flows (shareAccount self-scopes) | — | holds |
| `accountId` | share/unshare | account fetched **under caller's own path** (`familySharing.ts:42-44`) | **proof holds** |
| `accountId` + `accountOwnerId` | FI-10 callable | path chosen by client; ownership re-checked on the real doc, but `!ownerId ⇒ owned-by-anyone`; no connection check; permission **value** unchecked (FS-05) | **partial** — genuine `sharedWith` presence still required; not-found vs permission-denied oracle |
| `transactionId` | update/delete (client) | rules re-resolve persisted `resource.data.accountId` → manage-perm | **holds** |
| `commitmentId` | CRUD | rules: path-owner only for writes (`:330-331`) | **holds** |
| `shareId` | no such identifier | — | n/a |
| `accountOwnerId` (activity) | activity create | rules require caller ∈ `sharedWith` of the addressed account (`:278-279`); but `actorId`/`actorName` are client-supplied (FS-08) | **partial** — write path proven, attribution spoofable |
| dashboard/commitments read | read-only | rules: `isConnectedFamilyMember(pathOwner)` = **existence of any connection doc in either UID order** | **holds only while connected; fails post-disconnect (FS-01)** |

Client-side route guards/hidden buttons are never load-bearing: every write re-verifies server-side. Client-supplied roles (`useFamilySharing.isOwner`, `permissions.ts`) are cosmetic. Cached family membership (`connection` snapshot) is stale-UI only.

**Cross-reference FI-10 (narrow + deepen):**
- **Confirmed (unchanged):** client-supplied `accountOwnerId` selects the account path (`sharedTransactions.ts:44-55`); `!accountData.ownerId ⇒ isOwner` (`:64`); `amountCents`/`type` written via Admin SDK with no validation (`:76-103`) — a negative 'expense' *increases* balance; two sequential non-transactional writes (`:95`, `:101`) — txn-row-without-balance drift on partial failure.
- **Narrowed:** the share check still runs against the real account doc; a caller needs genuine `sharedWith[callerUid]` presence (or true ownership) — **this is not an open cross-user write**.
- **Deepened (family-specific):**
  1. `hasSharedAccess = accountData.sharedWith?.[callerUid]` checks **presence, not `permission`** — a hypothetical `permission:'read'` grantee could write (no such grant is written by the V2 product today; shareAccount always writes 'transact') — conditional escalation, not currently reachable via product writers.
  2. **No family-connection check at all** — the callable authorizes purely on the (revocable) `sharedWith` map and ignores legacy `shares` entirely (server model divergence from rules).
  3. Writes `scope:'family'` rows with **no `accountShares`** and `accountOwnerId` = client value → the collection-group finance mirror (`:359`) never matches these rows, and the activity mirror (`:369`) never matches.
  4. Not-found (`'Account not found'`) vs permission-denied distinction = cross-owner account-ID enumeration oracle (enumerates which `users/{x}/accounts/{id}` paths exist).
- **Net family impact of FI-10:** confirmed MEDIUM (unchanged); family blast radius bounded by genuine-grant requirement, deepened by validation/attribution/atomicity gaps above.

---

## 9. Shared financial data — isolation-specific findings

*(Not a re-run of the finance audit; strictly the sharing/isolation boundary.)*

**Access model during an active connection (by design):** `shareAccount` grants the single member `permission:'transact'` per account and flips the account to `scope:'family'`. Member effects: read account + balance; read all finance rows of that account (rules `:297-300`); create transactions (`hasTransactPermission`); **cannot** update/delete rows (needs manage, `:308-312`); **cannot** change `sharedWith`/`shares` (frozen, `:255-256`); **cannot** delete/rename the account (delete owner-only `:269`). Read-only sharing is not expressible in the V2 writer (only 'transact' is ever granted), so a read-only-member scenario requires a drifted/legacy grant; see FS-05 caveat.

**Family membership ⇒ automatic finance access?** No — connection alone grants **no** finance access. Access requires an explicit per-account `sharedWith` entry, or the account being `scope:'family'` (which `shareAccount` always sets — so in practice every shared account is *also* connection-readable). Commitments/dashboard, by contrast, are connection-readable with no per-resource grant (FS-01 surface).

**Can account ownership be spoofed?** Not for authorization: rules key ownership on the **path segment** (`users/{userId}`), not the `ownerId` field (`accountOwnerUid` defaults `ownerId`→path-owner, `:119-121`). The FI-10 callable is the one place a client-chosen owner path is trusted — bounded as described (§8). Row-level `accountOwnerId`/`createdByName` are client-supplied and unvalidated → **metadata spoofing is possible** (attribution only).

**Ownerless accounts:** rules `isValidAccount` does not require `ownerId`; `accountOwnerUid` falls back to path-owner; FI-10 treats missing `ownerId` as owned-by-caller. Any real exploit needs a production account doc missing `ownerId` (UH-04-class from 06 §18 — prevalence unverified). The client account-creation path always sets `ownerId` (`AccountService.ts:48-51`).

**Does a share grant survive family removal?**
- `sharedWith` grant: **no** (removed by `disconnectFamily`/`shareAccount(false)`/`revokeSharedAccess`).
- `scope:'family'` on the account: **YES — forever** (FS-01).
- Historical row `accountShares` index: **YES — forever** (FS-01b).
- Legacy `shares` entry: **YES — forever** (FS-02, data-dependent).

**Conversion rows (FI-14 — confirmed and deepened).** `convertCurrencyAcrossAccounts` (`src/api/FinanceOperationsApi.ts:24-77`, **@ts-nocheck**): both legs hardcode `scope:'family'` (`:45`, `:66`), omit `isSoftDeleted`, `accountOwnerId`, `accountShares`, `createdByName`. Consequences, each rules-traced:
1. **Any connected member can read both conversion legs of the *other* party** (rules `:300` scope branch) — personal-finance data (amount, rate, counterparty account name) exposed to the household even though the involved accounts may be entirely personal. This is the FI-14 family-readable-leak, now with the exact writer→rule path.
2. Rows omit `isSoftDeleted` → cash-flow filters that rely on the flag diverge (cross-ref FI-12); effectively un-soft-deletable.
3. `accountOwnerId` absent → collection-group activity rule (`:369`) never matches; `accountShares` absent → finance mirror (`:359`) never matches — the rows are invisible to the shared-member *mirrors* but visible via the **scope branch**, i.e., access depends on connection **existence**, which survives disconnect (FS-01) → conversion rows of a personal account remain readable by an ex-partner post-disconnect.
4. Writer is client-side under `@ts-nocheck`; cross-account conversion between two users requires transact-permission on both accounts per rules.

**Can private records accidentally get family scope?** Yes, three writers: `shareAccount` (scope flip is one-way), `fixSharedAccountScopes` (bulk-flips every `sharedWith`-bearing account to family; callable reachable from devtools), and `convertCurrencyAcrossAccounts` (row-level, unconditional). There is **no un-scope path** anywhere.

**Shared balances/net-worth/activity:** member sees live balance via `subscribeToSharedAccountDetails`; net-worth merges own+shared (`useFinanceData.ts:58-89`) — client-side only, no server aggregate to leak. Activity feed rows are client-authored with client-supplied `actorId`/`actorName` under a sharedWith-presence create rule (`:278-279`) → a member can forge activity attributions on the shared account (FS-08).

---

## 10. Shared commitments / tasks

- **Ownership model:** single-owner path (`users/{uid}/commitments`); `category:'family'` is a **task-owner-declared** field, not derived from membership.
- **Visibility:** family-category tasks readable by any connected member — `resource.data.category == 'family' && isConnectedFamilyMember(userId)` (`:329`). Non-family tasks are strictly private.
- **Edit/complete/delete:** **owner-only** (`:330-331`) — a family member can *read* a shared commitment but can never toggle, edit, reassign, or delete it. There is **no assignment/reassignment concept**; "family commitment" is a label, not a shared work item. UI delete-confirmation copy ("this is a family commitment…") describes a read-only concept — product gap, not a security gap.
- **Mismatches found:**
  1. Family scope is inferred from a client-set `category` — but only on the task owner's own documents, so one member **cannot** force another's private item into family visibility. ✅
  2. Removing a member (disconnect) ends their family-category read access *only if* the connection doc is deleted — with `disconnectFamily` it is not (FS-01 applies to commitments read, `:329`).
  3. `isValidTask` (title + completed) is the only shape control; family-category tasks may contain arbitrary extra fields visible to the household (no field allow-list) — defense-in-depth note (LOW, folded into FS-11 class).
- **Finance interactions:** none — commitments do not create transactions; reminders are recipient-scoped (no family sharing found).
- **Notifications:** none generated for family-category tasks (no shared-task notification path found).

**Verdict:** commitments sharing is read-only by construction and cannot escalate; its only isolation defect is inherited from FS-01 (existence-based read after disconnect). Non-sharing behaviors deferred to the commitments domain pass (per HANDOFF order).

---

## 11. Family-scoped Fabric / AI data

**No family-scoped Fabric behavior exists.** Evidence:

- Every `fabric_*` collection is owner-only RW (`firestore.rules:186-214`; `fabric_analytics`/`fabric_nudge_log` owner-read, Admin-SDK-written). No family predicate anywhere in the fabric rule block.
- Server-side fabric functions (`fabricNudges.ts`, `fabricNudgeHelpers.ts`, `weeklyReport.ts`) contain **no** family/sharedWith references (grep: zero matches) — they operate on the scheduled user's own data.
- The only "family" surface in AI is cosmetic: `FabricService.getInsightsFor('family')` (`FabricService.ts:108`) → `buildFamilyInsight(transactions)` (`InsightsEngine.ts:21,36`) — a client-side insight **derived from transactions the current user already has read access to** (own + shared via `useFinanceData`). `FabricContext.tsx:46-50` merges dashboard+family insights locally.
- Weekly reports / briefings / predictions / conversations persist under the requesting user's own tree only.

**Direct answer:** *Can one family member's private context be incorporated into content visible to another member without an explicit intended sharing boundary?* **No** — no member A data flows into member B's AI content. The only cross-member data in AI-adjacent output is shared-account transactions, which B reads by explicit grant (and which, post-disconnect, is governed by FS-01 rather than AI logic). No Fabric finding; nothing to defer.

---

## 12. Firestore rules — family/shared mapping (effective)

UI/service → path → predicate → expected vs actual:

| Path | UI/service entry | Rule predicate (line) | Expected | Actual effective |
|---|---|---|---|---|
| `family_invitations/{id}` | AcceptInviteView, FamilyInvitationApi, PendingConfirmation | party-read (`ownerUid`/`inviteeEmail`==token email/`inviteeUid`), **all writes false** (`:79-84`) | parties read; server-only writes | ✅ as intended (emulator-proven) |
| `family_connections/{id}` | FamilyConnectionApi, FamilySettingsV2 | party-read only, **all writes false** (`:93-97`) | parties read; server-only writes | ✅ read/write as intended — **but consumed by existence-based helpers** (below) |
| `users/{u}/accounts/{id}` read | useFinanceData, SharedAccountSubscriptionsApi, AccountCard | owner ∨ `shares[uid]!=null` ∨ `sharedWith[uid]!=null` ∨ (`scope=='family'` ∧ existsAnyConnection(u)) (`:240-243`) | owner + governed grants | ❌ **scope branch survives disconnect (FS-01); `shares` un-revocable (FS-02)** |
| `users/{u}/accounts/{id}` update | TransactionService/AccountService balance+rename | `isValidAccount` ∧ [owner ∨ manage ∧ maps frozen ∨ transact ∧ keys⊆{balanceCents,updatedAt} ∧ maps frozen] ∧ linked-source guard (`:250-267`) | owner + governed perms | ✅ within-connection correct; manage/transact resolve against **both** maps (FS-02 legacy surface); owner update has no affectedKeys restriction (by design, cross-ref 06 §11) |
| `users/{u}/accounts/{id}` delete | useFinanceOperations.deleteAccount | owner only (`:269`) | owner only | ✅ |
| `users/{u}/accounts/{id}/activity` | useAccountActivity, activityLogger | owner ∨ `sharedWith[uid]!=null` (read+create); no update/delete (`:274-282`) | shared-member append | ✅ scope-correct; **actor identity client-supplied (FS-08)** |
| `users/{u}/finance/{tx}` read | SharedAccountSubscriptionsApi, useFinanceData | owner ∨ `accountShares[uid]` ∨ sharedWith-of-row-account ∨ (scope=='family' ∧ existsAnyConnection(u)) (`:297-300`) | owner + governed grants | ❌ **`accountShares` stale-index + scope branches survive revocation (FS-01/FS-01b)** |
| `users/{u}/finance/{tx}` create | TransactionService (member path) | auth ∧ `isValidTransaction` ∧ `hasTransactPermission(request.resource.data.accountId)` (`:303-305`) | transact on addressed account | ✅ (member cannot create into private accounts); **no field restrictions on create** (cross-ref 06 §11 — scope/source/createdBy client-settable on own-permitted writes) |
| `users/{u}/finance/{tx}` update/delete | useFinanceOperations | `hasManagePermission(resource.data.accountId)` + full-doc revalidation (`:308-312`) | manage only | ✅ member cannot edit/delete |
| `/{path=**}/accounts/{id}` mirror | getSharedAccountsWithMe consumers | `sharedWith`-keyed (`:351`) | shared member read | ✅ (revocation-correct) |
| `/{path=**}/finance/{tx}` mirror | shared-row listing | `accountShares`-keyed (`:359`) | shared member read | ❌ **stale-index grant survives revocation (FS-01b)** |
| `/{path=**}/activity/{id}` mirror | useAccountActivity | `accountOwnerId == uid` (`:368-369`) | owner cross-user-tree read | ✅ (but FI-10/conversion rows never carry a matching `accountOwnerId` — consistency note, FS-05/FS-06) |
| `users/{u}/commitments/{id}` | CommitmentsView | read: owner ∨ (`category=='family'` ∧ existsAnyConnection(u)); write: owner-only (`:328-332`) | read-only family share | ❌ read survives disconnect (FS-01) |
| `users/{u}/dashboard/**` | **no client writer found** | read: owner ∨ existsAnyConnection(u); write: owner (`:334-337`) | (apparently legacy collection) | ❌ existence-based **whole-subtree read** of partner; data presence UNPROVEN — folded into FS-01 with UNPROVEN data caveat |
| `users/{u}/family/config` | devtools, seeder | owner RW (`:157-160`) | legacy dev config | ✅ self-scoped; V1 residue (§21) |
| `users/{u}/notifications` | FamilyNotificationApi | recipient-only RW, flags-only update (`:318-326`) | recipient-only | ✅ |
| `users/{u}/settings`,`/security`,`/fcmTokens` | — | owner-only (`:147-168`) | — | ✅ (auth-pass scope) |

**Rules-level observations:**
- `isConnectedFamilyMember` (`:49-52`) is the single family predicate and is **existence-only** — every scope/category/dashboard grant inherits the disconnect failure. No rule anywhere re-checks `status=='active'` (verified by grep).
- Membership is **never self-declared** (no client-supplied family/member fields are trusted) — the failure class is stale-authoritative-state, not client-forgery.
- `ownerId` is treated as defaulted-but-unverified (`:119-121`); no immutability constraint on `ownerId` for owner updates (owner can rewrite own `ownerId` — meaningless because path binds authorization; noted for completeness).
- Rules and backend **diverge on `shares`**: rules honor it, `shareAccount`/FI-10 don't (FS-02/FS-05).
- Stale-rule-surface check: no rule references a removed field; the reverse — legacy fields (`shares`, `scope`, `category`) are still live in rules while their writers are legacy/dev-side.

---

## 13. Cloud Functions / privileged operations — family inventory

| Function | Trigger | Auth | Input validation | Membership/role/ownership validation | Tx/batch | Partial-failure | Tests |
|---|---|---|---|---|---|---|---|
| `createFamilyInvitation` | callable | yes | email presence (regex validator `familyInvitationValidation.ts` exists **but is never imported by the callable** — unnormalized emails stored) | pending-dedupe; `getActiveConnection(ownerUid)` guard; **no invitee-account existence check** | none (sequential) | invite written; email fail → `emailQueued:false`, **code still returned to client** | none (registry-only) |
| `revokeInvitation` | callable | yes | inviteId string | owner-only; pending-only | single update | n/a | none |
| `validateInvitationToken` | callable | **missing check** (FS-07) | token presence | status/expiry machine | read-only | n/a | none |
| `acceptInvitation` | callable | yes | inviteId+code presence | **verified-email binding**, status, expiry, bcrypt, 5-attempt lock | none (get→update) | attempt-counter lost-update race | 1 unit (wrong-email rejection) |
| `confirmConnection` | callable | yes | inviteId/confirmed; **`password` destructured and ignored** (FS-10) | owner-only; status; inviteeUid | **none — 2 writes** | connection-without-invite-update window (RECOVERABLE); **no active-connection guard (FS-03)** | none |
| `disconnectFamily` | callable | yes | none (no params used) | `getActiveConnection(callerUid)`; role inferred | none — status update then grant-removal batch | **status flipped but grant batch fails → orphaned grant (FS-04); `scope`/`shares` untouched (FS-01/02)** | rules-level only |
| `shareAccount` | callable | yes | accountId/share booleans | owner-side only; account existence in own path | single update | **race vs disconnect → orphaned sharedWith (FS-04)** | e2e skipped (F-03) |
| `getSharedAccountsWithMe` | callable | yes | none | sharedWith-keyed query (caller UID interpolated server-side) | read-only | n/a | none |
| `addTransactionToSharedAccount` (FI-10) | callable | yes | presence only; **no amount/type/range validation** | path = client `accountOwnerId`; `ownerId==caller ∨ !ownerId ∨ sharedWith[caller]`; **no connection check; permission value unchecked** | **none — two sequential writes** | txn-row-without-balance drift | none |
| `fixSharedAccountScopes` | callable | yes | none | self-scoped (own accounts) | one batch | n/a | none |
| `onSharedTransactionWrite` | Firestore trigger | n/a | — | none (notifies `sharedWith` of path-owner's account) | notification fan-out | notification loss on crash (at-least-once) | none |
| `cleanupExpiredInvitations` | schedule daily | n/a | — | status/expiry queries | batched | skipped day → accept-time check still rejects | none |
| `migrateFamilyConnectionsV2` (+ framework `runMigration`/`rollback` '001') | callable | yes | migrationId | **caller-authorized, not admin-authorized** — any authenticated user can run the global V1→V2 migration / **`rollbackMigration` deletes all `migratedFromV1` connections**; rate-limited 1/day (`rateLimit.ts:33`) | per-doc sequential | n/a | framework tests only |
| `deleteMyAccount` | callable | yes + 5-min reauth | n/a | self only | chunked deletes (non-transactional — A-04) | family-artifact vs tree-delete vs auth-delete ordering windows | none (A-04) |

**Notes:** App Check is default-on for prod/staging via `secureOnCall` (env-overridable — cross-ref FI-17/U-02). No family callable uses `runTransaction` for its multi-write sequences. Every family callable resolves the acting UID from `request.auth.uid` — no callable trusts a client-supplied acting identity (the sole client-trusted field family-wide is FI-10's `accountOwnerId`).

---

## 14. Member removal / revocation semantics (first-class analysis)

Event-by-event: which access paths must die, and what actually survives. ("Survives" = still granted by rules/callables after the event; "UI-stale" = client cache only.)

| Revocation event | family_connections | `sharedWith` | `shares` | `scope:'family'` | row `accountShares` | finance access | commitments read | dashboard read | notifications | invite reuse |
|---|---|---|---|---|---|---|---|---|---|---|
| Owner removes member / member leaves (`disconnectFamily`) | status→'disconnected', **doc kept** | ✅ removed (owner's accounts) | ❌ survives | ❌ survives | ❌ survives | **partially survives** (scope+index reads — FS-01) | ❌ survives (FS-01) | ❌ survives (FS-01) | history retained (recipient-only) | n/a (invites independent) |
| Role downgrade | **no such operation exists** (only 'transact' is ever granted; no UI/callable downgrades) | — | — | — | — | — | — | — | — | — |
| Unshare single account (`shareAccount(false)`) | n/a | ✅ removed for that account | ❌ survives | ❌ survives (per-account) | ❌ survives on existing rows | **partially survives** (same three channels) | n/a | n/a | unshare notice sent | — |
| Family delete | n/a (no delete op; closest = disconnect) | — | — | — | — | — | — | — | — | — |
| Member's account deleted (`deleteMyAccount`) | ✅ docs deleted both directions | ✅ removed (grants **given to** deleted uid) | ❌ stale `shares[deletedUid]` remains on others' accounts | n/a (grantee gone) | stale rows keep deleted uid in index (auth-dead → inert) | ✅ effectively dead (cannot authenticate) | ✅ dead | ✅ dead | stale notifications referencing deleted actorUid | invites where deleted = invitee persist if email renamed (§15) |
| Owner's account deleted | ✅ docs deleted | owner tree deleted entirely | (tree deleted) | (tree deleted) | (tree deleted) | ✅ resources gone | ✅ family-category tasks gone (tree) | (tree deleted) | member's history retained | owner-invites deleted |

**Direct answer:** *After revocation, is access denied by authoritative server/rule state immediately, or can stale grants continue working?* **Stale grants continue working.** For the `sharedWith` channel, denial is immediate and authoritative (rules re-read the account doc on every access; `getSharedAccountsWithMe` is a live query). For the `scope`/`accountShares`/`shares` channels, denial **never occurs automatically** — the ex-member retains rules-authoritative read of family-scoped account docs (balances), family-scoped and historical-indexed finance rows, family-category commitments, and the ex-partner's dashboard subtree until someone manually deletes connection docs or rewrites data. Post-disconnect `getActiveConnection` correctly returns null, so **all callables** deny immediately — the residual is a pure client-SDK/rules surface (reads only; writes require manage/transact which are gone). Client UI also goes stale (subscriptions fail-closed → `console.error`, empty lists) — distinguishable from the server-side persistence documented above.

**Storage:** no family-scoped storage rules exist beyond generic ownership (baseline/03; no family/share predicates) — nothing to revoke.

---

## 15. Account-deletion intersection (deepens A-04 / FI-09 — family portion only)

Cross-refs: A-04 (`05` §:204-209), FI-09 (06 §14). What this pass adds:

1. **Family artifacts ARE the deletion path's best-implemented part** — `deleteFamilyArtifacts` deletes connections (both directions) and owner-invites + email-matched invites. Deleting the connection docs is what kills the existence-based scope/category/dashboard grants for the *surviving* partner — i.e., account deletion is **more complete** than disconnect (which keeps the doc). Documented as an asymmetry, not remediated.
2. **New stale-state inventory:** (a) `shares[deletedUid]` on other users' accounts (note: `revokeSharedAccess` *does* clean `sharedWith`, so the residue is shares-only); (b) `awaiting_confirmation`/`pending` invites where the deleted user was **invitee** persist when their current auth email no longer equals `inviteeEmail` (email renamed post-invite) — a pending invite to a possibly recycled address; (c) notifications authored by the deleted user persist on ex-partner devices (actorUid references dead identity); (d) FI-10/conversion rows with `accountOwnerId`/`createdBy` = deleted uid persist in partners' trees (historically correct, unreferencable).
3. **Invite-creator death:** owner invites deleted; but if the owner was deleted mid-`awaiting_confirmation`, the invitee has already accepted — `confirmConnection` will find the invite deleted → invitee receives 'Invitation not found' (clean failure) but their UI shows awaiting state until refresh (UI-stale only).
4. **Blast radius vs A-04 as documented:** materially similar (the family portion was already enumerated in A-04's "family connection rows + shared-access grants"); this pass adds the shares-residue and renamed-email invite items and confirms no **new** privilege survives attached to a deleted UID (dead UIDs cannot authenticate; rules-keyed grants to them are inert). **A-04 severity unchanged (HIGH stands).**

---

## 16. Concurrency / partial-failure matrix

| # | Scenario | Transaction boundary | Persisted result | Classification |
|---|---|---|---|---|
| 1 | Two users accept same invite | none (get→update) | second sees non-pending → rejected; email-binding makes cross-account accept impossible | CONSISTENT |
| 2 | Same account double-submits accept | none | both pass pending check → same `awaiting_confirmation` state, duplicate notifications to owner | DUPLICATED (cosmetic) |
| 3 | Invite revoked mid-accept | none | interleave: accept passes status check, revoke commits, accept's update flips to `awaiting_confirmation` overwriting `revoked` → **revoked invite becomes confirmable** | PRIVILEGE-STALE (window = last-writer-wins on status; owner still must confirm; LOW-MEDIUM, unproven in practice — UH-F03) |
| 4 | Member removed while member writes shared record | none | write checked against sharedWith at commit time; post-removal commit denied; created rows keep stale `accountShares` | CONSISTENT for the write + FS-01b residue |
| 5 | Ownership transferred concurrently | **feature does not exist** | — | n/a |
| 6 | Owner deletion during confirm | none | connection set + invite update independent; auth-delete at end — see §15.3 | RECOVERABLE |
| 7 | Share grant vs disconnect race | none (both single/batch writes) | share passed active-check before disconnect commit → `sharedWith` re-added after removal batch → orphaned grant, no further cleanup | ORPHANED / PRIVILEGE-STALE (FS-04) |
| 8 | Disconnect status flip vs grant-removal batch failure | none (two phases) | connection disconnected; sharedWith retained; member cannot re-trigger disconnect ("No active connection"); owner re-share would overwrite | DRIFTED / ORPHANED (no automatic recovery) |
| 9 | Family delete vs member operation | n/a (no family delete) | — | n/a |
| 10 | Role downgrade vs privileged write | **no downgrade op exists** | — | n/a |
| 11 | Duplicate callable retry (share/unshare/disconnect) | single update / batch | idempotent outcomes (overwrite / FieldValue.delete) | CONSISTENT |
| 12 | Duplicate FI-10 retry | none (2 writes) | duplicate transaction rows + double balance delta (no client dedupe key) | DUPLICATED (cross-ref FI-06 class) |
| 13 | FI-10: row write succeeds, balance increment fails | none | row without balance effect; no retry/repair | DRIFTED (06 §15 row 15, unchanged) |
| 14 | Stale offline client mutation after revocation | offline queue (finance only) | queued add flushes later; rules re-check at flush → denied if grant gone (create requires map-based transact-perm) | CONSISTENT (rules hold) |
| 15 | Concurrent `confirmConnection` for two different invites by same owner | none | two active connections created (no active-connection guard) | DRIFTED (FS-03) |
| 16 | Concurrent wrong-code attempts (lock race) | none | attempt counter lost-update; lock may lag by a few attempts | UNKNOWN / UNPROVEN (bounded by rate limit) |

**Transaction boundaries observed family-wide:** Firestore `batch()` only in `disconnectFamily` (grants), `fixSharedAccountScopes`, deleteAccount chunks, trigger cleanup; **zero `runTransaction`** in any family callable or rules-dependent multi-write. All lifecycle transitions are check-then-write with last-writer-wins semantics.

---

## 17. Family-critical `@ts-nocheck` intersections

Suppressed files where weakened typing touches a permission/ownership invariant (verified by direct header read):

| File | Weakened invariant |
|---|---|
| `src/features/finance/utils/permissions.ts` | **The entire client permission model** (`getAccountPermission`, `canAdd/Edit/Delete/Manage`) — the `shares`-vs-`sharedWith` precedence and permission-value comparisons are untyped; a type regression silently inverts access UI (cosmetic layer, but also the delete-permission pre-check feeding `TransactionService`) |
| `src/api/FamilyConnectionApi.ts` | share/disconnect callable payloads; connection snapshot shape (`isOwner` derivation untyped) |
| `src/api/FamilyInvitationApi.ts` | pending-invite subscription shape (status enum untyped) |
| `src/api/FamilyNotificationApi.ts` | notification shape (actorUid/accountId untyped) |
| `src/api/SharedAccountSubscriptionsApi.ts` | **shared-account row ingestion** — trusts doc data wholesale (`...(data as Record<string,unknown>)`), stamps `accountOwnerId` client-side; untyped drift here feeds every downstream permission decision |
| `src/hooks/useSharedAccounts.ts` | transforms server accounts into client `AnchorAccount` **inventing `sharedWith`/`ownerId`/`scope:'family'` locally** (`:68-84`) — the client fabricates the very fields permissions.ts then evaluates |
| `src/hooks/useFamilySharing.ts` | `isOwner` client derivation; offline-guard bypass surface |
| `src/hooks/useFinanceOperations.ts` | every finance mutation entrypoint incl. shared-account paths (cross-ref 06 §13) |
| `src/api/FinanceOperationsApi.ts` | FI-14 conversion writer + dead restore path (untyped schema omissions are exactly why FI-14's scope hardcoding survived) |
| `src/features/onboarding/AcceptInviteView.tsx` | invite-token handling + status machine untyped |
| `src/features/settings/components/devtools/AutoAcceptAction.tsx` | rules-impossible client writer (FS-09) untyped — type errors here could not surface as build failures |
| `src/context/FinanceContext.tsx`, `src/context/AuthContext.tsx` | auth/finance/family state plumbing (S-01 class, cross-ref) |

No localStorage/sessionStorage permission state found in the family path; client family state is Firestore-snapshot based (stale-snapshot risk is bounded by rules re-checks). Dev/test bypasses: `VITE_APP_ENV !== 'production'` devtools (§2.2, FS-09); no family mock paths in production code. Suppressed-typing × invariant summary: **the only permission-bearing file fully under suppression is `permissions.ts`** — and the server does not depend on it (rules re-verify), so the weakening is UI-correctness, not authorization-correctness — except where its output feeds `TransactionService.deleteTransaction`'s pre-check (rules still hold the line).

---

## 18. Test-evidence matrix

Suites: `src/__tests__/firestore-rules.{family,security,core,fabric}.emulator.ts`, `functions/src/familyConnection.test.ts`, `functions/src/familyInvitationValidation.test.ts`, `functions/src/callableRegistry.test.ts` (family names asserted), `e2e/family.spec.ts`, `e2e/family-v2.spec.ts`, `e2e/family-mode-sharing.spec.ts` (7 hard-skipped — F-03).

| Invariant | Status | Evidence / gap |
|---|---|---|
| Non-member cannot read family data (invites/connections) | **PROVEN** | `firestore-rules.family.emulator.ts` (stranger-denial, party-only read, server-only writes) |
| Non-member cannot write family data | **PROVEN** | same suite (create/update/delete denied) |
| Member cannot access another family | **PARTIALLY PROVEN** | connection-level stranger-denial proven; finance/account cross-family reads proven only for plain owner paths (`security.emulator` IDOR) — scope-branch cross-family not exercised |
| Regular member cannot perform owner actions | **PROVEN** | rules: share-freeze on update, owner-only delete, manage-gated edit/delete; functions: owner-only revoke/confirm/share |
| Removed member loses access | **CONTRADICTED BY IMPLEMENTATION** | suite's post-disconnect test uses an account with `sharedWith:{}` and **no scope** (`security.emulator.ts:81-86`) → only the sharedWith branch is proven; scope/accountShares/dashboard/commitments branches grant access post-disconnect (FS-01) |
| Role downgrade removes privilege | **UNPROVEN** | no downgrade capability exists to test |
| Revoked share removes resource access | **PARTIALLY PROVEN** | sharedWith channel proven (account mirror + account read); scope/row-index channels contradicted (FS-01/FS-01b) |
| Invitation cannot be reused | **PARTIALLY PROVEN** | status machine enforced server-side; unit test covers wrong-email only; no accept-after-accept / accept-after-revoke test |
| Invitation role cannot be escalated | **PROVEN (by absence)** | invites carry no role; client invite writes rules-denied |
| Shared-account writes enforce ownership/permission | **PARTIALLY PROVEN** | rules predicates mapped + IDOR suite; no emulator test for member-create-into-shared vs denied-on-private; FI-10 callable untested |
| Ownerless-account behavior is safe | **UNPROVEN** | no test; FI-10 `!ownerId` branch unexercised |
| Private finance data does not become family-readable | **CONTRADICTED BY IMPLEMENTATION** | FI-14: conversion rows hardcoded `scope:'family'`; FI-10 callable rows likewise |
| Deleted family/member leaves no active grants | **PARTIALLY PROVEN** | connection-doc deletion is real (`deleteFamilyArtifacts`); shares/awaiting-invite residue untested; no tests at all for `deleteMyAccount` (A-04) |
| Concurrent invite acceptance is safe | **UNPROVEN** | no concurrency tests anywhere in family |

**UI tests are not treated as proof of backend authorization** — `e2e/family*.spec.ts` assertions are visibility/routing only, and the highest-risk sharing journeys are the skipped F-03 blocks.

---

## 19. Confirmed findings

Format: ID · title · severity hypothesis · confidence · evidence · invariant/actual · scenario · impact · mitigation · test status · remediation direction.

### FS-01 · Disconnected ex-member retains rules-authoritative read of family-scoped accounts, finance rows, commitments, and dashboard · **HIGH (STOP CONDITION §20)** · high confidence (code-level)
- **Paths**: `functions/src/familyDisconnect.ts:32-55`; `config/firestore.rules:49-52,243,300,329,335`; `functions/src/familySharing.ts:60`; client `SharedAccountSubscriptionsApi.ts`.
- **Flow**: `shareAccount` sets `scope:'family'` (one-way) → member transacts → rows embed `accountShares[memberUid]` → `disconnectFamily` flips connection status + removes `sharedWith` only → connection doc persists → `isConnectedFamilyMember` (existence-only) stays true → rules `:243/:300/:329/:335` keep granting read.
- **Expected**: revocation is immediate and complete. **Actual**: ex-member retains read of (a) every `scope:'family'` account doc **including balances**, (b) every family-scoped finance row + every row whose `accountShares` index includes them (historical transactions), (c) ex-partner's family-category commitments, (d) ex-partner's entire `dashboard` subtree. Writes correctly denied (manage/transact gone).
- **Scenario**: partners share accounts, then disconnect (e.g., separation). The ex-partner's balances and shared-account transaction history remain readable by the other party indefinitely — the exact post-separation exposure the disconnect dialog promises to revoke ("All shared account access has been revoked", `familyDisconnect.ts:61`).
- **Roles affected**: both connection parties (mutual). **Blast radius**: per-connection pair; all family-scoped resources ever created.
- **Mitigation**: none (notification copy asserts otherwise). **Tests**: emulator post-disconnect suite never seeds `scope`/`accountShares` — blind spot (§18).
- **Remediation direction (later)**: make `isConnectedFamilyMember` check `status=='active'` via `get()`; reset `scope` + strip stale `accountShares` on disconnect; or delete the connection doc as deleteAccount does. Not performed here.

### FS-01b · Per-row `accountShares` snapshots are never cleaned — stale finance-read index survives every revocation · HIGH component of FS-01 · high confidence
- **Paths**: `src/services/TransferOperations.ts:18-31,87,110,160`; rules `:298,:358-360`.
- **Actual**: rows written during a grant permanently embed the grantee; no disconnect/unshare/deleteAccount path rewrites rows. Readable under `users/{owner}/finance/{tx}` (`:298`) *and* the collection-group mirror (`:359`) forever.
- **Scenario**: member removed; historical rows (amounts, counterparties, dates) still readable by UID via direct doc reads. **Tests**: none. **Remediation direction**: fold into FS-01 (strip index on revocation or drop the mirror rule).

### FS-02 · Legacy `shares` permission channel is live in rules/client but revocable by no server path · MEDIUM · high confidence
- **Paths**: rules `:127-129,134,141-142,241,255-256,308-312`; `src/features/finance/utils/permissions.ts:19-22`; writers: `AccountService.ts:48-51` (init `{}`), `src/utils/seeder.ts:51`, devtools; **no revocation writer** (grep: `disconnectFamily`, `shareAccount`, `revokeSharedAccess` — `sharedWith` only).
- **Invariant**: revocation removes all grants it created. **Actual**: a `shares` entry (legacy data, or seeder-style writes) grants account read (`:241`), transact/manage (`:141-142`,`:134`) — and survives disconnect, unshare, and account-deletion cleanup.
- **Scenario**: any production account carrying a pre-V2 `shares[uid]` grant retains that access across every revocation event. Exploitability is **data-dependent** (UH-F01: prevalence unverified — the V2 product never writes it).
- **Mitigation**: none. **Tests**: none. **Remediation direction**: either revoke both maps in all three revocation paths or migrate-and-retire `shares`; do not leave read-but-unrevokable state.

### FS-03 · `confirmConnection` lacks an active-connection guard → owner can hold two active households · MEDIUM · high confidence
- **Paths**: `functions/src/familyConnectionConfirm.ts:11-97` (no `getActiveConnection` check; contrast `familyInvitations.ts:40`); consumers keying on "first active connection": `helpers.getActiveConnection:119-145` (limit(1)), `familySharing.ts:33-41`, `familyDisconnect.ts:21-30`.
- **Actual**: owner with pending invites to two emails can confirm both → two `active` connections. `shareAccount`/`disconnectFamily` then operate on an arbitrary one (query order), while rules' existence predicate makes **both** members family-readers of the owner's scope-family data forever.
- **Scenario**: owner invites A and B (both allowed — different emails), confirms A, confirms B → B silently gains scope-family read access to the owner's accounts without ever being granted an account share; disconnecting "the" connection may leave the other active.
- **Tests**: none. **Remediation direction**: enforce single-active-connection in `confirmConnection` (and at accept), or model N-member households explicitly.

### FS-04 · Share/unshare and disconnect are non-transactional — grant-removal failure or share/disconnect race orphans grants · MEDIUM · high confidence
- **Paths**: `familyDisconnect.ts:32-55` (status update then batch; no retry); `familySharing.ts:53-61` (single update; active-connection check earlier in the same handler).
- **Scenarios**: (a) grant-removal batch throws → connection 'disconnected', `sharedWith` retained, member can never re-trigger disconnect (precondition fails) → orphaned grant readable via `sharedWith` rules; (b) `shareAccount` passes its active-connection check just before a concurrent disconnect commits → grant re-added post-cleanup.
- **Tests**: none. **Remediation direction**: single transaction (connection conditional update + grant removal); re-check connection inside the account write; make disconnect idempotent/resumable.

### FS-05 · FI-10 deepened: shared-transaction callable checks grant presence not permission value, ignores connection state and `shares`, writes invalid/unindexed family rows, non-transactional · MEDIUM · high confidence (extends 06 FI-10, family impact)
- **Paths**: `functions/src/sharedTransactions.ts:44-103`.
- **Added evidence beyond 06**: `sharedWith[callerUid]` presence check (`:65`) without `permission` inspection; no `getActiveConnection` check (functions/rules divergence on legacy `shares`); no `accountShares` on written rows (`:76-90`) → mirror-invisible; `accountOwnerId` = client value (activity-mirror mismatch); not-found vs permission-denied enumeration; duplicate-retry double-spend (no dedupe key).
- **Impact**: bounded by genuine-grant requirement — not an open cross-user write; integrity/attribution consequences as in 06. **Tests**: none. **Remediation direction**: server-resolve owner path, validate amount/type, transaction the two writes, align permission semantics with rules.

### FS-06 · FI-14 deepened: conversion rows are unconditionally family-readable and schema-incomplete (personal data exposed to household, incl. post-disconnect) · MEDIUM (raised from LOW on family-impact evidence) · high confidence
- **Paths**: `src/api/FinanceOperationsApi.ts:24-77` (scope hardcode `:45,:66`); rules `:300`.
- **Beyond 06**: exposure persists **after disconnect** (scope branch is existence-based — FS-01 interaction); rows lack `accountShares`/`accountOwnerId`/`isSoftDeleted`/`createdByName` → mirror/soft-delete/attribution all diverge.
- **Scenario**: user converts personal USD→NGN; connected partner (or ex-partner, post-disconnect) reads amount, rate, and account name of both legs.
- **Tests**: none. **Remediation direction**: scope rows per source account; align schema with `TransferOperations`; server-side scope derivation.

### FS-07 · `validateInvitationToken` performs no authentication despite registry claiming `auth:'required'` · LOW · high confidence
- **Paths**: `functions/src/familyInvitations.ts:108-128`; `functions/src/registries/family.ts` (validateInvitationToken `auth:'required'`).
- **Actual**: unauthenticated callers receive per-token validity verdicts (pending/awaiting/locked/revoked/accepted/expired) + `ownerDisplayName` + expiry. Default App Check enforcement in prod/staging likely blocks tokenless calls (FI-17 caveat: env-overridable); `tokenValidation` rate limit keyed by token.
- **Impact**: invitation-status oracle for known invite IDs (auto-ID entropy makes enumeration impractical); registry/implementation contract drift. **Tests**: none. **Remediation direction**: require auth (as the registry already documents) or fix the registry; align with UI flow (AcceptInviteView may be pre-auth by design — decide and document).

### FS-08 · Shared-activity attribution is client-authored; shared-transaction notifications misattribute the actor to the account owner · LOW · high confidence
- **Paths**: `src/utils/activityLogger.ts:26-62` + rules create `:278-279` (member can write arbitrary `actorId`/`actorName`); `functions/src/familyTriggers.ts:45-47` (`actorName` = **path owner**, not `createdBy` — a member's add notifies others as if the owner did it).
- **Impact**: forged audit-looking activity entries within a genuinely shared account; misleading notification trail (integrity of evidence, not access). **Tests**: none. **Remediation direction**: derive actor from `request.auth.uid`/trigger data, not client fields.

### FS-09 · Dev-tools family writers drift the data model (wrong grant key, rules-impossible auto-accept, scope flipping) · LOW (staging/dev reachability only) · high confidence
- **Paths**: `AutoAcceptAction.tsx` (client writes to `family_invitations`/`family_connections` — denied by rules `:84,:97`; orphaned code path), `DevToolActions.SimulateFamilyAction` (writes `sharedWith:{[uid]:{role:'transact'}}` — **`role` key is not read by rules or `permissions.ts`** → entry is inert for authorization but pollutes the grant map), `FixSharedAccountsAction` → `fixSharedAccountScopes` (one-way scope flip). Gated by `SettingsView.tsx:196` (`VITE_APP_ENV !== 'production'`).
- **Impact**: in dev/staging, simulation produces data whose authorization semantics differ from real writers — masks isolation bugs in testing and seeds drifted docs. **Remediation direction**: route all dev simulation through the real callables; delete the auto-accept path.

### FS-10 · Owner confirmation re-authentication is client-side only; `confirmConnection` ignores its `password` field · LOW · high confidence (extends auth-pass U-01 class)
- **Paths**: `familyConnectionConfirm.ts:17` (destructured, unused); `PendingConfirmation.tsx:50-61` + `pendingConfirmationHandlers.ts:20-32` (Firebase client re-auth before calling).
- **Impact**: a hijacked session (stale token, no recent reauth) can confirm a connection with no server-side freshness check — consistent with the auth pass's U-01 finding; connection grant is a durable privilege. **Tests**: none. **Remediation direction**: enforce `auth_time` freshness server-side (pattern exists: `deleteAccount.ts:99-107`).

### FS-11 · Dashboard subtree is family-readable on existence with no field constraints and no located writer · INFO (surface folded into FS-01) · medium confidence on data relevance
- **Paths**: rules `:334-337`; no client writer found in `src/` (grep) — possibly a legacy collection. If populated, any household member reads all of the partner's dashboard documents. Presence in production data UNVERIFIED (UH-F02).
- **Remediation direction**: if the collection is dead, remove the rule branch; if live, document intended contents and scope.

### FS-12 · Invitation secret transits the inviter's client; third parties can lock an invite by burning attempts · LOW · high confidence
- **Paths**: `familyInvitations.ts:83` (`verificationCode` returned to inviter); `familyConnection.ts:32,67-77` (attempts keyed to inviteId, lock at 5).
- **Impact**: (a) the "email-bound" code is exposed wherever the inviter's session is (screen, logs, extensions) — acceptance still requires the invitee's verified account, so this weakens defense-in-depth, not the boundary; (b) any authenticated user who learns an inviteId can submit 5 wrong codes → invite locked → denial-of-join (self-heals only via owner revoke/re-invite). **Tests**: none. **Remediation direction**: return code only when email queuing fails; key attempt-counters by (inviteId, callerUid) with global lock threshold.

---

## 20. Unverified high-risk behaviors

- **UH-F01 — Production prevalence of `scope:'family'` / `shares` / stale `accountShares` docs.** FS-01/FS-01b/FS-02 are code-proven; their real-world blast radius depends on how many production accounts carry `scope:'family'`, legacy `shares` entries, and indexed rows. Determinable only by a production data audit. HIGH information value.
- **UH-F02 — Is the `dashboard` collection populated?** FS-11's exposure is rules-proven but data presence is not. A single production document check resolves it.
- **UH-F03 — Does revoked-invite-overwrite (§16 #3) occur in practice?** The status last-writer-wins window requires a revoke racing an accept within the function latency; no test and no log evidence either way.
- **UH-F04 — Multi-connection households in production (FS-03).** Query `family_connections` for owners with >1 active connection — confirms/denies real drift.
- **UH-F05 — `getSharedAccountsWithMe` index availability.** The `sharedWith.{uid}.grantedAt != null` collectionGroup query requires a composite index; `config/firestore.indexes.json` was not verified for this query shape (baseline noted index catalog checks exist). Failure mode would be callable 500s, not exposure.
- **UH-F06 — Production App Check state** (cross-ref FI-17/U-02): if `ENFORCE_APPCHECK=false` in prod, FS-07's oracle and FS-12's lockout become reachable without App Check tokens.

---

## 21. Domain reachability / legacy findings

- **`shares` vs `sharedWith` verdict: active dual architecture** (§7) — `shares` is authorization-live (rules + client) but writer-dead (seeder/devtools only) and revocation-dead; `sharedWith` is the governed grant. Not deletable residue (rules still consume it); not a healthy legacy path either.
- `migrateFamilyConnectionsV2` — deprecated in registry (`replacedBy: runMigration`), still exported/deployable; duplicate of framework migration `001_family_v2` (same logic, divergent files).
- V1 surfaces still reachable: `users/{u}/family/config` (rules-owner-RW; seeder + devtools writers), `spouseId` (seeder, migration 001 up/down).
- `addTransactionToSharedAccount` — registered, contract-tested, **zero production callers** (orphaned privileged path; FS-05 keeps it a live risk because it remains deployable).
- `normalizeInviteeEmail` (`familyInvitationValidation.ts`) — exported, unit-tested, **never imported** by the invitation callable (dead validation; unnormalized emails stored).
- `AutoAcceptInvitationAction` — rules-impossible client writer (orphaned).
- `restoreSoftDeletedTransaction` — dead (already FI-13); family-relevant only as conversion-row schema sibling.
- `users/{u}/dashboard` rule branch — no located writer (FS-11); stale rules branch candidate.
- Legacy invitation shape (`senderUid`/`recipientEmail`) — retired and rule-denied, with dedicated emulator tests confirming denial (good tombstone hygiene).
- No orphaned family test files found; `e2e/family-mode-sharing.spec.ts` is entirely hard-skipped (F-03) — orphaned *coverage*, not orphaned files.

---

## 22. Recommended later remediation order (none performed)

1. **FS-01 + FS-01b** — revocation completeness: status-aware `isConnectedFamilyMember` (or connection deletion on disconnect) + scope reset + stale-index cleanup. Prerequisite to trusting any family E2E.
2. **FS-04 + FS-03** — transactional disconnect/share; single-active-connection enforcement in `confirmConnection`.
3. **FS-02** — converge or retire `shares` (bundle with whichever revocation fix lands first; includes deleteAccount parity).
4. **FS-06 + FS-05** — conversion-row scoping/schema; shared-transaction callable hardening (server-resolved path, validation, transaction).
5. **FS-07/FS-10/FS-12** — auth check on token validation; server-side reauth freshness; code-delivery/lockout hardening.
6. **FS-08/FS-09/FS-11** — attribution correctness; devtools alignment; dashboard-rule decision.
7. **F-03 un-skip prerequisite** — family emulator seed fixtures (enables the entire skipped E2E surface).

---

## 23. Evidence appendix (verified by direct read)

- Rules: `config/firestore.rules:14-19` (validators), `:47-52` (existence-only family predicate), `:77-98` (invite/connection party-read, writes-false), `:111-145` (permission helpers, both maps), `:238-284` (accounts), `:289-313` (finance), `:318-337` (notifications/commitments/dashboard), `:350-370` (mirrors), `:388-390` (default deny).
- Functions: `familyInvitations.ts` (create/revoke/validate; `:83` code-in-response; `:108` missing auth), `familyConnection.ts` (`:32` inviteId-keyed limit; `:54-62` email binding; `:64-83` bcrypt/lock), `familyConnectionConfirm.ts` (`:17` unused password; `:61-74` connection+invite writes), `familyDisconnect.ts` (`:32-55` status+sharedWith-only), `familySharing.ts` (`:53-61` grant+scope; `:97-118` collectionGroup listing), `sharedTransactions.ts` (`:44-103` FI-10), `familyTriggers.ts` (`:18-96` notifications; `:102-138` cleanup), `familyMigration.ts` + `migrations/migrations/001_family_v2.ts`, `migrations/callables.ts:40-90` (no admin check), `deleteAccount.ts:40-97` (revokeSharedAccess/deleteFamilyArtifacts), `helpers.ts:12-14` (code entropy), `rateLimit.ts:15-33` (family keys).
- Client: `FamilyConnectionApi.ts`, `FamilyInvitationApi.ts`, `FamilyNotificationApi.ts`, `SharedAccountSubscriptionsApi.ts`, `useFamilySharing.ts`, `useSharedAccounts.ts` (`:68-84` fabricated fields), `permissions.ts` (full model), `useFinanceOperations.ts`, `TransactionService.ts:34-134`, `TransferOperations.ts:18-121`, `FinanceOperationsApi.ts:24-77`, `FamilySettingsV2.tsx`, `PendingConfirmation.tsx` + handlers, `InviteFamilyMember.tsx` (client re-auth), `AcceptInviteView.tsx`, devtools (`AutoAcceptAction`, `DevToolActions`), `seeder.ts:26-89`, `SettingsView.tsx:196` (dev gate).
- Tests: `firestore-rules.family.emulator.ts` (SEC-1/SEC-2 + legacy-invite denial), `firestore-rules.security.emulator.ts:77-98` (post-disconnect — sharedWith-branch-only data), `familyConnection.test.ts` (wrong-email rejection), `familyInvitationValidation.test.ts` (unused validator), `callableRegistry.test.ts` (family set), `e2e/family{,-v2,-mode-sharing}.spec.ts` (sharing blocks skipped — F-03).

*End of 07-FAMILY-SHARED-DATA-ISOLATION.md*
