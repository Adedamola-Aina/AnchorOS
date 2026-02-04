/**
 * Border Radius Tokens - Anchor OS Design System
 */

export const borderRadius = {
    /** 6px - Pills, badges, small buttons */
    sm: '0.375rem',
    /** 8px - Cards, inputs, medium buttons */
    md: '0.5rem',
    /** 12px - Large cards, modals */
    lg: '0.75rem',
    /** 16px - Feature cards, image containers */
    xl: '1rem',
    /** 24px - Decorative elements */
    '2xl': '1.5rem',
    /** Full round */
    full: '9999px',
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
