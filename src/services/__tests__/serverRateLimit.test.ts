import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnchorError } from '../../utils/error';
import { enforceServerRateLimit } from '../serverRateLimit';

const { mockHttpsCallable, mockCallable } = vi.hoisted(() => {
  const callable = vi.fn();
  return {
    mockHttpsCallable: vi.fn(() => callable),
    mockCallable: callable,
  };
});

vi.mock('firebase/functions', () => ({
  httpsCallable: mockHttpsCallable,
}));

vi.mock('../../config/firebase', () => ({
  functions: {},
}));

describe('enforceServerRateLimit', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    Object.defineProperty(globalThis.navigator, 'onLine', {
      value: true,
      configurable: true,
    });
  });

  it('returns early when userId is empty', async () => {
    await expect(enforceServerRateLimit('accountCreate', '')).resolves.toBeUndefined();
    expect(mockHttpsCallable).not.toHaveBeenCalled();
  });

  it('returns early when offline', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', {
      value: false,
      configurable: true,
    });

    await expect(enforceServerRateLimit('accountCreate', 'user-1')).resolves.toBeUndefined();
    expect(mockHttpsCallable).not.toHaveBeenCalled();
  });

  it('allows request when callable returns allowed=true', async () => {
    mockCallable.mockResolvedValueOnce({ data: { allowed: true } });

    await expect(enforceServerRateLimit('transactionCreate', 'user-1')).resolves.toBeUndefined();

    expect(mockHttpsCallable).toHaveBeenCalledWith({}, 'checkRateLimit');
    expect(mockCallable).toHaveBeenCalledWith({ action: 'transactionCreate', identifier: 'user-1' });
  });

  it('throws RATE_LIMIT with default reason when blocked', async () => {
    mockCallable.mockResolvedValueOnce({ data: { allowed: false } });

    await expect(enforceServerRateLimit('transactionCreate', 'user-1')).rejects.toMatchObject({
      category: 'RATE_LIMIT',
      message: 'Too many attempts. Please try again later.',
    });
  });

  it('includes retry minutes when blockedUntil is in the future', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    mockCallable.mockResolvedValueOnce({
      data: { allowed: false, reason: 'Blocked.', blockedUntil: 61_000 },
    });

    await expect(enforceServerRateLimit('accountCreate', 'user-1')).rejects.toThrow(
      'Blocked. Please try again in 1 minute(s).',
    );
  });

  it('rethrows AnchorError as-is', async () => {
    mockCallable.mockRejectedValueOnce(new AnchorError('Rate limit backend down', 'NETWORK'));

    await expect(enforceServerRateLimit('accountCreate', 'user-1')).rejects.toThrow(
      'Rate limit backend down',
    );
  });

  it('wraps unknown errors in NETWORK AnchorError', async () => {
    mockCallable.mockRejectedValueOnce(new Error('call failed'));

    await expect(enforceServerRateLimit('accountCreate', 'user-1')).rejects.toMatchObject({
      category: 'NETWORK',
      message: 'Unable to validate request limits right now. Please try again shortly.',
    });
  });
});
