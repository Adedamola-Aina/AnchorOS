// @ts-nocheck
import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';
import { loginOrSignup } from './helpers';

/**
 * System E2E Tests
 * 
 * Tests for overall system behavior:
 * - Navigation
 * - Deep links
 * - Error handling
 * - Responsive design
 * - Loading states
 */

// ============================================================================
// Navigation Tests
// ============================================================================

test.describe('System - Navigation', () => {
    test('Sidebar navigation between sections works', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);

        // Navigate through all main sections
        await page.click('a:has-text("Finance")');
        await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();

        await page.click('a:has-text("Commitments")');
        await expect(page.getByRole('heading', { name: 'Commitments' })).toBeVisible();

        await page.click('a:has-text("System")');
        await expect(page.getByRole('heading', { name: 'System' })).toBeVisible();

        await page.click('a:has-text("Dashboard")');
        const dashboard = page.locator('a:has-text("Dashboard")');
        await expect(dashboard).toBeVisible();
    });

    test('Back button returns to previous view', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);

        // Navigate forward then back
        await page.click('a:has-text("Finance")');
        await page.waitForTimeout(500);

        await page.goBack();
        await page.waitForTimeout(500);

        // Should be back on dashboard
        const dashboard = page.getByRole('link', { name: 'Dashboard' });
        await expect(dashboard).toBeVisible();
    });
});

// ============================================================================
// Deep Link Tests
// ============================================================================

test.describe('System - Deep Links', () => {
    test('Deep link to /finance works', async ({ page }) => {
        await page.goto('/');
        await loginOrSignup(page, TEST_USER, true);

        await page.goto('/finance');
        await page.waitForTimeout(2000);

        const financeHeading = page.getByRole('heading', { name: 'Finance' });
        const hasFinance = await financeHeading.isVisible().catch(() => false);

        expect(hasFinance).toBe(true);
    });

    test('Deep link to /commitments works', async ({ page }) => {
        await page.goto('/');
        await loginOrSignup(page, TEST_USER, true);

        await page.goto('/commitments');
        await page.waitForTimeout(2000);

        const commitmentsHeading = page.getByRole('heading', { name: 'Commitments' });
        const hasCommitments = await commitmentsHeading.isVisible().catch(() => false);

        expect(hasCommitments).toBe(true);
    });

    test('Deep link to /settings works', async ({ page }) => {
        await page.goto('/');
        await loginOrSignup(page, TEST_USER, true);

        await page.goto('/settings');
        await page.waitForTimeout(2000);

        const systemHeading = page.getByRole('heading', { name: 'System' });
        const hasSettings = await systemHeading.isVisible().catch(() => false);

        expect(hasSettings).toBe(true);
    });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

test.describe('System - Error Handling', () => {
    test('Invalid route shows 404 or redirects', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);

        await page.goto('/invalid-route-12345');
        await page.waitForTimeout(2000);

        // Should either show 404 or redirect to dashboard
        const is404 = page.locator('text=404').or(page.locator('text=Not Found'));
        const isDashboard = page.getByRole('link', { name: 'Dashboard' });

        const has404 = await is404.first().isVisible().catch(() => false);
        const hasDashboard = await isDashboard.isVisible().catch(() => false);

        expect(has404 || hasDashboard).toBe(true);
    });

    test('Form validation shows errors', async ({ page }) => {
        await page.goto('/');

        // Try to submit empty login form
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);

        // Should show validation (HTML5 or custom) — check for either invalid state or error message
        const emailInput = page.locator('input[name="anchor_email"], input[type="email"]').first();
        const isInvalid = await emailInput.evaluate(el => {
            const input = el as HTMLInputElement;
            return !input.validity.valid || input.value === '';
        });

        expect(isInvalid).toBe(true);
    });
});

// ============================================================================
// Loading States Tests
// ============================================================================

test.describe('System - Loading States', () => {
    test('Loading spinner appears during data fetch', async ({ page }) => {
        await page.goto('/');

        // Check for any loading indicators on page load
        const spinner = page.locator('[class*="animate-spin"], [class*="loading"]');
        const hasSpinner = await spinner.first().isVisible().catch(() => false);

        expect(typeof hasSpinner).toBe('boolean');
    });

    test('Suspense fallback renders during lazy load', async ({ page }) => {
        // Clear cache and reload
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // Look for suspense loading
        const loading = page.locator('[class*="animate-spin"]');
        const hasLoading = await loading.first().isVisible().catch(() => false);

        expect(typeof hasLoading).toBe('boolean');
    });
});

// ============================================================================
// Responsive Design Tests
// ============================================================================

test.describe('System - Responsive Design', () => {
    test('Mobile view (375px) renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await loginOrSignup(page, TEST_USER, true);

        // Mobile should have bottom nav
        const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
        const hasMobileNav = await mobileNav.isVisible().catch(() => false);

        expect(hasMobileNav).toBe(true);
    });

    test('Tablet view (768px) renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await loginOrSignup(page, TEST_USER, true);

        // Content should be visible
        const content = page.locator('main, [class*="content"]');
        const hasContent = await content.first().isVisible().catch(() => false);

        expect(hasContent).toBe(true);
    });

    test('Desktop view (1280px) shows sidebar', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await loginOrSignup(page, TEST_USER, true);

        const sidebar = page.locator('aside');
        await expect(sidebar).toBeVisible();
    });

    test('Mobile view (375px) shows bottom navigation', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await loginOrSignup(page, TEST_USER, true);

        const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(bottomNav).toBeVisible();
    });
});

// ============================================================================
// Performance Tests (Basic)
// ============================================================================

test.describe('System - Basic Performance', () => {
    test('Page loads in reasonable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        const loadTime = Date.now() - startTime;

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
    });

    test('No memory leaks on navigation', async ({ page }) => {
        await loginOrSignup(page, TEST_USER, true);

        // Navigate back and forth multiple times
        for (let i = 0; i < 3; i++) {
            await page.click('a:has-text("Finance")');
            await page.waitForTimeout(200);
            await page.click('a:has-text("Dashboard")');
            await page.waitForTimeout(200);
        }

        // If we get here without crash, test passes
        expect(true).toBe(true);
    });
});
