// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';

/**
 * Release Smoke Gate
 *
 * A fast, fail-fast smoke gate for deployment pipelines (staging/production).
 * Deliberately different from the general E2E config:
 *
 *   - retries: 0            (a flaky-looking result is a failure to inspect)
 *   - timeout: 20s per test  (a hanging auth/page load fails in seconds)
 *   - globalTimeout: 3 min   (the whole gate is bounded)
 *   - chromium only          (deployment smoke does not need cross-browser)
 *   - trace + screenshot on failure, artifacts always uploaded by the caller
 *
 * Authentication: a single deterministic login (e2e/release-auth.setup.ts)
 * persists an IndexedDB-aware storageState that every release-smoke test
 * reuses. No signup, no verification bypasses, no silent retry loops.
 *
 * Target: E2E_BASE_URL (e.g. https://anchor-os-staging.web.app).
 * Falls back to a bounded LOCAL/PR smoke run when E2E_BASE_URL is unset
 * (the PR CI path): this config starts a dedicated Vite dev server on the
 * deterministic port 5199 (never the shared long-lived dev-server port) with
 * the SAFE emulator development env pinned inline, so a local
 * .env.development cannot leak real credentials into a smoke run.
 * The Firebase emulators and the deterministic seed are started BEFORE
 * Playwright by the caller (CI job / `npm run test:release-smoke:local`).
 * Deployment pipelines always set E2E_BASE_URL and therefore never start a
 * local server.
 */
const RELEASE_STATE = 'e2e/.auth/release-state.json';
const LOCAL_SMOKE_URL = 'http://127.0.0.1:5199';

export default defineConfig({
    testDir: '../e2e',
    testMatch: /release-(smoke|auth)\.(spec|setup)\.ts/,
    fullyParallel: true,
    globalTimeout: 3 * 60 * 1000,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 2,
    timeout: 20000,
    reporter: [['list']],

    // Bounded local PR smoke: only start a dev server when there is no
    // deployed target URL (deployment pipelines set E2E_BASE_URL).
    // Hermetic by construction: emulator-only env is pinned inline (shell env
    // overrides .env files in Vite), so no cloud Firebase configuration can
    // leak in, and the dedicated port guarantees a fresh, deterministic
    // server instead of reusing an unrelated process.
    webServer: process.env.E2E_BASE_URL
        ? undefined
        : {
              // npm run resolves from the package root (Playwright launches
              // webServer commands with the config file's directory as cwd).
              command:
                  'VITE_APP_ENV=development ' +
                  'VITE_FIREBASE_PROJECT_ID=demo-anchor-os ' +
                  'VITE_FIREBASE_API_KEY=demo-api-key ' +
                  'VITE_FIREBASE_APP_CHECK_SITE_KEY= ' +
                  'VITE_FIREBASE_VAPID_KEY= ' +
                  'npm run dev -- --port 5199 --strictPort',
              url: LOCAL_SMOKE_URL,
              timeout: 60 * 1000,
              reuseExistingServer: false,
          },

    use: {
        baseURL: process.env.E2E_BASE_URL || LOCAL_SMOKE_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'off',
        actionTimeout: 8000,
        navigationTimeout: 15000,
    },

    projects: [
        {
            name: 'release-auth',
            testMatch: /release-auth\.setup\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'release-smoke',
            testMatch: /release-smoke\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: RELEASE_STATE,
            },
            dependencies: ['release-auth'],
        },
    ],
});
