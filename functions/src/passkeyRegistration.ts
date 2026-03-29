/**\n * passkeyRegistration — GAP-011\n * Cloud Functions: completePasskeyRegistration, deletePasskey\n * Server-side WebAuthn attestation verification + passkey lifecycle management.\n */

import { HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { secureOnCall } from './callable';
import { createAuditLog } from './helpers';
import { APP_ID, db } from './config';

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
    return 'anchor-os-dev-1c6ec.web.app';
}

function challengeRef(challengeId: string) {
    return db.collection('passkey_challenges').doc(challengeId);
}

function credentialRef(userId: string, credentialId: string) {
    return db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(userId)
        .collection('passkeys').doc(credentialId);
}

interface CompleteRegistrationData {
    challengeId?: string;
    credential?: {
        id?: string;
        rawId?: string;
        response?: {
            clientDataJSON?: string;
            attestationObject?: string;
        };
        type?: string;
        authenticatorAttachment?: string;
    };
}

interface ChallengeDoc {
    challenge: string;
    expiresAt: { toMillis(): number };
    purpose: 'register' | 'authenticate';
    userId?: string;
}

export const completePasskeyRegistration = secureOnCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError('unauthenticated', 'You must be signed in to register a passkey');
    }

    const { challengeId, credential } = request.data as CompleteRegistrationData;

    if (
        !challengeId ||
        !credential?.id || !credential?.rawId ||
        !credential?.response?.clientDataJSON ||
        !credential?.response?.attestationObject
    ) {
        throw new HttpsError(
            'invalid-argument',
            'challengeId and full credential response are required',
        );
    }

    // 1. Load and validate challenge
    const chalSnap = await challengeRef(challengeId).get();
    if (!chalSnap.exists) {
        throw new HttpsError('not-found', 'Challenge not found or already used');
    }

    const chalData = chalSnap.data() as ChallengeDoc;

    if (chalData.purpose !== 'register') {
        throw new HttpsError('invalid-argument', 'Challenge was not issued for registration');
    }

    if (chalData.userId && chalData.userId !== uid) {
        throw new HttpsError('permission-denied', 'Challenge was issued to a different user');
    }

    if (chalData.expiresAt.toMillis() <= Date.now()) {
        await challengeRef(challengeId).delete();
        throw new HttpsError('deadline-exceeded', 'Challenge has expired. Please try again.');
    }

    // 2. Verify attestation with @simplewebauthn/server
    let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
    try {
        verification = await verifyRegistrationResponse({
            response: {
                id: credential.id,
                rawId: credential.rawId,
                response: {
                    clientDataJSON: credential.response.clientDataJSON,
                    attestationObject: credential.response.attestationObject,
                },
                type: 'public-key',
                clientExtensionResults: {},
                authenticatorAttachment: credential.authenticatorAttachment as
                    'platform' | 'cross-platform' | undefined,
            },
            expectedChallenge: chalData.challenge,
            expectedOrigin: getAllowedOrigins(),
            expectedRPID: getRpId(),
        });
    } catch (err) {
        await challengeRef(challengeId).delete();
        await createAuditLog('passkey_register_failure', uid, {
            credentialId: credential.id,
            reason: (err as { message?: string }).message ?? 'attestation verification error',
            severity: 'high',
        });
        throw new HttpsError('permission-denied', 'Passkey attestation verification failed');
    }

    // 3. Always delete challenge — single use
    await challengeRef(challengeId).delete();

    if (!verification.verified || !verification.registrationInfo) {
        await createAuditLog('passkey_register_failure', uid, {
            credentialId: credential.id,
            reason: 'attestation not verified',
            severity: 'high',
        });
        throw new HttpsError('permission-denied', 'Passkey registration could not be verified');
    }

    // 4. Store the credential public key in Firestore
    const { credential: webauthnCred } = verification.registrationInfo;
    const passkeysCol = db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(uid)
        .collection('passkeys');
    const existing = await passkeysCol.limit(3).get();
    if (existing.size >= 2) {
        throw new HttpsError('failed-precondition', 'Maximum of 2 passkeys allowed');
    }

    await credentialRef(uid, webauthnCred.id).set({
        credentialId: webauthnCred.id,
        publicKey: Buffer.from(webauthnCred.publicKey).toString('base64url'),
        counter: webauthnCred.counter,
        createdAt: FieldValue.serverTimestamp(),
    });

    await createAuditLog('passkey_register_success', uid, {
        credentialId: webauthnCred.id,
    });

    return { credentialId: webauthnCred.id };
});

/**
 * Delete a passkey credential by ID.
 * Only the owning user can remove their own passkey.
 */
export const deletePasskey = secureOnCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError('unauthenticated', 'You must be signed in to delete a passkey');
    }

    const { credentialId } = request.data as { credentialId?: string };
    if (!credentialId) {
        throw new HttpsError('invalid-argument', 'credentialId is required');
    }

    const credRef = credentialRef(uid, credentialId);
    const snap = await credRef.get();
    if (!snap.exists) {
        throw new HttpsError('not-found', 'Passkey credential not found');
    }

    await credRef.delete();

    await createAuditLog('passkey_deleted', uid, { credentialId });

    return { success: true };
});
