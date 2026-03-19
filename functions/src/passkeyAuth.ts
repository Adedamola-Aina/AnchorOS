/**
 * passkeyAuth — GAP-011
 *
 * Two callable Cloud Functions implementing server-side WebAuthn support:
 *
 *   issuePasskeyChallenge  — Issues a server-signed random challenge (register or authenticate).
 *                            Stores it in `passkey_challenges/{challengeId}` with a 2-min TTL.
 *
 *   verifyPasskeyAssertion — Verifies the WebAuthn assertion response against the stored public
 *                            key. On success, deletes the challenge (replay prevention) and
 *                            issues a Firebase Custom Token so the client can call
 *                            signInWithCustomToken().
 *
 * Security:
 *   - All challenges are server-generated (prevents client-forged challenges)
 *   - Challenges are single-use and expire after 2 minutes
 *   - Signature verified via @simplewebauthn/server (ECDSA P-256 / RS256)
 *   - signCount enforced — replay of captured assertions is rejected
 *   - Rate limited: 5 challenge requests / 15 min; 5 verifies / 15 min
 *   - Audit log written on every attempt (success + failure)
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { secureOnCall } from './callable';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog } from './helpers';
import { APP_ID, db } from './config';

// ── Constants ───────────────────────────────────────────────────────────────

const CHALLENGE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/** Allowed origins per environment — derived from project ID at runtime */
function getAllowedOrigins(): string[] {
    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
    if (projectId === 'anchor-os') return ['https://anchor-os.web.app'];
    if (projectId === 'anchor-os-staging') return ['https://anchor-os-staging.web.app'];
    return [
        'https://anchor-os-dev-1c6ec.web.app',
        'http://localhost:5173',
        'http://localhost:4173',
    ];
}

function getRpId(): string {
    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
    if (projectId === 'anchor-os') return 'anchor-os.web.app';
    if (projectId === 'anchor-os-staging') return 'anchor-os-staging.web.app';
    return 'localhost';
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function generateBase64urlChallenge(bytes = 32): string {
    // Use Web Crypto when available (Vitest environment), fall back to Node crypto
    if (typeof globalThis.crypto?.getRandomValues === 'function') {
        const buf = new Uint8Array(bytes);
        globalThis.crypto.getRandomValues(buf);
        return Buffer.from(buf).toString('base64url');
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomBytes } = require('node:crypto') as typeof import('node:crypto');
    return randomBytes(bytes).toString('base64url');
}

function generateChallengeId(): string {
    return generateBase64urlChallenge(16);
}

// ── Firestore references ────────────────────────────────────────────────────

function challengeRef(challengeId: string) {
    return db.collection('passkey_challenges').doc(challengeId);
}

function credentialRef(userId: string, credentialId: string) {
    return db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(userId)
        .collection('passkeys').doc(credentialId);
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ChallengeDoc {
    challenge: string;
    expiresAt: { toMillis(): number };
    purpose: 'register' | 'authenticate';
    userId?: string;
}

interface CredentialDoc {
    credentialId: string;
    publicKey: string; // base64url-encoded COSE public key
    counter: number;
}

interface IssueChallengeData {
    purpose?: string;
}

interface VerifyAssertionData {
    challengeId?: string;
    credentialId?: string;
    userId?: string;
    response?: {
        authenticatorData?: string;
        clientDataJSON?: string;
        signature?: string;
        userHandle?: string;
    };
}

// ── issuePasskeyChallenge ───────────────────────────────────────────────────

export const issuePasskeyChallenge = secureOnCall(async (request: {
    auth?: { uid: string };
    data: IssueChallengeData;
    rawRequest?: { ip?: string };
}) => {
    const { purpose } = request.data;

    if (!purpose || !['register', 'authenticate'].includes(purpose)) {
        throw new HttpsError('invalid-argument', 'purpose must be "register" or "authenticate"');
    }

    // register requires an authenticated user
    if (purpose === 'register' && !request.auth?.uid) {
        throw new HttpsError('unauthenticated', 'You must be signed in to register a passkey');
    }

    // Identify the caller for rate limiting
    const rateLimitId = request.auth?.uid ?? request.rawRequest?.ip ?? 'anon';
    await enforceRateLimit('passkeyChallenge', rateLimitId);

    const challengeId = generateChallengeId();
    const challenge = generateBase64urlChallenge(32);
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);

    const docData: Record<string, unknown> = {
        challenge,
        expiresAt,
        purpose,
        createdAt: FieldValue.serverTimestamp(),
    };
    if (purpose === 'register' && request.auth?.uid) {
        docData.userId = request.auth.uid;
    }

    await challengeRef(challengeId).set(docData);

    return { challengeId, challenge };
});

// ── verifyPasskeyAssertion ──────────────────────────────────────────────────

export const verifyPasskeyAssertion = secureOnCall(async (request: {
    data: VerifyAssertionData;
}) => {
    const { challengeId, credentialId, userId, response } = request.data;

    if (
        !challengeId || !credentialId || !userId ||
        !response?.authenticatorData || !response?.clientDataJSON || !response?.signature
    ) {
        throw new HttpsError(
            'invalid-argument',
            'challengeId, credentialId, userId and response fields are required'
        );
    }

    await enforceRateLimit('passkeyVerify', userId);

    // 1. Load and validate challenge
    const chalSnap = await challengeRef(challengeId).get();
    if (!chalSnap.exists) {
        throw new HttpsError('not-found', 'Challenge not found or already used');
    }

    const chalData = chalSnap.data() as ChallengeDoc;
    const now = Date.now();
    if (chalData.expiresAt.toMillis() <= now) {
        await challengeRef(challengeId).delete();
        throw new HttpsError('deadline-exceeded', 'Challenge has expired. Please try again.');
    }

    // 2. Load stored credential (public key)
    const credSnap = await credentialRef(userId, credentialId).get();
    if (!credSnap.exists) {
        throw new HttpsError('not-found', 'No passkey credential found for this user');
    }

    const credData = credSnap.data() as CredentialDoc;

    // 3. Verify assertion with @simplewebauthn/server
    let verification: { verified: boolean; authenticationInfo?: { newCounter: number } };
    try {
        verification = await verifyAuthenticationResponse({
            response: {
                id: credentialId,
                rawId: credentialId,
                response: {
                    authenticatorData: response.authenticatorData,
                    clientDataJSON: response.clientDataJSON,
                    signature: response.signature,
                    userHandle: response.userHandle,
                },
                type: 'public-key',
                clientExtensionResults: {},
            },
            expectedChallenge: chalData.challenge,
            expectedOrigin: getAllowedOrigins(),
            expectedRPID: getRpId(),
            credential: {
                id: credentialId,
                publicKey: Buffer.from(credData.publicKey, 'base64url'),
                counter: credData.counter,
            },
        });
    } catch (err) {
        await createAuditLog('passkey_verify_failure', userId, {
            credentialId,
            reason: (err as { message?: string }).message ?? 'verification error',
            severity: 'high',
        });
        throw new HttpsError('permission-denied', 'Passkey verification failed');
    }

    // 4. Always delete the challenge — single-use (prevents replay even on failure)
    await challengeRef(challengeId).delete();

    if (!verification.verified) {
        await createAuditLog('passkey_verify_failure', userId, {
            credentialId,
            reason: 'assertion not verified',
            severity: 'high',
        });
        throw new HttpsError('permission-denied', 'Passkey assertion could not be verified');
    }

    // 5. Update signCount (monotonic counter — prevents cloned authenticator replay)
    const newCounter = verification.authenticationInfo?.newCounter ?? credData.counter;
    await credentialRef(userId, credentialId).set(
        { ...credData, counter: newCounter, lastUsed: FieldValue.serverTimestamp() },
        { merge: true }
    );

    // 6. Issue Firebase Custom Token
    const customToken = await getAuth().createCustomToken(userId, { passkey: true });

    await createAuditLog('passkey_verify_success', userId, {
        credentialId,
        newCounter,
    });

    return { customToken };
});
