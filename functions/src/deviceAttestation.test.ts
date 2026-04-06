import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateAuditLog = vi.fn();
const mockEnforceRateLimit = vi.fn();

vi.mock('./helpers', () => ({
  createAuditLog: (...args: unknown[]) => mockCreateAuditLog(...args),
}));
vi.mock('./rateLimit', () => ({
  enforceRateLimit: (...args: unknown[]) => mockEnforceRateLimit(...args),
}));
vi.mock('./callable', () => ({
  secureOnCall: (handler: Function) => handler,
}));

import { verifyDeviceAttestation } from './deviceAttestation';

describe('verifyDeviceAttestation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnforceRateLimit.mockResolvedValue(undefined);
    mockCreateAuditLog.mockResolvedValue(undefined);
  });

  it('throws unauthenticated when no auth', async () => {
    await expect(
      verifyDeviceAttestation({ auth: null, data: {} } as any)
    ).rejects.toThrow('Authentication required');
  });

  it('returns trusted for authenticated request', async () => {
    const result = await verifyDeviceAttestation({
      auth: { uid: 'u1' },
      data: {},
    } as any);

    expect(result).toEqual({ trusted: true, method: 'appcheck' });
    expect(mockCreateAuditLog).toHaveBeenCalledWith('device_attestation_verified', 'u1', {
      method: 'appcheck',
      trusted: true,
    });
  });

  it('enforces rate limit', async () => {
    await verifyDeviceAttestation({
      auth: { uid: 'u1' },
      data: {},
    } as any);

    expect(mockEnforceRateLimit).toHaveBeenCalledWith('deviceAttestation', 'u1');
  });
});
