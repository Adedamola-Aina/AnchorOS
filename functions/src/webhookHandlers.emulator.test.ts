/**
 * handleAccountUpdated — real handler, real Firestore, mocked Mono responses.
 *
 * Proves the financial-write idempotency guarantee end to end:
 *  - financial writes land, then marker/completion recording fails
 *  - another event runs and overwrites the marker
 *  - the first event is redelivered
 * Asserted: persisted transaction count, distinct external ids and balances.
 *
 * Firestore is REAL here (emulator). Only two things are doubled:
 *  1. Mono's HTTP responses (getAccountDetails / getTransactions), and
 *  2. the connection document's `update`, so the marker write can be failed
 *     in-process while every financial write still goes to Firestore.
 *
 * Isolation: the project id is pinned (never inherited), so this never touches
 * demo-anchor-os data even when run through `firebase emulators:exec`.
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    // Pin the project. Inheriting GCLOUD_PROJECT would let `firebase emulators:exec
    // --project demo-anchor-os` point this suite at shared development data.
    const project = 'anchor-os-webhook-handler-test';
    process.env.GCLOUD_PROJECT = project;
    // FIREBASE_CONFIG takes precedence for project resolution, so pin it as well.
    process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: project });
    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    // Fail before Firebase initialization or any fixture write/cleanup.
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
        throw new Error('Webhook tests require a loopback Firestore emulator');
    }
    const port = Number(emulatorHost.slice(emulatorHost.lastIndexOf(':') + 1));
    if (port < 1 || port > 65535) throw new Error('Invalid Firestore emulator port');
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;

    return {
        PROJECT: project,
        failMarkerWrite: false,
        markerFailures: 0,
        details: { account: { balance: 0 }, meta: {} } as Record<string, unknown>,
        transactions: [] as unknown[],
    };
});

type RealDocRef = {
    update: (data: Record<string, unknown>) => Promise<unknown>;
    set: (data: unknown, options?: unknown) => unknown;
    delete: () => Promise<unknown>;
};

type RealQuerySnapshot = {
    empty: boolean;
    size: number;
    docs: Array<{ id: string; data: () => Record<string, unknown>; ref: RealDocRef }>;
};

vi.mock('./config', async () => {
    const { initializeApp, getApp, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    // Dedicated NAMED app: the default app is process-global and may already have
    // been initialized with a different (ambient) project by another test file,
    // which would silently point this suite's fixtures at the wrong namespace.
    const name = 'webhook-handler-emulator-test';
    const app = getApps().some((existing) => existing.name === name)
        ? getApp(name)
        : initializeApp({ projectId: mockState.PROJECT }, name);
    const real = getFirestore(app);

    const guardDoc = (ref: RealDocRef): RealDocRef => ({
        update: async (data) => {
            if (mockState.failMarkerWrite && Object.prototype.hasOwnProperty.call(data, 'lastProcessedEventId')) {
                mockState.markerFailures += 1;
                throw new Error('marker write failed');
            }
            return ref.update(data);
        },
        set: (data, options) => ref.set(data, options),
        delete: () => ref.delete(),
    });

    const wrapQuery = (query: object): object =>
        new Proxy(query, {
            get(target, prop) {
                const value = Reflect.get(target, prop) as unknown;
                if (typeof value !== 'function') return value;
                const fn = value as (...args: unknown[]) => unknown;

                if (prop === 'get') {
                    return async (): Promise<RealQuerySnapshot> => {
                        const snap = (await fn.call(target)) as RealQuerySnapshot;
                        return {
                            empty: snap.empty,
                            size: snap.size,
                            docs: snap.docs.map((doc) => ({
                                id: doc.id,
                                data: () => doc.data(),
                                ref: guardDoc(doc.ref),
                            })),
                        };
                    };
                }
                if (['where', 'limit', 'orderBy'].includes(String(prop))) {
                    return (...args: unknown[]) => wrapQuery(fn.apply(target, args) as object);
                }
                return fn.bind(target);
            },
        });

    const db = new Proxy(real, {
        get(target, prop) {
            const value = Reflect.get(target, prop) as unknown;
            if (typeof value !== 'function') return value;
            const fn = value as (...args: unknown[]) => unknown;

            if (prop === 'collectionGroup') {
                return (name: string) => wrapQuery(fn.call(target, name) as object);
            }
            return fn.bind(target);
        },
    });

    return { db, APP_ID: 'anchor-os', BCRYPT_SALT_ROUNDS: 12, EMAIL_FROM: '', APP_URL: '' };
});

vi.mock('./mono/monoClient', () => ({
    getAccountDetails: async () => mockState.details,
    getTransactions: async () => ({
        data: mockState.transactions,
        paging: { total: 0, page: 1, previous: null, next: null },
    }),
}));

import { db, APP_ID } from './config';
import { handleAccountUpdated, financeDocId } from './webhookHandlers';
import type { MonoTransaction } from './mono/monoTypes';

let seq = 0;
function unique(prefix: string): string {
    seq += 1;
    return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

function monoTx(id: string, amount: number, type: 'debit' | 'credit', narration: string): MonoTransaction {
    return { _id: id, type, amount, narration, date: '2026-01-02T00:00:00.000Z', balance: 0, currency: 'NGN' };
}

function detailsWithBalance(balance: number): Record<string, unknown> {
    return { account: { balance }, meta: { data_status: 'AVAILABLE' } };
}

const userRef = (uid: string) => db.collection('artifacts').doc(APP_ID).collection('users').doc(uid);
const accountRef = (uid: string, accId: string) => userRef(uid).collection('accounts').doc(accId);
const connRef = (uid: string, connId: string) => userRef(uid).collection('bankConnections').doc(connId);

async function seed(uid: string, accId: string, connId: string, monoId: string): Promise<void> {
    await userRef(uid).set({ uid });
    await accountRef(uid, accId).set({ source: 'linked', currency: 'NGN', balanceCents: 0 });
    await connRef(uid, connId).set({
        provider: 'mono',
        monoAccountId: monoId,
        anchorAccountId: accId,
        userId: uid,
        institutionName: 'Test Bank',
        linkedAt: '2026-01-01T00:00:00.000Z',
        status: 'active',
    });
}

async function cleanup(uid: string, accId: string, connId: string): Promise<void> {
    const financeSnap = await userRef(uid).collection('finance').get();
    await Promise.all(financeSnap.docs.map((doc) => doc.ref.delete()));
    await connRef(uid, connId).delete();
    await accountRef(uid, accId).delete();
    await userRef(uid).delete();
}

async function financeDocs(uid: string, accId: string) {
    const snap = await userRef(uid).collection('finance').where('accountId', '==', accId).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }));
}

async function externalIds(uid: string, accId: string): Promise<string[]> {
    const docs = await financeDocs(uid, accId);
    return docs.map((doc) => String(doc.externalTransactionId)).sort();
}

async function balanceCents(uid: string, accId: string): Promise<number> {
    const snap = await accountRef(uid, accId).get();
    return Number(snap.data()?.balanceCents ?? 0);
}

async function marker(uid: string, connId: string): Promise<unknown> {
    const snap = await connRef(uid, connId).get();
    return snap.data()?.lastProcessedEventId;
}

beforeEach(() => {
    mockState.failMarkerWrite = false;
    mockState.markerFailures = 0;
    mockState.details = detailsWithBalance(0);
    mockState.transactions = [];
});

/** Seeds a fresh user/account/connection and guarantees cleanup afterwards. */
const seeded: Array<{ uid: string; accId: string; connId: string }> = [];

async function setup(): Promise<{ uid: string; accId: string; connId: string; monoId: string }> {
    const uid = unique('user');
    const accId = unique('acc');
    const connId = unique('conn');
    const monoId = unique('mono');

    await seed(uid, accId, connId, monoId);
    seeded.push({ uid, accId, connId });

    return { uid, accId, connId, monoId };
}

afterEach(async () => {
    while (seeded.length > 0) {
        const entry = seeded.pop()!;
        await cleanup(entry.uid, entry.accId, entry.connId);
    }
});

describe('handleAccountUpdated financial idempotency (real Firestore)', () => {
    it('converges when the marker write fails, another event runs, then the first retries', async () => {
        const { uid, accId, connId, monoId } = await setup();
        const txA = monoTx('tx-A', 25, 'debit', 'Shoprite Lagos');
        const txB = monoTx('tx-B', 5000, 'credit', 'Salary January');
        const txC = monoTx('tx-C', 12.5, 'debit', 'Uber trip');

        mockState.details = detailsWithBalance(1000);
        mockState.transactions = [txA, txB];

        // 1. Financial writes land; marker recording fails.
        mockState.failMarkerWrite = true;
        await expect(handleAccountUpdated(monoId, 'evt-1')).rejects.toThrow('marker write failed');
        expect(mockState.markerFailures).toBe(1);
        expect(await financeDocs(uid, accId)).toHaveLength(2);
        expect(await balanceCents(uid, accId)).toBe(100_000);
        expect(await marker(uid, connId)).toBeUndefined();

        // 2. Another event runs and takes over the single-value marker.
        mockState.failMarkerWrite = false;
        mockState.details = detailsWithBalance(2500);
        mockState.transactions = [txB, txC];
        await handleAccountUpdated(monoId, 'evt-2');
        expect(await externalIds(uid, accId)).toEqual(['tx-A', 'tx-B', 'tx-C']);
        expect(await marker(uid, connId)).toBe('evt-2');

        // 3. The first event is redelivered. The marker can no longer identify it,
        //    so convergence must come from per-transaction identity instead.
        mockState.transactions = [txA, txB];
        await handleAccountUpdated(monoId, 'evt-1');

        expect(await externalIds(uid, accId)).toEqual(['tx-A', 'tx-B', 'tx-C']);
        expect(await balanceCents(uid, accId)).toBe(250_000);
        // Documented: the marker is not monotonic — it now names the retried event.
        expect(await marker(uid, connId)).toBe('evt-1');
    });

    it('does not double-import when two events race over the same transactions', async () => {
        const { uid, accId, monoId } = await setup();
        mockState.details = detailsWithBalance(1000);
        mockState.transactions = [1, 2, 3, 4, 5].map((n) => monoTx(`tx-race-${n}`, n, 'debit', `Merchant ${n}`));

        await Promise.all([
            handleAccountUpdated(monoId, 'evt-a'),
            handleAccountUpdated(monoId, 'evt-b'),
        ]);

        const docs = await financeDocs(uid, accId);
        expect(docs).toHaveLength(5);
        expect(new Set(docs.map((doc) => doc.id)).size).toBe(5);
        expect(await externalIds(uid, accId)).toEqual([
            'tx-race-1',
            'tx-race-2',
            'tx-race-3',
            'tx-race-4',
            'tx-race-5',
        ]);
    });

    it('re-applies nothing when the same event is retried after its marker was lost', async () => {
        const { uid, accId, monoId } = await setup();
        mockState.details = detailsWithBalance(500);
        mockState.transactions = [monoTx('tx-retry-1', 10, 'debit', 'Uber trip')];

        mockState.failMarkerWrite = true;
        await expect(handleAccountUpdated(monoId, 'evt-retry')).rejects.toThrow('marker write failed');

        // Marker is gone, so the fast path cannot fire and the handler re-syncs.
        mockState.failMarkerWrite = false;
        await handleAccountUpdated(monoId, 'evt-retry');

        const docs = await financeDocs(uid, accId);
        expect(docs).toHaveLength(1);
        expect(docs[0].appliedEventId).toBe('evt-retry');
        expect(await balanceCents(uid, accId)).toBe(50_000);
    });

    it('keys each synced transaction by a deterministic id derived from the provider id', async () => {
        const { uid, accId, monoId } = await setup();
        mockState.details = detailsWithBalance(100);
        mockState.transactions = [monoTx('tx-key-1', 7, 'debit', 'Bolt ride')];

        await handleAccountUpdated(monoId, 'evt-key');

        const expectedId = financeDocId(accId, 'tx-key-1');
        expect(expectedId).toMatch(/^[0-9a-f]{64}$/);
        const docs = await financeDocs(uid, accId);
        expect(docs.map((doc) => doc.id)).toEqual([expectedId]);
    });
});
