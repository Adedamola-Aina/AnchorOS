/**
 * passkeyUtils — AUTH-002, GAP-011
 *
 * Shared constants, encoding helpers, and browser-side WebAuthn
 * registration flow for passkey operations.
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase';

export const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'anchor-os.web.app';
export const RP_NAME = 'Anchor OS';

export function bufferToBase64url(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function base64urlToBuffer(b64: string): Uint8Array<ArrayBuffer> {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const len = binary.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) buf[i] = binary.charCodeAt(i);
    return buf;
}

interface IssueChallengeResult { challengeId: string; challenge: string; }

/**
 * Runs the full browser-side WebAuthn registration flow:
 * 1. Fetches server challenge
 * 2. Calls navigator.credentials.create
 * 3. Sends attestation to server for verification
 * Returns credentialId on success, null on user cancel.
 */
export async function performPasskeyRegistration(
    userId: string,
    email: string,
    displayName: string,
): Promise<string | null> {
    const issueChallenge = httpsCallable<{ purpose: string }, IssueChallengeResult>(
        functions, 'issuePasskeyChallenge'
    );
    const { data: { challengeId, challenge } } = await issueChallenge({ purpose: 'register' });

    const credential = await navigator.credentials.create({
        publicKey: {
            rp: { id: RP_ID, name: RP_NAME },
            user: { id: new TextEncoder().encode(userId), name: email, displayName },
            challenge: base64urlToBuffer(challenge),
            pubKeyCredParams: [
                { type: 'public-key', alg: -7 },   // ES256
                { type: 'public-key', alg: -257 }, // RS256
            ],
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'required',
            },
            timeout: 60_000,
            attestation: 'none',
        },
    }) as PublicKeyCredential | null;

    if (!credential) return null;

    const resp = credential.response as AuthenticatorAttestationResponse;
    const completeRegistration = httpsCallable<Record<string, unknown>, { credentialId: string }>(
        functions, 'completePasskeyRegistration'
    );
    const { data: { credentialId } } = await completeRegistration({
        challengeId,
        credential: {
            id: credential.id,
            rawId: bufferToBase64url(credential.rawId),
            response: {
                clientDataJSON: bufferToBase64url(resp.clientDataJSON),
                attestationObject: bufferToBase64url(resp.attestationObject),
            },
            type: credential.type,
            authenticatorAttachment: credential.authenticatorAttachment ?? undefined,
        },
    });
    return credentialId;
}
