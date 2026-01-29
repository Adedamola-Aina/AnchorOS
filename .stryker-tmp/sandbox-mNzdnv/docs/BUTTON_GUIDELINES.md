# Button Usage Guidelines

**Last Updated**: 2026-01-27  
**Component**: `src/components/ui/Button.tsx`  
**Related**: UX-011 (Consistent Button Styles), UX-001 (Color Tokens)

---

## Overview

Anchor OS uses exactly **3 button variants** to create clear visual hierarchy and consistent user experience across all features.

---

## Variants

### Primary
**Emphasis**: Highest  
**Purpose**: Critical actions, CTAs, primary workflows  
**Visual**: Filled background with primary semantic color  
**Usage**: 1-2 per page maximum

**Examples**:
- "New Commitment"
- "Save Changes"
- "Confirm"
- "Submit"
- "Add Account"

**Code**:
```tsx
<Button variant="primary">
  Save Changes
</Button>
```

**Rendered**: Blue filled button (`bg-primary-600`)

---

### Secondary
**Emphasis**: Medium  
**Purpose**: Important but not critical, alternative actions  
**Visual**: Outlined border, no fill  
**Usage**: Most common variant for actions

**Examples**:
- "Cancel"
- "Back"
- "Learn More"
- "Add to Calendar"
- Filter toggles

**Code**:
```tsx
<Button variant="secondary">
  Cancel
</Button>
```

**Rendered**: Bordered button (`border-slate-200`)

---

### Ghost
**Emphasis**: Lowest  
**Purpose**: Tertiary actions, icon buttons, low-priority interactions  
**Visual**: No background, minimal styling, hover only  
**Usage**: Close buttons, navigation, icon-only buttons

**Examples**:
- Close "X" buttons
- Edit/delete icons
- Navigation arrows
- "Sign Out"

**Code**:
```tsx
<Button variant="ghost" size="icon">
  <X className="w-5 h-5" />
</Button>
```

**Rendered**: Minimal button, no background until hover

---

## Sizes

All sizes maintain **44px minimum touch target** on mobile per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M3.3.

| Size | Height (Mobile) | Height (Desktop) | Use Case |
|------|-----------------|------------------|----------|
| `sm` | 44px | 36px | Compact areas, toolbars |
| `md` | 44px | 44px | Default (recommended) |
| `lg` | 56px | 56px | Hero CTAs, important actions |
| `icon` | 44px square | 40px square | Icon-only buttons |

**Code**:
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large CTA</Button>
<Button size="icon"><Edit className="w-4 h-4" /></Button>
```

---

## Context Colors

For special actions, use `className` overrides instead of creating new variants:

### Danger (Destructive Actions)
**Use**: Delete, disable, disconnect, destructive operations  
**Pattern**: Apply danger styling to `secondary` or `ghost` variants

```tsx
<Button 
  variant="secondary" 
  className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
>
  <Trash2 className="w-4 h-4" />
  Delete Account
</Button>
```

### Success (Positive Financial Actions)
**Use**: Financial positives, approvals, confirmations in Finance module  
**Pattern**: Apply finance token styling to `secondary` or `ghost` variants

```tsx
<Button 
  variant="secondary" 
  className="text-finance-600 border-finance-200 hover:bg-finance-50"
>
  Approve Transaction
</Button>
```

### Task Context (Commitments Module)
**Use**: Task-specific actions in Commitments module  
**Pattern**: Apply task token for module-specific color

```tsx
<Button 
  variant="secondary" 
  className="text-task-600 border-task-200 hover:bg-task-50"
>
  Complete Task
</Button>
```

---

## Loading State

All button variants support a loading state:

```tsx
<Button isLoading={isSaving}>
  Save
</Button>
```

**Behavior**:
- Shows spinner icon
- Button automatically disabled
- Children remain visible next to spinner

---

## Accessibility

### Contrast Ratios (WCAG AA Compliant)

| Variant | Contrast | Rating |
|---------|----------|--------|
| Primary (white on primary-600) | 8.59:1 | AAA ✅ |
| Secondary (slate-900 on white) | 21:1 | AAA ✅ |
| Ghost (hover slate-900 on slate-100) | 16.7:1 | AAA ✅ |

### Focus Indicators
- **Primary**: `focus-visible:ring-primary-500` (blue ring)
- **Secondary/Ghost**: `focus-visible:ring-slate-400` (neutral ring)
- All rings are 2px width with offset for visibility

### Keyboard Navigation
- All buttons respond to `Enter` and `Space` keys
- Tab order follows visual order
- Focus indicators clearly visible on all variants

---

## Do's and Don'ts

### ✅ Do

- **Use primary sparingly**: 1-2 primary buttons per page maximum
- **Use secondary for most actions**: This is your workhorse variant
- **Use ghost for low-priority actions**: Close, navigation, tertiary actions
- **Apply danger classes to destructive actions**: Make destructive actions visually distinct
- **Maintain 44px touch targets on mobile**: Already handled by default sizes
- **Use semantic meaning**: Button variant should match action importance

### ❌ Don't

- **Don't use multiple primary buttons in same context**: Confuses visual hierarchy
- **Don't create custom button styles outside these 3 variants**: Breaks consistency
- **Don't use semantic tokens directly in button bg**: Use className overrides instead
- **Don't remove focus indicators**: Accessibility requirement
- **Don't use buttons for navigation**: Use `<Link>` or `<NavLink>` instead
- **Don't use `danger`/`outline`/`success` variants**: These have been removed

---

## Migration from Old Variants

If you encounter legacy button code:

| Old Variant | New Variant | Notes |
|-------------|-------------|-------|
| `danger` | `secondary` + className | Add `text-rose-600 border-rose-200 hover:bg-rose-50` |
| `outline` | `secondary` | New secondary has border by default |
| `success` | `secondary` + className | Add `text-finance-600` classes |

**Example Migration**:
```tsx
// Before (deprecated)
<Button variant="danger">Delete</Button>

// After (correct)
<Button 
  variant="secondary" 
  className="text-rose-600 border-rose-200 hover:bg-rose-50"
>
  Delete
</Button>
```

---

## Examples by Context

### Finance Module
```tsx
// Primary CTA
<Button variant="primary">Add Account</Button>

// Secondary action
<Button variant="secondary">Export CSV</Button>

// Icon actions
<Button variant="ghost" size="icon">
  <Pencil className="w-4 h-4" />
</Button>
```

### Commitments Module
```tsx
// Primary CTA
<Button variant="primary">New Commitment</Button>

// Filter toggle (conditional)
<Button variant={isActive ? 'primary' : 'secondary'}>
  Daily
</Button>

// Navigation
<Button variant="ghost" size="icon">
  <ChevronLeft className="w-4 h-4" />
</Button>
```

### Settings Module
```tsx
// Destructive action (danger pattern)
<Button 
  variant="secondary" 
  className="text-rose-600 border-rose-200 hover:bg-rose-50"
>
  Disable MFA
</Button>

// Low-priority action
<Button variant="ghost">
  Sign Out
</Button>
```

---

## Testing Checklist

When implementing new buttons:

- [ ] Correct variant chosen (hierarchy makes sense)
- [ ] Hover state works in light and dark mode
- [ ] Focus indicator visible when tabbed to
- [ ] Active state provides feedback (scale animation)
- [ ] Disabled state shows reduced opacity
- [ ] Loading state works if needed
- [ ] Mobile touch target ≥44px
- [ ] Contrast ratio meets WCAG AA (4.5:1+)
- [ ] Button purpose clear from label/icon

---

## Related Documentation

- **UX-001**: [DESIGN_TOKENS.md](file:///root/anchor-os/docs/DESIGN_TOKENS.md) - Semantic color system
- **UX-011**: [ux_011_plan.md](file:///root/.gemini/antigravity/brain/91e5ec0b-4865-4baf-9a94-6684078a367d/ux_011_plan.md) - Implementation plan
- **Mobile**: [MOBILE_OPTIMIZATION_DIRECTIVE.md](file:///root/anchor-os/docs/MOBILE_OPTIMIZATION_DIRECTIVE.md) - Touch target standards
- **Accessibility**: [DESIGN_PHILOSOPHY.md](file:///root/anchor-os/docs/DESIGN_PHILOSOPHY.md) - WCAG compliance

---

**Maintained by**: Design System Team  
**Questions?**: See examples in codebase or refer to UX Enhancement Initiative docs
