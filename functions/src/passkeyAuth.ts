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

// 

// 

// 


import { HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { secureOnCall } from './callable';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog } from './helpers';
import {
    CHALLENGE_TTL_MS,
    getAllowedOrigins,
    getRpId,
    generateBase64urlChallenge,
    generateChallengeId,
    challengeRef,
    credentialRef,
    findCredentialByCredentialId,
    FieldValue,
    type ChallengeDoc,
    type CredentialDoc,
    type IssueChallengeData,
    type VerifyAssertionData,
} from './passkeyAuthHelpers';

// ── issuePasskeyChallenge ───────────────────────────────────────────────────

export const issuePasskeyChallenge = secureOnCall(async (request) => {
    const { purpose } = request.data as IssueChallengeData;

    if (!purpose || !['register', 'authenticate'].includes(purpose)) {
        throw new HttpsError('invalid-argument', 'purpose must be "register" or "authenticate"');
    }

    if (purpose === 'register' && !request.auth?.uid) {
        throw new HttpsError('unauthenticated', 'You must be signed in to register a passkey');
    }

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

export const verifyPasskeyAssertion = secureOnCall(async (request) => {
    const { challengeId, credentialId, userId, response } = request.data as VerifyAssertionData;

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

    // Registration challenges authenticate an already signed-in user and must
    // never be usable to mint a custom token. Consume a mismatched challenge
    // so it cannot be retried against another endpoint.
    if (chalData.purpose !== 'authenticate') {
        await challengeRef(challengeId).delete();
        throw new HttpsError('invalid-argument', 'Challenge was not issued for authentication');
    }

    let credSnap = await credentialRef(userId, credentialId).get();
    let resolvedUserId = userId;

    if (!credSnap.exists) {
        // userHandle may have been absent on the client; try collection-group fallback
        const fallback = await findCredentialByCredentialId(credentialId);
        if (!fallback) {
            throw new HttpsError('not-found', 'No passkey credential found for this user');
        }
        credSnap = { exists: true, data: () => fallback.data } as unknown as typeof credSnap;
        resolvedUserId = fallback.userId;
    }

    const credData = credSnap.data() as CredentialDoc;

    // Defensive: ensure publicKey is a proper base64url string before conversion
    if (!credData.publicKey || typeof credData.publicKey !== 'string') {
        throw new HttpsError('internal', 'Stored credential has an invalid public key format');
    }

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
        await createAuditLog('passkey_verify_failure', resolvedUserId, {
            credentialId,
            reason: (err as { message?: string }).message ?? 'verification error',
            severity: 'high',
        });
        throw new HttpsError('permission-denied', 'Passkey verification failed');
    }

    await challengeRef(challengeId).delete();

    if (!verification.verified) {
        await createAuditLog('passkey_verify_failure', resolvedUserId, {
            credentialId,
            reason: 'assertion not verified',
            severity: 'high',
        });
        throw new HttpsError('permission-denied', 'Passkey assertion could not be verified');
    }

    const newCounter = verification.authenticationInfo?.newCounter ?? credData.counter;
    await credentialRef(resolvedUserId, credentialId).set(
        { ...credData, counter: newCounter, lastUsed: FieldValue.serverTimestamp() },
        { merge: true }
    );

    const customToken = await getAuth().createCustomToken(resolvedUserId, { passkey: true });

    await createAuditLog('passkey_verify_success', resolvedUserId, {
        credentialId,
        newCounter,
    });

    return { customToken };
});
