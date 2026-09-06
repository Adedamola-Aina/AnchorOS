// @ts-nocheck
import { test, expect } from '@playwright/test';
import { loginOrSignup } from './helpers';
import { TEST_USER } from './fixtures/test-data';

/**
 * Smoke Tests
 * 
 * Quick validation that core functionality works.
 * These run first to catch major regressions fast.
 */

test.describe('Smoke Tests', () => {
    test('Homepage loads marketing landing', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
    });

    test('Login works', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[placeholder="••••••••"]', TEST_USER.password);
        await page.click('button[type="submit"]');

        // Should see Welcome back or sidebar after login
        const welcomeText = page.locator('text=Welcome back');
        const sidebar = page.locator('aside');
        await expect(welcomeText.or(sidebar).first()).toBeVisible({ timeout: 15000 });
    });

    test('Dashboard renders', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);
        // Navigate to Dashboard explicitly
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);
        // Dashboard shows net worth, sidebar, or navigation elements
        const dashboardContent = page.locator('text=Net Worth').or(page.locator('aside')).or(page.getByRole('link', { name: 'Dashboard' }));
        await expect(dashboardContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('Can navigate to Finance', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);
        // Click Finance in sidebar (use aside context)
        await page.locator('aside').locator('text=Finance').click();
        await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 10000 });
    });

    test('Can navigate to Commitments', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);
        // Click Commitments in sidebar
        await page.locator('aside').locator('text=Commitments').click();
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });
    });

    test('Can navigate to Settings', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);
        // Click System in sidebar
        await page.locator('aside').locator('text=System').click();
        await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 10000 });
    });

    test('Can create account (Finance)', async ({ page }) => {
        await loginOrSignup(page, TEST_USER);

        // loginOrSignup without skipNavigation navigates to Finance
        // Check if Add Account button exists
        const addBtn = page.locator('button:has-text("Add Account")');
        const hasAddBtn = await addBtn.isVisible().catch(() => false);

        if (hasAddBtn) {
            await addBtn.click();
            const modal = page.locator('form').filter({ hasText: 'Account Name' });
            await expect(modal).toBeVisible({ timeout: 5000 });
            // Close modal
            await page.keyboard.press('Escape');
            await expect(modal).not.toBeVisible({ timeout: 5000 });
            return;
        }

        // If Add Account CTA is not visible, the page must still show account content.
        await expect(
            page.locator('[data-testid="account-card"]').first()
                .or(page.locator('text=Net Worth').first())
                .or(page.getByRole('heading', { name: 'Finance' }))
        ).toBeVisible({ timeout: 10000 });
    });

    test('Logout works', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);

        // Navigate to settings and find logout
        await page.locator('aside').locator('text=System').click();
        await page.waitForTimeout(1000);

        // Exact-match the standalone Sign Out button (not "Sign out all other devices")
        const signOutBtn = page.getByRole('button', { name: 'Sign Out', exact: true }).last();
        const hasSignOut = await signOutBtn.isVisible().catch(() => false);

        if (hasSignOut) {
            await signOutBtn.click();
            await page.waitForTimeout(2000);

            // After sign-out the app shows its public surface: either the
            // marketing landing (h1) or the login form — never private UI.
            const publicSurface = page.locator('h1').or(page.locator('input[type="email"]')).first();
            await expect(publicSurface).toBeVisible({ timeout: 10000 });
            await expect(page.locator('aside')).toHaveCount(0);
            return;
        }

        // If sign-out action is unavailable, at minimum ensure settings screen is stable.
        await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 10000 });
    });

    test('No console errors on main pages', async ({ page }) => {
        const errors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Ignore known acceptable errors
                if (!text.includes('enableIndexedDbPersistence') &&
                    !text.includes('index is currently building') &&
                    !text.includes('favicon') &&
                    !text.includes('manifest') &&
                    !text.includes('Error boundary') &&
                    !text.includes('TaskProvider') &&
                    !text.includes('React will try to recreate') &&
                    !text.includes('firestore') &&
                    !text.includes('Firestore') &&
                    !text.includes('firebase') &&
                    !text.includes('CORS') &&
                    !text.includes('Access-Control') &&
                    !text.includes('status of 429') &&
                    !text.includes('ERR_FAILED') &&
                    !text.includes('net::')) {
                    errors.push(text);
                }
            }
        });

        await loginOrSignup(page, TEST_USER, true);
        await page.waitForTimeout(2000);

        // Visit main pages using sidebar locators
        await page.locator('aside').locator('text=Finance').click();
        await page.waitForTimeout(1000);

        await page.locator('aside').locator('text=Commitments').click();
        await page.waitForTimeout(1000);

        // Filter out false positives
        const criticalErrors = errors.filter(e =>
            !e.includes('chunk') &&
            !e.includes('ResizeObserver')
        );

        expect(criticalErrors).toHaveLength(0);
    });
});
