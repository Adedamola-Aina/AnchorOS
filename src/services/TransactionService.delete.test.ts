/**
 * TransactionService.deleteTransaction — reversal authority (FI-05).
 *
 * The balance reversal must come from the PERSISTED document inside the
 * transaction, not from the caller's client-memory snapshot: a stale copy moves
 * the balance by the wrong amount, and a row already deleted elsewhere must not
 * move it at all. These tests pin both properties deterministically.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AnchorAccount, AnchorTransaction } from '../types';

const mocks = vi.hoisted(() => ({
    runTransaction: vi.fn(),
    txGet: vi.fn(),
    txUpdate: vi.fn(),
    increment: vi.fn((value: number) => ({ _increment: value })),
    auditDeleted: vi.fn(),
    ledgerRecord: vi.fn(),
}));

vi.mock('../utils/secureDb', () => ({
    doc: (_db: unknown, ...paths: string[]) => ({ path: paths.join('/') }),
    increment: mocks.increment,
    writeBatch: vi.fn(() => ({ set: vi.fn(), update: vi.fn(), commit: vi.fn(async () => undefined) })),
    runTransaction: (...args: unknown[]) => mocks.runTransaction(...args),
}));
vi.mock('../config/firebase', () => ({ db: {}, APP_ID: 'anchor-os-test' }));
vi.mock('./AuditService', () => ({
    auditFinance: { transactionDeleted: mocks.auditDeleted, operationFailed: vi.fn(), operationSucceeded: vi.fn() },
}));
vi.mock('./LedgerService', () => ({ LedgerService: { record: mocks.ledgerRecord } }));
vi.mock('../features/finance/utils/permissions', () => ({
    canDeleteTransaction: () => true,
    canAddTransaction: () => true,
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
const TX = 'tx-1';

const accounts = [{ id: ACCOUNT, ownerId: USER, scope: 'personal', name: 'Checking' }] as unknown as AnchorAccount[];

/** The client-memory copy is stale: it says 999. */
const staleTransactions = [
    { id: TX, accountId: ACCOUNT, amountCents: 999, type: 'income', isSoftDeleted: false },
] as unknown as AnchorTransaction[];

beforeEach(() => {
    vi.clearAllMocks();
    mocks.runTransaction.mockImplementation(async (_db: unknown, fn: (tx: unknown) => unknown) =>
        fn({ get: mocks.txGet, update: mocks.txUpdate, set: vi.fn(), delete: vi.fn() }));
});

describe('deleteTransaction reversal authority (FI-05)', () => {
    it('reverses the persisted amount, not the stale client snapshot', async () => {
        mocks.txGet.mockResolvedValue({
            exists: () => true,
            data: () => ({ id: TX, accountId: ACCOUNT, amountCents: 100_000, type: 'income', isSoftDeleted: false }),
        });

        await new TransactionService({} as never).deleteTransaction(USER, TX, ACCOUNT, accounts, staleTransactions);

        expect(mocks.txUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ path: `artifacts/anchor-os-test/users/${USER}/finance/${TX}` }),
            expect.objectContaining({ isSoftDeleted: true, deletedBy: USER }),
        );

        // Reverse the PERSISTED income (100000), never the stale 999.
        expect(mocks.txUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ path: `artifacts/anchor-os-test/users/${USER}/accounts/${ACCOUNT}` }),
            expect.objectContaining({ balanceCents: { _increment: -100_000 } }),
        );
        expect(mocks.increment).toHaveBeenCalledWith(-100_000);
    });

    it('reverses an expense in the opposite direction from the persisted row', async () => {
        mocks.txGet.mockResolvedValue({
            exists: () => true,
            data: () => ({ id: TX, accountId: ACCOUNT, amountCents: 50_000, type: 'expense', isSoftDeleted: false }),
        });

        await new TransactionService({} as never).deleteTransaction(USER, TX, ACCOUNT, accounts, staleTransactions);

        expect(mocks.increment).toHaveBeenCalledWith(50_000);
    });

    it('is an idempotent no-op when the row was already deleted elsewhere', async () => {
        mocks.txGet.mockResolvedValue({
            exists: () => true,
            data: () => ({ id: TX, accountId: ACCOUNT, amountCents: 100_000, type: 'income', isSoftDeleted: true }),
        });

        await new TransactionService({} as never).deleteTransaction(USER, TX, ACCOUNT, accounts, staleTransactions);

        expect(mocks.txUpdate).not.toHaveBeenCalled();
        expect(mocks.ledgerRecord).not.toHaveBeenCalled();
    });

    it('fails when the persisted row is gone', async () => {
        mocks.txGet.mockResolvedValue({ exists: () => false, data: () => undefined });

        await expect(
            new TransactionService({} as never).deleteTransaction(USER, TX, ACCOUNT, accounts, staleTransactions),
        ).rejects.toThrow('Transaction not found');

        expect(mocks.txUpdate).not.toHaveBeenCalled();
    });
});
