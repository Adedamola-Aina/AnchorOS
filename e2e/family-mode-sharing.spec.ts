// @ts-nocheck
import { test, expect } from '@playwright/test';

// NOTE: These tests require two pre-configured users (Owner and Member).
// Replace with actual test credentials or secure seeding logic.
// SKIP: These tests use placeholder credentials that don't exist in Firebase emulator.
// TODO: Seed real test users or integrate with emulator auth before enabling.
const OWNER_EMAIL = 'owner@example.com';
const OWNER_PASS = 'password123';
const MEMBER_EMAIL = 'member@example.com';
const MEMBER_PASS = 'password123';

test.describe('Family Mode Account Sharing', () => {
    test.skip(true, 'Requires pre-seeded owner/member test users — not yet configured');

    test.describe('As Owner', () => {
        test('can share an account with family member', async ({ page }) => {
            // Login as owner
            await page.goto('/login');
            await page.fill('input[type="email"]', OWNER_EMAIL);
            await page.fill('input[type="password"]', OWNER_PASS);
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
            // Login as owner with shared account
            await page.goto('/login');
            await page.fill('input[type="email"]', OWNER_EMAIL);
            await page.fill('input[type="password"]', OWNER_PASS);
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
        test('can see shared accounts', async ({ page }) => {
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', MEMBER_EMAIL);
            await page.fill('input[type="password"]', MEMBER_PASS);
            await page.click('button[type="submit"]');

            // Navigate to Finance
            await page.click('text=Finance');

            // Verify shared account appears with specific indicator (e.g. family icon or owner name)
            // This selector depends on exact implementation of AccountCard
            await expect(page.locator('.lucide-users')).toBeVisible();
        });

        test('can view transactions on shared account', async ({ page }) => {
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', MEMBER_EMAIL);
            await page.fill('input[type="password"]', MEMBER_PASS);
            await page.click('button[type="submit"]');
            await page.click('text=Finance');

            // Click on shared account
            await page.click('.account-card:has(.lucide-users)');

            // Verify transactions are visible
            await expect(page.locator('text=History')).toBeVisible();
            // Check for transaction items
            const txItems = page.locator('.transaction-item'); // hypothetical class or structure
            // Just ensuring list is present
            await expect(page.locator('.divide-y')).toBeVisible();
        });

        test('can add transaction to shared account', async ({ page }) => {
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', MEMBER_EMAIL);
            await page.fill('input[type="password"]', MEMBER_PASS);
            await page.click('button[type="submit"]');
            await page.click('text=Finance');

            // Click on shared account and then "Pay Bill" or global "New Transaction"
            await page.click('.account-card:has(.lucide-users)');
            await page.click('button:has-text("Pay Bill")');

            // Fill form
            await page.fill('input[placeholder="e.g. Groceries, Upwork Salary"]', 'Shared Pizza');
            await page.fill('input[placeholder="0.00"]', '25.00');
            await page.click('button[type="submit"]');

            // Verify it appears
            await expect(page.getByText('Transaction recorded successfully')).toBeVisible();
            await expect(page.getByText('Shared Pizza')).toBeVisible();
        });

        test('cannot delete transactions on shared account', async ({ page }) => {
            // Login as family member
            await page.goto('/login');
            await page.fill('input[type="email"]', MEMBER_EMAIL);
            await page.fill('input[type="password"]', MEMBER_PASS);
            await page.click('button[type="submit"]');
            await page.click('text=Finance');
            await page.click('.account-card:has(.lucide-users)');

            // Verify delete button is not visible
            // Assuming delete button has specific aria-label or icon
            const deleteBtns = page.locator('button:has(.lucide-trash-2)');
            await expect(deleteBtns).toBeHidden();
        });
    });
});
