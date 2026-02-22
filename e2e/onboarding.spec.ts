// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
    test('New user is guided through onboarding wizard', async ({ page }) => {
        page.on('console', msg => console.log(`[Browser]: ${msg.text()}`));

        // 1. Generate unique user
        const timestamp = Date.now();
        const email = `test-onboard-${timestamp}@anchor-os.dev`;
        const password = 'TestPassword123!';

        // 2. Go to generic root
        await page.goto('/');

        // 3. Switch to Sign Up
        await page.click('button:has-text("Sign up")'); // Toggle link

        // 4. Fill Form
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);

        // 5. Submit
        await page.click('button:has-text("Create Account")');

        // 6. Verify Onboarding Wizard appears (Step 1)
        await expect(page.locator('text=Welcome to Anchor OS')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=Let\'s Begin')).toBeVisible();

        // 7. Proceed to Step 2
        await page.click('button:has-text("Let\'s Begin")');
        await expect(page.locator('text=Add Primary Account')).toBeVisible();

        // 8. Fill Account Details
        await page.fill('input[placeholder="e.g. Chase Checking"]', 'Main Bank');
        await page.fill('input[placeholder="0.00"]', '1000');
        await page.click('button:has-text("Continue")');

        // 9. Verify Step 3
        await expect(page.locator('text=One Small Habit')).toBeVisible();

        // 10. Fill Habit Details
        await page.fill('input[placeholder*="e.g. Drink water"]', 'Morning Run');
        await page.click('button:has-text("Finish Setup")');

        // 11. Verify Dashboard (Onboarding Complete)
        // After onboarding, may land on dashboard or need navigation
        await page.waitForTimeout(3000);

        // Navigate to dashboard to check onboarding results
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        // Should see dashboard content — net worth, sidebar, or navigation
        const dashboardContent = page.locator('text=Net Worth').or(page.locator('aside')).or(page.locator('text=Productivity'));
        await expect(dashboardContent.first()).toBeVisible({ timeout: 15000 });

        // Check if the account and task were actually created
        await expect(page.locator('text=Main Bank').first()).toBeVisible();
    });
});
