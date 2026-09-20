# 23 — Commitments 2.0, Fabric AI ambition, and the wave plan

Date: 2026-09-19 · Companion to docs 18–22 (18 = round-1 audit + target spec, 19 = benchmark research, 20 = round-2 deep pass, 21 = reference library + Wallet spec, 22 = remediation ledger).

Purpose: answer three questions with evidence, then turn the answers into an ordered, tracked plan:
1. What should **Commitments** become **that is true to AnchorOS** — and what should it deliberately *not* become?
2. What should **Anchor AI / Fabric** become, and what does "mind-blowing" mean without lying?
3. **In what order and in which waves** do we build all of it?

Method: source inspection — `src/types/index.ts` (`AnchorTask`), the commitments feature (`CommitmentsView`, `TaskItem`, `TaskForm`, `EditTaskForm`, `MonthCalendarView`, `WeeklyView`, `TimelineView`, `SwipeableTaskItem`), the reminder path (`useTaskReminders`), the schedule model (`commitmentSchedule.ts`), and the intelligence layer (`DailyBriefingEngine`, `InsightsEngine`, `insights/*`, `WeeklyReportEngine`, `MonthlyReviewEngine`, `ProactiveQuestionEngine`, `QueryEngine`, prediction engines). Benchmark capability sets are from the products' documented behaviour (doc 19's method note applies: source-document based, not hands-on).

## How to read this document

Every row carries a **state**:

| State | Meaning |
|---|---|
| **CHOSEN** | Recommended and aligned with AnchorOS; build it. |
| **PROPOSED** | I recommend it, but it changes product scope — **needs your yes**. |
| **NOT DOING** | Deliberately excluded, with the reason. Revisit only if the reason stops being true. |

Sizes: **S** ≈ one PR, **M** ≈ one wave, **L** ≈ a wave with real regression risk.

**The AnchorOS filter** used for every recommendation below (this is the whole point of the list):

- AnchorOS is **not** a project-management tool. It is a **family + personal life OS**: keep promises to yourself and your family, see your money honestly, and be told the truth about both.
- Therefore Commitments earns features that serve **consistency, clarity and accountability over time** — cadence truth, carry-over honesty, streaks, family visibility, money linkage.
- It does **not** earn features that exist to manage large multi-person work portfolios — projects, Kanban boards, sprints, dependencies, comments, file attachments.
- Non-negotiables you set: **ease of use** (capture in seconds), **beautiful UI/UX**, **no compromise** — which in practice means *fewer features done excellently*, not a checkbox list.

## Part A — Commitments 2.0 (AnchorOS-aligned)

### A1. CHOSEN — cadence truth & honesty (these make the product *true*)

| ID | What we build | Why this aligns with AnchorOS | Size |
|---|---|---|---|
| **CM-18** | Fix the day-letter collision: `T` = Tue **and** Thu, `S` = Sat **and** Sun. Store real weekday indexes (0–6) with a migration from the existing letters. | A commitment that fires on the wrong day is worse than no commitment: it trains the user to distrust the app. Found while writing P1b tests. | M |
| **CM-17** | Real schedule model: exact **date + time**, intervals ("every 2 weeks"), and an **end date**. Keep the existing daily/weekly/monthly as presets. | "Pay rent on the 1st at 9am, until December" is a promise, and promises have dates. Today `reminderTime` is a bare HH:mm with no date. | M |
| **CM-21** | Smart views powered by the new schedule model: **Today**, **Overdue / carried over**, **This week**, **Later**, **Done**. | The habit lens is "what do I owe right now?" — not "browse my backlog". We already compute this correctly; it isn't surfaced. | M |
| **CM-06/07** | Rebuild the row: kill the ~175px height and the **stray grey dash**; show cadence, next due, streak and category in a 64–72px row. | The row is where the product's honesty is read every day; mine now has the data to fill it. | M |
| **CM-25** | "Done" history: completed commitments are visible by period, not erased. | Progress you can't see isn't motivation. Also the source for streaks. | S |

### A2. CHOSEN — capture & ease of use (the "no compromise" part)

| ID | What we build | Why this aligns | Size |
|---|---|---|---|
| **CM-01/02/09/10** | The capture-first composer: **one sheet**, title first, cadence as chips, "Category" not "Domain", explicit reminder time, sticky **Save**, a single dismiss. | Capture speed is the #1 comfort metric in every benchmark. Classification before capture is the current defect. | M |
| **CM-16** | **Instant add**: one input at the top of Commitments — type "Pay rent Fri 9am" or "Read 15m daily" → parsed into a draft you can save or adjust. | This is what makes it feel like Reminders/Todoist without giving up our cadence model. | M |
| **OB-03** | Stop pre-filling junk defaults ("Main Checking", "Read for 15 mins") that get committed verbatim. | Onboarding must not create fake promises in a promise-keeping app. | S |
| **DS-01** | Functional emoji → Lucide (priority, selection). Streak-milestone emoji stay as expressive copy, documented in `DESIGN_SYSTEM.md`. | `DESIGN_SYSTEM.md` already says Lucide exclusively; the inconsistency is what makes it look unfinished. | S |

### A3. CHOSEN — find anything, and don't lose work

| ID | What we build | Why this aligns | Size |
|---|---|---|---|
| **CM-15** | Search across commitments (title, notes, domain) with recent + smart filters. | Once "Done" history exists, finding a promise made months ago must not require scrolling. Every benchmark has it. | S |
| **CM-23** | **Undo** after completing/deleting, plus multi-select for bulk complete/move. | Completing a commitment is emotionally loaded; undo is the difference between experimenting and fearing the tap. | S |

### A4. PROPOSED — I recommend these, but they change scope, so you decide

| ID | What we build | Why it aligns with AnchorOS | Size |
|---|---|---|---|
| **CM-27** | **Bill ↔ recurring transaction linkage**: a bill-type commitment links to a recurring transaction, and completing it reconciles the ledger. Replaces today's interrupting "Financial Transaction?" modal (`CM-08`) with a one-time link and a quiet inline chip. | AnchorOS's **unique** move — nobody else ties a promise to your money. The clearest expression of "habits + money in one place". | M |
| **CM-24** | **Family assignment**: assign a commitment to a family member; a family view shows who owes what; family streaks. | The product is family-first; "keep promises to your family" is its strongest emotional claim. Touches shared data + rules → bigger and needs care. | L |
| **CM-12** | **One level of sub-steps** ("Pack for the trip" → 4 steps). | Aligns *as steps inside one promise*, not project decomposition. One level only, deliberately. | M |
| **CM-26** | **Per-commitment insight**: "you complete this 4 of 5 Mondays; your strongest day is Tuesday", plus carry-over rate. | Turns a streak number into understanding, and gives Fabric per-habit truth. | M |
| **CM-13** | **Life-domains as a curated set** (Health, Family, Home, Work, Faith, Money, Learning) replacing free-text `domain`. | Makes filtering and AI grouping real instead of typo-dependent. A curated list — **not** an open label system. | S |
| **CM-28** | **Gentle nudge policy**: one daily digest instead of N alerts, plus quiet hours; exact-time reminders stay where needed. | "No guilt, no noise" is positioning. Notification spam is the fastest way to make a habit app resented. | S |
| **CM-19** | **"Next up" strip** on Today: one calm line, what's next and when. | Cheap, useful, calm. Explicitly *not* a timeline. | S |
| **CM-22** | Manual ordering (drag) within a view. | Expected by benchmark users; less critical once smart views exist. | S |
| **AI-17** | Tone/density control (Quiet mode: fewer, calmer insights; no-guilt copy review). | Serves "no guilt" and keeps the assistant welcome. | S |

### A5. NOT DOING — and why (so we stop re-litigating them)

| Not doing | Reason |
|---|---|
| Projects / workspaces / lists (`CM-14`) | One list + smart views + life-domains *is* the AnchorOS model. Projects are Todoist's job and would bury the habit lens. |
| Kanban / boards, sprints, Gantt, workload views | Portfolio management; nothing to do with keeping promises. |
| Nested subtask trees (beyond one level) | Complexity with no gain in a personal/family context. |
| File attachments, comments/mentions, custom fields, dependencies | Collaboration-tool features; they make capture slower and the app feel corporate. |
| Location / "when messaging" reminders | Platform-specific surface area we don't need now. |
| Full time-blocking with drag-resize | Tiimo's identity, not ours; needs a durations/visual-timer model we are not building. |
| A 4th priority level ("urgent") | More decision cost per task, and pushes guilt framing. Three levels, rendered clearly. |
| Teams / guests / external sharing | Family-only keeps the privacy story simple and credible. |

## Part B — Anchor AI / Fabric: what "mind-blowing" should mean here

**What it is today (verified):** a deterministic, on-device intelligence layer — **no LLM**. It produces a daily briefing; insights (commitment completion, streaks, family activity, spend vs last month, savings rate, high-spend day, weekday/weekend patterns, completion×spend correlation); weekly reports; monthly reviews; proactive questions; and parsed queries over your own records (`QueryEngine` + `transactionParser`/`planningQueries`), plus predictions and a mood check-in.

**Its real strength:** privacy and breadth at zero cost — habits, money, mood and forecasts in one place, derived from your own data. **Its real fragility:** every sentence is a derivation, so **credibility is the entire product**. Two statements were literally false (UX-AI-06 "no tasks scheduled today"; UX-AI-08 "0% in 30 days"). A wrong assistant is worse than none — users stop reading it and it becomes decoration.

**So "mind-blowing" here means:** *an assistant that is always right about you, always shows its receipts, remembers what matters, and connects habits ↔ money ↔ mood in ways you could not do yourself.* Not a chatbot persona.

### B1. CHOSEN — the trust foundation (before anything clever)

| ID | What we build | Why | Size |
|---|---|---|---|
| **AI-11** | **Grounding invariants**: every generated sentence cites the records behind it, and tests assert assistant numbers **equal** the page numbers for every insight type (extending P1b's work). | The only way to be mind-blowing is to be *right*. This makes every later feature safe to ship. | M |
| **AI-15** | **Tap-to-cite**: every statement expands to "why I said this" — the facts, the window, the comparison. | Turns trust into something visible rather than believed. Also answers "is it making this up?" | M |
| **AI-05 / AI-10** | Transparency reachable from the assistant, with a plain explanation of what it will learn. | Today it's behind a dead end — the most important screen for a data-reading assistant. | S |
| **AI-07** | Fix the literal **"?"** glyph on the proactive card. | A visible bug on the assistant's face. | S |
| **AI-01** | **Input first**: the assistant's input is the primary action; mood and insights below. | Today the input sits under a card stack — wrong hierarchy for the headline feature. | M |
| **AI-04 / AI-09** | Mood gets its own compact surface; the nav **stays at four** items. | Mood is not a destination; the assistant belongs inside Home. | S |

### B2. PROPOSED — the "mind-blowing" layer (needs your yes; each is a wave)

| ID | What we build | Why it's the right ambition for AnchorOS | Size |
|---|---|---|---|
| **AI-13** | **Ask anything, grounded**: "how many times did I skip Bible reading this month?", "am I better on Mondays?", "what did we spend on the kids in September?" — answers assembled as *queries over records* with citations, never free generation. | This is the headline. It's also safe by construction: if it can't derive the answer from your data, it says so instead of guessing. | L |
| **AI-18** | **Cross-domain synthesis**: one narrative connecting habits, money and mood — "weeks you keep 70%+ of commitments, you spend ~18% less; that's ₦42k over 3 months". | Nobody else can say this: we hold commitments *and* the ledger. It's the product's unique insight, already half-computed as separate signals. | M |
| **AI-12** | **Visible memory with control**: "what I've learned about you" (your rhythms, best days, recurring frictions) with *accept/forget*. | Makes the assistant feel like it knows you — honestly, with a delete button. The opposite of black-box magic. | M |
| **AI-16** | **Feedback that visibly changes things**: dismiss/thumbs-down adjusts ranking and *says* what changed. | Today `learnFrom` records events and nothing visibly adapts, so the user has no reason to bother teaching it. | M |
| **AI-14** | **Rituals you can trust**: a scheduled morning brief, evening check-in and weekly review (with family variant) instead of a card stack. | A predictable moment is what turns an assistant into a companion — and it's testable for truthfulness. | M |
| **AI-19** | **Predictions that follow through**: when it forecasts something, it checks back later and admits when it was wrong. | Admitting error is the most credibility-building thing an assistant can do. | M |
| **AI-21** | **Family-level intelligence**: shared-commitment completion, who carried what, family streaks, weekly family review. | The family-first claim, made measurable. Pairs with `CM-24`. | M |
| **AI-03** | **Continuity**: the thread keeps the last exchanges and shows the questions it asked and your answers. | Without it the assistant feels amnesiac. | M |

### B3. NOT DOING for the assistant — and why

| Not doing | Reason |
|---|---|
| Free-form generative chat with no grounding | Every sentence must be derivable from records. Ungrounded chat is how trust dies. |
| Emotional-dependency mechanics (fake empathy, "I miss you", streak-shaming) | Manipulative, and it contradicts "no guilt". |
| Generative financial advice ("invest in X") | Not our competence or our liability profile. We report and relate; we don't advise. |
| Sending user data to a third-party LLM without per-feature, explicit consent | The privacy stance is the moat. If we ever use a model, it must be opt-in, per-feature, and grounded. |
| A chat-first redesign | Anchor's assistant should answer, brief and nudge — not become a text box you must talk to. |

## Part C — The complete remaining work, in one place

Everything still open after this document (existing 33 from doc 22, plus the new findings registered here). **Existing** = already in the ledger; **New** = registered by this document.

| Group | Findings | Count | Source |
|---|---|---|---|
| P1b remainder | `CM-04`, `CM-06`, `CM-07`, `CM-08`, `AI-04`, `AI-09`, `ST-03`, `GL-05` | 8 → **1** (`CM-04`, `CM-06`, `CM-08` closed in #233; `AI-04`, `AI-09`, `ST-03`, `GL-05` closed in the P2 shell wave; `CM-07` partial — next-due needs `CM-17`) | Existing |
| P1c capture-first composer | `CM-01`, `CM-02`, `CM-09`, `CM-10`, `OB-03`, `DS-01` | 6 → **0** (`CM-10` closed in #233; `CM-01`, `CM-02`, `CM-09` closed in #234; `OB-03` and `DS-01` closed in the P1c closing wave) | Existing |
| P2 Home shell + assistant placement | `DB-02`…`DB-05`, `AI-01`, `AI-03`, `AI-05`, `AI-07`, `AI-10`, `GL-01`…`GL-04`, `GL-06` | 14 → **4** (`DB-02`…`DB-05`, `AI-07` closed in #232; `AI-05`, `AI-10`, `GL-02`, `GL-03`, `GL-06` closed in the P2 shell wave; `AI-01`, `AI-03`, `GL-01` — improved, Home carries the doorway — and `GL-04` remain) | Existing |
| P3 Settings hub | `ST-01`, `ST-02`, `ST-04`, `ST-05`, `ST-06`, `GL-08` | 6 → **0** (hub + `/settings/:section` routes, one section registry, explicit save, appearance consolidated) | Existing |
| P3 Finance landing | `FN-01`, `FN-02`, `FN-03`, `FN-04`, `FN-06`, `FN-10` | 6 → **0** (labelled per-currency totals, connected account→transaction journey, comparable rows, explainable empty months) | Existing |
| P3 Onboarding rewrite | `OB-01`, `OB-02`, `OB-04`, `OB-05` | 4 | Existing |
| Dev-surface gating | `GL-07` | 1 | Existing |
| **Commitments 2.0 — scheduling truth** | `CM-18`, `CM-17`, `CM-21`, `CM-06/07`, `CM-25` | 5 | **New** |
| **Commitments 2.0 — capture & ease** | `CM-01/02/09/10`, `CM-16`, `OB-03`, `DS-01` | 4 | **New** (overlaps P1c, now specified) |
| **Commitments 2.0 — find & undo** | `CM-15`, `CM-23` | 2 | **New** |
| **Commitments 2.0 — proposed** | `CM-27`, `CM-24`, `CM-12`, `CM-26`, `CM-13`, `CM-28`, `CM-19`, `CM-22` | 8 | **New (need your yes)** |
| **Fabric AI — trust** | `AI-11`, `AI-15`, `AI-05/10`, `AI-07`, `AI-01`, `AI-04/09` | 6 → **3** (`AI-01`, `AI-04/09`, `AI-05/10`, `AI-07` closed; `AI-11`, `AI-15` remain) | **New** |
| **Fabric AI — ambition** | `AI-13`, `AI-18`, `AI-12`, `AI-16`, `AI-14`, `AI-19`, `AI-21`, `AI-03` | 8 | **New (need your yes)** |

**Totals:** 7 existing + ~25 new findings ≈ **32 open items**, of which **14 are PROPOSED** and need your decision (8 commitments, 6 assistant).

### Update — W-T20 batch, 2026-09-20

The decision-free half of this list was worked in one ranked pass (see the W-T20 batch
table in doc 22). Closed here: `CM-15`, `CM-16`, `CM-17`, `CM-18`, `CM-21`, `CM-23`,
`CM-25`, `AI-11`, `AI-15`, plus the ledger's `UX-CM-07`, `UX-GL-04`, `UX-GL-07`,
`UX-OB-01`, `UX-OB-02`, `UX-OB-05`, `UX-ST-04` and the `W-D1b` adoption items
(`UX-DS-02/04/06`).

**Still open, unchanged:** the 14 PROPOSED items (8 commitments, 6 assistant) — they need
a yes, not an implementation — and `CM-17`'s follow-on UI affordances beyond the composer
(`CM-19`, `CM-22`, `CM-24`, `CM-26`…`CM-28`).

## Part D — The wave plan (order, contents, exit criteria)

Waves are ordered by **value ÷ risk**, and each is one PR (plus its staging deploy) so nothing sprawls.

| # | Wave | Contains | Why this order | Exit criteria |
|---|---|---|---|---|
| 1 | **W-C1 Capture** | `CM-01/02/09/10` + `CM-16` instant add + `OB-03` + `DS-01` | Highest ease-of-use return; you called this out first; no data-model risk | Capturing a commitment takes **< 10 s** from tap to saved, one sheet, one dismiss, Save always reachable; verified in a real browser |
| 2 | **W-C2 Scheduling truth** | `CM-18` weekday indexes + migration, `CM-17` exact date/time/interval/end, `CM-21` smart views | Makes cadence mean what it says; everything else (rows, AI) depends on it | A commitment scheduled Tue does **not** fire Thu; Today/Overdue/This week/Later match the page; migration verified on seeded data |
| 3 | **W-C3 Rows & history** | `CM-06`, `CM-07`, `CM-25`, `CM-23` undo | The daily reading surface; needs W-C2's data | Rows 64–72px, no stray dash, cadence + next due + streak visible; Done history browsable; undo works |
| 4 | **W-A1 Assistant trust** | `AI-11` grounding invariants, `AI-15` tap-to-cite, `AI-05/10` transparency, `AI-07` glyph, `AI-01` input first, `AI-04/09` mood | Trust before cleverness; also clears the P2 blockers it overlaps | Every assistant number equals the page number (tested per insight type); every statement expands to its facts; no "?" glyph |
| 5 | **W-C4 Find & organise** *(if you approve)* | `CM-15` search, `CM-13` life-domains, `CM-12` sub-steps, `CM-22` order | Only useful once history + smart views exist | Search returns correct results incl. Done; domains are chip-selectable; one level of sub-steps only |
| 6 | **W-A2 Assistant memory & synthesis** *(if you approve)* | `AI-12`, `AI-16`, `AI-18`, `AI-14`, `AI-19`, `AI-03` | The "mind-blowing" layer, built on the trust foundation | Memory is visible and forgettable; dismissing changes ranking **and says so**; one cross-domain narrative cites its numbers; predictions are revisited |
| 7 | **W-M Money link** *(if you approve)* | `CM-27` bill ↔ recurring transaction, `CM-08` replaces the interrupting modal | Anchor's unique habit↔money move | Completing a linked bill offers one quiet reconciliation, never a modal |
| 8 | **W-F Family** *(if you approve)* | `CM-24` assignment + `AI-21` family intelligence | Strongest emotional claim; also the biggest data/rules change → last of the feature waves | Family view shows who owes what; rules tests cover the shared paths |
| 9 | **W-P2 Home + nav** | the 14 P2 findings (Home merge, floating nav, `DB-02` correctness bug, vocabularies) | Structural; safest once the features it hosts are settled | One `Home`, one assistant entry, one settings entry, nav ≤ 4 items with safe-area + FAB slot; `DB-02` per-currency correct |
| 10 | **W-P3 Settings / Finance visuals / Onboarding** | 6 + 6 + 4 + `GL-07` | Visual/structural polish, lowest functional risk | Settings sections addressable + searchable; Wallet visuals per doc 21; onboarding 3 screens resumable; dev surfaces proven non-shippable |
| 11 | **W-A3 Ask anything** *(if you approve)* | `AI-13` grounded ask-anything with citations, `AI-17` tone/density | The headline feature, safest **after** grounding invariants exist | Every answer is derived + cited, or explicitly "I can't tell from your data" |

**Interleaving rule:** one wave in flight at a time; each wave merges, auto-releases, deploys to staging, and shows `Release Smoke` green before the next begins. If a wave slips, the order (not the contents) is what changes.

## Part E — The quality bar ("no compromise") and how each wave is proven

Your bar is explicit: **ease of use and beautiful UI/UX, no compromise**. That is only enforceable if it is written down as exit criteria, so every wave must satisfy all of the following before it is called done.

**Ease of use**
1. **Capture in under 10 seconds** from tap to saved (measured in a real browser, not asserted in jsdom).
2. **One primary action per screen**; every empty state offers the action it describes.
3. **No jargon, no dead ends**: no internal vocabulary ("Domain", "Frequency" as a classification step), no disabled control without a stated reason, no link to nowhere.

**UI quality**
4. **`DESIGN_SYSTEM.md` compliance**: Lucide icons only for functional states, spacing/typography scales respected, no emoji standing in for icons.
5. **44×44px minimum targets**; safe-area respected on mobile; no content under the nav.
6. **Both themes** (light/dark) and the text-size/contrast settings checked on every touched screen.
7. **No layout shift, no stray placeholders** (e.g. the grey dash), no orphaned spacing.
8. **Motion with intent**, ≤200ms, honouring `prefers-reduced-motion`.

**How it is proven (per wave, every time)**
- **Logic:** unit tests for derivations and edge cases (this is what caught the false assistant numbers).
- **Real browser:** a walkthrough at desktop + mobile widths with screenshots, because jsdom cannot hit-test occlusion — the two functional P0s found in this programme were only visible in a running browser.
- **Both themes + settings variants** screenshotted for touched screens.
- **PR evidence:** what the user sees before/after, the measured flow (taps/seconds), and the test-to-risk mapping.
- **Bookkeeping:** ledger doc 22 and `MASTER-FINDING-REGISTER.md` updated in the same PR — a finding is only closed when the register says so.
- **Release:** staging deploy green with `Release Smoke` before the next wave starts. Production stays untouched until you approve it.

**Anti-patterns that will block a wave from closing:** shipping a new surface while a known false statement still exists elsewhere; adding a feature that makes capture slower; adding a control that needs explaining in a tooltip; "we'll polish it later" on a screen the user sees daily.

## Part F — What I need from you (the whole decision surface)

Answer in any format; each is a yes/no and my recommendation is stated.

**Commitments (8 proposed)**

| # | Item | My recommendation |
|---|---|---|
| C1 | `CM-27` Link bill commitments to recurring transactions (Anchor's habit↔money signature) | **Yes** — it's the most differentiated thing on this list |
| C2 | `CM-24` Family assignment + "who owes what" (touches shared data + rules) | **Yes**, but scheduled late (wave 8) |
| C3 | `CM-12` One level of sub-steps | **Yes** — household checklists are real |
| C4 | `CM-26` Per-commitment insight (best day, carry-over rate) | **Yes** — feeds Fabric directly |
| C5 | `CM-13` Curated life-domains instead of free-text | **Yes** — cheap, makes filtering real |
| C6 | `CM-28` One daily digest + quiet hours instead of per-task alert spam | **Yes** |
| C7 | `CM-19` "Next up" line on Today | **Yes** (small) |
| C8 | `CM-22` Manual drag ordering | **Optional** — lowest value once smart views exist |

**Assistant (6 proposed)**

| # | Item | My recommendation |
|---|---|---|
| A1 | `AI-13` Grounded "ask anything" with citations | **Yes** — this is the headline |
| A2 | `AI-18` Cross-domain narrative (habits × money × mood) | **Yes** — nobody else can say it |
| A3 | `AI-12` Visible memory with accept/forget | **Yes** |
| A4 | `AI-16` Feedback that visibly changes ranking | **Yes** |
| A5 | `AI-14` Rituals (morning brief, evening check-in, weekly review) | **Yes** |
| A6 | `AI-19` + `AI-21` Predictions that follow through + family intelligence | **Yes** (both) |

**Process (3)**

| # | Question | My recommendation |
|---|---|---|
| P1 | Order: commitments first (capture → scheduling → rows) then assistant trust, as in Part D? | **Yes** — ease of use first, as you asked |
| P2 | May I run the "PROPOSED" waves (5, 6, 7, 8, 11) after the CHOSEN ones, one at a time? | **Yes** — and you can hold any of them individually |
| P3 | If you want the whole thing faster, do you accept me batching 2 waves per PR where they touch the same files (faster, slightly larger reviews)? | **Prefer one wave per PR** — it keeps verification honest |

**If you simply reply "yes to all recommendations",** I will build in this order: **W-C1 Capture → W-C2 Scheduling truth → W-C3 Rows & history → W-A1 Assistant trust → W-C4 Find & organise → W-A2 Assistant memory & synthesis → W-M Money link → W-F Family → W-P2 Home + nav → W-P3 polish → W-A3 Ask anything**, updating docs 22 and the register in the same PR as each wave.

## Part G — How this document stays true

- **Registered findings:** this document *registers* the new IDs (`CM-12`…`CM-28`, `AI-11`…`AI-21`). They enter `MASTER-FINDING-REGISTER.md` **when their wave opens**, per the standing convention, so the register keeps describing work actually in remediation.
- **Ledger:** doc 22's totals are updated as each wave closes; the wave names here (W-C*, W-A*, W-M, W-F, W-P*) are the canonical sequence.
- **Status of the old 45:** unchanged — 16 of 61 original findings are closed, the rest are listed in Part C and scheduled in Part D.
- **Production:** untouched. Nothing in this document changes that.