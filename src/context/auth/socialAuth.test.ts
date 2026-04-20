// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase/auth', () => {
  class GoogleAuthProvider {
    scopes: string[] = [];
    addScope(s: string) { this.scopes.push(s); }
  }
  class OAuthProvider {
    scopes: string[] = [];
    constructor(public providerId: string) {}
    addScope(s: string) { this.scopes.push(s); }
  }
  return {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup: vi.fn(),
    signInWithRedirect: vi.fn(),
  };
});

vi.mock('../../config/firebase', () => ({ auth: {} }));
vi.mock('../../services/AuditService', () => ({
  auditAuth: { loginSuccess: vi.fn() },
}));
vi.mock('../../services/authEventService', () => ({
  recordAuthEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../utils/platform', () => ({ isNative: vi.fn(() => false) }));

import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { isNative } from '../../utils/platform';
import { doSocialSignIn, makeGoogleProvider, makeAppleProvider } from './socialAuth';

describe('socialAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (isNative as any).mockReturnValue(false);
  });

  it('makeGoogleProvider adds email + profile scopes', () => {
    const p = makeGoogleProvider();
    expect(p.scopes).toEqual(['email', 'profile']);
  });

  it('makeAppleProvider has apple.com providerId and email/name scopes', () => {
    const p = makeAppleProvider();
    expect((p as any).providerId).toBe('apple.com');
    expect(p.scopes).toEqual(['email', 'name']);
  });

  it('doSocialSignIn uses popup on web and returns credential', async () => {
    const cred = { user: { uid: 'u1' } };
    (signInWithPopup as any).mockResolvedValueOnce(cred);
    const result = await doSocialSignIn(makeGoogleProvider() as any, 'google');
    expect(signInWithPopup).toHaveBeenCalled();
    expect(result).toBe(cred);
  });

  it('doSocialSignIn uses redirect on native and returns null', async () => {
    (isNative as any).mockReturnValue(true);
    (signInWithRedirect as any).mockResolvedValueOnce(undefined);
    const result = await doSocialSignIn(makeAppleProvider() as any, 'apple');
    expect(signInWithRedirect).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('doSocialSignIn swallows popup-closed-by-user errors and returns null', async () => {
    (signInWithPopup as any).mockRejectedValueOnce({ code: 'auth/popup-closed-by-user' });
    const result = await doSocialSignIn(makeGoogleProvider() as any, 'google');
    expect(result).toBeNull();
  });

  it('doSocialSignIn rethrows unexpected errors', async () => {
    (signInWithPopup as any).mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    await expect(doSocialSignIn(makeGoogleProvider() as any, 'google')).rejects.toEqual({
      code: 'auth/network-request-failed',
    });
  });
});
