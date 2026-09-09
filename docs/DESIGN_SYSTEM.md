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