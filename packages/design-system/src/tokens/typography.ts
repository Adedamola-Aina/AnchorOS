/**
 * Typography Tokens - Anchor OS Design System
 * 
 * Semantic typography scale with line-height and weight.
 */

export interface FontSizeConfig {
    size: string;
    lineHeight: string;
    fontWeight: string;
}

/** Typography scale */
export const typography = {
    /** Display - Hero headlines */
    display: { size: '2.25rem', lineHeight: '2.5rem', fontWeight: '800' },
    'display-lg': { size: '3rem', lineHeight: '1', fontWeight: '800' },

    /** H1 - Page titles */
    h1: { size: '1.875rem', lineHeight: '2.25rem', fontWeight: '700' },
    'h1-lg': { size: '2.25rem', lineHeight: '2.5rem', fontWeight: '700' },

    /** H2 - Section headers */
    h2: { size: '1.5rem', lineHeight: '2rem', fontWeight: '700' },
    'h2-lg': { size: '1.875rem', lineHeight: '2.25rem', fontWeight: '700' },

    /** H3 - Card titles */
    h3: { size: '1.25rem', lineHeight: '1.75rem', fontWeight: '600' },
    'h3-lg': { size: '1.5rem', lineHeight: '2rem', fontWeight: '600' },

    /** Body - Default text */
    body: { size: '1rem', lineHeight: '1.5rem', fontWeight: '500' },

    /** Small - Secondary text */
    small: { size: '0.875rem', lineHeight: '1.25rem', fontWeight: '600' },

    /** Micro - Labels, badges */
    micro: { size: '0.75rem', lineHeight: '1rem', fontWeight: '600' },
} as const;

/** Tailwind fontSize format */
export const fontSize = {
    display: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }] as const,
    'display-lg': ['3rem', { lineHeight: '1', fontWeight: '800' }] as const,
    h1: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }] as const,
    'h1-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }] as const,
    h2: ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }] as const,
    'h2-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }] as const,
    h3: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }] as const,
    'h3-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }] as const,
    body: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }] as const,
    small: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }] as const,
} as const;

/** Font family stack */
export const fontFamily = {
    sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'SF Pro Display',
        'SF Pro Text',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'system-ui',
        'sans-serif',
    ],
    mono: [
        'Roboto Mono',
        'SF Mono',
        'Fira Code',
        'ui-monospace',
        'monospace',
    ],
} as const;

export type TypographyKey = keyof typeof typography;
export type Typography = typeof typography;
