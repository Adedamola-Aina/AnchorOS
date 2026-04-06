import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetUser = vi.fn();
const mockGet = vi.fn();
const mockUpdate = vi.fn();
const mockCreateAuditLog = vi.fn();
const mockEnforceRateLimit = vi.fn();

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ getUser: mockGetUser }),
}));
vi.mock('./helpers', () => ({
  createAuditLog: (...args: unknown[]) => mockCreateAuditLog(...args),
}));
vi.mock('./rateLimit', () => ({
  enforceRateLimit: (...args: unknown[]) => mockEnforceRateLimit(...args),
}));
vi.mock('./config', () => ({
  db: {
    collection: () => ({
      doc: () => ({
        collection: () => ({
          doc: () => ({
            get: mockGet,
            update: mockUpdate,
          }),
        }),
      }),
    }),
  },
  APP_ID: 'anchor-os',
}));
vi.mock('./callable', () => ({
  secureOnCall: (handler: Function) => handler,
}));

import { syncEmailToProfile } from './emailChangeSync';

describe('syncEmailToProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnforceRateLimit.mockResolvedValue(undefined);
    mockCreateAuditLog.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue(undefined);
  });

  it('throws unauthenticated when no auth', async () => {
    await expect(syncEmailToProfile({ auth: null, data: {} } as any)).rejects.toThrow('Authentication required');
  });

  it('syncs email from auth to profile', async () => {
    mockGetUser.mockResolvedValue({ email: 'new@example.com' });
    mockGet.mockResolvedValue({ exists: true, data: () => ({ email: 'old@example.com' }) });

    const result = await syncEmailToProfile({ auth: { uid: 'u1' }, data: {} } as any);

    expect(mockUpdate).toHaveBeenCalledWith({ email: 'new@example.com' });
    expect(mockCreateAuditLog).toHaveBeenCalledWith('email_changed', 'u1', {
      oldEmail: 'old@example.com',
      newEmail: 'new@example.com',
    });
    expect(result).toEqual({ success: true, oldEmail: 'old@example.com', newEmail: 'new@example.com' });
  });

  it('returns early if email is already in sync', async () => {
    mockGetUser.mockResolvedValue({ email: 'same@example.com' });
    mockGet.mockResolvedValue({ exists: true, data: () => ({ email: 'same@example.com' }) });

    const result = await syncEmailToProfile({ auth: { uid: 'u1' }, data: {} } as any);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: 'Email already in sync' });
  });

  it('throws if auth user has no email', async () => {
    mockGetUser.mockResolvedValue({ email: null });

    await expect(
      syncEmailToProfile({ auth: { uid: 'u1' }, data: {} } as any)
    ).rejects.toThrow('No email found');
  });
});
