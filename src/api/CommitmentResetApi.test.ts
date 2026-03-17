// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetCommitmentCompletion, resetCommitmentStreak } from './CommitmentResetApi';

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

describe('CommitmentResetApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    updateDoc.mockResolvedValue(undefined);
  });

  describe('resetCommitmentCompletion', () => {
    it('updates the commitment document with completed: false', async () => {
      await resetCommitmentCompletion('user-1', 'commit-1');

      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { completed: false },
      );
    });

    it('uses the correct document path', async () => {
      await resetCommitmentCompletion('user-1', 'commit-1');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'commitments', 'commit-1',
      );
    });
  });

  describe('resetCommitmentStreak', () => {
    it('updates the commitment document with currentStreak: 0', async () => {
      await resetCommitmentStreak('user-1', 'commit-1');

      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { currentStreak: 0 },
      );
    });

    it('uses the correct document path', async () => {
      await resetCommitmentStreak('user-1', 'commit-1');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'commitments', 'commit-1',
      );
    });
  });
});
