/**
 * Balance observation ordering — Firestore emulator integration tests (FI-04).
 *
 * The register's acceptance is "non-destructive application or serialized sync;
 * concurrency test". These tests drive the real `applyObservedBalance` against real
 * Firestore, including two applications racing, and prove the *older* observation
 * can never win — the defect the previous blind `update({ balanceCents })` had.
 *
 * Isolation follows RA-18 (pinned project, dedicated named admin app).
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const project = 'anchor-os-balance-emulator-test';
    process.env.GCLOUD_PROJECT = project;
    process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: project });

    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
        throw new Error('Balance tests require a loopback Firestore emulator');
    }
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;

    return { PROJECT: project };
});

vi.mock('./config', async () => {
    const { initializeApp, getApp, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    const name = 'balance-emulator-test';
    const app = getApps().some((existing) => existing.name === name)
        ? getApp(name)
        : initializeApp({ projectId: mockState.PROJECT }, name);

    return { db: getFirestore(app), APP_ID: 'anchor-os' };
});

import { db, APP_ID } from './config';
import { applyObservedBalance, observedAtFrom } from './accountBalance';

let seq = 0;
const uid = 'balance-user';
const accounts = () => db.collection('artifacts').doc(APP_ID).collection('users').doc(uid).collection('accounts');

async function seedAccount(accId: string): Promise<FirebaseFirestore.DocumentReference> {
    const ref = accounts().doc(accId);
    await ref.set({ source: 'linked', currency: 'NGN', balanceCents: 0 });
    return ref;
}

async function readAccount(accId: string) {
    const snap = await accounts().doc(accId).get();
    return (snap.data() ?? {}) as Record<string, unknown>;
}

const created: string[] = [];

beforeEach(() => {
    created.length = 0;
});

afterEach(async () => {
    for (const accId of created) {
        await accounts().doc(accId).delete();
    }
});

describe('applyObservedBalance (real Firestore)', () => {
    it('applies the first observation and records when it was observed', async () => {
        seq += 1;
        const accId = `acc-${seq}`;
        created.push(accId);
        const ref = await seedAccount(accId);

        const applied = await applyObservedBalance(ref, 123_400, 1_700_000_000_000);
        const data = await readAccount(accId);

        expect(applied).toBe(true);
        expect(data.balanceCents).toBe(123_400);
        expect((data.externalConnection as Record<string, unknown>).balanceAsOfMs).toBe(1_700_000_000_000);
        expect((data.externalConnection as Record<string, unknown>).syncStatus).toBe('active');
    });

    it('discards a stale observation instead of regressing the balance', async () => {
        seq += 1;
        const accId = `acc-${seq}`;
        created.push(accId);
        const ref = await seedAccount(accId);

        await applyObservedBalance(ref, 500_000, 1_700_000_000_000);
        const staleApplied = await applyObservedBalance(ref, 111_111, 1_699_999_000_000);

        const data = await readAccount(accId);
        expect(staleApplied).toBe(false);
        expect(data.balanceCents).toBe(500_000);
        expect((data.externalConnection as Record<string, unknown>).balanceAsOfMs).toBe(1_700_000_000_000);
    });

    it('applies a newer observation over an older one', async () => {
        seq += 1;
        const accId = `acc-${seq}`;
        created.push(accId);
        const ref = await seedAccount(accId);

        await applyObservedBalance(ref, 111_111, 1_699_999_000_000);
        const applied = await applyObservedBalance(ref, 222_222, 1_700_000_000_000);

        expect(applied).toBe(true);
        expect((await readAccount(accId)).balanceCents).toBe(222_222);
    });

    it('converges on the newest observation when two writers race', async () => {
        seq += 1;
        const accId = `acc-${seq}`;
        created.push(accId);
        const ref = await seedAccount(accId);

        // The newer observation is issued second but commits in whatever order
        // Firestore serializes them; the final state must be the newer one.
        await Promise.all([
            applyObservedBalance(ref, 100_000, 1_700_000_000_000),
            applyObservedBalance(ref, 300_000, 1_700_000_005_000),
        ]);

        expect((await readAccount(accId)).balanceCents).toBe(300_000);
    });

    it('does nothing for an account that no longer exists', async () => {
        seq += 1;
        const accId = `acc-missing-${seq}`;
        const ref = accounts().doc(accId);

        expect(await applyObservedBalance(ref, 1, 1_700_000_000_000)).toBe(false);
    });

    it('falls back to now when the provider timestamp is unusable', () => {
        const before = Date.now();
        expect(observedAtFrom(undefined, 'not-a-date', null)).toBeGreaterThanOrEqual(before);
        expect(observedAtFrom('2026-01-27T21:00:38.856Z')).toBe(Date.parse('2026-01-27T21:00:38.856Z'));
    });
});
