// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  subscribeToSharedAccountTransactions,
  subscribeToSharedAccountDetails,
} from './SharedAccountSubscriptionsApi';

const collection = vi.fn();
const doc = vi.fn();
const onSnapshot = vi.fn();
const orderBy = vi.fn();
const query = vi.fn();
const where = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  doc: (...args: unknown[]) => doc(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  orderBy: (...args: unknown[]) => orderBy(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: unknown[]) => where(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('SharedAccountSubscriptionsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    orderBy.mockReturnValue({ type: 'orderBy' });
    where.mockReturnValue({ type: 'where' });
    onSnapshot.mockReturnValue(() => {});
  });

  describe('subscribeToSharedAccountTransactions', () => {
    it('queries the finance subcollection filtered by accountId', () => {
      const allTransactions = new Map();
      subscribeToSharedAccountTransactions(
        { id: 'account-1', ownerUid: 'owner-1' },
        allTransactions,
        vi.fn(),
      );

      expect(where).toHaveBeenCalledWith('accountId', '==', 'account-1');
      expect(orderBy).toHaveBeenCalledWith('date', 'desc');
      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'owner-1', 'finance',
      );
    });

    it('attaches accountOwnerId to each transaction from the snapshot', () => {
      const onUpdate = vi.fn();
      const allTransactions = new Map();
      onSnapshot.mockImplementation((_q, cb) => {
        cb({
          docs: [
            { id: 'tx-1', data: () => ({ amount: 100, date: '2024-01-01', accountId: 'account-1' }) },
          ],
        });
        return () => {};
      });

      subscribeToSharedAccountTransactions(
        { id: 'account-1', ownerUid: 'owner-1' },
        allTransactions,
        onUpdate,
      );

      expect(onUpdate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'tx-1', accountOwnerId: 'owner-1', amount: 100 }),
        ]),
      );
    });

    it('merges transactions from multiple accounts in the Map', () => {
      const onUpdate = vi.fn();
      const allTransactions = new Map([
        ['owner-1:other-account', [{ id: 'old-tx', amount: 50, date: '2024-01-05' }]],
      ]);
      onSnapshot.mockImplementation((_q, cb) => {
        cb({
          docs: [
            { id: 'tx-new', data: () => ({ amount: 200, date: '2024-01-10', accountId: 'account-1' }) },
          ],
        });
        return () => {};
      });

      subscribeToSharedAccountTransactions(
        { id: 'account-1', ownerUid: 'owner-1' },
        allTransactions,
        onUpdate,
      );

      const merged = onUpdate.mock.calls[0][0];
      expect(merged).toHaveLength(2);
    });

    it('returns the unsubscribe function', () => {
      const unsub = vi.fn();
      onSnapshot.mockReturnValue(unsub);
      const allTransactions = new Map();

      const result = subscribeToSharedAccountTransactions(
        { id: 'account-1', ownerUid: 'owner-1' },
        allTransactions,
        vi.fn(),
      );

      expect(result).toBe(unsub);
    });
  });

  describe('subscribeToSharedAccountDetails', () => {
    it('listens on the correct account document path', () => {
      subscribeToSharedAccountDetails({ id: 'account-1', ownerUid: 'owner-1' }, vi.fn());

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'owner-1', 'accounts', 'account-1',
      );
    });

    it('calls onUpdate with an updater that updates the matching account', () => {
      const onUpdate = vi.fn();
      const accountData = { name: 'Savings', balance: 1000 };
      onSnapshot.mockImplementation((_ref, cb) => {
        cb({
          id: 'account-1',
          exists: () => true,
          data: () => accountData,
        });
        return () => {};
      });

      subscribeToSharedAccountDetails({ id: 'account-1', ownerUid: 'owner-1' }, onUpdate);

      const updaterFn = onUpdate.mock.calls[0][0];
      const prev = [{ id: 'account-1', name: 'Old Name', balance: 500 }];
      const updated = updaterFn(prev);

      expect(updated[0]).toMatchObject({ id: 'account-1', name: 'Savings', ownerId: 'owner-1' });
    });

    it('filters out account when snapshot does not exist', () => {
      const onUpdate = vi.fn();
      onSnapshot.mockImplementation((_ref, cb) => {
        cb({ id: 'account-1', exists: () => false });
        return () => {};
      });

      subscribeToSharedAccountDetails({ id: 'account-1', ownerUid: 'owner-1' }, onUpdate);

      const updaterFn = onUpdate.mock.calls[0][0];
      const prev = [
        { id: 'account-1', name: 'Gone' },
        { id: 'account-2', name: 'Kept' },
      ];
      const result = updaterFn(prev);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('account-2');
    });
  });
});
