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
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
