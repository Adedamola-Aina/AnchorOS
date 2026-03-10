import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createHash } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { APP_ID, db } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog } from './helpers';

const BCRYPT_ROUNDS = 10;

interface RecoveryDoc {
    hashedCodes?: string[];
    codesRemaining?: number;
}

export function normalizeRecoveryCode(code: string): string {
    return code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Hash a recovery code using bcrypt with embedded per-code salt.
 * Use this for all new code generation.
 */
export async function hashRecoveryCode(normalizedCode: string): Promise<string> {
    return bcrypt.hash(normalizedCode, BCRYPT_ROUNDS);
}

/**
 * Legacy SHA256 hash — only used to verify codes stored before the bcrypt migration.
 * @deprecated New codes must be hashed with hashRecoveryCode (bcrypt).
 */
function legacyHashCode(normalizedCode: string): string {
    return createHash('sha256').update(normalizedCode).digest('hex');
}

/**
 * Find a matching recovery code and return the remaining list after removing it.
 * Tries bcrypt (hashes starting with $2) then falls back to legacy SHA256 for
 * codes generated before the migration.
 */
export async function consumeRecoveryCode(hashedCodes: string[], plainCode: string): Promise<string[] | null> {
    for (let i = 0; i < hashedCodes.length; i++) {
        const stored = hashedCodes[i];
        let matches = false;

        if (stored.startsWith('$2')) {
            // bcrypt — constant-time comparison is built in
            matches = await bcrypt.compare(plainCode, stored);
        } else {
            // Legacy SHA256 — manual constant-time comparison
            const expected = legacyHashCode(plainCode);
            if (expected.length === stored.length) {
                let diff = 0;
                for (let j = 0; j < expected.length; j++) {
                    diff |= expected.charCodeAt(j) ^ stored.charCodeAt(j);
                }
                matches = diff === 0;
            }
        }

        if (matches) {
            return hashedCodes.filter((_, idx) => idx !== i);
        }
    }
    return null;
}

/**
 * @deprecated Synchronous SHA256 path. Kept only for existing tests during migration window.
 */
export function consumeRecoveryCodeHash(hashedCodes: string[], codeHash: string): string[] | null {
    const index = hashedCodes.indexOf(codeHash);
    if (index < 0) return null;
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

    const remainingCodes = await consumeRecoveryCode(hashedCodes, normalizedCode);

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

    // Do not log the email — avoid unnecessary PII in audit trail
    await createAuditLog('mfa_recovery_used', userRecord.uid, {
        codesRemaining: remainingCodes.length,
    });

    return {
        success: true,
        mfaReset: true,
        codesRemaining: remainingCodes.length,
    };
});
