// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * 
 * Run all tests: npx playwright test
 * Run with UI:   npx playwright test --ui
 * Run specific:  npx playwright test auth.spec.ts
 * Run visual:    npx playwright test visual.spec.ts
 * Update snaps:  npx playwright test visual.spec.ts --update-snapshots
 */
export default defineConfig({
    testDir: '../e2e',
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
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
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

    // Start dev server before running tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
