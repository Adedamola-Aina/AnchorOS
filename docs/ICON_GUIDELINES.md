# Icon Usage Guidelines

**Last Updated**: 2026-01-27  
**Icon Library**: Lucide React  
**Related**: UX-014 (Icon Consistency Audit), UX-001 (Color Tokens)

---

## Overview

Anchor OS uses **Lucide React** exclusively for all icons. This guide establishes sizing standards, stroke width conventions, and color usage to ensure visual consistency across the entire application.

---

## Icon Library

### Lucide React

**Why Lucide?**
- Open source, MIT licensed
- 1,000+ icons with consistent design language
- Optimized SVG components
- Tree-shakeable (only import what you use)
- Active maintenance

**Import Pattern**:
```tsx
import { IconName } from 'lucide-react';
```

**Documentation**: [lucide.dev](https://lucide.dev)

---

## Size Hierarchy

Anchor OS uses a **5-level size system** for icons:

| Size | Class | Pixels | Usage | Examples |
|------|-------|--------|-------|----------|
| **Micro** | `w-3 h-3` | 12px | Badges, timestamps, tiny indicators | Time of day icons, micro-badges |
| **Small** | `w-4 h-4` | 16px | Button icons, inline actions, compact UI | Edit, Delete, Chevrons, spinners |
| **Default** | `w-5 h-5` | 20px | Navigation, primary icons, standard UI | Nav icons, primary actions, tabs |
| **Large** | `w-6 h-6` | 24px | Feature icons, section emphasis | Task type selectors, modal headers |
| **XL** | `w-8 h-8` | 32px | Error states, empty states, hero content | Error boundary, empty states, illustrations |

### When to Use Each Size

#### Micro (12px) - `w-3 h-3`
**Usage**: Inline with small text, badges, micro-indicators  
**Examples**:
- Time of day badges (morning/afternoon/evening)
- Inline status indicators
- Tag icons

```tsx
<span className="inline-flex items-center gap-1 text-xs">
  <Sunrise className="w-3 h-3" strokeWidth={2} />
  Morning
</span>
```

#### Small (16px) - `w-4 h-4`
**Usage**: Button icons, toolbar actions, inline editing  
**Default for**: Buttons, compact interfaces

**Examples**:
- Edit/Delete/Close buttons
- Chevrons in navigation
- Action icons in lists
- Loading spinners in buttons

```tsx
<Button variant="ghost" size="icon">
  <Pencil className="w-4 h-4" strokeWidth={2} />
</Button>

<Button variant="secondary">
  <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
  Add Transaction
</Button>
```

#### Default (20px) - `w-5 h-5`
**Usage**: Primary UI icons, navigation, standard contexts  
**Default for**: Navigation, tabs, primary interface elements

**Examples**:
- MainLayout sidebar icons
- BottomNavigation icons
- Tab icons
- Section headers

```tsx
// Navigation
<nav>
  <Home className="w-5 h-5" strokeWidth={2} />
  <DollarSign className="w-5 h-5" strokeWidth={2} />
  <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
</nav>

// Section header
<div className="flex items-center gap-2">
  <Wallet className="w-5 h-5 text-finance-600" strokeWidth={2} />
  <h2>Accounts</h2>
</div>
```

#### Large (24px) - `w-6 h-6`
**Usage**: Feature icons, emphasis, visual hierarchy  
**Examples**:
- Task type selection cards
- Modal icons (non-error)
- Feature highlights
- Onboarding steps

```tsx
// Task type selector
<div className="grid grid-cols-2 gap-4">
  <button className="p-4 border rounded-xl">
    <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={2} />
    <span className="text-sm font-semibold">Todo</span>
  </button>
  <button className="p-4 border rounded-xl">
    <Sunrise className="w-6 h-6 text-task-500" strokeWidth={2} />
    <span className="text-sm font-semibold">Daily</span>
  </button>
</div>
```

#### XL (32px) - `w-8 h-8`
**Usage**: Error states, empty states, hero illustrations  
**Examples**:
- ErrorBoundary icons
- Empty state illustrations
- Large modal icons
- Feature unavailable states

```tsx
// Error boundary
<div className="text-center">
  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-4" strokeWidth={2} />
  <h3>Something went wrong</h3>
  <p>We encountered an unexpected error.</p>
</div>

// Empty state
<div className="py-16">
  <Landmark className="w-8 h-8 text-slate-400 mx-auto mb-4" strokeWidth={2} />
  <h3>No accounts yet</h3>
</div>
```

---

## Stroke Width Standard

### Universal Rule: Always strokeWidth={2}

**All icons** must use `strokeWidth={2}` for visual consistency.

```tsx
// ✅ Correct
<Icon className="w-5 h-5" strokeWidth={2} />

// ❌ Wrong (default may vary)
<Icon className="w-5 h-5" />

// ❌ Wrong (inconsistent)
<Icon className="w-5 h-5" strokeWidth={1} />
```

**Why strokeWidth={2}?**
- Matches Lucide's design language
- Ensures consistent line weight across all icons
- Works well at all sizes (12px-32px)
- Balances detail with clarity

**Exception**: None. Always use strokeWidth={2}.

---

## Color Usage

Icons follow the **UX-001 semantic color system**:

### Color Contexts

| Context | Token | Usage |
|---------|-------|-------|
| **Primary** | `text-primary-500/600` | Primary actions, highlights, selection |
| **Finance** | `text-finance-500/600` | Income, money, financial success |
| **Task** | `text-task-500/600` | Commitments, tasks, productivity |
| **Family** | `text-family-500/600` | Family mode, shared features |
| **Success** | `text-emerald-500` | Success states, confirmations |
| **Destructive** | `text-rose-500` | Delete, errors, warnings |
| **Neutral** | `text-slate-400` | Inactive, placeholders, default |
| **Inherit** | (no color class) | Inherits parent text color |

### Context Examples

```tsx
// Primary action
<Button variant="primary">
  <Plus className="w-4 h-4 mr-2 text-white" strokeWidth={2} />
  New
</Button>

// Finance context (income)
<div className="text-finance-600">
  <TrendingUp className="w-4 h-4" strokeWidth={2} />
  <span>Income</span>
</div>

// Destructive action
<Button variant="secondary" className="text-rose-600 hover:text-rose-700">
  <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
  Delete
</Button>

// Neutral/inactive
<div className="text-slate-400">
  <Search className="w-5 h-5" strokeWidth={2} />
</div>
```

### Dark Mode

Icons automatically adapt to dark mode when using semantic tokens:

```tsx
// Adapts to dark mode automatically
<Icon className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={2} />

// Using semantic tokens (recommended)
<Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
```

---

## Common Patterns

### Navigation Icons

```tsx
// Desktop navigation
<nav className="space-y-2">
  {routes.map((route) => (
    <Link key={route.path} to={route.path}>
      <route.icon 
        className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-slate-400'}`} 
        strokeWidth={2}
      />
    </Link>
  ))}
</nav>

// Mobile bottom navigation
<BottomNavigation>
  {routes.map((route) => (
    <button key={route.path}>
      <route.icon 
        className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`}
        strokeWidth={2}
      />
    </button>
  ))}
</BottomNavigation>
```

### Button Icons

```tsx
// Icon button (no text)
<Button variant="ghost" size="icon">
  <X className="w-4 h-4" strokeWidth={2} />
</Button>

// Text button with icon
<Button variant="primary">
  <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
  Add Account
</Button>

// Icon on right
<Button variant="secondary">
  Continue
  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
</Button>
```

### Loading States

```tsx
// Button loading
<Button disabled={isLoading}>
  {isLoading ? (
    <Loader2 className="w-4 h-4 mr-2 animate-spin" strokeWidth={2} />
  ) : (
    <Save className="w-4 h-4 mr-2" strokeWidth={2} />
  )}
  Save
</Button>

// Full page loading
<div className="flex items-center justify-center min-h-screen">
  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" strokeWidth={2} />
</div>
```

### Input Icons

```tsx
// Search input
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
  <input 
    type="text" 
    className="pl-10 pr-4 py-2 ..." 
    placeholder="Search transactions"
  />
</div>
```

### Status Icons

```tsx
// Success
<div className="flex items-center gap-2 text-emerald-600">
  <CheckCircle className="w-4 h-4" strokeWidth={2} />
  <span>Transaction saved</span>
</div>

// Error
<div className="flex items-center gap-2 text-rose-600">
  <AlertCircle className="w-4 h-4" strokeWidth={2} />
  <span>Failed to save</span>
</div>

// Warning
<div className="flex items-center gap-2 text-amber-600">
  <AlertTriangle className="w-4 h-4" strokeWidth={2} />
  <span>Low balance</span>
</div>
```

---

## Do's and Don'ts

### ✅ Do

- **Always use Lucide React** for icons
- **Always add strokeWidth={2}** to every icon
- **Use semantic size classes** (w-3/w-4/w-5/w-6/w-8)
- **Follow color token system** from UX-001
- **Consider context** when choosing size:
  - Buttons → w-4
  - Navigation → w-5
  - Error states → w-8
- **Use with text** for clarity (icon + label)
- **Provide aria-label** for icon-only buttons

```tsx
// ✅ Good: Proper size, stroke, color, and accessibility
<Button variant="ghost" size="icon" aria-label="Close">
  <X className="w-4 h-4" strokeWidth={2} />
</Button>

// ✅ Good: Icon with text for clarity
<Button variant="primary">
  <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
  Add Transaction
</Button>
```

### ❌ Don't

- **Don't use other icon libraries** (react-icons, @heroicons, feather-icons)
- **Don't omit strokeWidth={2}** (causes inconsistency)
- **Don't use arbitrary sizes** (w-7, w-9, w-10)
- **Don't use strokeWidth={1}** or strokeWidth={3}
- **Don't hardcode colors** (use semantic tokens)
- **Don't mix icon styles** (all Lucide for consistency)
- **Don't forget dark mode** variants

```tsx
// ❌ Wrong: Missing strokeWidth
<Icon className="w-5 h-5" />

// ❌ Wrong: Arbitrary size
<Icon className="w-7 h-7" strokeWidth={2} />

// ❌ Wrong: Hardcoded color
<Icon className="w-5 h-5 text-blue-500" strokeWidth={2} />

// ❌ Wrong: Inconsistent stroke
<Icon className="w-5 h-5" strokeWidth={1} />
```

---

## Accessibility

### Icon-Only Buttons

Always provide `aria-label` for buttons containing only icons:

```tsx
// ✅ Accessible
<Button variant="ghost" size="icon" aria-label="Edit transaction">
  <Pencil className="w-4 h-4" strokeWidth={2} />
</Button>

// ❌ Not accessible (no label)
<Button variant="ghost" size="icon">
  <Pencil className="w-4 h-4" strokeWidth={2} />
</Button>
```

### Decorative Icons

Icons paired with text don't need aria labels:

```tsx
// ✅ Text provides context
<Button variant="primary">
  <Save className="w-4 h-4 mr-2" strokeWidth={2} />
  Save Changes
</Button>
```

### Icon Color Contrast

Ensure icon colors meet WCAG AA standards (verified in UX-001):
- **Minimum contrast**: 4.5:1 for text-sized icons
- **Large icons**: 3:1 minimum (≥18px)

All semantic tokens from UX-001 meet these requirements.

---

## Migration Guide

### From No Stroke Width → strokeWidth={2}

```tsx
// Before
<Icon className="w-5 h-5" />

// After
<Icon className="w-5 h-5" strokeWidth={2} />
```

### From Arbitrary Sizes → Standard Sizes

```tsx
// Before (arbitrary w-7)
<Icon className="w-7 h-7" strokeWidth={2} />

// After (standard w-6 or w-8)
<Icon className="w-6 h-6" strokeWidth={2} />  // Feature icons
<Icon className="w-8 h-8" strokeWidth={2} />  // Error states
```

### From Hardcoded Colors → Semantic Tokens

```tsx
// Before
<Icon className="w-5 h-5 text-blue-500" strokeWidth={2} />

// After
<Icon className="w-5 h-5 text-primary-500" strokeWidth={2} />
```

---

## Code Examples

### Feature Module Icons

```tsx
// Finance module
import { DollarSign, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

function FinanceView() {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-finance-600" strokeWidth={2} />
        <h2>Accounts</h2>
      </div>
      
      {/* Transaction icons */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-finance-600">
          <TrendingUp className="w-4 h-4" strokeWidth={2} />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-2 text-rose-600">
          <TrendingDown className="w-4 h-4" strokeWidth={2} />
          <span>Expense</span>
        </div>
      </div>
    </div>
  );
}
```

### Modal with Icons

```tsx
import { AlertCircle, X } from 'lucide-react';

function ErrorModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close">
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
      
      {/* Modal content */}
      <div className="text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-4" strokeWidth={2} />
        <h3>Error</h3>
        <p>Something went wrong.</p>
      </div>
    </div>
  );
}
```

---

## Testing Icons

### Visual Testing

1. **Desktop Navigation**: Verify all nav icons are w-5 h-5
2. **Mobile Navigation**: Verify bottom nav icons are w-5 h-5
3. **Buttons**: Verify button icons are w-4 h-4
4. **Empty States**: Verify hero icons are w-8 h-8
5. **Dark Mode**: Verify icon colors adapt correctly

### Automated Audit

```bash
# Count Lucide imports
grep -r "from 'lucide-react'" src/ --include="*.tsx" | wc -l

# Verify strokeWidth usage
grep -rn "strokeWidth" src/ --include="*.tsx" | wc -l

# Audit icon sizes
grep -rn "className.*w-[0-9] h-[0-9]" src/ --include="*.tsx" | \
  grep -E "w-[3-8] h-[3-8]" | \
  sed 's/.*className="//' | sed 's/".*//' | \
  sort | uniq -c | sort -rn
```

---

## Troubleshooting

### Icon Not Rendering

1. **Check import**: Ensure icon exists in Lucide React
2. **Check spelling**: Icon names are case-sensitive
3. **Check bundle**: Verify icon isn't tree-shaken incorrectly

### Icon Too Thin/Thick

1. **Verify strokeWidth={2}**: Always explicitly set
2. **Check inheritance**: Parent styles may override

### Icon Wrong Size

1. **Use standard sizes**: w-3/w-4/w-5/w-6/w-8 only
2. **Check responsive classes**: Avoid arbitrary sizing

---

## Related Documentation

- **UX-001**: [DESIGN_TOKENS.md](file:///root/anchor-os/docs/DESIGN_TOKENS.md) - Semantic color system
- **UX-011**: [BUTTON_GUIDELINES.md](file:///root/anchor-os/docs/BUTTON_GUIDELINES.md) - Button system (icons in buttons)
- **UX-013**: [TYPOGRAPHY_GUIDE.md](file:///root/anchor-os/docs/TYPOGRAPHY_GUIDE.md) - Typography hierarchy
- **Lucide React**: [lucide.dev](https://lucide.dev) - Official icon browser

---

**Maintained by**: Design System Team  
**Questions?**: See UX Enhancement Initiative docs  
**Last Audit**: 2026-01-27 (UX-014)
