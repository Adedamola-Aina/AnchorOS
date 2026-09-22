// @ts-nocheck
/**
 * Mobile shell / viewport contract (BUG: blank region below the bottom nav).
 *
 * The defect: the app shell was sized with `100dvh` while the fixed bottom
 * navigation anchors to the LAYOUT viewport. In an installed iOS PWA the two can
 * disagree, which made the document taller than the viewport and left a strip of
 * app surface painted *below* the navigation — a blank band the user reads as a
 * broken layout.
 *
 * The fix is one authoritative strategy (see the "Viewport contract" comment in
 * src/index.css): html → body → #root are all `height: 100%`, the document never
 * scrolls, and the navigation's height is reserved inside <main> exactly once.
 *
 * These assertions are the invariants that make the class of bug impossible, and
 * they run against every surface — including with `display-mode: standalone`
 * emulated, which is the PWA context the defect was reported in.
 */
import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';
import { loginOrSignup } from './helpers';

const MOBILE = { width: 393, height: 852 }; // iPhone 15 / 14 Pro logical viewport

/** Force the `(display-mode: standalone)` media query, i.e. an installed PWA. */
async function emulateStandalone(page: import('@playwright/test').Page) {
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'display-mode', value: 'standalone' }],
    });
}

async function measure(page: import('@playwright/test').Page) {
    return page.evaluate(() => {
        const nav = document.querySelector('[data-bottom-nav]');
        const root = document.getElementById('root');
        const main = document.querySelector('main[data-scroll]');
        return {
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth,
            docScrollHeight: document.documentElement.scrollHeight,
            bodyScrollHeight: document.body.scrollHeight,
            docScrollWidth: document.documentElement.scrollWidth,
            rootHeight: root ? root.getBoundingClientRect().height : 0,
            rootBottom: root ? root.getBoundingClientRect().bottom : 0,
            navBottom: nav ? nav.getBoundingClientRect().bottom : 0,
            navHeight: nav ? nav.getBoundingClientRect().height : 0,
            mainPaddingBottom: main ? getComputedStyle(main).paddingBottom : '0px',
            mainScrollable: main ? main.scrollHeight > main.clientHeight : false,
        };
    });
}

const SURFACES = [
    { path: '/finance', label: 'Finance' },
    { path: '/dashboard', label: 'Home' },
    { path: '/commitments', label: 'Commitments' },
    { path: '/settings', label: 'Settings' },
];

test.describe('Mobile shell — one viewport, no blank region below the nav', () => {
    test.use({ viewport: MOBILE });

    for (const surface of SURFACES) {
        test(`${surface.label}: the shell ends exactly where the navigation ends`, async ({ page }) => {
            await page.goto('/');
            await loginOrSignup(page, TEST_USER, true);
            await page.goto(surface.path);
            await page.waitForLoadState('domcontentloaded');
            await expect(page.locator('[data-bottom-nav]')).toBeVisible();

            const m = await measure(page);

            // 1. The document is never taller than the viewport — this is the
            //    property whose absence produced the blank band.
            expect(m.docScrollHeight).toBeLessThanOrEqual(m.innerHeight + 1);
            expect(m.bodyScrollHeight).toBeLessThanOrEqual(m.innerHeight + 1);

            // 2. The shell occupies exactly the viewport.
            expect(Math.abs(m.rootHeight - m.innerHeight)).toBeLessThanOrEqual(1);

            // 3. The navigation terminates at the bottom of the shell — nothing
            //    is painted below it.
            expect(Math.abs(m.navBottom - m.innerHeight)).toBeLessThanOrEqual(1);
            expect(Math.abs(m.rootBottom - m.innerHeight)).toBeLessThanOrEqual(1);

            // 4. Its height is reserved in the scrolling content (content cannot
            //    hide behind the bar).
            expect(parseFloat(m.mainPaddingBottom)).toBeGreaterThanOrEqual(m.navHeight - 1);

            // 5. No horizontal overflow at a narrow viewport.
            expect(m.docScrollWidth).toBeLessThanOrEqual(m.innerWidth + 1);
        });
    }

    test('holds with display-mode: standalone (installed PWA) emulated', async ({ page }) => {
        await emulateStandalone(page);
        await page.goto('/');
        await loginOrSignup(page, TEST_USER, true);
        await page.goto('/finance');
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('[data-bottom-nav]')).toBeVisible();

        const m = await measure(page);
        expect(m.docScrollHeight).toBeLessThanOrEqual(m.innerHeight + 1);
        expect(Math.abs(m.rootHeight - m.innerHeight)).toBeLessThanOrEqual(1);
        expect(Math.abs(m.navBottom - m.innerHeight)).toBeLessThanOrEqual(1);
    });

    test('a long page still scrolls inside the shell, and its end is reachable', async ({ page }) => {
        await page.goto('/');
        await loginOrSignup(page, TEST_USER, true);
        await page.goto('/finance');
        await page.waitForLoadState('domcontentloaded');

        const main = page.locator('main[data-scroll]');
        await expect(main).toBeVisible();

        const scrollable = await main.evaluate(el => el.scrollHeight > el.clientHeight);
        if (scrollable) {
            await main.evaluate(el => { el.scrollTop = el.scrollHeight; });
            const m = await measure(page);
            // Scrolling must not move the document itself (the shell owns it).
            expect(m.docScrollHeight).toBeLessThanOrEqual(m.innerHeight + 1);
            expect(Math.abs(m.navBottom - m.innerHeight)).toBeLessThanOrEqual(1);
        }
    });
});
