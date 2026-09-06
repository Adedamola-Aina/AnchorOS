// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Marketing landing + public route smoke tests.
 *
 * Covers: landing content, 375px mobile layout, 44px touch targets,
 * keyboard focus on the login form, invalid-login error state, and the
 * unauthenticated redirect for private routes.
 */

test.describe('Marketing landing', () => {
    test('renders hero, pillars, privacy and CTAs', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByRole('heading', { name: /finance/i }).first()).toBeVisible();
        await expect(page.getByText(/your life data is not content/i)).toBeVisible();
        const startCta = page.getByRole('link', { name: /start with anchoros/i }).first();
        await expect(startCta).toHaveAttribute('href', '/login');
    });

    test('375px mobile layout has no horizontal overflow', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test('primary CTAs meet 44px touch targets at 375px', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await expect(page.getByRole('link', { name: /start with anchoros/i }).first()).toBeVisible();
        const boxes = await page.getByRole('link', { name: /start with anchoros|enter app/i }).evaluateAll((els) =>
            els.map((el) => ({ height: el.getBoundingClientRect().height })),
        );
        expect(boxes.length).toBeGreaterThan(0);
        for (const box of boxes) expect(box.height).toBeGreaterThanOrEqual(44);
    });
});

test.describe('Public auth surface', () => {
    test('login form is keyboard reachable with visible focus', async ({ page }) => {
        await page.goto('/login');
        const email = page.locator('input[name="email"], input[type="email"]').first();
        await expect(email).toBeVisible({ timeout: 15000 });

        // Tab from the top of the document until focus lands on the email input
        for (let i = 0; i < 12; i++) {
            await page.keyboard.press('Tab');
            if (await email.evaluate((el) => document.activeElement === el)) break;
        }
        await expect(email).toBeFocused();
    });

    test('invalid login shows an error state, not a silent failure', async ({ page }) => {
        await page.goto('/login');
        const email = page.locator('input[name="email"], input[type="email"]').first();
        const password = page.locator('input[name="password"], input[type="password"]').first();
        await expect(email).toBeVisible({ timeout: 15000 });
        await email.fill('e2e-nonexistent-user@anchor-os.invalid');
        await password.fill('wrong-password-123');
        await page.locator('button[type="submit"]').first().click();

        // Expect some visible feedback (error text or toast) within 20s
        const errorFeedback = page
            .locator('[role="alert"], .text-red-500, .text-red-600')
            .or(page.locator('text=/incorrect|invalid|no account|failed/i'))
            .first();
        await expect(errorFeedback).toBeVisible({ timeout: 20000 });
    });

    test('unauthenticated /dashboard access redirects to login', async ({ page }) => {
        await page.goto('/dashboard');
        const email = page.locator('input[name="email"], input[type="email"]').first();
        await expect(email).toBeVisible({ timeout: 20000 });
    });
});
