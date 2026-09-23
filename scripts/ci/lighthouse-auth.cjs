'use strict';

/**
 * Sign the audit in, so the budgets describe the screen and not the splash.
 *
 * LHCI runs this before each URL audit. The app's authenticated routes are the ones
 * being budgeted (/settings, /dashboard, /finance, /commitments, /fabric), and without
 * a session each of them renders the boot splash and bounces to the landing surface —
 * which is what the gate was actually measuring (LCP/TTI ≈9.0s on every route, three
 * samples, identical).
 *
 * Two identities, chosen by target, mirroring the repository's release model exactly:
 *
 *   1. **Loopback target** -> the disposable `demo-anchor-os` fixture (local development).
 *   2. **Any other target** -> a dedicated per-environment canary supplied as secrets, and
 *      nothing else. Missing canary credentials fail closed: the fixture identity is never
 *      used against a cloud project.
 *
 * It is idempotent (a session already present is left alone), so it is safe to run before
 * every URL and cheap after the first.
 */

const LOOPBACK = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?(\/|$)/i;

/** The disposable local fixture identity (e2e/fixtures/test-data.ts), overridable for a local run. */
function fixtureCredentials() {
    return {
        email: process.env.LIGHTHOUSE_FIXTURE_EMAIL || 'test@anchor-os.com',
        password: process.env.LIGHTHOUSE_FIXTURE_PASSWORD || 'TestPass123!',
    };
}

/**
 * The deployed canary, supplied only as secrets (PRODUCTION_SMOKE_* in production.yml).
 * Read at call time, not at import time: the process environment is the caller's to set,
 * and freezing it here would silently ignore a later change.
 */
function canaryCredentials() {
    return {
        email: process.env.LIGHTHOUSE_CANARY_EMAIL || '',
        password: process.env.LIGHTHOUSE_CANARY_PASSWORD || '',
    };
}

/** Which identity may sign in to this target — or a hard refusal. */
function credentialsFor(origin) {
    if (LOOPBACK.test(origin)) return fixtureCredentials();
    const canary = canaryCredentials();
    if (canary.email && canary.password) return canary;
    throw new Error(
        `lighthouse-auth: REFUSED — the audit target ${origin} is not a loopback origin and no canary ` +
            'credentials were supplied. A deployed performance audit signs in with a dedicated ' +
            'per-environment canary (LIGHTHOUSE_CANARY_EMAIL / LIGHTHOUSE_CANARY_PASSWORD); the local ' +
            'fixture identity is never valid against a cloud project.',
    );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** LHCI's Puppeteer has no `page.waitForTimeout`, so settle with a plain sleep. */
async function isSignedIn(page, origin) {
    await page.goto(`${origin}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await sleep(1500);
    return !page.url().includes('/login');
}

module.exports = async (browser, url) => {
    // LHCI hands over its internal Url object (`{ url: 'http://…' }`), not a string —
    // accept either shape rather than depend on an untyped internal.
    const target = typeof url === 'string' ? url : (url && (url.url || url.href)) || '';
    let origin;
    try {
        origin = new URL(target).origin;
    } catch {
        throw new Error(`lighthouse-auth: could not read an origin from the audit target (${String(target)}).`);
    }
    const credentials = credentialsFor(origin);

    const page = await browser.newPage();
    try {
        if (await isSignedIn(page, origin)) return;

        await page.goto(`${origin}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForSelector('input[type="email"]', { timeout: 20000 });
        await page.type('input[type="email"]', credentials.email);
        await page.type('input[type="password"]', credentials.password);
        await page.click('button[type="submit"]');

        // The app leaves /login when the session lands.
        await page
            .waitForFunction(() => !location.pathname.includes('/login'), { timeout: 30000 })
            .catch(() => {});
        await sleep(1500);
    } finally {
        await page.close();
    }
};
// Exported for scripts/ci/lighthouse-auth.node-suite.mjs: the identity policy is the part
// that must never regress — a cloud target must never receive the local fixture.
module.exports.credentialsFor = credentialsFor;
