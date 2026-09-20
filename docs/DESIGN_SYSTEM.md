# AnchorOS Design System

Durable visual contract. Source of truth for values: `tailwind.config.js` + component sources (`src/components/ui/`). Full historical guides live in Git history.

## Philosophy

Calm, utilitarian, human-first. Remove decisions the user shouldn't make; reveal only what matters. Never dopamine-driven; progress is reflected subtly.

## Color tokens (semantic, not literal)

- Neutral-first; semantic colors used sparingly. All combinations meet WCAG AA.
- **Primary — Anchor Blue** (`primary-600 #2563eb`): CTAs, active navigation, focus. 8.59:1 on white text.
- **Finance — Money Green** (`finance-*`): income, surplus, positive trends.
- **Module identity colors** for auth/commitments/family/fabric etc. — distinct yet harmonious.
- Dark mode is a first-class consideration (every token has a dark variant).
- Never use raw palette colors for meaning — use the semantic scale.

## Typography (6-level semantic scale)

| Level | Desktop / Mobile | Weight | Use |
|---|---|---|---|
| Display | 48 / 36px | 900 | Hero, marketing |
| H1 | 36 / 30px | 700 | Page title — exactly one per page |
| H2 | 30 / 24px | 700 | Section headers |
| H3 | 24 / 20px | 600 | Subsections |
| Body | 16 / 16px | 400 | Main text |
| Small | 14 / 14px | 500 | Captions, metadata |

All typography ≥14px (WCAG). Responsive via `text-h1 lg:text-h1-lg` style classes.

## Buttons — exactly 3 variants (`src/components/ui/Button.tsx`)

| Variant | Visual | Usage |
|---|---|---|
| `primary` | Filled `primary-600` | Critical CTAs — max 1–2 per page |
| `secondary` | Outlined | Most actions (Cancel, Back, filters) |
| `ghost` | Text only | Tertiary/inline actions |

Destructive actions use the danger token and require confirmation.

## Icons — Lucide React exclusively

- Import: `import { IconName } from 'lucide-react'` (tree-shakeable, MIT).
- 5-level size system: `w-3` (12px badges) · `w-4` (16px inline/buttons) · `w-5` (20px nav/default) · `w-6` (24px feature) · `w-8` (32px error/empty states). Default stroke width 2.
- **Functional states are Lucide, never emoji** (`UX-DS-01`). An emoji cannot inherit `currentColor`, renders differently per platform, and carries no accessible text. Converted under this rule: commitment priority (`PriorityIndicator`), streak milestones (`streakUtils.ts`: Sprout/Star/Flame/Dumbbell/Trophy/Gem/Crown/Sparkles/Target), the month-calendar priority dot, and status ticks (`Check`).
- **Approved illustration exception — mood check-in.** The five mood faces (`FabricMoodCard`) stay emoji, and that is a deliberate illustration decision, not an oversight: the face *is* the expression being recorded, and a Lucide glyph cannot represent "how I feel" as directly. Two conditions make it contractual rather than accidental — (a) every face button carries an accessible `aria-label` (Rough … Great) plus `aria-pressed`, so meaning never depends on the glyph, and (b) the faces are never the only signal: the label text renders under each face and the logged state is stated in prose ("Feeling good today"). Any new emoji-as-icon outside this exception is a `UX-DS-01` violation.

## Accessibility contract

- Touch targets ≥44px; design baseline 375px width.
- ARIA labels on interactive elements; `data-testid` on new components.
- Keyboard navigable; focus rings visible (`focus:ring-2`).
- Color never carries meaning alone.

## Semantics, motion and sensory law (W-D1 — research basis in doc 24)

Durable additions from `24-DESIGN-EXCELLENCE-RESEARCH-AND-SURFACE-STRATEGY.md`. These are not aspirations; they are enforced by `src/design/designFoundation.test.ts`.

### Semantic role tokens (`UX-DS-02`)

Roles live in `src/index.css`: `--role-{success,warning,danger,info}[-surface|-border]` plus the **12-step alias set** below. Light values are on `:root`, dark values on `.dark`, and `@theme` maps both to utilities — so **a missing dark value fails a test** instead of shipping as a bug.

**The 12-step alias convention** (adopted from the Radix Colors spec, doc 24 §9.3 — each step has one job, so colour stops being a vibe):

| Step | Purpose | Token | Utility |
|---|---|---|---|
| 1–2 | App / subtle background | `--surface-base` | `bg-surface-base` |
| 3 | Component background | `--surface-raised` | `bg-surface-raised` |
| 4 | Component hover | `--surface-hover` | `bg-surface-hover` |
| 5 | Component pressed / selected | `--surface-active` | `bg-surface-active` |
| 6 | Subtle border, separators | `--border-subtle` | `border-border-subtle` |
| 7 | Interactive border | `--border-interactive` | `border-border-interactive` |
| 8 | Focus ring | `--focus-ring` | `ring-focus-ring` |
| 9 | Solid accent background | `--solid` | `bg-solid` |
| 10 | Solid accent hover | `--solid-hover` | `bg-solid-hover` |
| 11 | Low-contrast text | `--text-muted` | `text-muted` |
| 12 | High-contrast text | `--text-primary` | `text-text-primary` |

**Text may only use steps 11 and 12**, and only on a matching background — that is how accessibility is guaranteed structurally rather than hoped for. Status roles (`success` / `warning` / `danger` / `info`) sit alongside the aliases for meaning; `--surface-sunken` remains for inset wells.

**Colour is never the only signal.** Every role must be paired with an icon, sign or label.

**Fewer colours, and reserve bright warm colours for warnings and errors** (NN/g visual-hierarchy guidance). Bright/saturated colour is for what matters; everything else uses the neutral aliases.

### Money numerals (`UX-DS-03`)

Every monetary value is rendered with the `.money` utility (tabular figures, slashed zero). Amounts must not shift as they change. Right-align amounts in lists and tables.

### Motion law (`UX-DS-04`) — source of truth `src/design/motion.ts`

- Allowed purposes **only**: `feedback`, `stateChange`, `spatialContinuity`. Delight, entrance, urgency → out of contract.
- Budget: `micro` 140ms · `sheet` 200ms · `balance` 250ms · hard ceiling 300ms.
- **Never gate content** on an entrance animation; content is readable immediately.
- No looping decoration — only a genuine in-progress state.
- No motion that pressures the user (pulsing, countdowns, urgency) — dark-pattern territory.
- Reduced motion is honoured from **both** the OS setting (`prefers-reduced-motion`) and the in-app switch (`.a11y-reduced-motion`). Use `durationFor()` so callers cannot forget.

### Sensory map (`UX-DS-05`) — `src/design/haptics.ts`

Callers ask for an **intent** (`taskComplete`, `taskUncomplete`, `recordSaved`, `streakMilestone`, `destructiveConfirm`, `validationError`); the pattern mapping lives in one place. Haptics fire on state change and confirmation only — **never** on navigation, scroll or hover. Sound is off by default and must aid comprehension to be offered at all.

### Geometry, elevation and spacing scale (`UX-DS-06`)

One radius family, one elevation set, one spacing rhythm — published in `src/index.css` and enforced by `src/design/designFoundation.test.ts`. Every value **aliases a size the app already renders** (usage counts are in the CSS comments), so publishing the scale changed no pixel; adoption across the surfaces is W-D1b.

**Radius** — six roles, each an alias of the size that role already uses:

| Token | Value | Use |
|---|---|---|
| `--radius-field` | 6px | Form controls, inputs, selects |
| `--radius-control` | 8px | Buttons, small containers |
| `--radius-card` | 12px | Cards, list groups |
| `--radius-panel` | 16px | Panels, `.glass-card` |
| `--radius-sheet` | 24px | Sheets, modals |
| `--radius-pill` | full | Pills, chips, avatars |

**Elevation** — five roles, ending the thirteen-weight shadow free-for-all: `flat` (border only) · `subtle` · `raised` · `overlay` · `modal`. These are **dual-theme** (`:root` + `.dark`) because a shadow tuned for a white surface disappears on `#020617`; a missing dark value fails a test. Utilities: `shadow-elevation-{role}`.

**Spacing rhythm** — three axes × three steps, so a surface never invents a fourth: `inset` (padding inside a container) · `stack` (vertical rhythm between blocks) · `inline` (horizontal gap), each as `-tight` / default / `-roomy` (`stack` also has `-section`). Row heights come from reference rule R1 (doc 25 §3): `--spacing-row-compact` 44px · `-standard` 48px · `-comfortable` 56px — label left, value right-aligned on a shared rail, **no divider inside a group**.

**Rules.** Choose the role that describes the job; never an arbitrary-value radius (a bracketed size). A new radius, elevation or spacing step is a **system** decision, not a component decision — if a screen seems to need a fourth step, the screen is wrong, not the rhythm. (Write bracketed class examples as prose, not as literal class names: Tailwind auto-scans the repo and would ship a utility for them.)

**Before/after evidence for a migration (required — doc 24 W-D1 exit criteria).** `e2e/design-surfaces.spec.ts` renders Home, Commitments, Finance and Settings at 375×812 and 1280×720 in **both** themes, writing each screen plus a 10px-blur **Squint Test** variant (doc 24 §9.4) to `design-evidence/`:

```bash
DESIGN_EVIDENCE=1 npm run test:e2e:local -- --project=design-evidence
```

It is opt-in because it drives the **real theme control** (`App.tsx` applies the profile's `theme` field, and both seeds pin that to `light`, so `colorScheme` alone can never reach dark mode), which makes a full pass take minutes. It also **asserts** what the older suite never could: no two surface/theme captures may be byte-identical.

That assertion exists because `e2e/visual.spec.ts` imports `test` from `@playwright/test` instead of the authenticated fixture in `e2e/fixtures/base.ts` — so five of its eight committed baselines are byte-identical captures of the *unauthenticated* screen, and one of its tests swallows its own wait failure with `.catch(() => {})`. **Do not treat that suite as evidence that a surface still looks right.** Regenerating or retiring those baselines is tracked in the finding register.

### Empty states (`UX-DS-07`)

Use `src/components/shared/EmptyState.tsx`. The contract: say **what this is**, **why it is empty**, and **offer the action the sentence names**. One primary action maximum; when there is genuinely nothing to do, omit the action and keep the copy honest.

### Visual-noise budget (`UX-DS-08`)

Every wave must **remove at least as much visual noise as it adds**. Reviewers check this. "We'll polish it later" does not apply to a screen the user sees daily.

### Known adoption items (tracked, not yet done)

- Existing decorative loop animations (`--animate-ring-glow`, `pulse-*`, `anchor-bob`, `tide-bar`, `sonar`) must be audited against the motion law; each surviving loop needs a stated in-progress meaning.
- Surfaces still use ad-hoc palettes (`slate-*`, `emerald-*`, `amber-*`, `rose-*`) where a role token now exists; W-D1b migrates them surface by surface with before/after screenshots in both themes.
