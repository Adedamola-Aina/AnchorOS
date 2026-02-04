/**
 * Tailwind Preset - Anchor OS Design System
 * 
 * Use this preset in your tailwind.config.js:
 * 
 * ```js
 * const anchorPreset = require('@anchor-os/design-system/tailwind/preset');
 * 
 * module.exports = {
 *   presets: [anchorPreset],
 *   content: [...],
 * }
 * ```
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary: Anchor Blue
                primary: {
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
                },

                // Finance: Money Green
                finance: {
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
                },

                // Task: Action Purple
                task: {
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
                },

                // Family: Warm Coral
                family: {
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
                },

                // Semantic Text Colors
                foreground: {
                    DEFAULT: '#0f172a',
                    dark: '#f1f5f9',
                },
                muted: {
                    DEFAULT: '#64748b',
                    foreground: '#64748b',
                    dark: '#94a3b8',
                },
                subtle: {
                    DEFAULT: '#94a3b8',
                    dark: '#64748b',
                },

                // Surface Colors
                surface: {
                    1: { DEFAULT: '#f8fafc', dark: '#0a0f1a' },
                    2: { DEFAULT: '#ffffff', dark: '#0f172a' },
                    3: { DEFAULT: '#f1f5f9', dark: '#1e293b' },
                    hover: { DEFAULT: '#e2e8f0', dark: '#334155' },
                    base: { DEFAULT: '#f8fafc', dark: '#020617' },
                },

                // Border Colors
                'border-subtle': {
                    DEFAULT: '#f1f5f9',
                    dark: '#1e293b',
                },

                // Status Colors
                success: {
                    DEFAULT: '#10b981',
                    light: '#ecfdf5',
                    dark: '#34d399',
                    bg: '#ecfdf5',
                    bgDark: '#064e3b',
                    50: '#ecfdf5',
                    500: '#10b981',
                    600: '#059669',
                },
                danger: {
                    DEFAULT: '#f43f5e',
                    light: '#fff1f2',
                    dark: '#fb7185',
                    bg: '#fff1f2',
                    bgDark: '#4c0519',
                    50: '#fff1f2',
                    500: '#f43f5e',
                    600: '#e11d48',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    light: '#fffbeb',
                    dark: '#fbbf24',
                    bg: '#fffbeb',
                    bgDark: '#78350f',
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                info: {
                    DEFAULT: '#3b82f6',
                    light: '#eff6ff',
                    dark: '#60a5fa',
                    bg: '#eff6ff',
                    bgDark: '#1e3a8a',
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                },
            },

            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem',
                '3xl': '4rem',
            },

            borderRadius: {
                sm: '0.375rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
                '2xl': '1.5rem',
            },

            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                'glow-primary': '0 0 20px -5px rgb(59 130 246 / 0.5)',
                'glow-finance': '0 0 20px -5px rgb(34 197 94 / 0.5)',
                'glow-danger': '0 0 20px -5px rgb(244 63 94 / 0.5)',
            },

            fontSize: {
                display: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],
                'display-lg': ['3rem', { lineHeight: '1', fontWeight: '800' }],
                h1: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
                'h1-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
                h2: ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
                'h2-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
                h3: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
                'h3-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
                body: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
                small: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
            },

            fontFamily: {
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
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
};
