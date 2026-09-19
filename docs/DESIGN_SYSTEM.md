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

## Accessibility contract

- Touch targets ≥44px; design baseline 375px width.
- ARIA labels on interactive elements; `data-testid` on new components.
- Keyboard navigable; focus rings visible (`focus:ring-2`).
- Color never carries meaning alone.

## Semantics, motion and sensory law (W-D1 — research basis in doc 24)

Durable additions from `24-DESIGN-EXCELLENCE-RESEARCH-AND-SURFACE-STRATEGY.md`. These are not aspirations; they are enforced by `src/design/designFoundation.test.ts`.

### Semantic role tokens (`UX-DS-02`)

Roles live in `src/index.css`: `--role-{success,warning,danger,info}[-surface|-border]` plus surfaces (`--surface-base|raised|sunken|border`) and text (`--text-primary|secondary|muted`). Light values are on `:root`, dark values on `.dark`, and `@theme` maps both to utilities — so **a missing dark value fails a test** instead of shipping as a bug. Use `bg-success-surface`, `text-danger`, `border-surface-border`, `text-muted`, etc. Never raw palette scales for meaning.

**Colour is never the only signal.** Every role must be paired with an icon, sign or label.

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

### Empty states (`UX-DS-07`)

Use `src/components/shared/EmptyState.tsx`. The contract: say **what this is**, **why it is empty**, and **offer the action the sentence names**. One primary action maximum; when there is genuinely nothing to do, omit the action and keep the copy honest.

### Visual-noise budget (`UX-DS-08`)

Every wave must **remove at least as much visual noise as it adds**. Reviewers check this. "We'll polish it later" does not apply to a screen the user sees daily.

### Known adoption items (tracked, not yet done)

- Existing decorative loop animations (`--animate-ring-glow`, `pulse-*`, `anchor-bob`, `tide-bar`, `sonar`) must be audited against the motion law; each surviving loop needs a stated in-progress meaning.
- Surfaces still use ad-hoc palettes (`slate-*`, `emerald-*`, `amber-*`, `rose-*`) where a role token now exists; W-D1b migrates them surface by surface with before/after screenshots in both themes.
