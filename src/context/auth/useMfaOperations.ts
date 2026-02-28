/**
 * MFA (Multi-Factor Authentication) Hook
 * Extracted from AuthContext.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


import { useRef, useCallback, useMemo } from 'react';
import { multiFactor, type User, type MultiFactorResolver, type TotpSecret } from 'firebase/auth';

interface PendingMfaSecret extends TotpSecret {
    codeInterval?: number;
}

interface FirebaseLikeError {
    code?: string;
    message?: string;
}

const mapGenerateMfaSecretError = (error: unknown): Error => {
    const firebaseError = error as FirebaseLikeError;
    const errorCode = firebaseError?.code || '';
    const errorMessage = firebaseError?.message || '';

    if (errorCode === 'auth/requires-recent-login') {
        return new Error('Please re-authenticate, then try setting up 2FA again.');
    }
    if (errorCode === 'auth/invalid-user-token' || errorCode === 'auth/user-token-expired') {
        return new Error('Your session expired. Please sign in again and retry 2FA setup.');
    }
    if (errorCode === 'auth/network-request-failed') {
        return new Error('Network error while preparing 2FA. Check your connection and retry.');
    }
    if (errorCode === 'auth/operation-not-allowed') {
        return new Error('2FA enrollment is currently unavailable for this account.');
    }
    if (errorMessage.includes('INVALID_ID_TOKEN')) {
        return new Error('Your session token is invalid. Please sign in again and retry.');
    }

    return new Error(errorMessage || 'Unable to initialize 2FA setup right now. Please try again.');
};

export function useMfaOperations(user: User | null, updateProfile: (updates: { mfaEnabled: boolean }) => Promise<void>) {
    const pendingMfaSecretRef = useRef<PendingMfaSecret | null>(null);

    const verifyMfa = useCallback(async (resolver: MultiFactorResolver, code: string) => {
        const { TotpMultiFactorGenerator } = await import('firebase/auth');
        const assertion = TotpMultiFactorGenerator.assertionForSignIn(resolver.hints[0].uid, code);
        await resolver.resolveSignIn(assertion);
    }, []);

    const generateMfaSecret = useCallback(async () => {
        if (!user) throw new Error('Not logged in');
        try {
            const { TotpMultiFactorGenerator } = await import('firebase/auth');
            const session = await multiFactor(user).getSession();
            const result = await TotpMultiFactorGenerator.generateSecret(session);
            pendingMfaSecretRef.current = result;

            return {
                qrCodeUrl: result.generateQrCodeUrl('Anchor OS', user.email || 'user'),
                manualKey: result.secretKey
            };
        } catch (error) {
            pendingMfaSecretRef.current = null;
            throw mapGenerateMfaSecretError(error);
        }
    }, [user]);

    const enrollMfa = useCallback(async (code: string) => {
        if (!user) throw new Error('Not logged in');
        const mfaUser = multiFactor(user);
        if (mfaUser.enrolledFactors.length > 0) {
            if (import.meta.env.DEV) console.debug('[useMfaOperations] MFA already enrolled');
            await updateProfile({ mfaEnabled: true });
            return;
        }

        const { TotpMultiFactorGenerator } = await import('firebase/auth');

        if (!pendingMfaSecretRef.current) {
            throw new Error('MFA verification expired. Please regenerate the QR code.');
        }

        const assertion = TotpMultiFactorGenerator.assertionForEnrollment(pendingMfaSecretRef.current, code);
        await multiFactor(user).enroll(assertion, 'Authenticator App');
        await updateProfile({ mfaEnabled: true });

        pendingMfaSecretRef.current = null;
    }, [user, updateProfile]);

    const unenrollMfa = useCallback(async () => {
        if (!user) return;
        try {
            const mfaUser = multiFactor(user);
            if (mfaUser.enrolledFactors.length > 0) {
                await mfaUser.unenroll(mfaUser.enrolledFactors[0]);
            }
            await updateProfile({ mfaEnabled: false });
        } catch (err: unknown) {
            const error = err as { code?: string; message?: string };
            if (error.code === 'auth/requires-recent-login') {
                throw new Error('REQUIRES_RECENT_LOGIN');
            }
            throw err;
        }
    }, [user, updateProfile]);

    const reauthenticate = useCallback(async (password: string) => {
        if (!user || !user.email) throw new Error('Not logged in');
        const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
    }, [user]);

    const clearPendingSecret = useCallback(() => {
        pendingMfaSecretRef.current = null;
    }, []);

    return useMemo(() => ({
        verifyMfa,
        generateMfaSecret,
        enrollMfa,
        unenrollMfa,
        reauthenticate,
        clearPendingSecret
    }), [verifyMfa, generateMfaSecret, enrollMfa, unenrollMfa, reauthenticate, clearPendingSecret]);
}
