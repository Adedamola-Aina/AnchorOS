// @ts-nocheck
// 
// 
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
    accountCreate:       { maxAttempts: 10,  windowMs: DAY,      blockDurationMs: HOUR },
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
    recordAuthEvent:     { maxAttempts: 30,  windowMs: HOUR,     blockDurationMs: 15 * MIN },
    reportUnrecognisedSignIn: { maxAttempts: 5, windowMs: HOUR,  blockDurationMs: HOUR },
    dismissAuthEvent:    { maxAttempts: 30,  windowMs: HOUR,     blockDurationMs: 15 * MIN },
    revokeSession:       { maxAttempts: 10,  windowMs: HOUR,     blockDurationMs: HOUR },
    deviceAttestation:   { maxAttempts: 30,  windowMs: HOUR,     blockDurationMs: 30 * MIN },
    emailSync:           { maxAttempts: 15,  windowMs: HOUR,     blockDurationMs: 15 * MIN },
    // Passkey (WebAuthn) — GAP-011
    passkeyChallenge:    { maxAttempts: 10,  windowMs: 15 * MIN, blockDurationMs: HOUR },
    passkeyVerify:       { maxAttempts: 5,   windowMs: 15 * MIN, blockDurationMs: HOUR },
};

interface RateLimitDecision {
    outcome: 'allowed' | 'blocked' | 'exceeded';
    remainingMin?: number;
    blockedUntilIso?: string;
    attempts?: number;
    maxAttempts?: number;
    blockedForMinutes?: number;
    warning: boolean;
}

async function safeAudit(action: string, identifier: string, metadata: Record<string, unknown>): Promise<void> {
    try {
        await createAuditLog(action, identifier, metadata);
    } catch (error) {
        console.error('[RateLimit] Audit logging failed:', error);
    }
}

export async function enforceRateLimit(action: string, identifier: string): Promise<void> {
    const config = RATE_LIMITS[action];
    if (!config) {
        throw new HttpsError('invalid-argument', `Unknown rate limit action: ${action}`);
    }

    const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
    const now = Date.now();

    try {
        const decision = await db.runTransaction<RateLimitDecision>(async (transaction) => {
            const doc = await transaction.get(rateLimitRef);
            const docData = doc.data();

            if (docData?.blockedUntil && docData.blockedUntil > now) {
                const remainingMs = docData.blockedUntil - now;
                const remainingMin = Math.ceil(remainingMs / 60000);
                return {
                    outcome: 'blocked',
                    remainingMin,
                    blockedUntilIso: new Date(docData.blockedUntil).toISOString(),
                    warning: false,
                };
            }

            const windowStart = now - config.windowMs;
            const attempts = (docData?.attempts || [])
                .filter((ts: number) => Number.isFinite(ts))
                .filter((ts: number) => ts > windowStart);

            if (attempts.length >= config.maxAttempts) {
                const blockedUntil = now + config.blockDurationMs;
                transaction.set(rateLimitRef, { attempts: [], blockedUntil, lastAttempt: now });
                return {
                    outcome: 'exceeded',
                    attempts: attempts.length,
                    maxAttempts: config.maxAttempts,
                    blockedForMinutes: Math.ceil(config.blockDurationMs / 60000),
                    warning: false,
                };
            }

            const warningThreshold = Math.floor(config.maxAttempts * 0.8);
            const warning = attempts.length >= warningThreshold && attempts.length < config.maxAttempts;

            attempts.push(now);
            transaction.set(rateLimitRef, { attempts, blockedUntil: null, lastAttempt: now });
            return { outcome: 'allowed', warning, attempts: attempts.length, maxAttempts: config.maxAttempts };
        });

        if (decision.warning) {
            await safeAudit('rate_limit_warning', identifier, {
                action,
                attempts: decision.attempts,
                maxAttempts: decision.maxAttempts,
                severity: 'medium',
            });
        }

        if (decision.outcome === 'blocked') {
            await safeAudit('rate_limit_blocked', identifier, {
                action,
                remainingMinutes: decision.remainingMin,
                blockedUntil: decision.blockedUntilIso,
                severity: 'high',
            });
            throw new HttpsError(
                'resource-exhausted',
                `Too many attempts. Please try again in ${decision.remainingMin} minute(s).`,
            );
        }

        if (decision.outcome === 'exceeded') {
            await safeAudit('rate_limit_exceeded', identifier, {
                action,
                attempts: decision.attempts,
                maxAttempts: decision.maxAttempts,
                blockedForMinutes: decision.blockedForMinutes,
                severity: 'critical',
            });
            throw new HttpsError(
                'resource-exhausted',
                'Rate limit exceeded. You have been temporarily blocked.',
            );
        }
    } catch (error) {
        if (error instanceof HttpsError) throw error;
        console.error('[RateLimit] Enforcement failed:', error);
        throw new HttpsError('internal', 'Unable to validate rate limit. Please try again.');
    }
}

export { checkRateLimit, resetRateLimit } from './rateLimitCallables';
