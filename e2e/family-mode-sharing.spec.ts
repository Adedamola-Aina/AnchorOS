// @ts-nocheck
import { test, expect } from '@playwright/test';
import { loginOrSignup } from './helpers';
import { TEST_USER, TEST_USER_2 } from './fixtures/test-data';

test.describe('Family Mode Account Sharing', () => {

    test.describe('As Owner', () => {
        test.beforeEach(async ({ page }) => {
            await loginOrSignup(page, TEST_USER);
        });

        test('can navigate to Finance and see account management controls', async ({ page }) => {
            await page.getByRole('link', { name: 'Finance' }).click();
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 10000 });
            // Verify Finance view is accessible with account management controls present
            await expect(page.getByRole('button', { name: 'Add Account' }).first()).toBeVisible();
        });

        test('can share an account with family member', async ({ page }) => {
            test.skip(true, 'Requires pre-established family connection: owner must have an account and an active family member. Enable once emulator is seeded with family fixture.');
            // Login as owner
            await page.goto('/login');
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await expect(page).toHaveURL('/dashboard');

            // Navigate to Finance
            await page.click('text=Finance');
            await expect(page).toHaveURL('/finance');

            // Click on account (assuming at least one exists and is first)
            await page.click('.account-card:first-child');

            // Wait for details
            await expect(page.locator('h1')).toBeVisible();

            // Toggle share (assuming unshared initially)
            // Look for Share button (User icon)
            const shareBtn = page.locator('button[title="Manage Sharing"]');
            if (await shareBtn.isVisible()) {
                await shareBtn.click();
            } else {
                // Already shared or not visible
                console.log('Share button not visible or unexpected state');
            }

            // Confirm any dialogs if needed
            // Verify toast or UI update
            await expect(page.getByText('Account shared with family')).toBeVisible();
        });

        test('can unshare an account', async ({ page }) => {
            test.skip(true, 'Requires pre-established shared account state. Enable once emulator is seeded with family fixture.');
            // Login as owner with shared account
            await page.goto('/login');
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');

            await page.click('text=Finance');
            await page.click('.account-card:first-child');

            // Toggle share off
            const shareBtn = page.locator('button[title="Manage Sharing"]');
            await shareBtn.click();

            // Confirm dialog
            await page.click('button:has-text("Stop Sharing")');

            // Verify family emoji disappears or toast
            await expect(page.getByText('Account sharing removed')).toBeVisible();
        });
    });

    test.describe('As Family Member (Non-Owner)', () => {
        test.beforeEach(async ({ page }) => {
            await loginOrSignup(page, TEST_USER_2);
        });

        test('can navigate to Finance view', async ({ page }) => {
            await page.getByRole('link', { name: 'Finance' }).click();
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 10000 });
        });

        test('can see shared accounts', async ({ page }) => {
            test.skip(true, 'Requires pre-established family connection: TEST_USER_2 must be an accepted family member of TEST_USER. Enable once emulator is seeded with family fixture.');
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', TEST_USER_2.email);
            await page.fill('input[type="password"]', TEST_USER_2.password);
            await page.click('button[type="submit"]');

            // Navigate to Finance
            await page.click('text=Finance');

            // Verify shared account appears with specific indicator (e.g. family icon or owner name)
            await expect(page.locator('.lucide-users')).toBeVisible();
        });

        test('can view transactions on shared account', async ({ page }) => {
            test.skip(true, 'Requires pre-established family connection and shared account. Enable once emulator is seeded with family fixture.');
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', TEST_USER_2.email);
            await page.fill('input[type="password"]', TEST_USER_2.password);
            await page.click('button[type="submit"]');
            await page.click('text=Finance');

            // Click on shared account
            await page.click('.account-card:has(.lucide-users)');

            // Verify transactions are visible
            await expect(page.locator('text=History')).toBeVisible();
            await expect(page.locator('.divide-y')).toBeVisible();
        });

        test('can add transaction to shared account', async ({ page }) => {
            test.skip(true, 'Requires pre-established family connection and shared account. Enable once emulator is seeded with family fixture.');
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', TEST_USER_2.email);
            await page.fill('input[type="password"]', TEST_USER_2.password);
            await page.click('button[type="submit"]');
            await page.click('text=Finance');

            await page.click('.account-card:has(.lucide-users)');
            await page.click('button:has-text("Pay Bill")');

            await page.fill('input[placeholder="e.g. Groceries, Upwork Salary"]', 'Shared Pizza');
            await page.fill('input[placeholder="0.00"]', '25.00');
            await page.click('button[type="submit"]');

            await expect(page.getByText('Transaction recorded successfully')).toBeVisible();
            await expect(page.getByText('Shared Pizza')).toBeVisible();
        });

        test('cannot delete transactions on shared account', async ({ page }) => {
            test.skip(true, 'Requires pre-established family connection and shared account. Enable once emulator is seeded with family fixture.');
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', TEST_USER_2.email);
            await page.fill('input[type="password"]', TEST_USER_2.password);
            await page.click('button[type="submit"]');
            await page.click('text=Finance');
            await page.click('.account-card:has(.lucide-users)');

            // Verify delete button is not visible
            const deleteBtns = page.locator('button:has(.lucide-trash-2)');
            await expect(deleteBtns).toBeHidden();
        });
    });
});
