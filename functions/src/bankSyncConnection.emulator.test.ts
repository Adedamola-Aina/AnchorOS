/**
 * Bank sync import idempotency — Firestore emulator integration tests (FI-18).
 *
 * The register's acceptance is "deterministic import doc IDs; concurrency test".
 * These tests run the REAL `syncConnection` against REAL Firestore with only Mono's
 * responses mocked, and drive two syncs at once — the case the previous
 * read-then-write dedupe could not survive.
 *
 * Isolation follows RA-18: pinned project plus a dedicated NAMED admin app, so the
 * process-global default app cannot steer it.
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const project = 'anchor-os-banksync-emulator-test';
    process.env.GCLOUD_PROJECT = project;
    process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: project });

    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
        throw new Error('Bank sync tests require a loopback Firestore emulator');
    }
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;

    return {
        PROJECT: project,
        details: { account: { balance: 100 }, meta: {} } as Record<string, unknown>,
        transactions: [] as unknown[],
    };
});

vi.mock('./config', async () => {
    const { initializeApp, getApp, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    const name = 'banksync-emulator-test';
    const app = getApps().some((existing) => existing.name === name)
        ? getApp(name)
        : initializeApp({ projectId: mockState.PROJECT }, name);

    return { db: getFirestore(app), APP_ID: 'anchor-os' };
});

vi.mock('./mono/monoClient', () => ({
    getAccountDetails: async () => mockState.details,
    getAllTransactions: async () => ({
        transactions: mockState.transactions,
        total: mockState.transactions.length,
        pages: 1,
        truncated: false,
    }),
}));

import { db, APP_ID } from './config';
import { syncConnection } from './bankSyncConnection';
import { financeDocId } from './mono/transactionMapper';
import type { BankConnectionDoc, MonoTransaction } from './mono/monoTypes';

let seq = 0;
function unique(prefix: string): string {
    seq += 1;
    return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

function monoTx(id: string, amount: number): MonoTransaction {
    return {
        _id: id, type: 'debit', amount, narration: `Merchant ${id}`,
        date: '2026-01-02T00:00:00.000Z', balance: 0, currency: 'NGN',
    };
}

const userRef = (uid: string) => db.collection('artifacts').doc(APP_ID).collection('users').doc(uid);
const accountRef = (uid: string, accId: string) => userRef(uid).collection('accounts').doc(accId);
const connRef = (uid: string, connId: string) => userRef(uid).collection('bankConnections').doc(connId);

const seeded: Array<{ uid: string; accId: string; connId: string }> = [];

async function setup(): Promise<{ uid: string; accId: string; connId: string; connection: BankConnectionDoc }> {
    const uid = unique('user');
    const accId = unique('acc');
    const connId = unique('conn');
    const monoId = unique('mono');

    await userRef(uid).set({ uid });
    await accountRef(uid, accId).set({ source: 'linked', currency: 'NGN', balanceCents: 0 });

    const connection: BankConnectionDoc = {
        provider: 'mono',
        monoAccountId: monoId,
        anchorAccountId: accId,
        userId: uid,
        institutionName: 'Test Bank',
        linkedAt: '2026-01-01T00:00:00.000Z',
        status: 'active',
    };
    await connRef(uid, connId).set(connection);
    seeded.push({ uid, accId, connId });

    return { uid, accId, connId, connection };
}

async function financeDocs(uid: string, accId: string): Promise<Array<{ id: string } & Record<string, unknown>>> {
    const snap = await userRef(uid).collection('finance').where('accountId', '==', accId).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }));
}

beforeEach(() => {
    mockState.details = { account: { balance: 100 }, meta: {} };
    mockState.transactions = [];
});

afterEach(async () => {
    while (seeded.length > 0) {
        const entry = seeded.pop()!;
        const financeSnap = await userRef(entry.uid).collection('finance').get();
        await Promise.all(financeSnap.docs.map((doc) => doc.ref.delete()));
        await connRef(entry.uid, entry.connId).delete();
        await accountRef(entry.uid, entry.accId).delete();
        await userRef(entry.uid).delete();
    }
});

describe('syncConnection import idempotency (real Firestore)', () => {
    it('imports each provider transaction exactly once when two syncs run concurrently', async () => {
        const { uid, accId, connId, connection } = await setup();
        mockState.transactions = Array.from({ length: 30 }, (_, i) => monoTx(`tx-c-${i}`, i + 1));

        await Promise.all([
            syncConnection(connection, connRef(uid, connId)),
            syncConnection(connection, connRef(uid, connId)),
        ]);

        const docs = await financeDocs(uid, accId);
        expect(docs).toHaveLength(30);
        expect(new Set(docs.map((doc) => doc.externalTransactionId)).size).toBe(30);
        expect(new Set(docs.map((doc) => doc.id)).size).toBe(30);
    });

    it('keys synced rows by the deterministic provider-derived id', async () => {
        const { uid, accId, connId, connection } = await setup();
        mockState.transactions = [monoTx('tx-key', 5)];

        await syncConnection(connection, connRef(uid, connId));

        const docs = await financeDocs(uid, accId);
        expect(docs).toHaveLength(1);
        expect(docs[0].id).toBe(financeDocId(accId, 'tx-key'));
    });

    it('does not duplicate on a repeated sync', async () => {
        const { uid, accId, connId, connection } = await setup();
        mockState.transactions = [monoTx('tx-a', 1), monoTx('tx-b', 2)];

        await syncConnection(connection, connRef(uid, connId));
        await syncConnection(connection, connRef(uid, connId));

        expect(await financeDocs(uid, accId)).toHaveLength(2);
    });
});
