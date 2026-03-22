/**
 * usePasskeyAuth — AUTH-002, GAP-011
 *
 * WebAuthn passkey support: register a platform authenticator and
 * authenticate with it using full server-side assertion verification.
 *
 * Security: server-generated challenges, attestation verified server-side,
 * signCount enforced, Firebase Custom Token issued after verification.
 */

import { useState, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app } from '../../config/firebase';
import { RP_ID, RP_NAME, bufferToBase64url, base64urlToBuffer } from './passkeyUtils';

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
    clearError: () => void;
    passkeySupported?: boolean;
}

export function usePasskeyAuth(): PasskeyAuthResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported =
        typeof window !== 'undefined' &&
        typeof navigator.credentials?.create === 'function';

    const functions = getFunctions(app);

    /**
     * Register a new passkey for the given user.
     * Challenge comes from the server — prevents client-forged challenges.
     * Attestation verified server-side — public key stored in Firestore.
     * Returns the base64url-encoded credentialId on success.
     */
    const registerPasskey = useCallback(async (
        userId: string,
        email: string,
        displayName: string
    ): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get server-issued challenge
            const issueChallenge = httpsCallable<{ purpose: string }, IssueChallengeResult>(
                functions, 'issuePasskeyChallenge'
            );
            const { data: { challengeId, challenge } } = await issueChallenge({ purpose: 'register' });

            const userIdBytes = new TextEncoder().encode(userId);

            // 2. Create credential using server challenge
            const credential = await navigator.credentials.create({
                publicKey: {
                    rp: { id: RP_ID, name: RP_NAME },
                    user: { id: userIdBytes, name: email, displayName },
                    challenge: base64urlToBuffer(challenge),
                    pubKeyCredParams: [
                        { type: 'public-key', alg: -7 },   // ES256
                        { type: 'public-key', alg: -257 }, // RS256
                    ],
                    authenticatorSelection: {
                        // No authenticatorAttachment restriction — allows platform
                        // authenticators (Face ID, Touch ID, Windows Hello) AND
                        // roaming hardware keys (YubiKey, FIDO2 USB/NFC keys).
                        residentKey: 'required',
                        userVerification: 'required',
                    },
                    timeout: 60_000,
                    attestation: 'none',
                },
            }) as PublicKeyCredential | null;

            if (!credential) return null;

            const attestationResponse = credential.response as AuthenticatorAttestationResponse;

            // 3. Send attestation to server for verification + public key storage
            const completeRegistration = httpsCallable<Record<string, unknown>, { credentialId: string }>(
                functions, 'completePasskeyRegistration'
            );
            const { data: { credentialId } } = await completeRegistration({
                challengeId,
                credential: {
                    id: credential.id,
                    rawId: bufferToBase64url(credential.rawId),
                    response: {
                        clientDataJSON: bufferToBase64url(attestationResponse.clientDataJSON),
                        attestationObject: bufferToBase64url(attestationResponse.attestationObject),
                    },
                    type: credential.type,
                    authenticatorAttachment: credential.authenticatorAttachment ?? undefined,
                },
            });

            return credentialId;
        } catch (err) {
            const e = err as { message?: string; name?: string };
            if (e.name !== 'NotAllowedError') {
                setError(e.message ?? 'Passkey registration failed');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, [functions]);

    /**
     * Authenticate using an existing passkey.
     * Challenge is server-issued. Assertion is verified server-side via Cloud Function.
     * Returns UserCredential from signInWithCustomToken on success.
     */
    const authenticateWithPasskey = useCallback(async (
        credentialId?: string
    ): Promise<unknown> => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get server-issued challenge
            const issueChallenge = httpsCallable<{ purpose: string }, IssueChallengeResult>(
                functions, 'issuePasskeyChallenge'
            );
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
            const verifyAssertion = httpsCallable<Record<string, unknown>, { customToken: string }>(
                functions, 'verifyPasskeyAssertion'
            );
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
            return await signInWithCustomToken(auth, customToken);
        } catch (err) {
            const e = err as { message?: string; name?: string };
            if (e.name !== 'NotAllowedError') {
                setError(e.message ?? 'Passkey authentication failed');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, [functions]);

    const clearError = useCallback(() => setError(null), []);

    return { isSupported, loading, error, registerPasskey, authenticateWithPasskey, clearError };
}
