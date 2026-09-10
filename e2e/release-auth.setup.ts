// @ts-nocheck
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { resolveReleaseIdentity } from '../scripts/ci/release-identity.mjs';

/**
 * Release smoke auth setup.
 *
 * Authenticates the release-smoke identity exactly once and persists an
 * IndexedDB-aware storageState for the release-smoke project.
 *
 * Identity contract (scripts/ci/release-identity.mjs is the single source of
 * truth): the LOCAL/PR emulator smoke uses the disposable repository fixture
 * identity; a DEPLOYED cloud smoke FAILS CLOSED unless the dedicated
 * STAGING_SMOKE_* / PRODUCTION_SMOKE_* canary credentials are supplied as
 * secrets. The repository fixture is never used against a cloud project.
 *
 * Guardrails (per release policy):
 *  - NO automatic signup: if the identity cannot log in, this setup
 *    fails with captured diagnostics instead of creating accounts.
 *  - NO verification bypass heuristics.
 *  - NO silent retry loops: one attempt; a failure is a failure.
 *  - Credentials/tokens are never printed.
 */

const RELEASE_STATE_DIR = 'e2e/.auth';
const RELEASE_STATE_FILE = path.join(RELEASE_STATE_DIR, 'release-state.json');

test('authenticate release-smoke identity', async ({ page, context }) => {
    // Resolve inside the test so a missing cloud canary credential surfaces as
    // a clear fail-closed smoke failure (never a silent fixture fallback).
    const identity = resolveReleaseIdentity();
    const consoleErrors = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // The login form must be present within seconds; otherwise the app did
    // not boot (blank page / crash) — capture exactly that.
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    await emailInput.fill(identity.email);
    await page.locator('input[name="password"], input[type="password"]').first().fill(identity.password);
    await page.locator('button:has-text("Sign In"), button[type="submit"]').first().click();

    // Authenticated app shell must appear. If it does not, dump the page's
    // own error surface (never credentials) into the failure message.
    const shell = page.locator('aside').or(page.locator('nav[aria-label="Mobile navigation"]')).first();
    try {
        await expect(shell).toBeVisible({ timeout: 15000 });
    } catch (err) {
        const bodyText = (await page.locator('body').innerText({ timeout: 5000 }).catch(() => '')).slice(0, 800);
        await page.screenshot({ path: 'test-results/release-auth-failure.png', fullPage: true }).catch(() => undefined);
        throw new Error(
            `Release smoke login did not reach the authenticated shell.\n` +
            `Identity source: ${identity.source}\n` +
            `URL: ${page.url()}\n` +
            `Visible auth/error text: ${bodyText || '(none)'}\n` +
            `Console errors: ${JSON.stringify(consoleErrors.slice(0, 10), null, 2)}`,
            { cause: err },
        );
    }

    fs.mkdirSync(RELEASE_STATE_DIR, { recursive: true });
    // IndexedDB persistence: Firebase Auth stores its session in IndexedDB,
    // so the storageState must include it (supported since Playwright 1.51).
    await context.storageState({ path: RELEASE_STATE_FILE, indexedDB: true });
    if (!fs.existsSync(RELEASE_STATE_FILE)) {
        throw new Error('storageState file was not written; auth state cannot be reused.');
    }
});
