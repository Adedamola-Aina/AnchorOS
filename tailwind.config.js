/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ============================================================
        // SEMANTIC COLOR SYSTEM - DES-002
        // All raw color classes (text-slate-*, bg-slate-*) should be
        // replaced with these semantic tokens for consistency.
        // ============================================================

        // Primary: Anchor Blue (professional, trustworthy)
        // Usage: Primary CTAs, active navigation, main UI highlights
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

        // Finance: Money Green (wealth, growth, positive financial indicators)
        // Usage: Income, account surplus, positive trends, financial success
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

        // Task: Action Purple (productivity, focus, completion)
        // Usage: Commitments module, task completion, streaks
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

        // Family: Warm Coral (connection, warmth, collaboration)
        // Usage: Family mode, shared accounts, collaborative features
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

        // ============================================================
        // SEMANTIC TEXT COLORS - Replace raw text-slate-* usage
        // ============================================================

        // Foreground: Primary text color
        // Light: slate-900, Dark: slate-100
        // Usage: Headings, important text, labels
        foreground: {
          DEFAULT: '#0f172a', // slate-900
          dark: '#f1f5f9',    // slate-100
        },

        // Muted: Secondary/subdued text
        // Light: slate-500, Dark: slate-400
        // Usage: Descriptions, helper text, timestamps
        muted: {
          DEFAULT: '#64748b', // slate-500
          foreground: '#64748b', // slate-500
          dark: '#94a3b8',    // slate-400
        },

        // ============================================================
        // SEMANTIC BACKGROUND COLORS - Replace raw bg-slate-* usage
        // ============================================================

        // Surface levels for depth hierarchy
        surface: {
          // Level 1: Page background
          // Light: slate-50, Dark: #0a0f1a (deep navy)
          1: {
            DEFAULT: '#f8fafc', // slate-50
            dark: '#0a0f1a',
          },
          // Level 2: Cards, containers
          // Light: white, Dark: slate-900
          2: {
            DEFAULT: '#ffffff',
            dark: '#0f172a', // slate-900
          },
          // Level 3: Inputs, modals, elevated
          // Light: slate-100, Dark: slate-800
          3: {
            DEFAULT: '#f1f5f9', // slate-100
            dark: '#1e293b', // slate-800
          },
          // Level 4: Hover states
          // Light: slate-200, Dark: slate-700
          hover: {
            DEFAULT: '#e2e8f0', // slate-200
            dark: '#334155', // slate-700
          },
        },

        // ============================================================
        // STATUS COLORS - Semantic status indicators
        // ============================================================

        success: {
          DEFAULT: '#10b981', // emerald-500
          light: '#ecfdf5',   // emerald-50
          dark: '#34d399',    // emerald-400 (for dark mode)
          bg: '#ecfdf5',      // emerald-50
          bgDark: '#064e3b',  // emerald-900
        },

        danger: {
          DEFAULT: '#f43f5e', // rose-500
          light: '#fff1f2',   // rose-50
          dark: '#fb7185',    // rose-400 (for dark mode)
          bg: '#fff1f2',      // rose-50
          bgDark: '#4c0519',  // rose-900
        },

        warning: {
          DEFAULT: '#f59e0b', // amber-500
          light: '#fffbeb',   // amber-50
          dark: '#fbbf24',    // amber-400 (for dark mode)
          bg: '#fffbeb',      // amber-50
          bgDark: '#78350f',  // amber-900
        },

        info: {
          DEFAULT: '#3b82f6', // blue-500
          light: '#eff6ff',   // blue-50
          dark: '#60a5fa',    // blue-400 (for dark mode)
          bg: '#eff6ff',      // blue-50
          bgDark: '#1e3a8a',  // blue-900
        },

        // Legacy anchor colors (deprecated - use semantic tokens above)
        anchor: {
          personal: {
            light: '#f0fdfa',
            DEFAULT: '#14b8a6',
            dark: '#134e4a',
          },
          family: {
            light: '#fffbeb',
            DEFAULT: '#f59e0b',
            dark: '#78350f',
          },
          success: {
            light: '#ecfdf5',
            DEFAULT: '#10b981',
            dark: '#064e3b',
          },
          error: {
            light: '#fef2f2',
            DEFAULT: '#f43f5e',
            dark: '#4c0519',
          },
          finance: {
            light: '#f5f3ff',
            DEFAULT: '#8b5cf6',
            dark: '#2e1065',
          }
        }
      },

      // ============================================================
      // SEMANTIC SPACING - Standardized spacing scale
      // ============================================================
      spacing: {
        // Micro spacing (internal component spacing)
        'xs': '0.25rem',  // 4px - Icon gaps, tight padding
        'sm': '0.5rem',   // 8px - Default gap between related items
        // Standard spacing (section/component spacing)
        'md': '1rem',     // 16px - Card padding, form field gaps
        'lg': '1.5rem',   // 24px - Section gaps
        // Large spacing (page-level spacing)
        'xl': '2rem',     // 32px - Major section gaps
        '2xl': '3rem',    // 48px - Page section dividers
        '3xl': '4rem',    // 64px - Hero spacing
      },

      // ============================================================
      // SEMANTIC BORDER RADIUS - Standardized radius scale
      // ============================================================
      borderRadius: {
        // Tight: Pills, badges, small buttons
        'sm': '0.375rem', // 6px
        // Standard: Cards, inputs, medium buttons
        'md': '0.5rem',   // 8px
        // Soft: Large cards, modals
        'lg': '0.75rem',  // 12px
        // Rounded: Feature cards, image containers
        'xl': '1rem',     // 16px
        // Extra rounded: Decorative elements
        '2xl': '1.5rem',  // 24px
      },

      // ============================================================
      // SEMANTIC SHADOWS - Depth hierarchy
      // ============================================================
      boxShadow: {
        // Subtle: Hover states, borders
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        // Standard: Cards, dropdowns
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        // Elevated: Modals, popovers
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        // Prominent: Focus states, important callouts
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        // Glow effects (dark mode)
        'glow-primary': '0 0 20px -5px rgb(59 130 246 / 0.5)',
        'glow-finance': '0 0 20px -5px rgb(34 197 94 / 0.5)',
        'glow-danger': '0 0 20px -5px rgb(244 63 94 / 0.5)',
      },

      fontSize: {
        // Semantic Typography Scale - UX-013
        'display': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1', fontWeight: '800' }],
        'h1': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'h1-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'h2-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'h3-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
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
    }
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}

