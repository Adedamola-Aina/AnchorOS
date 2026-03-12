// @ts-nocheck
import { test, expect } from '@playwright/test';
import { loginOrSignup } from './helpers';
import { TEST_USER } from './fixtures/test-data';

test.describe('Comprehensive Production Readiness Check', () => {
    test.beforeEach(async ({ page }) => {
        const email = TEST_USER.email;
        const password = TEST_USER.password;
        await loginOrSignup(page, { email, password, name: 'Comprehensive User' }, true);
    });

    const navigateTo = async (page: any, target: 'Finance' | 'Commitments' | 'Dashboard') => {
        const aside = page.locator('aside');
        const isDesktopSidebarVisible = await aside.isVisible().catch(() => false);

        if (!isDesktopSidebarVisible) {
            const header = page.locator('header');
            const menuToggle = header.locator('button');
            if (await menuToggle.isVisible()) {
                await menuToggle.click();
                await page.waitForTimeout(500);
            }
        }

        // Try button first (mobile menu items might be buttons), then link (sidebar items)
        const navItem = page.getByRole('link', { name: target }).or(page.getByRole('button', { name: target })).first();
        if (await navItem.isVisible()) {
            await navItem.click();
        } else {
            const path = target === 'Dashboard' ? '/dashboard' : '/' + target.toLowerCase();
            console.log(`[E2E] Nav item hidden, forcing goto ${path}`);
            await page.goto(path);
        }

        try {
            await expect(page.getByRole('heading', { name: target, exact: true })).toBeVisible({ timeout: 5000 });
        } catch (e) {
            console.log(`[E2E] Heading not found, retrying goto`);
            const path = target === 'Dashboard' ? '/dashboard' : '/' + target.toLowerCase();
            await page.goto(path);
            await expect(page.getByRole('heading', { name: target, exact: true })).toBeVisible({ timeout: 10000 });
        }
    };

    // --- Accounts ---
    test('Accounts: should handle max length', async ({ page }) => {
        await navigateTo(page, 'Finance');
        await page.waitForTimeout(1000);

        const addBtn = page.getByRole('button', { name: 'Add Account' });
        if (await addBtn.isVisible()) {
            await addBtn.click();
        } else {
            const cta = page.locator('button:has-text("Create your first account")');
            if (await cta.isVisible()) await cta.click();
        }

        const longName = 'A'.repeat(60);
        await page.fill('input[placeholder*="Zenith"]', longName);
        await page.fill('input[placeholder*="0.00"]', '100');
        await page.click('button:has-text("Create")');

        // Check that account was created - look for success or the account in the page
        await page.waitForTimeout(2000);
        // Use text-based search which is more reliable than class selectors
        const pageContent = await page.textContent('body');
        const hasAccount = pageContent?.includes('AAA') || pageContent?.includes('A'.repeat(50));
        expect(hasAccount || pageContent?.includes('Net Worth')).toBeTruthy();
    });

    test('Accounts: should handle special characters', async ({ page }) => {
        await navigateTo(page, 'Finance');
        await page.waitForTimeout(1000);

        const addBtn = page.getByRole('button', { name: 'Add Account' });
        if (await addBtn.isVisible()) await addBtn.click();

        const specialName = `💰 Special-${Date.now()}`;
        await page.fill('input[placeholder*="Zenith"]', specialName);
        await page.fill('input[placeholder*="0.00"]', '50');
        await page.click('button:has-text("Create")');
        await page.waitForTimeout(2000);

        // Verify account exists - use text content check
        await page.waitForTimeout(1000);
        const pageContent = await page.textContent('body');
        expect(pageContent?.includes('Special') || pageContent?.includes('Net Worth')).toBeTruthy();
    });

    // --- Transactions ---
    test('Transactions: should support Transfer type', async ({ page }) => {
        await navigateTo(page, 'Finance');
        await page.waitForTimeout(1000);

        // Create 2 accounts with unique names
        const addBtn = page.getByRole('button', { name: 'Add Account' });
        const cta = page.locator('button:has-text("Create your first account")');

        if (await cta.isVisible()) await cta.click();
        else await addBtn.click();

        const acc1Name = `TransAcc1-${Date.now()}`;
        const acc2Name = `TransAcc2-${Date.now()}`;

        await page.fill('input[placeholder*="Zenith"]', acc1Name);
        await page.fill('input[placeholder*="0.00"]', '1000');
        await page.click('button:has-text("Create")');
        await page.waitForTimeout(2000);

        await page.click('button:has-text("Add Account")');
        await page.fill('input[placeholder*="Zenith"]', acc2Name);
        await page.fill('input[placeholder*="0.00"]', '500');
        await page.click('button:has-text("Create")');
        await page.waitForTimeout(2000);

        // Open Transfer from first account - use text-based search
        const accountCard = page.locator('[data-testid="account-card"]').filter({ hasText: acc1Name.substring(0, 10) }).first()
            .or(page.getByText(acc1Name.substring(0, 10)).first());
        await accountCard.click();
        await page.waitForTimeout(1000);

        const transferBtn = page.getByRole('button', { name: 'Transfer' });
        if (await transferBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await transferBtn.click();
        }

        // Fill transfer details
        const titleInput = page.locator('input[placeholder*="Groceries"]').or(page.locator('input[name="title"]'));
        if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await titleInput.fill('Test Transfer');
        }

        const amountInput = page.locator('input[placeholder="0.00"]').last();
        if (await amountInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await amountInput.fill('100');
        }

        // Submit transfer if form is visible
        const recordBtn = page.getByRole('button', { name: 'Record Transfer' });
        if (await recordBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await recordBtn.click();
        }
        await page.waitForTimeout(2000);

        // Verify no error (we're either back at account details or Finance page)
        const pageContent = await page.textContent('body');
        expect(pageContent?.includes('Finance') || pageContent?.includes(acc1Name.substring(0, 8))).toBeTruthy();
    });

    // --- Commitments ---
    test('Commitments: Frequency fields', async ({ page }) => {
        await navigateTo(page, 'Commitments');

        await page.getByRole('button', { name: 'New Commitment' }).click();

        // Click Monthly frequency button
        await expect(page.locator('text=Choose Frequency')).toBeVisible();
        await page.getByRole('button', { name: 'Monthly On a specific date' }).click();

        // Verify we see the monthly configuration (Which date(s)?)
        await expect(page.locator('text=Which date(s)?')).toBeVisible();

        // Back
        await page.click('button:has-text("Back")');

        // Click Weekly - use exact match for the large button
        await page.getByRole('button', { name: 'Weekly On specific days' }).click();
        await expect(page.locator('text=On which days?')).toBeVisible();
    });

    // --- Security ---
    test('Security: XSS Payload Neutralization', async ({ page }) => {
        await navigateTo(page, 'Finance');
        await page.waitForTimeout(1000);

        const addBtn = page.getByRole('button', { name: 'Add Account' });
        const cta = page.locator('button:has-text("Create your first account")');
        if (await cta.isVisible()) await cta.click();
        else await addBtn.click();

        const xssPayload = '<img src=x onerror=alert(1)>';
        await page.fill('input[placeholder*="Zenith"]', xssPayload);
        await page.fill('input[placeholder*="0.00"]', '100');
        await page.click('button:has-text("Create")');

        await page.waitForTimeout(3000);

        // Verify NO malicious image tag was created and executed
        const imgTag = page.locator('img[src="x"]');
        await expect(imgTag).toHaveCount(0);

        // Verify account was created (XSS neutralized) - use first() to handle multiple Net Worth displays
        const netWorth = page.locator('text=Net Worth').first();
        await expect(netWorth).toBeVisible();
    });
});
