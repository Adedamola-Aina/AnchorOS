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
