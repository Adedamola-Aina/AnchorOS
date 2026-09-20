# 22 — UX Remediation Ledger: what is closed, what remains

Date: 2026-09-18 · Companion to docs 18 (round-1 audit + target spec), 19 (research), 20 (round-2 deep pass), 21 (reference library + Wallet spec).

Purpose: **one place that answers "what is left?"** Every finding from the UX program appears exactly once, with its wave, its blocker (if any) and its status. Update this file when a wave closes; the register carries the formal remediation rows.

**Forward plan:** doc 23 (`23-COMMITMENTS-BENCHMARK-AI-AMBITION-AND-PLAN.md`) registers the Commitments 2.0 and Fabric AI findings (`CM-12`…`CM-28`, `AI-11`…`AI-21`) and fixes the canonical wave order (W-C1 Capture → W-C2 Scheduling truth → W-C3 Rows & history → W-A1 Assistant trust → W-C4 → W-A2 → W-M → W-F → W-P2 → W-P3 → W-A3 Ask anything), together with the quality bar and the exit criteria for every wave (doc 23 Part E). **Doc 24** (`24-DESIGN-EXCELLENCE-RESEARCH-AND-SURFACE-STRATEGY.md`) holds the researched design law (curated palette, type + tabular numerals, motion budget, sensory map, cohesion), the per-surface strategies (Home + Anchor AI, Settings, Finance), the design-foundation items `UX-DS-02`…`UX-DS-08` (wave **`W-D1`**, now first in the order), and the evidence-based decision on bank-statement import (roadmap `R-01`, gated after `W-P3`). This ledger holds per-finding status; docs 23 and 24 hold the sequence, the rationale and the design law.

## Legend

- **CLOSED** — implemented, verified in the running app (not just unit tests) and merged or in a green PR.
- **OPEN — no decision needed** — can be built immediately; scoped, decision-free.
- **OPEN — blocked on a decision** — needs a product answer (D-number from doc 18 §7 / doc 20 §7.4 / doc 21 §6).
- **OPEN — needs verification first** — the fix cannot be scoped until a code/behaviour question is answered.
- **OPEN — needs external input** — needs Mobbin-grade screenshots, a provider metric, or a real device.

## Totals

| Metric | Value |
|---|---|
| Findings in the UX program | **61** (41 round-1 + 20 round-2) |
| Closed | **54** (+1 unnumbered accessibility side-fix in the shared `ActionSheet`) |
| Remaining | **7** |
| Waves merged to `master` | F1 (finance), F2 (onboarding), P1a (commitments legibility), P1d (quick findings), P1b (partial — UX-AI-06), P1c (composer + onboarding defaults + emoji sweep), P2 (Home shell + assistant placement), P3-Settings (hub + routed sections), P3-Finance (labelled totals, comparable rows, explainable empty months), W-A1 (assistant hierarchy + continuity) |
| Deployed | `master` `5270bfb7` / `v1.21.0-rc.19` → **staging**, Release Smoke green. **Production undeployed.** |
| Decisions | **D1–D14 ACCEPTED 2026-09-18** (doc 18 §7, doc 20 §7.4, doc 21 §6) — no wave is decision-blocked any more |

## Closed (54)

| ID | Sev | Wave | What was wrong | Verified by |
|---|---|---|---|---|
| UX-FN-07 | HIGH | F1 | Accounts other than the front card could not be opened at all (intercepted hit area) | Real non-forced tap → `/finance/account/acc-ngn-ops` |
| UX-FN-08 | HIGH | F1 | No way to record a transaction from the Finance landing page | `+` → action sheet → form opened |
| UX-FN-09 | MEDIUM | F1 | Header `+` and month controls were 32×32 | Measured 44×44 |
| UX-OB-06 | HIGH | F2 | Onboarding progress lost on reload (back to step 1) | Reload at step 3 → step 3 |
| UX-OB-07 | HIGH | F2 | Display name invented from the email local-part / "User" | Name field starts empty |
| UX-OB-08 | HIGH | F2 | Disabled primary with no required marker or reason | Requirement line rendered while disabled |
| UX-OB-09 | MEDIUM | F2 | "Skip for now" silently terminated setup on some steps | Step 1 = "Finish later"; later steps advance |
| UX-DB-01 | MEDIUM | F2 | Greeting emitted a dangling "Good evening, " with no name | Greeting branches on the name |
| UX-CM-03 | HIGH | P1a | CTA labelled "Close" kept its `+` icon | Icon bound to state; `aria-expanded` |
| UX-CM-05 | MEDIUM | P1a | View switcher was icons-only, active state by colour alone | Visible labels + named group |
| UX-CM-11 | MEDIUM | P1a | Selected view not exposed to assistive tech | `aria-pressed` asserted in tests |
| UX-AI-02 | HIGH | P1d | Disabled assistant was a dead end (no value, no link) | Explains value + links to Settings |
| UX-DB-06 | LOW | P1d | Subtitle "Life at a glance." carried no information | Subtitle shows today's date |
| UX-FN-05 | MEDIUM | P1d | Finance subtitle used internal vocabulary | Plain-language subtitle |
| UX-AI-06 | HIGH | P1b | Assistant said "No tasks scheduled today" while active commitments existed — overdue work was invisible to the assistant **and** the nav badge | Shared schedule model (`commitmentSchedule.ts`); assistant, badge and page agree |
| UX-AI-08 | MEDIUM | P1b | First insight was a demoralising "completion: 0% — 0 of 4 done in 30 days": a momentary complete-flag was described as 30-day performance | Expected occurrences per cadence vs evidenced completions; silent when nothing was due |
| UX-DB-02 | HIGH | P2 | Portfolio share divided every balance by one total that summed **all currencies**, so an NGN balance was divided by a denominator containing USD cents | Shares computed within their own currency; Asset Split renders one bar + legend per currency. `financeInsights.test.ts` |
| UX-DB-03 | HIGH | P2 | Portfolio advertised "TOTAL ACROSS 3 ACCOUNTS" but printed no total | `getPortfolioTotals` + the card prints one total per currency, and reads "1 account" not "1 accounts". `PortfolioWidget.test.tsx` |
| UX-DB-04 | MEDIUM | P2 | Portfolio and Asset Split duplicated the same payload | Deleted from Portfolio (it now carries the number; the split carries the composition). `PortfolioWidget.test.tsx` |
| UX-DB-05 | MEDIUM | P2 | Goal empty state was a dead end ("set one during onboarding", no control) | Shared `EmptyState` with honest copy; no action promised while no goal surface exists. `GoalProgressCard.test.tsx` |
| UX-AI-07 | MEDIUM | P2 | Proactive card rendered a literal **"?"** where an icon should be | Lucide `MessageCircleQuestion`, per `DESIGN_SYSTEM.md`. `FabricProactiveQuestionCard.test.tsx` |
| UX-CM-08 | MEDIUM | P1b | Completing a financial-looking commitment interrupted with a blocking cross-domain "Financial Transaction?" modal and navigated away on confirm | Inline dismissible chip on the completed row; no modal, no auto-navigation. `TaskList.test.tsx`, `TaskItem.test.tsx` |
| UX-CM-04 | MEDIUM | P1b | Filter chips mixed cadence with type (`TODO` read as a frequency) | Group labelled "Show"; the one-off option is named "One-off". `CommitmentsViewParts.test.tsx` |
| UX-CM-06 | MEDIUM | P1b | Task rows ~175px tall with a stray grey dash | Verified already remediated (no dash in the feature; single-line `Card p-3`; 72px list estimate) — no change needed |
| UX-CM-10 | MEDIUM | P1c | Composer cadence cards and filter chips shared identical labels on one screen | Filter group now carries a visible label + accessible name. `CommitmentsViewParts.test.tsx` |
| UX-CM-01 | HIGH | P1c | Composer opened on "Choose Frequency" — classification before capture | Opens on the name; cadence defaulted and adjustable in place. `TaskForm.test.tsx` |
| UX-CM-02 | HIGH | P1c | Composer rendered inline in page flow: no sheet context, no visible Create | Now the shared `Modal`: one sheet, one dismiss, pinned Save. `TaskForm.test.tsx` |
| UX-CM-09 | MEDIUM | P1c | "DOMAIN" jargon, two dismiss controls, emoji priority, Save below the fold | "Area" label, one dismiss, Lucide `PriorityIndicator`, pinned Save. `TaskForm.test.tsx` |
| UX-OB-03 | HIGH | P1c | Onboarding pre-filled 'Main Checking' / 'Read for 15 mins' and committed them verbatim, manufacturing junk data by default | Both inputs start empty; suggestions are placeholders and opt-in chips; the handlers refuse to create an unnamed account/commitment. `OnboardingView.test.tsx` |
| UX-DS-01 | MEDIUM | P1c | Emoji used as functional icons, against `DESIGN_SYSTEM.md` ("Lucide React exclusively") | Priority (`PriorityIndicator`), streak milestones (Lucide `icon` field), the month-calendar priority dot and the ✓ status tick are all Lucide now; the mood faces are an explicit, documented illustration exception with accessible names. `TaskItem.test.tsx`, `streakUtils.test.ts`, `DESIGN_SYSTEM.md` |
| — | LOW | F1 | `ActionSheet` icons leaked into accessible names (`"+Add account"`) | `aria-hidden` on decorative icons |
| UX-ST-03 | MEDIUM | P2 | "USER IDENTIFIER" exposed the raw internal id as primary, unexplained information | Identity is the display name + email; the id lives behind Support → "Technical details", collapsed, explained and copyable. `ProfileSettings.test.tsx`, `TechnicalDetails.test.tsx` |
| UX-GL-02 | HIGH | P2 | Two independent settings entry points (dashboard gear + nav) | The dashboard gear is deleted — Settings is reachable from exactly one place. `DashboardView.test.tsx` |
| UX-GL-03 | MEDIUM | P2 | Two vocabularies for identical destinations (Dashboard/Commitments/Anchor AI/Finance/System vs Home/Tasks/Finance/Settings) | One vocabulary everywhere — Home / Commitments / Finance / Settings — in the sidebar, the mobile bar and the page titles. `bottomNavigationItems.test.ts`, `BottomNavigation.test.tsx` |
| UX-GL-05 | MEDIUM | P2 | Navigation reported no state (new insight invisible from the shell) | Exactly one low-noise dot, on Home, while the assistant has an unread insight; the state is in the accessible name and there are no numeric badges. `BottomNavigation.test.tsx` |
| UX-GL-06 | LOW | P2 | Environment-banner treatment undefined for every non-dev environment | Explicit per-environment treatments (development blue; staging amber, "STAGING — TEST DATA"); an absent or unknown env renders nothing, so it fails closed instead of guessing. `EnvironmentBanner.test.tsx` |
| UX-AI-04 | MEDIUM | P2 | The mood check-in lived inside the AI tab | Mood moved to the bottom of Home — adjacent to the assistant, deliberately not part of it. `DashboardView.test.tsx`, `FabricView.test.tsx` |
| UX-AI-09 | MEDIUM | P2 | Mood was the first interactive block in the assistant, and the nav grew to five items with AI on | The assistant is no longer a nav destination (the bar is exactly four), Home carries the "Ask Anchor" doorway, and mood is no longer in the assistant. `bottomNavigationItems.test.ts`, `DashboardView.test.tsx` |
| UX-AI-05 | MEDIUM | P2 | Transparency was routed but appeared in no navigation, so provenance was hidden | The assistant links to `/fabric/transparency` from its own header. `FabricView.test.tsx` |
| UX-AI-10 | MEDIUM | P2 | Transparency had no back affordance and never explained what it will learn | A back link to the assistant, plus copy that says what it learns from and when to expect a pattern. `FabricTransparency.test.tsx` |
| UX-ST-01 | HIGH | P3 | Nine chip-tabs over ten sections in one scroll; the last chip was clipped with no overflow affordance | Chips deleted; the hub is a grouped list with a search field, and nothing scrolls horizontally. `SettingsView.test.tsx`, `SettingsHub.test.tsx` |
| UX-ST-02 | HIGH | P3 | Sections were not addressable, so every "go to Settings" journey lost its target | `/settings/:section` with a real URL per section; state survives reload, back/forward and deep links; the registry is the single source of truth. `SettingsView.test.tsx`, `sections.test.ts` |
| UX-ST-04 | MEDIUM | P3 | Tall one-field cards; no dirty state, no validation, no confirmation, no search | Explicit save with inline validation, a visible "Unsaved changes", an in-place "Saved" confirmation, a hub search, and typed confirmation already in place for deletion. `ProfileSettings.test.tsx` |
| UX-ST-05 | MEDIUM | P3 | Assistant settings lived in Settings while the assistant lived elsewhere | The `assistant` section owns its behaviour and data sources and mirrors the assistant surface's transparency link. `SettingsView.test.tsx` |
| UX-ST-06 | MEDIUM | P3 | Ten sections in one continuous scroll behind nine anchor chips — no identity, no URL, no back behaviour | Each section is a destination with a title, a description and a back affordance; the ten-section scroll is gone. `SettingsView.test.tsx` |
| UX-GL-08 | LOW | P3 | Login offered Light/Dark while Settings offered Auto/Light/Dark plus text size and contrast — two controls, different stores | Appearance is changed in exactly one place (Settings → Preferences); the pre-auth toggle is removed and the login screen follows the saved theme. `AuthView.test.tsx` |



## Remaining (7) — grouped by the wave that will close them

### P1b — schedule-aware commitments engine · **in progress** (1 finding remains — `UX-CM-07`, partial; UX-AI-06, UX-AI-08, UX-CM-04, UX-CM-06, UX-CM-08 closed here, and its remaining shell findings UX-AI-04, UX-AI-09, UX-ST-03 and UX-GL-05 closed in P2)

This is the highest-leverage remaining work: it fixes the assistant's false statements **at the root** and makes streaks fair. **Landed in this wave:** the shared schedule model (`src/services/fabric/commitmentSchedule.ts`) — "today" now means *scheduled today or carried over*, so the assistant, the nav badge and the Today card share one definition and cannot disagree; the empty day is honest ("You have no commitments yet" / "Nothing due today — next up Mon") and its button offers the action it names.

| UX-AI-01 | HIGH | W-A1 | The assistant was an equal-weight card stack with the input near the **bottom**, after mood and insights | The input now sits directly under the Today block, and insights are capped at **3** ranked cards with a "showing 3 of N" note. `FabricView.test.tsx` |
| UX-AI-03 | MEDIUM | W-A1 | No continuity: one submission, one result, no thread, no "ask again", and no statement of which data the answer used | The section states its source ("Answered from your own commitments, accounts and recorded transactions"), keeps the last 3 exchanges readable under "Earlier", and every answer carries **Ask again**. `FabricQuerySection.test.tsx` |
| UX-GL-01 | HIGH | W-A1 | Anchor AI was unreachable when disabled | **CLOSED for the pre-merge state:** `/fabric` is addressable, the disabled state explains its value and its CTA deep-links to `/settings/assistant` (a routed, searchable section), and Settings → Assistant is the single switch. The separate destination disappears entirely with the Home merge (`W2`) |

| UX-FN-01 | HIGH | P3 | Two unlabelled "+" affordances, and an empty state instructing "Add your first transaction" with **no control at all** | The single `+` opens an action sheet naming both actions, and the empty state now carries its own primary action — the instruction and the control live together. `VirtualTransactionList.test.tsx`, `FinanceView.test.tsx` |
| UX-FN-02 | HIGH | P3 | Mixed-currency totals concatenated as one headline figure, with no per-currency labelling, no account count and no FX basis | Each currency is its own labelled row with its account count, and mixed currencies state "no exchange rate is applied". The decorative rise cue no longer adds NGN to USD either. `TotalAssetsSummaryBar.test.tsx` |
| UX-FN-03 | HIGH | P3 | Account creation and transaction recording were disconnected — no opening-transaction invitation, and no resulting position shown when recording | Creating an account now ends in a success state with one primary next step ("Record first transaction", preselecting the new account), and the transaction form shows the account's balance before → after. `AccountForm.test.tsx`, `TransactionForm.test.tsx` |
| UX-FN-04 | MEDIUM | P3 | The card stack exposed only a sliver of inactive accounts, with no comparable view | An "All accounts" list sits under the hero stack: compact rows (name · type · currency · balance) grouped by currency. Verified in the browser capture. `FinanceView.test.tsx` |
| UX-FN-06 | MEDIUM | P3 | The month pager, search and empty state formed an unlabelled cluster; an empty month never said *why* it was empty | The month control is labelled ("September 2026" with prev/next) and the empty state distinguishes three situations: no matches for this search, nothing this month, or nothing recorded at all. `VirtualTransactionList.test.tsx` |
| UX-FN-10 | MEDIUM | P3 | The landing defaulted to the current month, showing "No transactions yet" while the account held transactions in other months — no cue, no range widening | The empty state says "You have activity in <Month>" and offers a one-tap "Go to <Month>" that jumps the pager. `VirtualTransactionList.test.tsx`, `FinanceView.test.tsx` |

| ID | Sev | Finding | Note |
|---|---|---|---|
| UX-CM-07 | MEDIUM | Rows show no **next-due** (cadence, streak, notes preview and context badge already render) | **Partial.** Next-due needs `CM-17`'s date/interval model, so the remainder moves to `W-C3` |

### P1c — capture-first composer sheet · **CLOSED** (UX-CM-10, UX-CM-01, UX-CM-02, UX-CM-09, UX-OB-03 and UX-DS-01 all closed)

The composer work is done, and with it the two findings that were *not* about the composer but were left in this wave. **`UX-OB-03`:** onboarding no longer manufactures data — the account name and the habit title start **empty**, the suggested names live in placeholders and in opt-in suggestion chips, and both handlers refuse to create an unnamed record, so "nothing is created unless the user chooses it" is a property of the code rather than of the copy. **`UX-DS-01`:** the emoji-as-functional-icon sweep is complete — priority uses the shared `PriorityIndicator`, streak milestones carry a Lucide `icon` instead of an emoji field, the month-calendar priority dot and the ✓ status tick are Lucide, and the mood faces are recorded in `DESIGN_SYSTEM.md` as an explicit illustration exception with accessible names (so the rule now has one documented exception instead of an accidental contradiction).

### P2 — Home shell + assistant placement · **CLOSED for this slice** (UX-AI-04, UX-AI-05, UX-AI-09, UX-AI-10, UX-GL-02, UX-GL-03, UX-GL-05, UX-GL-06 and UX-ST-03 closed; UX-AI-01, UX-AI-03, UX-GL-01 and UX-GL-04 remain)

The shell and assistant-placement findings are done, and they were **one coherent change**: a nav that says one thing, in one vocabulary, with one state signal; a Home that owns the doorway to the assistant and the mood check-in; and a transparency page you can actually reach, leave, and understand. Four findings that the wave order had parked in P1b (`UX-AI-04`, `UX-AI-09`, `UX-ST-03`, `UX-GL-05`) were shell/assistant items and closed here instead.

| ID | Sev | Finding | Note |
|---|---|---|---|
| UX-AI-01 | HIGH | Assistant is an equal-weight card stack; the input sits below mood and insights | **Closed in W-A1** — the input now precedes the insights and mood has left the surface |
| UX-AI-03 | MEDIUM | No conversation continuity, no stated data scope | **Closed in W-A1** — source stated, thread kept, "Ask again" on every answer |
| UX-GL-01 | HIGH | Anchor AI unreachable when disabled | **Closed in W-A1** — `/fabric` is addressable, the disabled state's CTA deep-links to `/settings/assistant`; the separate destination goes with the Home merge (`W2`) |
| UX-GL-04 | MEDIUM | Bottom nav has no safe-area reserve, no FAB slot, no scroll behaviour | Remains — the floating pill nav and the contextual FAB are their own change |

### P3 — Settings hub · **CLOSED** (UX-ST-01, UX-ST-02, UX-ST-04, UX-ST-05, UX-ST-06 and UX-GL-08 all closed)

Settings is a hub with **real routes** now. `/settings` is a grouped, searchable index; every section is `/settings/<id>` with a title, a description and a back affordance. The nine-chip strip and the ten-section scroll are deleted, the section list lives in one registry (`src/features/settings/sections.ts`) that the hub, the router and every deep-linking call site share, and appearance is changed in exactly one place. Verified in the browser: the hub renders with its groups, and the evidence harness drives the real theme control through the new deep link `/settings/preferences`.

**Honest note on `UX-ST-04`:** explicit save, inline validation, in-place confirmation, hub search and typed confirmation for irreversible deletion all landed. A "recently changed" affordance did **not** — that is a new feature rather than a fix, and the finding's four named parts are covered.

### P3 — Finance landing · **CLOSED** (UX-FN-01, UX-FN-02, UX-FN-03, UX-FN-04, UX-FN-06 and UX-FN-10 all closed)

The Finance landing says what it means. Totals are **per currency, always labelled, with account counts** — and mixed currencies state plainly that no exchange rate is applied, so the UI never implies a conversion it cannot perform (`UX-FN-02`). Account creation ends in a success state with one primary next step that preselects the account it just made, and the transaction form shows the account's **balance before → after** (`UX-FN-03`). The hero stack keeps its Wallet feel while an **"All accounts"** list of compact, comparable rows sits beneath it, grouped by currency (`UX-FN-04`). The transaction empty state carries its own action (`UX-FN-01`) and distinguishes *why* it is empty — no search matches, nothing this month, or nothing recorded — offering a one-tap jump to the month that has the data (`UX-FN-06`, `UX-FN-10`). Verified in the browser: the capture shows `USD · 2 ACCOUNTS $10,000.00` and the "All accounts" rows.

### P3 — Onboarding rewrite (W6) · **D6 accepted — ready to build** (4 findings)

| ID | Sev | Finding |
|---|---|---|
| UX-OB-01 | HIGH | Skip semantics were inconsistent (behaviour fixed in F2; label polish remains) |
| UX-OB-02 | HIGH | Adjacent steps persist differently (`secureDb` vs `addTask`), inconsistent failure recovery |
| UX-OB-04 | MEDIUM | Five screens, one question each, no step names, no summary/undo; gate-contract change needed for a resumable "Finish later" |
| UX-OB-05 | MEDIUM | The getting-started ring is unlabelled, glows permanently, and **disappears silently at 100%** |

### Verification-first (cannot be scoped until answered)

| ID | Question to answer |
|---|---|
| UX-AI-06 | Is "No tasks scheduled today" a wrong statement or a wrong scheduling model? Read the `todayStats`/`briefing` derivation vs how `TaskList` decides "today" |
| UX-AI-07 | Why does the proactive card render a literal "?" — which icon lookup can miss? |
| UX-GL-07 | Are the devtools button, environment banner and "Developer Tools" section provably non-shippable? (Production hygiene — the only finding with that dimension) |

### Needs external input (not answerable from the repo)

| ID | Need |
|---|---|
| UH-SN04 / UH-SN05 | Real-device push delivery (physical devices) — unchanged since the §17 register |
| UX-FN-02 (conversion) | An FX-rate provider decision before any cross-currency consolidation is legitimate |
| Visual waves (P2/P3) | Mobbin-grade screen exports, per doc 21 §5 — sharpens the Wallet/Floating-nav work but does not block the principles already specified |

## Release & versioning status (answering the release question directly)

- **Mechanism exists and is workflow-driven**: `package.json` version → injected at build time via `src/version.ts` (`APP_VERSION`, `APP_ENV`) so a staging build and a production build report their own environment; bump scripts `version:dev` (`-dev` prerelease), `version:staging` (`-rc` prerelease), `version:production` (commit-and-tag-version); workflows **Staging Deploy** and **Production Release** both exist.
- **Fully automatic as of this wave — no manual bump step.** `.github/workflows/version.yml` runs on every merge to `master`: it derives the bump from Conventional Commits (`feat` → minor, `fix` → patch, `BREAKING` → major), commits `chore(release): <tag>`, pushes the commit + annotated tag, requests CI for the release commit (a `GITHUB_TOKEN` push does not trigger CI, and deploys require a CI-validated SHA), and publishes the GitHub Release. Loop-guarded and idempotent, so repeated runs are safe. Channels: `rc` (default/staging), `production` (final), `dev`.
- **Why it is a separate workflow:** both deploy workflows are dispatch-only, and `production.yml` is invariant-tested to never push, commit or version-bump master. `staging.yml` passes `--skip-version-bump` because `version.yml` owns the bump. Pushing to master still never mutates an environment.
- **Drift this fixes:** tags had fallen behind (`v1.20.6` newest vs `package.json` 1.20.16). The first automatic run reconciles this without anyone typing a version number.
- **Environment chain:** `dev` (local) → `staging` (deployed, smoke-tested green at the current tip) → `production` (**not deployed**; gated on the user's explicit approval for the FS-01/FS-04 migration and a production-mode dispatch).


