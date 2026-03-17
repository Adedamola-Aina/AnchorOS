// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  subscribeToUnreadNotifications,
  dismissNotification,
  markNotificationRead,
} from './FamilyNotificationApi';

const collection = vi.fn();
const doc = vi.fn();
const query = vi.fn();
const where = vi.fn();
const orderBy = vi.fn();
const limit = vi.fn();
const onSnapshot = vi.fn();
const updateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  doc: (...args: unknown[]) => doc(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: unknown[]) => where(...args),
  orderBy: (...args: unknown[]) => orderBy(...args),
  limit: (...args: unknown[]) => limit(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  updateDoc: (...args: unknown[]) => updateDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('FamilyNotificationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    where.mockImplementation((...args: unknown[]) => ({ type: 'where', args }));
    orderBy.mockImplementation((...args: unknown[]) => ({ type: 'orderBy', args }));
    limit.mockImplementation((...args: unknown[]) => ({ type: 'limit', args }));
    updateDoc.mockResolvedValue(undefined);
    onSnapshot.mockReturnValue(vi.fn());
  });

  describe('subscribeToUnreadNotifications', () => {
    it('queries notifications collection filtering unread and undismissed', () => {
      subscribeToUnreadNotifications('user-123', vi.fn());

      expect(where).toHaveBeenCalledWith('dismissed', '==', false);
      expect(where).toHaveBeenCalledWith('read', '==', false);
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(limit).toHaveBeenCalledWith(5);
    });

    it('invokes onData callback with mapped notification documents', () => {
      let capturedCallback: ((snap: unknown) => void) | null = null;
      onSnapshot.mockImplementation((_q: unknown, cb: (snap: unknown) => void) => {
        capturedCallback = cb;
        return vi.fn();
      });

      const onData = vi.fn();
      subscribeToUnreadNotifications('user-123', onData);

      capturedCallback?.({
        docs: [
          { id: 'notif-1', data: () => ({ type: 'share', title: 'Alice shared an account', read: false, dismissed: false, actorUid: 'u2', actorName: 'Alice', message: 'msg', createdAt: { seconds: 0 } }) },
          { id: 'notif-2', data: () => ({ type: 'transaction', title: 'New transaction', read: false, dismissed: false, actorUid: 'u3', actorName: 'Bob', message: 'msg2', createdAt: { seconds: 1 } }) },
        ],
      });

      expect(onData).toHaveBeenCalledTimes(1);
      const result = onData.mock.calls[0][0] as { id: string; title: string }[];
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'notif-1', title: 'Alice shared an account' });
      expect(result[1]).toMatchObject({ id: 'notif-2', title: 'New transaction' });
    });

    it('returns unsubscribe function from onSnapshot', () => {
      const unsubscribe = vi.fn();
      onSnapshot.mockReturnValue(unsubscribe);

      const result = subscribeToUnreadNotifications('user-123', vi.fn());

      expect(result).toBe(unsubscribe);
    });

    it('scopes collection path to the correct user uid and APP_ID', () => {
      subscribeToUnreadNotifications('user-abc', vi.fn());

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts',
        'test-app-id',
        'users',
        'user-abc',
        'notifications',
      );
    });
  });

  describe('dismissNotification', () => {
    it('calls updateDoc with dismissed: true', async () => {
      await dismissNotification('user-123', 'notif-456');

      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { dismissed: true });
    });

    it('references the correct notification document path', async () => {
      await dismissNotification('user-123', 'notif-456');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts',
        'test-app-id',
        'users',
        'user-123',
        'notifications',
        'notif-456',
      );
    });
  });

  describe('markNotificationRead', () => {
    it('calls updateDoc with read: true', async () => {
      await markNotificationRead('user-123', 'notif-789');

      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { read: true });
    });

    it('references the correct notification document path', async () => {
      await markNotificationRead('user-123', 'notif-789');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts',
        'test-app-id',
        'users',
        'user-123',
        'notifications',
        'notif-789',
      );
    });

    it('resolves without throwing on success', async () => {
      await expect(markNotificationRead('user-123', 'notif-789')).resolves.toBeUndefined();
    });
  });
});
