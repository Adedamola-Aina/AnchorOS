#!/usr/bin/env node
'use strict';

/**
 * Deterministic LOCAL release-smoke seed (PR bounded smoke path).
 *
 * Creates the KNOWN test fixture identity from e2e/fixtures/test-data.ts in
 * the LOCAL Firebase Emulator Suite (Auth + a minimal Firestore profile doc)
 * so the bounded PR smoke can do ONE clean login with no signup and no
 * retries. The browser login flow itself NEVER creates accounts.
 *
 * Hard guards (this script must be impossible to run against a cloud project):
 *   - refuses to run unless FIREBASE_AUTH_EMULATOR_HOST and
 *     FIRESTORE_EMULATOR_HOST are present and point at a loopback host;
 *   - refuses any project ID other than demo-anchor-os;
 *   - idempotent: safe to run repeatedly (existing account is verified by
 *     signing in, the profile doc is overwritten with the same values);
 *   - never prints credentials or tokens.
 *
 * Usage (see `npm run test:release-smoke:local`):
 *   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *   FIREBASE_PROJECT_ID=demo-anchor-os \
 *   node scripts/ci/seed-release-emulator.mjs
 */

import { readFixtureIdentity } from './release-identity.mjs';

const DEMO_PROJECT_ID = 'demo-anchor-os';
const APP_ID = 'anchor-os';
const REQUEST_TIMEOUT_MS = 5000;

function fail(message) {
    console.error(`seed-release-emulator: REFUSED — ${message}`);
    process.exit(1);
}

// --- Guard 1: emulator host env variables must be present and loopback -----
function requireEmulatorEnv(name) {
    const value = process.env[name];
    if (!value) fail(`${name} is not set. This seed only runs against the local Firebase Emulator Suite.`);
    const host = value.split(':')[0];
    if (!['127.0.0.1', 'localhost', '::1'].includes(host)) {
        fail(`${name} must point at a loopback host (127.0.0.1), got "${value}".`);
    }
    return value;
}

const authHost = requireEmulatorEnv('FIREBASE_AUTH_EMULATOR_HOST');
const firestoreHost = requireEmulatorEnv('FIRESTORE_EMULATOR_HOST');

// --- Guard 2: only the demo project identity is ever touched ---------------
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) fail('FIREBASE_PROJECT_ID (or VITE_FIREBASE_PROJECT_ID) is not set.');
if (projectId !== DEMO_PROJECT_ID) {
    fail(`project ID "${projectId}" is not the demo identity "${DEMO_PROJECT_ID}". Cloud projects are never seeded.`);
}

// --- Reuse the canonical fixture identity (single source of truth) ---------
// The fixture identity is parsed by scripts/ci/release-identity.mjs so the
// seed script and the release smoke can never disagree on the account.

async function post(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
}

/** Create the user in the Auth emulator, or verify an existing one. Idempotent. */
async function ensureAuthUser(user) {
    // firebase-tools' Auth emulator exposes the identitytoolkit REST surface
    // under the ?key= variant; the emulator itself is already scoped to the
    // demo project it was started with (--project demo-anchor-os).
    const base = `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts`;
    const created = await post(`${base}:signUp?key=demo-api-key`, {
        email: user.email,
        password: user.password,
        displayName: user.name,
        returnSecureToken: false,
    });
    if (created.status === 200) return { created: true, localId: created.json.localId, idToken: created.json.idToken };
    if (created.json?.error?.message === 'EMAIL_EXISTS') {
        // Already seeded (or pre-existing): verify the SAME credentials work.
        const signedIn = await post(`${base}:signInWithPassword?key=demo-api-key`, {
            email: user.email,
            password: user.password,
            returnSecureToken: false,
        });
        if (signedIn.status !== 200) {
            throw new Error('auth emulator account exists but the fixture password does not match');
        }
        return { created: false, localId: signedIn.json.localId, idToken: signedIn.json.idToken };
    }
    throw new Error(`unexpected auth emulator response: ${created.json?.error?.message ?? created.status}`);
}

/** Write the minimal profile doc required by the authenticated shell. Idempotent. */
async function ensureProfileDoc(localId, idToken, user) {
    const url =
        `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents/` +
        `artifacts/${APP_ID}/users/${localId}`;
    const res = await fetch(url, {
        method: 'PATCH',
        // Authenticate AS the seeded user so the emulator-enforced security
        // rules (request.auth.uid == userId) accept the write.
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
            fields: {
                name: { stringValue: user.name },
                theme: { stringValue: 'light' },
                familyMode: { booleanValue: false },
                onboardingComplete: { booleanValue: true },
            },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`profile doc write failed: HTTP ${res.status}`);
}

async function main() {
    const user = readFixtureIdentity();
    let auth;
    try {
        auth = await ensureAuthUser(user);
    } catch (err) {
        fail(`Auth emulator seed failed: ${err.message}`);
    }
    try {
        await ensureProfileDoc(auth.localId, auth.idToken, user);
    } catch (err) {
        fail(`Firestore emulator seed failed: ${err.message}`);
    }
    console.log(
        `seed-release-emulator: OK (project=${projectId}, auth account ${auth.created ? 'created' : 'verified'}, ` +
        `profile doc written). Local emulator data is ready for the bounded smoke.`,
    );
}

main();
