/**
 * usePasskeyAuth — AUTH-002
 *
 * WebAuthn passkey support: register a platform authenticator and
 * authenticate with it. The credential is stored client-side in the
 * browser's credential store; the Firestore record only stores the
 * credential ID (never private key material).
 *
 * Flow:
 *   Register:     credential.create → store credentialId in Firestore
 *   Authenticate: credential.get → verify locally → Firebase Custom Token
 *
 * Security:
 *   - Private key never leaves the device (WebAuthn spec guarantee)
 *   - credentialId stored in Firestore is not secret (public identifier)
 *   - Full server-side verification requires a Cloud Function (future FEAT)
 */

import { useState, useCallback } from 'react';

const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'anchor-os.web.app';
const RP_NAME = 'Anchor OS';
const CHALLENGE_BYTES = 32;

function randomChallenge(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(CHALLENGE_BYTES));
}

function bufferToBase64url(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

interface PasskeyAuthResult {
    isSupported: boolean;
    loading: boolean;
    error: string | null;
    registerPasskey: (userId: string, email: string, displayName: string) => Promise<string | null>;
    authenticateWithPasskey: (credentialId?: string) => Promise<PublicKeyCredential | null>;
    clearError: () => void;
}

export function usePasskeyAuth(): PasskeyAuthResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported =
        typeof window !== 'undefined' &&
        typeof navigator.credentials?.create === 'function';

    /**
     * Register a new passkey for the given user.
     * Returns the base64url-encoded credentialId on success (store in Firestore).
     */
    const registerPasskey = useCallback(async (
        userId: string,
        email: string,
        displayName: string
    ): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            const challenge = randomChallenge();
            const userIdBytes = new TextEncoder().encode(userId);

            const credential = await navigator.credentials.create({
                publicKey: {
                    rp: { id: RP_ID, name: RP_NAME },
                    user: { id: userIdBytes, name: email, displayName },
                    challenge,
                    pubKeyCredParams: [
                        { type: 'public-key', alg: -7 },  // ES256
                        { type: 'public-key', alg: -257 }, // RS256
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: 'platform',
                        residentKey: 'required',
                        userVerification: 'required',
                    },
                    timeout: 60_000,
                    attestation: 'none',
                },
            }) as PublicKeyCredential | null;

            if (!credential) return null;
            return bufferToBase64url(credential.rawId);
        } catch (err) {
            const e = err as { message?: string; name?: string };
            if (e.name !== 'NotAllowedError') {
                setError(e.message ?? 'Passkey registration failed');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Authenticate using an existing passkey.
     * Optionally pass a credentialId to restrict which credential to use.
     */
    const authenticateWithPasskey = useCallback(async (
        credentialId?: string
    ): Promise<PublicKeyCredential | null> => {
        setLoading(true);
        setError(null);
        try {
            const challenge = randomChallenge();
            const allowCredentials: PublicKeyCredentialDescriptor[] = credentialId
                ? [{ type: 'public-key', id: Uint8Array.from(atob(credentialId.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)) }]
                : [];

            const assertion = await navigator.credentials.get({
                publicKey: {
                    rpId: RP_ID,
                    challenge,
                    allowCredentials,
                    userVerification: 'required',
                    timeout: 60_000,
                },
            }) as PublicKeyCredential | null;

            return assertion;
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

    return { isSupported, loading, error, registerPasskey, authenticateWithPasskey, clearError };
}
