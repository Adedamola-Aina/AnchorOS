// @ts-nocheck
/**
 * Authentication failure behaviour for the seeded local E2E path.
 *
 * Regression guard for the blocker this suite was created for: when a login
 * cannot succeed, the failure must name its cause immediately (target origin,
 * whether the emulator was reached, what the app displayed) instead of
 * surfacing as a 60s `beforeEach` timeout with the browser parked on the login
 * page.
 *
 * This spec intentionally uses a wrong password against the disposable
 * emulator account. `loginOrSignup` is NOT used here: nothing signs up, skips
 * onboarding, or retries.
 *
 * Run with: npm run test:e2e:local -- e2e/auth-login-failure.spec.ts
 */
import { test, expect } from '@playwright/test';
import { EMULATOR_AUTH_ORIGIN, observeAuthTraffic, loginWithSeededIdentity } from './helpers';
import { TEST_USER } from './fixtures/test-data';

test('a failed login reports its cause promptly instead of timing out', async ({ page }) => {
    const startedAt = Date.now();
    let message = '';
    await loginWithSeededIdentity(page, {
        email: TEST_USER.email,
        password: `${TEST_USER.password}-wrong`,
    }).catch((err) => {
        message = String(err.message);
    });
    const elapsedMs = Date.now() - startedAt;

    expect(message).toContain('E2E login failed for the seeded identity');
    expect(message).toContain(`emulator login:  reached ${EMULATOR_AUTH_ORIGIN}`);
    expect(message).toMatch(/Incorrect email or password|INVALID_LOGIN_CREDENTIALS|wrong-password|invalid-credential/i);
    // Bounded: a broken environment must fail in seconds, not at the 60s timeout.
    expect(elapsedMs).toBeLessThan(30000);
});

test('a successful login reaches the emulator auth endpoint', async ({ page }) => {
    const traffic = observeAuthTraffic(page);
    await loginWithSeededIdentity(page, TEST_USER);
    expect(traffic.requests.some((entry) => entry.includes(EMULATOR_AUTH_ORIGIN))).toBe(true);
});
