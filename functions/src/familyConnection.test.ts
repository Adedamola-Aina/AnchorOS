import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => {
  const invitation = {
    ownerUid: 'owner-1',
    inviteeEmail: 'invitee@example.com',
    status: 'pending',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    verificationCodeHash: 'hash',
    verificationAttempts: 0,
  };
  return {
    invitation,
    get: vi.fn(),
    update: vi.fn(),
    compare: vi.fn(),
    enforceRateLimit: vi.fn(),
  };
});

vi.mock('./callable', () => ({
  secureOnCall: <T, R>(handler: (request: T) => Promise<R>) => handler,
}));
vi.mock('./config', () => ({
  APP_ID: 'anchor-os',
  db: {
    collection: () => ({
      doc: () => ({
        collection: () => ({
          doc: () => ({ get: state.get, update: state.update }),
        }),
      }),
    }),
  },
}));
vi.mock('./rateLimit', () => ({ enforceRateLimit: state.enforceRateLimit }));
vi.mock('./helpers', () => ({ createAuditLog: vi.fn(), createNotification: vi.fn() }));
vi.mock('bcrypt', () => ({ compare: state.compare }));

import { acceptInvitation as acceptInvitationHandler } from './familyConnection';

const acceptInvitation = acceptInvitationHandler as unknown as (request: {
  auth?: { uid: string; token: { email?: string; email_verified?: boolean } };
  data: { inviteId: string; verificationCode: string };
}) => Promise<unknown>;

describe('acceptInvitation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.get.mockResolvedValue({ exists: true, data: () => ({ ...state.invitation }) });
    state.compare.mockResolvedValue(true);
  });

  it('rejects an authenticated account that does not own the invited email', async () => {
    await expect(acceptInvitation({
      auth: { uid: 'attacker', token: { email: 'attacker@example.com', email_verified: true } },
      data: { inviteId: 'invite-1', verificationCode: '123456' },
    })).rejects.toMatchObject({ code: 'permission-denied' });

    expect(state.compare).not.toHaveBeenCalled();
    expect(state.update).not.toHaveBeenCalled();
  });
});
