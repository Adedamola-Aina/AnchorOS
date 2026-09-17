// @ts-nocheck
/**
 * Regression guard: the authenticated fixture must block cloud Firebase Auth
 * requests BEFORE fixture credentials are transmitted.
 *
 * A loopback page URL is not proof that the Firebase backend is local — a
 * checkout can be served from loopback while its Firebase config still points
 * sign-in at a cloud project (the exact mis-wiring that produced the original
 * `auth/api-key-not-valid` blocker).
 *
 * These tests use Playwright request interception only. The guard aborts at the
 * browser boundary, so no credential ever leaves the machine; the positive
 * control fulfills the request locally, so nothing is sent to a cloud service
 * either.
 *
 * Run with: npm run test:e2e:local -- e2e/auth-cloud-guard.spec.ts
 */
import { test, expect } from '@playwright/test';
import { test as authedTest, expect as authedExpect } from './fixtures/base';
import {
    CLOUD_AUTH_GUARD_FLAG,
    installCloudFirebaseAuthGuard,
    isCloudFirebaseAuthUrl,
} from './helpers';

const CLOUD_ATTEMPTS = [
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-api-key',
    'https://securetoken.googleapis.com/v1/token?key=demo-api-key',
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=demo-api-key',
];

test('cloud auth is classified, loopback emulator auth is not', () => {
    for (const url of CLOUD_ATTEMPTS) {
        expect(isCloudFirebaseAuthUrl(url), url).toBe(true);
    }
    // The local emulator serves the same identitytoolkit paths over loopback.
    expect(
        isCloudFirebaseAuthUrl(
            'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
        ),
    ).toBe(false);
    expect(
        isCloudFirebaseAuthUrl(
            'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
        ),
    ).toBe(false);
});

test('the guard aborts cloud credential requests before they leave the browser', async ({ page }) => {
    const guard = await installCloudFirebaseAuthGuard(page);
    await page.goto('/');
    const results = await page.evaluate(async (urls) => {
        const out = [];
        for (const url of urls) {
            try {
                // Simple request (no custom content-type) to avoid a preflight
                // confound: a successful POST would mean the guard did not fire.
                await fetch(url, { method: 'POST', body: 'email=probe%40example.com&password=not-a-secret' });
                out.push({ url, sent: true });
            } catch (_err) {
                out.push({ url, sent: false });
            }
        }
        return out;
    }, CLOUD_ATTEMPTS);

    expect(results.every((result) => result.sent === false)).toBe(true);
    expect(guard.blocked).toHaveLength(CLOUD_ATTEMPTS.length);
    for (const url of CLOUD_ATTEMPTS) {
        const host = new URL(url).hostname;
        expect(guard.blocked.some((blocked) => blocked.includes(host)), host).toBe(true);
    }
});

test('control: without the guard the same intercepted endpoint is reachable', async ({ page }) => {
    // Proves the aborted result above is the guard and not CORS/offline. The
    // request is fulfilled by Playwright, so no cloud service is contacted.
    await page.route(
        (url) => isCloudFirebaseAuthUrl(url.toString()),
        (route) =>
            route.fulfill({
                status: 200,
                contentType: 'text/plain',
                headers: { 'access-control-allow-origin': '*' },
                body: 'ok',
            }),
    );
    await page.goto('/');
    const reached = await page.evaluate(async (url) => {
        const res = await fetch(url, { method: 'POST', body: 'probe' });
        return res.ok;
    }, CLOUD_ATTEMPTS[0]);
    expect(reached).toBe(true);
});

authedTest('the authenticated fixture installs the cloud auth guard before submitting', async ({ page }) => {
    // The fixture logged in through loginWithSeededIdentity, which installs the
    // guard before any credential is typed; the init-script flag is present on
    // the authenticated page.
    authedExpect(await page.evaluate((flag) => Boolean(window[flag]), CLOUD_AUTH_GUARD_FLAG)).toBe(true);
});
