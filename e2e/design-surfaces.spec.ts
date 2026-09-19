// @ts-nocheck
/**
 * W-D1b design-surface evidence harness (`UX-DS-02` / `UX-DS-06` adoption).
 *
 * Why this is its own spec: `visual.spec.ts` imports `test` from
 * `@playwright/test` instead of the authenticated fixture in `fixtures/base.ts`,
 * so every "authenticated" baseline it tracks captured the UNAUTHENTICATED
 * screen — five of its eight PNGs are byte-identical (see the W-D1 register
 * note). It also runs only in the `mobile` project, which needs WebKit, a
 * browser CI never installs (`npx playwright install chromium`). Net effect: no
 * existing test can detect a regression on Home, Commitments, Finance or
 * Settings — which is exactly what the W-D1b migration must not do blind.
 *
 * Asserts (structural, so it holds without committed baselines):
 *   - each surface renders after a REAL emulator login;
 *   - the requested theme is actually applied (`html.dark`);
 *   - the four surfaces render distinctly, and light differs from dark —
 *     the precise failure mode described above.
 *
 * Writes review evidence (doc 24 §9.4 Squint Test included):
 *   design-evidence/<viewport>/<surface>-<theme>.png
 *   design-evidence/<viewport>/<surface>-<theme>-squint10.png
 * That directory is gitignored and deliberately NOT under test-results/, which
 * Playwright deletes at the start of every run.
 *
 * Run through the canonical local entry point (starts emulators, seeds, then
 * Playwright), pinned to chromium because that is the engine CI installs:
 *   npm run test:e2e:local -- e2e/design-surfaces.spec.ts --project=chromium
 */
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from './fixtures/base';

const SURFACES = [
    { id: 'home', route: '/dashboard' },
    { id: 'commitments', route: '/commitments' },
    { id: 'finance', route: '/finance' },
    { id: 'settings', route: '/settings' },
];

const THEMES = ['light', 'dark'];

const VIEWPORTS = [
    { id: 'mobile', width: 375, height: 812 },
    { id: 'desktop', width: 1280, height: 720 },
];

const EVIDENCE_DIR = path.resolve('design-evidence');

/** This harness is opt-in: it is evidence tooling for a surface migration, not
 *  a per-push gate, because walking eight surface/theme combinations through
 *  the real theme control takes minutes. */
const EVIDENCE_OPT_IN_HINT = 'opt-in evidence capture — run with DESIGN_EVIDENCE=1';

/** Freeze motion so two runs of the same screen are comparable. */
const STILL_CSS = `*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}`;

/** Hide content that legitimately changes between runs. `visibility` is used
 *  instead of `display` so layout stays identical.
 *  Known gap, verified by reading a capture: the Home date renders without a
 *  stable hook, so it is NOT masked and will differ between runs — give it a
 *  `data-testid` when Home is migrated. */
const DYNAMIC_CSS = `[data-testid="dashboard-greeting"],
[data-testid="current-date"],
.timestamp, time { visibility: hidden !important; }`;

/**
 * The theme lever is the REAL control, not a bypass.
 *
 * `App.tsx` applies `dark` from the Firestore profile's `theme` field and only
 * falls back to the OS preference when that field is unset or `system` — and
 * both CI seeds pin `theme: 'light'`, so `colorScheme` alone can never produce
 * dark mode here. Clicking the control in Settings exercises the actual
 * persistence path (profile write + localStorage), which also means this
 * harness fails if theming itself breaks.
 */
const THEME_LABEL = { light: 'Light', dark: 'Dark' };

async function setTheme(page, theme) {
    await page.goto('/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const wantDark = theme === 'dark';
    const current = ((await page.locator('html').getAttribute('class')) || '').includes('dark');
    if (current !== wantDark) {
        await page.getByRole('button', { name: `${THEME_LABEL[theme]} theme` }).first().click();
    }
    await page.waitForFunction(
        (dark) => document.documentElement.classList.contains('dark') === dark,
        wantDark,
        { timeout: 10000 },
    );
}

/** Set the viewport, apply the requested theme through the UI, then land on the
 *  surface under review and freeze motion so two runs are comparable. */
async function prepare(page, { route, theme, viewport }) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await setTheme(page, theme);
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.addStyleTag({ content: `${STILL_CSS}\n${DYNAMIC_CSS}` });
    // Charts and skeleton→content swaps settle after network idle.
    await page.waitForTimeout(400);
}

async function capture(page, file, { squint = false } = {}) {
    if (squint) {
        await page.addStyleTag({ content: 'html { filter: blur(10px) !important; }' });
        await page.waitForTimeout(150);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const buffer = await page.screenshot({ fullPage: true });
    fs.writeFileSync(file, buffer);
    return buffer;
}

for (const viewport of VIEWPORTS) {
    test.describe(`surface evidence — ${viewport.id}`, () => {
        test.skip(!process.env.DESIGN_EVIDENCE, EVIDENCE_OPT_IN_HINT);
        for (const theme of THEMES) {
            for (const surface of SURFACES) {
                test(`${surface.id} renders in ${theme}`, async ({ page }) => {
                    await prepare(page, { route: surface.route, theme, viewport });

                    const htmlClass = (await page.locator('html').getAttribute('class')) || '';
                    expect(htmlClass.includes('dark'), `html.dark applied for ${theme}`).toBe(
                        theme === 'dark',
                    );
                    await expect(page.locator('body')).toBeVisible();

                    const base = path.join(EVIDENCE_DIR, viewport.id, `${surface.id}-${theme}`);
                    await capture(page, `${base}.png`);
                    await capture(page, `${base}-squint10.png`, { squint: true });
                });
            }
        }
    });
}

test.describe('the four surfaces are genuinely distinct', () => {
    // This is the guard against the visual.spec.ts failure mode: if the harness
    // silently stops authenticating, every capture collapses to one screen and
    // this fails loudly instead of quietly blessing a login page as "Home".
    // It walks 8 surface/theme combinations, so it needs more than the default
    // 60s budget — the first version died mid-loop and never reached its
    // assertions, which is a silent pass and therefore worse than a failure.
    test.setTimeout(300000);

    test.skip(!process.env.DESIGN_EVIDENCE, EVIDENCE_OPT_IN_HINT);

    test('no two surface/theme captures are byte-identical', async ({ page }) => {
        const shots = new Map();
        for (const theme of THEMES) {
            for (const surface of SURFACES) {
                await prepare(page, { route: surface.route, theme, viewport: VIEWPORTS[0] });
                shots.set(`${surface.id}-${theme}`, await page.screenshot());
            }
        }

        expect(shots.size).toBe(SURFACES.length * THEMES.length);
        const keys = [...shots.keys()];
        for (let i = 0; i < keys.length; i += 1) {
            for (let j = i + 1; j < keys.length; j += 1) {
                expect(
                    shots.get(keys[i]).equals(shots.get(keys[j])),
                    `${keys[i]} must not render identically to ${keys[j]}`,
                ).toBe(false);
            }
        }
    });
});