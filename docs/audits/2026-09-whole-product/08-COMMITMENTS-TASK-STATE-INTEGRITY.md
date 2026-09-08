# 08 — Commitments / Task State Integrity — Forensic Domain Audit

Date: 2026-09-08 · Branch: `audit/whole-product-2026-09` · Head: `f4f0a87f7d063675827eb1fc7d866eca3a4d3b7d`
Scope: Commitments → task lifecycle → completion state → recurrence/reset → streak integrity → offline mutation → optimistic UI → reminders/notifications → ownership → deletion/update consistency.
Mode: **AUDIT ONLY** — no production code, rules, or tests were modified. BUG-023 was not remediated.

## 1. Executive summary

The commitments domain is a thin client-side state machine over Firestore with **no server-side authority for completion, streaks, recurrence, or reset**. Every semantic decision (whether a toggle means "complete" or "uncomplete", whether a streak increments, whether a new cycle has started, whether a reminder is due) is derived from client-supplied arguments, client-local clocks, and possibly-stale client caches. Firestore's rules restrict *who* can write a commitment document but place almost no constraint on *what* may be written.

Verdicts at a glance:

| Question | Verdict |
|---|---|
| Is BUG-023 solved as an invariant? | **NO — improved for the single-click online path only.** Optimistic update + transaction covers the happy path; the toggle is not idempotent, direction is client-argued, queue replay and duplicates re-apply streak mutations, and stale polls can overwrite optimistic UI. Findings C-01/C-02/C-03. |
| Streak integrity | **Not guaranteed.** Streak can double-increment per cycle, decrement below baseline via offline replay, and survive a fully missed day (time-threshold, not cycle-based). `longestStreak` is monotonic in the normal path only. C-01/C-02/C-04/C-09. |
| Recurrence/reset | **Client-lazy, clock-based, blind writes.** Derived from client-local calendar and possibly-stale cached data; no server reset exists; can race with completion; monthly reset ignores year; app-never-opened = never reset. C-04. |
| Offline / idempotency | **Not idempotent.** Queue stores stale transitions, no retry cap/TTL/lock; replay can corrupt streaks; only *toggles* are supported offline (Firestore cache is `memoryLocalCache`). C-01/C-02. |
| Reminders | **Two uncoordinated channels, one timezone-broken.** Server FCM scheduler compares user-local `reminderTime` against UTC `HH:mm` (wrong hour for most users); client in-app channel fires at correct local time → duplicates/misses. C-05. |
| Delete / resurrection | **No resurrection vector found.** All mutations are `updateDoc`/transaction-read-based; a deleted document makes toggles no-op (transaction early-return) and deletes fail outright — queued toggles for deleted tasks drain harmlessly. Residual: queue entries are not proactively purged (C-02), delete is audited before it succeeds (C-08). |
| Cross-user mutation | **Denied by rules** (`commitments` update requires path-uid == auth uid). Family members: read of `category == 'family'` rows only, write denied (07 §10 stands). FS-01's post-disconnect read exposure applies to family-category commitments — no *broader* commitment impact found; reference 07, no new stop condition. |
| Stop conditions (§22) | **None newly triggered.** |

Confirmed findings: **C-01 (HIGH), C-02 (HIGH), C-03 (MEDIUM), C-04 (MEDIUM), C-05 (MEDIUM), C-06 (MEDIUM), C-07 (MEDIUM), C-08 (LOW), C-09 (LOW), C-10 (LOW), C-11 (LOW)**. Unverified high-risk behaviors: UH-C01…UH-C06.

## 2. Architecture / data flow map

### 2.1 Canonical modules (inventory)

| Layer | File | Role |
|---|---|---|
| UI orchestrator | `src/features/commitments/CommitmentsView.tsx` (`@ts-nocheck`) | view switching, add/edit/delete handlers, family-scope UI |
| UI components | `components/TaskItem.tsx`, `SwipeableTaskItem.tsx`, `TaskList.tsx`, `TaskForm.tsx`, `TaskFormParts.tsx`, `EditTaskForm.tsx`, `EditTaskFormFields.tsx`, `WeeklyView.tsx`, `MonthCalendarView.tsx`, `TimelineView.tsx`, `CommitmentsViewParts.tsx` (all `@ts-nocheck`) | rendering, toggle gesture (800 ms completion animation), forms |
| Context facade | `src/context/TaskContext.tsx`, `TaskContextDefinition.ts` | wraps service; adds haptics + Fabric `learnFrom` on completion; injects reminder + badge hooks |
| Service hook | `src/hooks/useCommitmentService.ts` | sorting, optimistic toggle, CRUD orchestration, audit calls, offline enqueue, lazy reset effect |
| Query hook | `src/hooks/queries/useTaskQueries.ts` (`@ts-nocheck`) | React Query list — **polling `getDocs` (staleTime 5 s, refetchOnWindowFocus/Mount, retry 3), explicitly NOT onSnapshot** (commit `c7beec9`) |
| API | `src/api/CommitmentApi.ts` (`@ts-nocheck`) | create (addDoc), toggle (**runTransaction**), delete (deleteDoc), update (updateDoc) |
| Reset API | `src/api/CommitmentResetApi.ts` (`@ts-nocheck`) | blind `updateDoc({completed:false})` / `updateDoc({currentStreak:0})` |
| Query API | `src/api/TaskQueryApi.ts` (`@ts-nocheck`) | `getDocs` orderBy createdAt desc, **limit(100)** |
| Reset effect | `src/hooks/useCommitmentReset.ts` (`@ts-nocheck`) | lazy client-side cycle reset + streak break |
| Offline sync | `src/hooks/useCommitmentOfflineSync.ts`, `src/utils/offlineTaskQueue.ts`, `src/utils/offlineQueueStorage.ts` | idb-keyval queue of toggles; flush on mount/`online`/SW message |
| Reminders (client) | `src/hooks/useTaskReminders.ts` (`@ts-nocheck`) | 60 s interval, exact `HH:mm` match → toast + `new Notification(...)` |
| Reminders (server) | `functions/src/reminders.ts` + reminderDelivery/Claim/Dedupe/Batching/Sender/Routing/Preferences/TokenCleanup | every-1-minute scheduled FCM push; collectionGroup query `reminderTime`+`completed` |
| Badge | `src/hooks/useCommitmentBadge.ts` | app badge = pending "today" tasks (via DailyBriefingEngine) |
| Fabric consumers | `src/services/fabric/DailyBriefingEngine.ts` (`getTodayTasks`), `insights/commitmentInsights.ts`, `query/commitmentQueries.ts`, `src/context/fabric/useFabricLiveSync.ts` | today list, completion-rate/streak insights, **separate onSnapshot listener** feeding Fabric |
| Dashboard | `src/utils/taskInsights.ts`, `ProductivityScoreCard.tsx` | productivity score from completed/total |
| Backend analytics | `functions/src/weeklyReport.ts`, `functions/src/fabricNudges.ts` (pinned Africa/Lagos clock) | read-only consumers |
| Audit | `src/services/AuditService.ts` (`auditCommitments.*` → callable `logAuditEvent` → `audit_log`) | create/complete/delete events |
| Demo seed | `src/utils/seeder.ts` | writes tasks incl. legacy `dayOfMonth`, `reminderTime:'08:00'` |
| Tests | see §20 | unit + lazy-reset + offline + rules-**none** + e2e |

**No Cloud Function ever writes a commitment document** (the reminders scheduler writes only `lastReminderSent` via Admin SDK). There are no commitments subcollections; the backend only reads.


### 2.2 Toggle data flow (the critical path)

```
TaskItem handleToggle (800 ms animation DELAYS the call on the COMPLETE path only)
  → TaskContext.toggleTaskWithHaptic
    → useCommitmentService.toggleTask(id, currentStatus)  // currentStatus = task.completed at click time
       1. queryClient.setQueryData → optimistic cache mutation
            (completed flip; completing: lastCompletedAt=now, streak+1, longest=max)
       2. CommitmentApi.toggleCommitmentCompletion(uid, id, currentStatus)
            runTransaction: get doc → if !exists RETURN (silent success no-op)
              updates.completed = !currentStatus       // direction from CLIENT ARG, not doc state
              completing:   lastCompletedAt = new Date().toISOString() (client clock)
                            currentStreak = doc.currentStreak+1; longestStreak = max(...)
              uncompleting: currentStreak = max(0, doc.currentStreak-1)  // lastCompletedAt NOT cleared
       3. success → auditCommitments.completed(id) (only when completing)
          network-shaped error → enqueueOfflineToggle(id, currentStatus) → return (no throw)
          other error → invalidateQueries (rollback-by-refetch) → rethrow
  → haptic + Fabric learnFrom (runs even when the write was only queued offline)
```

Sync channel: **polling only** for the commitments UI. The `onSnapshot` references in `useCommitmentService.ts:66-121` are stale documentation — the listener was removed in commit `c7beec9` ("BUG-023: Replace onSnapshot with polling"); `useTaskQueries.ts:12-19` documents the replacement. A *second*, independent onSnapshot listener exists in `useFabricLiveSync.ts:49-55`, feeding Fabric's live context only.

### 2.3 Reset data flow

```
useTasksQuery poll (5s staleTime / focus / mount)
  → rawTasks identity changes → useCommitmentResetEffect (deps [user, rawTasks])

## 3. Commitment data model (`AnchorTask`, `src/types/index.ts:15-33`)

| Field | Writer(s) | Reader(s) | Authoritative source | Validation | Mutability | Notes |
|---|---|---|---|---|---|---|
| `id` | addDoc (auto) | all | Firestore doc id | — | immutable in practice | path-bound |
| `title` | forms | UI, reminders, Fabric, scheduler | client | client: non-empty + no `<`/`>`; rules: non-empty string. **No max length anywhere** | mutable | unbounded size accepted by rules (C-07/C-10) |
| `type` | TaskForm only | reset, views, briefing, nudges, scheduler | client | **rules: none** (any string accepted) | UI-immutable on edit but rules permit change | malformed value silently disables reset (C-07) |
| `completed` | toggle transaction, reset API | all incl. FCM query | Firestore | rules: `is bool` | mutable | default false |
| `category` | forms | rules (family read), UI, insights | client | **rules: none** | mutable | **client-controlled sharing scope** (C-07) |
| `createdAt` | serverTimestamp() (create) | sort, insights | server | — | rules permit overwrite via update (no diff restriction) | orderBy+limit(100) → **>100 commitments silently truncated** in list fetch (TaskQueryApi.ts:10) |
| `timeOfDay` | TaskForm (daily) | sort, views | client | none | mutable | — |
| `daysOfWeek` | forms | reset, Weekly/Month views, **DailyBriefingEngine** | client | none | mutable | **format split: producers write `'Monday'…`; DailyBriefingEngine matches `'M'/'T'/'F'` letters** (C-06) |
| `daysOfMonth` | TaskForm (monthly) | reset, views | client | none | mutable | 1–31 from UI; no rule check |
| `dayOfMonth` (LEGACY) | seeder only | reset/views fallback | client | none | — | never written by forms (§23) |
| `domain` | forms | UI, insights | client | none | mutable | free-ish text |
| `reminderTime` | TaskForm | client hook, server scheduler | client | none | mutable | **user-local wall clock, no timezone stored** (C-05) |
| `lastCompletedAt` | toggle transaction (completing) | reset effect | **client clock** | none | mutable; **NOT cleared on uncomplete** | duplicated state vs `completed` |
| `currentStreak` | toggle transaction, reset API, seeder | UI, insights, nudges | Firestore doc | none | **rules: any number** | create API forces 0; "days" label wrong for weekly/monthly (C-09) |
| `longestStreak` | toggle transaction | UI, insights | Firestore doc | none | **rules: any number** | create API forces 0 |
| `notes` | forms | UI preview | client | UI maxLength 500; rules none | mutable | — |
| `priority` | forms | sort, UI | client | none | mutable | default sorted as medium |

**Duplicated/derived state:** `completed` ↔ `lastCompletedAt` ↔ `currentStreak` are three independently-writable encodings of the same fact, written by three different code paths (toggle transaction, reset API, optimistic cache) with no single source of truth — the root cause of most findings below.

**Impossible/ambiguous states reachable in production:**
- `completed=true` with stale/absent `lastCompletedAt` (legacy/seeder docs; optimistic cache before the transaction lands).
- `completed=false` with `lastCompletedAt` today (uncomplete never clears it) — ambiguous "completed today but unchecked".
- `currentStreak > 0` with `lastCompletedAt` weeks old (reset effect never re-evaluated on a long-lived tab).
- `currentStreak` decoupled from the real consecutive-cycle count (routine; C-01/C-02/C-04).
- `longestStreak < currentStreak` transiently during optimistic/rollback windows.

      per task, compare lastCompletedAt vs device-local date ('en-CA'):
        daily:   local date differs        → resetCommitmentCompletion (blind updateDoc completed:false)
        weekly:  today ∈ daysOfWeek (en-US long names) OR |diffDays| ≥ 7 → same
        monthly: today ∈ daysOfMonth/dayOfMonth OR getMonth() differs   → same   // YEAR IGNORED
      per incomplete task with streak>0: diffDays > 1.5 / 8 / 32 → resetCommitmentStreak (blind updateDoc currentStreak:0)
      fire-and-forget: `void` promise, no error handling, no dedupe, no audit
```

The reset effect only re-evaluates when `rawTasks` changes identity (fresh poll result). A continuously-open, continuously-focused tab never re-runs it; a cold start always re-runs it with freshly fetched data.

### 2.4 Firestore layout & offline posture

- Path: `artifacts/anchor-os/users/{uid}/commitments/{taskId}` — uid is in the path and rules bind authorization to it (§14).
- **Firestore offline persistence is explicitly disabled**: `src/config/firebase.ts:59-61` uses `memoryLocalCache()`. Consequences: (a) the app's *only* offline capability for commitments is the custom toggle queue; (b) create/update/delete issued offline fail immediately with no local buffering and no queue; (c) optimistic cache state lives only in React Query memory — an app restart discards it, but the persisted toggle queue replays on next launch.


## 4. State machine

States: `NEW → INCOMPLETE ⇄ COMPLETE` per cycle, plus `OFFLINE-PENDING`, `DELETED`, and per-type cycle transitions.

| Transition | Initiator | Firestore write | Transaction | Optimistic state | Rollback | Reconciliation | Offline | Audit | Notification |
|---|---|---|---|---|---|---|---|---|---|
| create | user (TaskForm) | `addDoc` (serverTimestamp) | no | none (refetch) | toast on failure | next poll | **unsupported** (fails; no queue) | `commitment_created` after success | reminder metadata only |
| incomplete→complete | user tap | transaction update | **yes** (read-modify-write) | cache: completed=true, streak+1, longest=max, lastCompletedAt=now | invalidate+refetch on error | next poll (5 s/focus) | queue on network error | `commitment_completed` on success only | client matcher skips completed; FCM query excludes completed |
| complete→incomplete | user tap | transaction update | yes | cache: completed=false, streak−1 (floor 0) | invalidate+refetch | next poll | queue on network error | **none** | task re-enters FCM query |
| recurring-cycle reset | reset effect (lazy, client) | blind `updateDoc({completed:false})` | **no** | none | none (fire-and-forget) | next poll | **not queued** — offline ⇒ no reset | none | task re-enters FCM query |
| streak break | reset effect | blind `updateDoc({currentStreak:0})` | no | none | none | next poll | not queued | none | Fabric nudges read new value |
| offline-pending toggle | service error path | none yet; IDB queue entry `{userId, taskId, currentStatus}` | — | stays visible | — | none until flush | — | none at enqueue **or** flush | — |
| retry/flush | `online`/mount/SW msg | replayed transaction with **stored stale `currentStatus`** | yes | transient | entry re-queued forever on failure | post-flush invalidate | — | **none** | — |
| delete | user (confirm) | `deleteDoc` | no | none | toast on failure | next poll | **unsupported** | `commitment_deleted` **before** the write (C-08) | queued toggles later no-op |
| update | user (edit form) | `updateDoc(updates)` | no | none | toast on failure | next poll | unsupported | **none** (C-08) | implicit reschedule via next scheduler pass |
| reminder scheduled/changed/cancelled | create/update/delete | field write / delete | — | — | — | — | — | none | no OS-level schedule exists to cancel; channels re-evaluate per tick |

Defining weakness: `COMPLETE` is not a unique transition — any number of `incomplete→complete` transactions can be applied within one cycle (no cycle id, no per-cycle completion record), so "two completions for one recurrence period" is a *normally reachable* state, not an anomaly.

## 5. BUG-023 / optimistic-update forensics (verdict)

The code comment (`useCommitmentService.ts:63-76`) claims the fix is "COMPLETE" via optimistic update + background transaction + **onSnapshot sync** + rollback + offline queue. Audit of the actual invariant:

**5.1 The documented sync mechanism does not exist.** `useTaskQueries.ts:12-19` states onSnapshot was replaced with 5-second polling because "onSnapshot was failing with 400 errors… the optimistic updates were working but being reverted when onSnapshot failed" (commit `c7beec9`). The service comment is factually wrong on its central claim; every guarantee attributed to "onSnapshot ensures sync with Firestore truth" must be re-derived against a 5-second *poll*, which has weaker semantics (5.4).

**5.2 Rapid double interaction.** The completing path is guarded: `TaskItem.handleToggle` sets `isAnimating`, disables the button, waits 800 ms, *then* calls `onToggle(task.id, task.completed)` — the optimistic update trails the tap by 800 ms. The uncomplete path has **no guard**: a double-tap fires two `toggleTask(id, true)` calls; both transactions run; `completed` is set false twice; `currentStreak` decrements **twice** (3 → 1). UI and server agree on `completed` but not on the streak. Classified: **INCORRECT STREAK**.


**5.3 Multiple clients.** Devices A and B both toggle with `currentStatus=false` concurrently: each transaction re-reads the doc server-side, so the streak increments serialize (0→1→2) — two *completions of the same cycle*. If A completes while B "uncompletes" from a stale view (`currentStatus=true`), the transaction obeys B's stale argument: the final state is commit-order-dependent and A's completion can be silently reversed with a streak decrement. Firestore transaction retries resolve *write* conflicts but cannot resolve *semantic* conflicts, because the intended semantics live in the client argument, not the document. Classified: **LOST UPDATE / INCORRECT STREAK** (order-dependent).

**5.4 Snapshot/poll race.** There is no snapshot listener; there is a poll. `setQueryData` (optimistic) and an in-flight `getDocs` race without ordering guarantees: a `getDocs` issued *before* the optimistic update (refetchOnWindowFocus 300 ms earlier, or the 5-second poll) can *resolve after* `setQueryData` and overwrite the cache with pre-toggle data (React Query applies fetch results unconditionally). The UI shows the old state; a user who re-taps applies a second toggle against the server's new state. The classic BUG-023 "state reversion" is reduced in frequency, not eliminated. Classified: **STALE-UI → potential INCORRECT STREAK on retry**.

**5.5 Failure after optimistic update.** Non-network error → the only rollback is `invalidateQueries` → refetch. With `placeholderData: previousData` and `retry: 3`, the optimistic (wrong) state stays visible during the refetch; if all retries fail (persistent rule rejection, quota), the cache retains the wrong state until some later successful fetch — **the UI can stay wrong indefinitely** (the pre-toggle value is never locally restored). On network error, the optimistic state is *kept* and a queue entry is written — correct if the write never landed, wrong if it did (5.6). Classified: **STALE-UI (recoverable only by a later successful poll)**.

**5.6 Offline transition & timeout-after-commit.** The mutation enters the queue only when the transaction rejection message matches `isNetworkError` (`network | failed to fetch | offline | unavailable`) — a string heuristic over SDK error text. Consequences: (a) other offline/timeout shapes (`deadline-exceeded`, aborted retries) are *not* queued and surface as thrown errors with the optimistic state left in place; (b) the queue entry stores the **transition** (`currentStatus` at failure time), not the desired end state. If the transaction actually committed but the client observed a network-shaped failure (timeout after commit), the replay re-applies the completion: `currentStreak` increments a second time for the same cycle. Classified: **INCORRECT STREAK (persistent, server-side)**.

**5.7 Verdict.** BUG-023 is **not solved as an invariant**; it is improved for the common single-click online path (instant feedback, atomic single toggle, serializing transaction). The invariant "completion state and streak reflect exactly one user intent per interaction, reconciled with server truth" does not hold under double-tap (uncomplete path), concurrent clients, stale polls, error rollbacks, or queue replay. Evidence: implementation reading above; unit coverage is happy-path-only and both optimistic-update edge tests remain `it.todo`/`it.skip` (`useCommitmentService.test.tsx:321-322,371-372`); no concurrency/race/replay test exists anywhere. Classification: **CONTRADICTED BY IMPLEMENTATION** for the comment's onSnapshot claim; **PARTIALLY PROVEN** (happy path only) for the fix itself.


## 6. Completion / streak integrity

Intended invariant (inferred from UI labels, milestone copy in `streakUtils.ts`, and Fabric insight wording): *`currentStreak` counts consecutive completed cycles; it increments at most once per cycle and resets to 0 when a cycle is missed; `longestStreak` is monotonic.*

Actual behavior (`CommitmentApi.ts:15-40` — the sole authoritative completion mutation):

- **Can a user increment a streak more than once in one recurrence period? YES.** Every `incomplete→complete` transaction increments unconditionally — no cycle identity, no `lastCompletedAt` guard inside the transaction. Double-tap, two devices, or queue replay each add +1. (C-01)
- **Does uncompleting reduce a streak incorrectly? YES.** (a) Uncomplete decrements while *not* clearing `lastCompletedAt`, leaving `completed=false, lastCompletedAt=today` — the streak no longer matches any consistent reading of history. (b) Offline complete+uncomplete replays only the *uncomplete* transition against a server that never recorded the completion → net −1 (C-02).
- **Can stale client state overwrite a newer streak?** Not through the toggle transaction (it re-reads server state), but YES through the reset API's blind writes computed from possibly-stale cache (C-04), and YES via rules-authorized mass assignment (C-07).
- **Is `longestStreak` monotonic?** In the single-toggle path yes (`Math.max`), and the reset API never lowers it. Not protected from client writes by rules (C-07); transiently stale during optimistic/rollback windows.
- **Missed cycles.** A missed day does not reliably break a daily streak: the break threshold is `diffDays > 1.5` in wall-clock time, not cycles. Complete Mon 23:00, skip Tuesday, complete Wed 01:00 → `diffDays ≈ 1.08` → **no break** — the streak increments despite the missed Tuesday. Complete Mon 08:00, skip Tuesday, open Wed 09:00 → `diffDays ≈ 2.04` → broken. Identical behavior, different outcome by time of day. Weekly (>8 d) and monthly (>32 d) thresholds share this character. (C-04)
- **App opened after several missed periods.** Daily: completion reset (if still true) + streak zeroed, but only when `currentStreak > 0` and `lastCompletedAt` exists; N missed periods produce the same result as one; `longestStreak` survives. Weekly/monthly: reset only when the day-name/day-of-month condition or the crude elapsed-days threshold fires (§7).
- **Todo.** Completing a `todo` increments `currentStreak`/`lastCompletedAt` like any recurring task (type-blind toggle) — a one-time task accrues a "streak" displayed in day-based nudge copy. (C-09)
- **Concurrent completion.** Two devices completing the same cycle serialize into +2 (§5.3).

## 7. Recurrence / reset semantics

**Classification: client-triggered, lazy on data-refresh, unscheduled. There is no server-side reset of any kind** (confirmed: no `commitments` writer in `functions/src`). `useCommitmentResetEffect` is the only reset implementation; its API writes are unconditional field sets.


Per-type cycle definition as implemented:

| Type | Cycle boundary | Clock/zone | Boundaries |
|---|---|---|---|
| daily | device-local calendar date of `lastCompletedAt` ≠ today (`toLocaleDateString('en-CA')`) | device-local; no IANA zone stored anywhere | DST day is a normal local day; travel across the date line flips the comparison; device clock set ahead makes `lastDateLocal` a future date → **reset fires immediately after every completion** |
| weekly | today's weekday name (`en-US` full name) ∈ `daysOfWeek`, else fallback `\|diffDays\| ≥ 7` | device-local | no week-start concept — "week" is anchored to last completion; two users' "weekly" cycles disagree; day names are locale-string matched (works with the en-US form values; broken in DailyBriefingEngine's letter form, C-06); completion on a non-scheduled day resets only after 7 elapsed days |
| monthly | today ∈ `daysOfMonth`/legacy `dayOfMonth`, OR `now.getMonth() !== lastDate.getMonth()` | device-local | **year ignored** — a Mar-2025 completion is not reset by the month branch in Mar-2026 (reset then relies on opening on a commitment day); days 29–31 have no short-month logic (day-31 tasks reset via the month-differ branch instead); Feb 29 handled only by the month-differ branch |

Failure model:

- **App never opened during a boundary → nothing resets.** No server sweep exists; on next open the effect backfills resets — but the FCM reminder scheduler sees `completed=true` and **suppresses reminders for as long as the task shows completed**; a stale completion silently mutes the reminder channel for days.
- **Two devices open simultaneously** → both run the effect → duplicate identical reset writes (harmless in effect, uncoordinated, each a billed write).
- **Reset races with completion.** The reset decision is computed from the *cached* task list; the write is an unconditional `updateDoc`. If the cache is stale (a poll issued before another device's completion resolves after it — the §5.4 window), the effect writes `completed:false` **over a legitimate current-cycle completion**. Window is narrow (one stale poll) but the write is blind — no `lastCompletedAt`-conditioned guard. **Answer: YES, a reset can erase a legitimate current-cycle completion** via the stale-poll race. Same-device completions are safe: the effect reads `rawTasks` (server truth), and by the time the completion appears there, `lastCompletedAt` is already today.
- **Reset retries.** None: a failed reset write is dropped silently (`void`), retried only if `rawTasks` changes again later.
- **Stale client resets a task already completed in the new cycle.** Same race as above (two devices, stale poll resolution order).
- **Several cycles missed.** Collapse to one reset + one streak break; no per-cycle history exists anywhere.
- **Firestore write fails midway** (completion reset landed, streak break didn't, or vice versa): inconsistent state (`completed=false` with old streak, or streak zeroed with `completed=true`) with no repair path.

**Answer: recurrence state is derived from the client-local clock and client-cached data — not from authoritative timestamps evaluated server-side.** `lastCompletedAt` is itself a client-clock ISO string.

## 8. Todo / one-time semantics

- `type: 'todo'` is a first-class production type (FrequencyStep label "Todo — One-time task").
- **Completion is permanent**: the reset effect has no `todo` branch → `completed=true` is never cleared by reset; completed todos remain in the list indefinitely (sorted to the bottom), with no archive step.
- **Reset code cannot touch todos** (no branch) — correct isolation.
- **Streak fields apply erroneously**: `createCommitment` forces `currentStreak:0, longestStreak:0` on *every* create including todos, and the toggle transaction increments/decrements them type-blindly (C-09). The UI then shows day-milestone nudge copy ("2 more days to 🌱 Getting started!") for a one-time task.
- **Reminders persist until completion**: both channels skip `completed == true`; an *uncompleted* todo with `reminderTime` reminds daily-forever (there is no due-date concept — a "one-time" task's reminder is actually recurring-daily until checked). After completion the reminder stops on both channels; nothing to cancel (no OS schedule).
- **Recurrence defaults**: none applied at create (type-specific fields set only for daily/weekly/monthly) — clean.
- **Deletion semantics**: same as any commitment (§10); no todo-specific purge.
- **Schema/logic conflation**: `completed`/`lastCompletedAt`/streaks are shared by recurring commitments and todos with no type gate — the main conflation defect (C-09). `TaskContext.toggleTaskWithHaptic` additionally fires the `commitment_completed` Fabric learning event for todos.


## 9. Create / update validation

**Client** (`TaskForm`/`EditTaskForm`/`CommitmentsView`): title non-empty after trim; no `<`/`>` in title (`handleAdd`); notes maxLength 500 (UI attribute only); type/priority from fixed button sets; days/dates from fixed pickers; reminder from `TimeWheelPicker` (HH:mm). **Title has no maxLength** on either form. A monthly/weekly task can be saved with an **empty** `daysOfMonth`/`daysOfWeek` selection — legal, producing a task whose reset/reminder cadence is undefined (monthly: resets only via the month-differ branch; weekly: only via the 7-day fallback).

**Firestore rules** (`config/firestore.rules:33-37,328-332`): `isValidTask` = `title is string && title.size() > 0 && completed is bool`, applied to the *merged* future document on create **and update**. That is the entire constraint set (authorization consequences in §14; no field allowlist → C-07).

**Backend/API**: none — no callable, no Cloud Function validation for commitments.

**Mass-assignment attempt:** Authenticated User A (owner of the path) crafts an update via the Firestore SDK directly:

```
update(doc(users/A/commitments/T), {
  currentStreak: 999999, longestStreak: 999999, lastCompletedAt: "<any ISO>",
  completed: true, type: "daily", category: "family", reminderTime: "23:59",
  createdAt: "2000-01-01T00:00:00Z", anyUnknownField: "anything" })
```

**Firestore accepts every field above**: the merged doc keeps a non-empty string title and boolean completed → `isValidTask` passes; the update rule requires only `request.auth.uid == userId`. The `updateTask` signature omits `type` at the TypeScript layer only — the rules do not, and every file in the write path is `@ts-nocheck` anyway. Partial updates can mutate all semantic/protected fields: streaks, completion history, scope (`category` → family read exposure), type (breaks reset semantics), timestamps. Only the doc id and path-uid binding are immutable.

## 10. Delete semantics

`deleteTask` → `auditCommitments.deleted(id)` (**FIRST**) → `deleteCommitment` (`deleteDoc`) → invalidate → refetch.

| Artifact | Removed? | Notes |
|---|---|---|
| commitment document | yes | hard delete; no soft-delete/archived flag exists on AnchorTask |
| child/subcollection data | n/a | none exist |
| reminder registrations | n/a | no OS-level registrations; FCM collectionGroup query stops matching; client matcher drops the item at next poll |
| already-delivered notifications | no | historical FCM notifications remain on devices (normal) |
| activity/audit history | no | `commitment_deleted` event written (before the delete); earlier events retained |
| Fabric context | yes | live snapshot removes it; polled insights drop it at next fetch |

## 11. Offline queue

Mechanism: `idb-keyval` store key `anchor_task_offline_queue` (in-memory Map fallback if IDB unavailable), manipulated by `src/utils/offlineTaskQueue.ts`; flushed by `useCommitmentOfflineSync` on mount / `online` event / SW `sync-task-toggles` message (`public/sw.js:123-127` re-broadcasts the Background Sync tag to open clients — if no client is open, nothing flushes until next launch).

| Property | Finding |
|---|---|
| Mutation schema | `{id, userId, taskId, currentStatus, createdAt}` — a **transition** (state before toggle), not desired state |
| Desired-state vs transition | transition; enqueue **overwrites** any prior entry for the same (userId, taskId) — intermediate intents discarded, correct only if the newest toggle's baseline state still matches server state (it frequently does not — replay math below) |
| UID binding | entry carries uid; flush filters by uid — **entries of other users survive logout/account-switch indefinitely** and replay when that user next signs in on the device |
| Task-ID binding | yes; deleted-task replays no-op (§10) |
| Queue order | FIFO; per-task dedupe keeps the newest entry's position |
| Dedupe | by (userId, taskId), last-write-wins |
| Idempotency | **none**: replayed toggles execute as fresh transactions; no operation id, no applied-marker, no server-side dedupe |
| Retry / backoff / expiration | **none**: failed entries re-queued forever, flushed on every online event; no TTL, cap, or backoff |
| Logout / account switch / deletion | queue **never cleared** (`clearTaskQueue` has no production caller — dead export) |
| Corrupted queue | non-array data tolerated; IDB failure silently downgrades to a **non-persistent in-memory Map** (durability silently lost) |
| Replay math (streak corruption) | complete offline: queue `{false}` → server streak+1. Then uncomplete offline: queue overwritten `{true}` → server (never completed) streak **−1**, completed=false → net −1 from baseline. Inverse: timeout-after-commit re-queues `{false}` → server streak **+2** for one cycle. Confirmed by code path (`offlineTaskQueue.ts:18-30`, `useCommitmentOfflineSync.ts:17-23`, `CommitmentApi.ts:15-40`) |
| Same toggle queued twice | collapsed by dedupe — but each *flush execution* races across tabs: two open tabs both read the same queue, both replay the entry, both write `remaining` (last write wins) → toggle **applied twice** server-side (double streak increment), removed once locally. No cross-tab lock |
| Timeout after commit | §5.6 — double-apply |
| Multiple tabs/devices replay | tabs: duplicate apply (above). Devices: separate IDB namespaces → same intent queued on two devices applies twice |
| Logout replay | per-user entries persist; sign-out does not clear them |

**Answer: retries CAN double-apply streak mutations** — via (a) timeout-after-commit re-queue, (b) cross-tab duplicate flush, (c) complete+uncomplete offline producing unintended decrements. (C-01/C-02.)

Additional offline posture: with `memoryLocalCache` (`src/config/firebase.ts:59-61`), **only toggles have offline support**; offline create/update/delete fail immediately with an error toast and no persistence.

## 12. Reminder / notification model

Two independent channels exist for commitment reminders; **neither uses an OS-level scheduler**:

**Channel 1 — client in-app (`useTaskReminders.ts`, `@ts-nocheck`)**: 60-second `setInterval`; exact string match `task.reminderTime === current device-local HH:mm`; dedupe via in-memory `lastNotifiedRef` keyed by `toDateString()`; fires toast + `new Notification(...)` when permission granted; requests permission on mount (not user-gesture-gated); skips completed tasks; dies with the tab — **no delivery when the app is closed/backgrounded**, and browser timer throttling makes the exact-minute match missable (a check at 12:00:59.9 then 12:02:00.1 silently skips 12:01).

**Channel 2 — server FCM (`functions/src/reminders.ts`, every 1 minute)**: `collectionGroup('commitments').where('reminderTime','==',currentTime).where('completed','==',false)`; per-user batching; preference-gated (`shouldSendReminderForCategory`); token fan-out with stale-token cleanup; delivery dedupe via user-level `lastReminderDeliveryKey` + `reminder_delivery_claims` claim slots (TTL) + per-commitment `lastReminderSent` date marker; per-token FCM send with APNs/Android/webpush payloads. (The dedupe/claim architecture here is genuinely well-built for its narrow query.)

| React Query cache | yes | invalidate + refetch |
| queued offline mutations | **no — but defanged** | entries for the deleted id replay as *silent no-ops* (`!exists → return`) and drain as "succeeded" (C-02 residual) |
| family/share references | n/a | family access derives from `category` on the (now deleted) doc |

Scenarios: delete while offline toggle queued → no-op replay, no resurrection ✔; delete while update in flight → updateDoc fails on missing doc → failure toast ✔; delete from A while B completes → transaction no-op or failed update, final state deleted, transient **STALE-UI** on B ✔; delete then recreate similar task → new auto-id, old queue entries cannot hit it ✔; delete with active reminder → both channels stop; claimed delivery slots TTL-expire ✔; deletion failure → UI never optimistically removed the row ✔; offline delete → fails outright (`memoryLocalCache`), no queue ✔.

**Answer: an offline or delayed mutation cannot resurrect or mutate a deleted commitment** — every mutation path is read-gated (transaction early-return) or requires the doc to exist. The *audit* log can, however, claim a deletion that never happened (C-08).


**Defect — timezone mismatch (C-05, proven by code):** the client stores `reminderTime` as the **user's local wall clock** (no timezone field exists on AnchorTask). The scheduler computes `currentTime = format(now, 'HH:mm')` with date-fns `format`, which uses the **process-local timezone — UTC on Cloud Functions**. The `timeZone: 'Africa/Lagos'` option on `onSchedule` governs only cron firing (every 1 min — immaterial), not `format()`. A commitment therefore fires when **UTC wall clock equals the user's local reminder string**: a UTC+1 (Lagos) user's 08:00 reminder is delivered at 09:00 local; a UTC−5 user's at 03:00 local; a UTC+13 user's 21:00 reminder arrives 08:00 *next local day*. The sibling nudge function `fabricNudges.ts` *does* pin Africa/Lagos explicitly (`getLagosClock`) — the two backend consumers of commitments disagree on clocks, and both are wrong for non-Lagos users anyway. Meanwhile Channel 1 fires at the *correct* local time when the app is open → users can receive **two notifications per reminder at different clock times**, or only the wrong-hour FCM when the app is closed.

Other properties:

- **Authoritative timezone:** none stored per commitment; implicit device-local (client channel), implicit UTC (server channel), pinned Lagos (nudges). Three clocks.
- **Scheduling horizon:** none — both channels evaluate "now" continuously; no future scheduling, no Capacitor local notifications.
- **Recurring scheduling:** implicit — daily re-fire via per-day dedupe keys. **Weekly/monthly tasks with a reminder are reminded every day** (no day-of-week gate on either channel) — a weekly commitment pings daily until completed.
- **Deduplication:** client channel per-tab only (two tabs → duplicate browser notifications); server channel robust (claim + batch key + per-commitment marker).
- **Edit/reschedule:** implicit; a changed `reminderTime` starts matching at the new minute; no cancellation needed since nothing is pre-scheduled.
- **Completion behavior:** both channels exclude completed → completion cancels reminders; lazy reset re-arms them next cycle.
- **Delete behavior:** query/matcher stop matching; deleted commitments produce no stale reminders.
- **Permission denial:** client channel degrades to toast only; mount-time `requestPermission()` may be rejected silently. Server channel needs a registered FCM token (`fcmTokens` subcollection) — **no tokens ⇒ no reminders at all when the app is closed**.
- **Reinstall / device change:** tokens re-registered by the messaging bootstrap; stale tokens cleaned on send failure (`removeTokenIfStale`).
- **DST/timezone changes:** client channel follows the device clock (correct); server channel stays on UTC (wrong by offset, C-05); travel permanently changes what "08:00" means to the server.
- **Missed notifications:** no catch-up — a scheduler-outage minute is silently skipped (keys are minute-scoped); the client channel skips backgrounded minutes entirely.

**Answers:** *Can a deleted, completed, or rescheduled commitment continue producing stale reminders?* — Deleted/completed: no. Rescheduled: the old time simply stops matching; no stale OS schedule exists. *Can the same recurrence generate multiple reminders?* — Yes across channels (client toast + server FCM at different clock times) and across tabs; within the server channel, dedupe is solid.


## 13. Family-sharing intersection (FS-01 cross-reference — no re-audit)

- **Which records become readable:** any commitment with `category == 'family'` of a connected user (rules `firestore.rules:329`); `personal` commitments are never exposed. Exposure is per-row, driven by the owner-controlled `category`.
- **Does only read access survive?** Yes — update/delete require `request.auth.uid == userId` (path owner). A family member cannot complete/uncomplete/edit/delete a partner's commitment even while connected (07 §10 stands, confirmed for the commitments path).
- **Can private commitments become family-scoped accidentally?** Not accidentally via the UI (scope picker shown only when `hasFamilyActive`), but **by client-controlled field write** the scope can be toggled at any lifecycle point (C-07) — and `EditTaskForm` applies `category` on *every* save, so stale form state can silently flip scope.
- **Can scope change over the lifecycle?** Yes — `category` is mutable with no rule constraint (C-07); disconnect does not rewrite commitment scope.
- **Disconnect consequences:** identical mechanism to FS-01 — `isConnectedFamilyMember` is existence-only and the connection document is never deleted, so after disconnect the ex-member **retains rules-authoritative read of all `category=='family'` commitments** of the ex-partner (writes still denied). Client caches (React Query, Fabric onSnapshot) retain data until refetch — same residual as 07 §6. **No materially new commitment impact beyond 07; no new stop condition.**
- **Deleted family/member state affecting commitments:** none — commitments hold no references to connection objects.

## 14. Rules / authorization (commitments)

Path: `artifacts/anchor-os/users/{userId}/commitments/{taskId}` — `config/firestore.rules:328-332`:

```
allow read:   if request.auth.uid == userId
              || (resource.data.category == 'family' && isConnectedFamilyMember(userId));
allow create, update: if request.auth.uid == userId && isValidTask(request.resource.data);
allow delete: if request.auth.uid == userId;
```

| Check | Result |
|---|---|
| owner read / write / delete | granted (uid == path segment) ✔ |
| family read | granted for `category=='family'` while the connection doc exists — **never revoked post-disconnect (FS-01)** |
| family write | **denied** (no family branch on create/update/delete) ✔ |
| assignment-based access | none exists for commitments |
| backend-only mutation | none — all semantics client-mutated; backend writes only `lastReminderSent` (Admin SDK) |
| owner UID immutable | effectively (path-bound); no `ownerUid` field exists on the doc |
| completion fields client-mutable | **yes** (`completed`, `lastCompletedAt`) |
| streak fields client-mutable | **yes** (`currentStreak`, `longestStreak` — arbitrary numbers) |
| timestamps client-mutable | **yes** (`createdAt` overwritable via update; `lastCompletedAt` any string) |
| recurrence fields client-mutable | **yes** (`type` changeable on update despite UI omission; `daysOfWeek`/`daysOfMonth`/`timeOfDay` any value) |
| arbitrary fields allowed | **yes** — no `diff(...).affectedKeys().hasOnly(...)` clamp, unlike the `notifications` rule (lines 321-322) which does clamp |
| family scope client-controlled | **yes** (`category`) |

Client operation → path → predicate mapping: `createCommitment` → `users/{uid}/commitments` create, predicate matches caller; `toggleCommitmentCompletion`/`updateCommitment`/`deleteCommitment` → `users/{uid}/commitments/{id}`, uid always from the authenticated `User` object, never from task data. **No cross-user write path exists in client code; rules enforce it independently.** The gap is field integrity, not authorization (C-07). UI restrictions (form field omission, button gating) are irrelevant to this assessment.

## 15. Downstream consumers of commitment state

| Consumer | Reads | Sensitivity to the defects above |
|---|---|---|
| Commitments UI (list/week/month/timeline) | full cache | STALE-UI windows (C-03); streak copy from corrupted streaks |
| `useCommitmentBadge` → app badge | `getTodayTasks` | **weekly tasks excluded from "today"** (C-06) → badge undercounts |
| Fabric DailyBriefing (`DailyBriefingEngine`) | `getTodayTasks`, streaks | C-06 exclusion; briefing "streak highlight" can showcase inflated/corrupted streaks (C-01/C-02) |
| Fabric insights (`commitmentInsights.ts`) | completed count, `currentStreak` max | corrupted streaks/states propagate verbatim into "X-day streak" claims |
| Fabric queries (`commitmentQueries.ts`) | rate/bestStreak | same |
| Fabric live context (`useFabricLiveSync`) | **onSnapshot** channel | second sync channel can momentarily disagree with the polling UI channel (optimistic state invisible to Fabric until commit) |
| Dashboard `ProductivityScoreCard` / `taskInsights.ts` | completed/total | counts completed *todos* and completed-recurring post-reset cycles alike; score swings with reset timing |
| `functions/weeklyReport.ts` | completed/total at send time | post-lazy-reset tasks read as uncompleted → weekly report understates completion; corrupted streaks not used here |
| `functions/fabricNudges.ts` | top daily-task streak (Lagos clock) | inflated streaks → premature/misleading streak nudges |
| Reminder channels | `reminderTime`, `completed` | C-05 clock mismatch; stale completion mutes reminders (C-04) |
| Audit log (`audit_log`) | events | events can contradict Firestore state (C-08) |
| CSV export / Data Management (`csvExport.ts`, `SettingsDataActions`) | task list | exports corrupted state as-is |

Fabric boundary note (for the later Fabric pass): Fabric *consumes* commitment state but cannot *mutate* it; no Fabric write path to commitments exists. The full Fabric audit (privacy boundaries, query coverage) remains out of scope here.


## 16. Audit / activity events

All commitment audit events flow through `auditCommitments.*` (`src/services/AuditService.ts:115-124`) → callable `logAuditEvent` → server-side whitelist → `audit_log` collection (client read/write denied by rules, `firestore.rules` audit_log block). The callable exists in `functions/src/audit.ts` (actor identity is bound server-side to the calling auth; its content validation was reviewed in the Auth pass and is not re-verified here).

| Event | Emitted when | Relative to authoritative write | Can contradict Firestore state? |
|---|---|---|---|
| `commitment_created` | after `createCommitment` resolves | after | No (create succeeded) |
| `commitment_completed` | after `toggleCommitmentCompletion` resolves, completing only | after | No on the normal path. **But never emitted** for offline-queued completions (enqueue path returns before the audit line; the flush path audits nothing) and never emitted in the timeout-after-commit case where the server *did* commit — so audit coverage is incomplete rather than contradictory |
| `commitment_deleted` | **before** `deleteCommitment` is awaited | **before** | **Yes — a failed/offline delete still logs a deletion that did not happen** (C-08) |
| `commitment_edited` | never | — | Dead API: defined, tested in AuditService.test.ts, never called by any production code path (updates are unaudited) |
| resets / streak breaks | never | — | State-changing writes with zero audit trail |

Retry duplication: `logAuditEvent` failures are swallowed (`console.warn`) — events are fire-once, no retry, no queue; a transient callable failure silently loses the event while the Firestore write succeeds. Conversely, the optimistic completion path emits the audit event *after* the transaction resolves, so no audit event is emitted on optimistic state alone — that ordering is correct. Offline/queued completions: **not audited at all** (neither at enqueue nor at flush/replay); timeout-after-commit completions: not audited despite a server-side commit.

## 17. Concurrency / failure-injection matrix

| # | Scenario | Mechanism | Final classification |
|---|---|---|---|
| 1 | Failure before first write (throw before transaction) | optimistic cache mutated, then invalidate+refetch or enqueue | **RECOVERABLE** (refetch) / **STALE-UI** if refetch keeps failing |
| 2 | Failure after optimistic update, non-network error | invalidate+refetch; wrong value kept if fetch fails | **STALE-UI** (indefinitely until a successful fetch) |
| 3 | Firestore transaction rejection (semantic, e.g. permission) | thrown to UI after invalidate | **STALE-UI → RECOVERABLE** |
| 4 | Network timeout BEFORE commit | transaction never lands; error usually network-shaped → queued; replay applies toggle | **RECOVERABLE** (toggle applied once) |
| 5 | Network timeout AFTER commit | client sees network-shaped error → queued → replay re-applies completion | **INCORRECT STREAK / DUPLICATED** (C-01/C-02) |
| 6 | Snapshot delay (stale poll resolves after optimistic write) | React Query applies stale fetch over optimistic state | **STALE-UI**; user retry can convert to **INCORRECT STREAK** (C-03) |
| 7 | Duplicate UI action (complete path) | 800 ms animation disables the button | **CONSISTENT** (guarded) |
| 8 | Duplicate UI action (uncomplete path) | no guard; two transactions | **INCORRECT STREAK** (double decrement) |
| 9 | Duplicate queue replay (two tabs flush same entry) | no cross-tab lock; both replay | **DUPLICATED** (streak +2) / **INCORRECT STREAK** |
| 10 | Concurrent devices, same intent | transactions serialize; each increments | **INCORRECT STREAK** (two completions, one cycle) |
| 11 | Concurrent devices, opposing intents (stale view) | transaction obeys client argument | **LOST UPDATE** (order-dependent final state) |
| 12 | Recurrence reset concurrent with completion | blind unconditional reset updateDoc vs transaction | **LOST UPDATE / INCORRECT STREAK** — reset can erase a fresh completion (C-04) |
| 13 | Reset retries / reset write failure | fire-and-forget, no retry | **STALE-UI** (completed flag stuck) — RECOVERABLE only on later poll cycles |
| 14 | Update concurrent with delete (same doc) | updateDoc fails on missing doc | **CONSISTENT** (no resurrection) |
| 15 | Delete concurrent with offline replay | replay no-ops on missing doc | **CONSISTENT** |
| 16 | Delete from device A while B completes | B's toggle no-ops or fails; UI transient | **STALE-UI → CONSISTENT** |
| 17 | Delete then recreate similar task | new auto-id; old queue entries can't hit it | **CONSISTENT** |
| 18 | Offline complete + offline uncomplete before reconnect | dedupe keeps only last transition; server never saw the completion | **INCORRECT STREAK** (net −1) (C-02) |
| 19 | Queue replay after app restart (same user) | flush on mount | Applies stale transition: **RECOVERABLE** only if baseline unchanged; else **INCORRECT STREAK** |
| 20 | User logs out; different user logs in | queue persists per-user; other user's stale entries replay on their next login | **INCORRECT STREAK (delayed), cross-session** (C-02) |
| 21 | Recurring task completed, app closed across boundary, FCM reminder due | scheduler sees completed=true, skips | **ORPHANED** (reminder silently suppressed until next open; C-04 consequence) |
| 22 | Two completions raced + weekly report send | weeklyReport reads completed/total at send time | **UNKNOWN/UNPROVEN** which state the report captures (send-time snapshot) |
| 23 | Optimistic completion then server failure | cache reverted by refetch; audit not emitted; Fabric `learnFrom` **was** called | **DUPLICATED (Fabric learning)** — AI context records a completion that never persisted |

No scenario in this matrix produced cross-user mutation, and none produced resurrection of deleted documents.


## 18. Time / date correctness

All temporal logic in the domain (verified call sites):

| Call site | Mechanism | Clock |
|---|---|---|
| `useCommitmentReset.ts:20` `now.toLocaleDateString('en-CA')` | device-local `YYYY-MM-DD` comparison | device-local |
| `useCommitmentReset.ts:33` weekday via `toLocaleDateString('en-US', {weekday:'long'})` | locale-string weekday match | device-local |
| `useCommitmentReset.ts:37-39,57-64` raw ms→day math | **wall-clock elapsed time, not calendar cycles** — DST shifts the ratio; `Math.abs` on the weekly path treats future timestamps as elapsed | device-local |
| `useCommitmentReset.ts:42-44` `getMonth()` comparison | **month-only, year-ignored** | device-local |
| `CommitmentApi.ts:26` `new Date().toISOString()` for `lastCompletedAt` | client wall clock at transaction-build time | device |
| `useTaskReminders.ts:13-16` device-local `HH:mm` string match | per-minute matcher | device-local |
| `functions/src/reminders.ts:20-21` `format(now,'HH:mm')`, `'yyyy-MM-dd'` | date-fns default TZ = process TZ = **UTC** on Cloud Functions | UTC |
| `functions/src/fabricNudges.ts` `getLagosClock` | pinned `Africa/Lagos` Intl formatter | Africa/Lagos |
| `DailyBriefingEngine` `getDay()`/`getDate()` | device-local | device-local |

Concrete examples tied to code:

- **23:59 → 00:00 (daily):** complete at 23:59:30 → `lastCompletedAt = 23:59 local ISO`. Next poll after midnight: `lastDateLocal !== today` → `completed:false`. Correct per daily-cycle semantics; the adjacent streak-break threshold is raw ms, so identical "missed day" behavior differs by completion time-of-day (§6).
- **DST forward:** daily reset compares calendar dates → the 23-hour day counts as a full cycle (correct for calendar-daily). Streak-break thresholds are wall-clock; risk assessed LOW — flagged, not claimed as a defect.
- **UTC− users (reminder channel):** user in New York sets 08:00; scheduler fires when UTC == 08:00 → **03:00 local**. Proven by `format()` without a TZ argument (C-05).
- **Multi-device daily reset:** `lastCompletedAt` written by device A (UTC+13) is evaluated by device B (UTC−8) against B-local dates — A's late-evening completion can be reset by B as "a different day" though it is the same calendar day for A. Clock-relative resets for multi-device users.
- **Month end / February / leap year (monthly):** reset fires when `getMonth()` differs OR today ∈ daysOfMonth; Jan-31 tasks reset in February via the month branch; Feb-29 completions reset only via the month branch; **year never compared** — Mar-2025 completions are not reset by the month branch in Mar-2026 (C-04). No `setDate(31)` overflow arithmetic exists in the reset path.
- **Week-start disagreement:** no week-start concept exists — weekly cycles anchor to last completion, not a calendar week (§7).
- **Server/client clock disagreement:** only `createdAt` (serverTimestamp) and `lastReminderSent` are server-clock; `lastCompletedAt` — the input to ALL reset logic — is client-clock. A device clock set years ahead makes every reset comparison vacuous.

No UTC/local day mismatch exists *within* the client reset logic (consistently local); material temporal defects are C-05, C-04, and the raw-ms thresholds.


## 19. Type-safety intersections

The entire commitment write path is type-suppressed (`// @ts-nocheck` verified by direct read):

- `src/api/CommitmentApi.ts` — **the authoritative mutation is untyped**: `taskDoc.data() as AnchorTask` on an unvalidated Firestore payload; `updates: Partial<AnchorTask>` written blind. Weakened invariant: a malformed `currentStreak` (string) in the doc makes `currentStreak + 1` produce string concatenation (`"51"`), which then persists — no compiler guard, no runtime validation.
- `src/api/CommitmentResetApi.ts`, `src/api/TaskQueryApi.ts`, `src/hooks/queries/useTaskQueries.ts` — unvalidated payload spread (`{ id, ...doc.data() } as AnchorTask`); malformed/stale-typed fields (e.g. `daysOfWeek` letters vs names) cannot be caught.
- `src/hooks/useCommitmentReset.ts` — all recurrence date logic untyped; `t.daysOfMonth?.includes(...)` on a malformed array silently skips.
- `src/hooks/useTaskReminders.ts` — reminder shape unchecked.
- UI layer (`TaskForm`, `TaskFormParts`, `EditTaskForm`, `EditTaskFormFields`, `TaskItem`, `SwipeableTaskItem`, `CommitmentsView`, `WeeklyView`, plus the remaining feature components per 03-STATIC-INTEGRITY's 67 finance/commitment files) — the `Omit<AnchorTask,'type'>` protection exists only in signatures; at runtime nothing distinguishes intended fields from arbitrary ones (C-07).

Not suppressed: `useCommitmentService.ts`, `useCommitmentOfflineSync.ts`, `offlineTaskQueue.ts`, `offlineQueueStorage.ts`, `streakUtils.ts`, `useCommitmentBadge.ts`, `AuditService.ts`. The optimistic/queue layer is typed but delegates the authoritative write to the suppressed API layer — suppression covers exactly the transaction/streak core.

Weakened invariants, concretely: (1) stale `currentStatus` propagation is invisible (the boolean argument is trusted end-to-end); (2) malformed recurrence values flow from Firestore into typed consumers without error; (3) mass assignment (C-07) is partly a typing artifact — `Partial<Omit<AnchorTask,...>>` is documentation, not enforcement.

## 20. Test-evidence matrix

Sources: `useCommitmentService.test.tsx` (~460 lines, mocked Firestore), `useCommitmentService.lazy-reset.test.ts`, `useCommitmentReset.test.ts` (36 cases, mocked API), `useCommitmentOfflineSync.test.tsx`, `useCommitmentBadge.test.tsx`, `useTaskReminders.test.ts`, `CommitmentApi.test.ts`, `CommitmentResetApi.test.ts`, `TaskQueryApi.test.ts`, `TaskContext.test.tsx`, component suites, `e2e/commitments.spec.ts` (soft assertions), functions tests (`reminderDedupe/Claim/Batching/Preferences/Routing`), `git grep commitments` in rules suites = **0 hits**.

| Behavior | Verdict | Basis |
|---|---|---|
| Create commitment | PARTIALLY PROVEN | unit mock (addDoc), e2e UI-presence only |
| Update | PARTIALLY PROVEN | component tests only; no API behavior proof |
| Delete | PARTIALLY PROVEN | unit mock; no rules proof |
| Complete (single click) | PARTIALLY PROVEN | unit mock of runTransaction (mock ignores streak logic of real impl) |
| Uncomplete | UNPROVEN | the dedicated test is `it.todo`/`it.skip` (useCommitmentService.test.tsx:371-372) |
| Double-click completion | UNPROVEN | no test anywhere; implementation reading shows uncomplete path unguarded |
| Concurrent completion | UNPROVEN | no multi-client test; Firestore concurrency semantics never exercised (all mocks) |
| Streak increment | PARTIALLY PROVEN | unit asserts optimistic cache +1 with mocked transaction returning fixed doc |
| Streak reset (break) | PARTIALLY PROVEN | lazy-reset tests cover 1.5/8/32-day thresholds — against mocked clock and mocked writes |
| Longest streak | UNPROVEN | no test references longestStreak monotonicity |
| Daily reset | PARTIALLY PROVEN | useCommitmentReset.test.ts (mocked) |
| Weekly reset | PARTIALLY PROVEN | same, incl. day-name + 7-day fallback |
| Monthly reset | PARTIALLY PROVEN | same — but the year-ignoring branch is **not** tested (tests use Dec→Jan) |
| Timezone boundary | UNPROVEN | no test sets a non-UTC TZ |
| Missed cycles | PARTIALLY PROVEN | threshold tests only; no multi-miss behavior test |
| Offline completion (enqueue) | PARTIALLY PROVEN | useCommitmentService offline-resilience tests (error-shape → enqueue) |
| Offline replay (flush) | PARTIALLY PROVEN | flush-invocation tests only — replay *content* and streak math never tested |
| Timeout-after-commit | UNPROVEN | no test constructs commit-then-client-failure |
| Delete while queue pending | UNPROVEN | no test |
| Reminder schedule (client matcher) | PARTIALLY PROVEN | useTaskReminders.test.ts covers matcher basics |
| Reminder schedule (server FCM) | PARTIALLY PROVEN | functions unit tests cover dedupe/claim/batching **given** a currentTime — the timezone defect is outside their assertions |
| Reminder reschedule / cancel | UNPROVEN | no test on edit/delete interaction with either channel |
| Owner-only mutation (rules) | UNPROVEN BY TEST | `grep commitments src/__tests__/firestore-rules.*.emulator.ts` = 0 hits; rules-proven by code reading only |
| Post-family-disconnect read (commitments) | UNPROVEN | family rules suite seeds only the `sharedWith` branch (07 §18) |
| Recurrence reset vs completion race | UNPROVEN | no test |

Mocked happy-path UI tests are **not** counted as proof of Firestore concurrency semantics anywhere above. `e2e/commitments.spec.ts` is largely tautological (`expect(typeof x).toBe('boolean')` patterns, `hasActive || hasCompleted || true`) — it proves reachability, not behavior.


## 21. Confirmed findings

Severity per the finding standard. Every finding below is proven from implementation reading of the cited paths; production-only aspects are in §22.

### C-01 · Completion toggle is not idempotent; streak can double-increment within one cycle · HIGH · PROVEN (code path)
- Paths/symbols: `CommitmentApi.toggleCommitmentCompletion` (`src/api/CommitmentApi.ts:15-40`), `useCommitmentService.toggleTask`, `TaskItem.handleToggle`, `offlineTaskQueue.ts`.
- Flow: transaction direction and streak math derive from the **client argument** `currentStatus`, not the server-observed document; no cycle identity, no applied-marker, no `lastCompletedAt` guard inside the transaction.
- Expected invariant: at most one completion/streak increment per recurrence cycle.
- Actual: two same-intent transactions serialize into streak +2 (§5.3); double-tap on the uncomplete path decrements twice (§5.2); timeout-after-commit re-applies (§5.6); cross-tab flush duplicates (§11).
- Scenario: a completion whose response is lost to a flaky network → queued → flush → streak 5 → 7 for one day's completion.
- Impact: persistent incorrect streak data feeding UI nudges, Fabric insights ("X-day streak"), backend nudges.
- Blast radius: all users, all types, todos included.
- Mitigation present: the transaction serializes increments (never lost writes); decrements floored at 0.
- Test coverage: none for any duplicate path.
- Remediation direction (later): derive direction from server doc state + per-cycle guard inside the transaction; idempotency keys on queued operations.

### C-02 · Offline queue replays stale transitions; no idempotency, TTL, cap, or cross-user cleanup · HIGH · PROVEN (code path)
- Paths: `offlineTaskQueue.ts:18-30,58-86`, `useCommitmentOfflineSync.ts:17-50`, `offlineQueueStorage.ts` (memory fallback).
- Expected: queued offline mutations converge the server to the user's last intended state, applied once.
- Actual: entries store the pre-toggle status; dedupe-overwrite discards intermediate intents (complete→uncomplete offline nets streak −1); timeout-after-commit nets +2; failed entries retry forever; entries survive logout/account-switch and replay on that user's next login; two tabs double-apply one entry; IDB failure silently degrades to non-persistent memory.
- Scenario: offline complete → offline uncomplete → reconnect: server streak ends below the pre-session baseline (§11 replay math).
- Impact: persistent server-side streak corruption via a normal offline path; stale cross-user entries on shared devices.
- Blast radius: all offline users; shared-device users.
- Mitigation present: per-(user,task) dedupe bounds queue growth; deleted-task replays no-op safely.
- Test coverage: flush-invocation tests only; replay content never tested.
- Remediation direction: desired-state representation (or op-log with applied-markers), retry cap + TTL, clear-on-logout, cross-tab claim.


### C-03 · Optimistic UI can be overwritten by stale polls; rollback can leave wrong UI indefinitely; the onSnapshot claim in code is false · MEDIUM · PROVEN (implementation); frequency UNPROVEN (UH-C05)
- Paths: `useTaskQueries.ts` (5 s polling; no listener), `useCommitmentService.ts:81-130` (comment claims onSnapshot sync + rollback), commit `c7beec9`.
- Expected (per the code comment): a listener keeps the cache synced to server truth; rollback restores correct state.
- Actual: an in-flight `getDocs` resolving after `setQueryData` overwrites optimistic state (React Query applies fetch results unconditionally); error rollback is invalidate-only — the pre-toggle value is never locally restored, and with `placeholderData` + `retry:3` wrong state persists through failed refetches.
- Impact: the BUG-023 symptom class (toggle appears to revert; user re-taps → double toggle) persists at lower frequency.
- Mitigation present: short staleTime + refetchOnWindowFocus narrows the window; the transaction serializes the server side.
- Test coverage: zero; both optimistic-update edge tests are skipped.
- Remediation direction: restore a snapshot listener (diagnose the original 400s), or functional rollback to the pre-toggle cache value.

### C-04 · Reset/recurrence: client-clock, blind, racy; can erase a legitimate completion; month branch ignores year; streak-break is time-threshold not cycle-based · MEDIUM · PROVEN (code path)
- Paths: `useCommitmentReset.ts:16-72`, `CommitmentResetApi.ts` (unconditional updateDoc).
- Expected: resets never erase a current-cycle completion; a missed cycle always breaks the streak.
- Actual: (a) the stale-poll race lets the effect write `completed:false` over a completion made moments ago on another device (§7); (b) the monthly branch compares `getMonth()` only — Mar-2025 completions survive into Mar-2026; (c) streak break requires `diffDays > 1.5/8/32` wall-clock days — a 23:00 completion followed by a fully missed day keeps the streak; (d) failed reset writes are dropped silently (`void`); (e) continuously-open tabs never re-evaluate.
- Impact: user-visible completion loss, incorrect streaks, stale `completed=true` muting FCM reminders for days.
- Mitigation present: the effect reads server-truth `rawTasks` (not optimistic state), so same-device completions are safe.
- Test coverage: threshold tests with mocked clock; the race and year branches are untested.
- Remediation direction: server-side scheduled reset or conditional update; year-aware month comparison; cycle-anchored streak math.

### C-05 · Server reminder scheduler evaluates user-local reminderTime against UTC · MEDIUM · PROVEN (code path); delivered hours UH-C02
- Paths: `functions/src/reminders.ts:13-27` (`format(now,'HH:mm')` without TZ; `onSchedule({timeZone:'Africa/Lagos'})` affects cron only), `types/index.ts:27` (no timezone field), client `useTaskReminders.ts` (device-local).
- Expected: reminders at the chosen local wall-clock time.
- Actual: fires when UTC HH:mm equals the stored local string (Lagos +1 h, NYC −5 h, UTC+13 → next-day morning); the client channel additionally fires at the correct local time when the app is open → duplicate notifications at different times; weekly/monthly tasks are reminded **daily** (no day gate on either channel).
- Impact: wrong-hour reminders for all non-UTC users; duplicate/missed notifications; the reminder feature is untrustworthy as shipped.
- Mitigation present: robust server-side dedupe (claims + batch key + `lastReminderSent`).
- Test coverage: functions tests assert behavior for *given* currentTime strings; timezone semantics untested.
- Remediation direction: store an IANA timezone (or UTC instant) per commitment; compute per-user local time in the scheduler; add a day-of-week gate.


### C-06 · daysOfWeek format split — weekly tasks invisible to DailyBriefingEngine/badge · MEDIUM · PROVEN (code path)
- Paths: producers `TaskFormParts.tsx:68` / `EditTaskFormFields.tsx:46` write `'Sunday'…'Saturday'`; consumer `DailyBriefingEngine.getTodayTasks` (`src/services/fabric/DailyBriefingEngine.ts:6-26`) matches `DAY_LETTERS` `'S','M','T','W','T','F','S'`; the type comment (`types/index.ts:23`) still documents letters.
- Expected: weekly commitments appear in "today" tasks, badge count, and daily briefing.
- Actual: `daysOfWeek?.includes('M')` never matches `'Monday'` → weekly tasks are excluded from `getTodayTasks`, so `useCommitmentBadge` undercounts and Fabric briefing omits them; reset logic and calendar views (full names) work.
- Impact: silent under-reporting of weekly commitments across badge/briefing/Fabric.
- Mitigation present: none.
- Test coverage: none bridging producer/consumer formats.
- Remediation direction: canonical day representation (numbers or fixed codes) + one normalization point.

### C-07 · Rules validate almost nothing: client-controlled category/type/streaks/timestamps/arbitrary fields; unbounded title · MEDIUM · PROVEN (rules text)
- Paths: `config/firestore.rules:33-37,328-332`.
- Expected: only UI-intended fields mutable; semantic fields protected.
- Actual: `isValidTask` = title non-empty + completed bool, applied to the merged doc; no field allowlist (contrast the `notifications` rule's `diff().affectedKeys().hasOnly` clamp); an owner client can set `currentStreak: 999999`, `category:'family'` (widening read exposure), `type` (breaking reset semantics), `createdAt`, arbitrary extra fields, multi-MB titles; malformed `type` accepted at create.
- Impact: integrity surface for every downstream consumer; a crafted client can corrupt its own data or widen sharing. **No cross-user escalation** — mutation stays owner-only.
- Mitigation present: path-uid binding blocks cross-user writes; title/completed shape enforced.
- Test coverage: zero commitments rules tests.
- Remediation direction: field allowlist + per-field type/enum/range validation; immutable `type` on update; title length cap.

### C-08 · Audit events decoupled from authoritative outcomes; edits and resets unaudited · LOW · PROVEN
- Paths: `useCommitmentService.deleteTask` (audit **before** delete), `toggleTask` (no audit on offline/queued/timeout paths), `updateTask` (no audit; `auditCommitments.edited` is dead), reset API (no audit), `AuditService.logAuditEvent` (silent failure).
- Impact: `commitment_deleted` events can contradict Firestore; incomplete audit trail for the domain.
- Remediation direction: emit after success only; audit the flush path; audit edits/resets.

### C-09 · Todo/recurring conflation — one-time tasks accrue streaks; "days" semantics mislabeled for weekly/monthly · LOW · PROVEN
- Paths: `CommitmentApi.createCommitment` (streak fields forced on todos), `toggleCommitmentCompletion` (type-blind), `streakUtils.ts` (day-based copy), `commitmentInsights.ts` ("X-day streak").
- Impact: meaningless streaks on todos; a 5-cycle monthly streak displayed as "5-day streak".
- Remediation direction: type gate in toggle; per-type streak units or suppression.

### C-10 · Unbounded title accepted end-to-end · LOW · PROVEN
- Paths: forms (no maxLength on title inputs), `isValidTask` (no size cap); `notes` capped in UI only (maxLength 500).
- Impact: storage/DoS hygiene; rendering of arbitrarily large strings.
- Remediation direction: rule-level size caps.

### C-11 · List fetch silently truncates at 100 commitments · LOW · PROVEN
- Paths: `TaskQueryApi.ts:7-11` (`orderBy('createdAt','desc'), limit(100)`, no pagination) — the sole list source for UI, insights, and badge.
- Expected: all commitments visible/counted.
- Actual: commitments beyond the newest 100 are invisible everywhere client-side; completion-rate products undercount.
- Mitigation present: none; no warning exists.
- Remediation direction: paginate or surface the truncation.


## 22. Unverified high-risk behaviors (kept separate from confirmed findings)

- **UH-C01** — Production prevalence of corrupted streaks/completions (how many real documents already reflect C-01/C-02/C-04). Requires a production data audit.
- **UH-C02** — Actual Cloud Functions process timezone in production (standard runtime is UTC, but deployment config could differ) — determines the exact reminder skew of C-05. Verify via a staging delivery test or a TZ probe.
- **UH-C03** — Browser Background Sync reality: whether the `sync-task-toggles` tag fires without an open client on target platforms (Chrome supports it; Safari ignores SyncManager). Affects offline-replay timing, not the correctness of C-02.
- **UH-C04** — Duplicate-FCM delivery rate in production (claims TTL vs scheduler overlap) and stale-token cleanup effectiveness on real devices.
- **UH-C05** — Empirical frequency of the §5.4 stale-poll overwrite on real networks (drives whether C-03 is user-visible in practice).
- **UH-C06** — App Check enforcement state on Firestore (shared with UH-F06/FI-17): determines how trivially C-07 mass assignment can be driven from a modified client.

## 23. Domain reachability / dead code (commitments only)

- `auditCommitments.edited` / `'commitment_edited'` — defined and tested, never called by production code.
- `clearTaskQueue` / `getTaskQueueLength` (`offlineTaskQueue.ts`) — no production callers (re-exported by `offlineQueue.ts` only).
- `onSnapshot` comment residue in `useCommitmentService.ts:66-121` — describes a removed mechanism (misleading docs, not dead code).
- `AnchorTask.dayOfMonth` (singular) — legacy field: written only by `src/utils/seeder.ts`, still read by reset/views as a fallback; forms never write it. Alive-but-legacy compatibility shim.
- "Focus mode" timeline action — declared "coming soon" stub (already F-01).
- Duplicate offline-queue architecture: `offlineQueue.ts` (finance) vs `offlineTaskQueue.ts` (tasks) — parallel implementations with different dedupe semantics; consolidation candidate.
- No obsolete alternate commitment service, duplicate recurrence implementation, orphaned component, or impossible route was found: the module set in §2.1 is the complete canonical surface, and `npm run check:dead-code` (knip, src-only) passes with zero findings.

## 24. Recommended later remediation ordering (not started in this pass)

1. **C-01 + C-02 together** (same root: non-idempotent client-argued toggle + transition queue). Server-side direction/guard + idempotent queue.
2. **C-05** (reminder timezone + day gate) — cheap, high user-trust payoff; requires schema addition.
3. **C-04** (reset correctness: conditional update, year fix, cycle-anchored streaks).
4. **C-07** (rules field allowlist) — must land before any trust is placed in streak data.
5. **C-06** (day-format unification) — small, fixes badge/briefing silently.
6. **C-03** (listener vs poll decision; rollback).
7. C-08…C-11 hygiene batch.
Ordering constraint: C-07's field clamp changes what writes are legal — land it together with client changes that stop writing protected fields, or toggles (which write streak fields) will start failing.

## 25. Evidence appendix

- `src/hooks/useCommitmentService.ts` (155 lines) — optimistic toggle, error classification, audit ordering.
- `src/api/CommitmentApi.ts` (52) — transaction `toggleCommitmentCompletion`; `createCommitment` streak defaults; `updateCommitment` pass-through.
- `src/api/CommitmentResetApi.ts` (14) — unconditional resets.
- `src/api/TaskQueryApi.ts` (15) — limit(100) list source.
- `src/hooks/queries/useTaskQueries.ts` (38) — polling; BUG-023 onSnapshot→poll history comment.
- `src/hooks/useCommitmentReset.ts` (72) — daily/weekly/monthly branches; thresholds; year gap.
- `src/hooks/useCommitmentOfflineSync.ts` (53) + `src/utils/offlineTaskQueue.ts` (90) + `src/utils/offlineQueueStorage.ts` (30) — queue semantics.
- `src/hooks/useTaskReminders.ts` (53) — client reminder channel.
- `functions/src/reminders.ts` (116) + `reminderDelivery.ts` (108) + `reminderSender.ts` (62) — server channel; UTC `format()`.
- `functions/src/fabricNudges.ts` + `fabricNudgeHelpers.ts` — Lagos-pinned streak nudge.
- `functions/src/weeklyReport.ts:87-97` — completion-rate consumer.
- `config/firestore.rules:33-37,328-332` — `isValidTask` + commitments block.
- `src/config/firebase.ts:56-61` — `memoryLocalCache()`.
- `src/context/TaskContext.tsx` (50) — haptics + Fabric `learnFrom` ordering.
- `src/context/fabric/useFabricLiveSync.ts:49-55` — second commitments listener.
- `src/services/fabric/DailyBriefingEngine.ts:5-27` — day-letter matcher.
- `src/features/commitments/components/TaskItem.tsx:42-67` — toggle gating asymmetry.
- `src/features/commitments/components/TaskForm.tsx` / `TaskFormParts.tsx:68` / `EditTaskForm.tsx` / `EditTaskFormFields.tsx:46` — producers of `daysOfWeek`, `category`, validation gaps.
- `src/features/commitments/CommitmentsView.tsx:38-75` — create/update/delete handlers.
- `src/services/AuditService.ts:57-68,115-124` — audit call sites and failure swallowing.
- `src/utils/taskInsights.ts`, `src/features/commitments/utils/streakUtils.ts`, `src/hooks/useCommitmentBadge.ts` — derived consumers.
- `e2e/commitments.spec.ts` — soft-assertion e2e surface.
- Tests: `useCommitmentService.test.tsx` (incl. `it.todo`/`it.skip` at :321-322, :371-372), `useCommitmentService.lazy-reset.test.ts`, `useCommitmentReset.test.ts`, `useCommitmentOfflineSync.test.tsx`, `useTaskReminders.test.ts`, `CommitmentApi.test.ts`, `CommitmentResetApi.test.ts`, `TaskQueryApi.test.ts`, functions reminder tests.
- Git history: `c7beec9` ("BUG-023: Replace onSnapshot with polling"), `9f6598d` ("BUG-023 + UX-020").
- Cross-references: 07-FAMILY-SHARED-DATA-ISOLATION.md §6/§10/§18 (FS-01 mechanism; family read-only; rules-test gap), 06 §18 (rules-test methodology), 03-STATIC-INTEGRITY (67 @ts-nocheck files).

*End of 08-COMMITMENTS-TASK-STATE-INTEGRITY.md.*

