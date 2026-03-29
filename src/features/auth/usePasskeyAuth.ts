/**
 * usePasskeyAuth — AUTH-002, GAP-011
 * WebAuthn passkey: register, authenticate, remove with server-side verification.
 */

import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app, functions } from '../../config/firebase';
import { bufferToBase64url, base64urlToBuffer, performPasskeyRegistration, RP_ID } from './passkeyUtils';
import { recordAuthEvent } from '../../services/authEventService';

interface IssueChallengeResult {
    challengeId: string;
    challenge: string; // base64url
}

interface PasskeyAuthResult {
    isSupported: boolean;
    loading: boolean;
    error: string | null;
    registerPasskey: (userId: string, email: string, displayName: string) => Promise<string | null>;
    authenticateWithPasskey: (credentialId?: string) => Promise<unknown>;
    removePasskey: (credentialId: string) => Promise<boolean>;
    clearError: () => void;
    passkeySupported?: boolean;
}

export function usePasskeyAuth(): PasskeyAuthResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported =
        typeof window !== 'undefined' &&
        typeof navigator.credentials?.create === 'function';

    /** Register a new passkey. Server-issued challenge, server-verified attestation. */
    const registerPasskey = useCallback(async (
        userId: string,
        email: string,
        displayName: string
    ): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            return await performPasskeyRegistration(userId, email, displayName);
        } catch (err) {
            const e = err as { message?: string; name?: string };
            if (e.name !== 'NotAllowedError') setError(e.message ?? 'Passkey registration failed');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** Authenticate using an existing passkey. Server-issued challenge, server-verified assertion. */
    const authenticateWithPasskey = useCallback(async (
        credentialId?: string
    ): Promise<unknown> => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get server-issued challenge
            const issueChallenge = httpsCallable<{ purpose: string }, IssueChallengeResult>(functions, 'issuePasskeyChallenge');
            const { data: { challengeId, challenge } } = await issueChallenge({ purpose: 'authenticate' });

            const allowCredentials: PublicKeyCredentialDescriptor[] = credentialId
                ? [{ type: 'public-key', id: base64urlToBuffer(credentialId) }]
                : [];

            // 2. Get assertion from authenticator
            const assertion = await navigator.credentials.get({
                publicKey: {
                    rpId: RP_ID,
                    challenge: base64urlToBuffer(challenge),
                    allowCredentials,
                    userVerification: 'required',
                    timeout: 60_000,
                },
            }) as PublicKeyCredential | null;

            if (!assertion) return null;

            const assertionResponse = assertion.response as AuthenticatorAssertionResponse;

            // 3. Send to server for cryptographic verification
            const verifyAssertion = httpsCallable<Record<string, unknown>, { customToken: string }>(functions, 'verifyPasskeyAssertion');
            const { data: { customToken } } = await verifyAssertion({
                challengeId,
                credentialId: assertion.id,
                userId: assertionResponse.userHandle
                    ? new TextDecoder().decode(assertionResponse.userHandle)
                    : (credentialId ?? assertion.id),
                response: {
                    authenticatorData: bufferToBase64url(assertionResponse.authenticatorData),
                    clientDataJSON: bufferToBase64url(assertionResponse.clientDataJSON),
                    signature: bufferToBase64url(assertionResponse.signature),
                    userHandle: assertionResponse.userHandle
                        ? bufferToBase64url(assertionResponse.userHandle)
                        : undefined,
                },
            });

            // 4. Sign in with the server-issued custom token
            const auth = getAuth(app);
            const credential = await signInWithCustomToken(auth, customToken);
            void recordAuthEvent(navigator.userAgent, 'passkey');
            return credential;
        } catch (err) {
            const e = err as { message?: string; name?: string };
            if (e.name !== 'NotAllowedError') {
                setError(e.message ?? 'Passkey authentication failed');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    /** Remove an existing passkey via Cloud Function. */
    const removePasskey = useCallback(async (credentialId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const deleteFn = httpsCallable<{ credentialId: string }, { success: boolean }>(functions, 'deletePasskey');
            await deleteFn({ credentialId });
            return true;
        } catch (err) {
            const e = err as { message?: string };
            setError(e.message ?? 'Failed to remove passkey');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { isSupported, loading, error, registerPasskey, authenticateWithPasskey, removePasskey, clearError };
}
