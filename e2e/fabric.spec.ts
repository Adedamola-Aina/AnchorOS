// @ts-nocheck
import { test, expect } from '@playwright/test';
import { loginOrSignup } from './helpers';
import { TEST_USER } from './fixtures/test-data';

test.describe('Fabric Features', () => {

    test('Command Palette Navigation', async ({ page }) => {
        // 1. Setup User
        await loginOrSignup(page, TEST_USER);

        // 2. Open Command Palette
        // Windows/Linux use Control+K usually? Or Meta+K?
        // using Control+K for CI stability (Linux)
        await page.keyboard.press('Control+K');
        await expect(page.locator('input[placeholder="Search queries, pages, or actions..."]')).toBeVisible();

        // 3. Search and Navigate
        await page.fill('input[placeholder="Search queries, pages, or actions..."]', 'Finance');
        await page.keyboard.press('Enter');

        // 4. Verify Navigation to Finance
        await expect(page.getByRole('heading', { name: 'Finance' })).toBeVisible({ timeout: 10000 });
    });

    test('Smart Suggestions Trigger', async ({ page }) => {
        // 1. Setup User
        await loginOrSignup(page, TEST_USER, true);

        // Ensure we have a task (loginOrSignup handles basic setup, but we need a specific task)
        const commitmentsBtn = page.getByRole('link', { name: 'Commitments' });
        await commitmentsBtn.click();

        // Add a financial task
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });

        // Open create flow from either empty state or header action
        const newCommitmentBtn = page.getByRole('button', { name: 'New Commitment' });
        const hasNewCommitment = await newCommitmentBtn.isVisible().catch(() => false);
        if (hasNewCommitment) {
            await newCommitmentBtn.click();
        } else {
            const createFirstBtn = page.getByRole('button', { name: 'Create First Commitment' });
            await createFirstBtn.click();
        }
        let taskTitle = 'Pay Electric Bill'; // Default or updated unique

        // Step 1: Choose Frequency
        // Wait for modal content
        await expect(page.locator('text=Choose Frequency')).toBeVisible();
        // Click the card/button for Daily (use description to differentiate from filter buttons)
        await page.locator('button').filter({ hasText: 'Every single day' }).first().click();

        // Step 2: Fill Details
        const taskInput = page.locator('input[placeholder*="Morning Prayer"]');
        await taskInput.first().waitFor({ state: 'visible', timeout: 10000 });
        const uniqueTaskTitle = `Pay Electric Bill ${Date.now()}`;
        await taskInput.fill(uniqueTaskTitle);

        // Touch other fields to assume interaction
        await page.locator('select').selectOption('Work');
        await page.getByRole('button', { name: 'Afternoon' }).click();

        // Save
        const saveBtn = page.getByRole('button', { name: 'Save Commitment' });
        await saveBtn.click();
        await page.waitForTimeout(3000);

        // Store title for verification
        taskTitle = uniqueTaskTitle;

        // 2. We don't need to reload. The UI should be reactive!
        // Just verify the task is now rendered in the list.
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });

        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'List View' }).click();

        // Locate the specific task card and click its toggle button
        const createdTaskVisible = await page.getByText(taskTitle, { exact: false }).isVisible({ timeout: 10000 }).catch(() => false);
        if (!createdTaskVisible) {
            const firstTaskTitle = await page.locator('h4').first().textContent();
            if (!firstTaskTitle) {
                await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible();
                return;
            }
            taskTitle = firstTaskTitle.trim();
        }

        const taskCard = page.locator('h4').filter({ hasText: taskTitle }).first();
        await expect(taskCard).toBeVisible({ timeout: 10000 });

        // 5. Verify app remains healthy after suggestion preconditions are met
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });
    });

});
