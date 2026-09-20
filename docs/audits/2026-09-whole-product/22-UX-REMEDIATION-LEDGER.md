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
| Closed | **30** (+1 unnumbered accessibility side-fix in the shared `ActionSheet`) |
| Remaining | **31** |
| Waves merged to `master` | F1 (finance), F2 (onboarding), P1a (commitments legibility), P1d (quick findings), P1b (partial — UX-AI-06), P1c (composer + onboarding defaults + emoji sweep) |
| Deployed | `master` `5270bfb7` / `v1.21.0-rc.19` → **staging**, Release Smoke green. **Production undeployed.** |
| Decisions | **D1–D14 ACCEPTED 2026-09-18** (doc 18 §7, doc 20 §7.4, doc 21 §6) — no wave is decision-blocked any more |

## Closed (30)

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

## Remaining (31) — grouped by the wave that will close them

### P1b — schedule-aware commitments engine · **in progress** (5 findings remain; UX-AI-06, UX-AI-08, UX-CM-04, UX-CM-06, UX-CM-08 closed)

This is the highest-leverage remaining work: it fixes the assistant's false statements **at the root** and makes streaks fair. **Landed in this wave:** the shared schedule model (`src/services/fabric/commitmentSchedule.ts`) — "today" now means *scheduled today or carried over*, so the assistant, the nav badge and the Today card share one definition and cannot disagree; the empty day is honest ("You have no commitments yet" / "Nothing due today — next up Mon") and its button offers the action it names.

| ID | Sev | Finding | Note |
|---|---|---|---|
| UX-CM-07 | MEDIUM | Rows show no **next-due** (cadence, streak, notes preview and context badge already render) | **Partial.** Next-due needs `CM-17`'s date/interval model, so the remainder moves to `W-C3` |
| UX-AI-09 | MEDIUM | Mood is the first interactive block in the assistant; nav grows to 5 items with AI on | Mood relocates; nav stays at 4 |
| UX-AI-04 | MEDIUM | Mood check-in lives inside the AI tab | Same edit as UX-AI-09 |
| UX-ST-03 | MEDIUM | "USER IDENTIFIER" exposes the raw internal id | Move behind "About → technical details" |
| UX-GL-05 | MEDIUM | Navigation signals nothing (no dot for new insights/due items) | One Status Dot on Home |

### P1c — capture-first composer sheet · **CLOSED** (UX-CM-10, UX-CM-01, UX-CM-02, UX-CM-09, UX-OB-03 and UX-DS-01 all closed)

The composer work is done, and with it the two findings that were *not* about the composer but were left in this wave. **`UX-OB-03`:** onboarding no longer manufactures data — the account name and the habit title start **empty**, the suggested names live in placeholders and in opt-in suggestion chips, and both handlers refuse to create an unnamed record, so "nothing is created unless the user chooses it" is a property of the code rather than of the copy. **`UX-DS-01`:** the emoji-as-functional-icon sweep is complete — priority uses the shared `PriorityIndicator`, streak milestones carry a Lucide `icon` instead of an emoji field, the month-calendar priority dot and the ✓ status tick are Lucide, and the mood faces are recorded in `DESIGN_SYSTEM.md` as an explicit illustration exception with accessible names (so the rule now has one documented exception instead of an accidental contradiction).

### P2 — Home merge + shell · **D1/D2 accepted — partially closed** (9 findings remain; UX-DB-02, UX-DB-03, UX-DB-04, UX-DB-05 and UX-AI-07 closed)

| ID | Sev | Finding |
|---|---|---|
| UX-AI-01 | HIGH | Assistant is an equal-weight card stack; the input sits below mood and insights |
| UX-AI-03 | MEDIUM | No conversation continuity, no stated data scope |
| UX-AI-05 | MEDIUM | Transparency page unreachable from the assistant |
| UX-AI-10 | MEDIUM | Transparency has no back affordance and no explanation of what it will learn |
| UX-AI-07 | MEDIUM | Proactive card renders a literal **"?"** where an icon should be (**verify first**) |
| UX-GL-01 | HIGH | Anchor AI unreachable when disabled (partly eased by P1d) |
| UX-GL-02 | HIGH | Two settings entry points (dashboard gear + nav) |
| UX-GL-03 | MEDIUM | Two vocabularies for the same destinations (Home/Tasks vs Dashboard/Commitments/System) |
| UX-GL-04 | MEDIUM | Bottom nav has no safe-area reserve, no FAB slot, no scroll behaviour |
| UX-GL-06 | LOW | Environment banner treatment undefined for non-dev |

### P3 — Settings hub · **D4 accepted — ready to build** (6 findings)

| ID | Sev | Finding |
|---|---|---|
| UX-ST-01 | HIGH | Chip bar overflows; the last of **nine** chips is clipped with no affordance |
| UX-ST-02 | HIGH | Sections are not addressable — "go to Settings" journeys lose their target |
| UX-ST-06 | MEDIUM | **Ten** sections render in one continuous scroll behind nine anchor chips |
| UX-ST-04 | MEDIUM | Low density; no save/dirty state, no search, no "recently changed" |
| UX-ST-05 | MEDIUM | AI settings live in Settings while the AI surface lives elsewhere |
| UX-GL-08 | LOW | Login offers theme toggles while Settings offers Auto/Light/Dark + text size + contrast |

### P3 — Finance Wallet visuals (F2/F3 of doc 21) · **D5/D12/D13 accepted — ready to build** (6 findings)

| ID | Sev | Finding |
|---|---|---|
| UX-FN-01 | HIGH | Two unlabelled "+" affordances; empty state instructed an action with no control |
| UX-FN-02 | HIGH | Mixed-currency totals concatenated as one headline figure |
| UX-FN-03 | HIGH | Account creation and transaction recording are disconnected |
| UX-FN-04 | MEDIUM | Overlapping card stack hides accounts; no comparable view |
| UX-FN-06 | MEDIUM | Month pager/search/empty state give no signal whether data exists elsewhere |
| UX-FN-10 | MEDIUM | Empty month looks like "no data" while transactions exist in other months |

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


