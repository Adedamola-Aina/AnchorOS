# 24 — Design excellence: research, principles, and the per-surface strategy

Date: 2026-09-19 · Companion to docs 18–23. Doc 23 fixed *what* we build and in what order; this document fixes **how it must look, move, feel and sound** — derived from research, not taste.

## 1. Why this document exists

Your instruction: do not build in isolation; study what award-winning apps do; aim for clean, beautiful, functional work — "not AI slop"; and apply that standard to **Dashboard + Anchor AI**, **Settings** and **Finance**. It also answers the bank-statement-import request with evidence instead of enthusiasm.

**Method and honest limits**

| Source | What I took | Status |
|---|---|---|
| Apple Design Awards — 2026 and 2025 winners' write-ups (developer.apple.com/design/awards) | Apple's own words about *why* each winner won, across the categories Delight and Fun, Inclusivity, Innovation, Interaction, Social Impact, Visuals and Graphics | Read in full |
| NN/g — "The Aesthetic-Usability Effect" (Moran, 2024; Kurosu & Kashimura 1995; Norman 2004) | Evidence that beauty changes perceived usability — and its limits | Read in full |
| NN/g — "The Role of Animation and Motion in UX" (Laubheimer, 2020) | What motion is *for*, and when it becomes a dark pattern | Read in full |
| Apple Human Interface Guidelines; Material colour system | Both are JavaScript-gated and returned no content | **Not read** — I will not cite them as if I had |
| OFX/QFX/QIF background (Wikipedia; FDX spec v2.3) and Plaid Transactions + Statements docs | How statements and transactions actually arrive, and what the market does | Read in full |

Anything below that is general design practice rather than a sourced finding is marked **(practice)**.

## 2. What Apple actually praises in award winners

Apple's write-ups are unusually specific, and the same traits recur.

| Winner (year, category) | What Apple praised | Principle |
|---|---|---|
| **grug** (2026, Delight and Fun) | "a little masterpiece of **clever simplicity that never takes itself too seriously**"; a hand-drawn status bar; "**no login, no cloud syncing, nothing extraneous** — just a simple idea" | **Remove the extraneous.** Simplicity *is* the feature; playfulness lives in details, never in extra steps. |
| **Lumy** (2025, Delight and Fun) | "**simple design, carefully curated color palette**, elegant widgets and Live Activities"; "quick and intuitive" | **A curated palette, not many colours.** One idea per surface, answerable at a glance. |
| **Denim** (2025, Delight and Fun) | "seamless SwiftUI-built experience, with **smooth scroll transitions** and elegant text and **mesh gradients**"; custom **haptics**; "intelligent cropping"; "**depth** effects" | **Sensory craft where it means something** — motion, haptics and depth support content instead of decorating it. |
| **CapWords** (2025, Delight and Fun) | "an idea that's as simple as it is revolutionary"; each card transition carries "a **real-world sound**, a little tweak that enhances the sensory experience (**and helps the word stick**)" | **Sound/haptics only when they aid comprehension or memory** — not for entertainment. |
| **Blippo+** (2026) | "**incredible attention to world-building details**, reviving ancient graphics, fonts, and buttons down to the last enormous pixelated digit" | **Cohesion to the last pixel.** One visual language, executed everywhere. |
| **SILT** (2026, Visuals) | a "haunting **monochrome** art style that makes stunning use of light and shadow"; "**meticulously designed** … punches well above its weight" | **Restraint scales.** A narrow palette executed precisely beats a broad one executed loosely. |
| **Neva** (2025, Visuals) | "**each level has its own color palette**"; a camera that zooms to express scale and intimacy | **Colour carries meaning and mood, and shifts with context** — deliberately, not randomly. |
| **Metaballs** (2026) | "the way they **react to shifts in lighting is a marvel**" | **Respond to context** (light, state, device) so the app feels alive rather than pasted on. |
| **Cyberpunk 2077 Ultimate Edition** (2026) | the "**For This Mac**" setting automatically optimises fidelity per device | **Adapt to the user's reality** (device, network, accessibility settings) instead of shipping one fixed experience. |
| **Infinity Nikki** (2025, Visuals) | "a wonderland of texture, light and animation … **lavish yet cozy**" | **Richness with warmth** — density must never feel aggressive. |

**Award-derived design law for AnchorOS**

1. **One idea per screen**, expressible in one sentence the user could repeat.
2. **Delete before you add.** Every wave should remove at least as much visual noise as it introduces.
3. **A curated palette** — few colours in semantic roles, with a per-surface accent. No rainbow.
4. **Cohesion to the last pixel**: one icon language, one spacing rhythm, one radius/elevation scale, one motion curve.
5. **Sensory craft only where it informs**: haptics on state change; sound off by default.
6. **Motion is feedback**, never decoration (§4).
7. **Restraint is a strategy**: neutral bases make the one meaningful colour louder.
8. **Adapt**: honour reduced-motion, contrast and text-size settings; degrade gracefully on slow devices.

## 3. The aesthetic-usability effect — and its trap

Research (Kurosu & Kashimura 1995; Norman 2004; NN/g 2024) shows people **perceive attractive products as more usable** and tolerate minor problems longer. For a habit product this matters: beauty buys patience while the habit forms.

**The same research states the trap:** the effect "can mask UI problems during usability testing", and it has limits — "a pretty design can make users forgiving of minor usability problems, but not of large ones", and "when functionality is sacrificed for aesthetics, users tend to lose patience". NN/g's example: a participant loved a full-bleed photo hero, then called it "annoying the second time" once low information density cost them the task.

**Consequences for our verification protocol (reinforcing doc 23 Part E):**
- Never accept "it looks great" as evidence. **Measure behaviour**: taps, seconds, errors, completion rate.
- Beauty must not cost density: a calm screen still answers its question **above the fold**.
- Where a trade-off is proposed, compare a *plain-but-working* variant against the *beautiful* one and decide on measured behaviour.

**(practice)** The practical reading: aim for the point where beauty and density reinforce each other. Apple's winners do this by having very few elements, each carrying real information.

## 4. Motion: the sourced rules (and one reconciliation)

NN/g is blunt: animation "must be unobtrusive, brief, and subtle"; it is "most often appropriate as a form of subtle feedback for microinteractions, **rather than to induce delight or entertain users**". It works because our visual system detects motion involuntarily — which is exactly why gratuitous motion "can substantially degrade the user experience", and why using motion to hijack attention or create fear of loss is a **dark pattern**.

Yet the award winners praise "smooth scroll transitions" and shimmering fabrics. The reconciliation: **they make necessary transitions smooth; they do not add animations that weren't needed.** Craft is in the quality of movement the product already requires, not in extra movement.

**Motion law for AnchorOS**

| Rule | Detail |
|---|---|
| Purpose only | Motion appears for **state change**, **spatial continuity** (a sheet coming from where it belongs), or **feedback** (an action was registered). Nothing else. |
| Duration budget | 120–160ms for micro-feedback; ≤200ms for sheets/rows; ≤250ms for a balance change. Nothing over 300ms. |
| Never gate content | No entrance animations that delay reading. Content is visible immediately; motion decorates what is already there. |
| No loops | No pulsing, bouncing or shimmering except a genuine in-progress state. No urgency animation, ever (dark-pattern territory). |
| Reduced motion | `prefers-reduced-motion` replaces movement with instant state changes + opacity fades. Verified in the browser, not assumed. |
| One curve family | A single easing set; no per-screen improvisation. |
| Haptics accompany meaning | Completion, save, streak milestone, destructive confirm. Never on navigation. |
| Sound is off by default | Following CapWords' lesson, sound must *aid memory or comprehension* to earn its place — and is user-toggleable. |

## 5. The design foundation we must build first (new work)

Every surface below depends on these, so they come **before** the feature waves. These are new, registered items.

| ID | What | Why it comes first |
|---|---|---|
| **UX-DS-02** | **Colour token system**: one brand accent + semantic roles (`success`, `warning`, `danger`, `info`, `neutral`), a per-surface accent (Home = brand, Commitments = task, Finance = money, Settings = neutral/none), full dark-mode parity, AA contrast verified, and colour **never** the only signal. | Today's colour is ad-hoc per component, which is why surfaces feel like separate apps. This is the "curated palette" law made mechanical. |
| **UX-DS-03** | **Type scale + money numerals**: one display size, a clear 4-step scale, **tabular numerals for every amount**, consistent line-height rhythm. | Finance digits currently shift as they change — a small thing that reads as "not crafted". |
| **UX-DS-04** | **Motion + reduced-motion budget** (§4) codified in one module with durations/curves, plus the reduced-motion path. | Prevents motion improvised per wave; makes the dark-pattern rules enforceable. |
| **UX-DS-05** | **Haptics/sound map**: exactly where haptics fire, and sound off by default with an opt-in. | Sensory craft that informs instead of decorating. |
| **UX-DS-06** | **Surface, radius, elevation and spacing scale** consolidated (one radius family, one elevation set, one spacing rhythm). | Cohesion "to the last pixel" is impossible while each component picks its own radius. |
| **UX-DS-07** | **Empty-state library**: one pattern — say what this is, why it's empty, and offer the action it names. | We have at least six bespoke empty states today, two of them dead ends. |
| **UX-DS-08** | **Visual-noise budget, enforced in review**: every wave must remove at least as much visual noise as it adds. | The "delete before you add" law only survives if it's a gate, not an intention. |

**New wave: `W-D1 Design foundation`** — built immediately before/with `W-C1`, because W-C1's composer, W-C2's smart views, W-A1's citations and the Finance/Settings work all consume these tokens. Exit criteria: tokens published, both themes verified, contrast AA across the palette, `prefers-reduced-motion` honoured, and the four surfaces re-rendered on the new tokens without regressions (screenshots of every touched screen in both themes).

## 6. Per-surface strategy

Each surface gets: **the one idea it must communicate**, its structure, its colour and motion budget, what we **delete**, and its exit criteria.

### 6.1 Dashboard + Anchor AI → one `Home`

**The one idea:** *"Today, and what's next — and I can ask."* If a user can only remember one sentence about Home, that's it.

| Aspect | Decision | Why (research link) |
|---|---|---|
| Hierarchy | An **ambient header** (greeting + one line + the day's single number) → **today's work** → **one insight narrative** → **Ask Anchor** as the primary action sitting *above* the insights (not below mood). | Award winners are "quick and intuitive" with one idea per surface; the assistant must be the primary action (`AI-01`), not a card in a stack. |
| Insight presentation | One **narrative**, not a carousel of equal-weight cards: a sentence, its number, and a tap-to-cite expansion. Category tint replaces six competing card colours. | `AI-15`/`AI-11`; reads as one voice instead of a widget dump. |
| Colour | Brand accent reserved for *today and the assistant*; semantic money colours appear **only** where money is the subject; insight tints are one hue per category, low saturation. | Curated palette (Lumy); restraint makes the meaningful colour louder (SILT). |
| Motion | Completion = 150ms check + haptic. Insight arrival = ≤200ms fade/slide. Nothing loops. **No entrance animation before first paint.** | Motion as feedback only (NN/g); no content gating. Also protects first paint (our eager bundle was 1.47MB → 863KB work). |
| Density | Above the fold: **today's count, next up, and the ask field.** Nothing else is allowed to push those down. | The aesthetic-usability trap: prettiness cannot cost information density. |
| **Delete** | The duplicate Portfolio/Asset-Split payload pair (`DB-04`), the mood block inside the AI surface (`AI-04/09`), the literal **"?"** card (`AI-07`), any second settings entry point (`GL-02`), the second vocabulary ("Dashboard"/"Tasks" vs "Home"/"Commitments", `GL-03`). | "Nothing extraneous" (grug); every deletion reduces the noise budget. |
| Exit criteria | One primary action on the screen; ≤2 accent hues used; every assistant number equals its page number (`AI-11` test); every insight expands to its facts; no layout shift; both themes; first paint ≤1s on mid-tier hardware. | Behaviour measured, not opinions (NN/g). |

### 6.2 Settings

**The one idea:** *"Find one thing and change it, fast."*

| Aspect | Decision | Why |
|---|---|---|
| Structure | Replace nine anchor chips with **five groups** — Account, Appearance, Notifications, Data & Privacy, About — each **addressable by URL**, with **search** across all rows and the current value shown on every row. | `ST-01/02/06`; a clipped chip bar is the opposite of "quick and intuitive". |
| Behaviour | **No save/dirty ambiguity**: controls apply immediately with a small inline confirmation; destructive actions live in a separated, visually quieter zone behind a confirm. | `ST-04`; ambiguity is a usability defect, not a design preference. |
| Appearance section | Theme, text size and contrast use the **same controls as login** (one implementation, `GL-08`) with a **live preview**. | Cohesion; also removes a duplicated code path. |
| About → **Technical details** | Home for the raw identifier (`ST-03`), app version (from `version.ts`) and environment. Dev tooling is present **only** in dev builds, with the gating proof (`GL-07`, `D9`). | Keeps engineering artefacts out of the product surface while remaining diagnosable. |
| Colour | **Neutral surface, no brand accent** — Settings should never compete for attention; single accent only for interactive affordances. | Curated palette; hierarchy by restraint. |
| Motion | ≤120ms row feedback only. Nothing decorative. | Motion law: settings is utilitarian. |
| **Delete** | The chips bar, duplicated theme controls, "System" naming, any row that needs a tooltip to be understood. | Cohesion + noise budget. |
| Exit criteria | Any setting reachable in ≤2 taps or one search; no horizontal clipping at 320px; deep links resolve; every row shows its state without interaction; both themes; keyboard/AT traversal verified. |

### 6.3 Finance

**The one idea:** *"What do I have, and what happened."* (Two questions, in that order.)

| Aspect | Decision | Why |
|---|---|---|
| Hierarchy | **Hero: this month** — one number (net), large, tabular, **per-currency labelled** → **account passes** (stack + "All accounts") → **ledger timeline** grouped by day with a running subtotal. | One idea per surface; what matters, "at a glance" (Lumy). |
| Correctness before beauty | `DB-02` (never mix NGN and USD in one denominator), `DB-03` (show the total you advertise), `FN-02/03` (currency labelling, connected creation→recording). | These are correctness bugs; no polish survives wrong arithmetic. |
| Colour | Income/expense always **sign + icon + colour** (never colour alone — colour-vision safety); **one accent per account *type*** with a per-account hue shift (`D12`/`D13`); ledger rows neutral; the hero uses the **money** accent, not the brand accent. | Colour carries meaning (Neva) but must never be the only carrier. |
| Density | Ledger rows **56–64px**: merchant left, muted category, amount right-aligned in tabular numerals; day headers carry the subtotal; the month pager signals whether other months hold data (`FN-06/10`). | Density is information, not clutter; tabular digits stop the "shifting number" feel. |
| Motion | Recording = **one** sheet; balance change ≤250ms cross-fade; no chart animation on scroll; no parallax. | Motion as feedback; scroll-triggered animation delays users (NN/g). |
| Sensory | Haptic on save only; nothing on navigation. | Haptics accompany meaning. |
| **Delete** | The duplicate payload pair (`DB-04`), the two unlabelled "+" affordances (`FN-01`), the dead-end empty month, the cross-currency percentage. | "Nothing extraneous" + noise budget. |
| Exit criteria | One primary action (record); every figure currency-labelled; no cross-currency arithmetic anywhere; ledger readable at 320px; an empty month explains itself and offers the action; both themes. | Behaviour + correctness measured. |

## 7. Bank statement import — the request, evaluated with evidence

### 7.1 The request

A user emailed asking that Finance allow **bank statement import, per individual account**.

### 7.2 What the market actually does (researched, not assumed)

- **Plaid Statements does not parse arbitrary uploads.** It retrieves the **bank's own branded PDF** directly from the institution, with the user's consent. It is **US-only**, **depository accounts only**, covers institutions constituting **~40% of US depository accounts** (Bank of America, Citibank, US Bank, Wells Fargo, Truist, Regions, Fifth Third, Huntington, Navy FCU; Chase "early availability"), and Plaid explicitly says it **should be used with a fallback** where unsupported. Billed per Item and per refresh.
- **OFX is a real standard** (v2.3, XML-based, now managed by the Financial Data Exchange); **QFX** is Intuit's Quicken Web Connect variant; **QIF** predates both. Many US banks allow OFX Direct Connect, but the summary is explicit: **"most Canadian, United Kingdom and Australian banks do not allow this"** — those users download **CSV/QIF/OFX from the bank's website**. So **CSV is the universal fallback and also the worst format to parse**.
- **Plaid's Transactions docs show the hazards any ledger must survive:** *pending vs posted* ("pending transaction details … may change before they are settled"), `pending_transaction_id` linking a posted row to the pending row it replaces, **`authorized_date` vs posted `date`** (Plaid advises presenting `authorized_date` when available), merchant enrichment, and a **`TRANSACTIONS_REMOVED`** webhook — because **deleted transactions are a real event**, not an edge case.

### 7.3 What that means for AnchorOS

Statement import is a **data-integrity feature, not a delight feature**. A real importer must survive: per-bank format lottery, column mapping, authorised-vs-posted date semantics, **dedupe against existing rows**, replacing pending rows when they post, reversals/removals, and **reconciliation against the account balance**. Get any of that wrong and it silently corrupts the ledger that Insights, the `DB-02` correctness fix and the whole Wallet model depend on — and a corrupted ledger makes the assistant lie, which is our cardinal sin.

### 7.4 Options

| Option | Pros | Cons | Effort | Risk |
|---|---|---|---|---|
| **(a) CSV import**: mandatory preview → column map → dedupe → reconcile | Works worldwide; no third party; on-device | Per-bank format lottery; date/amount parsing traps | M | Medium |
| **(b) OFX/QFX first**, CSV second | Structured standard; far less parsing risk | Narrower availability outside the US | M | Low–Med |
| **(c) Provider fetch** (Plaid Statements/Transactions) | Best data quality; enrichment; reconciliation data | US-centric; per-Item cost; consent flows + secrets; another dependency | L | Medium |
| **(d) Defer** | Zero risk; correctness and beauty ship first | The user waits; parity gap remains | — | — |

### 7.5 Recommendation

**Defer (d) now; if we do it, do (a)+(b) as one wave after `W-P3`** — gated on the ledger being correct and the Wallet model shipped first, because importing into an incorrect ledger multiplies the error.

Non-negotiables if we build it:
1. **On-device parsing. No upload.** Statement files never leave the device — this preserves the privacy stance that is our differentiator.
2. **Never silent.** Preview every row and report exactly what happened: "142 imported · 3 duplicates skipped · 2 pending rows replaced · balance reconciled ✓".
3. **Per-account scope**, exactly as the user asked — no cross-account guessing.
4. **Reconcile, don't append**: compare the imported closing balance against the account balance and show the delta *before* saving.
5. A written **"what we will not do"**: no bank credentials, no scraping, no stored OFX Direct Connect secrets.

**Reading the request honestly:** it is legitimate and it is a *parity* feature (bank apps and YNAB-class tools have some form of it), but it is the least beautiful item on the list and the most dangerous to our correctness guarantees. Roadmap item **`R-01`** with a decision gate after `W-P3` — a sequencing decision, not a rejection. I recommend replying to the user personally: acknowledge it, explain the two-step plan (ledger correctness → import), and ask **which banks and which formats** they use — that single answer decides whether option (a) or (b) is right.

## 8. Tracking, and the revised order

**Newly registered by this document:** `UX-DS-02`…`UX-DS-08` (the design foundation, wave **`W-D1`**) and roadmap item **`R-01`** (statement import, gated). As always, they enter `MASTER-FINDING-REGISTER.md` when their wave opens.

**Additions to the quality gate** (doc 23 Part E is extended, not replaced):

1. **Noise budget** (`DS-08`): every wave removes at least as much visual noise as it adds — checked in review, not intended.
2. **Motion purpose** (`DS-04`): state change / spatial continuity / feedback only; durations within budget; `prefers-reduced-motion` verified in a browser.
3. **Colour never alone** (`DS-02`): every meaning carried by colour is also carried by a sign, icon or label.
4. **Tabular numerals** (`DS-03`) on every monetary value.
5. **Measured behaviour** over opinions: taps, seconds, errors, completion rate — because beauty masks problems in testing.
6. **Cohesion audit** per wave: one icon language, one radius/elevation/spacing rhythm, one motion curve on the touched screens.
7. **Density floor**: the screen's question is answered above the fold before any decorative element.

**Canonical order now reads:**

`W-D1 Design foundation` → `W-C1 Capture` → `W-C2 Scheduling truth` → `W-C3 Rows & history` → `W-A1 Assistant trust` → `W-C4 Find & organise` → `W-A2 Assistant memory & synthesis` → `W-M Money link` → `W-F Family` → `W-P2 Home + nav` → `W-P3 Settings / Finance visuals / Onboarding` → `W-A3 Ask anything` → **`R-01` decision gate** (statement import).

## 9. Reference library, and an honest confidence statement

You asked what references I actually hold, and whether I'm confident. Here is the truthful answer, written down so it can't drift into over-claiming.

### 9.1 What I can and cannot use

**Correction after your Mobbin question (2026-09-19):** my *web* fetch returns text, not images — which is why Dribbble refused to load ("we need to verify that you're not a robot") and Mobbin returned only its navigation. But **image files on disk are readable directly**, so uploaded screenshots *are* analysable. That materially changes the confidence table below, and it is the reason the drop-zone exists.

**Updated division of labour:**
- **You supply the taste reference** — drop Mobbin/App Store screenshots into `docs/audits/2026-09-whole-product/references/mobbin/` (how-to in that folder's README; the folder is gitignored because Mobbin captures are third-party UI we don't redistribute). Naming convention: `<app>__<screen>__<theme>.png`.
- **I analyse them** — extracting the system rules (hierarchy order, spacing rhythm, row heights, type ratios, colour roles, radii, elevation, motion cues) and mapping them onto our tokens and components.
- **I supply the system** — those rules become tokens, components and hard gates, and the review artifact is before/after screenshots in both themes plus the 5/10/20px Squint Test (§9.4). A screenshot alone isn't reproducible; rules are.
- **Neither of us relies on my taste.** Where a choice is subjective, it goes behind a measured or blur-based gate.

### 9.2 My confidence, stated precisely

| Area | Confidence | Basis |
|---|---|---|
| What award-winning apps do *conceptually* | **High** | Apple's own ADA 2026/2025 write-ups, read in full, with the praised traits quoted in §2 |
| Motion: purpose, budget, dark-pattern boundary | **High** | NN/g "The Role of Animation and Motion in UX", read in full |
| Beauty vs usability trade-off, and its trap | **High** | NN/g "The Aesthetic-Usability Effect" + the 1995/2004 primary sources it cites |
| Colour role systems and accessibility guarantees | **High** (after this round) | Radix Colors spec — see §9.3 |
| Visual hierarchy, density and grouping | **High** (after this round) | NN/g "Visual Hierarchy in UX" — see §9.4 |
| **Specific pixel-level visual direction** (exact spacing, shadows, illustration style, "does this look premium?") | **Low until you upload references → High afterwards** | Web fetch cannot read images (Dribbble/Mobbin unreachable), **but local image files are readable directly** — so Mobbin captures dropped into `references/mobbin/` are fully analysable |
| Apple HIG text | **None** | JS-gated; I refuse to cite it as read |

### 9.3 Adopted: Radix's 12-step role semantics (upgrades `UX-DS-02`)

Radix Colors specifies each step's *use case* rather than a colour: **1–2** app/subtle backgrounds · **3–5** component backgrounds (normal / hover / active-selected) · **6–8** borders (subtle / interactive / stronger + focus ring) · **9–10** solid backgrounds (rest / hover) · **11–12** text (low contrast / high contrast). It guarantees text steps reach **APCA Lc 60 / Lc 90** on a step-2 background of the same scale, ships **alpha variants** for blending over colour, and switches **dark mode by applying a class** — the same mechanism we already use (`.dark`).

**Decision:** our role tokens adopt this **aliasing convention** so every role has a defined purpose instead of a vibe — `surface-base`↔step 1–2, `surface-raised`↔3, `surface-hover`↔4, `surface-active`↔5, `border-subtle`↔6, `border-interactive`↔7, `focus`↔8, `solid`↔9, `solid-hover`↔10, `text-muted`↔11, `text-primary`↔12. Steps 11/12 are the only ones permitted for text, and they must sit on the matching background — which is how "colour never carries meaning alone" becomes structurally true rather than aspirational.

This is the **W-D1b** refinement: extend the role layer to the full alias set (including `focus` and `solid`), then migrate surfaces.

### 9.4 Adopted: the **Squint Test** as a verification gate (extends doc 23 Part E)

NN/g's practical method: *"squint or apply a slight blur to the design to get an idea of the conveyed groupings and hierarchy"* — blurring at 5/10/20px reveals what is actually emphasised (their Spotify example shows an unintended element dominating at 20px). It also confirms the underlying claim that hierarchy comes from **contrast in value and saturation in context**, not from hue, and warns that content can break a template's hierarchy.

**New gate, added to every wave:** blur each touched screen at 5, 10 and 20px and confirm the intended element still dominates. If it doesn't, the hierarchy is wrong regardless of how the unblurred screen looks. This is objective, cheap, and it is the closest thing to a "does it look right?" test that does not depend on my opinion — and it can be captured as a screenshot artifact for your review.

Also adopted from the same source, as rules: use **fewer colours** (bright/saturated reserved for what matters), **reserve warm bright colours for warnings and errors**, and give sections **breathing room** rather than equal-weight everything.

### 9.5 What I will not do

- I will not claim visual references I cannot see.
- I will not invent "Apple-like" specifics and attribute them to the HIG.
- I will not treat my own preference as evidence. Where taste decides, we decide together — or it goes behind a measured or blur-based gate.

### 9.6 Document precedence (unchanged)

Doc 21 remains the authority for the Wallet *composition*; doc 24 adds the colour, motion, type, sensory and cohesion law that every surface — including Wallet — must obey. Where they conflict, **doc 24 governs the system and doc 21 governs the composition**.

**Verification-protocol additions from this section** (they extend doc 23 Part E): the **Squint Test** at 5/10/20px on every touched screen, the **12-step role aliasing** for colour decisions, and the requirement that any pixel-level taste call arrives with a reference from you or is decided behind a measured gate.






