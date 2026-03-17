// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateSharedPermission } from './AccountSharingApi';

const doc = vi.fn();
const updateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => doc(...args),
  updateDoc: (...args: unknown[]) => updateDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('AccountSharingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    updateDoc.mockResolvedValue(undefined);
  });

  describe('updateSharedPermission', () => {
    it('calls updateDoc with the correct permission field path', async () => {
      await updateSharedPermission('owner-1', 'acc-1', 'shared-user-1', 'read');

      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { 'sharedWith.shared-user-1.permission': 'read' },
      );
    });

    it('uses the owner account document path', async () => {
      await updateSharedPermission('owner-1', 'acc-1', 'shared-user-1', 'transact');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'owner-1', 'accounts', 'acc-1',
      );
    });

    it('supports all permission levels', async () => {
      for (const perm of ['read', 'transact', 'manage'] as const) {
        vi.clearAllMocks();
        updateDoc.mockResolvedValue(undefined);
        doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
        await updateSharedPermission('owner-1', 'acc-1', 'uid', perm);
        expect(updateDoc).toHaveBeenCalledWith(
          expect.any(Object),
          { [`sharedWith.uid.permission`]: perm },
        );
      }
    });

    it('resolves without throwing on success', async () => {
      await expect(
        updateSharedPermission('owner-1', 'acc-1', 'uid', 'manage'),
      ).resolves.toBeUndefined();
    });
  });
});
