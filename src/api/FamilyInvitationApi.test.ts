// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribeToOwnerPendingInvitations } from './FamilyInvitationApi';

const collection = vi.fn();
const query = vi.fn();
const where = vi.fn();
const onSnapshot = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: unknown[]) => where(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('FamilyInvitationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    where.mockImplementation((...args: unknown[]) => ({ type: 'where', args }));
    onSnapshot.mockReturnValue(vi.fn());
  });

  describe('subscribeToOwnerPendingInvitations', () => {
    it('queries family_invitations collection at the root level', () => {
      subscribeToOwnerPendingInvitations('owner-1', vi.fn());

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'family_invitations',
      );
    });

    it('filters by ownerUid', () => {
      subscribeToOwnerPendingInvitations('owner-1', vi.fn());

      expect(where).toHaveBeenCalledWith('ownerUid', '==', 'owner-1');
    });

    it('filters for pending and awaiting_confirmation statuses', () => {
      subscribeToOwnerPendingInvitations('owner-1', vi.fn());

      expect(where).toHaveBeenCalledWith('status', 'in', ['pending', 'awaiting_confirmation']);
    });

    it('delivers mapped invitation data to the callback', () => {
      let capturedCallback = null;
      onSnapshot.mockImplementation((_q, cb) => {
        capturedCallback = cb;
        return vi.fn();
      });

      const onData = vi.fn();
      subscribeToOwnerPendingInvitations('owner-1', onData);

      capturedCallback({
        docs: [
          {
            id: 'inv-1',
            data: () => ({
              inviteeEmail: 'bob@example.com',
              status: 'pending',
              createdAt: '2026-01-01',
            }),
          },
          {
            id: 'inv-2',
            data: () => ({
              inviteeEmail: 'alice@example.com',
              status: 'awaiting_confirmation',
              createdAt: '2026-01-02',
            }),
          },
        ],
      });

      expect(onData).toHaveBeenCalledTimes(1);
      const [invitations] = onData.mock.calls[0];
      expect(invitations).toHaveLength(2);
      expect(invitations[0]).toEqual({
        id: 'inv-1',
        inviteeEmail: 'bob@example.com',
        status: 'pending',
        createdAt: '2026-01-01',
      });
    });

    it('delivers an empty array when no pending invitations exist', () => {
      let capturedCallback = null;
      onSnapshot.mockImplementation((_q, cb) => {
        capturedCallback = cb;
        return vi.fn();
      });

      const onData = vi.fn();
      subscribeToOwnerPendingInvitations('owner-1', onData);
      capturedCallback({ docs: [] });

      expect(onData).toHaveBeenCalledWith([]);
    });

    it('returns the unsubscribe function from onSnapshot', () => {
      const unsubscribe = vi.fn();
      onSnapshot.mockReturnValue(unsubscribe);

      const result = subscribeToOwnerPendingInvitations('owner-1', vi.fn());

      expect(result).toBe(unsubscribe);
    });
  });
});
