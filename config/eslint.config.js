// @ts-nocheck
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'e2e', 'coverage', '.stryker-tmp', 'tools', 'functions/lib', '.vite', 'node_modules']),
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

      // Rule 1: Function length
      // 30 lines is the ceiling. Forces single-responsibility functions.
      // skipBlankLines and skipComments so formatting doesn't penalise well-documented code.
      'max-lines-per-function': ['warn', {
        max: 30,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      }],

      // Rule 2: No magic numbers
      // All numeric thresholds must be named constants.
      // ignore list covers unavoidable cases: array indices, binary flags, common divisors.
      'no-magic-numbers': ['warn', {
        ignore: [0, 1, -1, 2, 100, 1000],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
      }],

      // Rule 3: No console.log in production code
      // console.warn and console.error allowed for error boundaries and infrastructure.
      // console.log is banned everywhere — use TelemetryService instead.
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Rule 4: Prefer const
      // Any variable declared with let that is never reassigned must be const.
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
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
