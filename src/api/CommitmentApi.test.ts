// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCommitment,
  toggleCommitmentCompletion,
  deleteCommitment,
  updateCommitment,
} from './CommitmentApi';

const addDoc = vi.fn();
const collection = vi.fn();
const deleteDoc = vi.fn();
const doc = vi.fn();
const runTransaction = vi.fn();
const serverTimestamp = vi.fn(() => 'server-ts');
const updateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => addDoc(...args),
  collection: (...args: unknown[]) => collection(...args),
  deleteDoc: (...args: unknown[]) => deleteDoc(...args),
  doc: (...args: unknown[]) => doc(...args),
  runTransaction: (...args: unknown[]) => runTransaction(...args),
  serverTimestamp: () => serverTimestamp(),
  updateDoc: (...args: unknown[]) => updateDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('CommitmentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    doc.mockImplementation((...args: unknown[]) => ({ type: 'doc', args }));
    addDoc.mockResolvedValue({ id: 'new-commitment-id' });
    deleteDoc.mockResolvedValue(undefined);
    updateDoc.mockResolvedValue(undefined);
    runTransaction.mockImplementation(async (_db, fn) => fn({
      get: vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({ currentStreak: 2, longestStreak: 5, completed: false }),
      }),
      update: vi.fn(),
    }));
  });

  describe('createCommitment', () => {
    it('adds a document to the commitments collection with timestamps and streak defaults', async () => {
      const task = { title: 'Morning Run', type: 'daily', completed: false };
      await createCommitment('user-1', task);

      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          title: 'Morning Run',
          type: 'daily',
          createdAt: 'server-ts',
          currentStreak: 0,
          longestStreak: 0,
        }),
      );
    });

    it('uses the correct collection path', async () => {
      await createCommitment('user-1', { title: 'Test', type: 'daily', completed: false });

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'commitments',
      );
    });

    it('returns the document reference from addDoc', async () => {
      const result = await createCommitment('user-1', { title: 'Test', type: 'daily', completed: false });
      expect(result).toEqual({ id: 'new-commitment-id' });
    });
  });

  describe('toggleCommitmentCompletion', () => {
    it('runs a Firestore transaction', async () => {
      await toggleCommitmentCompletion('user-1', 'commit-1', false);
      expect(runTransaction).toHaveBeenCalledTimes(1);
    });

    it('increments streak when completing (false → true)', async () => {
      const updateMock = vi.fn();
      runTransaction.mockImplementation(async (_db, fn) => fn({
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ currentStreak: 3, longestStreak: 5 }),
        }),
        update: updateMock,
      }));

      await toggleCommitmentCompletion('user-1', 'commit-1', false);

      expect(updateMock).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ completed: true, currentStreak: 4 }),
      );
    });

    it('updates longestStreak when new streak exceeds it', async () => {
      const updateMock = vi.fn();
      runTransaction.mockImplementation(async (_db, fn) => fn({
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ currentStreak: 10, longestStreak: 10 }),
        }),
        update: updateMock,
      }));

      await toggleCommitmentCompletion('user-1', 'commit-1', false);

      expect(updateMock).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ longestStreak: 11 }),
      );
    });

    it('decrements streak when uncompleting (true → false)', async () => {
      const updateMock = vi.fn();
      runTransaction.mockImplementation(async (_db, fn) => fn({
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ currentStreak: 3, longestStreak: 5 }),
        }),
        update: updateMock,
      }));

      await toggleCommitmentCompletion('user-1', 'commit-1', true);

      expect(updateMock).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ completed: false, currentStreak: 2 }),
      );
    });

    it('does not decrement below 0 when streak is already 0', async () => {
      const updateMock = vi.fn();
      runTransaction.mockImplementation(async (_db, fn) => fn({
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ currentStreak: 0, longestStreak: 0 }),
        }),
        update: updateMock,
      }));

      await toggleCommitmentCompletion('user-1', 'commit-1', true);

      expect(updateMock).toHaveBeenCalledWith(
        expect.any(Object),
        expect.not.objectContaining({ currentStreak: expect.any(Number) }),
      );
    });

    it('does nothing if task document does not exist', async () => {
      const updateMock = vi.fn();
      runTransaction.mockImplementation(async (_db, fn) => fn({
        get: vi.fn().mockResolvedValue({ exists: () => false }),
        update: updateMock,
      }));

      await toggleCommitmentCompletion('user-1', 'commit-1', false);

      expect(updateMock).not.toHaveBeenCalled();
    });
  });

  describe('deleteCommitment', () => {
    it('calls deleteDoc with the correct document reference', async () => {
      await deleteCommitment('user-1', 'commit-1');

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'commitments', 'commit-1',
      );
      expect(deleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCommitment', () => {
    it('calls updateDoc with provided partial updates', async () => {
      await updateCommitment('user-1', 'commit-1', { title: 'Updated Title' });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { title: 'Updated Title' },
      );
    });

    it('uses the correct document path', async () => {
      await updateCommitment('user-1', 'commit-1', { completed: true });

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'commitments', 'commit-1',
      );
    });
  });
});
