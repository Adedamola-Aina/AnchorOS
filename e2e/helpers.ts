// @ts-nocheck
import { expect, type Page } from '@playwright/test';

/**
 * Robust Auth flow: Login, and if user doesn't exist, Signup.
 * Then bypass verification and navigate to Finance/Dashboard.
 * Also ensures an initial bank account exists.
 */
export async function loginOrSignup(page: Page, user: { email: string; password: string; name?: string }, skipNavigation = false) {
    console.log(`[E2E] Auth flow: ${user.email}`);
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

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

    const waitForAppShell = () => page.waitForFunction(() => {
        const aside = document.querySelector('aside');
        const bottomNav = document.querySelector('nav[aria-label="Mobile navigation"]');
        const asideVisible = !!(aside && getComputedStyle(aside).display !== 'none');
        const navVisible = !!(bottomNav && getComputedStyle(bottomNav).display !== 'none');
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
            .map(node => (node.textContent || '').trim().toLowerCase());
        const appHeadingVisible = headings.some(text =>
            text.includes('dashboard') ||
            text.includes('finance') ||
            text.includes('commitments') ||
            text.includes('system') ||
            text.includes('settings')
        );
        return asideVisible || navVisible || appHeadingVisible;
    }, null, { timeout: 30000 }).catch(() => null);

    // Wait for authenticated app shell; fall back to dashboard navigation when shell detection is delayed.
    const shellReady = await waitForAppShell();

    if (!shellReady) {
        const authFormStillVisible = await page.locator('input[name="email"]').isVisible().catch(() => false);
        if (authFormStillVisible) {
            await page.fill('input[name="email"]', user.email).catch(() => undefined);
            await page.fill('input[name="password"]', user.password).catch(() => undefined);
            await page.click('button:has-text("Sign In")').catch(() => undefined);
            await page.waitForTimeout(4000);
        }

        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        const shellReadyAfterGoto = await waitForAppShell();

        if (!shellReadyAfterGoto) {
            const stillOnAuth = await page.locator('input[name="email"]').isVisible().catch(() => false);
            if (stillOnAuth) {
                await page.fill('input[name="email"]', user.email).catch(() => undefined);
                await page.fill('input[name="password"]', user.password).catch(() => undefined);
                await page.click('button:has-text("Sign In")').catch(() => undefined);
                await page.waitForTimeout(4000);
                await page.goto('/dashboard', { waitUntil: 'domcontentloaded' }).catch(() => undefined);
                await waitForAppShell();
            }
        }
    }

    // Optional: Navigate to Finance and ensure account exists
    if (!skipNavigation) {
        const desktopFinanceBtn = page.locator('aside').getByRole('link', { name: 'Finance' }).first();
        const mobileFinanceBtn = page.locator('nav[aria-label="Mobile navigation"] a, nav[aria-label="Mobile navigation"] button').filter({ hasText: 'Finance' }).first();
        const canUseDesktopNav = await desktopFinanceBtn.isVisible({ timeout: 1500 }).catch(() => false);
        const canUseMobileNav = !canUseDesktopNav && await mobileFinanceBtn.isVisible({ timeout: 1500 }).catch(() => false);

        if (canUseDesktopNav || canUseMobileNav) {
            console.log("[E2E] Navigating to Finance and checking accounts...");
            const financeBtn = canUseDesktopNav ? desktopFinanceBtn : mobileFinanceBtn;
            await financeBtn.click({ timeout: 5000 }).catch(() => undefined);
            await page.waitForTimeout(5000);

            // Detect empty state
            const noAccountsYet = page.locator('h3:has-text("No accounts yet"), text=No accounts yet').first();
            const createFirstAccountCta = page.getByRole('button', { name: /Create your first account/i }).first();
            const addAccountBtn = page.getByRole('button', { name: /Add Account/i }).first();

            if (await noAccountsYet.isVisible().catch(() => false) || await createFirstAccountCta.isVisible().catch(() => false) || await addAccountBtn.isVisible().catch(() => false)) {
                console.log("[E2E] Creating initial account...");
                if (await createFirstAccountCta.isVisible().catch(() => false)) {
                    await createFirstAccountCta.click();
                } else if (await addAccountBtn.isVisible().catch(() => false)) {
                    await addAccountBtn.click();
                }

                const form = page.locator('form').filter({ hasText: /Account Name|Account/i });
                await expect(form).toBeVisible({ timeout: 10000 });

                const nameInput = form.locator('input[placeholder*="Zenith"], input[placeholder*="Main Checking" i], input[placeholder*="e.g." i]').first();
                await expect(nameInput).toBeVisible({ timeout: 5000 });
                await nameInput.fill('Checking');

                const amountInput = form.locator('input[placeholder="0.00"], input[inputmode="decimal"], input[name*="balance" i]').first();
                await expect(amountInput).toBeVisible({ timeout: 5000 });
                await amountInput.fill('1000');

                const submitBtn = form.getByRole('button', { name: /Create Account|Save Account|Create|Save/i }).first();
                await submitBtn.click();

                await page.waitForTimeout(5000);

                const accountCreated = page.locator('text=Checking').or(page.locator('text=Net Worth')).or(page.getByRole('heading', { name: 'Finance' }));
                await expect(accountCreated.first()).toBeVisible({ timeout: 20000 });
                console.log("[E2E] Account setup complete.");
            }
        } else {
            await page.goto('/finance', { waitUntil: 'domcontentloaded' }).catch(() => undefined);
            await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 15000 });
        }
    }
}
