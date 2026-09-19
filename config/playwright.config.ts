// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';
import { resolvePlaywrightServerPlan } from '../scripts/ci/emulator-harness.mjs';

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
 * runs this config — whose webServer ALWAYS starts a FRESH Vite dev server.
 *
 * Hermetic local startup (why this config owns it):
 *   - ONE resolved origin drives the webServer bind host/port, the readiness
 *     URL and the browser `baseURL`. A loopback `E2E_BASE_URL` only chooses
 *     the host/port (default 127.0.0.1:5273); it never disables startup, so
 *     the run can never attach to a server this command did not start.
 *   - `reuseExistingServer: false` + `--strictPort`: a long-lived dev server on
 *     the target port makes the run FAIL ("port already in use") instead of
 *     silently serving whatever checkout that process was started from. A
 *     stale checkout without emulator wiring produces exactly the misleading
 *     `auth/api-key-not-valid` failure this guards against. run-e2e-local.mjs
 *     refuses an occupied port up front with the same intent.
 *   - Emulator-only Firebase env is pinned inline for the local server, so a
 *     developer's local `.env.development` can never leak real cloud
 *     credentials into a test run (shell env wins over .env files in Vite).
 *   - A non-loopback `E2E_BASE_URL` is a deployed target (the staging/release
 *     workflows run this config directly): no local server is started and the
 *     origin is owned by the caller. The deployed release path is
 *     config/playwright.release-smoke.config.ts.
 */
const TARGET = resolvePlaywrightServerPlan(process.env);

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
        baseURL: TARGET.baseURL,
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
            // The design-surface evidence harness is deliberately opt-in: it
            // walks the four surfaces in both themes through the real theme
            // control, so it is slow and belongs to migration time rather than
            // every push. It has its own project below.
            testIgnore: /design-surfaces\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        // W-D1b evidence capture (`e2e/design-surfaces.spec.ts`). Opt in with
        // DESIGN_EVIDENCE=1, and pin it to chromium because that is the only
        // engine CI installs (`npx playwright install chromium`):
        //   DESIGN_EVIDENCE=1 npm run test:e2e:local -- --project=design-evidence
        {
            name: 'design-evidence',
            testMatch: /design-surfaces\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        // Mobile viewport for responsive visual testing
        {
            name: 'mobile',
            use: { ...devices['iPhone 13'] },
            testMatch: /visual\.spec\.ts/, // Only run visual tests on mobile
        },
    ],

    // ALWAYS start a fresh, emulator-pinned dev server for a local target.
    // A deployed target (non-loopback E2E_BASE_URL) is owned by its workflow
    // and starts no local server. See resolvePlaywrightServerPlan.
    webServer: TARGET.webServer || undefined,
});
