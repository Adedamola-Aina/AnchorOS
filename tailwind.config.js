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
        // Semantic Color System - UX-001
        // Following calm design principles from DESIGN_PHILOSOPHY.md

        // Primary: Anchor Blue (professional, trustworthy)
        // Usage: Primary CTAs, active navigation, main UI highlights
        primary: {
          50: '#eff6ff',   // Very light blue
          100: '#dbeafe',  // Light blue
          200: '#bfdbfe',  // Lighter blue
          300: '#93c5fd',  // Light-medium blue
          400: '#60a5fa',  // Medium blue
          500: '#3b82f6',  // Base primary blue
          600: '#2563eb',  // Primary blue (main)
          700: '#1d4ed8',  // Darker blue
          800: '#1e40af',  // Dark blue
          900: '#1e3a8a',  // Very dark blue
        },

        // Finance: Money Green (wealth, growth, positive financial indicators)
        // Usage: Income, account surplus, positive trends, financial success
        finance: {
          50: '#f0fdf4',   // Very light green
          100: '#dcfce7',  // Light green
          200: '#bbf7d0',  // Lighter green
          300: '#86efac',  // Light-medium green
          400: '#4ade80',  // Medium green
          500: '#22c55e',  // Base finance green
          600: '#16a34a',  // Finance green (main)
          700: '#15803d',  // Darker green
          800: '#166534',  // Dark green
          900: '#14532d',  // Very dark green
        },

        // Task: Action Purple (productivity, focus, completion)
        // Usage: Commitments module, task completion, streaks
        task: {
          50: '#faf5ff',   // Very light purple
          100: '#f3e8ff',  // Light purple
          200: '#e9d5ff',  // Lighter purple
          300: '#d8b4fe',  // Light-medium purple
          400: '#c084fc',  // Medium purple
          500: '#a855f7',  // Base task purple
          600: '#9333ea',  // Task purple (main)
          700: '#7e22ce',  // Darker purple
          800: '#6b21a8',  // Dark purple
          900: '#581c87',  // Very dark purple
        },

        // Family: Warm Coral (connection, warmth, collaboration)
        // Usage: Family mode, shared accounts, collaborative features
        family: {
          50: '#fff7ed',   // Very light coral
          100: '#ffedd5',  // Light coral
          200: '#fed7aa',  // Lighter coral
          300: '#fdba74',  // Light-medium coral
          400: '#fb923c',  // Medium coral
          500: '#f97316',  // Base family coral
          600: '#ea580c',  // Family coral (main)
          700: '#c2410c',  // Darker coral
          800: '#9a3412',  // Dark coral
          900: '#7c2d12',  // Very dark coral
        },

        // System colors (keep existing for non-semantic usage)
        anchor: {
          personal: {
            light: '#f0fdfa', // teal-50
            DEFAULT: '#14b8a6', // teal-500
            dark: '#134e4a', // teal-900
          },
          family: {
            light: '#fffbeb', // amber-50
            DEFAULT: '#f59e0b', // amber-500
            dark: '#78350f', // amber-900
          },
          success: {
            light: '#ecfdf5', // emerald-50
            DEFAULT: '#10b981', // emerald-500
            dark: '#064e3b', // emerald-900
          },
          error: {
            light: '#fef2f2', // rose-50
            DEFAULT: '#f43f5e', // rose-500
            dark: '#4c0519', // rose-900
          },
          finance: {
            light: '#f5f3ff', // violet-50
            DEFAULT: '#8b5cf6', // violet-500
            dark: '#2e1065', // violet-900
          }
        }
      },

      fontSize: {
        // Semantic Typography Scale - UX-013
        // Built-in responsive sizing, line-height, and font-weight
        // Usage: text-h1 (mobile), lg:text-h1-lg (desktop)
        // UPDATED: Bolder weights for native iOS/Android confidence (Feb 2026)

        // Display: Hero sections, marketing (48px desktop / 36px mobile)
        'display': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],      // 36px mobile - BLACK
        'display-lg': ['3rem', { lineHeight: '1', fontWeight: '800' }],           // 48px desktop - BLACK

        // H1: Page titles (36px desktop / 30px mobile)
        'h1': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],         // 30px mobile - BOLD
        'h1-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],        // 36px desktop - BOLD

        // H2: Section headers (30px desktop / 24px mobile)
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],              // 24px mobile - BOLD
        'h2-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],      // 30px desktop - BOLD

        // H3: Subsections (24px desktop / 20px mobile)
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],          // 20px mobile - SEMIBOLD
        'h3-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],           // 24px desktop - SEMIBOLD

        // Body: Main text (16px all breakpoints)
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],            // 16px - MEDIUM (was 400)

        // Small: Captions, labels (14px all breakpoints)
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],      // 14px - SEMIBOLD (was 500)
      },

      // Native System Font Stack - iOS uses SF Pro, Android uses Roboto
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

      // Custom animations
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
