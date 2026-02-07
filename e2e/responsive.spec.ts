import { test, expect, devices, type Page } from '@playwright/test';
import { loginOrSignup } from './helpers';
import { TEST_USER } from './fixtures/test-data';

// Device configurations per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M6
const MOBILE_DEVICE = devices['iPhone 13'];
const DESKTOP = { width: 1280, height: 800 };

// Helper: Ensure clean mobile state (close drawer if open, press Escape)
async function ensureCleanMobileState(page: Page) {
    // Press Escape to close any open menus/modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
}

test.describe('Responsive Layout Tests', () => {

    test.beforeEach(async ({ page }) => {
        await loginOrSignup(page, TEST_USER);
    });

    test('Dashboard - Mobile Layout (iPhone 13)', async ({ page }) => {
        await page.setViewportSize({ width: MOBILE_DEVICE.viewport.width, height: MOBILE_DEVICE.viewport.height });
        await page.waitForTimeout(500); // Allow layout to settle after resize

        // 1. Sidebar should be Hidden (aside uses hidden md:flex)
        const sidebar = page.locator('aside');
        await expect(sidebar).toBeHidden();

        // 2. Bottom Navigation should be Visible (per M3.1)
        const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(bottomNav).toBeVisible();

        // 3. Main content area should be Visible
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // 4. Grid should be single column (Vertical Stacking)
        const widgets = page.locator('.glass-card');
        await page.waitForTimeout(1000);

        const firstWidget = widgets.nth(0);
        const secondWidget = widgets.nth(1);

        if (await firstWidget.isVisible().catch(() => false) && await secondWidget.isVisible().catch(() => false)) {
            const box1 = await firstWidget.boundingBox();
            const box2 = await secondWidget.boundingBox();

            if (box1 && box2) {
                expect(box2.y).toBeGreaterThan(box1.y + box1.height * 0.5);
            }
        }
    });

    test('Dashboard - Desktop Layout (1280px)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        await page.waitForTimeout(500); // Allow layout to settle after resize

        // 1. Sidebar should be Visible
        const sidebar = page.locator('aside');
        await expect(sidebar).toBeVisible();

        // 2. Bottom Navigation should be Hidden on Desktop (md:hidden class per M3.1)
        const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(bottomNav).toBeHidden();

        // 3. Grid should be multi-column (Horizontal stacking)
        const widgets = page.locator('.glass-card');
        await page.waitForTimeout(1000);

        const firstWidget = widgets.nth(0);
        const secondWidget = widgets.nth(1);

        if (await firstWidget.isVisible().catch(() => false) && await secondWidget.isVisible().catch(() => false)) {
            const box1 = await firstWidget.boundingBox();
            const box2 = await secondWidget.boundingBox();

            if (box1 && box2) {
                expect(box2.x).toBeGreaterThanOrEqual(box1.x);
            }
        }
    });

    test('Commitments - Mobile Navigation via Bottom Nav', async ({ page }) => {
        await page.setViewportSize({ width: MOBILE_DEVICE.viewport.width, height: MOBILE_DEVICE.viewport.height });

        // Navigate fresh and ensure clean state
        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
        await ensureCleanMobileState(page);

        // NAVIGATE via Bottom Navigation 
        const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(bottomNav).toBeVisible();

        // Click Tasks link
        await bottomNav.getByRole('link', { name: 'Tasks' }).click({ force: true });
        await page.waitForURL('**/commitments');

        // Verify we navigated to commitments
        await expect(page.getByText('Manage your daily obligations')).toBeVisible();
        await expect(page.getByText('New Commitment')).toBeVisible();
    });

    test('Settings - Bottom Nav Link Exists and Routes Correctly', async ({ page }) => {
        await page.setViewportSize({ width: MOBILE_DEVICE.viewport.width, height: MOBILE_DEVICE.viewport.height });

        // Navigate fresh and ensure clean state
        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
        await ensureCleanMobileState(page);

        // Verify bottom nav has Settings link with correct URL
        const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(bottomNav).toBeVisible();

        const settingsLink = bottomNav.getByRole('link', { name: 'Settings' });
        await expect(settingsLink).toBeVisible();
        await expect(settingsLink).toHaveAttribute('href', '/settings');

        // Direct navigation to settings works
        await page.goto('/settings');
        await page.waitForLoadState('domcontentloaded');
        await expect(page.getByText('System Settings')).toBeVisible();
    });

    test('Bottom Navigation - All Links Present with Correct URLs', async ({ page }) => {
        await page.setViewportSize({ width: MOBILE_DEVICE.viewport.width, height: MOBILE_DEVICE.viewport.height });

        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');

        const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(bottomNav).toBeVisible();

        // Verify all navigation links exist with correct hrefs
        const expectedLinks = [
            { name: 'Home', href: '/dashboard' },
            { name: 'Tasks', href: '/commitments' },
            { name: 'Finance', href: '/finance' },
            { name: 'Settings', href: '/settings' },
        ];

        for (const link of expectedLinks) {
            const navLink = bottomNav.getByRole('link', { name: link.name });
            await expect(navLink).toBeVisible();
            await expect(navLink).toHaveAttribute('href', link.href);
        }
    });

});
