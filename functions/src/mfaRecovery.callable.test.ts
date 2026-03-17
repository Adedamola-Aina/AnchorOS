import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
  const enforceRateLimit = vi.fn().mockResolvedValue(undefined);
  const createAuditLog = vi.fn().mockResolvedValue(undefined);
  const getUserByEmail = vi.fn();
  const updateUser = vi.fn();
  const recoveryGet = vi.fn();
  const recoverySet = vi.fn().mockResolvedValue(undefined);
  return {
    enforceRateLimit,
    createAuditLog,
    getUserByEmail,
    updateUser,
    recoveryGet,
    recoverySet,
  };
});

vi.mock('./callable', () => ({
  secureOnCall: (handler: unknown) => handler,
}));

vi.mock('./rateLimit', () => ({
  enforceRateLimit: (...args: unknown[]) => mockState.enforceRateLimit(...args),
}));

vi.mock('./helpers', () => ({
  createAuditLog: (...args: unknown[]) => mockState.createAuditLog(...args),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    getUserByEmail: (...args: unknown[]) => mockState.getUserByEmail(...args),
    updateUser: (...args: unknown[]) => mockState.updateUser(...args),
  }),
}));

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    serverTimestamp: () => 'server-ts',
  },
}));

vi.mock('./config', () => ({
  APP_ID: 'app-test-id',
  db: {
    collection: () => ({
      doc: () => ({
        collection: () => ({
          doc: () => ({
            collection: () => ({
              doc: () => ({
                get: (...args: unknown[]) => mockState.recoveryGet(...args),
                set: (...args: unknown[]) => mockState.recoverySet(...args),
              }),
            }),
          }),
        }),
      }),
    }),
  },
}));

import { recoverMfaWithCode } from './mfaRecovery';

describe('recoverMfaWithCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects missing email or code', async () => {
    await expect(recoverMfaWithCode({ data: {} })).rejects.toMatchObject({
      code: 'invalid-argument',
    });
  });

  it('rejects recovery code that is not 8 characters after normalization', async () => {
    await expect(recoverMfaWithCode({ data: { email: 'user@test.com', recoveryCode: '12-34' } })).rejects.toMatchObject({
      code: 'invalid-argument',
    });
  });

  it('rejects unknown email as invalid credentials', async () => {
    mockState.getUserByEmail.mockRejectedValue(new Error('not found'));

    await expect(recoverMfaWithCode({ data: { email: 'missing@test.com', recoveryCode: 'ABCD1234' } })).rejects.toMatchObject({
      code: 'permission-denied',
    });
    expect(mockState.enforceRateLimit).toHaveBeenCalledWith('mfaRecovery', 'missing@test.com');
  });

  it('rejects when account has no recovery doc', async () => {
    mockState.getUserByEmail.mockResolvedValue({ uid: 'uid-1' });
    mockState.recoveryGet.mockResolvedValue({ exists: false });

    await expect(recoverMfaWithCode({ data: { email: 'user@test.com', recoveryCode: 'ABCD1234' } })).rejects.toMatchObject({
      code: 'failed-precondition',
    });
  });

  it('rejects invalid recovery code', async () => {
    mockState.getUserByEmail.mockResolvedValue({ uid: 'uid-1' });
    mockState.recoveryGet.mockResolvedValue({
      exists: true,
      data: () => ({ hashedCodes: ['not-a-valid-hash'] }),
    });

    await expect(recoverMfaWithCode({ data: { email: 'user@test.com', recoveryCode: 'ABCD1234' } })).rejects.toMatchObject({
      code: 'permission-denied',
    });
  });

  it('returns internal error when updateUser fails', async () => {
    const legacy = createHash('sha256').update('ABCD1234').digest('hex');
    mockState.getUserByEmail.mockResolvedValue({ uid: 'uid-1' });
    mockState.recoveryGet.mockResolvedValue({
      exists: true,
      data: () => ({ hashedCodes: [legacy] }),
    });
    mockState.updateUser.mockRejectedValue(new Error('update failed'));

    await expect(recoverMfaWithCode({ data: { email: 'user@test.com', recoveryCode: 'ABCD1234' } })).rejects.toMatchObject({
      code: 'internal',
    });
  });

  it('resets MFA and persists remaining codes for valid recovery code', async () => {
    const legacyA = createHash('sha256').update('ABCD1234').digest('hex');
    const legacyB = createHash('sha256').update('WXYZ6789').digest('hex');

    mockState.getUserByEmail.mockResolvedValue({ uid: 'uid-2' });
    mockState.updateUser.mockResolvedValue(undefined);
    mockState.recoveryGet.mockResolvedValue({
      exists: true,
      data: () => ({ hashedCodes: [legacyA, legacyB] }),
    });

    const result = await recoverMfaWithCode({
      data: { email: ' USER@TEST.COM ', recoveryCode: 'ab-cd 1234' },
    });

    expect(mockState.enforceRateLimit).toHaveBeenCalledWith('mfaRecovery', 'user@test.com');
    expect(mockState.updateUser).toHaveBeenCalledWith('uid-2', {
      multiFactor: {
        enrolledFactors: [],
      },
    });
    expect(mockState.recoverySet).toHaveBeenCalledWith(
      expect.objectContaining({ codesRemaining: 1, hashedCodes: [legacyB], lastUsedAt: 'server-ts' }),
      { merge: true },
    );
    expect(mockState.createAuditLog).toHaveBeenCalledWith('mfa_recovery_used', 'uid-2', {
      codesRemaining: 1,
    });
    expect(result).toEqual({ success: true, mfaReset: true, codesRemaining: 1 });
  });
});