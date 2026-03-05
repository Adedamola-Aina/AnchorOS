import { describe, expect, it, vi, beforeEach } from 'vitest';
import { consumeMfaRecoveryCode } from './MfaRecoveryApi';

const mockCallable = vi.fn();
const mockHttpsCallable = vi.fn();

vi.mock('firebase/functions', () => ({
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

vi.mock('../config/firebase', () => ({
  functions: {},
}));

describe('MfaRecoveryApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCallable.mockResolvedValue({ data: { success: true, mfaReset: true } });
    mockHttpsCallable.mockReturnValue(mockCallable);
  });

  it('calls recoverMfaWithCode callable with email and recovery code', async () => {
    await consumeMfaRecoveryCode('user@example.com', 'ABCD1234');

    expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'recoverMfaWithCode');
    expect(mockCallable).toHaveBeenCalledWith({
      email: 'user@example.com',
      recoveryCode: 'ABCD1234',
    });
  });
});
