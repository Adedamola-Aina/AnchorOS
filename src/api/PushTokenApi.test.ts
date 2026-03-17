// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteStoredPushToken, upsertPushToken } from './PushTokenApi';

const deleteDoc = vi.fn();
const doc = vi.fn();
const serverTimestamp = vi.fn(() => 'server-ts');
const setDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  deleteDoc: (...args: unknown[]) => deleteDoc(...args),
  doc: (...args: unknown[]) => doc(...args),
  serverTimestamp: () => serverTimestamp(),
  setDoc: (...args: unknown[]) => setDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('PushTokenApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    deleteDoc.mockResolvedValue(undefined);
    setDoc.mockResolvedValue(undefined);
  });

  describe('deleteStoredPushToken', () => {
    it('calls deleteDoc on the fcmTokens document', async () => {
      await deleteStoredPushToken('user-1', 'token-abc');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'fcmTokens', 'token-abc',
      );
      expect(deleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertPushToken', () => {
    it('calls setDoc with token data and merge: true', async () => {
      await upsertPushToken('user-1', 'token-xyz', 'Mozilla/5.0');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          token: 'token-xyz',
          userAgent: 'Mozilla/5.0',
          lastSeen: 'server-ts',
        }),
        { merge: true },
      );
    });

    it('defaults platform to "web" when not specified', async () => {
      await upsertPushToken('user-1', 'token-xyz', 'Mozilla/5.0');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ platform: 'web' }),
        expect.anything(),
      );
    });

    it('uses the provided platform when specified', async () => {
      await upsertPushToken('user-1', 'token-xyz', 'Dart/3.0', 'android');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ platform: 'android' }),
        expect.anything(),
      );
    });

    it('uses the correct document path', async () => {
      await upsertPushToken('user-1', 'token-xyz', 'agent');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'fcmTokens', 'token-xyz',
      );
    });
  });
});
