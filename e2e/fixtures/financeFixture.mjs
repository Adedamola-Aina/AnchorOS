/**
 * Deterministic, run-scoped finance fixture for the authenticated local E2E
 * harness (scripts/ci/seed-e2e-finance.mjs seeds it; e2e/finance.spec.ts
 * asserts against it).
 *
 * ONE source of truth so the seed and the test can never disagree about which
 * account exists. Every value is derived from E2E_RUN_ID, which makes each
 * invocation's data unique: two runs against the same (shared) emulator suite
 * — including another agent's run — never touch each other's account.
 *
 * The fixture deliberately does NOT wipe or reset emulator data.
 */

/** Firestore doc ids cannot contain '/' and should stay boring. */
export function sanitizeRunId(raw) {
    const value = String(raw ?? '').trim();
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(value)) {
        throw new Error(
            `E2E_RUN_ID must match /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/ (got ${JSON.stringify(raw)}).`,
        );
    }
    return value;
}

/**
 * @param {string} runId Value of E2E_RUN_ID.
 * @returns {{runId: string, accountId: string, accountName: string,
 *   transactionIds: string[]}}
 */
export function resolveFinanceFixture(runId) {
    const id = sanitizeRunId(runId);
    return {
        runId: id,
        accountId: `rename-target-${id}`,
        accountName: `E2E Rename ${id}`,
        transactionIds: [`rename-tx-1-${id}`, `rename-tx-2-${id}`],
    };
}

/** Firestore collection paths for the fixture (relative to the user doc). */
export const FINANCE_PATHS = Object.freeze({ accounts: 'accounts', transactions: 'finance' });
