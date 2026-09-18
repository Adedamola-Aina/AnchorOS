# 18 — UX Audit & Redesign Plan (Log-in → Onboarding → Core Surfaces)

Date: 2026-09-18 · Companion research: [`19-UX-BENCHMARK-RESEARCH.md`](19-UX-BENCHMARK-RESEARCH.md)
Status: **PROPOSED — awaiting product decisions in §7.** This document is an evidence record plus a target specification; no implementation is authorised by it.

## 1. Method and evidence base

Findings below were produced by driving the **real application** (Vite dev server on `127.0.0.1:5173`, Auth/Firestore/Functions/Storage emulators, seeded fixture user `owner@anchor.local`), at a **390 × 844 mobile viewport** (the primary platform), plus source inspection of the owning components. Screenshots were captured headlessly with the repo's Playwright install.

Reproduction recipe (no committed tooling required):

```bash
# 1. emulators (already-running instance is reused)
nohup npx firebase-tools emulators:start --project demo-anchor-os --only auth,firestore,functions,storage
# 2. seed (REQUIRED after any emulator restart — emulator data is in-memory)
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node scripts/seed-dev-data.cjs
# 3. app
./node_modules/.bin/vite --config config/vite.config.ts --host 127.0.0.1 --port 5173 --strictPort
# 4. log in as owner@anchor.local / password123, then visit /dashboard /commitments /finance /fabric /settings
```

Two capture caveats, so this record is not over-claimed:
- `waitUntil: 'networkidle'` **never settles** in this app (Firestore keeps a socket open) — use `domcontentloaded` + an explicit settle delay, or navigation appears to hang.
- Every screenshot contains a circular third-party overlay badge in the bottom-right covering the `Settings` nav item. That badge is **not** part of the application (browser-extension artefact); it was excluded from findings. The underlying observation it *does* support — the bottom nav has no safe-area/FAB reserve — is recorded separately as `UX-GL-04`.

Severity uses the existing product-wide scale (CRITICAL / HIGH / MEDIUM / LOW / INFO). Finding IDs are `UX-<AREA>-<n>` with areas `GL` global shell · `DB` dashboard · `CM` commitments · `FN` finance · `ST` settings · `AI` Anchor AI/Fabric · `OB` onboarding. **No `UX-*` row is registered in `MASTER-FINDING-REGISTER.md` until its remediation wave opens** — see §6.

## 2. Summary

| Area | Findings | HIGH | MEDIUM | LOW/INFO |
|---|---|---|---|---|
| Global shell & navigation (`GL`) | 6 | 2 | 4 | 0 |
## 3. Findings

### 3.1 Global shell & navigation

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-GL-01 | HIGH | Anchor AI is unreachable when disabled: `/fabric` exists in the router, but the nav entry is conditional, and the disabled page offers no link to the setting that enables it. | `MainLayout.tsx:81`; `FabricView.tsx:45-54`; screenshot `/fabric` (disabled) |
| UX-GL-02 | HIGH | Two independent settings entry points (dashboard header gear + nav item), plus a third naming variant ("System" in the sidebar). | `DashboardView` header; `MainLayout.tsx:84` |
| UX-GL-03 | MEDIUM | Two vocabularies for identical destinations: sidebar `Dashboard/Commitments/Anchor AI/Finance/System` vs mobile `Home/Tasks/Finance/Settings`. "Tasks" also disagrees with the page title "Commitments". | screenshots 04, 06, 08 + sidebar markup |
| UX-GL-04 | MEDIUM | Bottom nav is a flat 4-item bar: no safe-area reserve, no room for a primary create action, no scroll behaviour; enabling Anchor AI crowds a 5th item in with no layout adaptation. | `BottomNavigation.tsx`; screenshots 04/06/08 |
| UX-GL-05 | MEDIUM | Navigation reports no state. A new insight, an unread family notification or a due-today count are invisible from the shell, so the user must open each surface to find out. | `bottomNavigationItems.tsx` |
| UX-GL-06 | LOW | The dev-environment banner consumes the top 32px of every screen; no environment treatment is defined for staging/preview beyond the raw banner. | screenshots 03–09 |

### 3.2 Dashboard

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-DB-01 | HIGH · **bug** | Greeting renders "Good evening,…" — an unresolved display name still emits the comma and ellipsis. | screenshot 03 (`DashboardView`) |
| UX-DB-02 | HIGH · **bug** | Percentage share is computed across NGN **and** USD in one denominator (₦850,000 → "95.5%", $25,478 → "2.9%"). Without an FX base this number is meaningless but is presented as fact. | screenshots 03 (`AssetSplit`/`Portfolio`) |
| UX-DB-03 | HIGH | Portfolio card claims "TOTAL ACROSS 3 ACCOUNTS" but never renders the total; the total exists only on Finance. | screenshot 03 |
| UX-DB-04 | MEDIUM | Portfolio and Asset Split show the same accounts, amounts and percentages — two cards, one payload, double the scroll (only difference: a stacked bar and a collapse chevron). | screenshot 03 |
| UX-DB-05 | MEDIUM | Financial-goal empty state is a dead end: "Set one during onboarding to track it here" with no action, pointing at a flow the user already completed. | screenshot 03; RA-12 fixed surfacing, not this affordance |
| UX-DB-06 | LOW | Subtitle "Life at a glance." carries no information; the header row is crowded with greeting + "Getting Started (3)" pill + gear. | screenshot 03 |

### 3.3 Commitments

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-CM-01 | HIGH | The composer opens on the **classification** step ("Choose Frequency") before the user has said what they are committing to — the inversion of the capture-first model used by Todoist and Apple Reminders (doc 19 §1). | screenshot 05; `components/TaskForm.tsx` |
| UX-CM-02 | HIGH | The composer renders **inline in page flow**, displacing the list it adds to, with no step indicator, no back affordance, no progress and no visible "Create" in step 1 — the user cannot tell how long the flow is or how to leave it. | snapshot 05; `CommitmentsView.tsx` (`{showAdd && <TaskForm …/>}`) |
| UX-CM-03 | HIGH | CTA defect: "New Commitment" becomes "Close" while keeping its `+` icon (the `Plus` element renders unconditionally), and the button occupies the full content width, visually competing with the page title. | screenshot 04 vs 05; `SectionHeader action` binding |
| UX-CM-04 | MEDIUM | Taxonomy muddle: chips mix cadence with type (`ALL/DAILY/WEEKLY/MONTHLY/TODO`), and "Todo" appears as a *frequency* card described as "One-time task". | screenshots 04, 05 |
| UX-CM-05 | MEDIUM | The timeline/list/calendar switcher is three unlabelled icons (clock, list, calendar); the active mode is signalled by colour alone and the medium icon is highlighted by default with no legend. | screenshot 04 |
| UX-CM-06 | MEDIUM | Rows are ~175px tall at 390px width and contain a checkbox, a title and a **stray grey dash** — an unrendered metadata placeholder that reads as a rendering bug, wasting roughly half the vertical budget. | screenshots 04, 05 |
| UX-CM-07 | MEDIUM | Rows expose none of the state benchmark apps treat as core: no cadence, no next-due, no streak, no category, no family attribution. | screenshot 04 |
| UX-CM-08 | MEDIUM | Completing a commitment interrupts with a modal ("Financial Transaction? … record a financial transaction for this now?") that navigates away to Finance, coupling two unrelated tasks at the moment of success. | `CommitmentsView.handleConfirmFinancial` |

### 3.4 Finance

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-FN-01 | HIGH | Two unlabelled "+" affordances with no distinction between *add account* and *record transaction*, and the empty state that instructs "Add your first transaction to get started" has **no button at all**. | screenshot 06 |
| UX-FN-02 | HIGH | Mixed-currency totals are concatenated as a single headline figure — "TOTAL ASSETS ₦850,000.00 \| $40,478.32" — with no per-currency labelling, no FX basis and no drill-down. | screenshot 06 |
| UX-FN-03 | HIGH | Account creation and transaction recording are disconnected: creating an account never invites an opening balance/transaction, and recording a transaction never shows the account's resulting position. This is the "disjointed" report, confirmed. | screenshots 06; `FinanceView` sub-surfaces |
| UX-FN-04 | MEDIUM | Card-stack overlap exposes only a sliver of inactive accounts; the active card is ~60% empty with a lone "Savings" caption; there is no compact comparison view. | screenshot 06 |
| UX-FN-05 | MEDIUM | Subtitle is internal vocabulary ("Multi-account asset management and cashflow tracking"), not user language. | screenshot 06 |
| UX-FN-06 | MEDIUM | Month pager, search field and empty state form an unlabelled cluster; the pager is the only temporal control and gives no signal whether the month is genuinely empty or a filter is hiding results. | screenshot 06 |

### 3.5 Settings

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-ST-01 | HIGH | The chip-tab bar (Profile / Security / Preferences / Alerts / AI) overflows the viewport with the final tab clipped and no overflow affordance. | screenshot 08 |
| UX-ST-02 | HIGH | Settings is a second navigation layer over shell destinations, and its sections are not individually addressable — every "go to Settings" journey from elsewhere in the app loses its target. | screenshot 08; `features/settings/components/SectionNav.tsx` |
| UX-ST-03 | MEDIUM | "USER IDENTIFIER" surfaces the raw internal id (`test-owner`) as primary information, unexplained. | screenshot 08 |
| UX-ST-04 | MEDIUM | Low information density: very tall cards with one field per scroll-length; no save/dirty state, no search, no "recently changed". | screenshot 08 |
| UX-ST-05 | MEDIUM | AI settings live in Settings while the AI surface lives in another feature area; ownership of the feature is split across the IA. | `AnchorAISettings.tsx` vs `/fabric` |

### 3.6 Anchor AI / Fabric

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-AI-01 | HIGH | The assistant is an equal-weight card stack — Onboarding, Today, Mood, Proactive question, Upcoming, Predictions, Insights, Query, Weekly snapshot — in one long scroll; the actual input sits near the bottom, *after* mood and insights. | `FabricView.tsx:56-144` |
| UX-AI-02 | HIGH | The disabled state is a dead end: one sentence, no explanation of what Anchor AI does, no link to the enabling setting, no preview. Roughly 85% of the viewport is empty. | `FabricView.tsx:45-54`; screenshot 07 |
| UX-AI-03 | MEDIUM | No conversation continuity: one free-text submission with one result; no history, no thread, no "ask again", and no visible statement of which data the answer used. | `FabricQuerySection` via `useFabricView` |
| UX-AI-04 | MEDIUM | `FabricMoodCard` (wellbeing check-in) is embedded in the AI tab; mood is not an AI feature, and Tiimo deliberately keeps it adjacent-but-separate (doc 19 §1). | `FabricMoodCard.tsx` |
| UX-AI-05 | MEDIUM | Transparency exists but is unreachable from the assistant — `/fabric/transparency` is routed but appears in no navigation, so provenance is effectively hidden. | `AuthenticatedAppShell.tsx:38` + nav audit |

### 3.7 Onboarding & getting-started

| ID | Sev | Finding | Evidence / owner |
|---|---|---|---|
| UX-OB-01 | HIGH | "Skip" has three different behaviours under one label: step 2 and step 4 call `handleSkip`, which sets `onboardingComplete: true` and **exits onboarding entirely**; step 3's Skip merely advances. | `OnboardingView.tsx:61-66,176,184` |
| UX-OB-02 | HIGH | Adjacent steps persist differently — the goal step writes with `secureDb.addDocument` while the habit step writes through `addTask`; offline behaviour and failure recovery are inconsistent, and neither offers retry beyond a toast. | `OnboardingView.tsx:88-134` |
| UX-OB-03 | HIGH | Pre-filled defaults ('Main Checking', 'Read for 15 mins') are committed verbatim when the user taps through, manufacturing junk data by default. | `OnboardingView.tsx:43,54` |
| UX-OB-04 | MEDIUM | Five screens, one question each, no step names ("Step n of 5" only), no summary and no undo before commit — against the benchmark guidance on capping staged flows (doc 19, NN/g). | `OnboardingView.tsx:28`; `OnboardingProgress` |
| UX-OB-05 | MEDIUM | The getting-started ring is an unlabelled 44px rose-red ring with a permanent 3s glow-pulse animation that silently **disappears at 100%**; it exists only on the dashboard, so a returning user who never opened it loses the "finish these later" promise entirely. | `CompletionRing.tsx`; `BeyondBasicsChecklist.tsx`; screenshot 03 |

## 4. Target experience specification

### 4.1 Navigation: floating bar, single vocabulary, scroll-aware chrome

**Problem being solved:** `UX-GL-01…06` — a flat, silent, duplicate-entry shell with two naming systems and no room for the primary action.

**Target**
1. **One destination vocabulary, everywhere.** Mobile bottom bar, desktop sidebar and page titles must use the same four words. Recommendation: `Home` (merged dashboard+assistant, §4.3), `Commitments`, `Finance`, `Settings`. Retire the "System"/"Tasks"/"Anchor AI" aliases; where a surface needs a distinct name, the *page* names it, not the nav.
2. **Floating pill navigation.** Replace the edge-to-edge bar with a detached floating pill: horizontally inset (16px), bottom offset `max(16px, env(safe-area-inset-bottom))`, `rounded-full`, translucent surface + backdrop blur, 1px hairline border, elevation shadow, 4 items of equal width. Add a **2px active indicator dot/underline** plus icon+label (colour alone never encodes state — fixes the same defect class as `UX-CM-05`). Minimum target 44×44px per the accessibility contract in `docs/DESIGN_SYSTEM.md`.
3. **Primary create action.** A separate circular floating action button sits above the pill on the trailing edge, with a **contextual label** per surface (`New commitment` on Home/Commitments, `Record transaction` on Finance). This removes the page-sized CTA of `UX-CM-03` and consolidates the two "+" affordances of `UX-FN-01` into one discoverable control whose meaning is always stated. It expands to an action sheet (existing `ActionSheet` primitive) — never a bare "+".
4. **Scroll-driven chrome (intentional pattern, applied selectively).** Auto-hide is opt-in per surface, not global:
   - Hides only when scrolling **down** past 96px, reveals on any upward scroll or 300ms after scroll stops.
   - Never hides while a sheet/modal is open, while an input is focused, or when the list is shorter than the viewport.
   - Motion: translate + fade, 220ms, `ease-out`; **no transform** when `prefers-reduced-motion: reduce` (fade only).
   - The navbar never hides on Home's first viewport (identity + summary must stay anchored).
5. **Nav state signalling (`UX-GL-05`).** The pill exposes at most one low-noise badge: a dot on `Home` when the assistant has an unread proactive insight. No numeric badges on nav.
6. **Anchor AI reachability (`UX-GL-01`).** With the merge in §4.3 there is no separate AI destination to reach — but the assistant must remain addressable at `/assistant` for deep links and the disabled state must render value + a working CTA instead of a dead sentence.

**Testability:** nav is already covered by `BottomNavigation.test.tsx` / `bottomNavigationItems.test.ts`; the floating variant must extend those suites (labels from one source module, hide/show logic unit-tested with a scroll-threshold harness) rather than introduce a parallel item list.

### 4.2 Settings: one hub, addressable sections, no duplicate entry point

**Problem being solved:** `UX-ST-01…05` plus the user's explicit report of "two settings".

**Target**
1. **Delete the dashboard gear (`UX-GL-02`).** Settings is reachable from exactly one place. Any contextual "manage X" need from the dashboard must deep-link into the relevant Settings *section*, never to the Settings root.
2. **Addressable sections.** `/settings/:section` with real URLs for `profile`, `security`, `notifications`, `preferences`, `assistant`, `data`, `about`. Section state must survive reload, back/forward and deep links (fixes `UX-ST-02`). Each section is a stable id in one exported registry, reused by the hub, the router and any deep-linking call site — single source of truth.
3. **Replace the overflowing chip bar (`UX-ST-01`)** with a searchable, grouped index:
   - Root screen: a grouped list (Profile / Account & security / Notifications / Preferences / Assistant / Data & privacy / About) with one-line descriptions and a search field filtering by label and synonyms.
   - Section screens: a normal push transition with a titled header and a back affordance; no horizontal scrolling anywhere.
   - No chips, no tabs, no second-level nav competing with the shell.
4. **Modern-form behaviour (`UX-ST-04`):** inline validation, explicit save with a visible dirty state, success confirmation that does not require scrolling, and destructive actions moved behind a confirm sheet with typed confirmation for irreversible ones.
5. **De-jargon the identity block (`UX-ST-03`):** show the user's email/display name; move the raw id into "About → technical details", copyable, with an explanation of why a support agent may ask for it.
6. **Assistant ownership (`UX-ST-05`):** all assistant settings (`AnchorAISettings`, knowledge panel) move into the `assistant` section, which is the *only* place the feature's behaviour, data sources and transparency are configured — mirroring the AI surface's own transparency link (`UX-AI-05`).

**Non-goal:** no settings migration or schema change. This is IA + presentation plus deep-link routing.

### 4.3 Dashboard × Anchor AI: merge into one Home surface

**Problem being solved:** `UX-DB-01…06`, `UX-AI-01…05`, and the user's question about what the assistant should surface.

**Recommendation — merge, with the assistant as a *layer* of Home, not a peer destination.** Rationale from the code: both surfaces already consume the *same* inputs (`briefing.todayStats`, `upcoming` recurring obligations, predictions, insights, the active goal, accounts), and the dashboard's most-needed missing object is exactly what the assistant computes (what changed, what is next, what to do). Keeping them apart forces the user to visit two screens to answer one question — and produces the duplicate Portfolio/Asset Split payload (`UX-DB-04`) on one side and the orphaned card stack (`UX-AI-01`) on the other.

**Home information hierarchy (top → bottom)**

| Slot | Content | Rule |
|---|---|---|
| 0. Identity + day | "Good morning, {name}" (name must resolve), date, one-line state ("2 commitments left today") | Fixes `UX-DB-01`; subtitle must carry information (`UX-DB-06`) |
| 1. Next up | The next 3 due commitments/today's remaining items, one tap to complete | The primary object of the screen — benchmark P3/P5 |
| 2. On track | **One** money/behaviour status block: per-currency totals (correctly labelled) + progress against the active goal, with a CTA when no goal exists | Replaces Portfolio **and** Asset Split (`UX-DB-03`, `UX-DB-04`, `UX-DB-05`) |
| 3. Ask Anchor | Persistent input ("Ask Anchor…") + prompt chips, directly under "On track" | Makes the assistant primary instead of buried (`UX-AI-01`); full thread at `/assistant` |
| 4. Insight(s) | **At most 3** insight cards, ranked, each with provenance + one action | Replaces the equal-weight stack; fixes `UX-AI-03`, `UX-AI-05` |
| 5. Reflect | Mood check-in as a routine card (bottom-of-Home or its own place), never inside the assistant | Fixes `UX-AI-04`; matches Tiimo (doc 19 §1) |
| 6. Getting started | Labelled progress card until complete/dismissed | Fixes `UX-OB-05` |

**What Anchor AI must surface (and what it must not)**

Ranked priority — the assistant may show only the highest-priority class available, plus at most two others behind "See all":
1. **Obligation risk** — recurring bill due within 7 days, or a commitment that was missed yesterday (`briefing.upcoming`, missed-minute data).
2. **Money-moving anomaly** — unusual spend vs the user's own pattern, budget drift, an account whose balance moved unexpectedly (`predictions`).
3. **Consistency** — streak at risk, week-over-week completion change (currently only inside the weekly report).
4. **Reflective** — weekly snapshot, monthly review (`weeklyReport`, `MonthlyReviewModal`).

Rules: every insight states **what was noticed, over which window, from which data, and one action** ("Record it", "Adjust plan", "Dismiss"); provenance always deep-links to transparency (`/fabric/transparency`, `UX-AI-05`); no insight is shown without an action; the free-text answer must cite the same window/scope. **Must not** surface: raw internal ids, cross-currency arithmetic presented as a share (`UX-DB-02`), or any inference from a source the user has switched off in the assistant knowledge settings.

**Naming & routing:** nav says `Home`; the assistant is invoked as **"Ask Anchor"** inside Home; the full thread keeps an addressable route (`/assistant`, alias of the existing `/fabric` view during transition) so deep links and the transparency page keep working. `Fabric*` component names may remain internally; the user-facing vocabulary changes.

### 4.4 Commitment creation: capture-first composer

**Problem being solved:** `UX-CM-01…03,08`.

**Target flow — one sheet, one required field**

1. Entry from the contextual FAB ("New commitment") or the empty state. No page-sized toggle button (`UX-CM-03`).
2. **Modal bottom sheet** using the existing `ActionSheet` pattern (drag handle, backdrop blur, focus trap, Esc/backdrop close). Autofocus **Title**. The sheet never displaces the list (`UX-CM-02`).
3. Visible fields: **Title** (required) and a row of **cadence chips — One-time · Daily · Weekly · Monthly · Custom — with none selected by default.** Selecting a cadence reveals only that cadence's controls inline (weekly → weekday multi-select; monthly → day-of-month; custom → interval). Save is enabled the moment the title is non-empty.
4. **Optional natural-language assist:** typing "Pay rent on the 1st" may surface a single dismissible suggestion chip ("Monthly · 1st — apply?"). It never silently rewrites input and never blocks save.
5. **"More options" accordion** (progressive disclosure, doc 19 P2/P7): time of day, category, reminder, linked amount, notes, family visibility, and the existing `<`/`>` title guard. All fields *used together* stay in this one sheet — no wizard.
6. **Save behaviour:** optimistic insert, success toast with **Undo**, sheet dismisses immediately.
7. **No cross-domain prompt at save time.** The "record a transaction?" nudge (`UX-CM-08`) becomes a dismissible inline chip on the completed commitment row, so success is never interrupted by an unrelated decision.
8. **Vocabulary:** the UI must stop calling `todo` a *frequency*. `type: 'todo'` may remain in the data model; the user-facing label is "One-time" (`UX-CM-04`).

**Compatibility:** keep the `TaskForm` props (`onAdd`, `onClose`, `hasFamilyActive`) and the `addTask` payload shape so `CommitmentsView` and its test suite change minimally; the sheet replaces the container, not the contract.

### 4.5 Commitments list: saved views, informative rows

**Problem being solved:** `UX-CM-04…07`.

1. **Primary control becomes saved views:** `Today · Upcoming · All`. Cadence (`One-time/Daily/Weekly/Monthly/Custom`) moves into a **filter sheet** where it is multi-select, which removes the type-vs-cadence muddle in the primary position.
2. **View switcher gets labels** (`List · Timeline · Calendar`) with icons, one visible active state beyond colour, and `aria-pressed`. Timeline is presented as a first-class view, not a mystery icon (benchmark P3).
3. **Rows carry real state** at 64–72px height: checkbox, title, cadence chip, next-due (relative), streak/consistency indicator, category or family-owner avatar. The stray grey dash (`UX-CM-06`) is removed — metadata renders or is absent, never a placeholder artefact.
4. **Post-completion:** the row animates into Completed; the finance nudge appears as an inline opt-in chip on the row (see §4.4.7), so nothing interrupts the moment of success.
5. **Empty states are actionable:** distinct copy per active view/filter, a primary CTA, a "clear filters" affordance when a filter is hiding results, and up to three one-tap starter commitments.

### 4.6 Finance: one entry point, connected account→transaction journey

**Problem being solved:** `UX-FN-01…06` — the user's "disjointed" report.

1. **One contextual FAB** ("Record transaction") that expands to an action sheet: `Record transaction` / `Add account` / (later) `Transfer`. This ends the two unlabelled "+" affordances (`UX-FN-01`) and the ambiguous empty state.
2. **Records are per-currency, always labelled.** Group totals by currency with explicit labels and account counts; **never** concatenate unrelated currencies into one headline (`UX-FN-02`). Cross-currency consolidation requires an explicit FX rate source and is **out of scope** until that provider decision is made (§7) — the UI must not imply a conversion it cannot perform.
3. **Account creation is a short, connected journey:** name → currency → type → opening balance → *optional* "record the opening transaction" → a success state with a single primary CTA ("Record first transaction"). This directly fixes the disconnection in `UX-FN-03`.
4. **Transaction recording is 3 fields + optional extras:** amount, account, category (recent categories first), then optional note/date. On save, show the resulting account balance change inline so cause and effect are visible (`UX-FN-03`).
5. **Account list stops hiding itself:** compact comparable rows (name, type, currency, balance) with the hero card used for the single selected account — no overlapping stack that conceals the others (`UX-FN-04`).
6. **Temporal control is labelled and explainable:** "September 2026" with prev/next; when the list is empty, state *why* (no transactions this month vs filters/none recorded) and offer the one-tap fix (`UX-FN-06`).
7. **Copy:** replace "Multi-account asset management and cashflow tracking" with plain language (`UX-FN-05`).

### 4.7 Onboarding & getting-started: fewer steps, honest skips, visible follow-up

**Problem being solved:** `UX-OB-01…05`, plus the user's report about the "will do later" circle.

1. **Skip semantics are fixed and distinct:** "Skip this step" advances one step; "Finish later" persists progress and exits, and the app **resumes** at the unfinished step. One label, one behaviour (`UX-OB-01`).
2. **Cap the flow at three screens:** Welcome + name → **first commitment** (capture-first, reusing §4.4's composer) → optional "add a goal or an account". Security is no longer a mandatory wizard step; it becomes a *tracked* getting-started item with a visible state, and its CTA is a real deep link into `Settings → security` instead of a toast promise.
3. **No pre-filled junk data:** suggested names move from *values* to *placeholders* and required-by-choice chips, so nothing is created unless chosen (`UX-OB-03`).
4. **Review before commit:** a compact summary with edit affordances for whatever the user just entered (`UX-OB-04`), and one consistent persistence path for every step's write (fixing the `secureDb` vs `addTask` inconsistency in `UX-OB-02`).
5. **Getting-started follow-up becomes visible and persistent (`UX-OB-05`).** Replace the silent disappearing ring with a **labelled Home card** — "Getting started · 3 of 7 · Finish later" — that stays as a compact row until completed or explicitly dismissed. "Beyond the Basics" remains the single home of deferred items, reachable from that card *and* from `Settings → about`. Deferred work is never deleted from the user's view without consent.
6. **Motion and accessibility:** remove the permanent glow-pulse (respect `prefers-reduced-motion`; the current 3s infinite animation runs regardless), and give every progress affordance a text label and accessible name.

## 5. Quality bar, constraints and non-goals

**Quality bar every wave must clear**
- One primary action per screen; every empty state offers the action it describes.
- No information duplicated between two cards or two screens; no duplication across nav entry points.
- Every interactive control ≥44×44px with an accessible name; state never encoded by colour alone.
- Motion is purposeful and reduced-motion-safe; no permanently looping animation on a passive affordance.
- Numbers are labelled with their currency/scope; no arithmetic across mixed units is presented as a share.
- Copy uses user language; internal identifiers and engineering vocabulary are not primary content.
- Every new/changed surface ships with tests in the existing suites (component + interaction), reusing the current testids conventions; UI changes must not reduce coverage.

**Constraints**
- `docs/DESIGN_SYSTEM.md` remains the token/typography/button contract; no new design tokens are invented by this plan, and new primitives are only added where an existing one (`ActionSheet`, `DatePickerSheet`, `TimePickerSheet`, `Button`, `Card`) cannot be extended.
- **No data-model, Firestore-rules, or Cloud Functions changes are required by any wave in this plan.** If a wave discovers it needs one, it must stop and be re-scoped as a separate, governed change.
- Client-only work stays deployable through the existing staging pipeline; nothing here touches the FS-01/FS-04 migration or production.

**Explicit non-goals**
- No FX conversion engine, no currency-rate provider integration (`UX-FN-02` ships as correct labelling only).
- No offline/sync redesign; existing offline queue behaviour is untouched.
- No push/notification behaviour changes (that is the SN-* program).
- No marketing-site or legal-page changes.
- Not a visual "reskin": this is interaction and information architecture first; styling follows the existing design system.

## 6. Phased delivery plan (one PR per surface, governance-compliant)

Each wave is a separate branch/PR with the full 7-section governance body (Risk Class, Linked Initiative Issue, Success Metric, Guardrail Metrics, Rollout Plan, Rollback Plan, Observability, Test-to-Risk Mapping) and ships to staging before the next wave starts. Do **not** bundle waves.

| Wave | Scope | Findings | Depends on |
|---|---|---|---|
| **W0** | Bug fixes only, no redesign: greeting name resolution; portfolio/asset-split cross-currency arithmetic (remove or make currency-honest); dead-end copy fixes | `UX-DB-01`, `UX-DB-02`, `UX-DB-06` | nothing |
| **W1** | Commitments: capture-first composer sheet, labelled views, informative rows, no cross-domain interruption | `UX-CM-01…08` | nothing — highest user impact, isolated |
| **W2** | Home: merge dashboard + assistant into the §4.3 hierarchy (including one "On track" block, "Ask Anchor", ranked insights, mood relocated) | `UX-DB-03…05`, `UX-AI-01…05` | W0 |
| **W3** | Shell: floating pill nav, single vocabulary, contextual FAB, opt-in scroll-hide, nav state signal | `UX-GL-01…06` | W2 (final vocabulary) |
| **W4** | Settings hub: single entry point, addressable sections, search, modern form behaviour | `UX-ST-01…05` | W3 |
| **W5** | Finance: one entry point, connected account→transaction journey, per-currency honesty, explainable empty states | `UX-FN-01…06` | W3 |
| **W6** | Onboarding & getting-started: 3-step flow, honest skip semantics, no junk defaults, visible persistent follow-up card | `UX-OB-01…05` | W1 (reuses composer), W4 (deep links) |

**Success metrics (measured per wave, existing telemetry `logProductEvent`)**
- W1: median interactions and wall-clock time from commitment-list open → commitment created (target ≤ 2 inputs, ≤ 8s); composer abandonment; share of created commitments that carry a cadence.
- W2: share of sessions where the assistant is invoked from Home; number of scroll-lengths on Home; self-reported "on track" comprehension (needs a user test — not inferable from telemetry).
- W3: nav dead-ends (taps on disabled/orphaned destinations) → 0; taps-to-destination after nav change.
- W5: share of account-creation sessions that record a follow-up transaction within the same session.
- W6: onboarding completion rate; share of users with unresolved getting-started items who revisit them (must be > 0 — currently impossible because the ring disappears).

**Guardrails:** no reduction in existing test counts; `npm audit` stays 0; client suite and CI-infra suites stay green at every merge; staging smoke (`Release Smoke`) green before the next wave.

## 7. Decisions required before implementation

These are product decisions, not engineering ones. Each blocks a wave; the waves listed as "not blocked" can start immediately.

| # | Decision | Recommendation | Blocks |
|---|---|---|---|
| D1 | Merge Dashboard and Anchor AI into one `Home` surface, with the assistant as a layer invoked as "Ask Anchor"? | **Yes** — the evidence in §4.3 shows both surfaces consume identical inputs and currently duplicate/compete | W2, W3 |
| D2 | Replace the flat bottom bar with a floating pill nav + contextual FAB, and apply scroll-hide only on Commitments/Finance/Settings/assistant-thread (never on Home's first viewport)? | **Yes** | W3 |
| D3 | The user-facing noun: "commitment" or "task"? Today the page says Commitments, the nav says Tasks. | **"Commitment"** everywhere (matches the page, the PRD language and the family-sharing copy) | W3, W6 |
| D4 | Settings consolidation: retire the dashboard gear, retire the sidebar name "System", make Settings reachable only from the nav with addressable sections? | **Yes** | W4 |
| D5 | Currency policy: ship per-currency, correctly-labelled totals **without** conversion (no FX provider)? | **Yes — no conversion in this program**; pick an FX source as a separate initiative if needed | W0, W5 |
| D6 | Onboarding rewrite: 3 screens (name → first commitment → optional goal/account), security demoted to a tracked getting-started item? | **Yes** | W6 |
| D7 | Are non-manual capture paths (PWA share target / quick-add / email-to-commitment, standard in Apple Reminders and Todoist) in scope for this program or logged as a separate initiative? | **Separate initiative** — log it, do not bundle | nothing (roadmap) |
| D8 | Confirm the wave order (W0 → W1 → W2 → W3 → W4 → W5 → W6) and whether any two waves may run in parallel. | Serial by default; W5 (Finance) and W6 (Onboarding) are candidates for parallel work after W3 | entire program |

## 8. What is *not* claimed by this document

- No usability test with real participants was run. Findings are expert review against measured interface behaviour plus source inspection; the benchmark comparison in doc 19 is source-document based.
- Findings are **not** registered in `MASTER-FINDING-REGISTER.md` yet — they are registered when their wave opens, so the register continues to describe only work that is actually in remediation (see §1).
- Screenshots referenced as "screenshot 03/04/…" are ephemeral local capture artefacts, not committed binary assets; §1 contains the exact reproduction recipe. If the audit needs permanent visual evidence, that is a separate decision (visual-regression tooling is deliberately not introduced here).
- Nothing in this plan is implemented. W0/W1 are ready to start on approval of D3 (naming) and D5 (currency); W2+ are blocked on D1/D2.






| Dashboard (`DB`) | 6 | 3 | 2 | 1 |
| Commitments (`CM`) | 8 | 3 | 5 | 0 |
| Finance (`FN`) | 6 | 3 | 3 | 0 |
| Settings (`ST`) | 5 | 2 | 3 | 0 |
| Anchor AI / Fabric (`AI`) | 5 | 2 | 3 | 0 |
| Onboarding & getting-started (`OB`) | 5 | 3 | 2 | 0 |
| **Total** | **41** | **18** | **22** | **1** |

No CRITICAL UI defect was found: nothing here corrupts data or leaks data across users. Two findings are *correctness* defects surfaced through the UI and are the only ones that should be treated as bugs rather than design debt — `UX-DB-01` (greeting renders "…") and `UX-DB-02` (percentages computed across mixed currencies). They should be fixed independently of the redesign.

> **Round 2 supersedes parts of this document.** [`20-UX-DEEP-PASS-HEURISTIC-AND-INTEGRATION-AUDIT.md`](20-UX-DEEP-PASS-HEURISTIC-AND-INTEGRATION-AUDIT.md) extends this audit with 23 further findings from 37 instrumented screens (including Anchor AI **enabled** and all five onboarding steps, neither of which round 1 observed), adds a heuristic evaluation against NN/g's 10 heuristics, and **corrects** two round-1 claims: `UX-DB-01` is a first-paint loading artefact rather than a permanent bug, and `UX-ST-01/02` understated the settings problem (ten sections in one scroll, behind nine anchor chips). Round-2 also adds two **functional** defects in Finance that round 1 missed entirely (`UX-FN-07`, `UX-FN-08`) and one in onboarding (`UX-OB-06`). Read doc 20 §6 before acting on anything here.
