// @ts-nocheck
import { expect, type Page } from '@playwright/test';

/**
 * Robust Auth flow: Login, and if user doesn't exist, Signup.
 * Then bypass verification and navigate to Finance/Dashboard.
 * Also ensures an initial bank account exists.
 */
export async function loginOrSignup(page: Page, user: { email: string; password: string; name?: string }, skipNavigation = false) {
    console.log(`[E2E] Auth flow: ${user.email}`);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Fill credentials
    await page.fill('input[name="anchor_email"]', user.email);
    await page.fill('input[name="anchor_password"]', user.password);

    // Explicit click on the Login button
    await page.click('button:has-text("Sign In")');

    // Robust wait for either error, verification, or dashboard
    await page.waitForTimeout(5000);

    const signupLink = page.locator('text=Sign up');
    const isNoAccount = await page.isVisible('text=No account found');
    const isError = await page.isVisible('text=Incorrect email or password');

    if (isNoAccount || isError) {
        console.log(`[E2E] Signup needed for: ${user.email}`);
        if (await signupLink.isVisible()) {
            await signupLink.click();
        } else {
            // Might already be in signup mode or link is different
            await page.click('text=Create Account'); // Try to find the switch
        }
        await page.fill('input[name="anchor_email"]', user.email);
        await page.fill('input[name="anchor_password"]', user.password);
        await page.click('button:has-text("Create Account")');
        // Wait long for signup to settle
        await page.waitForTimeout(10000);
    }

    // Check for Verification screen
    const verifyScreen = page.locator('text=Verify your Email');
    if (await verifyScreen.isVisible()) {
        console.log("[E2E] Bypassing verification gate...");
        await page.click('text=I\'ve Verified It');
        await page.waitForTimeout(3000);
    }

    // Check for Onboarding Wizard (New User)
    const onboardingStart = page.locator('button:has-text("Start Setup")');
    if (await page.locator('text=Welcome aboard').isVisible()) {
        console.log("[E2E] New user detected, completing onboarding wizard...");
        if (await onboardingStart.isVisible()) {
            await onboardingStart.click();

            // Step 1: Account
            await expect(page.locator('text=Add Primary Account')).toBeVisible();
            await page.fill('input[placeholder="e.g. Chase Checking"]', 'Main Bank');
            await page.fill('input[placeholder="0.00"]', '1000');
            await page.click('button:has-text("Continue")');

            // Step 2: Habit
            await expect(page.locator('text=One Small Habit')).toBeVisible();
            await page.fill('input[placeholder*="e.g. Drink water"]', 'Morning Run');
            await page.click('button:has-text("Finish Setup")');

            await page.waitForTimeout(3000);
        }
    }

    // Wait for Dashboard content - sidebar (desktop) or bottom nav (mobile) indicates successful login
    // We increase timeout to accommodate cold starts or slow animations
    await page.waitForFunction(() => {
        const aside = document.querySelector('aside');
        const bottomNav = document.querySelector('nav[aria-label="Mobile navigation"]');
        const asideVisible = aside && getComputedStyle(aside).display !== 'none';
        const navVisible = bottomNav && getComputedStyle(bottomNav).display !== 'none';
        return asideVisible || navVisible;
    }, null, { timeout: 45000 });

    // Optional: Navigate to Finance and ensure account exists
    if (!skipNavigation) {
        // We need to handle both Desktop (sidebar visible) and Mobile (bottom nav)
        const aside = page.locator('aside');
        let financeBtn = aside.getByRole('link', { name: 'Finance' });

        // If on mobile, the desktop sidebar is hidden. Use the bottom nav instead.
        const isDesktopSidebarVisible = await aside.isVisible().catch(() => false);

        if (!isDesktopSidebarVisible) {
            // Mobile: Use bottom navigation bar
            financeBtn = page.locator('nav[aria-label="Mobile navigation"] a, nav[aria-label="Mobile navigation"] button').filter({ hasText: 'Finance' }).first();
        }

        if (await financeBtn.isVisible()) {
            console.log("[E2E] Navigating to Finance and checking accounts...");
            await financeBtn.click();
            await page.waitForTimeout(5000);

            // Detect empty state
            const noAccountsYet = page.locator('h3:has-text("No accounts yet")');
            if (await noAccountsYet.isVisible()) {
                console.log("[E2E] Creating initial account...");
                await page.click('button:has-text("Create your first account")');

                const form = page.locator('form').filter({ hasText: 'Account Name' });
                await expect(form).toBeVisible({ timeout: 10000 });

                await form.getByPlaceholder(/Zenith Spending/).fill('Checking');
                await form.getByPlaceholder('0.00').fill('1000');
                await form.locator('button[type="submit"]').click();

                await page.waitForTimeout(5000);

                const accountCreated = page.locator('text=Checking').or(page.locator('text=Net Worth'));
                await expect(accountCreated).toBeVisible({ timeout: 20000 });
                console.log("[E2E] Account setup complete.");
            }
        }
    }
}
