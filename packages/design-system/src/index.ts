/**
 * @anchor-os/design-system
 * 
 * Anchor OS Design System - Tokens, Primitives, and Tailwind Preset
 * 
 * This package provides:
 * - Design tokens (colors, spacing, typography, shadows)
 * - Primitive components (Text, Surface, Stack, Badge, Card, etc.)
 * - Tailwind preset for consistent styling
 * - CSS custom properties for light/dark mode
 * 
 * Usage:
 * 
 * ```ts
 * // Import tokens
 * import { colors, spacing, typography } from '@anchor-os/design-system/tokens';
 * 
 * // Import primitives
 * import { Text, Surface, Stack, Badge, Card } from '@anchor-os/design-system/primitives';
 * 
 * // Use Tailwind preset (in tailwind.config.js)
 * const preset = require('@anchor-os/design-system/tailwind/preset');
 * module.exports = { presets: [preset], ... };
 * 
 * // Import CSS tokens (in your CSS)
 * @import '@anchor-os/design-system/css/tokens.css';
 * ```
 */

// Re-export all tokens
export * from './tokens';

// Re-export all primitives
export * from './primitives';

// Version
export const VERSION = '1.0.0';
