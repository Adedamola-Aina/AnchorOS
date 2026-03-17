// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribeToAccountActivity, createAccountActivity } from './AccountActivityApi';

const addDoc = vi.fn();
const collection = vi.fn();
const limit = vi.fn();
const onSnapshot = vi.fn();
const orderBy = vi.fn();
const query = vi.fn();

vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => addDoc(...args),
  collection: (...args: unknown[]) => collection(...args),
  limit: (...args: unknown[]) => limit(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  orderBy: (...args: unknown[]) => orderBy(...args),
  query: (...args: unknown[]) => query(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('AccountActivityApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    orderBy.mockReturnValue({ type: 'orderBy' });
    limit.mockReturnValue({ type: 'limit' });
    onSnapshot.mockReturnValue(() => {});
    addDoc.mockResolvedValue({ id: 'new-activity-id' });
  });

  describe('subscribeToAccountActivity', () => {
    it('queries with orderBy timestamp desc and a limit', () => {
      subscribeToAccountActivity('account-1', 'owner-1', 20, vi.fn(), vi.fn());

      expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(limit).toHaveBeenCalledWith(20);
    });

    it('uses the correct nested collection path', () => {
      subscribeToAccountActivity('account-1', 'owner-1', 5, vi.fn(), vi.fn());

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'owner-1',
        'accounts', 'account-1', 'activity',
      );
    });

    it('maps snapshot docs to AccountActivity objects and calls onData', () => {
      const onData = vi.fn();
      const fakeTimestamp = { toDate: () => new Date('2024-01-15') };
      onSnapshot.mockImplementation((_q, cb) => {
        cb({
          docs: [
            { id: 'act-1', data: () => ({ type: 'deposit', amount: 100, timestamp: fakeTimestamp }) },
          ],
        });
        return () => {};
      });

      subscribeToAccountActivity('account-1', 'owner-1', 10, onData, vi.fn());

      expect(onData).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'act-1', type: 'deposit', amount: 100 }),
        ]),
      );
    });

    it('calls onError when the snapshot listener fires an error', () => {
      const onError = vi.fn();
      const fakeError = new Error('permission-denied');
      onSnapshot.mockImplementation((_q, _onNext, errCb) => {
        errCb(fakeError);
        return () => {};
      });

      subscribeToAccountActivity('account-1', 'owner-1', 10, vi.fn(), onError);

      expect(onError).toHaveBeenCalledWith(fakeError);
    });

    it('returns the unsubscribe function', () => {
      const unsub = vi.fn();
      onSnapshot.mockReturnValue(unsub);

      const result = subscribeToAccountActivity('account-1', 'owner-1', 10, vi.fn(), vi.fn());
      expect(result).toBe(unsub);
    });
  });

  describe('createAccountActivity', () => {
    it('adds an activity document to the nested activity subcollection', async () => {
      const activityData = { type: 'transfer', amount: 250 };
      await createAccountActivity('account-1', 'owner-1', activityData);

      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ type: 'transfer', amount: 250 }),
      );
    });

    it('uses the correct nested collection path', async () => {
      await createAccountActivity('account-1', 'owner-1', {});

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'owner-1',
        'accounts', 'account-1', 'activity',
      );
    });
  });
});
