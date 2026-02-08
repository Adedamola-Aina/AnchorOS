import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMfaEnrollmentUI } from './useMfaEnrollmentUI';

vi.mock('../../../services/mfaRecoveryService', () => ({
  generateRecoveryCodes: vi.fn(() =>
    Promise.resolve({
      plainCodes: ['CODE1', 'CODE2', 'CODE3'],
      hashedCodes: ['hash1', 'hash2', 'hash3'],
    })
  ),
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    doc: vi.fn(() => ({})),
    setDoc: vi.fn(() => Promise.resolve()),
  };
});

vi.mock('../../../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
}));

const { setDoc } = await import('firebase/firestore');

const baseOptions = {
  generateMfaSecret: vi.fn(() =>
    Promise.resolve({ qrCodeUrl: 'otpauth://test', manualKey: 'ABC123' })
  ),
  enrollMfa: vi.fn(() => Promise.resolve()),
  showToast: vi.fn(),
  onRequiresReauth: vi.fn(),
  userId: 'user-1',
};

describe('useMfaEnrollmentUI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

    expect(result.current.show2FASetup).toBe(false);
    expect(result.current.mfaQrUrl).toBe('');
    expect(result.current.mfaManualKey).toBe('');
    expect(result.current.mfaCode).toBe('');
    expect(result.current.mfaError).toBe('');
    expect(result.current.isEnrolling).toBe(false);
    expect(result.current.recoveryCodes).toBeNull();
  });

  describe('handleGenerateSecret', () => {
    it('generates QR code and manual key', async () => {
      const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

      await act(async () => {
        await result.current.handleGenerateSecret();
      });

      expect(result.current.show2FASetup).toBe(true);
      expect(result.current.mfaQrUrl).toBe('otpauth://test');
      expect(result.current.mfaManualKey).toBe('ABC123');
      expect(result.current.isEnrolling).toBe(false);
    });

    it('handles generation error', async () => {
      const opts = {
        ...baseOptions,
        generateMfaSecret: vi.fn(() => Promise.reject(new Error('Network error'))),
      };

      const { result } = renderHook(() => useMfaEnrollmentUI(opts));

      await act(async () => {
        await result.current.handleGenerateSecret();
      });

      expect(result.current.mfaError).toBe('Network error');
      expect(result.current.isEnrolling).toBe(false);
    });

    it('sets timeout error if generation takes too long', async () => {
      vi.useFakeTimers();

      // Never resolving promise
      const opts = {
        ...baseOptions,
        generateMfaSecret: vi.fn(() => new Promise(() => {})),
      };

      const { result } = renderHook(() => useMfaEnrollmentUI(opts));

      act(() => {
        result.current.handleGenerateSecret();
      });

      // Fast-forward past the 10s timeout
      act(() => {
        vi.advanceTimersByTime(11000);
      });

      expect(result.current.mfaError).toBe('Initialization taking too long.');
      expect(result.current.isEnrolling).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('handleEnroll', () => {
    it('enrolls MFA, generates recovery codes, and saves to Firestore', async () => {
      const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

      await act(async () => {
        await result.current.handleEnroll('123456');
      });

      expect(baseOptions.enrollMfa).toHaveBeenCalledWith('123456');
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          hashedCodes: ['hash1', 'hash2', 'hash3'],
          codesRemaining: 3,
        })
      );
      expect(result.current.recoveryCodes).toEqual(['CODE1', 'CODE2', 'CODE3']);
      expect(baseOptions.showToast).toHaveBeenCalledWith('2FA enabled successfully!', 'success');
      expect(result.current.show2FASetup).toBe(false);
      expect(result.current.mfaCode).toBe('');
    });

    it('handles requires-recent-login error', async () => {
      const opts = {
        ...baseOptions,
        enrollMfa: vi.fn(() => Promise.reject(new Error('requires-recent-login'))),
      };

      const { result } = renderHook(() => useMfaEnrollmentUI(opts));

      await act(async () => {
        await result.current.handleEnroll('123456');
      });

      expect(opts.onRequiresReauth).toHaveBeenCalled();
    });

    it('handles auth/requires-recent-login error code', async () => {
      const err = new Error('session expired');
      (err as any).code = 'auth/requires-recent-login';

      const opts = {
        ...baseOptions,
        enrollMfa: vi.fn(() => Promise.reject(err)),
      };

      const { result } = renderHook(() => useMfaEnrollmentUI(opts));

      await act(async () => {
        await result.current.handleEnroll('123456');
      });

      expect(opts.onRequiresReauth).toHaveBeenCalled();
    });

    it('handles invalid-verification-code with user-friendly message', async () => {
      const opts = {
        ...baseOptions,
        enrollMfa: vi.fn(() =>
          Promise.reject(new Error('auth/invalid-verification-code'))
        ),
      };

      const { result } = renderHook(() => useMfaEnrollmentUI(opts));

      await act(async () => {
        await result.current.handleEnroll('000000');
      });

      expect(result.current.mfaError).toBe(
        'Invalid code. Check device Date & Time settings.'
      );
    });

    it('handles generic enrollment error', async () => {
      const opts = {
        ...baseOptions,
        enrollMfa: vi.fn(() => Promise.reject(new Error('Unknown error'))),
      };

      const { result } = renderHook(() => useMfaEnrollmentUI(opts));

      await act(async () => {
        await result.current.handleEnroll('123456');
      });

      expect(result.current.mfaError).toBe('Unknown error');
    });

    it('continues enrollment even if recovery code generation fails', async () => {
      const { generateRecoveryCodes } = await import(
        '../../../services/mfaRecoveryService'
      );
      vi.mocked(generateRecoveryCodes).mockRejectedValueOnce(
        new Error('recovery failed')
      );

      const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

      await act(async () => {
        await result.current.handleEnroll('123456');
      });

      // Enrollment should still succeed
      expect(baseOptions.showToast).toHaveBeenCalledWith(
        '2FA enabled successfully!',
        'success'
      );
      expect(result.current.recoveryCodes).toBeNull();
    });
  });

  describe('clearRecoveryCodes', () => {
    it('sets recovery codes to null', async () => {
      const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

      // First enroll to get codes
      await act(async () => {
        await result.current.handleEnroll('123456');
      });
      expect(result.current.recoveryCodes).not.toBeNull();

      act(() => {
        result.current.clearRecoveryCodes();
      });

      expect(result.current.recoveryCodes).toBeNull();
    });
  });

  it('setMfaCode updates mfaCode', () => {
    const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

    act(() => {
      result.current.setMfaCode('654321');
    });

    expect(result.current.mfaCode).toBe('654321');
  });

  it('setShow2FASetup updates visibility', () => {
    const { result } = renderHook(() => useMfaEnrollmentUI(baseOptions));

    act(() => {
      result.current.setShow2FASetup(true);
    });

    expect(result.current.show2FASetup).toBe(true);
  });
});
