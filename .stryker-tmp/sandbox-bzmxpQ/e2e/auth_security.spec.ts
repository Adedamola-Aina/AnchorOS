// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Auth Security Features', () => {

    test('enforces rate limiting after multiple failed attempts', async ({ page }) => {
        // 1. Navigate to login
        await page.goto('/');

        // 2. Attempt login 4 times with wrong password (attempts 1-4)
        for (let i = 0; i < 4; i++) {
            await page.getByPlaceholder('you@example.com').fill('security_test@anchor-os.com');
            await page.getByPlaceholder('••••••••').fill('wrongpassword123');
            await page.getByRole('button', { name: 'Sign In' }).click();

            // Wait for standard error
            await expect(page.locator('text=Incorrect email or password')).toBeVisible();
        }

        // 3. 5th attempt should be locked out
        await page.getByPlaceholder('you@example.com').fill('security_test@anchor-os.com');
        await page.getByPlaceholder('••••••••').fill('wrongpassword123');
        await page.getByRole('button', { name: 'Sign In' }).click();

        // 4. Verify Lockout Message
        await expect(page.locator('text=Too many failed attempts')).toBeVisible();
    });

    test('supports password reset flow', async ({ page }) => {
        await page.goto('/');

        // 1. Click Forgot Password
        await page.getByRole('button', { name: 'Forgot?' }).click();

        // 2. Verify UI changes
        await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
        await expect(page.getByPlaceholder('••••••••')).not.toBeVisible(); // Password field hidden

        // 3. Submit email
        await page.getByPlaceholder('you@example.com').fill('reset_test@anchor-os.com');
        await page.getByRole('button', { name: 'Send Link' }).click();

        // 4. Verify Toast/Success by checking navigation back to login or success state
        // The current implementation setsAuthMode('login') on success
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    });
});
