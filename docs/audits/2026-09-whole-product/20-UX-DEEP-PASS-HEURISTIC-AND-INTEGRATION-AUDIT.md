# 20 — Deep UX Pass: Heuristic Evaluation, Integration Defects & Next Steps

Date: 2026-09-18 · Round 2 of the UX program. Supersedes the *evidence base* of [`18-UX-AUDIT-AND-REDESIGN-PLAN.md`](18-UX-AUDIT-AND-REDESIGN-PLAN.md) (findings there remain valid unless corrected in §6 below) and extends [`19-UX-BENCHMARK-RESEARCH.md`](19-UX-BENCHMARK-RESEARCH.md) with a second research round (§2).

Scope: the whole product journey — marketing → login → onboarding → Home/dashboard → Anchor AI → Commitments → Finance → Settings → 404 — evaluated for **intentionality and ease of use**, not visual polish.

## 1. Method and what was actually observed

Unlike round 1 (five screens), this pass drove **37 instrumented screens** plus scripted verification of two critical paths, at a 390×844 mobile viewport against the Auth/Firestore emulators with seeded data, and dumped each screen's headings/buttons/inputs/visible text so findings are traceable to real copy rather than impressions.

Coverage: marketing `/`, `/login`, unknown route, all 10 Settings sections, Anchor AI **enabled** (page + full-page + transparency), dashboard (full page), Commitments (list + composer steps 1 and 2 for all cadences), Finance landing + create-account modal + account detail + desktop layout, and the full 5-step onboarding for a brand-new non-fixture user.

Two flows were verified instrumentally rather than visually — the account-detail path and the onboarding step-2 stall — because both turned out to be **functional** defects, not cosmetic ones.

**What I could not see, stated plainly:**
- **Mobbin's screens are not accessible to me.** The site is a paid, JS-rendered library; I retrieved its public landing page and taxonomy only (§2). I cannot view its screenshots, so no finding here claims Mobbin-specific visual precedent.
- Loop Habit Tracker's site is a 1.8 KB stub (FAQ/privacy/source links only) — no substantive product documentation was retrievable.
- No real-device testing; push delivery and OS-level behaviour remain unverified (unchanged from §17/UH-SN04-05).

## 2. Research round 2

| Source | Retrieval | What it gives us |
|---|---|---|
| **Mobbin** landing + taxonomy | `RETRIEVED-VERBATIM` (landing only) | Confirms the industry-standard pattern vocabulary and that these are *catalogued, named patterns*: collections include **Onboarding, Account Setup, Welcome, Bottom Sheet, Settings, Home, Wallet, Profile, Dialog, Toast, Tab, Progress Indicator**; flow categories include **Adding & Creating, Searching, Browsing Home, Starting & Completing, Chatting, Tutorial, Exploring**. Library scale: 1,428 apps / 621,500+ screens / 323,900 flows. |
| **Streaks** (Apple Design Award) | `RETRIEVED-VERBATIM` | The single most relevant benchmark for our commitments: "Every day you complete a task, your streak is extended… **Don't break the chain, or your streak will reset to zero**", and crucially — *"Some tasks aren't for every day. **Set the days so you don't break your streak!** Walk to work (Monday to Friday) / Go to the gym (3 days per week) / Call your parents (every Wednesday) / Avoid junk food (Sunday to Friday)"*, plus automatic goal tracking via the Health app and widgets/complications that show what is still remaining **and complete tasks without opening the app**. |
| **Loop Habit Tracker** | `RETRIEVED-MINIMAL` | Tagline only: "daily reminders, beautiful charts and insightful statistics … helps you create and maintain good long-term habits", free/open source. Directionally: charts + reminders are the load-bearing features. |
| **NN/g — 10 Usability Heuristics** | `RETRIEVED-VERBATIM` | The evaluation frame used in §3: 1 Visibility of System Status · 2 Match Between the System and the Real World · 3 User Control and Freedom · 4 Consistency and Standards · 5 Error Prevention · 6 Recognition Rather than Recall · 7 Flexibility and Efficiency of Use · 8 Aesthetic and Minimalist Design · 9 Help Users Recognize, Diagnose, and Recover from Errors · 10 Help and Documentation. |

**The one benchmark insight that changes our model:** Streaks treats a *schedule* as part of the habit and computes streaks against the schedule ("set the days so you don't break your streak"). Our commitment model has cadence but our progress/finish signals are calendar-day based, which is why the app can tell a user who is perfectly on track that they are at "0%". This is the single highest-leverage product change in this document (§5.1).

**What Mobbin's taxonomy tells us structurally:** every surface we are struggling with — Onboarding, Account Setup, Bottom Sheet, Settings, Home, Wallet, Dialog, Toast, Progress Indicator, Adding & Creating, Starting & Completing, Chatting — is a *named, solved pattern category*. Our defects are not unsolved design problems; they are deviations from patterns that are catalogue-standard. That is good news: the fixes are conventional, not inventive.

## 3. Heuristic evaluation (NN/g frame applied to observed behaviour)

| # | Heuristic | Observed violation (traceable to instrumented evidence) | Surface |
|---|---|---|---|
| 1 | **Visibility of system status** | Composer step 1 shows a bare "Choose Frequency" with no step count, no progress, no back; the view switcher's active state is visual-only (no `aria-pressed`); the Finance landing shows "No transactions yet" with no hint that transactions exist in other months; the dashboard's Portfolio advertises a total it never prints. | Commitments, Finance, Dashboard |
| 2 | **Match between system and the real world** | "DOMAIN" for what is a category; "TODO" used as a *frequency*; "USER IDENTIFIER" showing the internal id; "Multi-account asset management and cashflow tracking"; "No tasks scheduled today" while four active commitments exist; "Anchor AI" vs nav "Anchor" vs route `/fabric`. | Commitments, Settings, Finance, Anchor AI |
| 3 | **User control and freedom** | The commitment composer cannot be cancelled from inside itself (only the page-level "Close"); step 2 exposes **two** dismiss affordances (back chevron *and* X); onboarding "Skip for now →" exits the entire flow; onboarding has **no resume** — a reload at step 3 returns to `STEP 1 OF 5` (reproduced). | Commitments, Onboarding |
| 4 | **Consistency and standards** | The same four words mean two different things on one screen (filter chips `Daily/Weekly/Monthly/Todo` vs cadence cards with identical labels); nav vocabulary differs across platforms (Home/Tasks vs Dashboard/Commitments vs "System"); emoji used as icons while `docs/DESIGN_SYSTEM.md` mandates Lucide only; a *tab* bar (settings chips) that is really anchor links. | Global, Commitments, Settings |
| 5 | **Error prevention** | Onboarding step 2 requires a balance but shows no required indicator — the primary CTA is simply disabled with no explanation (reproduced: `continueDisabled=true` with an empty balance); display name pre-filled from the email local-part; "Skip for now →" silently ends setup. | Onboarding, Commitments |
| 6 | **Recognition rather than recall** | Commitment rows expose no cadence, next-due or streak (the "stray dash" is where that information should be); the view switcher is three unlabelled icons; the assistant's capabilities must be guessed from prompt chips; `/fabric/transparency` is unreachable, so provenance must be remembered rather than seen. | Commitments, Anchor AI |
| 7 | **Flexibility and efficiency of use** | No quick-add, no bulk complete, no saved views (Today/Upcoming), no keyboard path; every commitment creation is a 2-step wizard; no focus/timer affordance even though a timeline view exists (the codebase still toasts *"Focus mode coming soon!"*). | Commitments |
| 8 | **Aesthetic and minimalist design** | Dashboard stacks Portfolio + Asset Split (identical payload), Momentum, Recent Activity, Productivity; Anchor AI stacks Today + mood + proactive question + insights + input; the composer is the 4th block down the Commitments page; Settings renders **ten sections in one scroll** behind **nine** anchor chips. | Dashboard, Anchor AI, Commitments, Settings |
| 9 | **Recognize, diagnose, recover from errors** | A disabled Continue with no reason; a proactive card rendering a literal **"?"** where an icon should be; failures surface only as a transient toast with no retry ("Failed to create account."); empty states instruct actions that do not exist on screen ("Add your first transaction to get started" — no such control exists on `/finance`). | Onboarding, Anchor AI, Finance |
| 10 | **Help and documentation** | Help is scattered "Learn More" buttons that toast *"will be available in the next update"*; nothing explains what Anchor AI does before enabling it; the transparency page exists but is unreachable and has no back affordance. | Global, Anchor AI |

## 4. Round-2 findings (new or newly proven)

Severity scale unchanged (CRITICAL / HIGH / MEDIUM / LOW / INFO). `UX-DS` is a new area for design-system contract violations.

### 4.1 Finance — two functional defects

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| **UX-FN-07** | **HIGH · functional** | **Accounts other than the active card cannot be opened by tapping.** The overlapping card stack occludes the cards beneath: a normal `click()` on "Open Primary Checking account" times out (element intercepted), while `click({force:true})` navigates to `/finance/account/acc-usd-savings`. Since account detail is the **only** place transactions can be recorded, this blocks the core money loop. | Instrumented: `locator.click` TimeoutError vs force-click OK → URL change |
| **UX-FN-08** | **HIGH · functional** | **No way to record a transaction from the Finance landing page.** The complete control inventory is "Create account" (32×32), "Previous month" (32×32), "Next month" (32×32) and the devtools button; a regex scan for transaction affordances returns `[]`. The empty state still instructs "Add your first transaction to get started". Recording exists only at `/finance/account/:id` ("Record Transaction"), which `UX-FN-07` makes unreachable by tap. | Instrumented button inventory + scan |
| **UX-FN-09** | MEDIUM · a11y | Touch targets below the 44×44px contract in `docs/DESIGN_SYSTEM.md`: "Create account", "Previous month" and "Next month" measure **32×32**. | Instrumented bounding boxes |
| **UX-FN-10** | MEDIUM | The landing view defaults to the current month, so it shows the empty state while the account holds transactions in other months — with no cue that data exists elsewhere and no range widening. | Seeded 13 transactions vs "No transactions yet / September 2026" |

### 4.2 Onboarding — one structural and two behavioural defects

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| **UX-OB-06** | **HIGH** | **Onboarding progress is not persisted.** Reloading at step 3 returns to `STEP 1 OF 5` (reproduced) even though the account and goal from steps 2–3 already exist — inviting duplicate account creation and repeated name entry. | Instrumented: reload mid-flow → step 1 |
| **UX-OB-07** | **HIGH** | The display-name field is **pre-filled with the email local-part** (observed `ux-dbg-1789770000126`), so `john.doe@…` is silently named "john.doe". | Instrumented input values at step 1 |
| **UX-OB-08** | **HIGH** | Step 2's "Continue" is `disabled` until the balance is filled, but the field is **not marked required** and the disabled state carries **no explanation** — reproduced exactly (`continueDisabled=true`, empty balance, no message). Experience: "the button does nothing". | `OnboardingAccountStep.tsx:85` + instrumented state |
| **UX-OB-09** | MEDIUM | "Skip for now →" appears on **every** step and always terminates setup (round-1 `UX-OB-01`, now visually confirmed), while step 3's skip only advances. One label, three behaviours. | Per-step button inventory + `OnboardingView.tsx` |

### 4.3 Commitments — the composer, second screen

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| **UX-CM-09** | MEDIUM | Composer step 2 ("Daily Commitment"): **"DOMAIN"** jargon for category; **Save sits below the fold** at 390×844; **two dismiss controls** (back chevron *and* X); emoji used for priority (🔴🟡🟢); the Notes field is cut off mid-screen; time is limited to coarse buckets (morning/afternoon/evening/any) with **no way to set an actual reminder time** — so "daily at 7am", the single most common habit intent, cannot be expressed. | Screenshot `e01-composer-daily-step2` + dump |
| **UX-CM-10** | MEDIUM | The composer's cadence cards and the page's filter chips carry **identical visible labels** (`Daily`, `Weekly`, `Monthly`, `Todo`) on the same screen, so two different concepts are expressed with the same four words. My own automation clicked the wrong one — a faithful simulation of what a user would experience. | Dumps `a12`/`a13` vs `e01` |
| **UX-CM-11** | MEDIUM · a11y | The view switcher *has* accessible names ("Timeline View", "List View", "Week View") but **no visible labels**, and its selected state is not exposed (`aria-pressed` absent — an automated `[aria-pressed]` scan found only the theme toggles). | Instrumented `[aria-pressed]` inventory |

### 4.4 Anchor AI (now observed with the feature enabled)

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| **UX-AI-06** | **HIGH · suspected** | The assistant states **"No tasks scheduled today."** while the Commitments page lists four active commitments (two of them daily). Either the statement or the scheduling model is wrong — needs a code check before the fix is scoped. | Screenshot `a06` vs dump `a10` |
| **UX-AI-07** | MEDIUM · suspected | The proactive-question card renders a literal **"?"** where an icon should be, immediately before "You have surplus funds available…" (missing/fallback icon). | Screenshot `a06` |
| **UX-AI-08** | MEDIUM | The first insight a user sees is a demoralising, plausibly-wrong headline: **"Commitment completion: 0% — 0 of 4 done in the last 30 days."** Either the metric is broken or the empty state is brutal; both are the wrong first impression. | Screenshot `a06` |
| **UX-AI-09** | MEDIUM | The mood check-in remains the **first interactive block**, above the assistant input and above insights; and with AI enabled the bottom nav grows to **five** items (Home / Tasks / **Anchor** / Finance / Settings). | Screenshot `a06` + nav dump |
| **UX-AI-10** | MEDIUM | "What Anchor AI Knows" (transparency) is reachable only by URL: no back affordance, never linked from the assistant, and it reports "hasn't learned any confirmed patterns yet" without explaining when it will. | Instrumented `a08` |

### 4.5 Cross-cutting: design system, dev surfaces, settings structure

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| **UX-DS-01** | MEDIUM | **Design-system contract violation.** Emoji are used as product icons — priority 🔴🟡🟢 and mood 😔😕😐🙂😄 — and the mood emoji are exposed as `aria-pressed` toggles, while `docs/DESIGN_SYSTEM.md` states "Icons — Lucide React exclusively". | Screenshots `e01`, `a06`; dump `P: 😔Rough:false …` |
| **UX-GL-07** | MEDIUM · **needs gating proof** | Developer surfaces are present in this build: the "DEVELOPMENT ENVIRONMENT" banner, a **"Open Tanstack query devtools"** button rendered *inside* the product UI on every screen, and a Settings section titled **"Developer Tools"**. These are presumably environment-gated, but the presence of a devtools trigger inside the app shell should be proven non-shippable rather than assumed. | Button inventory of every capture; `a04` heading list |
| **UX-ST-06** | MEDIUM | Settings renders **all ten sections in one continuous scroll** (User Profile, Identity & Security, Email Verification, Devices & Sessions, Appearance, Notifications, Anchor AI, Data Management, Contact & Feedback, Developer Tools) behind **nine** anchor chips that scroll instead of navigate — so sections have no identity, no URL and no back behaviour. Refines round-1 `UX-ST-02` with the real section count. | `a04`/`a05` heading + chip inventories |
| **UX-GL-08** | LOW | Login offers `Light theme` / `Dark theme` in the footer while the app also exposes Auto/Light/Dark plus text size and high contrast in Settings → Preferences — two places to change appearance, neither aware of the other. | Dump `a03` vs `a04` |

## 5. Target refinements this pass adds

### 5.1 Commitments must become **schedule-aware** (the highest-leverage change)

Streaks' documented rule — *"Some tasks aren't for every day. Set the days so you don't break your streak"* — describes a model we do not have, and its absence explains three of the defects above (`UX-AI-06`, `UX-AI-08`, `UX-CM-07`).

Target model (no schema change required — `type`, `timeOfDay` and cadence fields already exist):

1. **Expected occurrences are derived from cadence**, not from the calendar day: daily → every day; weekly → the selected weekdays; monthly → the selected day-of-month; custom → the interval.
2. **"Today" means "scheduled today, or overdue"** — never "everything that exists". This is what makes `UX-AI-06` ("No tasks scheduled today") correct-by-construction instead of contradictory.
3. **Streaks count consecutive *expected* occurrences.** A non-scheduled day cannot break a streak. This is the specific behaviour that makes Streaks feel fair, and it is what our users will assume.
4. **Completion is `completed / expected` over the window, not `completed / total commitments`.** The current `0 of 4 in the last 30 days` framing punishes users for commitments that were never due — it must be replaced before any insight is shown (`UX-AI-08`).
5. **Each row shows its schedule and next expected occurrence** in the space the stray dash currently occupies (`UX-CM-07`), so the user can see what the app expects of them.
6. **Reminder time becomes expressible** (an actual clock time, not just morning/afternoon/evening) — also the prerequisite for the notification programme's reminder correctness (`UX-CM-09`; related to SN-12).

### 5.2 The rest of the target model is unchanged from doc 18, with these additions

- **Composer:** one sheet, all fields, **sticky visible Save**, exactly **one** dismiss affordance, required-field indication, "Category" instead of "Domain", and no label collision with the list filters (`UX-CM-09`, `UX-CM-10`).
- **Finance:** the overlapping stack is fixed as a **functional** defect first (all accounts tappable — `UX-FN-07`); "Record transaction" becomes a first-class entry point on the landing page, including a real button in the empty state (`UX-FN-08`); 44px targets (`UX-FN-09`); an explicit "you have transactions in earlier months — widen range" cue (`UX-FN-10`); per-currency labelling from doc 18 §4.6.
- **Home + Anchor AI:** assistant input moves **above** mood and insights; mood relocates out of the assistant (`UX-AI-09`); insights are ranked with provenance and a link to transparency (`UX-AI-10`); the first insight must never be a bare `0%` (`UX-AI-08`).
- **Onboarding:** persist the step and resume it (`UX-OB-06`); never derive the display name from the email (`UX-OB-07`); mark required fields and explain disabled primaries (`UX-OB-08`); "Skip this step" ≠ "Finish later" (`UX-OB-09`).
- **Settings:** ten sections become a grouped hub with real routes (doc 18 §4.2, sharpened by `UX-ST-06`); appearance settings consolidate to one place (`UX-GL-08`).
- **Design system:** emoji-as-icon is replaced by Lucide for functional states (priority); if mood faces stay emoji, that becomes an **explicit, documented illustration decision** with accessible names — not an accident that contradicts `docs/DESIGN_SYSTEM.md` (`UX-DS-01`).
- **Dev surfaces:** prove that the devtools button, environment banner and "Developer Tools" section cannot render in production; if that proof fails, gate them (`UX-GL-07`).

## 6. Corrections to round 1 (self-audit, recorded rather than quietly edited)

| Round-1 item | Correction | Why |
|---|---|---|
| `UX-DB-01` "greeting renders `Good evening,…`" | **Downgraded and re-scoped.** With the profile resolved, the dashboard renders "Good evening, **Alex Owner**". The earlier capture was a first-paint state before the profile loaded, where the template still emits the comma/ellipsis around an empty name. The finding stands only as: *the greeting has no loading guard* — it is MEDIUM (cosmetic-during-load), not a permanent data bug. | Integrity: the strong claim was not reproducible in a settled state |
| `UX-CM-05` "unlabelled 3-icon switcher" | **Refined by `UX-CM-11`:** the control *does* have accessible names ("Timeline View", "List View", "Week View"); the real issues are the absence of **visible** labels and of an exposed selected state. | Instrumented `[aria-pressed]` inventory |
| `UX-ST-01/02` settings chips | **Refined by `UX-ST-06`:** not five sections but **ten sections in one scroll**, behind nine anchor chips. The severity of the IA finding increases. | Full section heading inventory |
| Round-1 nav observation | The "no nav element found" note in round 1 was a capture artefact (the query looked at the wrong element while the app was mid-load); the nav exists and is now fully inventoried, including its **five**-item state when Anchor AI is enabled. | Instrumented nav dumps |
| Round-1 claim of "41 findings" | Still accurate for round 1. This document adds **20** further findings (`UX-FN-07…10`, `UX-OB-06…09`, `UX-CM-09…11`, `UX-AI-06…10`, `UX-DS-01`, `UX-GL-07/08`, `UX-ST-06`), for **61** total across the program. **Correction (2026-09-18):** an earlier revision of this row said 23/64 — the ID list above is the authoritative count (4+4+3+5+1+2+1 = 20). | Count reconciliation |

## 7. Next steps

### 7.1 Three items to verify before scoping (do not fix on assumption)

| Item | How to verify | Owner action |
|---|---|---|
| **UX-AI-06** — "No tasks scheduled today" vs four active commitments | Read the `todayStats`/`briefing` derivation in `src/services/fabric/*` and `useFabricView`, and compare with how `TaskList`/`TimelineView` decide "today" | Confirm whether the statement or the scheduling model is wrong, **then** fold the fix into 7.2 P1 |
| **UX-AI-07** — literal "?" glyph in the proactive card | Inspect `FabricProactiveQuestionCard.tsx` for an icon rendered from a dynamic name/emoji that can miss | Confirm the missing-icon fallback; one-line fix plus a fallback test |
| **UX-GL-07** — dev surfaces in production | Trace the gating for the devtools button, the environment banner and the Settings "Developer Tools" section (env checks + a production-build inspection) | Prove non-shippable, or gate it. **This is the only finding here with a production-hygiene dimension** |

### 7.2 Priority order (revised — functional blockers first, design debate second)

This pass changed the ordering: three of the worst findings are **functional**, and two of them block the money loop. They should not wait for the redesign.

| Priority | Work | Findings | Why this order |
|---|---|---|---|
| **P0 · next** | Finance: make every account card tappable; add a real "Record transaction" entry point to the landing page and its empty state; restore 44px targets | `UX-FN-07`, `UX-FN-08`, `UX-FN-09` | Blocks the core money loop today; needs no design decision |
| **P0 · next** | Onboarding: persist and resume the step; mark required fields and explain the disabled Continue; stop deriving the display name from the email | `UX-OB-06`, `UX-OB-07`, `UX-OB-08` | Blocks first-run success; needs no design decision |
| **P1** | Commitments become schedule-aware (§7.3 A) — including reminder time and replacing `completed/total` metrics | `UX-AI-06`, `UX-AI-08`, `UX-CM-07`, `UX-CM-09` | Fixes the assistant's wrong statements at the root; prerequisite for any trustworthy streak or insight |
| **P1** | Composer becomes one capture-first sheet (sticky Save, one dismiss, "Category", no label collision) | `UX-CM-01…03`, `UX-CM-06`, `UX-CM-09`, `UX-CM-10` | The primary reported complaint; independent of IA changes |
| **P2** | Home merge (dashboard + assistant) with corrected insight ranking | `UX-DB-02…05`, `UX-AI-01…05`, `UX-AI-08…10` | Needs D1; delivers the "one calm surface" promise |
| **P2** | Shell: floating pill nav, single vocabulary, contextual FAB, opt-in scroll-hide | `UX-GL-01…06`, `UX-AI-09` | Needs D1/D2; improves every screen without touching data |
| **P3** | Settings hub: ten sections → grouped, routed, searchable | `UX-ST-01…06`, `UX-GL-02`, `UX-GL-08` | Large surface, low urgency, no functional loss today |
| **P3** | Finance landing redesign: per-currency totals, comparable rows, explainable empty months | `UX-FN-01…06`, `UX-FN-10` | Needs D5 (currency policy) |
| **P3** | Onboarding rewrite (3 screens, honest skips, persistent getting-started card) | `UX-OB-01…05`, `UX-OB-09` | Needs D6; the P0 fixes keep the current flow usable meanwhile |
| **P4** | Design-system sweep: emoji → Lucide for functional icons; document the mood decision | `UX-DS-01` | Cheap, but must be a deliberate call, not a drive-by edit |

### 7.3 Per-surface next steps with acceptance criteria

**A. Commitments (`CommitmentsView.tsx`, `components/TaskForm.tsx`, `TaskList`)**
1. Derive expected occurrences from cadence; drive "Today" from schedule + overdue.
2. Streak = consecutive expected occurrences completed; show it on each row with cadence and next occurrence.
3. Replace `completed / total` with `completed / expected` everywhere it feeds UI (list header, insights, dashboard).
4. Add exact reminder time to the composer.
5. Rebuild the composer as one sheet with a sticky Save and a single dismiss control; rename "Domain" → "Category"; give cadence labels that cannot be confused with filters ("Once", "Every day", "Certain days", "Monthly on…").

*Acceptance:* creating "Pay rent every 1st at 09:00" takes ≤2 interactions after opening the sheet; "Today" never shows a commitment that is not due; a Mon–Fri commitment holds its streak across weekends; a brand-new user's first insight is never a bare `0%`.

**B. Finance (`FinanceView.tsx`, `components/AccountCard.tsx`, `AccountForm.tsx`, `TransactionForm.tsx`)**
1. Fix the stack so every account is tappable (functional, P0) — verify with a real click, not a forced one.
2. Add a primary "Record transaction" entry point on the landing page and a real button in the empty state.
3. 44×44 minimum for `+`, previous month, next month.
4. Per-currency labelled totals; never concatenate currencies into one headline.
5. The empty-month state explains itself and offers range widening.
6. After creating an account, offer "record the opening transaction"; after recording, show the balance delta.

*Acceptance:* from `/finance` a user reaches a transaction form in ≤2 taps with no occluded target; no screen performs arithmetic across two currencies; a recorded transaction is visible immediately.

**C. Home + Anchor AI (`DashboardView.tsx`, `FabricView.tsx`, `FabricMoodCard.tsx`, `FabricQuerySection.tsx`)**
1. Move "Ask Anchor" above mood and insights; move mood out of the assistant.
2. Cap insights at 3 and rank them (obligation risk → money anomaly → consistency → reflective), each with window, one action and a link to transparency.
3. Replace "TOTAL ACROSS n ACCOUNTS" with a real per-currency total; delete the duplicate Asset Split payload.
4. Give the financial-goal empty state a CTA.

*Acceptance:* the first viewport contains identity, next-up, one status block and the assistant input; the assistant's "today" statement agrees with the Commitments page; provenance is one tap away.

**D. Onboarding (`OnboardingView.tsx`, `components/*`)**
1. Persist the step (the profile field already exists: `onboardingProgress.gettingStartedStep`) and resume on reload.
2. Required indicators plus an explanation for disabled primaries — or enable and validate on submit with a message.
3. Never prefill the display name from the email local-part.
4. Split "Skip this step" from "Finish later"; only the latter exits, and it must be resumable.

*Acceptance:* a reload at any step returns to that step; no step can be abandoned accidentally by the word "Skip"; no user is named after their email.

**E. Settings (`SettingsView.tsx`, `components/SectionNav.tsx`)**
1. Ten sections → grouped hub with `/settings/:section` routes, a back affordance and search.
2. Remove the dashboard gear — one entry point only.
3. Consolidate appearance with the login-page toggles.

*Acceptance:* every settings destination is a linkable URL; no horizontal overflow at 390px with all ten sections present; appearance is configurable in exactly one place.

**F. Shell (`MainLayout.tsx`, `BottomNavigation.tsx`, `bottomNavigationItems.tsx`)**
Unchanged from doc 18 §4.1, with one added constraint: the bar must not grow to five items (`UX-AI-09`) — Anchor belongs inside Home, not in the bar.

### 7.4 Decisions still required (in addition to D1–D8 in doc 18 §7)

> **D9–D11 ACCEPTED — 2026-09-18 (product owner).** The *Recommendation* column is the approved design, together with D1–D8 in doc 18 §7 and D12–D14 in doc 21 §6. No decision blocks any wave.

| # | Decision | Recommendation |
|---|---|---|
| D9 | Dev-surface policy: may a devtools trigger, environment banner or "Developer Tools" settings section exist in any deployed environment, and who proves the gating? | Keep them dev-only, add the gating proof to the P0 wave, and make "no dev control visible in staging" a release-checklist item |
| D10 | Are mood/priority emoji an intentional illustration language, or a violation to be replaced with Lucide? | Lucide for **functional** states (priority, selection); emoji only for **expressive** input (mood) with accessible names — documented in `DESIGN_SYSTEM.md` so it stops being accidental |
| D11 | Does commitment recurrence ever need sub-daily cadence (e.g. twice daily) or intervals beyond the current model? | Out of scope for this program — confirm, so the schedule-aware model does not over-build |

### 7.5 Definition of done for the UX program

The program is complete when: (a) the P0 functional defects are fixed and demonstrated with **real, non-forced** interaction tests; (b) a new user can go from sign-up to their first commitment without meeting a disabled control, a jargon label or a false statement; (c) the assistant's statements about the user's day agree with the Commitments page; (d) every page has exactly one primary action and every empty state offers the action it describes; and (e) the standing constraints hold — no schema/rules/functions change was required, the register is updated per wave, and every wave reached staging with `Release Smoke` green.

## 8. Evidence inventory (for reproduction)

| Artefact | Count / location |
|---|---|
| Instrumented screens captured this pass | 37 (`/tmp/ux2/a*.png`, `b*.png`, `c*.png`, `d*.png`, `e*.png`, `f01-finance-desktop.png`) |
| Text dumps (headings, buttons, inputs, visible copy) | 30 screens → `/tmp/ux2/text.json`; onboarding walk → `/tmp/ux2/onboarding.json`; sub-flows → `/tmp/ux2/flows.json` |
| Scratch instruments used | `ux-deep-capture.mjs`, `ux-onboarding-walk.mjs`, `ux-onboarding-debug.mjs`, `ux-flows-walk.mjs`, `ux-finance-verify.mjs` (repo root, **not committed**) |
| Reproduction preconditions | Seed the emulators **after** any emulator restart; fixture accounts (`*@anchor-os.com`) skip onboarding by design, so a fresh non-fixture user is needed to see it; Anchor AI must be enabled via Settings → AI → "Toggle Anchor AI" before `/fabric` renders anything |

The five scratch instruments are deliberately **not committed**: the two findings that depend on them (`UX-FN-07`, `UX-FN-08`) are proven by the recorded output above, and committing un-tested automation would add maintenance surface with no home in the test suites. If the team wants these interaction checks to become permanent, the right vehicle is the existing Playwright E2E suite (`e2e/`) — a separate, test-governed change.







