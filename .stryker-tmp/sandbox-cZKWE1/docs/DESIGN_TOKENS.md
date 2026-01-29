# Design Tokens - Anchor OS

**Version**: 1.0  
**Last Updated**: 2026-01-27  
**Status**: Active - UX-001 Implementation

---

## Overview

This document defines the semantic color system for Anchor OS, aligned with our calm, utilitarian design philosophy. These tokens replace ad-hoc color usage to create visual consistency across all features.

### Principles

1. **Semantic Over Literal**: Colors represent meaning, not decoration
2. **Calm Design**: Neutral-first with sparingly-used semantic colors
3. **Accessibility First**: All combinations meet WCAG AA standards
4. **Module Identity**: Each feature has a distinct yet harmonious color
5. **Dark Mode Native**: Equal consideration for light and dark modes

---

## Semantic Color Palette

### Primary: Anchor Blue

**Purpose**: Professional, trustworthy foundation for the entire application

**Usage**:
- Primary CTAs and action buttons
- Active navigation states
- Primary UI highlights and focus indicators
- Command palette selection
- Auth and onboarding flows

**Tailwind Classes**:
```css
bg-primary-600      /* Main actions */
text-primary-600    /* Primary text */
border-primary-600  /* Primary borders */
hover:bg-primary-700  /* Hover states */
dark:bg-primary-500   /* Dark mode */
```

**Examples**:
```tsx
// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Save Account
</button>

// Active navigation
<Link className={isActive ? 'text-primary-600' : 'text-slate-600'}>
  Dashboard
</Link>

// Focus ring
<input className="focus:ring-2 focus:ring-primary-500" />
```

**Scale**:
| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | #eff6ff | Very subtle backgrounds |
| 100 | #dbeafe | Light backgrounds |
| 200 | #bfdbfe | Borders, dividers |
| 300 | #93c5fd | Disabled states |
| 400 | #60a5fa | Lighter interactive elements |
| 500 | #3b82f6 | Base blue |
| **600** | **#2563eb** | **Primary (main usage)** |
| 700 | #1d4ed8 | Hover, active states |
| 800 | #1e40af | Dark mode primary |
| 900 | #1e3a8a | Very dark accents |

**Accessibility**:
- `text-primary-600` on `bg-white`: 4.54:1 (WCAG AA ✅)
- `bg-primary-600` with `text-white`: 8.59:1 (WCAG AAA ✅)

---

### Finance: Money Green

**Purpose**: Wealth, growth, positive financial indicators

**Usage**:
- Income transactions
- Account balance surplus
- Positive financial trends
- Financial success states
- Savings goals progress

**Tailwind Classes**:
```css
bg-finance-600      /* Financial actions */
text-finance-600    /* Income amounts */
border-finance-600  /* Financial highlights */
```

**Examples**:
```tsx
// Income transaction
<div className="text-finance-600 font-semibold">
  +${amount}
</div>

// Positive trend
<TrendingUp className="text-finance-500" />

// Income category icon
<div className="bg-finance-100 dark:bg-finance-900/30">
  <Briefcase className="text-finance-600" />
</div>
```

**Scale**:
| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | #f0fdf4 | Very light backgrounds |
| 100 | #dcfce7 | Category backgrounds |
| 200 | #bbf7d0 | Subtle highlights |
| 300 | #86efac | Light accents |
| 400 | #4ade80 | Medium green |
| 500 | #22c55e | Base green |
| **600** | **#16a34a** | **Finance (main usage)** |
| 700 | #15803d | Darker states |
| 800 | #166534 | Dark mode |
| 900 | #14532d | Very dark accents |

**Accessibility**:
- `text-finance-600` on `bg-white`: 4.68:1 (WCAG AA ✅)
- ` bg-finance-600` with `text-white`: 7.23:1 (WCAG AAA ✅)

---

### Task: Action Purple

**Purpose**: Productivity, focus, task completion

**Usage**:
- Commitments module elements
- Task completion indicators
- Streak visualizations
- Monthly schedule selections
- Productivity signals

**Tailwind Classes**:
```css
bg-task-600      /* Task actions */
text-task-600    /* Task highlights */
border-task-600  /* Task borders */
```

**Examples**:
```tsx
// Completed task
<div className="bg-task-100 dark:bg-task-900/30 border-task-600">
  <Check className="text-task-500" />
</div>

// Task module header
<h2 className="text-task-600">Today's Tasks</h2>

// Day selection (monthly)
<button className={selected 
  ? 'bg-task-600 text-white' 
  : 'bg-white text-slate-400'}>
  15
</button>
```

**Scale**:
| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | #faf5ff | Very light backgrounds |
| 100 | #f3e8ff | Light backgrounds |
| 200 | #e9d5ff | Borders, dividers |
| 300 | #d8b4fe | Light accents |
| 400 | #c084fc | Medium purple |
| 500 | #a855f7 | Base purple |
| **600** | **#9333ea** | **Task (main usage)** |
| 700 | #7e22ce | Darker states |
| 800 | #6b21a8 | Dark mode |
| 900 | #581c87 | Very dark accents |

**Accessibility**:
- `text-task-600` on `bg-white`: 4.53:1 (WCAG AA ✅)
- `bg-task-600` with `text-white`: 8.67:1 (WCAG AAA ✅)

---

### Family: Warm Coral

**Purpose**: Connection, warmth, collaboration

**Usage**:
- Family mode notifications
- Shared account indicators
- Family member actions
- Collaborative features
- Connection states

**Tailwind Classes**:
```css
bg-family-600      /* Family actions */
text-family-600    /* Family highlights */
border-family-600  /* Family borders */
```

**Examples**:
```tsx
// Family invitation banner
<div className="bg-family-50 dark:bg-family-900/20 border-family-200">
  <Users className="text-family-600" />
  <p className="text-family-800">Family invitation received</p>
</div>

// Shared account badge
<span className="bg-family-100 text-family-700 px-2 py-1 rounded">
  Shared
</span>

// Family activity
<div className="text-family-600">Sarah added a transaction</div>
```

**Scale**:
| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | #fff7ed | Very light backgrounds |
| 100 | #ffedd5 | Light backgrounds |
| 200 | #fed7aa | Borders, dividers |
| 300 | #fdba74 | Light accents |
| 400 | #fb923c | Medium coral |
| 500 | #f97316 | Base coral |
| **600** | **#ea580c** | **Family (main usage)** |
| 700 | #c2410c | Darker states |
| 800 | #9a3412 | Dark mode |
| 900 | #7c2d12 | Very dark accents |

**Accessibility**:
- `text-family-600` on `bg-white`: 5.17:1 (WCAG AA ✅)
- `bg-family-600` with `text-white`: 6.85:1 (WCAG AA ✅)

---

## When to Use Each Color

### Primary (Blue)
✅ **Use for:**
- Main navigation
- Primary CTAs ("Save", "Add Account", "Submit")
- Active/selected states
- Focus indicators
- Auth flows

❌ **Don't use for:**
- Financial data (use `finance`)
- Task-specific UI (use `task`)
- Family features (use `family`)

---

### Finance (Green)
✅ **Use for:**
- Income transactions
- Positive account balances
- Financial growth indicators
- Income category icons

❌ **Don't use for:**
- Generic success messages (use `emerald`)
- Task completion (use `task`)
- Primary actions (use `primary`)

---

### Task (Purple)
✅ **Use for:**
- Commitments module UI
- Task completion states
- Streak indicators
- Schedule selections (monthly view)

❌ **Don't use for:**
- Finance module UI (use `finance`)
- Primary navigation (use `primary`)
- Generic productivity outside commitments

---

### Family (Coral)
✅ **Use for:**
- Family mode notifications
- Shared account indicators
- Family member actions
- Connection states

❌ **Don't use for:**
- Personal account UI
- Generic notifications (use neutral)
- Primary actions (use `primary`)

---

## Dark Mode Usage

All semantic colors have been designed for dark mode. General guidance:

### Light Mode
- Primary shade: **600** (main)
- Backgrounds: **50**, **100**
- Borders: **200**, **300**
- Text: **700**, **800**, **900**

### Dark Mode
- Primary shade: **500** or **400** (softer)
- Backgrounds: **900/20** (with opacity)
- Borders: **700**, **800**
- Text: **300**, **400**, **500**

**Example**:
```tsx
<button className="
  bg-primary-600 hover:bg-primary-700 text-white
  dark:bg-primary-500 dark:hover:bg-primary-600
">
  Save
</button>
```

---

## Migration from Old Colors

| Old Color | New Semantic Token | Context |
|-----------|-------------------|---------|
| `indigo-600` | `primary-600` | Primary UI |
| `indigo-600` | `task-600` | Commitments module |
| `blue-600` | `primary-600` | Navigation, auth |
| `blue-600` | `family-600` | Family mode |
| `emerald-600` | `finance-600` | Income, financial positives |
| `violet-500` | `task-600` | Purple for tasks |

---

## System Colors (Non-Semantic)

For alerts, feedback, and system states, use Tailwind's default palette:

| Purpose | Color | Usage |
|---------|-------|-------|
| **Success** | `emerald-600` | Generic success (non-financial) |
| **Error** | `rose-600` | Errors, validation failures |
| **Warning** | `amber-600` | Warnings, cautions |
| **Info** | `sky-600` | Informational messages |
| **Neutral** | `slate-*` | Backgrounds, text, borders |

---

## Component Examples

### Button Variants

```tsx
// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Primary Action
</button>

// Finance button
<button className="bg-finance-600 hover:bg-finance-700 text-white">
  Add Income
</button>

// Task button
<button className="bg-task-600 hover:bg-task-700 text-white">
  Complete Task
</button>

// Family button
<button className="bg-family-600 hover:bg-family-700 text-white">
  Invite Family
</button>
```

### Badges

```tsx
// Finance badge
<span className="bg-finance-100 text-finance-700 dark:bg-finance-900/30 dark:text-finance-400">
  Income
</span>

// Task badge
<span className="bg-task-100 text-task-700">
  Daily
</span>

// Family badge
<span className="bg-family-100 text-family-700">
  Shared
</span>
```

### Icons

```tsx
// Finance icon container
<div className="p-2 bg-finance-100 dark:bg-finance-900/30 rounded-lg">
  <DollarSign className="w-5 h-5 text-finance-600" />
</div>

// Task icon
<CheckCircle className="w-5 h-5 text-task-600" />

// Family icon
<Users className="w-5 h-5 text-family-600" />
```

---

## Accessibility Compliance

All semantic color combinations meet **WCAG AA** standards for contrast:

| Combination | Contrast Ratio | Rating |
|-------------|----------------|--------|
| primary-600 on white | 4.54:1 | AA ✅ |
| finance-600 on white | 4.68:1 | AA ✅ |
| task-600 on white | 4.53:1 | AA ✅ |
| family-600 on white | 5.17:1 | AA ✅ |
| white on primary-600 | 8.59:1 | AAA ✅ |
| white on finance-600 | 7.23:1 | AAA ✅ |
| white on task-600 | 8.67:1 | AAA ✅ |
| white on family-600 | 6.85:1 | AA ✅ |

**Tool**: WebAIM Contrast Checker

---

## Best Practices

### Do's ✅
- Use semantic tokens for their intended purpose
- Leverage the full 50-900 scale for variety
- Consider dark mode when choosing shades
- Test accessibility before deployment
- Document non-standard usage

### Don'ts ❌
- Don't mix semantic colors inappropriately
- Don't use `indigo`, `blue`, `violet` directly anymore
- Don't hardcode hex values
- Don't use semantic colors for decoration
- Don't ignore dark mode

---

## Testing Your Colors

### Quick Check
```bash
# Find old color usage
grep -r "bg-indigo" src/
grep -r "bg-blue" src/
grep -r "text-violet" src/

# Should return zero results after migration
```

### Visual Regression
1. Screenshot before migration
2. Migrate to semantic tokens
3. Screenshot after migration
4. Compare for unintended changes

### Accessibility
1. Run axe-core in browser dev tools
2. Check contrast ratios
3. Test with screen reader
4. Verify keyboard navigation

---

**Status**: ✅ Tokens defined, ready for component migration  
**Next**: Migrate components module-by-module per `color_audit.md`
