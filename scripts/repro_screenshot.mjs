
import { chromium, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
    const browser = await chromium.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const capture = async (deviceName, urlParam, filename) => {
        console.log(`Capturing ${deviceName}...`);
        // Use device descriptor if available, or manual viewport
        const device = devices[deviceName] || {
            viewport: { width: 375, height: 667 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        };

        const context = await browser.newContext({
            ...device,
            deviceScaleFactor: 2,
        });

        const page = await context.newPage();
        await page.goto(`http://localhost:8000/repro.html?device=${urlParam}`);

        // Wait for any animations
        await page.waitForTimeout(1000);

        const screenshotPath = path.resolve(process.cwd(), filename);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved to ${screenshotPath}`);

        await context.close();
    };

    try {
        // iPhone SE
        await capture('iPhone SE', 'iphone-se', 'iphone-se-repro.png');

        // iPhone 15 Pro
        await capture('iPhone 15 Pro', 'iphone-15-pro', 'iphone-15-pro-repro.png');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
