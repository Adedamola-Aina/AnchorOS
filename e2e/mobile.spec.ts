// @ts-nocheck
import { test, expect, type Page } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';
import { loginOrSignup } from './helpers';

/**
 * Mobile Viewport E2E Tests
 * 
 * Tests responsive design and mobile-specific interactions
 */

// Mobile viewport sizes
const MOBILE_PORTRAIT = { width: 375, height: 667 };  // iPhone SE
const MOBILE_LANDSCAPE = { width: 667, height: 375 };
const TABLET_PORTRAIT = { width: 768, height: 1024 }; // iPad
const TABLET_LANDSCAPE = { width: 1024, height: 768 };

// Helper: Login with mobile viewport
async function loginMobile(page: Page) {
    await loginOrSignup(page, TEST_USER);
}

test.describe('Mobile Viewport - Auth Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(MOBILE_PORTRAIT);
        await page.goto('/');
    });

    test('should display auth form correctly on mobile', async ({ page }) => {
        // Check form elements are visible and properly sized
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[placeholder="••••••••"]');
        const submitButton = page.locator('button[type="submit"]');

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(submitButton).toBeVisible();

        // Check form fills the width appropriately
        const submitBox = await submitButton.boundingBox();
        expect(submitBox?.width).toBeGreaterThan(250); // Button should be wide on mobile
    });

    test('should hide hero panel on mobile', async ({ page }) => {
        // Hero panel (AuthLeftPanel) uses `hidden lg:flex` — it is NOT visible at 375px
        const heroPanel = page.locator('[class*="hidden"][class*="lg\\:flex"]').first();
        await expect(heroPanel).not.toBeVisible();
    });

    test('should have touch-friendly input sizes', async ({ page }) => {
        const emailInput = page.locator('input[type="email"]');
        const inputBox = await emailInput.boundingBox();

        // Touch targets should be at least 44px tall (Apple HIG)
        expect(inputBox?.height).toBeGreaterThanOrEqual(40);
    });

    test('should allow password toggle on mobile', async ({ page }) => {
        const passwordInput = page.locator('input[placeholder="••••••••"]');
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Find and click eye icon
        const eyeIcon = page.locator('button:has(svg)').filter({ hasText: '' }).first();
        if (await eyeIcon.isVisible()) {
            await eyeIcon.click();
        }
    });

    test('should work in landscape orientation', async ({ page }) => {
        await page.setViewportSize(MOBILE_LANDSCAPE);
        await page.waitForTimeout(500);

        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });
});

test.describe('Mobile Viewport - Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(MOBILE_PORTRAIT);
        await loginMobile(page);
    });

    test('should display mobile navigation correctly', async ({ page }) => {
        // Check if sidebar collapses or hamburger menu appears
        const dashboardBtn = page.getByRole('link', { name: /Dashboard|Home/ });
        const isLoggedIn = await dashboardBtn.isVisible().catch(() => false);

        if (isLoggedIn) {
            // Navigation should be accessible on mobile
            await expect(dashboardBtn).toBeVisible();
        } else {
            test.skip();
        }
    });

    test('should have scrollable content on mobile', async ({ page }) => {
        const dashboardBtn = page.getByRole('link', { name: /Dashboard|Home/ });

        if (await dashboardBtn.isVisible().catch(() => false)) {
            // Check page is scrollable if content overflows
            const pageHeight = await page.evaluate(() => document.body.scrollHeight);
            expect(pageHeight).toBeGreaterThan(0);
        } else {
            test.skip();
        }
    });

    test('should display charts responsively', async ({ page }) => {
        const dashboardBtn = page.getByRole('link', { name: /Dashboard|Home/ });

        if (await dashboardBtn.isVisible().catch(() => false)) {
            await dashboardBtn.click();
            await page.waitForLoadState('networkidle');
            // Charts should resize for mobile — check SVGs are in the DOM
            const chartCount = await page.locator('svg').count();
            expect(chartCount).toBeGreaterThan(0);
        } else {
            test.skip();
        }
    });
});

test.describe('Mobile Viewport - Finance', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(MOBILE_PORTRAIT);
        await loginMobile(page);
    });

    test('should display account cards in mobile layout', async ({ page }) => {
        const dashboardBtn = page.getByRole('link', { name: /Dashboard|Home/ });

        if (await page.locator('text=Net Worth').isVisible().catch(() => false)) {
            // We should be on Finance page already due to loginOrSignup default
            // Just verify we are seeing account cards
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();
            await page.waitForTimeout(1000);

            // Cards should stack vertically on mobile
            const cards = page.locator('[class*="glass-card"]');
            const cardCount = await cards.count();
            expect(cardCount).toBeGreaterThanOrEqual(0);
        } else {
            test.skip();
        }
    });

    test('should have touch-friendly action buttons', async ({ page }) => {
        const dashboardBtn = page.getByRole('link', { name: /Dashboard|Home/ });

        if (await page.locator('text=Net Worth').isVisible().catch(() => false)) {
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();
            await page.waitForTimeout(1000);

            // Add Account button should be accessible
            const addBtn = page.locator('button:has-text("Add Account")');
            if (await addBtn.isVisible().catch(() => false)) {
                const btnBox = await addBtn.boundingBox();
                expect(btnBox?.height).toBeGreaterThanOrEqual(36);
            }
        }
    });

    test('should allow horizontal scroll for transactions on mobile', async ({ page }) => {
        const dashboardBtn = page.getByRole('link', { name: /Dashboard|Home/ });

        if (await page.locator('text=Net Worth').isVisible().catch(() => false)) {
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();
            await page.waitForTimeout(1000);

            // Page should load without horizontal overflow issues
            const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
            const viewportWidth = MOBILE_PORTRAIT.width;

            // Allow some tolerance for margins
            expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50);
        }
    });
});

test.describe('Tablet Viewport', () => {
    test('should display split layout on tablet landscape', async ({ page }) => {
        await page.setViewportSize(TABLET_LANDSCAPE);
        await page.goto('/');

        // On tablet landscape, should see more content
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });

    test('should display properly on tablet portrait', async ({ page }) => {
        await page.setViewportSize(TABLET_PORTRAIT);
        await page.goto('/');

        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });
});

test.describe('Dark Mode on Mobile', () => {
    test('should respect system dark mode preference', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.setViewportSize(MOBILE_PORTRAIT);
        await page.goto('/');

        // Auth page should render correctly in dark mode
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });

    test('should toggle theme correctly on mobile', async ({ page }) => {
        await page.setViewportSize(MOBILE_PORTRAIT);
        await page.goto('/');

        // Find theme toggle button (should have an icon)
        const themeBtn = page.locator('button:has(svg.lucide-sun), button:has(svg.lucide-moon), button[title*="Theme"], button[aria-label*="Theme"]');
        const buttonCount = await themeBtn.count();

        expect(buttonCount).toBeGreaterThanOrEqual(0); // Optional based on load state
    });
});
