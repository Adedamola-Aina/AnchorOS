import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDelete = vi.fn();
const mockCreateAuditLog = vi.fn();
const mockEnforceRateLimit = vi.fn();
const mockRevokeRefreshTokens = vi.fn();

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ revokeRefreshTokens: mockRevokeRefreshTokens }),
}));
vi.mock('./helpers', () => ({
  createAuditLog: (...args: unknown[]) => mockCreateAuditLog(...args),
}));
vi.mock('./rateLimit', () => ({
  enforceRateLimit: (...args: unknown[]) => mockEnforceRateLimit(...args),
}));

const mockColOrderBy = vi.fn();
const mockColDoc = vi.fn();

vi.mock('./config', () => ({
  db: {
    collection: () => ({
      doc: () => ({
        collection: () => ({
          doc: () => ({
            collection: () => ({
              orderBy: mockColOrderBy,
              doc: mockColDoc,
            }),
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

import { listActiveSessions, revokeSession } from './sessionManagement';

describe('listActiveSessions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnforceRateLimit.mockResolvedValue(undefined);
  });

  it('throws unauthenticated when no auth', async () => {
    await expect(
      listActiveSessions({ auth: null, data: {} } as any)
    ).rejects.toThrow('Authentication required');
  });

  it('returns list of auth events as sessions', async () => {
    const docs = [
      {
        id: 'evt-1',
        data: () => ({
          eventId: 'evt-1',
          method: 'google',
          userAgent: 'Mozilla/5.0 (Macintosh) Chrome/100',
          ipHash: 'abc123',
          timestamp: { toDate: () => new Date('2026-04-01T10:00:00Z') },
          reported: false,
          newDevice: false,
          deviceDescription: 'Mac on Chrome',
        }),
      },
    ];
    mockColOrderBy.mockReturnValue({ limit: () => ({ get: () => Promise.resolve({ docs }) }) });

    const result = await listActiveSessions({ auth: { uid: 'u1' }, data: {} } as any);

    expect(result.sessions).toHaveLength(1);
    expect(result.sessions[0]).toMatchObject({
      eventId: 'evt-1',
      method: 'google',
      deviceDescription: 'Mac on Chrome',
    });
  });

  it('returns empty array when no events exist', async () => {
    mockColOrderBy.mockReturnValue({ limit: () => ({ get: () => Promise.resolve({ docs: [] }) }) });

    const result = await listActiveSessions({ auth: { uid: 'u1' }, data: {} } as any);
    expect(result.sessions).toEqual([]);
  });
});

describe('revokeSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnforceRateLimit.mockResolvedValue(undefined);
    mockCreateAuditLog.mockResolvedValue(undefined);
    mockRevokeRefreshTokens.mockResolvedValue(undefined);
  });

  it('throws unauthenticated when no auth', async () => {
    await expect(
      revokeSession({ auth: null, data: { eventId: 'evt-1' } } as any)
    ).rejects.toThrow('Authentication required');
  });

  it('throws invalid-argument when eventId is missing', async () => {
    await expect(
      revokeSession({ auth: { uid: 'u1' }, data: {} } as any)
    ).rejects.toThrow('eventId is required');
  });

  it('throws not-found when event does not belong to user', async () => {
    mockColDoc.mockReturnValue({
      get: () => Promise.resolve({ exists: true, data: () => ({ uid: 'other-user' }) }),
      delete: mockDelete,
    });

    await expect(
      revokeSession({ auth: { uid: 'u1' }, data: { eventId: 'evt-1' } } as any)
    ).rejects.toThrow('Session not found');
  });

  it('deletes the event and logs audit when valid', async () => {
    mockColDoc.mockReturnValue({
      get: () => Promise.resolve({ exists: true, data: () => ({ uid: 'u1' }) }),
      delete: mockDelete,
    });
    mockDelete.mockResolvedValue(undefined);

    const result = await revokeSession({ auth: { uid: 'u1' }, data: { eventId: 'evt-1' } } as any);

    expect(mockDelete).toHaveBeenCalled();
    expect(mockCreateAuditLog).toHaveBeenCalledWith('session_revoked', 'u1', { eventId: 'evt-1' });
    expect(result).toEqual({ success: true });
  });
});
