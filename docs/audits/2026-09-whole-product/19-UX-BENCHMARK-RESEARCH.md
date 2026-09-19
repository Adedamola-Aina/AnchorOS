# 19 — UX Benchmark Research: Commitment Capture & Assistant Surfaces

Date: 2026-09-18 · Companion to [`18-UX-AUDIT-AND-REDESIGN-PLAN.md`](18-UX-AUDIT-AND-REDESIGN-PLAN.md)

Scope: how best-in-class planning apps let a user **create a commitment**, **see what is next**, and **stay consistent** — used to define the target interaction model for Commitments, Dashboard/Anchor AI, Finance and Settings.

## Retrieval honesty (confidence column)

Every claim below is tagged with how it was obtained. Do not treat `JS-GATED` rows as verbatim product documentation — they are inferred from page titles, navigation indexes and our own product knowledge, and must be re-verified against the live app before being cited as a hard requirement.

| Source | What we read | Retrieval |
|---|---|---|
| Todoist — *How to Use Todoist Effectively* | Full article body | `RETRIEVED-VERBATIM` |
| Tiimo — marketing/feature site | Full page body | `RETRIEVED-VERBATIM` |
| NN/g — *Progressive Disclosure* (Nielsen, 2006) | Full article body | `RETRIEVED-VERBATIM` |
| Apple Reminders User Guide (macOS) — contents | Section index only (body JS-rendered) | `JS-GATED` |
| Todoist Help Center — *Reminders & Notifications* index | Index only | `JS-GATED` |
| Material 3 — Bottom sheets | JS-rendered; nothing extracted | `UNRETRIEVED` |

Sources: [Todoist guide](https://www.todoist.com/inspiration/how-to-use-todoist-effectively) · [Tiimo](https://www.tiimoapp.com/) · [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) · [Apple Reminders guide](https://support.apple.com/guide/reminders/create-and-format-lists-remnd8e2c8e1/mac) · [Todoist natural-language dates](https://www.todoist.com/help/articles/use-natural-language-dates-46bhrrqCZxuQRu8QWJmmPo)

## 1. What each product actually does

### Todoist — capture first, classify later (`RETRIEVED-VERBATIM`)

- Adding a task is **`+` → type the name → Add task**. The guide instructs: "type out the task name and press Add task to save it" — the name is the only required field, and the recommended habit is adding a task "in seconds".
- Structure is attached **after or inline**, never before: recurring due dates, sub-tasks, priorities, reminders, projects, labels, sections, filters.
- Organisation is expressed as **views over the same data** — Inbox, Today, Upcoming, calendar/board/list layouts — not separate destination pages.
- Motivation is an **accumulate-over-time signal** (Karma) plus a Productivity review view.
- Theme: "get things out of your head … on whichever device is closest" — capture works from anywhere, including browser extension and email forwarding.

**So what for AnchorOS:** our composer opens on "Choose Frequency" — classification before capture. That is the exact inversion of the market leader's model. Frequency is an *attribute*, not a *destination*.


### Tiimo — make time visible, make progress feel good (`RETRIEVED-VERBATIM`)

- Core model: a **visual timeline** ("Structure you can see — turn your schedule into a visual timeline you can actually follow"), not a list with a hidden calendar toggle.
- **Focus timer**: "Make time visible. Stay anchored in tasks and manage transitions without losing momentum" — aimed at *starting* and *switching*, not just recording.
- **Streaks with trophies/rewards**: "Build consistency and celebrate progress".
- **AI planning**: "Turn thoughts into action … breaks things down, estimates how long each step might take, and organizes everything into a plan that works for your day"; users "type or speak" a brain-dump and get steps + priorities.
- **Surfacing without opening the app**: widgets and Live Activities — "See what's next at a glance … no app opening required."
- **Wellbeing/mood check-ins** sit beside planning ("track your mood, reflect daily, adjust your routine") — an adjacent *routine* feature, not inside the AI assistant.
- Design claims: "reduce friction", "No clutter, no pressure", "personalizing your planner builds motivation and makes it easier to keep coming back"; iPhone App of the Year 2025.

**So what for AnchorOS:** (a) our Timeline view exists but is hidden behind an **unlabelled 3-icon toggle** — Tiimo's entire value proposition is that timeline visibility is the default; (b) we have no focus/timer affordance tied to a commitment (the codebase even toasts *"Focus mode coming soon!"*); (c) Tiimo keeps mood **outside** the AI surface, which supports moving our `FabricMoodCard` out of the assistant tab.

### Apple Reminders — structure is optional and progressive (`JS-GATED`, TOC verbatim)

Documented capability areas: lists and **column views**, **Smart Lists**, pinned lists, **subtasks**, "add a reminder from another app", **list templates**, tags, dates **or locations**, assigning/sharing reminders, **sections**, grocery-list auto-categorisation, default list, widgets, notifications.

- Notably absent: any requirement to pick a *frequency* before entering text. Recurrence is a property you set if you want it.
- "Add a reminder from another app" + widgets = **capture and consumption happen outside the app shell**.

**So what for AnchorOS:** our manual-only capture is a limitation; share-target/quick-add is a roadmap candidate. Sections/smart-lists validate that **filters should be saved views, not modal filters** (Today / Upcoming / Overdue / Done), which also disambiguates today's ALL/DAILY/WEEKLY/MONTHLY/TODO chips.

### NN/g — progressive disclosure and staged disclosure (`RETRIEVED-VERBATIM`)

- "Initially, show users only a few of the most important options. Offer a larger set of specialized options upon request."
- Deferring rare options **increases learnability and reduces error** — our create flow front-loads the rarest decision (frequency) and defers the essential one (what are you committing to?).
- **Staged-disclosure warning (directly relevant):** "The more features you can defer, the simpler your design, but if you divide the task into too many steps, users get bogged down by excess navigation." Their worked example: a naive 1-screen vs 5-screen choice was wrong — **a 2-screen compromise beat both**.
- Options *used together* must stay on **one screen**; options from a *different phase* belong on a later screen.

**So what for AnchorOS:** target is **one composer sheet** (all fields used together) with a collapsed "More options" region (deferred), and **at most two stages** for anything genuinely staged. Our 5-question onboarding wizard and multi-step create wizard both violate the "too many steps" caution.

## 2. Synthesised design principles to adopt

| # | Principle | Concrete consequence in AnchorOS |
|---|---|---|
| P1 | **Capture first, classify later** | Composer opens with Title focused; cadence/type are inline chips, not a gate. |
| P2 | **One sheet, progressive disclosure** | Single modal sheet; "More options" holds time-of-day, category, amount, reminder, family visibility. No wizard for a commitment. |
| P3 | **Time made visible** | "Next up" is the dashboard's primary object; timeline is a labelled, first-class view, not a mystery icon. |
| P4 | **Consistency you can feel** | Streak/completion signal on each commitment row plus a weekly consistency summary; never a bare dash. |
| P5 | **Surface without opening the app** | Dashboard answers *"what do I do now / am I on track"* in one glance; assistant answers *"what changed / what should I do"* in one card. |
| P6 | **Views over destinations** | Today / Upcoming / All are saved views of commitments, not separate pages or modal filters. |
| P7 | **Defer, but don't fragment** | Maximum two stages anywhere; advanced options collapse in place instead of becoming step 2 of 4. |

## 3. Anti-patterns we are currently shipping (evidence in doc 18)

1. Classification-before-capture ("Choose Frequency" as step 1 of the create flow).
2. A primary action rendered as a page-sized button that swaps its label to "Close" while keeping a `+` icon.
3. Duplicated information blocks (Portfolio + Asset Split) and duplicated entry points (dashboard gear + Settings tab).
4. Cross-currency arithmetic presented as a meaningful percentage share.
5. Empty states that instruct the user to do something they cannot do from that screen ("Set one during onboarding", "Add your first transaction" with no button).
6. Dead-end disabled states ("Enable it in Settings" with no link, no explanation of value).
7. Progress deliberately hidden: a glowing ring with no label that silently disappears at 100%, and a "Skip" that exits the whole flow instead of the step.

## 4. Open research items (not answerable from public sources)

- Real-device delivery of push (UH-SN04/05) — needs physical devices; unchanged from the §17 register.
- Mono webhook signature behaviour in the wild (V7) and production App Check config (V10) — provider metrics; unchanged.
- Whether a **share-target / quick-add** capture path is in scope for v1 of the redesign (Apple and Todoist both have it; we do not). Product decision, tracked in doc 18 §7.
- Quantitative app-store review mining (Tiimo/Todoist 1-star themes) was **not** performed — this document is source-doc and product-teardown based, not review-mining based. Treat corresponding statements as directional, not measured.
- Material 3 bottom-sheet guidance could not be retrieved (JS-gated); our own sheet conventions in [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) and the existing `ActionSheet` / `DatePickerSheet` / `TimePickerSheet` primitives are the implementation contract instead.

