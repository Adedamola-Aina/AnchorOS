# Domain Audit — Authentication, Account Lifecycle, Identity, Sessions, MFA/Recovery, Authorization

Date: 2026-09-07 · Branch: `audit/whole-product-2026-09` · Base: master `74ea144` · Method: static forensic read of production code + rules + tests. AUDIT ONLY — no product code changed.

## 1. Executive summary

AnchorOS has an unusually deep auth estate (AuthContext + MFA + passkeys + auth-event history + recovery codes + session list + rate limiting + App Check), but the audit shows the **security-critical invariant "a security event invalidates existing sessions" is not consistently enforced**:

- `revokeSession` (the "Revoke" action in the session UI) **deletes an audit record only** — it does not revoke Firebase refresh tokens. The code admits this in a comment (`functions/src/sessionManagement.ts:62-66`).
- MFA removal via recovery code, password change, and MFA unenroll perform **no refresh-token revocation**. Only `reportUnrecognisedSignIn` ("Not me") revokes tokens.
- Account deletion is a multi-step, **non-transactional, partially failure-prone** flow that erases user data (family artifacts, shared access, user tree) *before* deleting the auth account, with no cleanup of Storage artifacts, FCM-adjacent records outside the user tree, or third-party (Mono) references. There are **no unit tests for `deleteAccount`**.
- MFA recovery codes are generated and hashed **client-side** (SHA-256), persisted via a **client Firestore write**, and consumed server-side via a **read-modify-write without a transaction** — a concurrency window allows one-time-use replay.
- Several security-critical modules carry `@ts-nocheck`, including `AuthContext.tsx`, `AuthGate.tsx`, `useMfaOperations.ts`, `MfaRecoveryApi.ts`, and the entire `functions/src/rateLimit.ts` enforcement engine.

No stop-condition category (live account-takeover path, unauthenticated sensitive-data access, committed secrets, globally disabled control) was confirmed by code evidence; several HIGH/MEDIUM findings below approach these boundaries.

**Question from §3 answered:** Yes — a previously authenticated device can continue operating AnchorOS after a security-sensitive account event (password change, MFA change, recovery-code MFA reset). Proven for MFA/password paths (no revocation call exists anywhere on those paths). After `deleteUser` the refresh chain dies server-side, but already-minted ID tokens remain usable until natural expiry (~1h; standard Firebase behavior, not re-verified dynamically). Only "Not me" (`revokeRefreshTokens`) cuts off refresh — and even then live ID tokens survive until expiry.

## 2. Domain architecture map

```
Web/PWA/Capacitor client (React 19 + TS)
├─ src/config/firebase.ts          init (browserLocalPersistence, App Check ReCaptcha Enterprise, Functions us-central1)
├─ src/components/auth/AuthGate.tsx (@ts-nocheck)  central gate: login/signup/MFA challenge/recovery-code/login lockout/redirect-result
├─ src/context/AuthContext.tsx (@ts-nocheck)       state owner: onAuthStateChanged, profile subscription+bootstrap, sign in/out/up, reset email, MFA ops delegation
│  ├─ src/context/auth/socialAuth.ts               Google/Apple popup (+redirect on native)
│  ├─ src/context/auth/useMfaOperations.ts (@ts-nocheck)  TOTP enroll/unenroll/verify/reauthenticate
│  └─ src/api/AuthProfileApi.ts (@ts-nocheck)      users/{uid} doc create/update/subscribe; queueWelcomeEmail → /mail
├─ src/api/MfaRecoveryApi.ts (@ts-nocheck)         client-side WRITE of hashed recovery codes; callable consumeMfaRecoveryCode
├─ src/features/auth/*                             passkeyUtils, usePasskeyAuth (WebAuthn ↔ custom token), useAuthRateLimit, useSocialSignIn
├─ src/services/                                   authEventService (record/report/dismiss/revoke), deviceAttestation, mfaRecoveryService, fcmTokenService, AuditService
└─ src/features/settings/components/               SecuritySettings, AuthSessionList, AuthEventHistory, PasskeySection, PasswordChange, EmailChangeForm, DangerZone (delete)

Cloud Functions (anchor-os-functions, us-central1)
├─ callable.ts        secureOnCall: CORS allow-list + enforceAppCheck (true for prod/staging projectIds)
├─ rateLimit.ts (@ts-nocheck)  Firestore-transaction rate limiter, per-action configs
├─ mfaRecovery.ts     recoverMfaWithCode (UNAUTHENTICATED, email+code → wipes all MFA factors)
├─ deleteAccount.ts   deleteMyAccount (recent-auth 5min + rate limit → erase tree → delete user)
├─ authEvents.ts      recordAuthEvent / reportUnrecognisedSignIn (token revocation) / dismissAuthEvent
├─ sessionManagement.ts  listActiveSessions / revokeSession (cosmetic)
├─ passkeyAuth.ts / passkeyRegistration.ts / passkeyAuthHelpers.ts  server-side WebAuthn
├─ deviceAttestation.ts  verifyDeviceAttestation (App Check only)
├─ emailChangeSync.ts    syncEmailToProfile
└─ authAlertDetection.ts new-device alert email
```

## 3. Authentication mechanism inventory (10 mapped)

| # | Mechanism | Entry point | Implementation | SDK/backend | Notes |
|---|---|---|---|---|---|
| 1 | Email/password sign-in | AuthGate → AuthView | AuthContext.signIn (AuthContext.tsx:124) | signInWithEmailAndPassword | client localStorage lockout (5 tries/1min) — bypassable, LOW A-07 |
| 2 | Email/password sign-up | AuthGate signup mode | AuthContext.signUp (132-141) | createUserWithEmailAndPassword + profile doc + welcome email (queueWelcomeEmail — RULES-DENIED, see A-05) | password policy ≥12 + 4 classes, client-side only |
| 3 | Google sign-in | SocialSignInButtons | context/auth/socialAuth.ts doSocialSignIn | signInWithPopup; signInWithRedirect on native (capacitor://) | no account-linking logic on collision (implicit Firebase behavior) |
| 4 | Apple sign-in | SocialSignInButtons | socialAuth.ts (OAuthProvider 'apple.com') | signInWithPopup/Redirect | scopes email+name |
| 5 | Passkey/WebAuthn sign-in | AuthView authenticateWithPasskey | features/auth/usePasskeyAuth.ts + passkeyUtils.ts; functions passkeyAuth.ts | issuePasskeyChallenge → navigator.credentials.get → verifyPasskeyAssertion → createCustomToken → signInWithCustomToken (usePasskeyAuth.ts:106) | server challenge, single-use, TTL 2min, counter enforced |
| 6 | TOTP MFA challenge | AuthGate MFA mode (AuthGate.tsx:99-115) | useMfaOperations.verifyMfa | getMultiFactorResolver → TotpMultiFactorGenerator.assertionForSignIn | 8-char A-Z0-9 input is ALSO treated as recovery code and sent to recoverMfaWithCode (AuthGate.tsx:101-109) — user ambiguity, not a bypass |
| 7 | Passkey registration/management | settings PasskeySection | usePasskeyAuth + passkeyRegistration.ts | completePasskeyRegistration / deletePasskey | max 2 passkeys, owner-only delete |
| 8 | Password reset (email) | AuthGate reset mode | AuthContext.sendPasswordReset (157) | sendPasswordResetEmail | no token revocation by app; session effect UNVERIFIED (U-01) |
| 9 | Email verification gate | AuthGate.tsx:139 | EmailVerificationGate | sendEmailVerification | bypassed in dev/staging AND for any `*@anchor-os.com` email (isTestUser, line 138) — env-gated, INFO |
| 10 | Reauthentication | ReauthModal / DangerZone | useMfaOperations.reauthenticate / reauthenticateWithProvider | reauthenticateWithCredential / WithPopup | used by password change, MFA changes, delete |

NOT IMPLEMENTED: account linking / provider unlinking (no `linkWithCredential`/`unlink` anywhere in src), anonymous auth, email-link passwordless, Capacitor biometric/device-local unlock (none found in web auth path; only the retired SwiftUI app had it). MFA is TOTP-only (no SMS). Recovery = static 8-char backup codes.

## 4. Account lifecycle map

| Transition | Initiator | Privileged work | Data touched | Transactionality | Failure mode |
|---|---|---|---|---|---|
| Create account | AuthContext.signUp | none (client writes profile) | users/{uid} doc | client setDoc after auth; if profile write fails → user exists w/o profile; AuthContext subscription auto-creates on next login (AuthContext.tsx:116) | partial — self-healing |
| Bootstrap/first login | onAuthStateChanged subscription | none | users/{uid} | n/a | — |
| Email verification | user click in email | Firebase | auth record | n/a | — |
| Onboarding | OnboardingShell | none | profile.onboardingComplete | client writes | — |
| Provider linking/unlinking | — | — | — | — | NOT IMPLEMENTED (see §3) |
| Credential change | PasswordChange.tsx:42 | none | auth record | updatePassword after ReauthModal | NO session revocation by app; other-device effect UNVERIFIED (U-01) |
| MFA enroll + recovery codes | useMfaEnrollmentUI.handleEnroll | none | users/{uid}/security/mfaRecovery (client write) | codes generated client-side (SHA-256), saved AFTER enroll succeeds; save failure swallowed (console.warn:85) → user shown codes that don't work (A-02) | partial |
| MFA unenroll | settings | none | auth record + profile.mfaEnabled | multiFactor.unenroll | none by app |
| Logout | AuthContext.logout | none | sessionStorage flag | signOut | — |
| Password reset (email link) | AuthGate reset mode | Firebase | auth record | n/a | session effect UNVERIFIED (U-01) |
| Session revoke (UI "Revoke") | AuthSessionList → revokeSession callable | deletes authEvents doc | users/{uid}/authEvents/{eventId} | single delete | **cosmetic — does NOT revoke tokens (A-03)** |
| "Not me" incident report | AuthEventHistory:83 | revokeRefreshTokens (server) | auth + authEvents flag | non-atomic (update then revoke) | refresh dead, live ID tokens survive ≤1h |
| Account delete | DangerZone (name-match + reauth) → deleteMyAccount | see A-01 below | see A-01 | **NON-TRANSACTIONAL, destructive ordering** | partial failure = irreversibly erased data on live account |
| Post-deletion cleanup | — | — | — | — | Storage artwork/avatars, telemetry, third-party Mono refs NOT cleaned (A-01) |

## 5. Session lifecycle / security model

- Persistence: `browserLocalPersistence` (localStorage), forced for Capacitor compatibility (src/config/firebase.ts:47-54). Long-lived refresh token on device; no session-length customization observed.
- Client session flag: sessionStorage `anchor_session_active` + `anchor:session_expired` event (AuthContext.tsx:92-96) — cosmetic only.
- Token refresh: default Firebase SDK auto-refresh. **No server-side ID-token verification or revoked-token check exists anywhere in product call paths** — every callable trusts `request.auth` alone. `auth_time` is checked ONLY by `deleteAccount` (5-minute reauth window, deleteAccount.ts:99-107).
- Multi-device: each device holds its own refresh token; revocation only via `revokeRefreshTokens` in `reportUnrecognisedSignIn`.
- Password change / MFA change / recovery-code MFA reset: **no `revokeRefreshTokens` call on any of these paths (grep-verified across functions/src)** → other devices keep working. CONFIRMED.
- Account deletion: `deleteUser` invalidates refresh server-side; live ID tokens remain valid until expiry (Firebase-inherent; not dynamically re-verified).
- Stale-session behavior: 5s auth-state timeout forces login screen (AuthContext.tsx:82-87); `getRedirectResult` consumed in AuthGate (line 71) before protected routing — no restoration/routing race beyond a benign timeout.
- Offline: memoryLocalCache Firestore (no offline writes), auth restores from localStorage; stale-token operations surface SDK errors.

## 6. MFA / recovery model

- Enrollment: server-issued TOTP secret via multiFactor().getSession() (useMfaOperations.ts:53-69); enrollment requires recent login (Firebase enforces; app maps the error). After success the client generates 8 recovery codes (32-char alphabet, crypto.getRandomValues), hashes them **client-side with SHA-256** (mfaRecoveryService.ts:18-24) and writes `users/{uid}/security/mfaRecovery` directly from the client (MfaRecoveryApi.ts:15-20).
- The server-side bcrypt path (`hashRecoveryCode`, mfaRecovery.ts:26-28) has **no production caller** — every real recovery code is legacy SHA-256 format. bcrypt compare works anyway (falls back per-code). INFO.
- Consumption: `recoverMfaWithCode` is an **unauthenticated** callable (by design: it is used while locked out of MFA) keyed by email + 8-char code; rate limit 5/hour per email, fail-closed on limiter error (mfaRecovery.ts:91, rateLimit.ts:156-160). Search space 32^8 ≈ 1.1e12 → brute force impractical under the limiter.
- On success it wipes ALL enrolled factors via admin `updateUser` and merges remaining code hashes (mfaRecovery.ts:118-132). It does **not** revoke refresh tokens and does **not** require or establish a session.
- **A-01 replay window (CONFIRMED):** consumeRecoveryCode runs against a snapshot read; the removal of the consumed code is a later non-transactional `set(merge)` (mfaRecovery.ts:104-132). Two concurrent valid submissions both read the same list, both succeed, and the second write overwrites the first → a code can be used twice; additionally the MFA wipe is not atomic with consumption (wipe failure after match burns the code without unenrolling, or vice versa). Replay requires possession of a valid code and a race, so MEDIUM, but the one-time-use invariant is not proven by the code.
- Ownership/cross-user: recovery doc is addressed by uid resolved from email server-side; a user cannot read another user's mfaRecovery (rules §7). Codes cannot be regenerated without an enrolled session + TOTP (enrollment path). Recovery material is never logged (email deliberately omitted, mfaRecovery.ts:134-137); telemetry does not receive it.
- After account deletion the whole `security/mfaRecovery` doc is removed by the tree delete (deleteDocumentTree).
- Client ambiguity: AuthGate routes ANY 8-char [A-Z0-9] MFA input to the recovery callable first (AuthGate.tsx:101-109) — recovery effectively precedes TOTP verification in UI precedence; not a bypass but doubles the attack surface presented during login.

## 7. Authorization boundary matrix

| Callable | Auth required | App Check | Input validation | Ownership proof | Rate limit | Notes |
|---|---|---|---|---|---|---|
| deleteMyAccount | yes | enforced (prod) | none needed (no params) | uid from token | 2/day | reauth window 5min |
| recoverMfaWithCode | NO (by design) | enforced (prod) | email+8-char code | uid resolved server-side from email | 5/hr per email | see A-01 |
| recordAuthEvent | yes | enforced | method allow-list, UA truncated | uid from token | 30/hr | client-supplied method/UA trusted (A-06) |
| reportUnrecognisedSignIn | yes | enforced | eventId | doc verified to belong to uid (authEvents.ts:128) | 5/hr | correct ownership check |
| dismissAuthEvent | yes | enforced | eventId | uid match | 30/hr | ok |
| revokeSession | yes | enforced | eventId | uid match (sessionManagement.ts:90) | 10/hr | cosmetic only (A-03) |
| listActiveSessions | yes | enforced | none | uid from token | none | reads own subcollection only |
| issuePasskeyChallenge | conditional | enforced | purpose enum | register requires auth | 10/15min | |
| verifyPasskeyAssertion | NO | enforced | full shape | credential resolved server-side; challenge single-use; counter anti-replay | 5/15min | returns custom token for resolved uid |
| completePasskeyRegistration | yes | enforced | full shape | challenge bound to uid (passkeyRegistration.ts:61-63) | via challenge | max 2 passkeys |
| deletePasskey | yes | enforced | credentialId | own credential only | none explicit | |
| verifyDeviceAttestation | yes | enforced | none | uid from token | 30/hr | always trusted:true (App Check only) (A-08) |
| syncEmailToProfile | yes | enforced | none | reads auth email server-side | 15/hr | ok |
| checkRateLimit / resetRateLimit / logAuditEvent / migrations / warmUp / health | see callableRegistry | enforced | — | — | — | NOT audited in depth here (infra domain); flagged for pass 9 |

No IDOR found in the auth-domain callables above: every uid-bearing resource is resolved from `request.auth.uid` or re-verified against it. (Finance/family callables are out of scope here.)

## 8. Firestore / Storage rules mapping (auth-sensitive resources)

| Resource | Effective access | Verdict |
|---|---|---|
| users/{uid} (profile) | owner only read/create/update/delete (rules:147-150) | correct |
| users/{uid}/settings, /family | owner RW | fine (dev-tools family sim) |
| users/{uid}/fcmTokens | owner RW | tokens deleted only via account tree delete |
| users/{uid}/security/* (incl. mfaRecovery) | **owner read+write** (rules ~:237-238) | client-trusted security material (A-02); no cross-user access |
| users/{uid}/passkeys | owner read, write:false (server-only) | correct |
| users/{uid}/authEvents | owner read, write:false | correct; note callable deletes violate nothing (admin SDK) |
| users/{uid}/bankConnections | owner read, write:false | correct |
| family_invitations / family_connections | read restricted to parties; ALL writes false (server-only) | correct, rules:77-98 |
| accounts / finance / activity | owner + sharedWith/legacy-share scope + family scope; manage/transact permission functions re-read the account doc server-side-in-rule | reviewed structurally; semantic rules tests exist (firestore-rules.*.emulator.ts) — deep semantic audit deferred to family/finance domain pass |
| rateLimits, passkey_challenges, mail, audit_log | deny all client | correct |
| Collection-group accounts/finance/activity shared reads | authenticated + share-key match | consistent with per-user rules |
| Storage: users/{userId}/accounts/{accountId}/artwork | owner write (image ≤5MB), owner/shared read; everything else deny | avatars have NO permitted storage path → avatar upload likely DENIED or uses an unverified path (UNVERIFIED, U-05) |
| **mail collection (queueWelcomeEmail)** | client write DENIED (rules:383-385) | **A-05: AuthProfileApi.ts:36-40 client addDoc to /mail always fails** → welcome email never queued from web client; error swallowed by signUp try/catch |

Default-deny final match present (rules:388-390). Rules/implementation mismatch confirmed: A-05. No mismatch found in the auth domain beyond it.

## 9. Client-side trust boundaries / @ts-nocheck intersections

Security-critical files under `@ts-nocheck` where suppression intersects auth assumptions (not a re-count — a per-file statement of what can silently break):

| File | What type suppression endangers |
|---|---|
| src/context/AuthContext.tsx | the entire auth state contract (user/profile/verifyMfa signatures unchecked; wrong `snap.data()` cast feeds all gates) |
| src/components/auth/AuthGate.tsx | MFA resolver handling, recovery-code regex routing, lockout counters |
| src/context/auth/useMfaOperations.ts | MultiFactorResolver/TotpSecret shapes unchecked — the ONLY MFA client path |
| src/api/MfaRecoveryApi.ts | payload contract for writing hashed recovery codes unchecked |
| src/features/settings/hooks/useMfaEnrollmentUI.ts | enrollment→recovery-code save chain unchecked |
| functions/src/rateLimit.ts | the security rate-limiter itself is untyped (attempts[] arithmetic, blockedUntil) |
| functions/src/index.ts | function-name barrel: a typo'd export name silently drops a callable |
| src/api/AuthProfileApi.ts | profile doc writes incl. mfaEnabled flag |
| src/services/deviceAttestation.ts | AttestationResult contract |
| src/features/settings/components/DangerZone.tsx | deletion reauth chain |

Other client-boundary observations:
- Route guards (AuthGate) are client-side only; every enforcement backstop is either Firebase Auth itself or rules/callables — correct posture; no hidden-UI-as-authorization defect found in the auth domain.
- Client-side login lockout in localStorage (AuthGate.tsx:47-56, 127-128) — trivially bypassable; real protection is Firebase's own brute-force protection (UNVERIFIED configuration). A-07 LOW.
- recordAuthEvent trusts client-declared `method` (password/google/apple/passkey) and raw userAgent → session history and new-device alerts can be spoofed by a malicious authenticated client (A-06).
- `isTestUser` email-domain check (`@anchor-os.com`) skips BOTH email verification and onboarding (AuthGate.tsx:138) — reachable in production if such emails can register; LOW.
- No tokens/credentials found logged; AuthContext logs only dev-gated debug. App Check debug token correctly gated to non-production (firebase.ts:31-34).

## 10. Test evidence matrix

| Critical behavior | Evidence | Confidence |
|---|---|---|
| Privileged callables reject unauthenticated callers | explicit `request.auth` guards in every audited callable; unit tests: functions/src/mfaRecovery.callable.test.ts, sessionManagement.test.ts, deviceAttestation.test.ts | PARTIALLY PROVEN (guards read in code + tests exist for 3 of ~12 auth-domain callables) |
| Cross-user resource access denied | ownership re-checks in revokeSession/reportUnrecognised/dismiss (uid match); rules tests src/__tests__/firestore-rules.security.emulator.ts | PARTIALLY PROVEN — rules suite not executed in this pass |
| MFA cannot be bypassed | recoverMfaWithCode requires valid one-time code; TOTP enforced by Firebase | PARTIALLY PROVEN — replay race A-01 means one-time-use NOT PROVEN |
| Recovery code cannot be replayed | no transaction around consume (mfaRecovery.ts:104-132) | CONTRADICTED BY IMPLEMENTATION (concurrent case) |
| Deleted account cannot continue access | deleteUser revokes refresh server-side; live ID tokens survive ≤1h | PARTIALLY PROVEN (Firebase-inherent; deleteAccount has NO unit tests) |
| Session revocation is enforced | revokeSession deletes an authEvents doc only (sessionManagement.ts:62-99) | CONTRADICTED BY IMPLEMENTATION (for the UI "Revoke" action) |
| Password reset / change does not weaken session security | no revocation call anywhere on password paths | UNPROVEN / U-01 open |
| Provider linking cannot cause takeover | linking not implemented | N/A (mechanism absent) |
| Passkey ceremony integrity | passkeyAuth.test.ts + passkeyRegistration.test.ts, server challenge/counter | PARTIALLY PROVEN (unit level; no device E2E) |
| Firebase rules enforce intended ownership | rules emulator suites (core/family/fabric/security/storage) exist | PARTIALLY PROVEN (not executed here) |
| E2E auth journeys | e2e/auth.spec.ts skips: sign-out (:200), MFA setup (:278,295,298); e2e/security.spec.ts conditional skips (:34-162); auth_security.spec.ts present | UNPROVEN at E2E level for sign-out + MFA setup (F-03 family) |
| deleteAccount behavior | functions/src has NO deleteAccount test file (grep + ls confirmed) | UNPROVEN |

## 11. Confirmed findings

### A-01 · MFA recovery code replay window + non-atomic consume · MEDIUM · high confidence
- Files: functions/src/mfaRecovery.ts:104-132 (snapshot read, non-transactional set), consumeRecoveryCode :43-68.
- Flow: two concurrent valid code submissions read the same hashedCodes; both compute remaining lists; second `set(merge)` overwrites the first → code usable twice; MFA wipe (`updateUser`) is not atomic with consumption.
- Expected invariant: one-time-use enforced atomically. Actual: read-modify-write without transaction.
- Impact: an attacker holding one valid code could retry it; blast radius = MFA reset on the account whose email is supplied. Rate limit (5/hr/email) bounds abuse.
- Mitigations present: bcrypt/constant-time compare, rate limit, no code logging, PII-minimal audit. Tests: mfaRecovery.test.ts + .callable.test.ts exist (do NOT cover the race). Remediation direction: transactional consume + revokeRefreshTokens on recovery (high level only).

### A-02 · Recovery material generated and persisted client-side · MEDIUM · high confidence
- Files: src/services/mfaRecoveryService.ts:12-24 (client SHA-256), src/api/MfaRecoveryApi.ts:15-20 (client Firestore write), rules owner-write on users/{uid}/security/*; server bcrypt path (mfaRecovery.ts:26-28) unreachable.
- Impact: security material quality/format dictated by client; save failure swallowed (useMfaEnrollmentUI.ts:84-86) → user may be shown codes that were never persisted. Cross-user exposure NOT possible (rules). Remediation direction: move generation/hashing/persistence into the recovery callable.

### A-03 · Session "Revoke" does not revoke sessions · MEDIUM (HIGH if user-facing copy claims logout) · high confidence
- Files: functions/src/sessionManagement.ts:62-66 (explicit comment) and 68-99; UI consumers AuthSessionList.tsx / authEventService.ts:136.
- Actual: deletes the authEvents record; device keeps working. Only "Not me" (reportUnrecognisedSignIn → revokeRefreshTokens, authEvents.ts:135) revokes. Expected: revoke ⇒ token invalidation. Remediation direction: call revokeRefreshTokens in revokeSession or rename/reframe the control.

### A-04 · deleteAccount: destructive, non-transactional, incomplete erasure · HIGH · high confidence
- Files: functions/src/deleteAccount.ts:109-159; no unit test file exists.
- Ordering: revokeSharedAccess → deleteFamilyArtifacts → delete user doc tree → audit log → deleteUser. Steps 1-3 are separate batched commits; a failure after them (or in deleteUser, non-'user-not-found') leaves an **auth-live account with irreversibly erased data** (error path only writes an audit log). No idempotency/resume marker.
- Not deleted: Storage artifacts (account artwork — storage rules path exists), any avatar objects, telemetry/analytics-linked identifiers, third-party Mono references (no unlink call server-side; bankConnections doc deleted but Mono-side link UNVERIFIED — U-04), rateLimits docs, audit history (intentional?).
- Session effect: deleteUser invalidates refresh server-side; live ID tokens remain usable ≤1h; no explicit revokeRefreshTokens call.
- Blast radius: full account + family connection rows + shared-access grants (good: revokeSharedAccess covers grants GIVEN to the user on others' accounts, deleteFamilyArtifacts covers connections/invitations owned or by memberUid + invitations by email). Remediation direction: transactional/orchestrated deletion with idempotent resume + pre-delete token revocation + Storage sweep.

### A-05 · Welcome email write is denied by rules · LOW · high confidence
- Files: src/api/AuthProfileApi.ts:36-40 (client addDoc to `mail`) vs config/firestore.rules:382-385 (`allow read, write: if false`); swallowed in AuthContext.signUp:138-139.
- Impact: functional only — welcome email never queued from the web client. Remediation direction: route through the emailQueue callable.

### A-06 · Auth-event record trusts client-declared method/device · LOW · high confidence
- Files: functions/src/authEvents.ts:62-68. Impact: spoofable session-history/device alerts; no spoof path to privilege. Remediation: derive method server-side from provider data.

### A-07 · Client-side login lockout bypassable · LOW · high confidence
- Files: src/components/auth/AuthGate.tsx:47-56,127-128 (localStorage counters). Real protection = Firebase Auth anti-abuse (config UNVERIFIED, U-06).

### A-08 · Device attestation is a stub control · INFO→LOW · high confidence
- Files: functions/src/deviceAttestation.ts:19-36 (always `trusted:true`, App Check only); client isDeviceTrusted (src/services/deviceAttestation.ts) has NO production callers (grep across src outside the service: none). Native Play Integrity/DeviceCheck not implemented. Impact: claimed SEC-006 control is inert; no caller depends on it today.

## 12. Unverified high-risk behaviors

- U-01: password reset (email link) and `updatePassword` effect on other devices' sessions — no app-side revocation; Firebase auto-revocation behavior not evidenced. HIGH if not revoked.
- U-02: App Check `ENFORCE_APPCHECK` env override can disable enforcement even in prod project (callable.ts:10-13); actual deployment env unverified.
- U-03: rules emulator suites not executed in this pass — semantic rule correctness (esp. finance/shared scoping) deferred to family/finance pass.
- U-04: Mono-side references after account deletion (unlink never called server-side in delete flow).
- U-05: avatar Storage path/rules mismatch (no permitted avatar path in storage.rules; upload path used by AvatarService not traced). MEDIUM if uploads silently fail or an unintended path is open — only artwork path is in rules.
- U-06: Firebase Auth brute-force/email-enumeration posture (project-level) unverified; recovery callable returns distinct errors for existing vs unknown email ('failed-precondition' vs 'permission-denied' after getUserByEmail fail — mfaRecovery.ts:93-106) → mild email-enumeration oracle, bounded by 5/hr rate limit.

## 13. Domain reachability findings

- `src/services/deviceAttestation.ts` (client) — no reachable caller (dead security control).
- `consumeRecoveryCodeHash` (mfaRecovery.ts:73-77) — deprecated, test-only consumer.
- `hashRecoveryCode`/bcrypt path (mfaRecovery.ts:26-28) — no production caller (client generates all codes).
- Legacy `shares` permission channel in rules (hasLegacyPermission) — retained for backward compat; duplication risk flagged for family/finance pass.
- No orphaned tests found in the auth domain beyond those listed in §10.

## 14. Recommended later remediation order (this domain)

1. A-04 deleteAccount transactionalization + missing cleanup (data-loss class).
2. A-01 recovery consume transaction + token revocation on MFA reset.
3. A-03 make revokeSession actually revoke (or reframe UI).
4. U-01 establish/prove password-change/reset session semantics; add revokeRefreshTokens if needed.
5. A-02 server-side recovery-code generation.
6. Type-remediate AuthContext/AuthGate/useMfaOperations/MfaRecoveryApi/rateLimit (staged, per F-07 policy).
7. Un-skip e2e auth/security journeys with emulator fixtures (F-03).

## 15. Evidence appendix (key excerpts verified by direct read)

- sessionManagement.ts:62-66 — "Does NOT force-revoke Firebase refresh tokens — that's reportUnrecognisedSignIn."
- authEvents.ts:134-136 — only `revokeRefreshTokens` call in the entire functions tree (grep-verified).
- deleteAccount.ts:119-142 — step ordering; :133-142 deleteUser w/ 'auth/user-not-found' tolerance; :148-158 failure path = audit log only.
- mfaRecovery.ts:100-132 — get → consume → updateUser → set(merge), no transaction.
- mfaRecoveryService.ts:8-16,37-41 — client-side generation, 8 codes, 32-char alphabet.
- MfaRecoveryApi.ts:15-20 — client setDoc to users/{uid}/security/mfaRecovery.
- AuthGate.tsx:99-115 — recovery-code routing before TOTP verify.
- firebase.ts:47-54 — browserLocalPersistence; :27-44 App Check gating.
- callable.ts:9-13,41-47 — App Check default-by-projectId, env override.
- firestore.rules:237-238 (security/*), :383-385 (mail deny), :377-380 (passkey_challenges deny), :388-390 (default deny).
- storage.rules:41-49 — artwork-only path + global deny.
- AuthContext.tsx:8,77-122 — @ts-nocheck + bootstrap/profile subscription.
- passkeyAuth.ts:54-201 / passkeyRegistration.ts:29-163 — challenge TTL, single-use, counter, custom token.
