// @ts-nocheck
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'e2e',
    'coverage',
    '**/coverage/**',
    '.stryker-tmp',
    'tools',
    'functions/lib',
    '.vite',
    'node_modules',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react-refresh/only-export-components': 'off',

      // Large legacy warning debt made lint non-actionable.
      // Keep strict type safety while we retire style debt incrementally.
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'no-console': 'off',

      // Rule 4: Prefer const
      // Any variable declared with let that is never reassigned must be const.
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'no-console': 'off',
    },
  },
  {
    files: [
      '**/*.config.{js,ts,mjs,cjs}',
      'config/**/*.{js,ts,mjs,cjs}',
      'scripts/**/*.{js,ts,mjs,cjs}',
      'functions/scripts/**/*.{js,ts,mjs,cjs}',
      'tools/**/*.{js,ts,mjs,cjs}',
    ],
    rules: {
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'no-console': 'off',
    },
  },
  {
    // Infrastructure files that legitimately use console.error for Sentry breadcrumbs
    files: [
      'src/utils/secureDb.ts',
      'src/utils/secureDbCore.ts',
      'src/config/firebase.ts',
      'src/utils/error.ts',
      'src/utils/activityLogger.ts',
      'src/services/AuditService.ts',
      'src/services/fcmTokenService.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },
])
