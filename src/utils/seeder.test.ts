import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSet = vi.fn();
const mockCommit = vi.fn(async () => undefined);
const mockWriteBatch = vi.fn(() => ({
  set: mockSet,
  commit: mockCommit,
}));

let docCounter = 0;

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((...segments: unknown[]) => ({
    __type: 'collection',
    path: segments.filter((segment) => typeof segment === 'string').join('/'),
  })),
  doc: vi.fn((first: unknown, ...rest: unknown[]) => {
    if (typeof first === 'object' && first !== null && (first as { __type?: string }).__type === 'collection') {
      if (rest.length === 1 && typeof rest[0] === 'string') {
        return { id: rest[0], path: `${(first as { path: string }).path}/${rest[0]}` };
      }
      docCounter += 1;
      return { id: `auto-${docCounter}`, path: `${(first as { path: string }).path}/auto-${docCounter}` };
    }

    const stringParts = [first, ...rest].filter((part) => typeof part === 'string') as string[];
    const id = stringParts[stringParts.length - 1] || `doc-${++docCounter}`;
    return { id, path: stringParts.join('/') };
  }),
  writeBatch: (...args: unknown[]) => mockWriteBatch(...args),
  serverTimestamp: vi.fn(() => ({ __serverTimestamp: true })),
  getDoc: vi
    .fn()
    .mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ familyMode: true }),
    })
    .mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ spouseId: 'spouse-1' }),
    }),
}));

vi.mock('../config/firebase', () => ({
  db: {},
  APP_ID: 'anchor-os',
}));

vi.mock('./seederData', () => ({
  TITLES: ['Groceries', 'Transport'],
  ACCOUNT_NAMES: ['Checking', 'Savings', 'Wallet', 'Travel', 'Family'],
  TASK_TITLES: ['Workout', 'Read'],
  CATEGORIES: ['Food', 'Transport', 'Bills', 'Misc'],
  DOMAINS: ['health', 'finance'],
  ACCOUNT_COLORS: ['#111111', '#222222', '#333333', '#444444', '#555555'],
  randomDate: vi.fn(() => new Date('2026-01-01T00:00:00.000Z')),
  randomItem: vi.fn((items: unknown[]) => items[0]),
  secureRandomInt: vi.fn((max: number) => (max > 10 ? 50 : 1)),
}));

import { seedData } from './seeder';

describe('seedData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    docCounter = 0;
  });

  it('throws when user id is missing', async () => {
    await expect(seedData('')).rejects.toThrow('User ID required');
  });

  it('creates seeded data and commits batched writes', async () => {
    const result = await seedData('user-1');

    expect(result).toBe(true);
    expect(mockWriteBatch).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalled();
    expect(mockCommit).toHaveBeenCalled();
  });
});
