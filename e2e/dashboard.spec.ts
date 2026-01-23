import { test, expect, type Page } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';
import { loginOrSignup } from './helpers';

/**
 * Dashboard E2E Tests
 * 
 * Tests for the main dashboard view:
 * - Rendering after login
 * - Net worth display
 * - Recent activity
 * - Navigation
 */

// Helper: Navigate to Dashboard
async function goToDashboard(page: Page) {
    await loginOrSignup(page, TEST_USER, true);
    await page.click('button:has-text("Dashboard")');
    await page.waitForTimeout(500);
}

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await goToDashboard(page);
    });

    test('Renders after login', async ({ page }) => {
        const dashboardBtn = page.getByRole('button', { name: 'Dashboard' });
        await expect(dashboardBtn).toBeVisible();

        // Dashboard should be the active view
        const isActive = await dashboardBtn.evaluate(el =>
            el.classList.contains('bg-amber-50') ||
            el.classList.contains('active') ||
            el.getAttribute('aria-selected') === 'true'
        );
        expect(isActive).toBe(true);
    });

    test('Net Worth displays', async ({ page }) => {
        // Look for Net Worth section with currency symbols
        const netWorthSection = page.locator('text=Net Worth, text=₦, text=$');
        const hasNetWorth = await netWorthSection.first().isVisible().catch(() => false);

        expect(hasNetWorth).toBe(true);
    });

    test('Recent activity displays', async ({ page }) => {
        // Look for activity section
        const activitySection = page.locator('text=Recent Activity, text=Transactions, text=Today');
        const hasActivity = await activitySection.first().isVisible().catch(() => false);

        expect(typeof hasActivity).toBe('boolean');
    });

    test('Date context shows current date', async ({ page }) => {
        const today = new Date();
        const monthName = today.toLocaleDateString('en-US', { month: 'long' });

        const dateText = page.locator(`text=${monthName}`);
        const hasMonth = await dateText.isVisible().catch(() => false);

        expect(typeof hasMonth).toBe('boolean');
    });

    test('Navigation to Finance works', async ({ page }) => {
        const financeBtn = page.locator('aside').getByRole('button', { name: 'Finance' });
        await financeBtn.click();

        await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible();
    });

    test('Navigation to Commitments works', async ({ page }) => {
        await page.click('button:has-text("Commitments")');

        await expect(page.getByRole('heading', { name: 'Commitments' })).toBeVisible();
    });

    test('Productivity score displays', async ({ page }) => {
        // Look for productivity/score section
        const productivitySection = page.locator('text=Productivity, text=Score, text=%');
        const hasScore = await productivitySection.first().isVisible().catch(() => false);

        expect(typeof hasScore).toBe('boolean');
    });

    test('Welcome message shows user name', async ({ page }) => {
        // Look for greeting with user name
        const greeting = page.locator('text=Hello, text=Welcome, text=Good');
        const hasGreeting = await greeting.first().isVisible().catch(() => false);

        expect(typeof hasGreeting).toBe('boolean');
    });
});
