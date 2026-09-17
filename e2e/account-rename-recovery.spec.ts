// @ts-nocheck
/**
 * Browser regression for account-rename recovery (FEAT-142, #144).
 *
 * A rename that fails after some transaction-label batches commit leaves the
 * account name unchanged while those transactions already carry the new name.
 * This spec recreates that durable partial state in the LOCAL emulator (via the
 * emulator REST API in beforeAll), then drives the recovery through the real
 * rename UI: submitting the CURRENT account name must restore the labels
 * without renaming the account or writing a "X -> X" history entry.
 *
 * Convergence is proven through the UI: after a reload the same unchanged
 * submission reports "No changes to save", which is only possible if the labels
 * are durably consistent. Persisted document state is asserted directly by the
 * deterministic Vitest regression in #144.
 *
 * Run with: npm run test:e2e:local -- e2e/account-rename-recovery.spec.ts
 */
import { test, expect } from './fixtures/base';
import { TEST_USER } from './fixtures/test-data';
import { resolveFinanceFixture } from './fixtures/financeFixture.mjs';
import { APP_ID, patchFirestoreDoc, postJson } from '../scripts/ci/emulator-harness.mjs';

const AUTH_ORIGIN = 'http://127.0.0.1:9099';
const FIRESTORE_HOST = '127.0.0.1:8080';
const DIVERGENT_SUFFIX = ' (stale label)';

function escapeRegExp(value: string): string {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function signInFixtureIdentity() {
    const { status, json } = await postJson(
        `${AUTH_ORIGIN}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-api-key`,
        { email: TEST_USER.email, password: TEST_USER.password, returnSecureToken: true },
    );
    if (status !== 200 || !json.localId || !json.idToken) {
        throw new Error(`could not sign in the seeded fixture identity (HTTP ${status})`);
    }
    return json;
}

test.beforeAll(async () => {
    expect(process.env.E2E_RUN_ID, 'run this spec with `npm run test:e2e:local`').toBeTruthy();
    const fixture = resolveFinanceFixture(process.env.E2E_RUN_ID);
    const auth = await signInFixtureIdentity();
    // Reproduce the partial failure: labels are ahead of the account document.
    for (const txId of fixture.transactionIds) {
        const res = await patchFirestoreDoc(
            FIRESTORE_HOST,
            `artifacts/${APP_ID}/users/${auth.localId}/finance/${txId}`,
            { accountName: { stringValue: `${fixture.accountName}${DIVERGENT_SUFFIX}` } },
            auth.idToken,
            { updateMask: ['accountName'] },
        );
        if (res.status >= 300) throw new Error(`failed to seed divergent label (HTTP ${res.status})`);
    }
});

test('restores divergent transaction labels through the rename UI and survives reload', async ({ page }) => {
    const fixture = resolveFinanceFixture(process.env.E2E_RUN_ID);
    const accountRowName = new RegExp(escapeRegExp(fixture.accountName));

    const openAccount = async () => {
        await page.goto('/finance/accounts', { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', { name: 'All Accounts' })).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: accountRowName }).first().click();
        await expect(page.getByRole('heading', { name: fixture.accountName })).toBeVisible({ timeout: 10000 });
    };

    await openAccount();

    // Submit the CURRENT (pre-filled) name: unchanged-name recovery.
    await page.getByRole('button', { name: 'Account options' }).click();
    await page.getByRole('button', { name: 'Edit Account' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Rename Account' }).first();
    await expect(dialog.getByLabel('Account name')).toHaveValue(fixture.accountName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText(`Transaction labels restored to "${fixture.accountName}"`)).toBeVisible({
        timeout: 10000,
    });
    // Never reported as a rename, and the account name did not change.
    await expect(page.getByText(`Account renamed to "${fixture.accountName}"`)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: fixture.accountName })).toBeVisible({ timeout: 10000 });

    // Reload and repeat: the second unchanged submission must report no changes,
    // which is only true if the labels converged durably across the reload.
    await openAccount();
    await page.getByRole('button', { name: 'Account options' }).click();
    await page.getByRole('button', { name: 'Edit Account' }).click();
    const dialogAfterReload = page.getByRole('dialog').filter({ hasText: 'Rename Account' }).first();
    await dialogAfterReload.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('No changes to save')).toBeVisible({ timeout: 10000 });
});
