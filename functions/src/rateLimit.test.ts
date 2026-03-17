// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
  const createAuditLog = vi.fn();
  const runTransaction = vi.fn();
  const deleteDoc = vi.fn().mockResolvedValue(undefined);

  const rateLimitRef = {
    delete: deleteDoc,
  };

  const db = {
    collection: vi.fn(() => ({
      doc: vi.fn(() => rateLimitRef),
    })),
    runTransaction: (...args: unknown[]) => runTransaction(...args),
  };

  return {
    createAuditLog,
    runTransaction,
    deleteDoc,
    db,
  };
});

vi.mock('./callable', () => ({
  secureOnCall: (handler: unknown) => handler,
}));

vi.mock('./config', () => ({
  db: mockState.db,
}));

vi.mock('./helpers', () => ({
  createAuditLog: (...args: unknown[]) => mockState.createAuditLog(...args),
}));

import { checkRateLimit, enforceRateLimit, RATE_LIMITS, resetRateLimit } from './rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-16T12:00:00.000Z'));
    mockState.createAuditLog.mockResolvedValue(undefined);
  });

  it('throws for unknown action in enforceRateLimit', async () => {
    await expect(enforceRateLimit('unknown_action', 'user-1')).rejects.toMatchObject({
      code: 'invalid-argument',
    });
  });

  it('blocks when existing blockedUntil is active', async () => {
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          data: () => ({ blockedUntil: Date.now() + 5 * 60 * 1000, attempts: [] }),
        }),
        set: vi.fn(),
      };
      return callback(tx);
    });

    await expect(enforceRateLimit('auth', 'user-1')).rejects.toMatchObject({
      code: 'resource-exhausted',
    });
    expect(mockState.createAuditLog).toHaveBeenCalledWith(
      'rate_limit_blocked',
      'user-1',
      expect.objectContaining({ action: 'auth', severity: 'high' }),
    );
  });

  it('blocks and audits when attempts exceed max', async () => {
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          data: () => ({ attempts: Array(RATE_LIMITS.auth.maxAttempts).fill(Date.now()) }),
        }),
        set: vi.fn(),
      };
      return callback(tx);
    });

    await expect(enforceRateLimit('auth', 'user-1')).rejects.toMatchObject({
      code: 'resource-exhausted',
    });
    expect(mockState.createAuditLog).toHaveBeenCalledWith(
      'rate_limit_exceeded',
      'user-1',
      expect.objectContaining({ action: 'auth', severity: 'critical' }),
    );
  });

  it('writes warning when near threshold and allows request', async () => {
    const transactionSet = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          data: () => ({ attempts: Array(4).fill(Date.now()) }),
        }),
        set: transactionSet,
      };
      return callback(tx);
    });

    await expect(enforceRateLimit('auth', 'user-1')).resolves.toBeUndefined();
    expect(mockState.createAuditLog).toHaveBeenCalledWith(
      'rate_limit_warning',
      'user-1',
      expect.objectContaining({ action: 'auth', severity: 'medium' }),
    );
    expect(transactionSet).toHaveBeenCalled();
  });

  it('throws internal error when transaction layer fails in enforceRateLimit', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockState.runTransaction.mockRejectedValue(new Error('db unavailable'));

    await expect(enforceRateLimit('auth', 'user-1')).rejects.toMatchObject({
      code: 'internal',
    });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('checkRateLimit rejects unauthenticated users', async () => {
    await expect(checkRateLimit({ auth: null, data: {} })).rejects.toMatchObject({
      code: 'unauthenticated',
    });
  });

  it('checkRateLimit validates required fields and ownership', async () => {
    await expect(checkRateLimit({ auth: { uid: 'u1' }, data: {} })).rejects.toMatchObject({
      code: 'invalid-argument',
    });
    await expect(checkRateLimit({ auth: { uid: 'u1' }, data: { action: 'auth', identifier: 'u2' } })).rejects.toMatchObject({
      code: 'permission-denied',
    });
    await expect(checkRateLimit({ auth: { uid: 'u1' }, data: { action: 'unknown', identifier: 'u1' } })).rejects.toMatchObject({
      code: 'invalid-argument',
    });
  });

  it('checkRateLimit returns blocked when blockedUntil is active', async () => {
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          data: () => ({ blockedUntil: Date.now() + 60_000, attempts: [] }),
        }),
        set: vi.fn(),
      };
      return callback(tx);
    });

    const result = await checkRateLimit({ auth: { uid: 'u1' }, data: { action: 'auth', identifier: 'u1' } });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('try again later');
  });

  it('checkRateLimit blocks when attempts exceed max and sets blockedUntil', async () => {
    const transactionSet = vi.fn();
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          data: () => ({ attempts: Array(RATE_LIMITS.auth.maxAttempts).fill(Date.now()) }),
        }),
        set: transactionSet,
      };
      return callback(tx);
    });

    const result = await checkRateLimit({ auth: { uid: 'u1' }, data: { action: 'auth', identifier: 'u1' } });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('temporarily blocked');
    expect(transactionSet).toHaveBeenCalled();
  });

  it('checkRateLimit returns allowed and remaining attempts under threshold', async () => {
    mockState.runTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        get: vi.fn().mockResolvedValue({
          data: () => ({ attempts: [Date.now()] }),
        }),
        set: vi.fn(),
      };
      return callback(tx);
    });

    const result = await checkRateLimit({ auth: { uid: 'u1' }, data: { action: 'auth', identifier: 'u1' } });
    expect(result.allowed).toBe(true);
    expect(result.remainingAttempts).toBe(RATE_LIMITS.auth.maxAttempts - 2);
  });

  it('checkRateLimit throws internal error when transaction fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mockState.runTransaction.mockRejectedValue(new Error('boom'));

    await expect(checkRateLimit({ auth: { uid: 'u1' }, data: { action: 'auth', identifier: 'u1' } })).rejects.toMatchObject({
      code: 'internal',
    });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('resetRateLimit validates auth, input and ownership', async () => {
    await expect(resetRateLimit({ auth: null, data: {} })).rejects.toMatchObject({ code: 'unauthenticated' });
    await expect(resetRateLimit({ auth: { uid: 'u1' }, data: {} })).rejects.toMatchObject({ code: 'invalid-argument' });
    await expect(resetRateLimit({ auth: { uid: 'u1' }, data: { action: 'unknown', identifier: 'u1' } })).rejects.toMatchObject({ code: 'invalid-argument' });
    await expect(resetRateLimit({ auth: { uid: 'u1' }, data: { action: 'auth', identifier: 'u2' } })).rejects.toMatchObject({ code: 'permission-denied' });
  });

  it('resetRateLimit deletes key and returns success', async () => {
    const result = await resetRateLimit({
      auth: { uid: 'u1' },
      data: { action: 'auth', identifier: 'u1' },
    });

    expect(mockState.deleteDoc).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });
});