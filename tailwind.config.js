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
