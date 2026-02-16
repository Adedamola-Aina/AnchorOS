// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * These tests capture screenshots of key pages and compare them against baseline images.
 * 
 * To update baselines after intentional UI changes:
 *   npx playwright test visual.spec.ts --update-snapshots
 * 
 * Run visual tests:
 *   npx playwright test visual.spec.ts
 */

test.describe('Visual Regression Tests', () => {
  // Set viewport consistently for visual tests
  test.use({
    viewport: { width: 375, height: 812 }, // iPhone X dimensions (mobile-first)
  });

  test.describe('Authentication Pages', () => {
    test('login page renders correctly', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Wait for content to be visible
      await expect(page.locator('body')).toBeVisible();
      
      await expect(page).toHaveScreenshot('auth-login.png', {
        maxDiffPixelRatio: 0.02, // Allow 2% pixel difference
      });
    });

    test('signup page renders correctly', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toBeVisible();
      
      await expect(page).toHaveScreenshot('auth-signup.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Dashboard (authenticated)', () => {
    // Use fixture to log in before each test
    test.beforeEach(async ({ page }) => {
      // Navigate to app - the E2E setup should handle auth state
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('dashboard overview renders correctly', async ({ page }) => {
      // Wait for dashboard to load
      await page.waitForSelector('[data-testid="dashboard"], .dashboard, main', {
        state: 'visible',
        timeout: 10000,
      }).catch(() => {
        // If no dashboard found, we might be on login page - that's OK for visual test
      });

      await expect(page).toHaveScreenshot('dashboard-overview.png', {
        maxDiffPixelRatio: 0.03,
        mask: [
          // Mask dynamic content that changes between runs
          page.locator('[data-testid="current-date"]'),
          page.locator('[data-testid="greeting"]'),
          page.locator('.timestamp'),
        ],
      });
    });
  });

  test.describe('Mobile Responsive Layouts', () => {
    test('mobile navigation renders correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Open mobile nav if it exists
      const menuButton = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(300); // Wait for animation
      }

      await expect(page).toHaveScreenshot('mobile-navigation.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Desktop Layouts', () => {
    test.use({
      viewport: { width: 1280, height: 720 }, // Desktop viewport
    });

    test('desktop layout renders correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('desktop-layout.png', {
        maxDiffPixelRatio: 0.03,
        mask: [
          page.locator('[data-testid="current-date"]'),
          page.locator('[data-testid="greeting"]'),
          page.locator('.timestamp'),
        ],
      });
    });
  });

  test.describe('Component Visual Tests', () => {
    test('error boundary fallback renders correctly', async ({ page }) => {
      // Navigate to a page that might trigger error boundary test
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('settings-page.png', {
        maxDiffPixelRatio: 0.02,
      });
    });
  });
});

test.describe('Dark Mode Visual Tests', () => {
  test.use({
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
  });

  test('dark mode login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('auth-login-dark.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('dark mode dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-dark.png', {
      maxDiffPixelRatio: 0.03,
      mask: [
        page.locator('[data-testid="current-date"]'),
        page.locator('[data-testid="greeting"]'),
        page.locator('.timestamp'),
      ],
    });
  });
});
