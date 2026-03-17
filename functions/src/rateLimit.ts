import { HttpsError } from 'firebase-functions/v2/https';
import { db } from './config';
import { createAuditLog } from './helpers';
import type { RateLimitConfig } from './types';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
    auth:                { maxAttempts: 5,   windowMs: 15 * MIN, blockDurationMs: HOUR },
    invite:              { maxAttempts: 10,  windowMs: DAY,      blockDurationMs: DAY },
    shareAccount:        { maxAttempts: 20,  windowMs: HOUR,     blockDurationMs: 30 * MIN },
    getSharedAccounts:   { maxAttempts: 60,  windowMs: MIN,      blockDurationMs: 5 * MIN },
    tokenValidation:     { maxAttempts: 10,  windowMs: HOUR,     blockDurationMs: HOUR },
    codeVerification:    { maxAttempts: 5,   windowMs: 15 * MIN, blockDurationMs: HOUR },
    disconnectFamily:    { maxAttempts: 3,   windowMs: HOUR,     blockDurationMs: DAY },
    emailSend:           { maxAttempts: 5,   windowMs: HOUR,     blockDurationMs: HOUR },
    transactionCreate:   { maxAttempts: 100, windowMs: HOUR,     blockDurationMs: 15 * MIN },
    revokeInvitation:    { maxAttempts: 5,   windowMs: HOUR,     blockDurationMs: HOUR },
    createInvitation:    { maxAttempts: 5,   windowMs: HOUR,     blockDurationMs: HOUR },
    getNotifications:    { maxAttempts: 60,  windowMs: MIN,      blockDurationMs: 5 * MIN },
    dismissNotification: { maxAttempts: 30,  windowMs: MIN,      blockDurationMs: 5 * MIN },
    commitmentCreate:    { maxAttempts: 20,  windowMs: DAY,      blockDurationMs: HOUR },
    passwordReset:       { maxAttempts: 3,   windowMs: HOUR,     blockDurationMs: HOUR },
    deleteAccount:       { maxAttempts: 2,   windowMs: DAY,      blockDurationMs: DAY },
    mfaRecovery:         { maxAttempts: 5,   windowMs: HOUR,     blockDurationMs: HOUR },
    auditLog:            { maxAttempts: 120, windowMs: HOUR,     blockDurationMs: 10 * MIN },
    familyMigration:     { maxAttempts: 1,   windowMs: DAY,      blockDurationMs: DAY },
    scopeMigration:      { maxAttempts: 3,   windowMs: DAY,      blockDurationMs: HOUR },
    bankLink:            { maxAttempts: 5,   windowMs: HOUR,     blockDurationMs: HOUR },
    bankUnlink:          { maxAttempts: 3,   windowMs: DAY,      blockDurationMs: DAY },
    bankSync:            { maxAttempts: 10,  windowMs: DAY,      blockDurationMs: HOUR },
    recurringCreate:     { maxAttempts: 30,  windowMs: DAY,      blockDurationMs: HOUR },
    recurringUpdate:     { maxAttempts: 60,  windowMs: HOUR,     blockDurationMs: 15 * MIN },
    recurringDelete:     { maxAttempts: 20,  windowMs: DAY,      blockDurationMs: HOUR },
    feedbackSubmit:      { maxAttempts: 5,   windowMs: HOUR,     blockDurationMs: HOUR },
};

export async function enforceRateLimit(action: string, identifier: string): Promise<void> {
    const config = RATE_LIMITS[action];
    if (!config) {
        throw new HttpsError('invalid-argument', `Unknown rate limit action: ${action}`);
    }

    const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
    const now = Date.now();

    try {
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(rateLimitRef);
            const docData = doc.data();

            if (docData?.blockedUntil && docData.blockedUntil > now) {
                const remainingMs = docData.blockedUntil - now;
                const remainingMin = Math.ceil(remainingMs / 60000);

                await createAuditLog('rate_limit_blocked', identifier, {
                    action, remainingMinutes: remainingMin,
                    blockedUntil: new Date(docData.blockedUntil).toISOString(),
                    severity: 'high',
                });

                throw new HttpsError(
                    'resource-exhausted',
                    `Too many attempts. Please try again in ${remainingMin} minute(s).`
                );
            }

            const windowStart = now - config.windowMs;
            const attempts = (docData?.attempts || [])
                .filter((ts: number) => Number.isFinite(ts))
                .filter((ts: number) => ts > windowStart);

            if (attempts.length >= config.maxAttempts) {
                const blockedUntil = now + config.blockDurationMs;
                transaction.set(rateLimitRef, { attempts: [], blockedUntil, lastAttempt: now });

                await createAuditLog('rate_limit_exceeded', identifier, {
                    action, attempts: attempts.length, maxAttempts: config.maxAttempts,
                    blockedForMinutes: Math.ceil(config.blockDurationMs / 60000),
                    severity: 'critical',
                });

                throw new HttpsError(
                    'resource-exhausted',
                    'Rate limit exceeded. You have been temporarily blocked.'
                );
            }

            const warningThreshold = Math.floor(config.maxAttempts * 0.8);
            if (attempts.length >= warningThreshold && attempts.length < config.maxAttempts) {
                await createAuditLog('rate_limit_warning', identifier, {
                    action, attempts: attempts.length + 1, maxAttempts: config.maxAttempts,
                    severity: 'medium',
                });
            }

            attempts.push(now);
            transaction.set(rateLimitRef, { attempts, blockedUntil: null, lastAttempt: now });
        });
    } catch (error) {
        if (error instanceof HttpsError) throw error;
        console.error('[RateLimit] Enforcement failed:', error);
        throw new HttpsError('internal', 'Unable to validate rate limit. Please try again.');
    }
}

export { checkRateLimit, resetRateLimit } from './rateLimitCallables';
