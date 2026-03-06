// @ts-nocheck

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createHash } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { APP_ID, db } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog } from './helpers';

interface RecoveryDoc {
    hashedCodes?: string[];
    codesRemaining?: number;
}

export function normalizeRecoveryCode(code: string): string {
    return code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function hashRecoveryCode(normalizedCode: string): string {
    return createHash('sha256').update(normalizedCode).digest('hex');
}

export function consumeRecoveryCodeHash(hashedCodes: string[], codeHash: string): string[] | null {
    const index = hashedCodes.indexOf(codeHash);
    if (index < 0) {
        return null;
    }

    return hashedCodes.filter((_, i) => i !== index);
}

export const recoverMfaWithCode = onCall(async (request) => {
    const { email, recoveryCode } = request.data as { email?: string; recoveryCode?: string };
    if (!email || !recoveryCode) {
        throw new HttpsError('invalid-argument', 'Email and recovery code are required');
    }

    const normalizedCode = normalizeRecoveryCode(recoveryCode);
    if (normalizedCode.length !== 8) {
        throw new HttpsError('invalid-argument', 'Recovery code must be 8 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();
    await enforceRateLimit('mfaRecovery', normalizedEmail);

    let userRecord;
    try {
        userRecord = await getAuth().getUserByEmail(normalizedEmail);
    } catch {
        throw new HttpsError('permission-denied', 'Invalid recovery credentials');
    }

    const recoveryRef = db.collection('artifacts').doc(APP_ID)
        .collection('users').doc(userRecord.uid)
        .collection('security').doc('mfaRecovery');

    const recoverySnapshot = await recoveryRef.get();
    if (!recoverySnapshot.exists) {
        throw new HttpsError('failed-precondition', 'No recovery codes are available for this account');
    }

    const recoveryData = (recoverySnapshot.data() || {}) as RecoveryDoc;
    const hashedCodes = Array.isArray(recoveryData.hashedCodes) ? recoveryData.hashedCodes : [];

    const codeHash = hashRecoveryCode(normalizedCode);
    const remainingCodes = consumeRecoveryCodeHash(hashedCodes, codeHash);

    if (!remainingCodes) {
        throw new HttpsError('permission-denied', 'Invalid recovery credentials');
    }

    try {
        await getAuth().updateUser(userRecord.uid, {
            multiFactor: {
                enrolledFactors: [],
            },
        });
    } catch {
        throw new HttpsError('internal', 'Failed to reset MFA. Please try again or contact support.');
    }

    await recoveryRef.set({
        hashedCodes: remainingCodes,
        codesRemaining: remainingCodes.length,
        lastUsedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    await createAuditLog('mfa_recovery_used', userRecord.uid, {
        email: normalizedEmail,
        codesRemaining: remainingCodes.length,
    });

    return {
        success: true,
        mfaReset: true,
        codesRemaining: remainingCodes.length,
    };
});
