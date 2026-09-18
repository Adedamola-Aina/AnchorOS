/**
 * Webhook claim lifecycle — Firestore emulator integration tests.
 *
 * Runs against the REAL Firestore emulator (firebase-admin → FIRESTORE_EMULATOR_HOST)
 * so transaction, ownership and concurrency properties are proven against actual
 * backend behavior rather than mocks.
 *
 * Isolation: uses its own project id (`anchor-os-webhook-emulator-test`), so it
 * never touches demo-anchor-os development data. An existing emulator can be used
 * without restarting it:
 *
 *   GCLOUD_PROJECT=anchor-os-webhook-emulator-test FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *     npx vitest run --config vitest.emulator.config.ts src/bankWebhook.emulator.test.ts
 *
 * @vitest-environment node
 */
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

/** Test-owned documents all carry this prefix; cleanup only removes these. */
const KEY_PREFIX = 'it_';
const ISOLATED_PROJECT = 'anchor-os-webhook-emulator-test';

// Must be set before ./config initializes firebase-admin.
//
// The project id is PINNED, never inherited: `firebase emulators:exec
// --project demo-anchor-os` exports GCLOUD_PROJECT, so inheriting it would point
// this suite (and its cleanup) at shared development data.
vi.hoisted(() => {
    process.env.GCLOUD_PROJECT = 'anchor-os-webhook-emulator-test';
    // FIREBASE_CONFIG takes precedence for project resolution, so pin it as well:
    // a no-argument initializeApp() anywhere in the process then cannot resolve to
    // the ambient emulator project.
    process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: 'anchor-os-webhook-emulator-test' });
    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    // Fail before Firebase initialization or any fixture write/cleanup.
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
        throw new Error('Webhook tests require a loopback Firestore emulator');
    }
    const port = Number(emulatorHost.slice(emulatorHost.lastIndexOf(':') + 1));
    if (port < 1 || port > 65535) throw new Error('Invalid Firestore emulator port');
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
});

// A dedicated NAMED admin app. The default app is process-global and shared with
// every other test file in the worker, so whichever file initializes it first wins
// (in CI that is the ambient `emulators:exec` project). A named app makes this
// suite's project namespace deterministic no matter the load order.
vi.mock('./config', async () => {
    const { initializeApp, getApp, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    const name = 'webhook-claim-emulator-test';
    const app = getApps().some((existing) => existing.name === name)
        ? getApp(name)
        : initializeApp({ projectId: 'anchor-os-webhook-emulator-test' }, name);

    return { db: getFirestore(app), APP_ID: 'anchor-os' };
});

import { db } from './config';
import { claimEvent, completeEvent, releaseEvent, CLAIM_LEASE_MS, MAX_CLAIM_ATTEMPTS } from './bankWebhook';

const T0 = 1_800_000_000_000;

let keyCounter = 0;
function newKey(label: string): string {
    keyCounter += 1;
    return `${KEY_PREFIX}${label}_${keyCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

async function readDoc(key: string) {
    const snap = await db.collection('webhook_events').doc(key).get();
    return snap.exists ? (snap.data() as Record<string, unknown>) : null;
}

async function cleanup() {
    const snap = await db.collection('webhook_events').get();
    const owned = snap.docs.filter((doc) => doc.id.startsWith(KEY_PREFIX));
    if (owned.length === 0) return;

    const batch = db.batch();
    owned.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
}

beforeEach(cleanup);
afterAll(cleanup);

describe('emulator test isolation', () => {
    it('is pinned to its own project rather than the ambient one', () => {
        expect(process.env.GCLOUD_PROJECT).toBe(ISOLATED_PROJECT);
        expect((db as unknown as { projectId: string }).projectId).toBe(ISOLATED_PROJECT);
    });

    it('only removes documents it owns', async () => {
        const foreignId = `foreign-${Date.now().toString(36)}`;
        await db.collection('webhook_events').doc(foreignId).set({ status: 'processing' });
        await db.collection('webhook_events').doc(`${KEY_PREFIX}owned`).set({ status: 'processing' });

        try {
            await cleanup();

            expect((await db.collection('webhook_events').doc(`${KEY_PREFIX}owned`).get()).exists).toBe(false);
            expect((await db.collection('webhook_events').doc(foreignId).get()).exists).toBe(true);
        } finally {
            await db.collection('webhook_events').doc(foreignId).delete();
        }
    });

    it('creates every event under the owned prefix', async () => {
        const key = newKey('prefixed');
        await claimEvent(key, T0, 'worker-a');

        const snap = await db.collection('webhook_events').get();
        expect(snap.docs.every((doc) => doc.id.startsWith(KEY_PREFIX))).toBe(true);
    });
});

describe('claimEvent against the Firestore emulator', () => {
    it('claims a fresh event with a bounded lease', async () => {
        const key = newKey('fresh');

        const result = await claimEvent(key, T0, 'worker-a');

        expect(result.outcome).toBe('claimed');
        expect(result.attempts).toBe(1);
        const doc = await readDoc(key);
        expect(doc).toMatchObject({ status: 'processing', claimId: 'worker-a' });
        expect(Number(doc?.leaseUntilMs)).toBe(T0 + CLAIM_LEASE_MS);
    });

    it('reports an active claim while the lease is live', async () => {
        const key = newKey('active');
        await claimEvent(key, T0, 'worker-a');

        const second = await claimEvent(key, T0 + 1000, 'worker-b');

        expect(second.outcome).toBe('active');
        expect(second.claimId).toBe('worker-a');
    });

    it('recovers an abandoned claim after the lease expires', async () => {
        const key = newKey('recover');
        const first = await claimEvent(key, T0, 'worker-a');

        const recovered = await claimEvent(key, T0 + CLAIM_LEASE_MS + 1, 'worker-b');

        expect(recovered.outcome).toBe('claimed');
        expect(recovered.claimId).not.toBe(first.claimId);
        expect(recovered.attempts).toBe(2);
    });

    it('protects a newer claim from a stale worker completing or releasing it', async () => {
        const key = newKey('stale');
        await claimEvent(key, T0, 'worker-a');
        await claimEvent(key, T0 + CLAIM_LEASE_MS + 1, 'worker-b');

        await expect(completeEvent(key, 'worker-a', T0 + CLAIM_LEASE_MS + 2)).resolves.toBe(false);
        await expect(releaseEvent(key, 'worker-a')).resolves.toBe(false);

        const doc = await readDoc(key);
        expect(doc).toMatchObject({ status: 'processing', claimId: 'worker-b' });

        await expect(completeEvent(key, 'worker-b', T0 + CLAIM_LEASE_MS + 3)).resolves.toBe(true);
        const completed = await claimEvent(key, T0 + CLAIM_LEASE_MS + 4, 'worker-c');
        expect(completed.outcome).toBe('completed');
    });

    it('stops auto-reclaiming after the bounded attempt count', async () => {
        const key = newKey('exhaust');
        const first = await claimEvent(key, T0, 'worker-1');
        expect(first.attempts).toBe(1);

        for (let attempt = 2; attempt <= MAX_CLAIM_ATTEMPTS; attempt += 1) {
            const reclaimed = await claimEvent(
                key,
                T0 + (attempt - 1) * (CLAIM_LEASE_MS + 1),
                `worker-${attempt}`,
            );
            expect(reclaimed.outcome).toBe('claimed');
            expect(reclaimed.attempts).toBe(attempt);
        }

        const exhausted = await claimEvent(
            key,
            T0 + MAX_CLAIM_ATTEMPTS * (CLAIM_LEASE_MS + 1),
            'worker-final',
        );
        expect(exhausted.outcome).toBe('exhausted');
    });

    it('serializes two concurrent deliveries of the same event', async () => {
        const key = newKey('concurrent');

        const [a, b] = await Promise.all([
            claimEvent(key, T0, 'worker-a'),
            claimEvent(key, T0, 'worker-b'),
        ]);

        expect([a.outcome, b.outcome].sort()).toEqual(['active', 'claimed']);
        const doc = await readDoc(key);
        expect(doc).toMatchObject({ status: 'processing' });
        expect(doc?.claimId).toBe(a.outcome === 'claimed' ? 'worker-a' : 'worker-b');
    });

    it('reports a completed event as a duplicate', async () => {
        const key = newKey('completed');
        await claimEvent(key, T0, 'worker-a');
        await expect(completeEvent(key, 'worker-a', T0 + 1)).resolves.toBe(true);

        const duplicate = await claimEvent(key, T0 + 2, 'worker-b');

        expect(duplicate.outcome).toBe('completed');
    });

    it('allows immediate reprocessing after a released claim', async () => {
        const key = newKey('released');
        await claimEvent(key, T0, 'worker-a');
        await expect(releaseEvent(key, 'worker-a')).resolves.toBe(true);

        const retry = await claimEvent(key, T0 + 1, 'worker-b');

        expect(retry.outcome).toBe('claimed');
        expect(retry.attempts).toBe(1);
    });
});
