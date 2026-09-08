# 07 — FAMILY / SHARED DATA ISOLATION — Forensic Domain Audit

Date: 2026-09-08 · Branch: `audit/whole-product-2026-09` · Base for this pass: `4de568a`
Scope: Family/household → membership → invitations → roles → shared accounts → shared finance → ownership → removal/revocation → data isolation → authorization consistency.
**AUDIT ONLY — no product code, rules, deps, or tests were modified.**

---

## ⛔ STOP CONDITION TRIGGERED (§20)

> **"Removed/revoked user retains authoritative access to sensitive data" — PROVEN at code level (FS-01, HIGH).**

After a family disconnect, the ex-member retains **rules-granted, authoritative read access** to the ex-partner's family-scoped account documents (including balances), all family-scoped finance rows, and — via an never-cleaned per-row index — every transaction row that existed on the shared account at the time of each write. Root causes, each verified by direct read:

1. `disconnectFamily` (`functions/src/familyDisconnect.ts:32-55`) marks the connection `status:'disconnected'` but **never deletes the connection document**, and never resets `scope:'family'` on previously shared accounts.
2. `isConnectedFamilyMember` (`config/firestore.rules:49-52`) tests **document existence only** — no `status == 'active'` predicate.
3. Rules therefore keep granting: account read when `scope=='family'` (`:243`), finance read when `scope=='family'` (`:300`), **all** of the ex-partner's `dashboard` docs (`:335`), and family-category commitments (`:329`).
4. Transaction rows written while the member had access embed `accountShares[memberUid]` (`src/services/TransferOperations.ts:69-91`, `:160`) which no revocation path ever removes — the finance read rules at `:298` and the collection-group mirror at `:358-360` honor it forever.

Per the task's stop conditions: **documented exactly, not remediated.** The rest of this report completes the domain map and records all other findings; no stop condition other than FS-01 triggered (invite takeover, cross-family write, privilege escalation, unauthenticated private-data access: none found).

---

## 1. Executive summary

§2_PLACEHOLDER
## 2. Family architecture / data-flow map

### 2.1 Canonical V2 implementation (the live product)

**Household shape**: exactly two parties. `family_connections/{ownerUid_memberUid}` (`functions/src/familyConnectionConfirm.ts:61-71`). One active connection per user is enforced only at invite-creation time (`familyInvitations.ts:40`) — **not** at confirm time (FS-03). Roles: connection `owner` and `member`; **no admin/manager roles exist** anywhere in the product.

**Invitation flow (UI → Function → Firestore):**

```
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

AnchorOS "Family Mode" is **not a multi-member household**. It is a **pairwise 1:1 connection** (owner ↔ single member, V2 `family_connections`) with an invitation pipeline built on Firestore auto-ID "tokens" + a bcrypt-hashed 6-digit verification code, and an account-sharing overlay (`sharedWith` map on the owner's account docs) whose effective permission is **always `transact`**. A V1 model (`spouseId` + users-side `family/config` + legacy `shares` account map) still exists in rules, seeder, dev-tools, and two migration paths.

The invitation/confirmation pipeline is **structurally sound** — server-side-only writes (rules deny all client writes to `family_invitations`/`family_connections`), email-binding of the accepting account (verified email must equal `inviteeEmail`), bcrypt-coded one-time secret with 5-attempt lock, owner-only confirm, server-side expiry/revocation/lock checks. **No realistic unauthorized family takeover was found.**

Isolation, however, is **weaker than the connection lifecycle implies**, because authorization is spread across **four overlapping grants** — `sharedWith` (V2), `shares` (legacy), `scope=='family'` (per-doc flag), and embedded `accountShares` per-row indexes — evaluated by rules that treat **connection-doc existence** as the family predicate. Only the `sharedWith` channel is revoked on disconnect; the other three survive it. The result is the FS-01 revocation failure above: cleanup of the strongest, most explicit grant (`sharedWith`) masks persistence of the weaker, broader, implicit ones.

Verdict summary:

| Question | Verdict |
|---|---|
| Can an unauthenticated party read family/invitation state? | **Not the private data** — invites/connections read-restricted to parties; `validateInvitationToken` lacks an auth check but is App-Check-gated by default in prod and returns only display-name/expiry (FS-07). |
| Can a valid invite be reused, raced, guessed, or accepted by an unintended account? | **Not realistically** — email-verified binding + bcrypt 6-digit code + 5-attempt lock + server-side status checks; double-accept blocked by status; cross-account accept blocked by email uniqueness. Residuals: FS-07 (validity oracle), FS-12 (third-party lockout), code returned to inviter client (FS-12 note). |
| Can a member read private data beyond the share? | **YES, post-revocation (FS-01)** — scope/index-based reads survive disconnect. During an active connection, reads of family-scoped accounts/finance/commitments/dashboard are the intended model. |
| Can a member write beyond their share? | **Not via rules** — writes re-resolve the account doc and require manage/transact (sharedWith/shares-keyed); FI-10 callable is the exception class (FS-05, deepened). |
| Can the two permission models (`shares`/`sharedWith`) disagree into broader access? | **Yes (FS-02)** — legacy `shares` is read by rules + client but **revoked by no server path**; drift is one-way (revocation can never catch up). Exploitability requires legacy data (UH-04-class). |
| Does account deletion clean family state? | **Better than disconnect** — connection docs are deleted (killing existence-based grants), but legacy `shares` grants given to the deleted user persist as stale metadata, and awaiting-confirmation invites addressed to the deleted user persist (deepens A-04, §15). |
| Is there family-scoped Fabric/AI exposure? | **No** — fabric collections are owner-only RW; "family" insights are client-derived from shared transactions the user already has read access to (§11). |

---
