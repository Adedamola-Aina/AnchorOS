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
 * Falls back to http://localhost:5173 for local runs (dev server must
 * already be running; the pipeline never uses this fallback).
 */
const RELEASE_STATE = 'e2e/.auth/release-state.json';

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

    use: {
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
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
