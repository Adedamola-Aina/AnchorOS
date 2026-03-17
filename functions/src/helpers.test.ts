import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
  const serverTimestamp = vi.fn(() => 'server-ts');
  const auditCreate = vi.fn().mockResolvedValue(undefined);
  const notificationAdd = vi.fn().mockResolvedValue(undefined);
  const ownerGet = vi.fn();
  const memberGet = vi.fn();
  const rateConnectionsRef = {
    where: vi.fn(),
  };

  const appDoc = {
    collection: vi.fn((name: string) => {
      if (name === 'audit_log') {
        return { doc: vi.fn(() => ({ id: 'audit-1', create: auditCreate })) };
      }
      if (name === 'users') {
        return {
          doc: vi.fn(() => ({
            collection: vi.fn(() => ({ add: notificationAdd })),
          })),
        };
      }
      if (name === 'family_connections') {
        return rateConnectionsRef;
      }
      throw new Error(`Unexpected collection: ${name}`);
    }),
  };

  const dbCollection = vi.fn((name: string) => {
    if (name !== 'artifacts') {
      throw new Error(`Unexpected root collection: ${name}`);
    }
    return {
      doc: vi.fn(() => appDoc),
    };
  });

  return {
    serverTimestamp,
    auditCreate,
    notificationAdd,
    ownerGet,
    memberGet,
    rateConnectionsRef,
    dbCollection,
  };
});

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    serverTimestamp: mockState.serverTimestamp,
  },
}));

vi.mock('./config', () => ({
  db: {
    collection: (...args: unknown[]) => mockState.dbCollection(...args),
  },
  APP_ID: 'app-test-id',
}));

import {
  createAuditLog,
  createFinanceAuditLog,
  createNotification,
  generateVerificationCode,
  getActiveConnection,
} from './helpers';

describe('helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockState.rateConnectionsRef.where
      .mockImplementationOnce(() => ({
        where: () => ({
          limit: () => ({ get: mockState.ownerGet }),
        }),
      }))
      .mockImplementationOnce(() => ({
        where: () => ({
          limit: () => ({ get: mockState.memberGet }),
        }),
      }));
  });

  it('generates a 6-digit verification code', () => {
    const code = generateVerificationCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('creates audit log with sanitized metadata and integrity hash', async () => {
    const longValue = 'x'.repeat(700);
    await createAuditLog(
      'test_action',
      'actor-1',
      {
        email: 'private@example.com',
        safe: 'ok',
        longValue,
      },
      'target-1',
    );

    expect(mockState.auditCreate).toHaveBeenCalledTimes(1);
    const payload = mockState.auditCreate.mock.calls[0][0];
    expect(payload.action).toBe('test_action');
    expect(payload.actorUid).toBe('actor-1');
    expect(payload.targetUid).toBe('target-1');
    expect(payload.metadata).toHaveProperty('safe', 'ok');
    expect(payload.metadata).not.toHaveProperty('email');
    expect(payload.metadata.longValue.length).toBeLessThanOrEqual(501);
    expect(payload.integrityHash).toMatch(/^[a-f0-9]{64}$/);
    expect(mockState.serverTimestamp).toHaveBeenCalled();
  });

  it('creates finance audit log with finance domain metadata', async () => {
    await createFinanceAuditLog('finance_action', 'actor-2', { amount: 100 });

    const payload = mockState.auditCreate.mock.calls[0][0];
    expect(payload.action).toBe('finance_action');
    expect(payload.metadata).toMatchObject({ domain: 'finance', amount: 100 });
  });

  it('creates user notification with unread defaults', async () => {
    await createNotification('user-1', 'finance', 'Title', 'Body', 'actor-1', 'Actor Name', {
      accountId: 'acc-1',
    });

    expect(mockState.notificationAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'finance',
        title: 'Title',
        message: 'Body',
        actorUid: 'actor-1',
        actorName: 'Actor Name',
        read: false,
        dismissed: false,
        accountId: 'acc-1',
      }),
    );
  });

  it('returns owner connection when owner query has data', async () => {
    mockState.ownerGet.mockResolvedValue({
      empty: false,
      docs: [{ id: 'owner-conn', data: () => ({ ownerUid: 'owner-1', status: 'active' }) }],
    });
    mockState.memberGet.mockResolvedValue({ empty: true, docs: [] });

    const result = await getActiveConnection('owner-1');

    expect(result).toMatchObject({ id: 'owner-conn', ownerUid: 'owner-1' });
  });

  it('returns member connection when owner query is empty', async () => {
    mockState.ownerGet.mockResolvedValue({ empty: true, docs: [] });
    mockState.memberGet.mockResolvedValue({
      empty: false,
      docs: [{ id: 'member-conn', data: () => ({ memberUid: 'member-1', status: 'active' }) }],
    });

    const result = await getActiveConnection('member-1');

    expect(result).toMatchObject({ id: 'member-conn', memberUid: 'member-1' });
  });

  it('returns null when no active owner or member connection exists', async () => {
    mockState.ownerGet.mockResolvedValue({ empty: true, docs: [] });
    mockState.memberGet.mockResolvedValue({ empty: true, docs: [] });

    const result = await getActiveConnection('none');

    expect(result).toBeNull();
  });
});