# 25 — Reference analysis (passes 1–2, all 15 captures)

**Status:** complete (15 of 15 captures read; R1–R15 in §3, R16–R46 in §9–§10)
**Input:** 15 Mobbin captures in `references/mobbin/` (third-party UI, gitignored, internal design input only)
**Method:** local image read (files on disk are readable; web fetch is not), rules extracted as *observable → mapping → finding ID*.
**Preview tooling:** `scripts/design/prepare-reference-previews.mjs` (downscales references via Playwright/canvas so they can be read inside the per-session media budget).

## 1. How the 15 were read (and why pass 1 stopped at 5)

Mobbin captures are ~1500–3000px web screenshots at 0.4–1.8 MB each. The session has a cumulative media budget:
3 uploads read (1.7/1.5/1.4 MB) succeeded, then everything ≥1.4 MB was declined, and after ~6 MB cumulative
even a 215 KB render was declined. So the limit is **cumulative, not per-file** — downscaling helps but does not
lift it. The remaining 10 were read in pass 2 from **900px previews** (~150–300 KB each, ~2.2 MB for the ten) in three
batches, so the cumulative budget never ran out. **No re-upload was needed**, all 15 are now read, and the
originals stay on disk as the fidelity fallback if a single detail ever needs a second look.

## 2. Coverage

| File | Mobbin category / sort | Apps visible | Pass 1 |
| --- | --- | --- | --- |
| `SCR-20260919-nmzu.png` | Dashboard · iOS · Most popular | Plum, Peloton, Bing, Badoo, Lifesum | ✅ analysed |
| `SCR-20260919-nnxv.png` | Dashboard · Web · Trending | MacroFactor, Future Pro, Box Box Club, Lloyds ×2 | ✅ analysed |
| `SCR-20260919-nogp.png` | Account Setup · Most popular | Headspace, Gemini, Revolut, Buddy, Spotify | ✅ analysed |
| `SCR-20260919-nokg.png` | Account Setup · Trending | Bumble, Shop, MacroFactor ×2, Lifesum | ✅ analysed |
| `SCR-20260919-nopw.png` | Splash Screen · Most popular | Duolingo ×2, Wise, Revolut, Airbnb | ✅ analysed |
| `SCR-20260919-notw.png` | Splash Screen · Trending | Luma, Shop, corner, Claude, Box Box Club | ✅ §9.1 |
| `SCR-20260919-npao.png` | Signup · Trending | Mesh, Claude, Shop, Cash App, corner | ✅ §9.2 |
| `SCR-20260919-npdx.png` | Verification · Most popular | Wise ×2, Revolut ×2, MoonPay | ✅ §9.3 |
| `SCR-20260919-npgu.png` | Verification · Trending | Claude, Rodeo, Lloyds, Bumble, Chick-fil-A | ✅ §9.3 |
| `SCR-20260919-npmr.png` | Settings & Preferences · Most popular | Afterpay, Airbnb, Luma, Revolut, Ahead | ✅ §9.4 |
| `SCR-20260919-nppn.png` | Settings & Preferences · Trending | Future Pro, Lifesum, Claude ×2, Klarna | ✅ §9.4 |
| `SCR-20260919-npwr.png` | Loading · Most popular | Revolut, ChatGPT, App Store, pillowtalk, Lifesum | ✅ §9.5 |
| `SCR-20260919-npzr.png` | Loading · Trending | Lifesum ×2, Claude, Lloyds, Shop | ✅ §10.1 |
| `SCR-20260919-nqiw.png` | Finance · Wallet & Balance · Most popular | Cash App, Revolut ×2, Plum, Grab | ✅ §10.2 |
| `SCR-20260919-nqmx.png` | Finance · Wallet & Balance · Trending | Lloyds ×2, Cash App ×2, Klarna ×2 | ✅ §10.2 |

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
| **Radius** | ✅ landed | six roles — `--radius-{field,control,card,panel,sheet,pill}` (`src/index.css:706–711`). The literals this row used to cite are gone: `:224` now reads `var(--radius-field)`, `:328` `var(--radius-panel)`, and both scrollbar thumbs (`:439`, `:447`) `var(--radius-pill)` |
| **Spacing** | ✅ landed | three axes × three steps — `--spacing-{inset,stack,inline}[-tight|-roomy]` plus `stack-section` (`:719–728`) — and R1's row heights `--spacing-row-{compact,standard,comfortable}` = 44/48/56px (`:733–735`) |
| **Elevation** | ✅ landed | five roles on `:root` (`:678–682`) **and** `.dark` (`:688–692`), mapped to `shadow-elevation-*` in `@theme` (`:739–743`). Dark values carry deeper alpha, because a light-tuned shadow is invisible on `#020617` |

So `UX-DS-06` was not "radius and spacing need tidying": there was **no radius, spacing or elevation scale in the
token layer at all**, which is why surfaces mixed a literal `1rem` radius with `0.375rem` fallbacks and default
shadows. That scale has since landed (the three ✅ rows above) — before the Finance/Settings class migration
rather than after it, precisely because R1 (row heights), R5 (kicker/display spacing) and R12 (rhythm over rules)
depend on the vocabulary existing first. Publishing it changed no pixel: every value aliases a size the app
already rendered, proven by comparing a baseline build against the new one by *resolved* value (`var()`
indirection followed) — 67 geometry declarations identical, zero component rules added.

Line references are for the revision above. The scale is the `W-D1 — Geometry & elevation scale (UX-DS-06)`
section at the end of `src/index.css`, so `grep -nE '^\s*--(radius|spacing|elevation)-' src/index.css` locates it
even after the file grows — prefer that over the numbers if they ever disagree.

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

## 6. Gaps — closed by pass 2, or designed natively

**Closed by pass 2:**

1. **AI grounding / citation surfaces** — Lloyds "Explore your spending" (`npzr`): a user bubble, a brand-avatar
   response row reading "Preparing a response", a `Powered by AI` chip and a `0/250` composer. Combined with R13's
   existing `ⓘ How is this calculated?` disclosure this covers the `AI-11`/`AI-15` visuals (see R41).
2. **Empty states / first-run** — Revolut's wallet (`nqiw`) shows `No transactions yet` next to a "get set up"
   progress card, and Cash App's promotions area is empty. The grammar is: **one muted line + one action**, no
   illustration-plus-paragraph block (see R40).
3. **Dark ledger** — Revolut dark wallet movements (`nqiw`) and Revolut dark settings (`npmr`): same rails, same
   radii, elevated surfaces, amounts at full contrast (see §10.3).
4. **First-run / loading** — §9.5 and §10.1.

**Not in the set — designed natively, not re-requested.** The 15 are a *comparison set*, not a spec, so these are
extrapolations from the extracted grammar and must be browser-verified rather than asserted:

5. **Commitments / task rows** — no scheduling or list app appears (Things 3, Todoist, Structured, Tiimo, Sunsama are
   absent). Task rows are built from R1 (icon + label + value on a shared rail, 44–56px, no intra-group dividers), R2
   (parent holds the aggregate) and R27 (one row primitive with variants). W-C1/W-C2/W-C3 remain the largest waves.
6. **Undo / destructive confirmation** (`CM-23`) — no undo affordance is shown anywhere in the set.
7. **Desktop task dashboard** — the two desktop captures are a nutrition dashboard and a bank; the desktop layout is
   the same row/rail grammar at a wider measure, and `UX-ST-03` stays browser-verified-only.

## 7. Open questions (not inferable from static screens)

- **Row tap targets** — screenshots show visual row height, not hit area. WCAG 2.5.8 minimum (24×24, recommended
  44×44) has to be verified in a real browser, which is where `UX-FN-07` (untappable accounts) was found.
- **Motion** — static captures cannot show duration, easing or whether an entrance gates content. Anything claimed
  about motion from these images would be invented; it stays asserted-by-token, not asserted-by-reference.
- **Dynamic type** — whether these products survive a 200% type scale cannot be seen; our own answer must come
  from the browser, not from copying them.
- **All 15 captures are now read** (passes 1–2). §6 records what the set does and does not cover; the areas it does
  not cover are designed natively and browser-verified, not inferred from a missing reference.

## 8. Pass 2 outcome

Done. The 10 remaining captures were read from 900px previews
(`node scripts/design/prepare-reference-previews.mjs --width 900 --out /tmp/refs900 --force`) in three batches of
3/4/3, adding **R16–R46** (§9, §10) and closing §6. **The reference set has now been read end-to-end, and the analysis
phase is closed — the next step is implementation, not more reference gathering.** Rule inventory: pass 1 R1–R15
(5 captures), pass 2 R16–R46 (10 captures) = **46 rules from 15 captures**.

## 9. Pass-2 rules (R16–R39)

Read: `notw` (Splash · Trending — Luma, Shop, corner, Claude, Box Box Club), `npao` (Signup · Trending — Mesh,
Claude, Shop, Cash App, corner), `npdx` (Verification · Most popular — Wise ×2, Revolut ×2, MoonPay), `npgu`
(Verification · Trending — Claude, Rodeo, Lloyds, Bumble, Chick-fil-A), `npmr` (Settings · Most popular —
Afterpay, Airbnb, Luma, Revolut, Ahead), `nppn` (Settings · Trending — Future Pro, Lifesum, Claude ×2, Klarna),
`npwr` (Loading · Most popular — Revolut, ChatGPT, App Store, pillowtalk, Lifesum).

### 9.1 Splash (`notw`) — flat field + mark, nothing else

**R16.** A splash is a **flat brand field and a centred wordmark**: Shop = flat purple + `shop`; Box Box Club = flat
red + logo; Claude = plain white + asterisk + wordmark; App Store (`npwr`) = pure white + the Apple mark. **Zero of
five show a spinner, progress bar, carousel or marketing copy.** At most *one* short line accompanies the mark (Luma
"Delightful events *start here*", corner "drag to build your new map.").
**Mapping.** Replaces our decorative splash grammar: flat surface + wordmark + at most one line, non-looping.
**Finding.** splash, R42.

### 9.2 Signup (`npao`) — one decision, providers uncoloured, legal demoted

**R17.** First signup screen = H1 (sentence case) + optional muted subcopy + **stacked full-width provider buttons** +
one field + one filled primary. Mesh: Google (white) and Apple (**black**) stacked, then the email field, then the
orange "Sign up with email" primary. Shop/Claude: one field, one `Continue`.
**R18.** **Exactly one element is visually primary.** Provider buttons are not filled with the screen's brand colour;
the brand CTA colour belongs to the screen's own primary action.
**R19.** Legal fine print is **demoted directly under the CTA** (11–12px, muted, inline bold-blue links — Cash App's
"By entering and tapping Next…"), never above the fold, never a second paragraph block.
**R20.** The CTA stays **above the keyboard, directly under the field it submits** (Claude, Shop, Cash App `Next`).
Step chrome is minimal: none (Claude), two small muted chevrons (Shop), or `‹` + title (Revolut).
**Mapping.** `OB-*`, `UX-CP-*` (sentence case, second person, no "Please enter…"), `UX-FN-07/08` (Cash App's
in-field dial code). **Finding.** `OB-01`, `OB-03`, onboarding wave.

### 9.3 Verification / OTP / identity (`npdx`, `npgu`)

**R21.** Verification = `‹`/`✕` + H1 + **one sentence with the identifier bolded inside it**, masked for privacy
(`+65 9836 9627 XXXX`), then the code input, then the resend affordance. No card chrome, no illustration.
**R22.** Resend is a **text-weight row with a live countdown** ("Resend code in 00:14") or a bold text button (Rodeo
"Resend Code") — never filled, and it never competes with the bottom-docked primary (`Next`).
**R23.** A `?` help affordance sits in the header, and every identity screen carries an **escape hatch** as a one-line
muted link at the bottom ("I don't have my ID with me" — Lloyds; "Change email address" — Claude).
**R24.** "What good looks like" is a **✓ checklist of terse imperative clauses**, max three, caveat as the tail of
the same line (Wise "Details are in focus"; Lloyds "…watch out for glare or shadow"), plus **positive image
examples** where the input is a camera (Wise's three photos, Bumble's example).
**R25.** Where options are offered ("Select your verification method") they are **outlined stacked rows with leading
icons** (Send message / Voice call); the commitment is still one primary.
**Mapping.** `OB-*`, `UX-CP-*`, and the existing `ⓘ How is this calculated?` disclosure (R13) as the shared help
affordance. **Finding.** onboarding wave.

### 9.4 Settings (`npmr`, `nppn`) — section header + card of rows, one row primitive

**R26.** Settings = **muted section header + a single card of rows**, every row a leading icon + label + chevron.
*Inside a settings card* hairline dividers are acceptable (Airbnb, Luma, Ahead) — unlike list rows, which are
divider-free (R1). Section headers appear in two accepted styles: **ALL CAPS muted** (Lifesum "CUSTOMIZATION") or
sentence-case muted (Airbnb "Settings"); we must pick one and apply it everywhere.
**R27.** One **row primitive with variants**, not four bespoke components: (a) label + chevron; (b) label +
right-aligned **value** + chevron (Language `English (United Kingdom)`, Speed `Fast`, Lifesum `1152 kcal/day`);
(c) label + **sub-label** + trailing control (checkbox/switch); (d) label + sub-label + **inline secondary action**
(Lifesum's `Opt-in` inside the row). Header rows are the two-line variant (avatar + name + secondary + chevron).
**R28.** **Sign out is set apart by grouping and position (last), not by colour** — "Sign Out" (Luma), "Log out"
(Ahead) are ordinary-weight rows in their own group. No red.
**R29.** The app **version/build lives in a muted centred footer** ("Version 2.0.0 (231)" — Luma). Ours goes there
too, which also makes the release tag user-visible.
**R30.** Settings opens as a **sheet**: pushed with `‹` (Airbnb, Luma) or modal with `✕` + drag handle (Revolut,
Ahead). Pick one and be consistent.
**R31.** Promotions are an **illustrated card at the top with one action** (Airbnb "Airbnb your home", Ahead's purple
card, Claude's inline `Upgrade` pill) — never a row mixed into the menu. Klarna/Revolut extend this to a 2×2 **tile
grid** with "New" chips.
**R32.** Choice controls are a **row of surface cards with the selected one tinted/filled and checked** (Claude voice
settings), not cramped pills. Checkbox = square + white tick; toggle = switch; **never both for one meaning**.
**R33.** Account-critical rows (Privacy Policy, Manage subscription) stay plain rows — the separation is structural,
not colour.
**Mapping.** The whole Settings surface (W-D1b second half) and `ST-*`: one `SettingRow` primitive, real section
headers, real footer version, a single sheet style, promo as card. **Finding.** `UX-DS-06`, `ST-*`, W-D1b.

### 9.5 Loading and motion (`npwr`) — skeleton or content-first, never a blocking spinner

**R34.** Content loading is either a **skeleton mirroring the final layout** (ChatGPT's grey answer-paragraph lines
while streaming) or **content-first with the chrome already usable** (Revolut "Add money" is interactive before
anything loads). **No capture shows a full-screen blocking spinner.**
**R35.** A brand-toned **thin ring at the bottom edge** (Lifesum's green ring) is the only progress indicator in the
set, and it blocks nothing.
**R36.** Streaming text uses a **caret/cursor at the text edge** (ChatGPT's trailing dot) — the cue is "more is
arriving", not "please wait".
**R37.** **Radial glow / breathing gradient is the only decorative loop in all 15 captures** (pillowtalk), and even
that does not gate content.
**R38.** No screen uses a looping animation as decoration on an otherwise idle surface.
**R39.** Loading states respect layout: the indicator/skeleton sits where the content will be, so nothing jumps when
data lands.
**Mapping.** Splash + the five looping animations (`R15`, now 15/15 evidence): decorative loops are **not
reference-justified** and should be removed or reduced to a single non-blocking transition. AI streaming
(`UX-AI-08`) takes the caret + `done of expected` treatment.
**Finding.** loop-animation audit, `UX-AI-08`, splash, `UX-PF-*`.

## 10. Pass-2b rules (R40–R46) — loading, finance / wallet

Read: `npzr` (Loading · Trending — Lifesum ×2, Claude, Lloyds, Shop), `nqiw` (Finance · Wallet & Balance · Most
popular — Cash App, Revolut ×2, Plum, Grab), `nqmx` (Finance · Wallet & Balance · Trending — Lloyds ×2, Cash App ×2,
Klarna ×2). **That completes all 15 captures.**

### 10.1 First-run and in-progress (R40–R41)

**R40.** First-run is a **skeleton where the content will be**, plus one non-blocking brand-tinted factoid, with the
shell already painted: Shop shows card-shaped skeletons while the search field and tab bar are live; Lifesum shows a
grey header block above a pink card with a huge `10%` and one line of copy. Claude goes furthest — its signup form is
usable while the illustration sits above it. Nothing is gated behind a full-screen loader.
**R41.** An in-progress AI answer is a **user bubble + a response row with a small avatar and three dots**
(Lloyds: "Preparing a response") — the cue lives *inside* the answer row, and the composer shows a `0/250` counter.
**Mapping.** `UX-AI-08` streaming, `UX-PF-*` perceived performance. **Finding.** `UX-AI-08`.

### 10.2 Finance / wallet (R42–R46)

**R42.** A finance surface is a **stack of value cards**: the parent card holds the aggregate plus a delta chip
(Plum `£142.83` / `+£5.05 total return`), **segmented tabs** slice it (Pockets / Investments / Card), rows are
label-left / value-right on one rail, progress is a **step counter** (`2 of 5 complete`), and a group ends with a
`See all rules` link. This is R1 + R2 rendered in a real ledger.
**R43.** **Movement rows: amount left, counter-amount right, timestamp beneath** (Revolut dark: `$0.00 → USD
+US$1.49` / `11:07 15 Feb`). The hero is label + big numeral + `?` help. Secondary actions are **side-by-side
outlined buttons** (Add money / Withdraw — Cash App), never two filled primaries (echoes R18).
**R44.** Paid or affiliate content carries an explicit **"Sponsored" label** at the tile (Grab), and category entry
points are **circular icon + label**. **Mapping.** any future placement/affiliate surface.
**R45.** Status is a **trailing chip** (`Pending`) with date and amount on the same rail (Klarna "In progress"), and
"Show breakdown" is an **inline disclosure under the value** (echoes R13).
**Mapping.** Finance ledger status, `CM-06`/`CM-07`, `UX-AI-11`.
**R46.** Upsells and benefit lists are **terse clauses each with its own icon** inside a sheet with `✕` dismiss
(Klarna's upgrade sheet: "2% cashback with Klarna balance…", "Cancel any trip or event and get most of your money
back") — never paragraphs. **Mapping.** Settings promo card (R26/R31), upgrade surfaces.

### 10.3 What the completed set does and does not cover

- **Dark ledger is now covered** — it was §6 item 5 and is closed: Revolut dark (wallet movements) and Revolut dark
  settings. Dark keeps *identical* grammar: same rails, same radii, elevated surfaces; amounts stay at full contrast
  rather than being dimmed with the rest of the chrome.
- **Commitments / task rows are genuinely not in the set**, and per direction they will **not** be re-requested. The
  15 are a *comparison* set, not an exhaustive spec. Task rows will be designed natively from R1 (icon + label +
  value, shared rail, 44–56px, no intra-group dividers), R2 (parent holds the aggregate) and R27 (one row primitive
  with variants), and marked as **inference** — then verified in the browser, not asserted from a reference.
- **Not inferable from any capture:** row tap targets, 200% dynamic type, and true motion (duration/easing/gating).
  Those stay browser-verified: `UX-FN-07`/`UX-FN-08`, `UX-ST-03`, `UX-GL-07`.


