// @ts-nocheck
import { expect, type Page } from '@playwright/test';
import { assertLoopbackTarget } from '../scripts/ci/emulator-harness.mjs';

/** How long a deterministic login may take before it is a setup failure. */
const LOGIN_TIMEOUT_MS = 20000;

/** The emulator endpoint a local emulator-mode login MUST reach. */
export const EMULATOR_AUTH_ORIGIN = 'http://127.0.0.1:9099';

/**
 * The seeded authenticated suites use the disposable repository fixture
 * identity, which is emulator-only. Refuse a non-loopback target before any
 * credential is submitted (fail closed), so an `E2E_BASE_URL` pointed at a
 * deployed project can never receive repository fixture credentials.
 */
export function assertFixtureTargetIsLocal(env: NodeJS.ProcessEnv = process.env): void {
    assertLoopbackTarget(env.E2E_BASE_URL, { what: 'E2E_BASE_URL' });
}

/**
 * Text the app renders when authentication fails. Used to fail a seeded login
 * as soon as the real cause is visible instead of waiting for the test timeout.
 */
const AUTH_ERROR_PATTERN =
    /Error \(auth\/|api-key-not-valid|Incorrect email or password|No account found|Invalid API key|auth\/network-request-failed/i;

/**
 * Record (redacted) auth-relevant network traffic and console errors so a
 * failed login can report WHY it failed: which origin the credentials were
 * sent to, and whether the emulator was reached at all.
 */
export function observeAuthTraffic(page: Page): { requests: string[]; consoleErrors: string[] } {
    const requests: string[] = [];
    const consoleErrors: string[] = [];
    const interesting = (url: string) => /identitytoolkit|securetoken|firebaseapp\.com|googleapis\.com/i.test(url);

    page.on('request', (request) => {
        const url = request.url();
        if (!interesting(url)) return;
        try {
            const parsed = new URL(url);
            for (const key of [...parsed.searchParams.keys()]) {
                if (/key|token/i.test(key)) parsed.searchParams.set(key, '<redacted>');
            }
            requests.push(`${request.method()} ${parsed.origin}${parsed.pathname}`);
        } catch {
            requests.push(`${request.method()} ${url.split('?')[0]}`);
        }
    });
    page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        consoleErrors.push(msg.text().slice(0, 300));
    });
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${String(err.message).slice(0, 300)}`));

    return { requests, consoleErrors };
}

/**
 * Deterministic login for the seeded authenticated suites.
 *
 * Contract (deliberately different from loginOrSignup below):
 *   - exactly ONE attempt: no signup fallback, no verification bypass, no
 *     onboarding skip, no re-submitting credentials, no navigating elsewhere;
 *   - bounded waits only (no fixed sleeps), and the first meaningful outcome —
 *     authenticated shell or visible auth error — ends the wait;
 *   - a failure throws immediately with non-secret diagnostics (target origin,
 *     recorded auth request origins, whether the emulator was reached, console
 *     errors), so a broken environment never surfaces as a 60s timeout.
 *
 * `loginOrSignup` is kept for the specs that intentionally exercise
 * signup/onboarding; this helper is the authenticated-fixture path only.
 */
export async function loginWithSeededIdentity(
    page: Page,
    user: { email: string; password: string },
    options: { attach?: (name: string, body: string, contentType: string) => Promise<void> } = {},
): Promise<void> {
    // Fail closed BEFORE submitting anything: the fixture identity is
    // emulator-only and must never be sent to a deployed project.
    assertFixtureTargetIsLocal();
    const traffic = observeAuthTraffic(page);

    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await emailInput.fill(user.email);
    await passwordInput.fill(user.password);
    await page.locator('button:has-text("Sign In"), button[type="submit"]').first().click();

    const shell = page.locator('aside').or(page.locator('nav[aria-label="Mobile navigation"]')).first();
    const failureText = page.locator('body').getByText(AUTH_ERROR_PATTERN).first();
    await Promise.race([
        shell.waitFor({ state: 'visible', timeout: LOGIN_TIMEOUT_MS }),
        failureText.waitFor({ state: 'visible', timeout: LOGIN_TIMEOUT_MS }),
    ]).catch(() => undefined);

    if (await shell.isVisible().catch(() => false)) return;

    let targetOrigin = page.url();
    try {
        targetOrigin = new URL(page.url()).origin;
    } catch {
        /* keep the raw URL */
    }
    const visibleText = (await page.locator('body').innerText({ timeout: 3000 }).catch(() => ''))
        .replace(/\s+/g, ' ')
        .slice(0, 500);
    const emulatorReached = traffic.requests.some((entry) => entry.includes('127.0.0.1:9099'));
    const diagnostics = {
        targetOrigin,
        finalUrl: page.url(),
        emulatorExpected: EMULATOR_AUTH_ORIGIN,
        emulatorReached,
        authRequests: traffic.requests.slice(0, 10),
        consoleErrors: traffic.consoleErrors.slice(0, 10),
        visibleText,
    };
    if (options.attach) {
        await options
            .attach('e2e-auth-diagnostics', JSON.stringify(diagnostics, null, 2), 'application/json')
            .catch(() => undefined);
    }

    throw new Error(
        `E2E login failed for the seeded identity.\n` +
            `  target origin:   ${targetOrigin}\n` +
            `  final URL:       ${diagnostics.finalUrl}\n` +
            `  emulator login:  ${emulatorReached ? `reached ${EMULATOR_AUTH_ORIGIN}` : `NOT reached (expected ${EMULATOR_AUTH_ORIGIN} in emulator development)`}\n` +
            `  auth requests:   ${diagnostics.authRequests.length ? diagnostics.authRequests.join(' | ') : '(none)'}\n` +
            `  visible text:    ${visibleText || '(none)'}\n` +
            `  console errors:  ${diagnostics.consoleErrors.join(' | ') || '(none)'}\n` +
            `  Run this suite with \`npm run test:e2e:local\` so the demo-anchor-os emulators and the seeded ` +
            `fixture identity are in place.`,
    );
}

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
