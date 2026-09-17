#!/usr/bin/env node
'use strict';

/**
 * Deterministic LOCAL seed for the authenticated local E2E harness.
 *
 * Seeds, into the LOCAL Firebase Emulator Suite (auth + firestore) under the
 * disposable demo project:
 *   1. the canonical fixture identity from e2e/fixtures/test-data.ts (the same
 *      identity the release smoke uses — scripts/ci/release-identity.mjs is the
 *      single source of truth) plus its minimal profile document;
 *   2. one run-scoped finance account with two transactions, so the account
 *      rename flow can be exercised through the real UI with no manual setup.
 *
 * Hard guards (this script must be impossible to run against a cloud project):
 *   - loopback emulator hosts only (defaults 127.0.0.1:9099 / 127.0.0.1:8080);
 *   - refuses any project ID other than demo-anchor-os;
 *   - E2E_RUN_ID is required, so seeded data is isolated per invocation;
 *   - idempotent: re-running verifies the identity and overwrites the same
 *     run-scoped documents with identical values;
 *   - never prints credentials or tokens.
 *
 * Usage (see `npm run test:e2e:local`, which sets the environment):
 *   E2E_RUN_ID=<id> FIREBASE_PROJECT_ID=demo-anchor-os node scripts/ci/seed-e2e-finance.mjs
 */

import {
    APP_ID,
    EMULATOR_PORTS,
    LOOPBACK_HOST,
    assertEmulatorReachable,
    patchFirestoreDoc,
    postJson,
    requireDemoProjectId,
    requireLoopbackHostEnv,
} from './emulator-harness.mjs';
import { readFixtureIdentity } from './release-identity.mjs';
import { resolveFinanceFixture } from '../../e2e/fixtures/financeFixture.mjs';

const sv = (value) => ({ stringValue: String(value) });
const iv = (value) => ({ integerValue: String(Math.trunc(value)) });
const bv = (value) => ({ booleanValue: Boolean(value) });

/** Create the auth identity, or verify the existing one. Idempotent. */
async function ensureAuthUser(authHost, user) {
    const base = `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts`;
    const created = await postJson(`${base}:signUp?key=demo-api-key`, {
        email: user.email,
        password: user.password,
        displayName: user.name,
        returnSecureToken: true,
    });
    if (created.status === 200 && created.json.localId) {
        return { created: true, localId: created.json.localId, idToken: created.json.idToken };
    }
    if (created.json?.error?.message === 'EMAIL_EXISTS') {
        // Already seeded: verify the SAME credentials still work.
        const signedIn = await postJson(`${base}:signInWithPassword?key=demo-api-key`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true,
        });
        if (signedIn.status !== 200 || !signedIn.json.localId) {
            throw new Error(
                `existing auth account could not sign in (HTTP ${signedIn.status}: ` +
                    `${signedIn.json?.error?.message || 'unknown error'}). Delete the emulator data to re-seed.`,
            );
        }
        return { created: false, localId: signedIn.json.localId, idToken: signedIn.json.idToken };
    }
    throw new Error(`auth signUp failed (HTTP ${created.status}: ${created.json?.error?.message || 'unknown'})`);
}

/** Write the minimal profile doc required by the authenticated shell. */
async function ensureProfileDoc(firestoreHost, localId, idToken, user) {
    const result = await patchFirestoreDoc(
        firestoreHost,
        `artifacts/${APP_ID}/users/${localId}`,
        {
            name: sv(user.name),
            theme: sv('light'),
            familyMode: bv(false),
            onboardingComplete: bv(true),
        },
        idToken,
    );
    if (result.status >= 300) throw new Error(`profile doc write failed: HTTP ${result.status}`);
}

/** Write the run-scoped account the rename flow opens. */
async function ensureAccount(firestoreHost, localId, idToken, fixture) {
    const result = await patchFirestoreDoc(
        firestoreHost,
        `artifacts/${APP_ID}/users/${localId}/accounts/${fixture.accountId}`,
        {
            name: sv(fixture.accountName),
            type: sv('checking'),
            currency: sv('USD'),
            balanceCents: iv(500000),
            color: sv('#3D52D5'),
            scope: sv('personal'),
            ownerId: sv(localId),
            isArchived: bv(false),
            source: sv('manual'),
            shares: { mapValue: { fields: {} } },
        },
        idToken,
    );
    if (result.status >= 300) throw new Error(`account doc write failed: HTTP ${result.status}`);
}

/** Write the two deterministic transactions for the fixture account. */
async function ensureTransactions(firestoreHost, localId, idToken, fixture) {
    const date = new Date().toISOString();
    const seeds = [
        { amountCents: 1250, title: 'E2E Seed Expense' },
        { amountCents: 4000, title: 'E2E Seed Purchase' },
    ];
    for (const [index, seed] of seeds.entries()) {
        const result = await patchFirestoreDoc(
            firestoreHost,
            `artifacts/${APP_ID}/users/${localId}/finance/${fixture.transactionIds[index]}`,
            {
                title: sv(seed.title),
                amountCents: iv(seed.amountCents),
                type: sv('expense'),
                category: sv('Misc'),
                accountId: sv(fixture.accountId),
                accountName: sv(fixture.accountName),
                currency: sv('USD'),
                scope: sv('personal'),
                date: sv(date),
                source: sv('manual'),
            },
            idToken,
        );
        if (result.status >= 300) throw new Error(`transaction doc write failed: HTTP ${result.status}`);
    }
}

async function main() {
    const authHost = requireLoopbackHostEnv(
        process.env,
        'FIREBASE_AUTH_EMULATOR_HOST',
        `${LOOPBACK_HOST}:${EMULATOR_PORTS.auth}`,
    );
    const firestoreHost = requireLoopbackHostEnv(
        process.env,
        'FIRESTORE_EMULATOR_HOST',
        `${LOOPBACK_HOST}:${EMULATOR_PORTS.firestore}`,
    );
    const projectId = requireDemoProjectId(process.env);
    await assertEmulatorReachable(authHost, 'auth');
    await assertEmulatorReachable(firestoreHost, 'firestore');
    const fixture = resolveFinanceFixture(process.env.E2E_RUN_ID);
    const user = readFixtureIdentity();

    const auth = await ensureAuthUser(authHost, user);
    await ensureProfileDoc(firestoreHost, auth.localId, auth.idToken, user);
    await ensureAccount(firestoreHost, auth.localId, auth.idToken, fixture);
    await ensureTransactions(firestoreHost, auth.localId, auth.idToken, fixture);

    console.log(
        `seed-e2e-finance: OK (project=${projectId}, run_id=${fixture.runId}, ` +
            `identity ${auth.created ? 'created' : 'verified'}, ` +
            `account "${fixture.accountName}" + ${fixture.transactionIds.length} transactions ready).`,
    );
}

main().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`seed-e2e-finance: FAILED — ${message}`);
    process.exit(1);
});
