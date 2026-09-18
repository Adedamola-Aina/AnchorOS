/**
 * TransactionService.addTransaction — server-side idempotency (FI-06).
 *
 * The offline queue is at-least-once: a queued write can be flushed, time out
 * or be woken by the service worker, and flushed again. The idempotency key
 * (`requestId`) is the transaction document id, and the write runs in a
 * transaction that refuses to apply a key whose document already exists — so a
 * replay can never double-apply the balance delta.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AnchorAccount } from '../types';
import type { CreateTransactionPayload } from './financeTypes';

const mocks = vi.hoisted(() => ({
    runTransaction: vi.fn(),
    writeBatch: vi.fn(),
    batchSet: vi.fn(),
    batchUpdate: vi.fn(),
    batchCommit: vi.fn(),
    txGet: vi.fn(),
    txSet: vi.fn(),
    txUpdate: vi.fn(),
    increment: vi.fn((value: number) => ({ _increment: value })),
    auditCreated: vi.fn(),
    ledgerRecord: vi.fn(),
}));

vi.mock('../utils/secureDb', () => ({
    collection: (_db: unknown, ...paths: string[]) => ({ path: paths.join('/'), kind: 'collection' }),
    doc: (...args: any[]) => {
        const first = args[0];
        if (first && typeof first === 'object' && typeof first.path === 'string') {
            return { path: `${first.path}/${args[1]}` };
        }
        return { path: args.slice(1).join('/') };
    },
    increment: mocks.increment,
    writeBatch: (...args: unknown[]) => mocks.writeBatch(...args),
    runTransaction: (...args: unknown[]) => mocks.runTransaction(...args),
}));
vi.mock('../config/firebase', () => ({ db: {}, APP_ID: 'anchor-os-test' }));
vi.mock('./AuditService', () => ({
    auditFinance: { transactionCreated: mocks.auditCreated, operationFailed: vi.fn(), operationSucceeded: vi.fn() },
}));
vi.mock('./LedgerService', () => ({ LedgerService: { record: mocks.ledgerRecord } }));
vi.mock('../features/finance/utils/permissions', () => ({
    canAddTransaction: () => true,
    canDeleteTransaction: () => true,
}));
vi.mock('./serverRateLimit', () => ({ enforceServerRateLimit: vi.fn() }));
vi.mock('../utils/rateLimit', () => ({
    checkRateLimit: () => ({ isLimited: false }),
    formatRetryTime: () => '',
    RATE_LIMIT_CONFIGS: {},
}));

import { TransactionService } from './TransactionService';

const USER = 'u-1';
const ACCOUNT = 'acc-1';
const KEY = 'req-1';

const accounts = [{ id: ACCOUNT, ownerId: USER, scope: 'personal', name: 'Checking', currency: 'USD' }] as unknown as AnchorAccount[];

const payload = (overrides: Partial<CreateTransactionPayload> = {}): CreateTransactionPayload => ({
    title: 'Groceries',
    amountCents: 15_000,
    type: 'expense',
    category: 'Food',
    accountId: ACCOUNT,
    currency: 'USD',
    scope: 'personal',
    requestId: KEY,
    ...overrides,
});

const txDocPath = (id: string) => `artifacts/anchor-os-test/users/${USER}/finance/${id}`;
const accountDocPath = `artifacts/anchor-os-test/users/${USER}/accounts/${ACCOUNT}`;

beforeEach(() => {
    vi.clearAllMocks();
    mocks.writeBatch.mockImplementation(() => ({
        set: mocks.batchSet, update: mocks.batchUpdate, commit: mocks.batchCommit,
    }));
    mocks.batchCommit.mockResolvedValue(undefined);
    mocks.runTransaction.mockImplementation(async (_db: unknown, fn: (tx: unknown) => unknown) =>
        fn({ get: mocks.txGet, set: mocks.txSet, update: mocks.txUpdate, delete: vi.fn() }));
});

describe('addTransaction idempotency (FI-06)', () => {
    it('applies the write and the balance delta once when the key is new', async () => {
        mocks.txGet.mockResolvedValue({ exists: () => false });

        await new TransactionService({} as never).addTransaction(USER, payload(), accounts);

        // The key is the document id, so a replay targets the same document.
        expect(mocks.txSet).toHaveBeenCalledWith(
            expect.objectContaining({ path: txDocPath(KEY) }),
            expect.objectContaining({ title: 'Groceries', requestId: KEY }),
        );
        expect(mocks.txUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ path: accountDocPath }),
            expect.objectContaining({ balanceCents: { _increment: -15_000 } }),
        );
        expect(mocks.auditCreated).toHaveBeenCalled();
    });

    it('is a no-op when the key was already applied', async () => {
        mocks.txGet.mockResolvedValue({ exists: () => true });

        await new TransactionService({} as never).addTransaction(USER, payload(), accounts);

        // No second document and, critically, no second balance delta.
        expect(mocks.txSet).not.toHaveBeenCalled();
        expect(mocks.txUpdate).not.toHaveBeenCalled();
        expect(mocks.auditCreated).not.toHaveBeenCalled();
        expect(mocks.ledgerRecord).not.toHaveBeenCalled();
    });

    it('checks the idempotency key before writing anything', async () => {
        mocks.txGet.mockResolvedValue({ exists: () => false });

        await new TransactionService({} as never).addTransaction(USER, payload({ requestId: 'req-xyz' }), accounts);

        expect(mocks.txGet).toHaveBeenCalledWith(expect.objectContaining({ path: txDocPath('req-xyz') }));
    });

    it('applies distinct keys as distinct writes', async () => {
        mocks.txGet.mockResolvedValue({ exists: () => false });

        const service = new TransactionService({} as never);
        await service.addTransaction(USER, payload({ requestId: 'req-a' }), accounts);
        await service.addTransaction(USER, payload({ requestId: 'req-b' }), accounts);

        const paths = mocks.txSet.mock.calls.map((call) => call[0].path);
        expect(paths).toEqual([txDocPath('req-a'), txDocPath('req-b')]);
    });

    it('applies exactly once across a simulated timeout-retry sequence', async () => {
        const service = new TransactionService({} as never);

        // Attempt 1 — the write commits, but the client times out and never sees it.
        mocks.txGet.mockResolvedValueOnce({ exists: () => false });
        await service.addTransaction(USER, payload(), accounts);

        // Retry with the SAME key (offline flush / service-worker wake).
        mocks.txGet.mockResolvedValueOnce({ exists: () => true });
        await service.addTransaction(USER, payload(), accounts);

        expect(mocks.txSet).toHaveBeenCalledTimes(1);
        expect(mocks.txUpdate).toHaveBeenCalledTimes(1);
        expect(mocks.increment).toHaveBeenCalledTimes(1);
    });

    it('keeps the legacy batch path when no key is supplied', async () => {
        await new TransactionService({} as never).addTransaction(USER, payload({ requestId: undefined }), accounts);

        expect(mocks.runTransaction).not.toHaveBeenCalled();
        expect(mocks.batchCommit).toHaveBeenCalled();
        expect(mocks.batchUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ path: accountDocPath }),
            expect.objectContaining({ balanceCents: { _increment: -15_000 } }),
        );
    });
});
