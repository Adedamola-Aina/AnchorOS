/**
 * Deterministic recovery tests for AccountService.renameAccount (FEAT-142).
 *
 * A minimal in-memory Firestore double (document map + staged write batches)
 * wires the REAL rename logic through with failure injection at every write
 * boundary. Each scenario asserts resulting state — account document,
 * transaction names, and rename history — and, to model reopening the dialog
 * after a reload, performs the retry through a FRESH AccountService instance.
 *
 * Invariant committed to: the account document (name + history) is committed
 * LAST, after every transaction-update batch. Therefore any failure leaves
 * the original account name persisted, recovery survives reload, retries with
 * any name (including the original) work, and history entries append exactly
 * once on success.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as firestore from 'firebase/firestore';
import { AccountService } from '../AccountService';
import type { AnchorAccount } from '../../types';

vi.mock('../../features/finance/utils/permissions', () => ({
    canManageAccount: vi.fn((account, userId) => account.ownerId === userId || !account.ownerId),
}));
vi.mock('../serverRateLimit', () => ({ enforceServerRateLimit: vi.fn().mockResolvedValue(undefined) }));

type DocData = Record<string, unknown>;

interface DocSnapshot {
    data: () => DocData;
    id: string;
    ref: { path: string };
}

interface FakeStore {
    docs: Map<string, DocData>;
    failAtCommits: Set<number>; // 1-based commit indexes that reject
    commitIndex: { value: number };
}

const OWNER = 'owner-1';
const ACC = 'acc-1';
const APP_ID = 'anchor-os';
const BASE_PATH = `artifacts/${APP_ID}/users/${OWNER}`;
const ACC_PATH = `${BASE_PATH}/accounts/${ACC}`;
const OWNER_TX = `${BASE_PATH}/finance`;
const SPOUSE_TX = `artifacts/${APP_ID}/users/spouse-1/finance`;

const makeStore = (failAtCommits: number[] = []): FakeStore => {
    const store: FakeStore = {
        docs: new Map(),
        failAtCommits: new Set(failAtCommits),
        commitIndex: { value: 0 },
    };

    vi.mocked(firestore.doc).mockImplementation((db, ...path) => ({ path: path.join('/') } as unknown as ReturnType<typeof firestore.doc>));
    vi.mocked(firestore.collection).mockImplementation((db, ...path) => ({ path: path.join('/') } as unknown as ReturnType<typeof firestore.collection>));
    vi.mocked(firestore.query).mockImplementation((ref, ...constraints) => ({ ...ref, constraints } as unknown as ReturnType<typeof firestore.query>));
    vi.mocked(firestore.where).mockImplementation((field, op, value) => ({ type: 'where', field, op, value } as unknown as ReturnType<typeof firestore.where>));

    interface FakeQuery { path: string; constraints?: { field: string; value: unknown }[] }
    vi.mocked(firestore.getDocs).mockImplementation(async (rawQuery) => {
        const q = rawQuery as unknown as FakeQuery;
        const prefix = q.path;
        const constraints = q.constraints ?? [];
        const matches: DocSnapshot[] = [];
        for (const [path, data] of store.docs) {
            if (!path.startsWith(prefix + '/')) continue;
            const passes = constraints.every(c => data[c.field] === c.value);
            if (passes) {
                matches.push({ data: () => data, id: path.slice(prefix.length + 1), ref: { path } });
            }
        }
        return { docs: matches, empty: matches.length === 0 } as unknown as ReturnType<typeof firestore.getDocs> extends Promise<infer T> ? T : never;
    });

    interface StagedUpdate { path: string; data: DocData }
    const makeBatch = () => {
        const staged: StagedUpdate[] = [];
        return {
            update: (ref: { path: string }, data: DocData) => { staged.push({ path: ref.path, data }); },
            commit: async () => {
                store.commitIndex.value += 1;
                if (store.failAtCommits.has(store.commitIndex.value)) {
                    throw new Error(`Simulated commit failure #${store.commitIndex.value}`);
                }
                for (const u of staged) {
                    store.docs.set(u.path, { ...store.docs.get(u.path), ...u.data });
                }
            },
            set: (ref: { path: string }, data: DocData) => { staged.push({ path: ref.path, data }); },
            delete: (ref: { path: string }) => {
                staged.push({ path: ref.path, data: {} });
            },
        };
    };
    vi.mocked(firestore.writeBatch).mockImplementation(() => makeBatch() as unknown as ReturnType<typeof firestore.writeBatch>);

    return store;
};

const makeAccount = (over: Partial<AnchorAccount> = {}): AnchorAccount => ({
    id: ACC,
    name: 'Checking Account',
    type: 'checking',
    currency: 'USD',
    balanceCents: 0,
    color: 'bg-blue-500',
    scope: 'personal',
    ownerId: OWNER,
    ...over,
});

const seedAccount = (store: FakeStore, account = makeAccount()) => {
    store.docs.set(ACC_PATH, { name: account.name, nameHistory: account.nameHistory ?? [] });
    return account;
};

const seedTransactions = (store: FakeStore, count: number, collectionPath = OWNER_TX) => {
    for (let i = 0; i < count; i += 1) {
        store.docs.set(`${collectionPath}/tx-${i}`, { accountId: ACC, accountName: 'Checking Account', amountCents: (i + 1) * 100 });
    }
};

const txPaths = (store: FakeStore, collectionPath = OWNER_TX) =>
    [...store.docs.keys()].filter(p => p.startsWith(collectionPath + '/'));

describe('AccountService.renameAccount recovery', () => {
    let store: FakeStore;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renames with zero transactions and appends exactly one history entry', async () => {
        store = makeStore();
        const account = seedAccount(store);
        await new AccountService().renameAccount(OWNER, 'Owner User', account, 'Main Checking');

        expect(store.docs.get(ACC_PATH)?.name).toBe('Main Checking');
        const history = store.docs.get(ACC_PATH)?.nameHistory as { oldName: string; newName: string }[];
        expect(history).toHaveLength(1);
        expect(history[0].oldName).toBe('Checking Account');
        expect(history[0].newName).toBe('Main Checking');
    });

    it('updates 801 transactions across 3 batches then commits the account last', async () => {
        store = makeStore();
        const account = seedAccount(store);
        seedTransactions(store, 801);

        await new AccountService().renameAccount(OWNER, 'Owner User', account, 'Main Checking');

        expect(txPaths(store)).toHaveLength(801);
        const names = new Set(txPaths(store).map(p => store.docs.get(p)?.accountName));
        expect([...names]).toEqual(['Main Checking']);
        expect(store.docs.get(ACC_PATH)?.name).toBe('Main Checking');
        const history = store.docs.get(ACC_PATH)?.nameHistory as unknown[];
        expect(history).toHaveLength(1);
    });

    it('a failing middle batch leaves the account unchanged; a fresh client retry completes it', async () => {
        // 801 tx → first two owner batches commit, third rejects (commit #3).
        // The account document must still show the original name with empty history.
        store = makeStore([3]);
        const account = seedAccount(store);
        seedTransactions(store, 801);

        await expect(
            new AccountService().renameAccount(OWNER, 'Owner User', account, 'Main Checking')
        ).rejects.toThrow('Failed to rename account');

        expect(store.docs.get(ACC_PATH)?.name).toBe('Checking Account');
        expect(store.docs.get(ACC_PATH)?.nameHistory).toEqual([]);
        // Transactions 0-799 got updated; 800 remains stale.
        const stale = txPaths(store).filter(p => store.docs.get(p)?.accountName !== 'Main Checking');
        expect(stale).toEqual([`${OWNER_TX}/tx-800`]);

        // Retry via a FRESH service instance (models close/reopen/reload).
        await new AccountService().renameAccount(OWNER, 'Owner User', account, 'Main Checking');

        expect(store.docs.get(ACC_PATH)?.name).toBe('Main Checking');
        const history = store.docs.get(ACC_PATH)?.nameHistory as { oldName: string; newName: string }[];
        expect(history).toHaveLength(1);
        expect(history[0].oldName).toBe('Checking Account');
        expect(history[0].newName).toBe('Main Checking');
        for (const p of txPaths(store)) {
            expect(store.docs.get(p)?.accountName).toBe('Main Checking');
        }
    });

    it('after a failure, retrying with a different name also works', async () => {
        store = makeStore([3]);
        const account = seedAccount(store);
        seedTransactions(store, 801);

        await expect(
            new AccountService().renameAccount(OWNER, 'Owner User', account, 'Main Checking')
        ).rejects.toThrow();

        // User changes their mind and picks another name.
        await new AccountService().renameAccount(OWNER, 'Owner User', account, 'Everyday Checking');
        expect(store.docs.get(ACC_PATH)?.name).toBe('Everyday Checking');
        const history = store.docs.get(ACC_PATH)?.nameHistory as { oldName: string; newName: string }[];
        expect(history).toHaveLength(1);
        expect(history[0].newName).toBe('Everyday Checking');
        for (const p of txPaths(store)) {
            expect(store.docs.get(p)?.accountName).toBe('Everyday Checking');
        }
    });

    it('shared accounts: a failing spouse sync batch also leaves the account unchanged', async () => {
        const shared = makeAccount({ shares: { 'spouse-1': 'read' } });
        store = makeStore([2]); // owner tx batch (#1) ok; spouse batch (#2) rejects
        seedAccount(store, shared);
        seedTransactions(store, 1);
        seedTransactions(store, 1, SPOUSE_TX);

        await expect(
            new AccountService().renameAccount(OWNER, 'Owner User', shared, 'Main Checking')
        ).rejects.toThrow();

        expect(store.docs.get(ACC_PATH)?.name).toBe('Checking Account');
        expect(store.docs.get(ACC_PATH)?.nameHistory).toEqual([]);

        await new AccountService().renameAccount(OWNER, 'Owner User', shared, 'Main Checking');

        expect(store.docs.get(ACC_PATH)?.name).toBe('Main Checking');
        expect(store.docs.get(`${SPOUSE_TX}/tx-0`)?.accountName).toBe('Main Checking');
        for (const p of txPaths(store)) {
            expect(store.docs.get(p)?.accountName).toBe('Main Checking');
        }
        const history = store.docs.get(ACC_PATH)?.nameHistory as unknown[];
        expect(history).toHaveLength(1);
    });

    it('non-owners are rejected and amounts are never touched by rename', async () => {
        store = makeStore();
        const account = seedAccount(store, makeAccount({ shares: { 'spouse-1': 'read' } }));
        seedTransactions(store, 1);

        await expect(
            new AccountService().renameAccount('intruder', 'Intruder', account, 'Renamed')
        ).rejects.toThrow('Permission denied');
        expect(store.docs.get(ACC_PATH)?.name).toBe('Checking Account');

        await new AccountService().renameAccount(OWNER, 'Owner User', account, 'Renamed');
        expect(store.docs.get(`${OWNER_TX}/tx-0`)?.amountCents).toBe(100);
    });
});
