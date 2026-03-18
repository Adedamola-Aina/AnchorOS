/**
 * socialAuth — helpers for Google + Apple sign-in (AUTH-001, AUTH-005)
 *
 * Extracted from AuthContext.tsx per ARCH-001 (200-line rule).
 */

import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    type UserCredential,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { isNative } from '../../utils/platform';
import { auditAuth } from '../../services/AuditService';
import { recordAuthEvent } from '../../services/authEventService';

const POPUP_CLOSED = new Set([
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
]);

export async function doSocialSignIn(
    provider: GoogleAuthProvider | OAuthProvider,
    method: 'google' | 'apple',
): Promise<UserCredential | null> {
    try {
        if (isNative()) {
            await signInWithRedirect(auth, provider);
            return null;
        }
        const cred = await signInWithPopup(auth, provider);
        if (cred) {
            auditAuth.loginSuccess(method);
            void recordAuthEvent(navigator.userAgent, method);
        }
        return cred;
    } catch (err) {
        const e = err as { code?: string };
        if (!POPUP_CLOSED.has(e.code ?? '')) throw err;
        return null;
    }
}

export function makeGoogleProvider(): GoogleAuthProvider {
    const p = new GoogleAuthProvider();
    p.addScope('email');
    p.addScope('profile');
    return p;
}

export function makeAppleProvider(): OAuthProvider {
    const p = new OAuthProvider('apple.com');
    p.addScope('email');
    p.addScope('name');
    return p;
}
