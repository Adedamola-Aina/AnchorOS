/**
 * Spacing Tokens - Anchor OS Design System
 * 
 * Standardized spacing scale for consistent layouts.
 */

/** Micro spacing - Internal component spacing */
export const spacing = {
    /** 4px - Icon gaps, tight padding */
    xs: '0.25rem',
    /** 8px - Default gap between related items */
    sm: '0.5rem',
    /** 16px - Card padding, form field gaps */
    md: '1rem',
    /** 24px - Section gaps */
    lg: '1.5rem',
    /** 32px - Major section gaps */
    xl: '2rem',
    /** 48px - Page section dividers */
    '2xl': '3rem',
    /** 64px - Hero spacing */
    '3xl': '4rem',
} as const;

/** Spacing as numeric values (in pixels) */
export const spacingPx = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
} as const;

export type SpacingKey = keyof typeof spacing;
export type Spacing = typeof spacing;
