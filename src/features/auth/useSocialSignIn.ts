/**
 * useSocialSignIn — AUTH-001 (Google), AUTH-005 (Apple)
 *
 * Handles Google + Apple OAuth sign-in flows.
 * Uses signInWithPopup on web, signInWithRedirect on native Capacitor.
 */

import { useState, useCallback } from 'react';
import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    type UserCredential,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { isNative } from '../../utils/platform';

interface SocialSignInResult {
    signInWithGoogle: () => Promise<UserCredential | null>;
    signInWithApple: () => Promise<UserCredential | null>;
    loading: boolean;
    error: string | null;
    clearError: () => void;
}

const POPUP_CLOSED_CODES = new Set([
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
]);

async function triggerOAuth(provider: GoogleAuthProvider | OAuthProvider): Promise<UserCredential | null> {
    if (isNative()) {
        // Capacitor WebView: use redirect; result handled on app resume
        await signInWithRedirect(auth, provider);
        return null;
    }
    return signInWithPopup(auth, provider);
}

export function useSocialSignIn(): SocialSignInResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signInWithGoogle = useCallback(async (): Promise<UserCredential | null> => {
        setLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            return await triggerOAuth(provider);
        } catch (err) {
            const firebaseErr = err as { code?: string; message?: string };
            if (!POPUP_CLOSED_CODES.has(firebaseErr.code ?? '')) {
                setError(firebaseErr.message ?? 'Google sign-in failed');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const signInWithApple = useCallback(async (): Promise<UserCredential | null> => {
        setLoading(true);
        setError(null);
        try {
            const provider = new OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');
            return await triggerOAuth(provider);
        } catch (err) {
            const firebaseErr = err as { code?: string; message?: string };
            if (!POPUP_CLOSED_CODES.has(firebaseErr.code ?? '')) {
                setError(firebaseErr.message ?? 'Apple sign-in failed');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { signInWithGoogle, signInWithApple, loading, error, clearError };
}
