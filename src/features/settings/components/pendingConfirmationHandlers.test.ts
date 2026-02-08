import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pendingConfirmationHandlers } from './pendingConfirmationHandlers';

// Mock Firebase modules
const mockHttpsCallable = vi.fn();
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

const mockReauthenticate = vi.fn();
const mockGetMultiFactorResolver = vi.fn();
vi.mock('firebase/auth', () => ({
  EmailAuthProvider: { credential: vi.fn((email, pw) => ({ email, password: pw })) },
  reauthenticateWithCredential: (...args: unknown[]) => mockReauthenticate(...args),
  getMultiFactorResolver: (...args: unknown[]) => mockGetMultiFactorResolver(...args),
  TotpMultiFactorGenerator: {
    assertionForSignIn: vi.fn(() => 'totp-assertion'),
    FACTOR_ID: 'totp',
  },
}));

vi.mock('../../../config/firebase', () => ({
  auth: { currentUser: { email: 'user@test.com' } },
}));

// We need to import the actual functions - they call httpsCallable internally
// Let's check what the module actually exports
let handlers: typeof import('./pendingConfirmationHandlers');

describe('pendingConfirmationHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHttpsCallable.mockReturnValue(vi.fn());
  });

  describe('completeConnectionConfirmation', () => {
    it('calls confirmConnection cloud function with confirmed: true', async () => {
      const mockCallable = vi.fn().mockResolvedValue({ data: { success: true } });
      mockHttpsCallable.mockReturnValue(mockCallable);

      const { completeConnectionConfirmation } = await import('./pendingConfirmationHandlers');
      const result = await completeConnectionConfirmation('invite-123', 'password123');

      expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'confirmConnection');
      expect(mockCallable).toHaveBeenCalledWith({
        inviteId: 'invite-123',
        confirmed: true,
        password: 'password123',
      });
    });
  });

  describe('rejectInvitation', () => {
    it('calls confirmConnection with confirmed: false', async () => {
      const mockCallable = vi.fn().mockResolvedValue({ data: {} });
      mockHttpsCallable.mockReturnValue(mockCallable);

      const { rejectInvitation } = await import('./pendingConfirmationHandlers');
      await rejectInvitation('invite-456');

      expect(mockCallable).toHaveBeenCalledWith({
        inviteId: 'invite-456',
        confirmed: false,
        password: '',
      });
    });
  });

  describe('cancelInvitation', () => {
    it('calls revokeInvitation cloud function', async () => {
      const mockCallable = vi.fn().mockResolvedValue({ data: {} });
      mockHttpsCallable.mockReturnValue(mockCallable);

      const { cancelInvitation } = await import('./pendingConfirmationHandlers');
      await cancelInvitation('invite-789');

      expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'revokeInvitation');
      expect(mockCallable).toHaveBeenCalledWith({ inviteId: 'invite-789' });
    });
  });

  describe('reauthenticateUser', () => {
    it('re-authenticates using email credential', async () => {
      mockReauthenticate.mockResolvedValue(undefined);

      const { reauthenticateUser } = await import('./pendingConfirmationHandlers');
      await reauthenticateUser('mypassword');

      expect(mockReauthenticate).toHaveBeenCalled();
    });
  });

  describe('getMfaResolver', () => {
    it('extracts MFA resolver from error', async () => {
      const mockResolver = { hints: [{ factorId: 'totp' }] };
      mockGetMultiFactorResolver.mockReturnValue(mockResolver);

      const { getMfaResolver } = await import('./pendingConfirmationHandlers');
      const resolver = getMfaResolver(new Error('mfa-required'));

      expect(mockGetMultiFactorResolver).toHaveBeenCalled();
      expect(resolver).toBe(mockResolver);
    });
  });
});
