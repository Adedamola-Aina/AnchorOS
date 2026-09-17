// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';

/**
 * Authenticated local E2E configuration (general suite).
 *
 * Run all tests:                 npm run test:e2e:local
 * Run one spec:                  npm run test:e2e:local -- e2e/finance.spec.ts
 * Run one test:                  npm run test:e2e:local -- e2e/finance.spec.ts -g "rename"
 * Raw config (no emulator/seed): npx playwright test --config config/playwright.config.ts
 *
 * CANONICAL PATH: `npm run test:e2e:local` (scripts/ci/run-e2e-local.mjs) is the
 * supported local entry point. It verifies (or starts and cleans up) the
 * demo-anchor-os Firebase emulator suite (auth 9099 + firestore 8080), seeds
 * the disposable fixture identity plus run-scoped finance fixtures, and then
 * runs this config — whose webServer starts a FRESH Vite dev server below.
 *
 * Hermetic local startup (why this config owns it):
 *   - ONE resolved origin is used for the webServer readiness URL, the browser
 *     `baseURL` and (in the harness) the seeded emulator data. `E2E_BASE_URL`
 *     overrides it; otherwise the dedicated strict port 5273 is used. A fixed
 *     localhost:5173 readiness URL could point at a different origin than the
 *     origin the browser navigates to.
 *   - `reuseExistingServer: false` + `--strictPort`: a long-lived dev server on
 *     the target port makes the run FAIL ("port already in use") instead of
 *     silently serving whatever checkout that process was started from. A
 *     stale checkout without emulator wiring produces exactly the misleading
 *     `auth/api-key-not-valid` failure this guards against.
 *   - Emulator-only Firebase env is pinned inline for the local server, so a
 *     developer's local `.env.development` can never leak real cloud
 *     credentials into a test run (shell env wins over .env files in Vite).
 *   - When `E2E_BASE_URL` is set (an already-running target), no local server is
 *     started. The deployed release path is
 *     config/playwright.release-smoke.config.ts.
 */
const LOCAL_ORIGIN = 'http://127.0.0.1:5273';
const BASE_URL = process.env.E2E_BASE_URL || LOCAL_ORIGIN;
const IS_LOCAL_TARGET = !process.env.E2E_BASE_URL;
const LOCAL_PORT = new URL(LOCAL_ORIGIN).port;

export default defineConfig({
    testDir: '../e2e',
    // Release-smoke specs belong to config/playwright.release-smoke.config.ts
    // (they require the release-auth storage state); never collect them here —
    // the unanchored `smoke` testMatch would otherwise match release-smoke.spec.ts.
    testIgnore: /release-/,
    fullyParallel: true,
    // Bound the whole E2E run so a broken environment fails fast with a
    // partial report instead of hanging the CI job indefinitely.
    globalTimeout: 30 * 60 * 1000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // Use 50% of available CPUs in CI, auto-detect locally
    workers: process.env.CI ? '50%' : undefined,
    timeout: 60000,
    reporter: 'html',

    // Visual regression snapshot settings
    snapshotDir: '../e2e/__snapshots__',
    snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
    expect: {
        toHaveScreenshot: {
            // Visual comparison thresholds
            maxDiffPixelRatio: 0.02,      // Allow 2% pixel difference
            threshold: 0.2,                // Per-pixel color difference threshold
            animations: 'disabled',        // Disable CSS animations for consistency
        },
    },

    use: {
        // The SAME resolved origin as the webServer readiness URL below.
        baseURL: BASE_URL,
        // Auth/setup failures keep a trace + screenshot so the browser state at
        // the moment of failure stays inspectable.
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'off',
        actionTimeout: 10000,
        navigationTimeout: 15000,
    },

    projects: [
        {
            name: 'smoke',
            testMatch: /smoke\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Mobile viewport for responsive visual testing
        {
            name: 'mobile',
            use: { ...devices['iPhone 13'] },
            testMatch: /visual\.spec\.ts/, // Only run visual tests on mobile
        },
    ],

    // Start a fresh dev server before running tests (local targets only).
    webServer: IS_LOCAL_TARGET
        ? {
              // Emulator-only development configuration is pinned inline (shell
              // env overrides .env files in Vite), mirroring the release-smoke
              // local path, so no cloud Firebase configuration can leak in.
              command:
                  'VITE_APP_ENV=development ' +
                  'VITE_FIREBASE_PROJECT_ID=demo-anchor-os ' +
                  'VITE_FIREBASE_API_KEY=demo-api-key ' +
                  'VITE_FIREBASE_AUTH_DOMAIN=demo-anchor-os.firebaseapp.com ' +
                  'VITE_FIREBASE_STORAGE_BUCKET=demo-anchor-os.appspot.com ' +
                  'VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000 ' +
                  'VITE_FIREBASE_APP_ID=1:000000000000:web:demo-anchor-os ' +
                  'VITE_FIREBASE_APP_CHECK_SITE_KEY= ' +
                  'VITE_FIREBASE_VAPID_KEY= ' +
                  'VITE_SENTRY_DSN= ' +
                  `npm run dev -- --port ${LOCAL_PORT} --strictPort`,
              url: BASE_URL,
              timeout: 60 * 1000,
              // Never reuse whatever process happens to be on this port: an
              // unrelated dev server would silently change the code under test.
              reuseExistingServer: false,
          }
        : undefined,
});
