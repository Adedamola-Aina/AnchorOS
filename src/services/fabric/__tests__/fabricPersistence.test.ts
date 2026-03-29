import { beforeEach, describe, expect, it, vi } from 'vitest';

const queryCollection = vi.fn();
const getDocument = vi.fn();
const setDocument = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    queryCollection: (...args: unknown[]) => queryCollection(...args),
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
  },
}));

vi.mock('../../../config/firebase', () => ({
  APP_ID: 'anchor-os',
  db: {},
}));

const getDocs = vi.fn();
const collection = vi.fn();
const where = vi.fn();
const query = vi.fn((_collection: unknown, _where: unknown) => ({}));

vi.mock('firebase/firestore', () => ({
  getDocs: (...args: unknown[]) => getDocs(...args),
  collection: (...args: unknown[]) => collection(...args),
  where: (...args: unknown[]) => where(...args),
  query: (...args: unknown[]) => query(...args),
}));

import {
  clearFabricData,
  loadDismissedPredictionIds,
  loadFabricActivity,
} from '../fabricPersistence';

describe('fabricPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryCollection.mockResolvedValue([]);
    getDocument.mockResolvedValue(null);
    setDocument.mockResolvedValue(undefined);
    getDocs.mockResolvedValue({ docs: [] });
  });

  it('falls back to empty recurring list when recurring query fails', async () => {
    queryCollection.mockResolvedValueOnce([{ id: 'tx-1' }]);
    queryCollection.mockResolvedValueOnce([{ id: 'task-1' }]);
    queryCollection.mockResolvedValueOnce([{ id: 'acc-1' }]);
    getDocs.mockRejectedValueOnce(new Error('recurring unavailable'));

    const result = await loadFabricActivity('user-1');

    expect(result.transactions).toHaveLength(1);
    expect(result.commitments).toHaveLength(1);
    expect(result.accounts).toHaveLength(1);
    expect(result.recurring).toEqual([]);
  });

  it('uses empty dismissed ids when state is absent and clears data safely', async () => {
    const dismissed = await loadDismissedPredictionIds('user-1');
    expect(dismissed.size).toBe(0);

    await clearFabricData('user-1', true, '2026-03-29T00:00:00.000Z');
    expect(setDocument).toHaveBeenCalledTimes(3);
  });
});
