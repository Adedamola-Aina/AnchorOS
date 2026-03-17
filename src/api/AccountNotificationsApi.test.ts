// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  markAccountNotificationAsRead,
  markAllAccountNotificationsAsRead,
  subscribeToAccountNotifications,
} from './AccountNotificationsApi';

const collection = vi.fn();
const doc = vi.fn();
const query = vi.fn();
const where = vi.fn();
const orderBy = vi.fn();
const limit = vi.fn();
const onSnapshot = vi.fn();
const updateDoc = vi.fn();
const writeBatch = vi.fn();

const batch = {
  update: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
};

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  doc: (...args: unknown[]) => doc(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: unknown[]) => where(...args),
  orderBy: (...args: unknown[]) => orderBy(...args),
  limit: (...args: unknown[]) => limit(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  updateDoc: (...args: unknown[]) => updateDoc(...args),
  writeBatch: (...args: unknown[]) => writeBatch(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'app-test-id',
}));

describe('AccountNotificationsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    where.mockImplementation((...args: unknown[]) => ({ type: 'where', args }));
    orderBy.mockImplementation((...args: unknown[]) => ({ type: 'orderBy', args }));
    limit.mockImplementation((...args: unknown[]) => ({ type: 'limit', args }));
    writeBatch.mockReturnValue(batch);
    onSnapshot.mockReturnValue(vi.fn());
  });

  it('subscribes with account filter when accountId is provided', () => {
    let callback: ((snap: unknown) => void) | null = null;
    onSnapshot.mockImplementation((_q: unknown, cb: (snap: unknown) => void) => {
      callback = cb;
      return vi.fn();
    });

    const onData = vi.fn();
    subscribeToAccountNotifications('user-1', 'acc-1', onData);

    expect(where).toHaveBeenCalledWith('accountId', '==', 'acc-1');
    expect(limit).toHaveBeenCalledWith(20);

    callback?.({
      docs: [{ id: 'n1', data: () => ({ title: 'Alert', read: false }) }],
    });
    expect(onData).toHaveBeenCalledWith([{ id: 'n1', title: 'Alert', read: false }]);
  });

  it('subscribes without account filter when accountId is undefined', () => {
    subscribeToAccountNotifications('user-1', undefined, vi.fn());

    expect(where).not.toHaveBeenCalled();
    expect(limit).toHaveBeenCalledWith(50);
  });

  it('marks one notification as read', async () => {
    updateDoc.mockResolvedValue(undefined);

    await markAccountNotificationAsRead('user-1', 'notif-1');

    expect(updateDoc).toHaveBeenCalledWith(
      expect.any(Object),
      { read: true },
    );
  });

  it('marks all unread notifications as read', async () => {
    await markAllAccountNotificationsAsRead('user-1', [
      { id: 'n1', read: false },
      { id: 'n2', read: true },
      { id: 'n3', read: false },
    ]);

    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it('skips batch commit when all notifications are already read', async () => {
    await markAllAccountNotificationsAsRead('user-1', [
      { id: 'n1', read: true },
      { id: 'n2', read: true },
    ]);

    expect(batch.update).not.toHaveBeenCalled();
    expect(batch.commit).not.toHaveBeenCalled();
  });
});