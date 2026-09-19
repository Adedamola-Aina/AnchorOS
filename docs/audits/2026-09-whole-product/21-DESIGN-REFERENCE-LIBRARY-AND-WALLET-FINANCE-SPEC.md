# 21 — Design Reference Library & Apple Wallet–Grade Finance Spec

Date: 2026-09-18 · Third document of the UX program. Supports [`18-UX-AUDIT-AND-REDESIGN-PLAN.md`](18-UX-AUDIT-AND-REDESIGN-PLAN.md) §4.6 (Finance) and [`20-UX-DEEP-PASS-HEURISTIC-AND-INTEGRATION-AUDIT.md`](20-UX-DEEP-PASS-HEURISTIC-AND-INTEGRATION-AUDIT.md) §7.3 B.

Purpose: (a) record **which design-reference sources are actually accessible to this audit** and what each is good for, so benchmarking is repeatable; (b) specify the **Apple Wallet–style Finance page** the product owner asked for; (c) synthesize cross-app conventions for navigation, colour and ease of use.

## 1. Reference-source reality check

I probed every candidate source. This table is the honest access map — it exists so nobody assumes a claim came from a source I could not read.

| Source | Status for me | What it is good for |
|---|---|---|
| **Apple — Wallet & Apple Pay product pages** | ✅ `RETRIEVED-VERBATIM` | Wallet's organising model, card adding, balances-on-card, Apple Card spending tools, privacy framing |
| **Apple HIG (Wallet, Cards, Navigation)** | ❌ JS-gated (`"This page requires JavaScript"`) | Would be authoritative; not readable by me |
| **Material 3 / Material 2 docs** | ❌ JS-gated | Would be authoritative; not readable by me |
| **Mobbin — glossary** | ✅ `RETRIEVED-VERBATIM` | Canonical pattern **definitions** (Action Sheet, Bottom Sheet, Empty State, FAB, Skeleton, Snackbar/Toast, Stacked List, Status Dot, Stepper, Tab Bar, Tooltip, Drawer…) |
| **Mobbin — screen/flow galleries** | ❌ login + JS + paid | The visual benchmark library we want — **needs your export** (§5) |
| **ScreensDesign / UI Sources** | ⚠️ landing + article titles public; screen library paid/MCP | Public article set (e.g. *"Strava Onboarding Design: 10 Recorded Screens Explained"*, *"10 Mobile App Welcome Screen Copy Examples"*, *"10 Travel Itinerary App Design Examples"*, *"10 Period Tracker App Onboarding Examples"*); full session recordings behind the library |
| **Pttrns** | ⚠️ free but account-gated | 7k+ curated mobile patterns (needs your login/export) |
| **Refero** | ❌ JS-gated shell | Pattern gallery (needs export) |
| **NN/g** | ✅ `RETRIEVED-VERBATIM` | Heuristic definitions and principle-level guidance |
| **Product sites/docs** (Tiimo, Streaks, Todoist, Apple) | ✅ `RETRIEVED-VERBATIM` | Each product's own model, verbatim |

**Conclusion:** for *principles and definitions* I am well supplied. For *visual layout precedent* — what you actually wanted from Mobbin — I need exported images (§5). Everything below that is not marked verbatim is my own product observation and is labelled as such.

## 2. Apple Wallet: what Apple actually says (verbatim, retrieved)

- **Scope/organising model:** *"The Wallet app lives right on your iPhone. It's where you securely keep your credit and debit cards, eligible driver's license or state ID, transit cards, event tickets, keys, and more — all in one place."* → Wallet is a **container of heterogeneous items grouped by kind**, not one dashboard.
- **Adding:** *"open the Wallet app and **tap the plus symbol**"*; also *"tap the back of your iPhone with your eligible credit or debit card and follow the steps on your screen."* → the **+** is the single add affordance, top-level and always present.
- **Balances live on the card:** *"Check Balances — Now you can view your card balance right in Wallet before making a payment. All you have to do is connect your eligible card's account to Apple Pay."* → **the object carries its own number**; you do not open it to find out what it is.
- **Cards expand on tap:** *"Tap the card that supports Pay Later to view your available plans and choose the one that works best for you."* → tap-to-expand-then-choose, no separate menu dive.
- **Secondary actions live behind a "more" control:** *"Just tap the more button and then select Pay Later Options."* → overload goes into **⋯**, not into the primary surface.
- **Apple Card's financial-health tools:** *"comes with tools designed to support your financial health — including features that can track spending and estimate interest payments"*, plus Daily Cash and a Savings account. → the card *is* the entry point to its own analytics.
- **Ledger connection:** Apple Cash — *"Add a memo to a payment, and it shows up right in Wallet, making it easy to keep track of transactions."* → transactions are first-class, annotated, and live in the same place as the card.
- **Privacy as a design feature:** device-specific number and unique transaction code; *"your actual card number isn't shared by Apple with merchants or stored on Apple servers"*; Hide My Email. → reassurance is stated in the product, not only in policy.

### Craft anatomy (my observation, not retrieved — HIG unreachable)

Labeled `OBSERVED-PRODUCT-KNOWLEDGE` so it is not mistaken for documentation: Wallet's stack shows a small number of cards **overlapped with the top card fully visible and each lower card exposing a narrow strip**; the top edge of each lower card remains its hit area; **vertical** scroll moves through the stack, **horizontal swipe** on an expanded card moves between cards; tapping expands a card to a full-bleed pass showing its front, with detail/back-of-pass content behind; the **+** sits in the top bar; cards are grouped into sections; the card's colour/gradient is the account's identity; Wallet is dark-surface-first with high-contrast text on the card and neutral chrome around it.

## 3. AnchorOS Finance — the Apple Wallet–grade specification

This replaces doc 18 §4.6 in visual and interaction terms; that document's rules (per-currency honesty, connected account→transaction journey, 44px targets) still apply and are restated where they interact.

### 3.1 The account pass (card front)

| Element | Specification |
|---|---|
| Proportion | **ID-1 payment-card ratio (~1.586:1)** — a 390px viewport gives roughly 343×216px. This is what makes it read as "a card" instantly. |
| Background | Full-bleed per-account gradient (account colour is identity) with a subtle depth treatment; **no photograph** — the tint is the identity, as in Wallet. |
| Top-left | Account name, one line, ellipsis-truncated. |
| Top-right | Account type as a small-caps label (Checking / Savings / Salary / Investment). |
| Bottom-left | **Balance in tabular/monospaced numerals** (no digit jitter when it changes) with the currency symbol and an explicit per-currency label. The object carries its own number — the retrieved Wallet behaviour ("view your card balance right in Wallet"). |
| Bottom-right | Ownership chip when family-scoped (`Shared with 2`), consistent with the product's "boundaries that hold" promise. |
| Contrast | Text on gradient must pass 4.5:1; each account colour is validated individually (dark text on light gradients, light on dark). |

### 3.2 The stack — and the functional defect it must fix

1. **Geometry:** max **3** passes in the hero stack; the active pass fully visible; every pass beneath exposes a **56px strip** (comfortably ≥44px). Horizontal inset 16px; corner radius consistent with the existing `Card` primitive.
2. **The hard rule (fixes `UX-FN-07`):** *a pass's interactive area may never be overlapped by another pass.* The exposed strip is a live, tappable button. This is the defect that currently makes the underlying accounts unreachable; the fix is a **layout contract**, verified by a real (non-forced) click in the E2E suite.
3. **Motion:** scroll-driven parallax on the stack (offset ≈0.85, 220ms `ease-out`); expand/collapse on tap; **no parallax and no stack animation under `prefers-reduced-motion`** — cross-fade only.
4. **Gestures:** vertical scroll through the stack; horizontal swipe on the active pass moves between accounts; a plain **tap always opens** the account, so the stack is never a secret carousel.
5. **Scale:** more than 3 accounts → group into sections by currency (Wallet groups heterogeneous items into sections) with a currency header per group, plus an **"All accounts" list** below the stack — compact rows (name · type · balance · currency) that make accounts *comparable*. That scanability is exactly what the overlapping stack destroyed (`UX-FN-04`); the Wallet hero is kept without paying for it.

### 3.3 Account detail = the "back of the pass"

- The pass stays pinned at the top with the **transaction ledger directly beneath it** (the Apple Card model: the card is the entry point to its own analytics).
- A **⋯ (more) control** carries account options — rename, family/sharing scope, archive, delete — mirroring Wallet's *"tap the more button"*. Overload goes here, never onto the hero surface.
- Keep the existing `All / In / Out` filters, but give them visible labels and expose the active state to assistive technology (`UX-CM-11` pattern).

### 3.4 The `+` and recording a transaction (fixes `UX-FN-08`)

1. **`+` in the top-right of Finance** (retrieved Wallet placement: *"tap the plus symbol"*), ≥44×44, with an accessible name.
2. It opens an **action sheet** (Mobbin definition — "a specific style of menu that presents a set of actions or options"): **Record transaction** (primary) · Add account · Link bank · Transfer (later).
3. **Record transaction is a bottom sheet** (Mobbin definition — "supplementary content anchored to the bottom of the screen… easily accessed and dismissed"): amount first with a numeric keypad, account preselected to the active pass, category chips, optional memo/date, and a **Save that is always visible**.
4. The Finance **empty state offers that same action as a real button** — an empty state must never describe an action that does not exist on the screen.
5. After save, the pass's balance **animates in place to its new value** and the row appears at the top of the ledger — cause and effect in one viewport.

### 3.5 Honesty, states and accessibility

- **Per-currency truth:** replace the concatenated "TOTAL ASSETS ₦850,000.00 | $40,478.32" with per-currency rows (`₦ 850,000.00 · 1 account`, `$ 40,478.32 · 2 accounts`). No FX conversion and no cross-currency percentage (`UX-DB-02`).
- **Empty:** a dashed **ghost pass** in the stack ("Add your first account") plus the explicit Add action.
- **Loading:** card **skeletons** (Mobbin — "placeholder preview of your content while the actual content is being loaded") instead of a spinner.
- **Offline:** a per-pass queued-writes indicator reusing the existing offline queue; a transaction is never silently lost.
- **Screen reader:** the stack is a list; each pass announces as one element — *"Primary Checking. Savings. Balance 25,478 dollars 32 cents. USD. Shared with 2."* — and each exposed strip is its own focus stop with its own name.
- **Swipe is never the only route:** VoiceOver/Switch users get the "All accounts" list.

### 3.6 What this specifically fixes

| Current defect | How the Wallet model resolves it |
|---|---|
| `UX-FN-07` occluded accounts untappable | Layout contract: exposed strips are live targets; verified by real click |
| `UX-FN-08` no way to record a transaction | `+` → action sheet → Record transaction (bottom sheet), plus a real empty-state button |
| `UX-FN-01` two unlabelled `+` affordances | One `+`, one action sheet with named actions |
| `UX-FN-02` mixed-currency headline | Per-currency rows; card carries its own labelled balance |
| `UX-FN-04` stack hides accounts, no comparison | 3-card hero + currency sections + "All accounts" list |
| `UX-FN-03` account↔transaction disconnected | Pass → ledger beneath → record → balance animates |
| `UX-FN-09` 32px targets | 44px minimum everywhere including exposed strips |
| `UX-FN-10` empty month looks like no data | Ledger belongs to the account; month control states why it is empty |
| `UX-DB-02` cross-currency percentages | No conversion anywhere; currency is always explicit |

## 4. Cross-app conventions: navigation, colour, ease of use

Quoted definitions below are **Mobbin glossary, retrieved verbatim** — the industry's own vocabulary for these patterns.

### 4.1 Navigation

| Pattern | Definition (verbatim) | Where it belongs in AnchorOS |
|---|---|---|
| **Tab Bar** | "the bottom navigation that provides access to top-level destinations" | **Mobile: exactly this**, 4 destinations (Home · Commitments · Finance · Settings). Never 5 (`UX-AI-09`). |
| **Sidebar** | "makes it easy for users to navigate an app's features or sections. It may also include extra content or actions to help with tasks." | Desktop/web only. Already exists (`MainLayout`) — align its labels with the tab bar vocabulary. |
| **Floating Action Button** | "represents the primary action on a screen… designed to provide quick access to the most important function of an app, persistently floating above other components for easy reach" | The single create affordance per surface (New commitment / Record transaction). Replaces our page-sized CTA. |
| **Drawer** | "a panel that enters from the edge of the screen to display supplementary content, it typically has a Hamburger Menu Icon… to indicate its presence" | **Not needed.** A drawer plus a tab bar is two navigation systems — a common self-inflicted wound. |
| **Command Palette** | "provides quick access to many commands/functionalities within the app" | Optional desktop power-user affordance (⌘K): jump to a commitment, record a transaction, ask Anchor. |
| **Status Dot** | "a small, circular indicator that conveys notifications or status information" | The single nav signal (`UX-GL-05`) — a dot, never a number. |
| **Top Navigation Bar** | "the header component at the top of the screen that provides navigation and actions" | Per-screen title + at most one primary action, right-aligned (the `+`). |

**Convention:** the best apps pick **one** navigation system per breakpoint and put *create* in a FAB or a header action — never a page-sized button, and never duplicate destinations across two systems (which is exactly our `UX-GL-02` settings defect).

### 4.2 Colour

1. **One accent means "action"**; it is not decoration. If blue is the accent, blue is buttons, links, focus rings — not a budget category.
2. **Object colour means identity.** Tiimo: *"color-code tasks"*, and *"Choose colors, icons, and layouts that reflect how you work best… Personalizing your planner builds motivation and makes it easier to keep coming back"* (retrieved). This is the licence for per-account gradients — colour as *identity and motivation*, not as status.
3. **Status colour is reserved.** Red/amber/green mean danger/warning/ok and nothing else. Our priority emoji (🔴🟡🟢 — `UX-DS-01`) borrow status colour for a *priority* concept and use emoji instead of the design system's icons; priority should be typographic/iconographic, not traffic-light.
4. **Neutrals carry the interface; colour carries meaning.** 90% of any good dark UI is layered neutrals (surface, elevated surface, border, muted text, primary text) — semantic tokens, which `docs/DESIGN_SYSTEM.md` already mandates.
5. **Gradients are for objects the user *owns*** (their card, their account, their streak) — never for chrome, headers or backgrounds.
6. **Dark-first, not inverted.** Our app is dark by default; gradients must be designed for the dark surface (subtle top-left light source), not light-mode gradients darkened afterwards.

### 4.3 Ease of use (the seven conventions that repeatedly matter)

1. **Capture before classification** — Todoist: "type out the task name and press Add task to save it" (retrieved).
2. **One sheet, not a wizard** — NN/g: "if you divide the task into too many steps, users get bogged down by excess navigation" (retrieved).
3. **Empty states carry the action** — Mobbin: "An empty state occurs when there is no data to display to users." An empty state without the action it describes is a dead end (our `UX-FN-01`, `UX-DB-05`).
4. **Creation in a Bottom Sheet; choices in an Action Sheet** — Mobbin definitions above. Dialogs are for consequential prompts only ("displays content… that requires user interaction").
5. **Skeleton, not spinner** — "placeholder preview of your content while the actual content is being loaded."
6. **Toast for transient confirmation, with Undo** — "brief, temporary messages… noticed without disrupting a user's attention."
7. **Progress the user can keep** — Streaks: *"Set the days so you don't break your streak"*; Tiimo: streaks "Build consistency and celebrate progress"; Apple: widgets so "See what's next at a glance… no app opening required." Progress must be schedule-aware, visible and never punished for days nothing was due.

### 4.4 The 12-point rubric I will score every wave against

1. One primary action, named, visible, ≥44px.
2. Every empty state offers the action it describes.
3. Nothing consequential happens without feedback (status, toast, or in-place animation).
4. No screen shows two controls that do the same thing, or two names for one destination.
5. Creation is one sheet, ≤2 inputs for the common case.
6. Every row/card exposes its own state (schedule, balance, next due) — no placeholder dashes.
7. Numbers are labelled with their unit/currency; no arithmetic across units.
8. Loading uses skeletons; errors are recoverable with a retry, not a vanishing toast.
9. Motion is purposeful, ≤250ms, and reduced-motion-safe; nothing loops forever on a passive element.
10. Colour: one accent for action, object colour for identity, status colours reserved.
11. Assistive tech can name, focus and operate every control — including stacked cards, view switchers and progress indicators.
12. No dev-only control, banner or section can render in a deployed environment.

## 5. What I need from you to go further (Mobbin-grade visual precedent)

Principles and definitions are covered (§1). What I cannot see is **visual layout precedent** — the thing you wanted from Mobbin: how varied apps actually compose navigation, colour and density on real screens. Three ways to close that, in order of value:

**Option A — export screens (best).**
1. `mkdir -p /root/mobbin` (or any path — just tell me).
2. Save as **PNG/JPG** (not PDF), phone-sized, one screenshot per file.
3. Name them so I can tell context: `todoist__create-task__step1.png`, `monzo__empty-state.png`, `streaks__settings.png`.
4. Say the word and I will analyse them into a design-reference annex and fold the conclusions into the specs.

Highest-value sets, in priority order — each maps to findings already recorded:

| # | Set | Sharpens |
|---|---|---|
| 1 | **Bottom sheets / creation composers** — Todoist, Things 3, Apple Reminders, Tiimo, Structured | `UX-CM-01/02/09/10` |
| 2 | **Settings hubs** (grouped + searchable) — iOS Settings, Things, Todoist, Streaks, Monzo | `UX-ST-01/02/06` |
| 3 | **Card stacks / wallet-style accounts** — Apple Wallet, Monzo, Revolut, Wise, Monarch, Copilot | This document §3 (the most valuable single set right now) |
| 4 | **Tab bar + FAB combined** — X, Instagram, Things, Todoist, YNAB | `UX-GL-04`, floating nav |
| 5 | **Onboarding flows in full** (incl. progress + skip) — Finch, Monzo, Revolut, Tiimo | `UX-OB-01…09` |
| 6 | **Empty states with real CTAs** — Monzo, Revolut, YNAB, Copilot | `UX-FN-01`, `UX-DB-05` |
| 7 | **Home + assistant** — Tiimo, Finch, ChatGPT/Claude/Perplexity apps, Monarch | `UX-AI-01…10` |
| 8 | **Streak/progress visuals** — Streaks, Duolingo, Finch, Habitica | §4.3.7, schedule-aware streaks |
| 9 | **Toast / inline validation / undo** | heuristic 9 (error recovery) |
| 10 | **Nav status dots / badges** — Slack, X, Things, Duolingo | `UX-GL-05` |

**Option B — give me Mobbin (or Pttrns/Refero/ScreensDesign) access the way I can use it.** Note that logging me in will not work: my tools cannot hold a browser session, so a password in chat would be useless *and* a secret I must not keep. The only access that works is **files**.

**Option C — describe what you like.** If exporting is tedious, tell me the 5–10 screens you personally admire and what you like about them ("Monzo: the balance is the hero and transactions read like a chat"; "Things 3: the add sheet has one field") and I will translate those into our vocabulary and specs.

**On copyright:** I will analyse and cite patterns, but I will **not commit third-party screenshots into the repository** — that would be redistributing someone else's product UI. If you want the reference images versioned, that needs to be your explicit call, and ideally restricted to a non-published folder or internal doc.

## 6. Next steps with this document in hand

1. **Nothing here blocks the P0 work.** The Finance functional fixes (`UX-FN-07/08/09`) and the onboarding P0s (`UX-OB-06/07/08`) are correct regardless of the visual direction — and §3 now gives the Finance fix a *destination* rather than a patch.
2. **Proposed sequence for Finance specifically** (avoids doing it twice):
   - **F1 (functional, now):** restore tappability, add the `+` → action sheet with **Record transaction**, real empty-state button, 44px targets, per-currency labelling. *Do not restyle yet.*
   - **F2 (Wallet visuals, after F1):** pass fronts, gradients, tabular balances, 3-card hero + currency sections + "All accounts" list.
   - **F3 (ledger in place):** pass pinned with the ledger beneath, ⋯ options, balance animation on save.
3. **New decisions this adds — ALL ACCEPTED 2026-09-18 (the recommendations below are the approved design, with D1–D11):**
   - **D12** — Adopt the Wallet model for Finance (pass fronts, stack + "All accounts" list, `+` → action sheet)? Recommend **yes**.
   - **D13** — Account identity colour: derive a gradient per account from the existing account colour, or a restrained palette per account *type*? Recommend **type-based palette with a per-account hue shift**, so two Checking accounts are distinguishable without becoming a rainbow.
   - **D14** — Does the commitment list adopt a card-stack idiom too, or stay a list (with the timeline as the visual view)? Recommend **stay a list** — cards everywhere is the fastest way to make an app feel like a template.
4. **Document relationships (so nothing is read out of order):** doc 18 = round-1 audit + master target spec; doc 19 = round-1 research; doc 20 = round-2 deep pass (heuristics, functional defects, corrections to 18 §6) + priority order; doc 21 = this reference library + the Finance visual specification that supersedes 18 §4.6's visuals. Where 18 and 20 disagree, **20 wins**; where 18 §4.6 and 21 §3 disagree, **21 wins**.




