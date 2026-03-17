import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
  const runTransaction = vi.fn();
  const claimRefFactory = vi.fn((id: string) => ({ id }));
  return {
    runTransaction,
    claimRefFactory,
  };
});

vi.mock('./config', () => ({
  APP_ID: 'app-test-id',
  db: {
    collection: () => ({
      doc: () => ({
        collection: () => ({
          doc: (id: string) => mockState.claimRefFactory(id),
        }),
      }),
    }),
    runTransaction: (...args: unknown[]) => mockState.runTransaction(...args),
  },
}));

import {
  buildReminderClaimId,
  claimReminderDeliverySlot,
  releaseReminderDeliverySlot,
} from './reminderClaim';

describe('reminderClaim transaction behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when another run owns active lease', async () => {
    const set = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback({
        get: vi.fn().mockResolvedValue({
          data: () => ({ runId: 'run-a', leaseUntilMs: 2_000 }),
        }),
        set,
      });
    });

    const result = await claimReminderDeliverySlot({
      userId: 'user-1',
      dedupeKey: 'k1',
      runId: 'run-b',
      nowMs: 1_000,
    });

    expect(result).toBe(false);
    expect(set).not.toHaveBeenCalled();
  });

  it('claims slot and writes lease metadata when allowed', async () => {
    const set = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback({
        get: vi.fn().mockResolvedValue({ data: () => ({}) }),
        set,
      });
    });

    const result = await claimReminderDeliverySlot({
      userId: 'user-1',
      dedupeKey: 'k2',
      runId: 'run-c',
      nowMs: 5_000,
      leaseMs: 90_000,
      ttlMs: 60_000,
    });

    expect(result).toBe(true);
    expect(set).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        userId: 'user-1',
        dedupeKey: 'k2',
        runId: 'run-c',
        claimedAtMs: 5_000,
        leaseUntilMs: 95_000,
        updatedAtMs: 5_000,
        expiresAt: expect.any(Date),
      }),
      { merge: true },
    );
  });

  it('release does nothing if claim document does not exist', async () => {
    const del = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback({
        get: vi.fn().mockResolvedValue({ exists: false }),
        delete: del,
      });
    });

    await releaseReminderDeliverySlot({ userId: 'user-1', dedupeKey: 'k3', runId: 'run-a' });

    expect(del).not.toHaveBeenCalled();
  });

  it('release does nothing when runId does not match', async () => {
    const del = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback({
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ runId: 'run-x' }),
        }),
        delete: del,
      });
    });

    await releaseReminderDeliverySlot({ userId: 'user-1', dedupeKey: 'k4', runId: 'run-y' });

    expect(del).not.toHaveBeenCalled();
  });

  it('release deletes claim when runId matches', async () => {
    const del = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback({
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ runId: 'run-z' }),
        }),
        delete: del,
      });
    });

    await releaseReminderDeliverySlot({ userId: 'user-1', dedupeKey: 'k5', runId: 'run-z' });

    expect(del).toHaveBeenCalledWith(expect.any(Object));
  });

  it('buildReminderClaimId remains deterministic in transaction suite', () => {
    const a = buildReminderClaimId('user-1', 'abc');
    const b = buildReminderClaimId('user-1', 'abc');
    expect(a).toBe(b);
  });
});