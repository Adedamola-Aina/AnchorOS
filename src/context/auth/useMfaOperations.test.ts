import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMfaOperations } from './useMfaOperations';

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    multiFactor: vi.fn(() => ({
      enrolledFactors: [],
      getSession: vi.fn(() => Promise.resolve('mock-session')),
      enroll: vi.fn(() => Promise.resolve()),
      unenroll: vi.fn(() => Promise.resolve()),
    })),
    TotpMultiFactorGenerator: {
      generateSecret: vi.fn(() => Promise.resolve({
        secretKey: 'ABCDEF123456',
        hashingAlgorithm: 'SHA1',
        codeLength: 6,
        codeIntervalSeconds: 30,
        generateQrCodeUrl: vi.fn((_issuer: string, _account: string) => 'otpauth://test'),
      })),
      assertionForEnrollment: vi.fn(() => ({ factorId: 'totp' })),
      assertionForSignIn: vi.fn(() => ({ factorId: 'totp' })),
    },
    EmailAuthProvider: { credential: vi.fn(() => ({})) },
    reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
  };
});

const mockUser = { uid: 'u1', email: 'test@test.com' } as any;
const mockUpdateProfile = vi.fn(() => Promise.resolve());

describe('useMfaOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('returns all operations', () => {
    const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
    expect(result.current.verifyMfa).toBeDefined();
    expect(result.current.generateMfaSecret).toBeDefined();
    expect(result.current.enrollMfa).toBeDefined();
    expect(result.current.unenrollMfa).toBeDefined();
    expect(result.current.reauthenticate).toBeDefined();
    expect(result.current.clearPendingSecret).toBeDefined();
  });

  describe('generateMfaSecret', () => {
    it('generates QR code URL and manual key', async () => {
      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      let secret: any;
      await act(async () => {
        secret = await result.current.generateMfaSecret();
      });
      expect(secret.qrCodeUrl).toBe('otpauth://test');
      expect(secret.manualKey).toBe('ABCDEF123456');
    });

    it('saves secret to sessionStorage', async () => {
      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      await act(async () => {
        await result.current.generateMfaSecret();
      });
      const stored = JSON.parse(sessionStorage.getItem('anchor_mfa_pending')!);
      expect(stored.secretKey).toBe('ABCDEF123456');
    });

    it('throws when user is null', async () => {
      const { result } = renderHook(() => useMfaOperations(null, mockUpdateProfile));
      await expect(
        act(async () => { await result.current.generateMfaSecret(); })
      ).rejects.toThrow('Not logged in');
    });
  });

  describe('enrollMfa', () => {
    it('enrolls and updates profile', async () => {
      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      // First generate to set pendingSecret
      await act(async () => { await result.current.generateMfaSecret(); });
      await act(async () => { await result.current.enrollMfa('123456'); });
      expect(mockUpdateProfile).toHaveBeenCalledWith({ mfaEnabled: true });
    });

    it('throws when no pending secret and no storage', async () => {
      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      await expect(
        act(async () => { await result.current.enrollMfa('123456'); })
      ).rejects.toThrow('MFA verification expired');
    });

    it('restores secret from sessionStorage', async () => {
      sessionStorage.setItem('anchor_mfa_pending', JSON.stringify({
        secretKey: 'RESTORED', hashingAlgorithm: 'SHA1', codeLength: 6,
        codeInterval: 30, timestamp: Date.now(),
      }));
      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      await act(async () => { await result.current.enrollMfa('123456'); });
      expect(mockUpdateProfile).toHaveBeenCalledWith({ mfaEnabled: true });
    });

    it('skips enrollment if already enrolled', async () => {
      const { multiFactor } = await import('firebase/auth');
      vi.mocked(multiFactor).mockReturnValueOnce({
        enrolledFactors: [{ uid: 'f1' }],
        getSession: vi.fn(),
        enroll: vi.fn(),
        unenroll: vi.fn(),
      } as any);

      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      await act(async () => { await result.current.enrollMfa('123456'); });
      expect(mockUpdateProfile).toHaveBeenCalledWith({ mfaEnabled: true });
    });
  });

  describe('unenrollMfa', () => {
    it('unenrolls first factor and updates profile', async () => {
      const mockUnenroll = vi.fn(() => Promise.resolve());
      const { multiFactor } = await import('firebase/auth');
      vi.mocked(multiFactor).mockReturnValueOnce({
        enrolledFactors: [{ uid: 'f1' }],
        unenroll: mockUnenroll,
      } as any);

      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      await act(async () => { await result.current.unenrollMfa(); });
      expect(mockUnenroll).toHaveBeenCalled();
      expect(mockUpdateProfile).toHaveBeenCalledWith({ mfaEnabled: false });
    });

    it('is no-op when user is null', async () => {
      const { result } = renderHook(() => useMfaOperations(null, mockUpdateProfile));
      await act(async () => { await result.current.unenrollMfa(); });
      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });
  });

  describe('reauthenticate', () => {
    it('reauthenticates with email and password', async () => {
      const { reauthenticateWithCredential } = await import('firebase/auth');
      const { result } = renderHook(() => useMfaOperations(mockUser, mockUpdateProfile));
      await act(async () => { await result.current.reauthenticate('password123'); });
      expect(reauthenticateWithCredential).toHaveBeenCalled();
    });

    it('throws when user is null', async () => {
      const { result } = renderHook(() => useMfaOperations(null, mockUpdateProfile));
      await expect(
        act(async () => { await result.current.reauthenticate('pass'); })
      ).rejects.toThrow('Not logged in');
    });
  });
});
