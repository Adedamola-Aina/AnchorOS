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
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);

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
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="password"]', user.password);
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
    if (await page.locator('text=Welcome to Anchor OS.').isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log("[E2E] New user detected, skipping onboarding wizard...");
        const skipBtn = page.locator('button:has-text("Skip for now")');
        if (await skipBtn.isVisible()) {
            await skipBtn.click();
            await page.waitForTimeout(3000);
        }
    }

    // Wait for authenticated app shell; fall back to dashboard navigation when shell detection is delayed.
    const shellReady = await page.waitForFunction(() => {
        const aside = document.querySelector('aside');
        const bottomNav = document.querySelector('nav[aria-label="Mobile navigation"]');
        const asideVisible = !!(aside && getComputedStyle(aside).display !== 'none');
        const navVisible = !!(bottomNav && getComputedStyle(bottomNav).display !== 'none');
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
            .map(node => (node.textContent || '').trim());
        const appHeadingVisible = headings.some(text =>
            ['Dashboard', 'Finance', 'Commitments', 'System', 'Settings'].includes(text)
        );
        return asideVisible || navVisible || appHeadingVisible;
    }, null, { timeout: 30000 }).catch(() => null);

    if (!shellReady) {
        const authFormStillVisible = await page.locator('input[name="email"]').isVisible().catch(() => false);
        if (authFormStillVisible) {
            await page.click('button:has-text("Sign In")').catch(() => undefined);
            await page.waitForTimeout(4000);
        }

        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        const shellLocator = page
            .locator('aside, nav[aria-label="Mobile navigation"], h1:has-text("Dashboard"), h1:has-text("Finance"), h1:has-text("Commitments"), h1:has-text("System"), h1:has-text("Settings")')
            .first();
        await expect(shellLocator).toBeVisible({ timeout: 30000 });
    }

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
                await expect(accountCreated.first()).toBeVisible({ timeout: 20000 });
                console.log("[E2E] Account setup complete.");
            }
        } else {
            await page.goto('/finance', { waitUntil: 'domcontentloaded' }).catch(() => undefined);
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 15000 });
        }
    }
}
