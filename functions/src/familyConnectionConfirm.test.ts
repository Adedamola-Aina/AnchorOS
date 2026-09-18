import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * FS-03 (decision AM-1 option a): `confirmConnection` must refuse to create a
 * second ACTIVE household for either side, atomically, while staying idempotent
 * when the same confirm is retried.
 */

const state = vi.hoisted(() => ({
  invite: {
    ownerUid: 'owner-1',
    inviteeUid: 'member-1',
    inviteeEmail: 'member@example.com',
    ownerDisplayName: 'Owner One',
    status: 'awaiting_confirmation',
  },
  get: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  runTransaction: vi.fn(),
  txGet: vi.fn(),
  enforceRateLimit: vi.fn(),
  profileGet: vi.fn(),
  encrypt: vi.fn(),
}));

vi.mock('./callable', () => ({
  secureOnCall: <T, R>(handler: (request: T) => Promise<R>) => handler,
}));

vi.mock('./config', () => ({
  APP_ID: 'anchor-os',
  db: {
    runTransaction: (fn: unknown) => state.runTransaction(fn),
    collection: () => ({
      doc: () => ({
        collection: (name: string) => {
          if (name === 'family_invitations') {
            return { doc: () => ({ get: state.get, update: state.update }) };
          }
          if (name === 'users') {
            return { doc: () => ({ get: state.profileGet }) };
          }
          // family_connections
          const makeQuery = (): Record<string, unknown> => {
            const q: Record<string, unknown> = {};
            q.where = () => q;
            return q;
          };
          return {
            doc: (id: string) => ({ id }),
            where: () => makeQuery(),
          };
        },
      }),
    }),
  },
}));

vi.mock('./rateLimit', () => ({ enforceRateLimit: state.enforceRateLimit }));
vi.mock('./helpers', () => ({ createAuditLog: vi.fn(), createNotification: vi.fn() }));

import { confirmConnection as handler } from './familyConnectionConfirm';

const confirmConnection = handler as unknown as (request: {
  auth?: { uid: string };
  data: { inviteId: string; confirmed: boolean };
}) => Promise<unknown>;

const call = () => confirmConnection({ auth: { uid: 'owner-1' }, data: { inviteId: 'invite-1', confirmed: true } });

describe('confirmConnection single-active-household guard (FS-03)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.get.mockResolvedValue({ exists: true, data: () => ({ ...state.invite }) });
    state.profileGet.mockResolvedValue({ exists: true, data: () => ({ name: 'Member One' }) });
    state.runTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn({ get: state.txGet, set: state.set, update: state.update }));
  });

  it('refuses when the owner already has a different active household', async () => {
    state.txGet
      .mockResolvedValueOnce({ docs: [{ id: 'owner-1_someone-else' }] })
      .mockResolvedValueOnce({ docs: [] });

    await expect(call()).rejects.toMatchObject({ code: 'failed-precondition' });
    expect(state.set).not.toHaveBeenCalled();
    expect(state.update).not.toHaveBeenCalled();
  });

  it('refuses when the invitee is already connected elsewhere', async () => {
    state.txGet
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: 'someone-else_member-1' }] });

    await expect(call()).rejects.toMatchObject({ code: 'failed-precondition' });
    expect(state.set).not.toHaveBeenCalled();
  });

  it('activates the connection when neither side is already connected', async () => {
    state.txGet.mockResolvedValue({ docs: [] });

    await expect(call()).resolves.toMatchObject({ success: true });

    expect(state.set).toHaveBeenCalledWith(
      { id: 'owner-1_member-1' },
      expect.objectContaining({ id: 'owner-1_member-1', status: 'active', ownerUid: 'owner-1', memberUid: 'member-1' }),
    );
    expect(state.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ status: 'accepted' }),
    );
  });

  it('stays idempotent when the same confirm is retried', async () => {
    state.txGet
      .mockResolvedValueOnce({ docs: [{ id: 'owner-1_member-1' }] })
      .mockResolvedValueOnce({ docs: [{ id: 'owner-1_member-1' }] });

    await expect(call()).resolves.toMatchObject({ success: true });
    expect(state.set).toHaveBeenCalled();
  });

  it('checks both sides inside one transaction (no read-after-write race)', async () => {
    state.txGet.mockResolvedValue({ docs: [] });

    await call();

    expect(state.runTransaction).toHaveBeenCalledTimes(1);
    expect(state.txGet).toHaveBeenCalledTimes(2);
  });
});