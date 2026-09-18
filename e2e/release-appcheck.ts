import type { Page } from '@playwright/test';

/**
 * Deployed release-smoke only: install an App Check debug token so a headless
 * browser can attest a deployed target.
 *
 * Staging/production enforce App Check (ARCH-118), and a headless Chromium
 * cannot satisfy real reCAPTCHA Enterprise attestation, so the token exchange
 * returns 403 "App attestation failed" and App Check-enforced callables reject
 * with 401. The Firebase JS SDK reads `window.FIREBASE_APPCHECK_DEBUG_TOKEN`
 * when `initializeAppCheck()` runs, so injecting it before the app loads lets
 * the smoke attest.
 *
 * This is TEST INFRASTRUCTURE, not a shipped credential: the token is supplied
 * only as a CI secret, is only injected when present, and never appears in the
 * deployed bundle. The app's own App Check debug handling remains emulator-only.
 */
export async function installAppCheckDebugToken(page: Page): Promise<void> {
    const token = (process.env.APP_CHECK_DEBUG_TOKEN || '').trim();
    if (!token) return;
    await page.addInitScript((value: string) => {
        (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean })
            .FIREBASE_APPCHECK_DEBUG_TOKEN = value;
    }, token);
}
