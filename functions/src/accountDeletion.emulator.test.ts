/**
 * Account deletion erasure contract — Firestore emulator integration tests (A-04).
 *
 * The register's acceptance is "idempotent orchestrated deletion; erasure contract
 * test suite (tree/Storage/Mono/tokens) green". Real Firestore drives the job record,
 * the user tree and the family artefacts; the side effects that cannot run in CI
 * (Mono HTTP, Cloud Storage, Firebase Auth) are injected, which also lets the test
 * assert ORDERING (auth last) and RESUME (a failed step is retried, finished steps
 * are not repeated).
 *
 * Isolation follows RA-18: pinned project plus a dedicated NAMED admin app.
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const project = 'anchor-os-deletion-emulator-test';
    process.env.GCLOUD_PROJECT = project;
    process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: project });

    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
        throw new Error('Account deletion tests require a loopback Firestore emulator');
    }
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;

    return { PROJECT: project };
});

vi.mock('./config', async () => {
    const { initializeApp, getApp, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    const name = 'deletion-emulator-test';
    const app = getApps().some((existing) => existing.name === name)
        ? getApp(name)
        : initializeApp({ projectId: mockState.PROJECT }, name);

    return { db: getFirestore(app), APP_ID: 'anchor-os' };
});

import { db, APP_ID } from './config';
import {
    deleteAccountData,
    defaultDeletionDeps,
    readDeletionJob,
    storagePrefixes,
    type DeletionDeps,
} from './accountDeletion';

const users = () => db.collection('artifacts').doc(APP_ID).collection('users');
const familyConnections = () => db.collection('artifacts').doc(APP_ID).collection('family_connections');
const jobs = () => db.collection('artifacts').doc(APP_ID).collection('deletion_jobs');

let seq = 0;
const seededUsers: string[] = [];
const seededConnections: string[] = [];

function unique(prefix: string): string {
    seq += 1;
    return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

/** A user with a subcollection tree, a bank connection and a family connection. */
async function seedUser(): Promise<{ uid: string; otherUid: string; connectionId: string }> {
    const uid = unique('user');
    const otherUid = unique('other');
    const connectionId = unique('conn');

    await users().doc(uid).set({ uid, onboardingComplete: true });
    await users().doc(uid).collection('accounts').doc('acc-1').set({ name: 'Checking', balanceCents: 1 });
    await users().doc(uid).collection('finance').doc('tx-1').set({ amountCents: 1 });
    await users().doc(uid).collection('bankConnections').doc(connectionId).set({
        monoAccountId: `mono-${uid}`, userId: uid, anchorAccountId: 'acc-1', status: 'active',
    });

    await users().doc(otherUid).set({ uid: otherUid });
    await users().doc(otherUid).collection('finance').doc('tx-other').set({ amountCents: 2 });

    await familyConnections().doc(unique('link')).set({ ownerUid: uid, memberUid: otherUid, status: 'active' });

    seededUsers.push(uid, otherUid);
    seededConnections.push(connectionId);
    return { uid, otherUid, connectionId };
}

/** Injected side effects, with call order recorded so "auth last" is provable. */
function makeDeps(overrides: Partial<DeletionDeps> = {}) {
    const calls: string[] = [];
    const deps: DeletionDeps = {
        revokeSessions: vi.fn(async () => { calls.push('sessions'); }),
        unlinkProvider: vi.fn(async () => { calls.push('provider'); return 1; }),
        eraseStorage: vi.fn(async () => { calls.push('storage'); return 3; }),
        eraseFamily: vi.fn(async (uid: string, email?: string) => {
            calls.push('family');
            await defaultDeletionDeps.eraseFamily(uid, email);
        }),
        eraseTree: vi.fn(async (uid: string) => {
            calls.push('tree');
            await defaultDeletionDeps.eraseTree(uid);
        }),
        deleteAuthUser: vi.fn(async () => { calls.push('auth'); }),
        ...overrides,
    };
    return { deps, calls };
}

beforeEach(() => {
    seededUsers.length = 0;
    seededConnections.length = 0;
});

afterEach(async () => {
    for (const uid of seededUsers.splice(0)) {
        await defaultDeletionDeps.eraseTree(uid);
        await jobs().doc(uid).delete();
    }
    for (const id of seededConnections.splice(0)) {
        await familyConnections().doc(id).delete().catch(() => undefined);
    }
    const links = await familyConnections().get();
    await Promise.all(links.docs.map((doc) => doc.ref.delete()));
});

describe('account deletion erasure contract (real Firestore)', () => {
    it('erases tree, family link and provider link, deleting the auth user LAST', async () => {
        const { uid, otherUid } = await seedUser();
        const { deps, calls } = makeDeps();

        const outcome = await deleteAccountData(uid, 'user@example.test', deps);

        expect(outcome.status).toBe('complete');
        expect(outcome.alreadyComplete).toBe(false);
        expect(outcome.executed).toEqual(['sessions', 'provider', 'storage', 'family', 'tree', 'auth']);

        // Ordering: the account stays authenticatable until everything else is gone.
        expect(calls[calls.length - 1]).toBe('auth');

        // Erasure: user tree gone (including subcollections) ...
        const tree = await users().doc(uid).collection('finance').get();
        expect(tree.empty).toBe(true);
        expect((await users().doc(uid).get()).exists).toBe(false);

        // ... family link gone ...
        const links = await familyConnections().where('ownerUid', '==', uid).get();
        expect(links.empty).toBe(true);

        // ... and the other user is untouched.
        expect((await users().doc(otherUid).get()).exists).toBe(true);
        expect((await users().doc(otherUid).collection('finance').doc('tx-other').get()).exists).toBe(true);

        const job = await readDeletionJob(uid);
        expect(job?.status).toBe('complete');
    });

    it('resumes after a failed step without repeating finished work or touching auth', async () => {
        const { uid } = await seedUser();
        const failing = makeDeps({
            eraseStorage: vi.fn(async () => { throw new Error('storage unavailable'); }),
        });

        const first = await deleteAccountData(uid, undefined, failing.deps);

        expect(first.status).toBe('failed');
        expect(first.completedSteps).toEqual(['sessions', 'provider']);
        expect(first.executed).toEqual(['sessions', 'provider']);
        // The auth user must survive a failure so the user can retry.
        expect(failing.deps.deleteAuthUser).not.toHaveBeenCalled();
        expect((await users().doc(uid).get()).exists).toBe(true);
        expect((await readDeletionJob(uid))?.status).toBe('failed');

        const retry = makeDeps();
        const second = await deleteAccountData(uid, undefined, retry.deps);

        expect(second.status).toBe('complete');
        // Finished steps are skipped: no second provider unlink, no second session revoke.
        expect(second.executed).toEqual(['storage', 'family', 'tree', 'auth']);
        expect(retry.deps.unlinkProvider).not.toHaveBeenCalled();
        expect(retry.deps.revokeSessions).not.toHaveBeenCalled();
        expect((await users().doc(uid).get()).exists).toBe(false);
    });

    it('is a no-op when the job already completed', async () => {
        const { uid } = await seedUser();
        const first = makeDeps();
        await deleteAccountData(uid, undefined, first.deps);

        const second = makeDeps();
        const outcome = await deleteAccountData(uid, undefined, second.deps);

        expect(outcome.alreadyComplete).toBe(true);
        expect(outcome.executed).toEqual([]);
        expect(second.deps.deleteAuthUser).not.toHaveBeenCalled();
        expect(second.deps.unlinkProvider).not.toHaveBeenCalled();
    });

    it('treats a provider failure as retryable residue, not as success', async () => {
        const { uid } = await seedUser();
        const failing = makeDeps({
            unlinkProvider: vi.fn(async () => { throw new Error('mono 500'); }),
        });

        const outcome = await deleteAccountData(uid, undefined, failing.deps);

        expect(outcome.status).toBe('failed');
        expect(outcome.completedSteps).toEqual(['sessions']);
        expect(failing.deps.deleteAuthUser).not.toHaveBeenCalled();
        expect((await readDeletionJob(uid))?.lastError).toContain('mono 500');
    });

    it('erases the Storage prefixes that belong to the user', () => {
        expect(storagePrefixes('abc')).toEqual([
            'avatars/abc/',
            `artifacts/${APP_ID}/users/abc/`,
        ]);
    });
});

