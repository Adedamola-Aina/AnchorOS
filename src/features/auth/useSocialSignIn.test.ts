/**
 * useSocialSignIn — AUTH-001, AUTH-005
 *
 * Tests: Google + Apple sign-in hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
    GoogleAuthProvider: vi.fn(function(this: any) { this.addScope = vi.fn(); }),
    OAuthProvider: vi.fn(function(this: any, id: string) { this.providerId = id; this.addScope = vi.fn(); }),
    signInWithPopup: vi.fn(),
    signInWithRedirect: vi.fn(),
    getRedirectResult: vi.fn(),
}));

vi.mock('../../config/firebase', () => ({ auth: {} }));
vi.mock('../../utils/platform', () => ({ isNative: vi.fn(() => false), isIOS: vi.fn(() => false) }));

import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { isNative } from '../../utils/platform';
import { useSocialSignIn } from './useSocialSignIn';

const mockCredential = { user: { uid: 'u1', email: 'test@example.com' } };

describe('useSocialSignIn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(isNative).mockReturnValue(false);
        vi.mocked(signInWithPopup).mockResolvedValue(mockCredential as never);
        vi.mocked(signInWithRedirect).mockResolvedValue(undefined);
        vi.mocked(getRedirectResult).mockResolvedValue(null);
    });

    it('calls signInWithPopup on web for Google', async () => {
        const { result } = renderHook(() => useSocialSignIn());
        await act(async () => { await result.current.signInWithGoogle(); });
        expect(signInWithPopup).toHaveBeenCalledTimes(1);
        expect(signInWithRedirect).not.toHaveBeenCalled();
    });

    it('calls signInWithRedirect on native for Google', async () => {
        vi.mocked(isNative).mockReturnValue(true);
        const { result } = renderHook(() => useSocialSignIn());
        await act(async () => { await result.current.signInWithGoogle(); });
        expect(signInWithRedirect).toHaveBeenCalledTimes(1);
        expect(signInWithPopup).not.toHaveBeenCalled();
    });

    it('calls signInWithPopup on web for Apple', async () => {
        const { result } = renderHook(() => useSocialSignIn());
        await act(async () => { await result.current.signInWithApple(); });
        expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });

    it('returns user credential on success', async () => {
        const { result } = renderHook(() => useSocialSignIn());
        let cred: unknown;
        await act(async () => { cred = await result.current.signInWithGoogle(); });
        expect(cred).toEqual(mockCredential);
    });

    it('sets loading to true during sign-in and false after', async () => {
        let resolveSignIn!: (v: unknown) => void;
        vi.mocked(signInWithPopup).mockReturnValue(new Promise((r) => { resolveSignIn = r; }) as never);
        const { result } = renderHook(() => useSocialSignIn());
        act(() => { void result.current.signInWithGoogle(); });
        expect(result.current.loading).toBe(true);
        await act(async () => { resolveSignIn(mockCredential); });
        expect(result.current.loading).toBe(false);
    });

    it('captures error and sets error state on failure', async () => {
        vi.mocked(signInWithPopup).mockRejectedValue(new Error('popup_closed'));
        const { result } = renderHook(() => useSocialSignIn());
        await act(async () => { await result.current.signInWithGoogle(); });
        expect(result.current.error).toBe('popup_closed');
        expect(result.current.loading).toBe(false);
    });

    it('ignores popup_closed_by_user silently', async () => {
        const err = Object.assign(new Error('Popup closed'), { code: 'auth/popup-closed-by-user' });
        vi.mocked(signInWithPopup).mockRejectedValue(err);
        const { result } = renderHook(() => useSocialSignIn());
        await act(async () => { await result.current.signInWithGoogle(); });
        expect(result.current.error).toBeNull();
    });
});
