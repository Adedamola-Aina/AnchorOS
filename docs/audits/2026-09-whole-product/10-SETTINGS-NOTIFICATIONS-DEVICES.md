# 10 — Settings / Notifications / Devices Domain Forensic Audit

Date: 2026-09-08 · Branch: `audit/whole-product-2026-09` · Base: `6a484a102b86b7f37c13d36d966e4a38d07f6bca`
Scope: settings → preferences → notifications → push/FCM → browser notifications → Capacitor/native delivery → reminder delivery → notification history → device registration → token lifecycle → quiet hours → timezone → privacy → logout/account-deletion cleanup.

**AUDIT ONLY.** No production code, rules, notification copy, FCM registration, quiet-hour semantics, timezone handling, permissions, tests, or settings architecture were modified. Carried-forward inputs (C-05, FB-06, FB-07, A-04, A-06, FS-08) are cross-referenced, not re-derived, and not remediated.

---

## 1. Executive summary

The notification/device domain is **real but narrow**: one push channel (web FCM via `public/sw.js`), one token store (`users/{uid}/fcmTokens/{token}`), five backend push producers (commitment reminders, bill reminders, 3 Fabric nudges, weekly report), one in-app inbox (`users/{uid}/notifications`), one email path (transactional `mail` queue), and **zero** Capacitor/local-notification channels. There is **one canonical preference object** (`users/{uid}.notificationPreferences`) consumed by all push producers — but its UI presentation is broken (SN-02), its enforcement is clock-broken (SN-04), and family in-app notifications bypass it entirely (SN-05).

**⚠ STOP CONDITION TRIGGERED (report-only):** the logout/account-switch model proves **User A's notifications continue to be delivered to the physical device after User B signs in** (SN-01) — logout never deregisters the FCM token, and neither the service worker nor the foreground handler is auth-scoped. Documented, not remediated.

16 confirmed findings (1 HIGH, 8 MEDIUM, 5 LOW, 2 INFO) + 5 unverified high-risk behaviors.

## 2. Architecture / data flow map

### 2.1 Channels (they do NOT share one preference system)

| # | Channel | Technology | Producer(s) | Preference system | Quiet hours |
|---|---|---|---|---|---|
| 1 | In-app toast | React `NotificationContext.showToast` (portal, 5 s auto-dismiss) | dozens of client call sites + foreground FCM handler | none | none |
| 2 | In-app inbox ("family notifications") | Firestore `users/{uid}/notifications` + `onSnapshot` | 4 backend producers (`createNotification`) | **none — bypass confirmed (SN-05)** | none |
| 3 | Push (web FCM) | FCM → `public/sw.js` `onBackgroundMessage` → OS notification | 5 scheduled functions | `notificationPreferences` via `shouldSendReminderForCategory` | yes, wrong clock domain (SN-04) |
| 4 | Browser local "notification" | `new Notification(...)` from page context (not SW) | `useTaskReminders` (60 s in-page interval) | none | none |
| 5 | Email | Firestore `mail` → Trigger Email extension | `queueEmail` (security alerts, invitation), client `queueWelcomeEmail` (dead — rules deny, SN-14) | none; security alerts mandatory by design | n/a |
| 6 | Native/Capacitor push & local | **NOT USED** — no `PushNotifications`/`LocalNotifications` plugin anywhere (§17) | — | — | — |
| 7 | Badge | `@capawesome/capacitor-badge` + Badging API | foreground FCM `data.badgeCount` only | none | n/a |

Key files: `src/context/NotificationContext.tsx`, `src/hooks/usePushNotifications.ts`, `src/hooks/useTaskReminders.ts`, `src/api/PushTokenApi.ts`, `src/api/AccountNotificationsApi.ts`, `src/api/FamilyNotificationApi.ts`, `src/components/FamilyNotificationBanner.tsx`, `src/features/settings/components/{NotificationSettings,NotificationCategoryToggles,QuietHoursSettings}.tsx`, `public/sw.js`, `public/firebase-messaging-sw.js` (dead), and `functions/src/{reminders,reminderDelivery,reminderSender,reminderPreferences,reminderDedupe,reminderClaim,reminderBatching,reminderRouting,reminderTokenCleanup,billReminders,billReminderScheduler,fabricNudges,fabricNudgeHelpers,weeklyReport,notifications,helpers,familyTriggers,emailQueue,authAlertDetection,deviceAttestation,deleteAccount}.ts`.

### 2.2 Push data flow (the only server→user channel)

```
Settings UI (NotificationSettings)
  → updateProfile() → updateDoc(users/{uid}, {notificationPreferences})   [client-writable, no validation]
Scheduled jobs:
  processReminders      (every 1 min) → collectionGroup('commitments') reminderTime == format(now,'HH:mm') [UTC clock]
  processBillReminders  (daily 09:00 Lagos cron) → recurring_transactions due ≤24h
  fabricStreakNudge     (daily 20:00 Lagos) / fabricBudgetNudge / fabricSurplusNudge → getFabricEnabledUsers()
  generateWeeklyReport  (Sunday 19:00 Lagos) → fabric_reports + push
  → shouldSendReminderForCategory(users/{uid}.notificationPreferences, category, HH:mm)   [enforcement point]
  → users/{uid}/fcmTokens  (all docs; token = doc ID)
  → sendReminderNotification() → admin.messaging().send() [webpush+apns+android]
  → stale-token cleanup (2 error codes only, SN-08)
public/sw.js onBackgroundMessage → showNotification(title, body)   [no auth scope; SN-01]
Foreground: usePushNotifications onMessage → showToast(title: body) [App-level, not auth-scoped; SN-01]
Click: FCM compat default notificationclick → fcmOptions.link (server-chosen internal path, §19)
```

### 2.3 Callables/scheduled in this domain
`getNotifications`, `dismissNotification`; `recordAuthEvent` / `reportUnrecognisedDevice` / `dismissAuthEvent` (authEvents.ts — email alert only); `verifyDeviceAttestation` (§10); `sendTemplatedEmail` (**returns success but sends nothing** — builds template, no `mail` write; §37 dead code). Scheduled: `processReminders` (every 1 min), `processBillReminders` (daily 09:00 Lagos), `fabricStreakNudge` (daily 20:00 Lagos), `fabricBudgetNudge` (14th 10:00 Lagos), `fabricSurplusNudge` (28–31st 18:00 Lagos), `generateWeeklyReport` (Sunday 19:00 Lagos), `cleanupExpiredInvitations` (03:00 UTC), `onSharedTransactionWrite` (Firestore trigger).

## 3. Settings data model

Single persisted user/settings resource: the **user profile document** `artifacts/{APP_ID}/users/{uid}` (type `UserProfile`, `src/types/index.ts:66-95`). Rules: owner-only full read/write, **no field validation** (`config/firestore.rules:147-149`). Separate resources: `fabric_settings/state` (owner rw), `fcmTokens/{token}` (owner rw), `notifications/{id}` (owner read/create; update limited to `read`/`dismissed` keys), `reminder_delivery_claims` (backend-written; lives OUTSIDE any `users/{uid}` subtree at `artifacts/{APP_ID}/reminder_delivery_claims`), `fabric_nudge_log`/`fabric_analytics` (backend-only).

| Field (under `users/{uid}`) | Type | Default | Writer | Backend consumer | Notes |
|---|---|---|---|---|---|
| `notificationPreferences.enabled` | boolean | UI fallback `false`; **absent ⇒ default-allow** server-side (`reminderPreferences.ts:58-60`) | Settings "Email Notifications" toggle (`NotificationSettings.tsx:79`) | **master switch for ALL push producers** (`preferences.enabled === false ⇒ suppress`, `reminderPreferences.ts:62-64`) | inverted control (SN-02) |
| `.email` | string | `''` | Settings email input | **NONE** (dead) | presented as functional (SN-02) |
| `.frequency` | `'instant'\|'daily'\|'weekly'` | `'instant'` | Settings buttons | **NONE** (dead) | no-op control (SN-02) |
| `.lastDigestAt` | string | — | none | none | dead field |
| `.categories.finance/.commitments/.family` | boolean | absent ⇒ allow | Category toggles | reminders(`commitments`), bill(`finance`), nudges, weekly(`finance`); **`family`: no consumer** | SN-05 |
| `.quietHours.enabled/startTime/endTime` | boolean / `HH:mm` | UI fallback `{false,'22:00','07:00'}` | `QuietHoursSettings` | all 5 push producers via `isWithinQuietHours` | wrong clock domain (SN-04) |
| `timezone` | string | **never written anywhere** | none | `fabricServiceInitialization.ts:29` (AmbientContext fallback) | dead field (FB-16-adjacent) |

**Verdict (explicit answer):** there is **one canonical notification-preference schema** (`notificationPreferences`) — good — but it carries **two dead fields (`email`, `frequency`) presented as controls**, one **inverted control** (`enabled` presented as "Email Notifications" but acting as the global push master switch, SN-02), and **no schema validation on write** (SN-09). No legacy/migration schema exists (no second preference doc, no migration code found).

## 4. Preference enforcement matrix

| Notification type | Producer | Pref checked? | Where | Quiet hours? | Clock of check | Channel |
|---|---|---|---|---|---|---|
| Commitment reminder (push) | `processReminders` | YES (`commitments`+`enabled`) | `reminders.ts:63-64` | yes | **server UTC** (SN-04) | push |
| Commitment reminder (in-page) | `useTaskReminders` | **NO** | — | **NO** | device clock | local |
| Bill reminder | `processBillReminders` | YES (`finance`) | `billReminderScheduler.ts:49-50` | yes | **server UTC** | push |
| Fabric streak/budget/surplus nudge | `fabricNudges.ts` | YES | `fabricNudgeHelpers.ts:82-83` | yes | **Africa/Lagos** (FB-06) | push |
| Weekly report | `generateWeeklyReport` | YES (`finance`) | `weeklyReport.ts:136-138` | yes | **server UTC** | push |
| Family invitation/accept/confirm/reject | `familyConnection*` | **NO** | — | **NO** | n/a | in-app |
| Family share/unshare | `familySharing.ts:62,72` | **NO** | — | — | — | in-app |
| Family disconnect | `familyDisconnect.ts:58` | **NO** | — | — | — | in-app |
| Shared transaction activity | `onSharedTransactionWrite` | **NO** | — | — | — | in-app |
| Auth/security alert (new device) | `checkNewDeviceAlert` | **NO — mandatory by design** | email only | n/a | server | email |
| Welcome email | client `queueWelcomeEmail` | NO | — | — | — | email (**dead**, SN-14) |

**Core question — "Can a user switch a notification category OFF and still receive that notification from a server-side producer?"**
- **Push producers: NO** — proven: every push producer calls `shouldSendReminderForCategory` before sending; it returns false when `categories[category] === false` or `enabled === false` (`reminderPreferences.ts:62-68`). Missing preferences ⇒ allow (fail-open default).
- **In-app producers: YES** — proven: `createNotification` (`helpers.ts:95-117`) is called by all four family producers with **zero preference reads**; `categories.family` has no consumer anywhere in `functions/src`. Disabling "Family" notifications still produces every family in-app notification (SN-05).
- **Client in-page commitment reminder: YES** — `useTaskReminders` never reads preferences (SN-11).

Explicit defect classes found: toggle-exists-but-no-consumer (`categories.family`, `frequency`, `email`); producer-with-no-preference-concept (all family in-app producers + `useTaskReminders`); client-only preference (none — push enforcement is server-side); default mismatch (UI default OFF vs server fail-open allow when absent); disabled-feature-still-produces (family in-app).

## 5. Quiet hours

Persisted format: `notificationPreferences.quietHours = {enabled:boolean, startTime:'HH:mm', endTime:'HH:mm'}`. Default (UI): `{false,'22:00','07:00'}`. Backend semantics (`reminderPreferences.ts:21-79`):
- `start === end` ⇒ quiet hours **disabled** (`isWithinQuietHours` returns false).
- `start < end` ⇒ quiet window `[start, end)` — start inclusive, end exclusive.
- `start > end` ⇒ overnight wrap (`current >= start || current < end`) — handles 22:00–07:00 correctly **as pure minute-of-day arithmetic**.
- `enabled` false, missing quietHours, or missing start/end ⇒ **send (fail-open)**.
- No DST concept exists (minute-of-day comparison); no UTC conversion is performed **anywhere** — the comparison clock is whatever the producer passes.

**The decisive defect:** every producer passes its own local clock, and none pass the user's timezone:
- `processReminders`, `processBillReminders`, `generateWeeklyReport` pass `format(now,'HH:mm')` — **Cloud Functions system clock (UTC)**. date-fns `format` uses process TZ; functions run UTC.
- Fabric nudges pass the **Lagos** clock (`getLagosClock`, FB-06).
- Quiet-hours values were entered by the user as **their own wall clock** (no timezone field exists to disambiguate — §6).

Worked scenarios (quiet 22:00–07:00, user-meaning local):
| User | Actual quiet window in UTC | Server compares UTC clock to 22:00–07:00 | Result |
|---|---|---|---|
| Lagos (UTC+1) | 21:00–06:00 UTC | suppresses 22:00–07:00 UTC = 23:00–08:00 Lagos | **1 h shifted** — push at 22:30 Lagos (21:30 UTC, allowed) inside true quiet |
| UTC | 22:00–07:00 UTC | exact match | correct only by coincidence |
| UTC+8 | 14:00–23:00 UTC | suppresses 22:00–07:00 UTC = 06:00–15:00 local | **8 h shifted** — morning pushes at 07:00–15:00 local suppressed; evening pushes 23:00–06:00 local NOT suppressed |
| UTC−5 | 03:00–12:00 UTC | suppresses 22:00–07:00 UTC = 17:00–02:00 local | **−5 h shifted** |
| DST transition | user windows drift ±1 h (no DST handling) | n/a | broken |
| User changes timezone while traveling | no timezone field exists; stored HH:mm unchanged | unchanged | quiet window silently means the old location's clock |

**Answers:** quiet hours are evaluated in the **server/default timezone (UTC)** for reminders/bills/weekly, and **Africa/Lagos** for Fabric nudges — never the user's actual timezone (a user-configurable timezone does not even exist as a writable field). Quiet hours are enforced **only by the 5 push producers**; the 4 family in-app producers, the in-page reminder channel, toasts, and email are entirely outside quiet hours. Carries C-05/FB-06 forward and extends them: the same wrong-clock defect also corrupts the quiet-hours suppression itself, not just scheduling.

## 6. Timezone source of truth

| Consumer | Timezone source | Fallback | Correctness |
|---|---|---|---|
| `processReminders` reminderTime match + quiet check + `todayDate` | CF system clock (`format(now,'HH:mm')`, UTC) | none | **wrong for all non-UTC users** (C-05 confirmed) |
| `processBillReminders` quiet check | same | none | wrong (SN-04) |
| `generateWeeklyReport` quiet check | same | none | wrong (SN-04) |
| Fabric nudge scheduling, `getLagosClock` dedupe keys | **hardcoded `Africa/Lagos`** | none | wrong for non-Lagos users (FB-06 confirmed) |
| Fabric `AmbientContext` | `profile.timezone` | device default | **field never written** ⇒ always fallback (dead, FB-16-adjacent) |
| `useTaskReminders` in-page match | device clock (`getHours/getMinutes`) | none | locally correct; diverges from server channel |
| `useTaskReminders` / `billReminderUtils` client day boundaries | device clock | none | locally consistent |
| `authAlertDetection` email timestamp | server `toLocaleString('en-US')` | server TZ | cosmetic only |
| `cleanupExpiredInvitations` | UTC (declared) | — | correct |

**Cross-reference C-05 / FB-06 / FB-16:** confirmed all three live in current code, and this pass adds the finding that the **same user receives inconsistent timing across channels**: commitment reminder in-page at 08:00 device time, commitment push at 08:00 *UTC* (e.g. 09:00 Lagos), bill reminder quiet-check against UTC, Fabric nudge at 20:00 *Lagos* regardless of user location. There is no notification-specific timezone field and no writable user timezone. Do not repair (carried to remediation backlog).

## 7. FCM token registration (lifecycle trace)

| Step | Behavior | Evidence |
|---|---|---|
| 1. Permission request | Only via Settings toggle (`requestPushPermission`) — plus a **separate uncoordinated prompt** on Commitments mount (`useTaskReminders.ts:44-46` requests `Notification.requestPermission()` whenever permission is `'default'`, outside the Settings flow) | `usePushNotifications.ts:87-172`, `useTaskReminders.ts:44` |
| 2. Messaging init | `getMessagingInstance()` lazy | `src/config/firebase` |
| 3. Token generation | `getToken(messaging, {vapidKey, serviceWorkerRegistration: navigator.serviceWorker.ready})` — registers against **`sw.js`** (the only registered SW), with IDB-timing retry (3 attempts) | `fcmTokenService.ts:22-54`, `sw-register.js` |
| 4. Token write | `upsertPushToken(uid, token, navigator.userAgent)` → `setDoc(merge)` at `users/{uid}/fcmTokens/{token}`; fields: `token`, `platform:'web'` (always), `lastSeen: serverTimestamp()`, `userAgent` | `PushTokenApi.ts:9-21` |
| 5. Refresh/rotation | **NONE.** No `onTokenRefresh` (N/A in modular SDK), no periodic re-upsert; a rotated token is only re-persisted if the user toggles push off/on | — |
| 6. Device metadata | `userAgent` string only; no device ID, no app version, no enabled flag | `PushTokenApi.ts:16-21` |
| 7. Restore path | On mount with granted permission: token fetched and held in state — **but never upserted** (SN-03) | `usePushNotifications.ts:34-55` |
| 8. Logout | **No token action** (`AuthContext.logout` = `signOut` + navigate) | `AuthContext.tsx:149-155` |
| 9. Account switch | Same as logout — User A's token doc persists (SN-01) | — |
| 10. Uninstall/browser clear | Token data gone client-side; Firestore doc **orphaned** | — |
| 11. Reinstall | Same token likely re-issued for same browser+VAPID+SW; re-registered only via toggle | — |
| 12. Permission revoked | No listener (`permissionchange` unobserved); doc stays until a send fails with one of 2 stale codes, or user toggles | §7/§25 |
| 13. Token invalidation | Server-side: `registration-token-not-registered`, `invalid-registration-token` ⇒ doc **deleted**; all other codes ignored | `reminderTokenCleanup.ts:5-29` |
| 14. Account deletion | Entire `users/{uid}` subtree deleted incl. `fcmTokens` (§12) | `deleteAccount.ts:123-127` |

Record shape: doc ID **is** the FCM token; UID binding via path; `platform` hardcoded `'web'` (call site never passes an override); no App Check/attestation data; duplicate registration by same user = merge upsert (idempotent); same token under a **different** user = separate doc (SN-10).

**Explicit answers:**
- **Can the same FCM token be associated with two user accounts?** YES — proven structurally: doc path embeds the token under each user's subtree with no uniqueness constraint across users. Realistic sequence: A enables push (token T under A) → A logs out (no cleanup, SN-01) → B enables push on the same browser (FCM returns the same T for the same sender/VAPID/SW) → T now exists under B **and still under A**. Every producer for both users sends to T.
- **Can User A's token remain registered after logout and later cause User A notifications while User B uses the device?** YES — see §11/SN-01 (stop condition).

## 8. Token revocation / stale-device cleanup

Handled: `messaging/registration-token-not-registered`, `messaging/invalid-registration-token` → token doc deleted (`reminderSender.ts:56` → `reminderTokenCleanup.ts`). **Not handled:** `invalid-argument`, `sender-id-mismatch`, `third-party-auth-error`, `quota-exceeded`, canonical-token change (FCM no longer returns canonical tokens via v1 send, but no handling exists either). Unhandled permanent failures are retried by every subsequent daily job forever (bill/weekly/nudges re-query all token docs each run). Logout: no cleanup. Account deletion: full subtree delete (sufficient). Explicit device revoke: **no device list/management UI exists.** Permission removal: no client listener; server learns only via a failed send with one of the 2 handled codes.

| Scenario | Outcome |
|---|---|
| User sells device | Token doc lives until next push fails with a handled code; until then buyer's browser receives A's pushes if token still valid (token lives in the sold browser's IDB — usually cleared, but a retained browser profile persists) |
| User signs out | Token doc persists (SN-01) |
| Shared family tablet switches account | Both docs coexist; both users' pushes arrive (SN-01) |
| App reinstalled (PWA) | IDB reset; old token doc orphaned; usually dies via `registration-token-not-registered` on next send |
| Browser profile retained | Token stays valid; push continues after logout |
| Token expires (rotated) | Old doc orphaned; handled only via the 2 stale codes |
| User disables notifications (OS) | Token doc persists; sends "succeed" at FCM layer or fail invisibly; UI shows BLOCKED badge but doc remains (§25) |

**Answer:** YES — stale registrations can receive sensitive notifications **indefinitely** in the logout/shared-tablet scenario (nothing ever expires them; the only cleanup triggers are 2 FCM error codes or the same user manually toggling push off on that device). Severity carried in SN-01/SN-08.

## 9. Device identity

AnchorOS has **no security-authoritative device identity**. Inventory:
- FCM token = de-facto device identifier for delivery only (opaque, rotatable, browser-profile-scoped).
- `userAgent` string stored per token doc — **client-provided display metadata**, spoofable, used for nothing beyond storage.
- Auth events use a truncated SHA-256 of the client-supplied `userAgent` as a "device fingerprint" (`authAlertDetection.ts:19-30`) — **client-trusted** (A-06 intersection); drives the new-device security email.
- `sessionStorage 'anchor_session_active'`, `localStorage 'anchor_push_disabled'`, `localStorage 'anchor_theme'` — device-scoped flags, **not user-scoped** (SN-03c: the push-disabled flag leaks across accounts on the same browser).
- Device attestation IDs: none stored anywhere (§10).
- No generated installation/device ID; Capacitor `Device` API unused; token-as-device-ID is the only durable identifier.

No device ID participates in any security decision; there is no device-list/device-revoke UI. Distinction made explicit: **display metadata = `userAgent` (client-provided, unverified); security-authoritative device identity = none exists.** The auth-event device/method metadata remains client-trusted exactly as A-06 found; nothing in the notification path re-verifies it.

## 10. Device attestation intersection

Previous finding (inert attestation) **confirmed unchanged**, notification-specific implications only:
- `verifyDeviceAttestation` (functions/src/deviceAttestation.ts) is a Phase-1 stub: returns `{trusted: true}` because App Check is already enforced by `secureOnCall` (`callable.ts:41-47` — enforced only when `ENFORCE_APPCHECK=true` or project is anchor-os/anchor-os-staging).
- FCM token registration (`PushTokenApi`) is a **direct client Firestore write** — attestation is not consulted, not gated, not recorded. Nothing prevents a client from registering any token string under its own account (SN-10).
- No sensitive-notification delivery gate exists; no trusted-device UI intersects notifications; attestation data is collected-but-unused in this domain. No new impact beyond the auth finding; severity not inflated.

## 11. Logout / account switch (cross-user privacy test — STOP CONDITION)

Exact model, proven from code:

1. User A logs in; grants push; token T written under `users/A/fcmTokens/T` (`usePushNotifications.ts:153`).
2. A logs out: `AuthContext.logout()` (`AuthContext.tsx:149-155`) = audit log + `signOut(auth)` + navigate. **No `deleteStoredPushToken`, no `deleteToken`, no preference/local purge.** `usePushNotifications` state persists in the still-mounted `NotificationProvider` (App-level, `App.tsx:125`); its foreground `onMessage` listener effect deps are `[showToast]` only — **it never rebinds on auth change**.
3. User B logs into the same browser.
4. Server producers still find `users/A/fcmTokens/T` on every run (reminders every minute, nudges daily, bills/weekly) — none verify A has an active session.
5. Delivery surfaces on B's device: **background** — `sw.js onBackgroundMessage` → `showNotification` with A's reminder title/body at OS level (no auth check possible in SW, none attempted); **foreground** — the surviving `onMessage` handler toasts `"${title}: ${body}"` inside the app B is using (`usePushNotifications.ts:69-79`), plus sets the badge from A's payload.

**Proven:** User A's data (commitment titles, bill names, Fabric amounts) remains displayed and produces push + foreground notifications that appear in User B's active session. The notification inbox (`users/A/notifications`) is correctly NOT readable by B (owner rules), so the leak channel is precisely push/foreground display. This satisfies the stop-condition bullet *"User A notifications can be delivered to User B's active device/account context."* Documented; **no remediation performed**.

Also proven in the same model: local in-page reminders are mounted per-session and read `tasks` for the *current* user — they do not leak A→B (B's session has no A tasks); badge state persists visually until overwritten.

## 12. Account deletion (cross-reference A-04)

`deleteMyAccount` (`deleteAccount.ts`) deletes the **entire** `users/{uid}` subtree via recursive `deleteDocumentTree` — this **includes** `fcmTokens` (tokens gone), `notifications` (history gone), the user doc (`notificationPreferences` gone), `fabric_nudge_log`, `fabric_analytics`, `authEvents`, `fabric_settings/reports`. That answers A-04's notification portion: token/preferences/history cleanup **is** covered by the subtree delete (A-04's broader non-transactional/incomplete-erasure finding is unchanged).

Residual orphans/gaps proven in this pass (SN-13):
- `reminder_delivery_claims` docs live at `artifacts/{APP_ID}/reminder_delivery_claims` — **outside the user subtree, never deleted**; they carry an `expiresAt` TTL field but **no cleanup job exists** (only writer is `reminderClaim.ts`). Unbounded growth + post-deletion claim residue (harmless to delivery — dedupe keys time-bound by 24 h TTL).
- Deleted user's `recurring_transactions` rows (top-level collection keyed by `userId` field) **survive deletion**; `processBillReminders` keeps matching them daily, fetches the now-missing user doc (prefs undefined ⇒ default-allow), then finds zero tokens and skips. No delivery, but dead work daily and an erasure gap (extends A-04).
- Queued `mail` docs (top-level) for security alerts are not cancellable — an email queued pre-deletion can still send post-deletion (with device description; A-04-adjacent).
- In-flight job: a scheduled run that already fetched tokens/prefs can complete sends **after** deletion (1-minute window for reminders; daily for bill/weekly). Already-queued FCM provider work cannot be recalled.
- Locally scheduled notifications: none exist (§17), so nothing local survives.

**Answer:** a deleted account receives **no new** push after its token docs are deleted (all producers skip on empty token snapshot), but (a) in-flight/queued work can land post-deletion, and (b) non-subtree residue (`reminder_delivery_claims`, `recurring_transactions`, queued `mail`) survives erasure.

## 13. Notification content privacy

| Producer | Title | Body | Data payload | Sensitive? |
|---|---|---|---|---|
| `processReminders` | **commitment title verbatim** (`reminderBatching.ts:12`) | `"+N more commitments due now"` | none (deep link only) | **private task titles on lock screen** |
| `processBillReminders` | `"💰 Bill Due Tomorrow"` / count | **bill title** (`billReminders.ts:33-45`) | none | bill/merchant names |
| `fabricStreakNudge` | "Streak alert" | **`"\"{title}\" streak is at N days…"`** | none | private commitment title (FB-07 confirmed) |
| `fabricBudgetNudge` | "Mid-month check" | percentage only | none | low |
| `fabricSurplusNudge` | "Month-end surplus" | **`₦{surplus} surplus`** (`formatCurrency`) | none | **income-minus-expense amount** (FB-07 confirmed/extended) |
| `generateWeeklyReport` | "Your week in review" | **`"₦{total} spent · N% habits complete · Review ready"`** (`weeklyReport.ts:145`) | none | **total weekly spend amount** (extends FB-07) |
| family in-app | type label | actor + **description + exact amount** (`familyTriggers.ts:65`), account name in `extra` | `accountId/accountName/transactionId` (in-app only) | SN-07 |
| auth alert email | subject | device description, time, account email | — | device metadata (client-trusted, A-06) |

- **Lock-screen exposure:** web-push notifications render title+body at OS lock screen by default (`showNotification` with no `renotify`/privacy options; `silent:false`, `requireInteraction:false`). AnchorOS offers **no "hide sensitive content" setting** and sends no redacted variant.
- **Data payload vs displayed text:** push payloads carry no `data` beyond the FCM `fcmOptions.link` path (and `badgeCount` is never set by any producer) — so no hidden extra sensitivity, but also the same sensitive strings are what the OS displays.
- **Logging:** `reminderSender.ts:52` logs the **first 10 chars of the token** to Functions logs (`token.substring(0,10)`) — a partial routing identifier; treated as sensitive-adjacent (SN-15 note). No transaction amounts/commitment titles found in Functions logs (nudge bodies are built then sent, not logged). `captureError` paths in push code log error messages only.
- Platform privacy settings (Android silent/lockdown, iOS preview-off) are OS-level and respected trivially; AnchorOS adds nothing and offers nothing.

## 14. Recipient targeting correctness

| Producer | Recipient selection | Verdict |
|---|---|---|
| `processReminders` | `doc.ref.parent.parent.id` from the commitment doc itself (never client input) | **correct** |
| `processBillReminders` | `rule.userId` field on `recurring_transactions` (backend-written by recurring pipeline) | correct-by-trust; field is rules-protected? — recurring_transactions rules not re-audited here (06 scope); noted |
| Fabric nudges / weekly | iterates `users` collection directly; UID = doc ID | **correct** |
| `onSharedTransactionWrite` | `sharedWith` keys of the account doc, minus owner | recipient-correct; **attribution wrong** — `actorName` is always the transaction-subtree owner's profile (`familyTriggers.ts:45-47`), so an action by a shared member is attributed to the owner (FS-08 confirmed at the notification layer) |
| `familySharing/Connection*/Disconnect` | explicit UIDs from connection/invite docs | correct |
| `createNotification` | writes into `users/{recipientUid}/notifications` | correct |
| Auth alerts | email from `getAuth().getUser(uid)` | correct |
| `getNotifications`/`dismissNotification` | UID from `request.auth.uid` | correct |

**Answer:** no producer derives the recipient UID from client-supplied request fields; wrong-user delivery via UID/token lookup confusion is **not proven**. The proven cross-user delivery path is the stale-token path (SN-01), not recipient-selection error. Owner/actor confusion exists for in-app attribution (SN-07), not routing.

## 15. Duplicate delivery / idempotency

| Producer | Dedupe mechanism | Failure window |
|---|---|---|
| `processReminders` | 3 layers: per-commitment `lastReminderSent == todayDate`; delivery-key dedupe (date\|time\|titles, 10-min window, `reminderDedupe.ts`); transactional claim with 90 s lease (`reminderClaim.ts`) | Claim lease expiry mid-send (function killed >90 s) → second run re-claims and re-sends; partial send (≥1 token success) marks **all** commitments sent while failed tokens get nothing (no per-token state). Robust overall. |
| `processBillReminders` | `lastBillReminderSent == todayDate` written **after** all sends | Crash after send, before batch commit → duplicate next run; `onSchedule` retry not configured, so realistic only on same-day re-run/manual invocation |
| Fabric nudges | `fabric_nudge_log` field check **before** send, log write **after** send (`sendNudge`) | Two overlapping runs both pass the log check → duplicate nudge; single daily cron makes this unlikely |
| `generateWeeklyReport` | `fabric_reports/{weekKey}` existence check — **report committed before send** (`weeklyReport.ts:130-133`) | Crash after commit, before send → notification silently lost forever (FB-05 confirmed) |
| `onSharedTransactionWrite` | none | Firestore trigger at-least-once ⇒ duplicate in-app notifications possible on trigger replay |
| Client in-page reminder | `lastNotifiedRef` **in-memory only** (resets on remount) | duplicate toast on navigation within the same minute |

Multiple active tokens for the same device: only one doc per token per user, but the SN-01 two-user case delivers the same logical event to one physical device **twice under two UIDs**. Multiple browsers/devices: intended fan-out, correct.

**Answer:** one logical event can reach the same physical device multiple times via: (a) client in-page + server push channels (SN-11, no cross-channel dedupe), (b) two-user stale-token registration (SN-01), (c) trigger replay (in-app), (d) crash windows above. Carries C-05/FB-06 dual-channel consequences forward.

## 16. Client + server double-scheduling

Only one overlap exists: **commitment reminders**. Client `useTaskReminders` (device clock, in-page toast + `new Notification`) and server `processReminders` (UTC clock, FCM) both key on the same user-entered `reminderTime`. Conditions for both firing: app open at the reminder minute AND token registered AND preferences allow commitments. Dedupe: none across channels (independent `lastNotifiedRef` vs `lastReminderSent`). User impact: two notifications for the same task within the same wall-clock minute when user TZ ≈ UTC; at **different** times (up to hours apart) when TZ ≠ UTC — which is worse than duplication because it teaches users reminders are unreliable. No other type is produced by two layers (badges: foreground data-only, no server badge producer).

## 17. Local notifications / Capacitor

**Capacitor Local Notifications and Push Notifications are NOT used** — verified: no `LocalNotifications` / `PushNotifications` import anywhere in `src/`; `capacitor.config.ts` declares only SplashScreen/StatusBar/Keyboard plugins. Consequences (SN-16):
- Native Android/iOS shells have **no push capability**: the WebView does not implement the W3C Push/Notification API the entire web stack depends on. `typeof Notification === 'undefined'` in native ⇒ restore path returns early; the Settings push toggle throws and surfaces a generic error toast.
- The only local "notifications" are the in-page `new Notification(...)` in `useTaskReminders` (page-context, foreground-only, lost on app close — no SW scheduling, no persistence).
- Therefore *"Can locally scheduled User A reminders fire after User B logs in?"* is **N/A** — no OS-level local scheduling exists.
- Badge plugin (`@capawesome/capacitor-badge`) IS used — the sole native-notification-adjacent capability; no producer sends `data.badgeCount`, so badges are driven only by foreground web payloads.

## 18. Service worker / PWA push

`public/sw.js` is the only registered SW (`sw-register.js` → `/sw.js`); it embeds Firebase Messaging **compat** with hardcoded per-environment web config (public identifiers — API keys are not secrets; no server credential committed; F-04 placeholder measurementId unchanged).
- `push` handling via `messaging.onBackgroundMessage`: renders `payload.notification.title/body` verbatim with fixed icon/badge. Plain strings → no HTML interpretation/XSS surface.
- **No `notificationclick` handler in sw.js** — clicks fall back to the FCM compat SDK's default handler, which opens/focuses the `fcmOptions.link` (server-controlled internal path) or the origin root. No client-supplied URL can be injected (producers are server-only), so **unsafe external navigation is not reachable**.
- Malformed payload handling: `payload.notification` guarded; sw.js does not parse `payload.data` (unlike the dead `firebase-messaging-sw.js`, which does `JSON.parse(payload.data.actions)` unguarded — would throw and skip rendering, but that file is dead, §37).
- Stale app state / unauthenticated click: click opens the app at the link path; routing gates unauthenticated users to login; link paths carry **no resource identifiers** (`/commitments`, `/finance`, `/settings?tab=family`, `/notifications` — `reminderRouting.ts`).

## 19. Deep links / notification actions

| Action | Route | Identifiers | Auth gate | Stale behavior |
|---|---|---|---|---|
| Push click (all 5 producers) | `fcmOptions.link` from `reminderRouting` | **none** (category-level routes only) | app router redirects unauthenticated to login | lands on current user's generic view |
| In-app banner "View" (`FamilyNotificationBanner.tsx:61-70`) | `'finance'` or `'settings'` | none in navigation (accountId/accountName shown as text only) | in-app | generic view, no ID leak |
| In-page reminder | n/a (no click action) | — | — | — |

**Answer:** the logged-out/other-user tap scenario does **not** expose User A resource identifiers — by design of identifier-free links. Noted as INFO: identifier-free links also mean deep links cannot land on the specific reminder/account (product gap, not a defect).

## 20. In-app notification history

- Path: `users/{uid}/notifications` (auto-ID). Schema (writer-side, `createNotification`): `type, title, message, actorUid, actorName, read:false, dismissed:false, createdAt:serverTimestamp, …extra (accountId, accountName, transactionId)`. No schema enforcement on client-created docs.
- Readers: `FamilyNotificationApi.subscribeToUnreadNotifications` (unread, `limit(5)`, orderBy `createdAt`), `AccountNotificationsApi.subscribeToAccountNotifications` (orderBy `date` — **field mismatch**: backend writes `createdAt`, so the `date`-ordered query silently excludes documents lacking `date`), `getNotifications` callable (uses `dismissed`+`createdAt`, correct).
- Mutations: mark read / dismiss (rules restrict update keys to `read`,`dismissed` — correctly enforced); **no delete, no bulk clear, no retention/pagination beyond limit()**.
- Rules: owner read; create **allowed for owner** ("developer tools" carve-out) ⇒ a user can fabricate arbitrary notification-history entries, including security-looking types, **in their own inbox only** (cannot target others; cannot mutate actor metadata of existing docs). LOW.
- History survives logout only in the local Firestore IDB cache (general local-cache hygiene, not re-audited here).
- Deleting a source resource: trigger records "Transaction Deleted"; `accountId`/`accountName` remain in history after the account is unshared/deleted (misleading residue; LOW).

## 21. Auth / security alerts

- Source: `recordAuthEvent` callable (client-supplied `userAgent` + `method` — client-trusted, A-06) + `checkNewDeviceAlert` comparing UA hashes.
- Delivery: **email only** (`queueEmail` → `mail` collection), bypassing all user notification preferences — a de-facto **mandatory security alert**; but the product never defines that policy, and the alert has **no push or in-app channel at all**, so a user without email access has no alternative. The user-configurable-vs-mandatory distinction is **not consistently defined** in the implementation.
- "Not me" reporting: `reportUnrecognisedDevice` force-revokes sessions (auth domain, unchanged).
- Content: device description (parsed from client UA — spoofable, A-06), time, account email. Acceptable; forensic value limited by client trust.
- Token cleanup: none tied to security events — push tokens are not session-scoped (part of SN-01).

## 22. Family notifications (cross-reference 07 / FS-08)

Recipients derived server-side from `family_connections`/`sharedWith` (correct); disconnect stops future shared-transaction notifications because `sharedWith` entries are deleted (FS-04 caveat: non-transactional — a racy write can yield one trailing notification). Former-member tokens never targeted (family producers use no FCM). Private names in bodies: account names disclosed at share time (legitimate recipient) and re-disclosed by `account_unshared` after access ends (minor residue). Actor attribution: FS-08 confirmed at the notification layer (SN-07). Preferences/quiet hours ignored (SN-05).

## 23. Finance notifications (cross-reference 06)

Bill reminder exposes bill titles; weekly report exposes ₦ totals (SN-06). No balance/transaction-row data leaves the server via push beyond those. Known finance duplication (FI-06/FI-18) can create misleading in-app "Transaction Added" volume for family members when offline replays duplicate rows — notification surface only. Bank/Mono sync produces **no** notifications (no sync-failure/reconnect alert exists — gap, INFO).

## 24. Commitment notifications (cross-reference 08)

Timezone: C-05 confirmed and extended to quiet hours (SN-04). Duplicate delivery: dual-channel (SN-11). Cadence: once/day via `lastReminderSent`, but day gating uses the **UTC** date (`format(now,'yyyy-MM-dd')`) — midnight-boundary users reminded on the wrong calendar day; weekly/monthly commitments with `reminderTime` are reminded **every day** the time matches (scheduler checks only `reminderTime`+`completed`, no day-of-week/month filter). Completion suppression: `completed == false` filter, correct. Deletion cancellation: removed from collection group; one-shot in-flight batch may still include it. Local vs server overlap: §16.

## 25. Fabric notifications (cross-reference 09)

FB-06 confirmed unchanged (Lagos-pinned schedules/dedupe). FB-07 confirmed and **extended** to `generateWeeklyReport` (₦ totals) and bill reminders (SN-06). Dedupe: per-day/per-month field flags with check-before-send/write-after-send window (§15). Enable/disable: gated on `fabric_settings.enabled` — disabling Fabric stops nudges+weekly; bill/commitment reminders are not Fabric-gated (correct). Account deletion: `fabric_nudge_log`/`fabric_analytics`/`fabric_reports` are inside the user subtree — deleted (§12). Quiet hours: shared `shouldSendReminderForCategory` with Lagos clock (FB-06).

## 26. Permission denial / OS state

| Model | Behavior |
|---|---|
| User denies permission | `requestPushPermission` shows "Notifications blocked"; no token write. Toggle disabled + BLOCKED badge (accurate). |
| Grants then revokes (browser setting) | `pushPermissionStatus` captured at mount and after toggle only — **revocation is not observed live** (no `permissionchange` listener) until reload; token doc persists (§8). |
| Browser resets permission (site data cleared) | Token/IDB gone; Firestore doc orphaned until a stale-code failure. |
| iOS standalone PWA | Not verifiable statically (UH-SN04). |
| Android runtime denial | Same as web deny path. |
| Token exists despite denied UI permission | Possible: revoke after grant leaves doc + valid token; whether browsers still deliver SW push post-revocation is platform-dependent (UNPROVEN). |
| Server still targets old token | Yes — until a handled stale-code failure. |

**Answer:** YES — AnchorOS can show push as **ON** (granted badge) while delivery is actually impossible (no token doc, SN-03), and after BUG-039 the toggle reverts to ON on reload while delivery is disabled. The reverse (OFF shown while OS allows) occurs via the shared-browser `anchor_push_disabled` flag. UI/OS/actual state are three systems that disagree in multiple documented ways.

## 27. Settings consistency matrix

| Setting | UI says | Stored value | Actual enforcement | Verdict |
|---|---|---|---|---|
| Push Notifications toggle | ON when OS permission granted | none (state = OS permission + local flag) | delivery requires token doc; OFF deletes token; ON ≠ registered | **MISLEADING** (SN-03) |
| Email Notifications toggle | gates email notifications | `notificationPreferences.enabled` | **gates ALL push** producers; email unaffected | **INVERTED / NO-OP for its label** (SN-02) |
| Notification Email input | sets notification address | `.email` | **no consumer** | NO-OP (SN-02) |
| Frequency (instant/daily/weekly) | sets alert cadence | `.frequency` | **no consumer** | NO-OP (SN-02) |
| Finance toggle | gates finance alerts | `.categories.finance` | bill + budget/surplus nudges + weekly | OK |
| Commitments toggle | gates task alerts | `.categories.commitments` | commitment reminders + streak nudge (push only; **in-page reminder ignores it**) | PARTIAL |
| Family toggle | gates family alerts | `.categories.family` | **no consumer — in-app family notifications unaffected** | NO-OP (SN-05) |
| Quiet hours | suppresses push during set hours | `.quietHours` | enforced by 5 push producers in **wrong clock domain** | BROKEN (SN-04) |
| (hidden) master `enabled` default | — | absent | server default-allow | default mismatch |
| `profile.timezone` | (no UI) | never written | AmbientContext fallback | dead field |
| Badge | no setting | — | foreground-only, never server-driven | no control offered |

No additional inverted booleans found; no unreachable settings screens in this domain.

## 28. Settings save failure / concurrency

- Save path: `updateProfile` → `updateDoc(users/{uid}, updates)`; the UI renders from the Firestore snapshot — **no optimistic local write for signed-in users**, so a failed save simply never commits (acceptable; no rollback bug proven).
- **Two tabs / two devices:** `onUpdatePreferences` spreads `...(profile.notificationPreferences || …)` — the **whole preference object is rewritten from each tab's snapshot** (last-writer-wins at object granularity). Tab A toggling a category while Tab B (stale snapshot) changes quiet hours silently reverts one side. PROVEN structurally (partial-preference overwrites).
- Rapid toggle: each click issues a full object write; final state = last write to land, not last click.
- Prefs update concurrent with a running job: job cached prefs in-memory per run → new values apply next run (≤1 min reminders; ≤1 day bill/weekly) — bounded staleness.
- Logout during save: write lands on the user's own doc regardless; harmless.
- MFA-sync interference: `AuthContext` profile subscription itself issues `updateUserProfile({mfaEnabled})` on mismatch (`AuthContext.tsx:104-105`) — an additional last-writer-wins actor on the same document.

## 29. Firestore rules map (notification/device paths)

| Path | Rules | Classification |
|---|---|---|
| `users/{uid}/fcmTokens/{token}` | `allow read, write: if request.auth.uid == userId` (`firestore.rules:163-165`) | owner rw, **no field/format validation** |
| `users/{uid}/notifications/{id}` | read owner; update owner limited to `read`/`dismissed`; **create owner**; delete owner (`:318-326`) | owner; create carve-out |
| `users/{uid}` (profile incl. notificationPreferences) | owner rw, no field validation (`:147-149`) | owner |
| `users/{uid}/settings/{docId}` | owner rw (`:151-154`) | owner |
| `reminder_delivery_claims` | **no matching rule** ⇒ default deny (`/{document=**}`); Admin SDK bypasses | backend-only (by deny) |
| `fabric_nudge_log`, `fabric_analytics` | read owner, write false (`:211-214`) | backend-only |
| `mail` | read/write false (`:383-385`) | backend-only — **breaks the client welcome-email path (SN-14)** |
| `authEvents` | read owner, write false (`:223-226`) | backend-only |

Explicit checks: client **cannot** register a token under another user's tree (owner path binding) — but **can** register any string as a token under their own tree, including another person's token if known (SN-10). Client **can** fabricate own notification history (owner create). Client **cannot** mutate server-set fields (read/dismiss only). Client can write arbitrary shapes into `notificationPreferences` (no validation → SN-09). The emulator rules suites (`src/__tests__/firestore-rules.*.emulator.ts`) contain **zero cases** for `fcmTokens` or `notifications` (grep) — UNPROVEN by test evidence.

## 30. Backend functions / jobs inventory

| Function | Trigger | Auth | UID source | Prefs | Quiet hrs | TZ | Stale-token cleanup | Dedupe | Tests |
|---|---|---|---|---|---|---|---|---|---|
| `processReminders` | every 1 min | scheduler | commitment doc parent | YES | YES (UTC clock) | UTC | YES (2 codes) | 3-layer | components only |
| `processBillReminders` | daily 09:00 | scheduler | `rule.userId` | YES | YES (UTC) | UTC | YES | day-flag | helpers only |
| fabric nudges ×3 | daily/14th/28–31 | scheduler | users collection | YES | YES (Lagos) | **Lagos** | YES | nudge log | helpers only |
| `generateWeeklyReport` | Sunday 19:00 | scheduler | users collection | YES | YES (UTC) | UTC | YES | report doc | helpers only |
| `getNotifications` / `dismissNotification` | callable | auth + rate limit | `request.auth.uid` | n/a | n/a | — | — | — | none |
| `onSharedTransactionWrite` | Firestore trigger | n/a | event params | **NO** | NO | — | — | none | none |
| `checkNewDeviceAlert` | sign-in flow | n/a | auth UID | NO (mandatory) | n/a | server | — | none | present |
| `sendTemplatedEmail` | callable | auth | auth UID | n/a | — | — | — | — | none |
| `verifyDeviceAttestation` | callable | auth | auth UID | n/a | — | — | — | — | present (stub) |
| `deleteMyAccount` | callable | auth + reauth window | auth UID | deletes | — | — | subtree delete | — | none (A-04) |
| `cleanupExpiredInvitations` | daily 03:00 UTC | scheduler | invitations | n/a | — | UTC | — | status flag | none |

Sensitive payloads: §13. Scheduler retry: none configured on any `onSchedule` function (fail once, skip).

## 31. Logging / telemetry privacy

- `reminderSender.ts:52,58` and `reminderTokenCleanup.ts:28` log **token prefixes** (first 10 chars) + failure messages to Functions logs — tokens are sensitive routing identifiers; prefix exposure is low-risk but nonzero (LOW).
- Both SWs `console.log` the **full background payload** (title/body) to the browser console — lock-screen content duplicated into any devtools/extension context (LOW).
- No FCM tokens, amounts, commitment titles, or family metadata found in other Functions `logger` calls; `createAuditLog('security_alert_new_device')` stores device description + time (metadata only); `captureError` paths log error messages, not payloads.

## 32. Type-safety intersections

- `@ts-nocheck` on **all** notification-critical client files: `usePushNotifications.ts`, `PushTokenApi.ts`, `NotificationContext(.Definition).tsx`, `useAccountNotifications.ts`, `AccountNotificationsApi.ts`, `FamilyNotificationApi.ts`, `FamilyNotificationBanner.tsx`, `NotificationSettings.tsx`, `QuietHoursSettings.tsx`, `NotificationCategoryToggles.tsx`, `useTaskReminders.ts`, `SettingsView.tsx`, `deviceAttestation.ts`, `AuthProfileApi.ts` (+ `functions/src/index.ts`). Invariant weakened: `notificationPreferences` crosses client→rules→backend with **no enforced shared contract**; backend casts unvalidated Firestore data (`as NotificationPreferences | undefined`).
- Concrete failure: client writes `quietHours: {startTime: 5}` → rules pass (no validation) → `toMinutes(5).split` throws inside `processReminders` → the whole reminders job aborts for all users (SN-09). Unguarded `txData.amountCents / 100` (`familyTriggers.ts:49`) renders `NaN` in notification text for corrupt data.
- Platform detection: SW picks Firebase config by hostname (`sw.js:51-58`) — any unknown host falls through to **production** config (fail-open to prod sender ID on unintended hosts).

## 33. Test-evidence matrix

| Question | Evidence | Verdict |
|---|---|---|
| Toggle off blocks corresponding push | `reminderPreferences.test.ts` + all producers call it | PROVEN (unit only) |
| Quiet hours work / overnight boundaries | `reminderPreferences.test.ts` (wrap, start==end) | PROVEN **as pure arithmetic** |
| Quiet hours in the user's timezone | no test; implementation uses UTC/Lagos | **CONTRADICTED BY IMPLEMENTATION** (SN-04) |
| Reminder timezone correctness | no scheduler test (`reminders.ts` untested) | UNPROVEN / contradicted (C-05) |
| FCM register / token doc shape | `PushTokenApi.test.ts` (mocked Firestore) | PROVEN (mocked) |
| Token rotation / refresh | no test, no code | UNPROVEN (absent) |
| Logout cleanup / account switch | no test; code shows no cleanup | **CONTRADICTED BY IMPLEMENTATION** (SN-01) |
| Account deletion cleanup | code read; no test | PARTIALLY PROVEN (A-04: zero tests) |
| Invalid-token cleanup | `reminderTokenCleanup.test.ts` (2 codes) | PROVEN for 2 codes; rest absent |
| Duplicate delivery / dedupe | `reminderDedupe.test.ts`, `reminderClaim(.transaction).test.ts` | PROVEN (reminders only) |
| Permission revoke | `usePushNotifications.test.ts` covers deny-at-request, not revocation lifecycle | PARTIALLY PROVEN |
| Notification deep link | `reminderRouting.test.ts` | PROVEN (mapping only) |
| Click while logged out / after account switch | no test | UNPROVEN (statically safe, §19) |
| Family recipient correctness | none (`familyTriggers` untested) | UNPROVEN |
| Security-alert recipient correctness | `authAlertDetection.test.ts` | PROVEN (unit) |
| Sensitive content handling | none | UNPROVEN (defect documented, SN-06) |
| Notification history isolation | **zero** rules-emulator tests for `notifications` | UNPROVEN |
| Settings toggle UI | `NotificationSettings/QuietHoursSettings/NotificationCategoryToggles` tests | PROVEN (render/callback only; semantics untested) |

No test in the repository exercises producer→token-query→send→cleanup end-to-end; no emulator Functions tests exist for this domain. Mocking `send()` alone does not prove targeting or cleanup.

## 34. Failure-injection matrix

| Injection | Outcome | Class |
|---|---|---|
| Preference write fails | UI never commits (snapshot-driven); user retries | CONSISTENT |
| Producer reads stale preference | ≤1 min (reminders) / ≤1 day (bill/weekly) staleness | CONSISTENT (bounded) |
| Stale snapshot rewrite (2 tabs/devices) | whole-object last-writer-wins reverts one side | PREFERENCE-VIOLATION |
| FCM send succeeds, `lastReminderSent`/dedupe write fails | re-send possible (bill/weekly); reminders bounded by 10-min key window | DUPLICATED |
| Log write succeeds, FCM send fails | bill/weekly mark reminded with nothing delivered (FB-05 for weekly) | ORPHANED |
| Function retry / duplicate trigger | claim lease + dedupe key hold for reminders; bill/weekly/nudge windows open | DUPLICATED (edge) |
| Token invalid (2 handled codes) | doc deleted, future sends skip | CONSISTENT |
| Token invalid (unhandled codes) | doc persists, retried daily forever | STALE (SN-08) |
| Logout during send | token doc survives; next run hits it again | PRIVACY-STALE (SN-01) |
| Account deletion during scheduled job | in-flight batch delivers post-deletion | PRIVACY-STALE |
| Timezone change (travel) | no user TZ exists; stored times mean the old location | TIMING-VIOLATION (SN-04) |
| Quiet-hours boundary | start inclusive, end exclusive; arithmetic consistent, clock wrong | TIMING-VIOLATION |
| User switch (same browser) | A's pushes/foreground toasts render in B's session | PRIVACY-STALE (SN-01) |
| Local reminder pending after logout | N/A — no OS-scheduled local notifications | N/A |
| Stale push clicked under another account | identifier-free link → generic view, no A data | CONSISTENT |
| Malformed preference doc | scheduler aborts for all users until fixed | PREFERENCE-VIOLATION (SN-09) |
| `mail` write from client (welcome) | rules deny → silent catch | ORPHANED (SN-14) |

## 35. Confirmed findings

### SN-01 · HIGH · Logout/account-switch leaves the FCM token registered — User A's notifications are delivered while User B is active (**STOP CONDITION**)
- **Confidence:** high (fully code-proven).
- **Paths/symbols:** `src/context/AuthContext.tsx:149-155` (`logout` — no token cleanup); `src/hooks/usePushNotifications.ts:33-55` (restore), `:69-85` (foreground listener not auth-scoped); `src/context/NotificationContext.tsx:38` + `src/App.tsx:125` (App-level provider); producers `functions/src/{reminders,billReminderScheduler,fabricNudgeHelpers,weeklyReport}.ts`; `public/sw.js:66-78`.
- **Flow:** A enables push → token doc under `users/A` → A logs out (cleanup absent) → server jobs keep sending to `users/A/fcmTokens/*` → SW renders at OS level; foreground handler (mounted regardless of auth) toasts A's content in B's session.
- **Expected invariant:** session end must detach the device from the account's delivery surface (or delivery must verify session validity server-side). **Actual:** nothing detaches it; no expiry, no session check in producers, no auth scoping in SW/foreground handler.
- **Repro:** two accounts, one browser; enable push as A, set a commitment reminder, log out, log in as B, wait for the reminder minute → OS notification with A's commitment title + in-app toast in B's session.
- **User/privacy impact:** cross-user disclosure of reminder/bill/Fabric content on shared devices; indefinite persistence. **Blast radius:** every shared-browser/PWA install.
- **Existing mitigation:** none (only A manually toggling push off before logout). **Tests:** none (§33 CONTRADICTED).
- **Remediation direction (high-level only):** delete/disable token docs on logout and account switch, and/or verify session validity before send. Not implemented here.
- **Stop condition:** matches "User A notifications can be delivered to User B's active device/account context" — **triggered**; reported, not remediated.

### SN-02 · MEDIUM · "Email Notifications" toggle is the global push master switch; email/frequency fields are dead controls
- **Confidence:** high. **Paths:** `NotificationSettings.tsx:72-81` (label "Email Notifications" writes `enabled`), `SettingsView.tsx:155-161` (`emailEnabled={profile.notificationPreferences?.enabled}`), `reminderPreferences.ts:62-64` (`enabled === false` suppresses ALL push categories); §3 (no consumer of `.email`/`.frequency` in `functions/src`).
- **Flow:** OFF "email notifications" → all push reminders silently disabled; ON + instant/daily → nothing email-related exists to honor it.
- **Expected:** toggle semantics match label; persisted fields have consumers. **Actual:** inverted scope + two no-op controls presented as functional.
- **Impact:** users silently lose all reminders believing they disabled email; false control expectations. **Tests:** `NotificationSettings.test.tsx:81` asserts only the callback — cements the wrong semantics.

### SN-03 · MEDIUM · Push toggle/UI state diverges from actual delivery state (three systems disagree)
- **Confidence:** high. **Paths:** `usePushNotifications.ts:33-55` (restore never upserts token), `:95-116` (BUG-039 disable sets in-memory status `'default'`; OS permission stays granted), `NotificationSettings.tsx:54-67` (badge/toggle from `pushPermissionStatus` only), `usePushNotifications.ts:18,26-28` (`anchor_push_disabled` localStorage is device-global, not per-account).
- **Scenarios:** (a) disable push → reload → toggle shows ON while token doc deleted (no delivery); (b) fresh login with pre-granted permission → ON shown, no token doc → silent non-delivery; (c) A disables push → B on the same browser inherits the disabled restore path.
- **Impact:** users believe push is on/off incorrectly; missed reminders presented as enabled.

### SN-04 · MEDIUM · Quiet hours (and reminder matching) evaluated in the wrong clock domain — UTC for reminders/bills/weekly, Africa/Lagos for Fabric; user timezone not represented
- **Confidence:** high (carries C-05/FB-06; extends them to quiet hours). **Paths:** `reminders.ts:14-24` (`format(now,'HH:mm')` on UTC), `billReminderScheduler.ts:16,50`, `weeklyReport.ts:29-33,138`, `fabricNudgeHelpers.ts:7-9` (Lagos), `reminderPreferences.ts:26-44`; no user timezone field exists (§6). Worked cases (Lagos/UTC/UTC+8/UTC−5/DST/travel) in §5.
- **Impact:** quiet hours fail for every non-UTC user in 3 of 5 producers (Lagos-pinned in the 4th); pushes land inside true quiet windows or are suppressed at wrong times.

### SN-05 · MEDIUM · Family category toggle and notification preferences never gate family in-app notifications (toggle is a no-op)
- **Confidence:** high. **Paths:** `helpers.ts:95-117` (`createNotification` — no preference read); callers `familyTriggers/familySharing/familyConnection*/familyDisconnect`; zero consumers of `categories.family` in `functions/src`.
- **Impact:** user disables "Family" notifications and still receives every family event in-app; control is cosmetic.

### SN-06 · MEDIUM · Sensitive financial/task content in push bodies beyond FB-07's recorded scope
- **Confidence:** high. **Paths:** `weeklyReport.ts:145` (`₦{total} spent`), `fabricNudgeHelpers.ts:28-30` + `fabricNudges.ts:93` (`₦ surplus`), `billReminders.ts:33-45` (bill titles), `reminderBatching.ts:12` (commitment title as notification title); no redaction/"hide content" option (§13).
- **Impact:** lock-screen disclosure of spend totals, surplus amounts, bill names, private task titles to anyone holding the device (compounded by SN-01 on shared devices). FB-07 confirmed; blast radius extended to non-Fabric producers.

### SN-07 · MEDIUM · In-app family transaction notifications disclose description + exact amount; attribution always the account owner (FS-08 at notification layer)
- **Confidence:** high. **Paths:** `familyTriggers.ts:49-83` (`${actorName} added ${description} - ${formattedAmount}`; `actorName` = subtree owner's profile regardless of who acted).
- **Impact:** privacy (amount/description exposure to all shared members; no preference gate per SN-05) + misleading attribution. Carries FS-08 forward.

### SN-08 · MEDIUM · Stale-token cleanup covers only 2 error codes; no rotation handling; unhandled permanent failures retried forever
- **Confidence:** high. **Paths:** `reminderTokenCleanup.ts:5-16` (code set), `reminderSender.ts:54-61`; no canonical-token/`onTokenRefresh`/periodic re-upsert (§7 rows 5/13).
- **Impact:** permanent-failure tokens (`invalid-argument`, sender mismatch, quota) persist and are re-attempted by every daily job indefinitely; delivery gaps masked.

### SN-09 · MEDIUM · Unvalidated client-writable `notificationPreferences` can abort the global reminders scheduler
- **Confidence:** medium-high (logic proven; prevalence of malformed docs in production unknown). **Paths:** rules `:147-149` (no validation), `reminderPreferences.ts:21-24` (`toMinutes` throws on non-string), `reminders.ts:111-114` (one try/catch around the whole loop — one user's throw fails the entire run).
- **Impact:** self-or-third-party DoS on reminders (for every user) until the malformed doc is fixed; type-safety intersection (§32).

### SN-10 · LOW · FCM token registration accepts arbitrary token strings; token is a bearer routing identifier; no attestation gate
- **Confidence:** high (rules allow own-tree arbitrary writes). **Paths:** `firestore.rules:163-165`, `PushTokenApi.ts`; §10 (attestation inert).
- **Impact:** knowing another user's token value (compromised log/IDB) lets an attacker register it under their own account and receive that device's notifications for both accounts; requires secret knowledge, hence LOW. Same-token-two-users also occurs benignly (SN-01).

### SN-11 · LOW · Dual-channel commitment reminder with no cross-channel dedupe (client in-page + server push)
- **Confidence:** high. **Paths:** `useTaskReminders.ts:10-52` vs `reminders.ts`; independent dedupe state.
- **Impact:** duplicate or time-skewed double reminders (C-05 dual-channel consequence); in-page channel ignores preferences/quiet hours (§4).

### SN-12 · LOW · Missed-minute reminders silently dropped; partial-batch success marks all sent
- **Confidence:** high. **Paths:** `reminders.ts:27-29` (equality match on the exact minute; no retry window), `reminderDelivery.ts:84-94` (`hasAnySuccess` → all commitments marked sent even if some tokens failed).
- **Impact:** missed push never retried; per-token failures silently lost for the day.

### SN-13 · LOW · Account-deletion orphans: uncleaned `reminder_delivery_claims`, surviving `recurring_transactions`, uncancellable queued `mail`, in-flight delivery window
- **Confidence:** high. **Paths:** `deleteAccount.ts` (subtree only), `reminderClaim.ts:68-69` (top-level claims; `expiresAt` TTL never enforced by any job), `billReminderScheduler.ts` (queries top-level rules), `emailQueue.ts` (`mail` queue).
- **Impact:** erasure residue (extends A-04); no post-deletion push (tokens deleted) beyond the in-flight window.

### SN-14 · LOW · Welcome-email path is dead: client writes to `mail`, which rules deny
- **Confidence:** high. **Paths:** `AuthProfileApi.ts:36-41`, `firestore.rules:383-385`, `AuthContext.tsx:138-139` (silent catch).
- **Impact:** welcome email silently never sent; no security impact (rules correctly prevent client-injected mail).

### SN-15 · INFO · Payload content to console; token prefixes in Functions logs
- **Paths:** `usePushNotifications.ts:70`, both SWs `console.log(payload)`; `reminderSender.ts:52,58`, `reminderTokenCleanup.ts:28`. Observational; no remediation.

### SN-16 · INFO · Native/Capacitor shells have no notification capability (no Push/Local plugins; WebView lacks web-push)
- **Paths:** `capacitor.config.ts`, §17. Native users get zero reminders/nudges (security email only). Product-parity gap, not exploitable.

## 36. Unverified high-risk behaviors

- **UH-SN01** — End-to-end production FCM delivery (permission→token→send→SW render) has never been exercised in this audit; requires a live device. If broken, the entire push domain is silently dead (SN-03 shows the UI would not reveal it).
- **UH-SN02** — Browser-profile token retention after "uninstall"-class events (how long a sold/shared device keeps receiving pushes before stale-code cleanup) — data-dependent.
- **UH-SN03** — Whether the Trigger Email extension is actually deployed and consuming `mail` in production; if not, ALL security alerts (new-device) silently never deliver — a security-alert delivery failure would be HIGH-impact. UNPROVEN from repo.
- **UH-SN04** — iOS standalone PWA push behavior (16.4+ Permission API in standalone mode) untested; provisional/denied state mapping unverified.
- **UH-SN05** — Whether browsers still deliver SW push after OS-level permission revocation while the token doc persists (platform-dependent; affects SN-01 severity).

## 37. Reachability / dead code (this domain only)

- `public/firebase-messaging-sw.js` — **dead** (never registered; `sw-register.js` registers `/sw.js` only); contains an unguarded `JSON.parse(payload.data.actions)` absent from the live sw.js.
- `sendTemplatedEmail` callable — **vestigial**: builds a template and returns `{success:true}` without writing to `mail` or sending anything; registry marks it `internal`.
- Dead preference fields: `notificationPreferences.email`, `.frequency`, `.lastDigestAt`; dead profile field `timezone` (read by Fabric AmbientContext, never written).
- Dual-SW design indicates an abandoned migration; only sw.js is live.
- No obsolete notification services beyond the above; the missing `reminder_delivery_claims` cleanup job is a gap, not dead code.

## 38. Remediation order (backlog only — NOT executed)

1. **SN-01** (stop-condition grade): token deregistration on logout/account switch + server-side delivery gating.
2. **SN-02/SN-03**: rewire settings semantics (rename/split master toggle; persist token on restore; reflect real registration state in UI).
3. **SN-04** (with C-05/FB-06): single timezone policy + stored user timezone; evaluate quiet hours in that TZ.
4. **SN-05/SN-06/SN-07**: preference gating + content minimization + attribution fix for family/in-app producers.
5. **SN-08/SN-09/SN-13**: broaden stale-code handling; validate preferences at the rules/functions boundary; add claims cleanup job.
6. **SN-10..SN-16**: hardening/parity items; verify UH-SN03 first (security-alert email delivery).

## 39. Evidence appendix

Primary files read in full: `functions/src/{reminders,reminderDelivery,reminderSender,reminderPreferences,reminderDedupe,reminderClaim,reminderBatching,reminderRouting,reminderTokenCleanup,billReminders,billReminderScheduler,fabricNudges,fabricNudgeHelpers,weeklyReport,notifications,registries/notifications,deleteAccount,familyTriggers,familySharing,familyConnection,familyConnectionConfirm,familyDisconnect,authAlertDetection,authEvents,deviceAttestation,callable,email,emailQueue,helpers}.ts`; `src/{hooks/usePushNotifications,hooks/useTaskReminders,hooks/useAccountNotifications,services/fcmTokenService,services/deviceAttestation,api/PushTokenApi,api/AccountNotificationsApi,api/FamilyNotificationApi,api/AuthProfileApi,context/NotificationContext,context/NotificationContextDefinition,context/AuthContext,utils/appBadge,components/FamilyNotificationBanner,features/settings/SettingsView,features/settings/components/{NotificationSettings,NotificationCategoryToggles,QuietHoursSettings,useAnchorAISettings},features/finance/utils/billReminderUtils}`; `public/{sw.js,firebase-messaging-sw.js,sw-register.js}`; `capacitor.config.ts`; `config/firestore.rules` (notification/device paths); `src/types/index.ts` (UserProfile); `src/features/commitments/components/TaskForm.tsx`. Grep evidence: zero `PushNotifications`/`LocalNotifications` usage; zero rules-emulator tests for `fcmTokens`/`notifications`; zero consumers of `.frequency`/`.email`/`.lastDigestAt`; zero writers of `profile.timezone`; token-cleanup call sites limited to `reminderSender`; `createNotification` callers all bypass preferences.
