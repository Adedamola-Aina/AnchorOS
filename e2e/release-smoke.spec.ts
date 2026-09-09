// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Release Smoke (authenticated) — fast post-deploy verification.
 *
 * Runs against the deployed environment URL with a persisted authenticated
 * storageState (see e2e/release-auth.setup.ts). Every test is bounded by the
 * config's 20s timeout; the whole gate is bounded by a 3-minute global
 * timeout. A failure here means the DEPLOYED environment is broken.
 */

test.describe('Release Smoke — authenticated shell', () => {
    test('Dashboard renders', async ({ page }) => {
        await page.goto('/dashboard');
        const dashboardContent = page
            .locator('text=Net Worth')
            .or(page.locator('aside'))
            .or(page.getByRole('link', { name: 'Dashboard' }));
        await expect(dashboardContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('Finance reachable', async ({ page }) => {
        await page.goto('/finance');
        await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 10000 });
    });

    test('Commitments reachable', async ({ page }) => {
        await page.goto('/commitments');
        await expect(
            page.getByRole('heading', { name: 'Commitments', exact: true })
                .or(page.locator('text=Commitments').first())
        ).toBeVisible({ timeout: 10000 });
    });

    test('Settings reachable', async ({ page }) => {
        await page.goto('/settings');
        await expect(
            page.getByRole('heading', { name: 'Settings' })
                .or(page.locator('text=System').first())
        ).toBeVisible({ timeout: 10000 });
    });

    test('No console errors on main pages', async ({ page }) => {
        const errors = [];
        page.on('console', (msg) => {
            if (msg.type() !== 'error') return;
            const text = msg.text();
            // Known acceptable noise (mirrors e2e/smoke.spec.ts policy).
            const ignored = [
                'enableIndexedDbPersistence', 'index is currently building',
                'favicon', 'manifest', 'Error boundary', 'TaskProvider',
                'React will try to recreate', 'firestore', 'Firestore',
                'firebase', 'CORS', 'Access-Control', 'status of 429',
                'ERR_FAILED', 'net::', 'chunk', 'ResizeObserver',
            ];
            if (!ignored.some((token) => text.includes(token))) errors.push(text);
        });

        for (const route of ['/finance', '/commitments']) {
            await page.goto(route);
            await expect(page.locator('aside').or(page.locator('nav[aria-label="Mobile navigation"]')).first())
                .toBeVisible({ timeout: 10000 });
        }
        expect(errors).toHaveLength(0);
    });
});

test.describe('Release Smoke — logout (isolated session)', () => {
    test('Logout returns the public surface', async ({ page }) => {
        // This test runs in its own browser context: the stored auth state is
        // a private copy, so signing out here cannot affect other tests.
        await page.goto('/settings');
        await expect(
            page.getByRole('heading', { name: 'Settings' })
                .or(page.locator('text=System').first())
        ).toBeVisible({ timeout: 10000 });

        const signOutBtn = page.getByRole('button', { name: 'Sign Out', exact: true }).last();
        await expect(signOutBtn).toBeVisible({ timeout: 10000 });
        await signOutBtn.click();

        const publicSurface = page.locator('h1').or(page.locator('input[type="email"]')).first();
        await expect(publicSurface).toBeVisible({ timeout: 10000 });
        await expect(page.locator('aside')).toHaveCount(0);
    });
});
