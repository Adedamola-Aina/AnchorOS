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
        await expect(page.locator('text=Net Worth')).toBeVisible();
    });

    test('Smart Suggestions Trigger', async ({ page }) => {
        // 1. Setup Unique User
        const timestamp = Date.now();
        const email = `fabric-test-${timestamp}@anchor-os.dev`;
        const password = 'TestPassword123!';
        await loginOrSignup(page, { email, password, name: 'Fabric User' });

        // Ensure we have a task (loginOrSignup handles basic setup, but we need a specific task)
        const commitmentsBtn = page.getByRole('link', { name: 'Commitments' });
        await commitmentsBtn.click();

        // Add a financial task if not present
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });

        // Click New Commitment to open modal
        const newCommitmentBtn = page.getByRole('button', { name: 'New Commitment' });
        let taskTitle = 'Pay Electric Bill'; // Default or updated unique

        // Click New Commitment to open modal
        await newCommitmentBtn.click();

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
        await taskInput.press('Enter');
        await expect(saveBtn).not.toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(3000);

        // Store title for verification
        taskTitle = uniqueTaskTitle;

        // 2. We don't need to reload. The UI should be reactive!
        // Just verify the task is now rendered in the list.
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });

        // 3. Setup Dialog Listener
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Recorded completion');
            await dialog.accept();
        });

        // Debugging: Check what is visible
        await expect(page.getByRole('heading', { name: 'Commitments', exact: true })).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(2000); // Wait for list to render

        const allText = await page.locator('body').innerText();
        console.log('Page Content:', allText);

        const cards = await page.locator('.glass-card').allTextContents();
        console.log('Visible Cards:', cards);

        // Check if "Morning Run" (from onboarding) is there
        if (allText.includes('Morning Run')) {
            console.log('Morning Run is visible');
        } else {
            console.log('Morning Run is NOT visible');
        }

        // Locate the specific task card and click its toggle button (circle icon)
        // Verify title with relaxed matching as requested
        await expect(page.getByText(taskTitle, { exact: false })).toBeVisible({ timeout: 10000 });

        // Define the card by filtering for the text
        const taskCard = page.locator('.glass-card').filter({ hasText: taskTitle });

        // Wait for the specific card to be visible
        await expect(taskCard).toBeVisible({ timeout: 10000 });

        // Find the checkbox button inside that specific card and click
        await taskCard.locator('button').first().click();

        // 5. Verify Navigation to Finance (triggered by dialog accept)
        await expect(page.locator('text=Net Worth')).toBeVisible({ timeout: 10000 });
    });

});
