/**
 * Color Tokens - Anchor OS Design System
 * 
 * Central source of truth for all color definitions.
 * Import these tokens for TypeScript type safety and consistency.
 */

// ============================================================
// PRIMARY PALETTE - Brand Colors
// ============================================================

/** Primary Blue - Professional, trustworthy */
export const primary = {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
} as const;

/** Finance Green - Wealth, growth, positive indicators */
export const finance = {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
} as const;

/** Task Purple - Productivity, focus, completion */
export const task = {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
} as const;

/** Family Orange - Connection, warmth, collaboration */
export const family = {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
} as const;

// ============================================================
// SEMANTIC TEXT COLORS
// ============================================================

/** Foreground - Primary text colors */
export const foreground = {
    DEFAULT: '#0f172a', // Light mode: slate-900
    dark: '#f1f5f9',    // Dark mode: slate-100
} as const;

/** Muted - Secondary/subdued text */
export const muted = {
    DEFAULT: '#64748b', // Light mode: slate-500
    dark: '#94a3b8',    // Dark mode: slate-400
} as const;

/** Subtle - Tertiary/disabled text */
export const subtle = {
    DEFAULT: '#94a3b8', // Light mode: slate-400
    dark: '#64748b',    // Dark mode: slate-500
} as const;

// ============================================================
// SURFACE COLORS - Background hierarchy
// ============================================================

export const surface = {
    /** Level 1: Page background */
    1: {
        DEFAULT: '#f8fafc', // slate-50
        dark: '#0a0f1a',    // Deep navy
    },
    /** Level 2: Cards, containers */
    2: {
        DEFAULT: '#ffffff',
        dark: '#0f172a', // slate-900
    },
    /** Level 3: Inputs, modals, elevated */
    3: {
        DEFAULT: '#f1f5f9', // slate-100
        dark: '#1e293b',    // slate-800
    },
    /** Hover states */
    hover: {
        DEFAULT: '#e2e8f0', // slate-200
        dark: '#334155',    // slate-700
    },
    /** Base dark - Deepest level for dark mode */
    base: {
        DEFAULT: '#f8fafc',
        dark: '#020617', // slate-950
    },
} as const;

// ============================================================
// BORDER COLORS
// ============================================================

export const border = {
    DEFAULT: '#e2e8f0',   // Light: slate-200
    dark: '#334155',      // Dark: slate-700
    subtle: {
        DEFAULT: '#f1f5f9', // Light: slate-100
        dark: '#1e293b',    // Dark: slate-800
    },
} as const;

// ============================================================
// STATUS COLORS
// ============================================================

export const success = {
    DEFAULT: '#10b981',   // emerald-500
    light: '#ecfdf5',     // emerald-50
    dark: '#34d399',      // emerald-400
    bg: '#ecfdf5',
    bgDark: '#064e3b',    // emerald-900
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
} as const;

export const danger = {
    DEFAULT: '#f43f5e',   // rose-500
    light: '#fff1f2',     // rose-50
    dark: '#fb7185',      // rose-400
    bg: '#fff1f2',
    bgDark: '#4c0519',    // rose-900
    50: '#fff1f2',
    500: '#f43f5e',
    600: '#e11d48',
} as const;

export const warning = {
    DEFAULT: '#f59e0b',   // amber-500
    light: '#fffbeb',     // amber-50
    dark: '#fbbf24',      // amber-400
    bg: '#fffbeb',
    bgDark: '#78350f',    // amber-900
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
} as const;

export const info = {
    DEFAULT: '#3b82f6',   // blue-500
    light: '#eff6ff',     // blue-50
    dark: '#60a5fa',      // blue-400
    bg: '#eff6ff',
    bgDark: '#1e3a8a',    // blue-900
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
} as const;

// ============================================================
// COMBINED EXPORT
// ============================================================

export const colors = {
    primary,
    finance,
    task,
    family,
    foreground,
    muted,
    subtle,
    surface,
    border,
    success,
    danger,
    warning,
    info,
} as const;

export type Colors = typeof colors;
