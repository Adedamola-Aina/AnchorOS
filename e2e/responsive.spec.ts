import { test, expect } from '@playwright/test';
import { loginOrSignup } from './helpers';
import { TEST_USER } from './fixtures/test-data';

// Viewport constants
const MOBILE = { width: 320, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

test.describe('Responsive Layout Tests', () => {

    test.beforeEach(async ({ page }) => {
        await loginOrSignup(page, TEST_USER);
    });

    test('Dashboard - Mobile Layout (320px)', async ({ page }) => {
        await page.setViewportSize(MOBILE);

        // 1. Sidebar should be Hidden
        const sidebar = page.locator('aside');
        await expect(sidebar).toBeHidden();

        // 2. Mobile Header should be Visible
        const mobileHeader = page.locator('header').filter({ hasText: 'Anchor' });
        await expect(mobileHeader).toBeVisible();

        // 3. Grid should be single column (Vertical Stacking)
        const widgets = page.locator('.glass-card');
        // Wait for animations
        await page.waitForTimeout(1000);

        const firstWidget = widgets.nth(0);
        const secondWidget = widgets.nth(1);

        await expect(firstWidget).toBeVisible();
        await expect(secondWidget).toBeVisible();

        const box1 = await firstWidget.boundingBox();
        const box2 = await secondWidget.boundingBox();

        if (box1 && box2) {
            // Allow slight overlap or margin, but essentially Y must increase
            expect(box2.y).toBeGreaterThan(box1.y + box1.height * 0.5);
        }
    });

    test('Dashboard - Desktop Layout (1280px)', async ({ page }) => {
        await page.setViewportSize(DESKTOP);

        // 1. Sidebar should be Visible
        const sidebar = page.locator('aside');
        await expect(sidebar).toBeVisible();

        // 2. Grid should be multi-column (Horizontal stacking)
        const widgets = page.locator('.glass-card');
        await page.waitForTimeout(1000);

        const firstWidget = widgets.nth(0);
        const secondWidget = widgets.nth(1);

        const box1 = await firstWidget.boundingBox();
        const box2 = await secondWidget.boundingBox();

        if (box1 && box2) {
            // In a 3-col grid, item 2 is to the right of item 1
            expect(box2.x).toBeGreaterThan(box1.x);
        }
    });

    test('Commitments - Mobile Navigation & Layout', async ({ page }) => {
        await page.setViewportSize(MOBILE);

        // NAVIGATE via Hamburger Menu
        await page.locator('header button').click(); // Toggle Menu
        // Scope to the visible drawer
        const drawer = page.locator('.fixed.inset-0.z-20');
        await expect(drawer).toBeVisible();

        await drawer.getByText('Commitments').click();

        // assertions
        await expect(page.getByText('Manage your daily obligations')).toBeVisible();
        await expect(page.getByText('New Commitment')).toBeVisible(); // Button

        // Check filter buttons exist (scroll check is hard, existence is enough for now)
        await expect(page.getByRole('button', { name: 'daily', exact: true })).toBeVisible();
    });

    test('Settings - Mobile Navigation & Layout', async ({ page }) => {
        await page.setViewportSize(MOBILE);

        // NAVIGATE
        await page.locator('header button').click();
        const drawer = page.locator('.fixed.inset-0.z-20');
        await expect(drawer).toBeVisible();

        await drawer.getByText('System').click();

        // Verify Header
        await expect(page.getByText('System Settings')).toBeVisible();

        // Verify Section Stacking
        // "User Profile" and "Appearance" should be stacked
        const profileCard = page.locator('.glass-card', { hasText: 'User Profile' });
        const appearanceCard = page.locator('.glass-card', { hasText: 'Appearance' });

        await expect(profileCard).toBeVisible();
        await expect(appearanceCard).toBeVisible();

        const b1 = await profileCard.boundingBox();
        const b2 = await appearanceCard.boundingBox();

        if (b1 && b2) {
            expect(b2.y).toBeGreaterThan(b1.y);
        }
    });

});
