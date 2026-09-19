# 25 — Reference analysis, pass 1

**Status:** partial (5 of 15 uploads analysed; remainder queued for pass 2)
**Input:** 15 Mobbin captures in `references/mobbin/` (third-party UI, gitignored, internal design input only)
**Method:** local image read (files on disk are readable; web fetch is not), rules extracted as *observable → mapping → finding ID*.
**Preview tooling:** `scripts/design/prepare-reference-previews.mjs` (downscales references via Playwright/canvas so they can be read inside the per-session media budget).

## 1. Why only 5 of 15

Mobbin captures are ~1500–3000px web screenshots at 0.4–1.8 MB each. The session has a cumulative media budget:
3 uploads read (1.7/1.5/1.4 MB) succeeded, then everything ≥1.4 MB was declined, and after ~6 MB cumulative
even a 215 KB render was declined. So the limit is **cumulative, not per-file** — downscaling helps but does not
lift it. The remaining 10 uploads stay on disk and are read first thing in pass 2; **no re-upload is needed**.

## 2. Coverage

| File | Mobbin category / sort | Apps visible | Pass 1 |
| --- | --- | --- | --- |
| `SCR-20260919-nmzu.png` | Dashboard · iOS · Most popular | Plum, Peloton, Bing, Badoo, Lifesum | ✅ analysed |
| `SCR-20260919-nnxv.png` | Dashboard · Web · Trending | MacroFactor, Future Pro, Box Box Club, Lloyds ×2 | ✅ analysed |
| `SCR-20260919-nogp.png` | Account Setup · Most popular | Headspace, Gemini, Revolut, Buddy, Spotify | ✅ analysed |
| `SCR-20260919-nokg.png` | Account Setup · Trending | Bumble, Shop, MacroFactor ×2, Lifesum | ✅ analysed |
| `SCR-20260919-nopw.png` | Splash Screen · Most popular | Duolingo ×2, Wise, Revolut, Airbnb | ✅ analysed |
| `SCR-20260919-notw.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-npao.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-npdx.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-npgu.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-npmr.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-nppn.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-npwr.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-npzr.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-nqiw.png` | — | — | ⏳ pass 2 |
| `SCR-20260919-nqmx.png` | — | — | ⏳ pass 2 |

## 3. Extracted rules

### R1 — Row grammar: label left, value right, no divider inside a group
**Observable.** Plum (Pockets £9.55 / Investments £133.28 / Pensions / Card), Bing (Rewards rows), Box Box Club
(`01 POS`, `179 PTS`), Lloyds Breakdown (savings rows) all use the *same* row: optional small icon, label left,
value right-aligned on a shared right rail, identical baseline, **no horizontal rule between rows**.
Groups are a single card; rows are 44–56px tall.
**Mapping.** Direct basis for `CM-06`/`CM-07` (kill the 175px rows and the grey dash) and for the W-D1b Finance
ledger rows + account passes. One `Row` primitive serves Finance, Settings and the Done history.
**Finding.** `CM-06`, `CM-07`, `UX-DS-06`, W-D1b.

### R2 — The parent row carries the aggregate
**Observable.** Lloyds: `Total £1,000.00`, then `Savings Interests £1,000.00 ⌄` expanding to children; group
headers show the group sum right-aligned on the same rail as the children.
**Mapping.** Category grouping in `CM-21` smart views and Finance account passes (account row = balance,
children = movements). Do **not** invent a separate total row when the parent can hold it.
**Finding.** `CM-21`, W-D1b.

### R3 — State is carried by shape, not by the letter
**Observable.** Peloton week strip: `M T W T F S S` with completed days as **filled circles** and future days as
outlined grey circles. MacroFactor weekly chart: the selected day's column gets a rounded rectangle around it
while the letters below stay unchanged labels. Lifesum day card: `‹ TODAY, JULY 27 ›`.
**Mapping.** This is the fix shape for `CM-18`. Our cadence strip currently makes the letter the only carrier of
state, so `T` (Tue *and* Thu) and `S` (Sat *and* Sun) are genuinely ambiguous. Fix = real weekday indexes in the
data **and** a filled/outlined marker per day with the letter demoted to a label.
**Finding.** `CM-18`, `UX-AI-06`.

### R4 — "current / target" with the target muted
**Observable.** Lifesum macros (`271/359g`, `207/143g`, `133/96g`) and MacroFactor (`539 of 2041`, `24 of 137`)
put the numerator in primary text, the limit in muted text, and a thin progress bar directly underneath.
**Mapping.** Exactly the shape for the expected-occurrence completion metric (`UX-AI-08`) and the
`FabricTodayCard` headline. Never a bare percentage — always `done of expected`.
**Finding.** `UX-AI-08`, W-A1.

### R5 — Kicker above a display title
**Observable.** MacroFactor web: `TUESDAY, JUNE 30` (small caps, muted) above `DASHBOARD` (display, all caps).
**Mapping.** Cheap W-D1b win for the Dashboard/Settings headers; establishes date/context without spending a
hero slot.
**Finding.** `UX-DS-06`, W-D1b.

### R6 — One segmented pattern per product, never two
**Observable.** Active view state is shown either as a dark filled pill (MacroFactor `Consumed | Remaining`) or an
underline (Badoo `Plans | Safety`), never both; Lloyds `Money | Extras` uses the dark pill; MacroFactor height
uses a segmented unit switch (`Feet and Inches | Centimeters`).
**Mapping.** Pick **dark pill** for AnchorOS and use it for `CM-21` smart views and `CM-17` unit/interval
switching. Underline stays reserved for tabs in the shell.
**Finding.** `CM-21`, `CM-17`, `UX-DS-06`.

### R7 — Status is a chip, never a row tint
**Observable.** Gemini attaches a `Pending` chip to *"You verified your identity"*; Bing shows an `Approved`
green pill beside a banner row. The row itself stays neutral.
**Mapping.** Verification/onboarding rows (`OB-03`) and commitment state (expected vs done) — keep the row neutral
and attach one chip with a single word.
**Finding.** `OB-03`, W-C3.
### R8 — Every ask carries its benefit line
**Observable.** Gemini ("Complete these tasks to get the most out of your Gemini account"), Revolut ("We need to
know this for regulatory reasons. And also, we're curious!"), Buddy ("…so we can customise the app for your
needs"), Lifesum ("This helps us personalize your daily recommendations") — one muted sentence under the heading
or directly above the primary button.
**Mapping.** The W-C1 one-sheet and `OB-03` steps need this for the "Category" rename and the reminder-time ask
(exact-time asks look like interrogation without a reason).
**Finding.** W-C1, `OB-03`, `DS-01`.

### R9 — Put the quantity rule in the title, progress in the footer
**Observable.** Spotify: *"Choose 3 or more artists you like."* Bumble: *"Pick up to 3 to find friends with shared
experiences."* with `2/3 selected` sitting next to the advance chevron in the footer.
**Mapping.** Cadence selection in W-C1 and `CM-17` interval steps. The counter belongs beside the action, not in
the header — it tells you whether you may advance.
**Finding.** W-C1, `CM-17`.

### R10 — Dock one primary action, style the disabled state honestly
**Observable.** Headspace, Shop, MacroFactor, Lifesum, Revolut, Buddy all pin a single full-width primary button
at the bottom; Revolut renders its disabled `Continue` in a pale tint rather than hiding or greying it out
ambiguously.
**Mapping.** Single sticky Save / `CM-16` instant add. One primary action per screen, bottom-docked, real
disabled styling.
**Finding.** `CM-16`, W-C1.

### R11 — Skip is a first-class control
**Observable.** Bumble `Skip`, Shop `Skip` — both visible in the flow chrome, not buried as a text link.
**Mapping.** Onboarding and optional capture steps.
**Finding.** `OB-03`, W-C1.

### R12 — Density comes from rhythm, not from rules
**Observable.** MacroFactor, Bing and Lloyds carry a lot of numbers with **zero table borders**: grouping by card,
spacing for separation, 12px muted captions, tabular numerals, one shared right rail for all values.
**Mapping.** The Finance ledger legibility work (`UX-DS-06` spacing scale) — our current surfaces lean on borders
and large heights instead of rhythm.
**Finding.** `UX-DS-06`, W-D1b, P1a follow-up.

### R13 — Every derived number has an "explain this" affordance
**Observable.** Lloyds: `ⓘ How is this calculated?` directly under the donut; box Box Club exposes a `Timeline`
pill for the same reason.
**Mapping.** This is the *existing* affordance pattern for grounding. `UX-AI-11` / `AI-15` (tap-to-cite) should
reuse it rather than invent a new disclosure metaphor.
**Finding.** `UX-AI-11`, `AI-15`.

### R14 — Utility actions live next to the field they act on
**Observable.** MacroFactor web: search field with an inline barcode-scan icon and a sparkle (AI) button in the
same row.
**Mapping.** Capture quick-add row in W-C1.
**Finding.** W-C1, `CM-16`.

### R15 — Splash screens carry brand only
**Observable.** Duolingo, Wise, Revolut, Airbnb: a logo or wordmark, one value line at most ("Learn for free.
Forever."), **no spinner choreography, no looping motion**.
**Mapping.** Confirms the motion law (doc 24 §5): the five decorative loop animations we are auditing have no
commercial precedent in this set. Nothing gets gated on an entrance animation.
**Finding.** `UX-DS-06` loop-animation audit, W-D1b.
## 4. Token evidence for `UX-DS-06` (from `src/index.css`, this revision)

| Layer | State | Evidence |
| --- | --- | --- |
| Role aliases (12-step) | ✅ landed | `--surface-base/raised/sunken/hover/active/border`, `--border-subtle`, `--border-interactive`, `--solid`, `--solid-hover`, `--text-primary/secondary/muted` (`src/index.css:541–555`) |
| Motion duration | ✅ landed | `--duration-micro: 140ms`, `--duration-sheet: 200ms`, `--duration-balance: 250ms` (`:624–626`) |
| Motion easing | ✅ landed | `--ease-standard/enter/exit` (`:627–629`) |
| **Radius** | ❌ **not tokenised** | `var(--radius-md, 0.375rem)` with a hard fallback (`:224`), hardcoded `border-radius: 1rem` (`:328`), `9999px` scrollbars (`:439`, `:447`) |
| **Spacing** | ❌ **not tokenised** | no `--space-*` scale exists at all |
| **Elevation** | ❌ **not tokenised** | only Tailwind default `--shadow-sm…2xl` (`:125–130`) — no semantic elevation roles |

So `UX-DS-06` is not "radius and spacing need tidying": there is **no radius, spacing or elevation scale in the
token layer**, which is why surfaces are mixing a literal `1rem` radius with `0.375rem` fallbacks and default
shadows. R1 (row heights), R5 (kicker/display spacing) and R12 (rhythm over rules) all depend on that scale
existing first, so the scale lands **before** the Finance/Settings class migration, not after it.

## 5. What pass 1 changed in the plan

- `CM-06`/`CM-07` are no longer "make rows shorter": R1 gives the replacement row grammar (icon + label + value
  on a shared rail, 44–56px, no dividers inside a group) and R2 says the parent row holds the aggregate.
- `CM-18` is no longer just "fix the letters": R3 shows the industry answer is to carry state with a
  filled/outlined shape and demote the letter to a label. Both halves are required.
- `UX-AI-08` gets a concrete visual: `done of expected` with the denominator muted and a thin bar (R4).
- `UX-AI-11`/`AI-15` should reuse the existing `ⓘ How is this calculated?` disclosure pattern (R13) rather than a
  new citation metaphor.
- The loop-animation audit is now evidence-backed: no splash/hero in the reference set uses looping decorative
  motion (R15).
- `UX-DS-06` is promoted to a **prerequisite** of the W-D1b class migration (§4).

## 6. Still missing (priority order for the next upload)

1. **Commitments / task rows and capture** — Things 3, Todoist, Apple Reminders, Structured, Tiimo, Motion,
   Sunsama. *None of the 15 cover a scheduling or list surface*, and W-C1/W-C2/W-C3 are the largest remaining
   waves. This is the highest-value gap.
2. **AI citation / grounding surfaces** — Perplexity, ChatGPT, Notion AI, Copilot (for `AI-11`, `AI-15`).
3. **Empty states / first-run** — we just shipped `EmptyState.tsx`; no empty state appears in the 15.
4. **Undo / destructive confirmation** (`CM-23`) — nothing in this set shows an undo affordance.
5. **Dark ledger** — only Box Box Club is dark and it is a sports screen, so there is no dark-mode finance
   reference to check our dark tokens against.
6. **Desktop task dashboard** — Linear / Height / Asana, for the assistant and commitments web layout. The two
   desktop references here are a nutrition dashboard and a bank.

## 7. Open questions (not inferable from static screens)

- **Row tap targets** — screenshots show visual row height, not hit area. WCAG 2.5.8 minimum (24×24, recommended
  44×44) has to be verified in a real browser, which is where `UX-FN-07` (untappable accounts) was found.
- **Motion** — static captures cannot show duration, easing or whether an entrance gates content. Anything claimed
  about motion from these images would be invented; it stays asserted-by-token, not asserted-by-reference.
- **Dynamic type** — whether these products survive a 200% type scale cannot be seen; our own answer must come
  from the browser, not from copying them.
- **The unread 10 uploads may already cover §6** for their categories — content is not inferable from filenames,
  so §6 is provisional until pass 2 reads them.

## 8. Pass 2 plan

Read the remaining 10 uploads (downscaled previews via `scripts/design/prepare-reference-previews.mjs`), then
extend §3 with a second rule set and re-rank §6. No re-upload required.


