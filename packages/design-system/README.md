# @anchor-os/design-system

Anchor OS Design System - Tokens, Primitives, and Tailwind Preset

## Installation

```bash
npm install @anchor-os/design-system
```

## Usage

### Tailwind Preset

Configure your `tailwind.config.js`:

```js
const anchorPreset = require('@anchor-os/design-system/tailwind/preset');

module.exports = {
  presets: [anchorPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### CSS Tokens

Import CSS custom properties:

```css
@import '@anchor-os/design-system/css/tokens.css';
```

### TypeScript Tokens

```ts
import { colors, spacing, typography } from '@anchor-os/design-system/tokens';

// Type-safe access to design tokens
const primaryColor = colors.primary[500]; // '#3b82f6'
const gap = spacing.md; // '1rem'
```

### Primitive Components

```tsx
import { Text, Surface, Stack, Badge, Card } from '@anchor-os/design-system/primitives';

function Example() {
  return (
    <Surface level={2}>
      <Stack gap="md">
        <Text variant="heading">Welcome</Text>
        <Text variant="muted">Description text</Text>
        <Badge variant="success">Active</Badge>
      </Stack>
    </Surface>
  );
}
```

## Primitives

| Component | Description |
|-----------|-------------|
| `Text` | Semantic typography with variants (body, heading, muted, success, danger) |
| `Surface` | Background surface with depth levels (1-3) |
| `Stack` | Flexbox layout with gap spacing |
| `Card` | Elevated container with padding and border |
| `Badge` | Status indicator with color variants |
| `Divider` | Horizontal/vertical separator |
| `Indicator` | Small status dot |
| `Skeleton` | Loading placeholder |

## Tokens

### Colors
- **Primary**: Blue - CTAs, active states
- **Finance**: Green - Money, income, success
- **Task**: Purple - Productivity, focus
- **Family**: Orange - Collaboration, sharing
- **Status**: success, danger, warning, info
- **Semantic**: foreground, muted, subtle, surface, border

### Spacing
- `xs`: 4px, `sm`: 8px, `md`: 16px, `lg`: 24px, `xl`: 32px, `2xl`: 48px

### Typography
- display, h1, h2, h3, body, small

### Shadows
- sm, md, lg, xl, glow-primary, glow-finance, glow-danger

## License

MIT
