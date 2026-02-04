/**
 * Token Exports - Anchor OS Design System
 * 
 * Central export point for all design tokens.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';
export * from './radius';

// Re-export combined tokens object
import { colors } from './colors';
import { spacing, spacingPx } from './spacing';
import { typography, fontSize, fontFamily } from './typography';
import { shadows, glows, boxShadow } from './shadows';
import { borderRadius } from './radius';

export const tokens = {
    colors,
    spacing,
    spacingPx,
    typography,
    fontSize,
    fontFamily,
    shadows,
    glows,
    boxShadow,
    borderRadius,
} as const;

export type Tokens = typeof tokens;
