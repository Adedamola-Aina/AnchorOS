// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { convertCurrencyAcrossAccounts, restoreSoftDeletedTransaction } from './FinanceOperationsApi';

const collection = vi.fn();
const doc = vi.fn();
const increment = vi.fn();
const writeBatch = vi.fn();

const mockBatch = {
  update: vi.fn(),
  set: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
};

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  doc: (...args: unknown[]) => doc(...args),
  increment: (...args: unknown[]) => increment(...args),
  writeBatch: (...args: unknown[]) => writeBatch(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'app-test-id',
}));

describe('FinanceOperationsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    writeBatch.mockReturnValue(mockBatch);
    doc.mockImplementation((...parts: unknown[]) => ({ type: 'doc', parts }));
    collection.mockImplementation((...parts: unknown[]) => ({ type: 'collection', parts }));
    increment.mockImplementation((value: number) => ({ op: 'increment', value }));
  });

  it('restores deleted transaction and updates account balance for income', async () => {
    await restoreSoftDeletedTransaction('user-1', 'tx-1', 'acc-1', 25_000, 'income');

    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(increment).toHaveBeenCalledWith(25_000);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });

  it('restores deleted transaction and subtracts account balance for expense', async () => {
    await restoreSoftDeletedTransaction('user-1', 'tx-1', 'acc-1', 25_000, 'expense');

    expect(increment).toHaveBeenCalledWith(-25_000);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });

  it('creates linked conversion entries and updates both account balances', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-16T12:00:00.000Z'));
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('link-123');

    const fromAcc = {
      id: 'acc-usd',
      name: 'USD Wallet',
      currency: 'USD',
      ownerId: 'owner-a',
    };
    const toAcc = {
      id: 'acc-ngn',
      name: 'NGN Wallet',
      currency: 'NGN',
      ownerId: 'owner-b',
    };

    await convertCurrencyAcrossAccounts('actor-1', fromAcc, toAcc, 10_000, 1.5);

    expect(mockBatch.set).toHaveBeenCalledTimes(2);
    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(increment).toHaveBeenCalledWith(-10_000);
    expect(increment).toHaveBeenCalledWith(15_000);

    const firstSet = mockBatch.set.mock.calls[0][1];
    const secondSet = mockBatch.set.mock.calls[1][1];
    expect(firstSet.linkId).toBe('link-123');
    expect(secondSet.linkId).toBe('link-123');
    expect(firstSet.date).toBe('2026-03-16T12:00:00.000Z');
    expect(secondSet.amountCents).toBe(15_000);

    vi.useRealTimers();
  });

  it('falls back to acting user as owner when account owner is missing', async () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('link-fallback');
    const fromAcc = { id: 'acc-1', name: 'Main', currency: 'USD' };
    const toAcc = { id: 'acc-2', name: 'Savings', currency: 'USD' };

    await convertCurrencyAcrossAccounts('user-acting', fromAcc, toAcc, 5000, 1);

    const firstDocArgs = mockBatch.update.mock.calls[0][0].parts;
    const secondDocArgs = mockBatch.update.mock.calls[1][0].parts;
    expect(firstDocArgs).toContain('user-acting');
    expect(secondDocArgs).toContain('user-acting');
  });
});