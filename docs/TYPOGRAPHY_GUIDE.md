# Typography Usage Guide

**Last Updated**: 2026-01-27  
**Component**: Tailwind Typography Scale  
**Related**: UX-013 (Typography Scale Audit), UX-001 (Color Tokens)

---

## Overview

Anchor OS uses a **6-level semantic typography scale** to create clear visual hierarchy and consistent user experience across all features. Typography tokens include built-in responsive sizing, line-heights, and font weights.

---

## Typography Scale

| Level | Desktop Size | Mobile Size | Weight | Line Height | Use Case |
|-------|--------------|-------------|--------|-------------|----------|
| **Display** | 48px | 36px | Black (900) | 1 / 2.5rem | Hero sections, marketing |
| **H1** | 36px | 30px | Bold (700) | 2.5rem / 2.25rem | Page titles (one per page) |
| **H2** | 30px | 24px | Bold (700) | 2.25rem / 2rem | Section headers |
| **H3** | 24px | 20px | Semibold (600) | 2rem / 1.75rem | Subsections |
| **Body** | 16px | 16px | Regular (400) | 1.5rem | Main text, paragraphs |
| **Small** | 14px | 14px | Medium (500) | 1.25rem | Captions, labels, metadata |

**All typography ≥14px for WCAG compliance**

---

## Usage Guide

### Display
**When to use**: Hero sections, landing pages, marketing content  
**Examples**: Welcome screens, feature announcements

```tsx
<h1 className="text-display lg:text-display-lg">Welcome to Anchor OS</h1>
```

**Rendered**: 36px mobile → 48px desktop, extra-bold (900)

---

### H1 (Page Titles)
**When to use**: Primary page heading, exactly **one per page**  
**Examples**: "System Settings", "Finance", account names

```tsx
<h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">
  System Settings
</h1>
```

**Rendered**: 30px mobile → 36px desktop, bold (700)

**Semantic Rule**: Use `<h1>` HTML tag for page titles

---

### H2 (Section Headers)
**When to use**: Major section headings within a page  
**Examples**: Feature view headers (via `SectionHeader`), modal titles

```tsx
<h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white tracking-tight">
  Finance
</h2>
```

**Rendered**: 24px mobile → 30px desktop, bold (700)

**Component**: `SectionHeader` automatically uses h2 tokens

---

### H3 (Subsections)
**When to use**: Subsection headings, card titles  
**Examples**: Settings category headers, section subheadings

```tsx
<h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">
  Notification Preferences
</h3>
```

**Rendered**: 20px mobile → 24px desktop, semibold (600)

---

### Body
**When to use**: Main text content, descriptions, explanations  
**Examples**: Paragraphs, form instructions, help text

```tsx
<p className="text-body text-slate-700 dark:text-slate-300">
  Main content goes here with comfortable reading size.
</p>
```

**Rendered**: 16px all breakpoints, regular (400)

**Note**: Most app text uses `text-sm` (14px) for dense UI. Use `text-body` for emphasis or reading-focused content.

---

### Small
**When to use**: Captions, labels, metadata, timestamps  
**Examples**: "Last updated", field labels, badge text

```tsx
<span className="text-small text-slate-500 dark:text-slate-400">
  Last updated 2 hours ago
</span>
```

**Rendered**: 14px all breakpoints, medium (500)

**WCAG Minimum**: 14px is the smallest readable size for accessibility

---

## Responsive Pattern

All typography tokens use the **explicit responsive modifier** pattern:

```tsx
// Pattern: base class (mobile) + lg: modifier (desktop)
<h1 className="text-h1 lg:text-h1-lg">
  Page Title
</h1>
```

**Breakpoints**:
- **Mobile (<1024px)**: Uses base class (`text-h1`)
- **Desktop (≥1024px)**: Uses lg variant (`lg:text-h1-lg`)

**Rendering Example**:
- `text-h1` → 30px on mobile (< 1024px)
- `lg:text-h1-lg` → 36px on desktop (≥ 1024px)

---

## Font Weights

Typography tokens include built-in font weights. **Do not override** unless necessary for specific design needs.

| Weight | Value | Usage |
|--------|-------|-------|
| Black | 900 | Display only |
| Bold | 700 | H1, H2 |
| Semibold | 600 | H3 |
| Medium | 500 | Small text |
| Regular | 400 | Body text |

**Override Example** (rare cases):
```tsx
<h2 className="text-h2 lg:text-h2-lg font-light">
  Lighter title
</h2>
```

---

## Do's and Don'ts

### ✅ Do

- **Use semantic HTML**: Match typography class to HTML tag
  ```tsx
  <h1 className="text-h1 lg:text-h1-lg">Page Title</h1>
  <h2 className="text-h2 lg:text-h2-lg">Section</h2>
  ```

- **One H1 per page**: Enforces clear hierarchy and accessibility
  
- **Use tracking-tight for headings**: Improves legibility at larger sizes
  ```tsx
  <h1 className="text-h1 lg:text-h1-lg tracking-tight">Title</h1>
  ```

- **Pair with semantic colors**: Use UX-001 color tokens
  ```tsx
  <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">
  ```

- **Responsive by default**: Always include `lg:` variant for headings
  ```tsx
  <h2 className="text-h2 lg:text-h2-lg">Section</h2>
  ```

### ❌ Don't

- **Don't mix HTML tags and visual sizes**:
  ```tsx
  ❌ <h3 className="text-h1">Wrong</h3>
  ✅ <h3 className="text-h3 lg:text-h3-lg">Correct</h3>
  ```

- **Don't use multiple H1 tags**: One per page only
  
- **Don't use text-xs (12px)**: Below WCAG minimum
  
- **Don't forget responsive variants**: Headings should scale
  ```tsx
  ❌ <h1 className="text-h1">Missing desktop size</h1>
  ✅ <h1 className="text-h1 lg:text-h1-lg">Responsive</h1>
  ```

- **Don't override built-in wights unnecessarily**: Tokens include correct weights

---

## Migration Guide

### From text-3xl → text-h2

```tsx
// Before
<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
  Section Title
</h2>

// After
<h2 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white">
  Section Title
</h2>
```

### From text-4xl → text-h1

```tsx
// Before
<h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
  System Settings
</h2>

// After (note: h2 → h1 for page title)
<h1 className="text-h1 lg:text-h1-lg tracking-tight text-slate-900 dark:text-white">
  System Settings
</h1>
```

### From text-2xl → text-h3 or text-h2

Depends on hierarchy:
- If section header → `text-h2`
- If subsection → `text-h3`

---

## SectionHeader Component

The `SectionHeader` component (used across all features) automatically uses semantic h2 typography:

```tsx
<SectionHeader 
  title="Finance" 
  subtitle="Multi-account asset management"
  action={<Button>Add Account</Button>}
/>
```

**Renders**:
```tsx
<h2 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white">
  Finance
</h2>
```

**Used in**: Finance, Commitments, Dashboard, Settings, Family views

---

## Accessibility

### WCAG Compliance

- ✅ All text ≥14px (Small minimum)
- ✅ Sufficient line-height for readability
- ✅ Semantic heading hierarchy (h1 → h2 → h3)
- ✅ Color contrast verified in UX-001 (4.5:1+)

### Screen Readers

Semantic HTML tags (`<h1>`, `<h2>`, `<h3>`) provide navigation landmarks for screen readers.

**Correct**:
```tsx
<h1>Page Title</h1>           {/* Screen reader: "Heading level 1" */}
<h2>Section Header</h2>       {/* Screen reader: "Heading level 2" */}
```

**Incorrect**:
```tsx
<div className="text-h1">Page Title</div>  {/* Screen reader: no heading */}
```

---

## Code Examples

### Page Template

```tsx
function SettingsView() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Page title: H1 */}
      <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight mb-2">
        System Settings
      </h1>
      
      {/* Page subtitle: Small */}
      <p className="text-small text-slate-500 dark:text-slate-400 mb-8">
        Manage your preferences and environment.
      </p>
      
      {/* Section: H2 */}
      <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-4">
        Notifications
      </h2>
      
      {/* Subsection: H3 */}
      <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">
        Email Preferences
      </h3>
      
      {/* Body text */}
      <p className="text-body text-slate-700 dark:text-slate-300">
        Configure how you receive email notifications.
      </p>
    </div>
  );
}
```

### Modal Title

```tsx
<h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-4">
  Confirm Deletion
</h2>
```

### Error Messages

```tsx
<h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-2">
  Something went wrong
</h1>
<p className="text-body text-slate-600 dark:text-slate-400">
  We encountered an unexpected error. Please try again.
</p>
```

---

## Tailwind Config Reference

Typography tokens are defined in `tailwind.config.js`:

```javascript
fontSize: {
  'display': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '900' }],
  'display-lg': ['3rem', { lineHeight: '1', fontWeight: '900' }],
  'h1': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
  'h1-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
  'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
  'h2-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
  'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
  'h3-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
  'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
  'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
}
```

---

## Related Documentation

- **UX-001**: [DESIGN_TOKENS.md](file:///root/anchor-os/docs/DESIGN_TOKENS.md) - Semantic color system
- **UX-011**: [BUTTON_GUIDELINES.md](file:///root/anchor-os/docs/BUTTON_GUIDELINES.md) - Button variants
- **UX-013 Plan**: [ux_013_plan.md](file:///root/.gemini/antigravity/brain/91e5ec0b-4865-4baf-9a94-6684078a367d/ux_013_plan.md) - Implementation plan
- **Mobile**: [MOBILE_OPTIMIZATION_DIRECTIVE.md](file:///root/anchor-os/docs/architecture/mob_opt_phase2_task.md) - Responsive standards

---

**Maintained by**: Design System Team  
**Questions?**: See migrated components or UX Enhancement Initiative docs
