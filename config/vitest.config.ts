// @ts-nocheck
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8'))

// ============================================================================
// FRONTEND TEST TOPOLOGY — single source of truth
// ----------------------------------------------------------------------------
// The root/frontend suite is split into two Vitest projects by required
// runtime. Both are derived from the one frontend contract below, and the
// repository-owned invariant in src/__tests__/test-ownership.test.ts proves
// that Node + jsdom form a complete, non-overlapping partition of it.
//
//   node  — tests whose behaviour genuinely does not need a DOM/browser.
//   jsdom — React, DOM, browser-API, rendering and otherwise browser-
//           dependent tests (the conservative default for anything ambiguous).
//
// Foreign suites stay outside both projects: functions tests by
// functions/vitest.config.ts, emulator tests by functions/vitest.emulator.config.ts
// and config/vitest.rules.config.ts, and E2E by config/playwright.config.ts.
// ============================================================================

/** The complete supported frontend test surface. */
export const FRONTEND_TEST_INCLUDE = 'src/**/*.{test,spec}.{ts,tsx}'

/** Suites owned elsewhere (or build output) — never part of this config. */
export const FOREIGN_EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  'e2e/**',
  '.stryker-tmp/**',
  'tools/**',
  '**/*.emulator.test.ts',
  '**/*.emulator.ts',
]

/**
 * node project ownership: the non-UI logic roots, proven DOM-free.
 * `.tsx` is deliberately absent — every `.tsx` test is jsdom-owned.
 */
export const NODE_INCLUDE = [
  'src/api/**/*.{test,spec}.ts',
  'src/analytics/**/*.{test,spec}.ts',
  'src/config/**/*.{test,spec}.ts',
  'src/services/**/*.{test,spec}.ts',
  'src/types/**/*.{test,spec}.ts',
  'src/utils/**/*.{test,spec}.ts',
  'src/__tests__/**/*.{test,spec}.ts',
  'src/barrelExports.test.ts',
  'src/version.test.ts',
]

/**
 * Non-UI tests that still touch DOM/browser APIs (window, document, navigator,
 * localStorage, matchMedia, history, ...) and therefore must stay in jsdom.
 * These are the only per-file exceptions to the directory-based node roots.
 */
export const NODE_EXCLUDE = [
  'src/config/firebase.test.ts',
  'src/services/fabric/SubscriptionDetector.test.ts',
  'src/services/fcmTokenService.test.ts',
  // Push-token lifecycle covers the per-account localStorage flag + the
  // persisted device registration, so it needs the browser storage API.
  'src/services/pushTokenLifecycle.test.ts',
  'src/utils/__tests__/nativeBehavior.test.ts',
  'src/utils/accountExport.test.ts',
  'src/utils/csvExport.test.ts',
  'src/utils/haptic.test.ts',
  'src/utils/lazyWithRetry.test.ts',
  'src/utils/platform.test.ts',
  'src/utils/stagingConsoleCapture.extended.test.ts',
  'src/utils/stagingConsoleCapture.test.ts',
  'src/utils/systemTheme.test.ts',
]

/**
 * jsdom project ownership: every `.tsx` test, every `.ts` test inside the
 * UI roots, and the DOM-dependent outliers that live in otherwise-Node roots.
 */
export const JSDOM_INCLUDE = [
  'src/**/*.{test,spec}.tsx',
  'src/components/**/*.{test,spec}.ts',
  'src/features/**/*.{test,spec}.ts',
  'src/hooks/**/*.{test,spec}.ts',
  'src/context/**/*.{test,spec}.ts',
  ...NODE_EXCLUDE,
]

/** Runtime options shared by both projects (globals + resource constraints). */
const sharedRuntime = {
  globals: true,
  pool: 'forks',
  forks: { maxForks: 2 },
}

const sharedSetup = path.resolve(rootDir, 'src/test/setup.ts')
const jsdomSetup = path.resolve(rootDir, 'src/test/setup.jsdom.ts')

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_ENV__: JSON.stringify('development'),
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@anchor-os/ui': path.resolve(rootDir, 'packages/ui/src/index.ts'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/test-setup.ts',
        'e2e/**',
      ],
      thresholds: {
        statements: 86,
        branches: 76,
        functions: 83,
        lines: 89,
      },
    },
    projects: [
      {
        // Inherit root `plugins` (react), `define` and `resolve` via Vitest's
        // supported project-inheritance mechanism instead of duplicating them.
        extends: true,
        test: {
          ...sharedRuntime,
          name: 'node',
          environment: 'node',
          // Run this project's group before the jsdom group (groupOrder 1) so
          // node and jsdom never execute simultaneously on a 6 GiB VM.
          sequence: { groupOrder: 0 },
          include: NODE_INCLUDE,
          exclude: [...FOREIGN_EXCLUDE, ...NODE_EXCLUDE],
          setupFiles: [sharedSetup],
        },
      },
      {
        extends: true,
        test: {
          ...sharedRuntime,
          name: 'jsdom',
          environment: 'jsdom',
          // Distinct groupOrder => runs sequentially after the node group.
          // setupFiles: 'list' guarantees src/test/setup.ts (shared Firebase
          // mocks) is fully evaluated before src/test/setup.jsdom.ts (DOM
          // globals + jest-dom matchers).
          sequence: { groupOrder: 1, setupFiles: 'list' },
          include: JSDOM_INCLUDE,
          exclude: FOREIGN_EXCLUDE,
          setupFiles: [sharedSetup, jsdomSetup],
        },
      },
    ],
  },
})
