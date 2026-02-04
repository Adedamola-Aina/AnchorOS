/**
 * Shadow Tokens - Anchor OS Design System
 * 
 * Depth hierarchy for elevation and focus states.
 */

export const shadows = {
    /** Subtle - Hover states, borders */
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',

    /** Standard - Cards, dropdowns */
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

    /** Elevated - Modals, popovers */
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

    /** Prominent - Focus states, important callouts */
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

    /** None */
    none: 'none',
} as const;

/** Glow effects for dark mode */
export const glows = {
    primary: '0 0 20px -5px rgb(59 130 246 / 0.5)',
    finance: '0 0 20px -5px rgb(34 197 94 / 0.5)',
    danger: '0 0 20px -5px rgb(244 63 94 / 0.5)',
    task: '0 0 20px -5px rgb(168 85 247 / 0.5)',
    family: '0 0 20px -5px rgb(249 115 22 / 0.5)',
} as const;

/** Combined box shadow export for Tailwind */
export const boxShadow = {
    ...shadows,
    'glow-primary': glows.primary,
    'glow-finance': glows.finance,
    'glow-danger': glows.danger,
    'glow-task': glows.task,
    'glow-family': glows.family,
} as const;

export type ShadowKey = keyof typeof shadows;
export type Shadows = typeof shadows;
