// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTasksForUser } from './TaskQueryApi';

const collection = vi.fn();
const getDocs = vi.fn();
const limit = vi.fn();
const orderBy = vi.fn();
const query = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  getDocs: (...args: unknown[]) => getDocs(...args),
  limit: (...args: unknown[]) => limit(...args),
  orderBy: (...args: unknown[]) => orderBy(...args),
  query: (...args: unknown[]) => query(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'test-app-id',
}));

describe('TaskQueryApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    orderBy.mockReturnValue({ type: 'orderBy' });
    limit.mockReturnValue({ type: 'limit' });
    getDocs.mockResolvedValue({ docs: [] });
  });

  describe('fetchTasksForUser', () => {
    it('queries commitments ordered by createdAt descending with limit 100', async () => {
      await fetchTasksForUser('user-1');

      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(limit).toHaveBeenCalledWith(100);
    });

    it('uses the correct collection path', async () => {
      await fetchTasksForUser('user-1');

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'artifacts', 'test-app-id', 'users', 'user-1', 'commitments',
      );
    });

    it('returns an empty array when no documents exist', async () => {
      getDocs.mockResolvedValue({ docs: [] });

      const result = await fetchTasksForUser('user-1');
      expect(result).toEqual([]);
    });

    it('maps documents to AnchorTask objects using doc id and data', async () => {
      getDocs.mockResolvedValue({
        docs: [
          {
            id: 'task-1',
            data: () => ({ title: 'Morning Run', type: 'daily', completed: false, currentStreak: 3 }),
          },
          {
            id: 'task-2',
            data: () => ({ title: 'Read', type: 'weekly', completed: true, currentStreak: 0 }),
          },
        ],
      });

      const result = await fetchTasksForUser('user-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'task-1', title: 'Morning Run', type: 'daily' });
      expect(result[1]).toMatchObject({ id: 'task-2', title: 'Read', type: 'weekly' });
    });

    it('returns a resolved array (not a Promise)', async () => {
      const result = await fetchTasksForUser('user-1');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
