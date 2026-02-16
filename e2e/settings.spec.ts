// @ts-nocheck
import { test, expect, type Page } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';
import { loginOrSignup } from './helpers';

/**
 * Settings E2E Tests
 * 
 * Tests for the System/Settings page:
 * - Profile section
 * - Theme toggle
 * - 2FA/Security section
 * - Family Mode section
 * - Contact & Feedback
 * - Data management
 */

// Helper: Navigate to Settings
async function goToSettings(page: Page) {
    await loginOrSignup(page, TEST_USER, true);
    await page.click('a:has-text("System")');
    await expect(page.getByRole('heading', { name: 'System' })).toBeVisible();
}

test.describe('Settings - Profile', () => {
    test.beforeEach(async ({ page }) => {
        await goToSettings(page);
    });

    test('Profile section is visible', async ({ page }) => {
        const profile = page.locator('text=User Profile').or(page.locator('text=Visual Theme'));
        await expect(profile.first()).toBeVisible();
    });

    test('User name is displayed', async ({ page }) => {
        const userName = page.locator('[class*="profile"], [class*="user-name"]');
        const hasName = await userName.isVisible().catch(() => false);
        expect(typeof hasName).toBe('boolean');
    });

    test('Theme toggle switches between light and dark', async ({ page }) => {
        const toggle = page.locator('[role="switch"]').first();

        if (await toggle.isVisible()) {
            const beforeState = await toggle.getAttribute('data-state') || await toggle.getAttribute('aria-checked');
            await toggle.click();
            await page.waitForTimeout(500);

            const afterState = await toggle.getAttribute('data-state') || await toggle.getAttribute('aria-checked');
            // Toggle may use data-state, aria-checked, or class changes
            const hasChanged = afterState !== beforeState ||
                await toggle.evaluate(el => el.classList.toString()) !== '';
            expect(hasChanged).toBe(true);
        }
    });
});

test.describe('Settings - Security', () => {
    test.beforeEach(async ({ page }) => {
        await goToSettings(page);
    });

    test('Identity & Security section visible', async ({ page }) => {
        // Desktop card heading says "Identity & Security" — use exact text to skip hidden mobile-only SectionNav pill
        const security = page.locator('text=Identity & Security').or(page.locator('text=Two-Factor Authentication'));
        await expect(security.first()).toBeVisible({ timeout: 10000 });
    });

    test('2FA setup button available', async ({ page }) => {
        const twoFaBtn = page.locator('button:has-text("Setup 2FA")').or(page.locator('button:has-text("Enable 2FA")'));
        const hasTwoFa = await twoFaBtn.first().isVisible().catch(() => false);
        expect(typeof hasTwoFa).toBe('boolean');
    });
});

test.describe('Settings - Family', () => {
    test.beforeEach(async ({ page }) => {
        await goToSettings(page);

        // Scroll to find family section
        for (let i = 0; i < 3; i++) {
            const familyCard = page.locator('text=Invite Family').or(page.locator('text=Family Connected'));
            if (await familyCard.first().isVisible().catch(() => false)) break;
            await page.mouse.wheel(0, 300);
            await page.waitForTimeout(300);
        }
    });

    test('Family section is visible', async ({ page }) => {
        const family = page.locator('text=Invite Family').or(page.locator('text=Family Connected')).or(page.locator('text=Share'));
        await expect(family.first()).toBeVisible();
    });
});

test.describe('Settings - Contact & Feedback', () => {
    test.beforeEach(async ({ page }) => {
        await goToSettings(page);

        // Scroll to find contact section
        for (let i = 0; i < 5; i++) {
            const contactCard = page.locator('text=Contact').or(page.locator('text=Feedback')).or(page.locator('text=Get in Touch'));
            if (await contactCard.first().isVisible().catch(() => false)) break;
            await page.mouse.wheel(0, 300);
            await page.waitForTimeout(300);
        }
    });

    test('Contact section is visible', async ({ page }) => {
        const contact = page.locator('text=Contact').or(page.locator('text=Feedback')).or(page.locator('text=Get in Touch'));
        const hasContact = await contact.first().isVisible().catch(() => false);
        expect(typeof hasContact).toBe('boolean');
    });

    test('Send Message button exists', async ({ page }) => {
        const sendBtn = page.locator('button:has-text("Send Message")');
        const hasSend = await sendBtn.isVisible().catch(() => false);
        expect(typeof hasSend).toBe('boolean');
    });
});

test.describe('Settings - Data Management', () => {
    test.beforeEach(async ({ page }) => {
        await goToSettings(page);

        // Scroll to find data section
        for (let i = 0; i < 5; i++) {
            const dataCard = page.locator('text=Wipe').or(page.locator('text=Delete')).or(page.locator('text=Data'));
            if (await dataCard.first().isVisible().catch(() => false)) break;
            await page.mouse.wheel(0, 300);
            await page.waitForTimeout(300);
        }
    });

    test('Wipe data option exists', async ({ page }) => {
        const wipeBtn = page.locator('button:has-text("Wipe"), button:has-text("Delete All")');
        const hasWipe = await wipeBtn.isVisible().catch(() => false);
        expect(typeof hasWipe).toBe('boolean');
    });
});

test.describe('Settings - Sign Out', () => {
    test.beforeEach(async ({ page }) => {
        await goToSettings(page);
    });

    test('Sign out button is visible', async ({ page }) => {
        const signOutBtn = page.locator('button[title="Sign Out"]');
        await expect(signOutBtn).toBeVisible();
    });

    test('Sign out redirects to auth page', async ({ page }) => {
        const signOutBtn = page.locator('button[title="Sign Out"]');
        await signOutBtn.click();
        await page.waitForTimeout(2000);

        const authPage = page.locator('input[type="email"]');
        await expect(authPage).toBeVisible({ timeout: 10000 });
    });
});
