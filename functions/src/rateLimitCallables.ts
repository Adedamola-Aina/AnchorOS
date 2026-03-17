import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db } from './config';
import { RATE_LIMITS } from './rateLimit';

export const checkRateLimit = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { action, identifier } = request.data as { action: string; identifier: string };

        if (!action || !identifier) {
            throw new HttpsError('invalid-argument', 'Action and identifier are required');
        }

        if (identifier !== request.auth.uid) {
            throw new HttpsError('permission-denied', 'You can only check your own rate limit');
        }

        const config = RATE_LIMITS[action];
        if (!config) {
            throw new HttpsError('invalid-argument', `Unknown rate limit action: ${action}`);
        }

        const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
        const now = Date.now();

        try {
            const result = await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(rateLimitRef);
                const docData = doc.data();

                if (docData?.blockedUntil && docData.blockedUntil > now) {
                    return {
                        allowed: false,
                        blockedUntil: docData.blockedUntil,
                        reason: 'Too many attempts. Please try again later.',
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
                        allowed: false, blockedUntil,
                        reason: 'Rate limit exceeded. You have been temporarily blocked.',
                    };
                }

                attempts.push(now);
                transaction.set(rateLimitRef, { attempts, blockedUntil: null, lastAttempt: now });
                return { allowed: true, remainingAttempts: config.maxAttempts - attempts.length };
            });

            return result;
        } catch (error) {
            console.error('Rate limit check failed:', error);
            throw new HttpsError('internal', 'Unable to validate rate limit');
        }
    }
);

export const resetRateLimit = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { action, identifier } = request.data as { action: string; identifier: string };
        if (!action || !identifier) {
            throw new HttpsError('invalid-argument', 'Action and identifier are required');
        }

        if (!RATE_LIMITS[action]) {
            throw new HttpsError('invalid-argument', `Unknown rate limit action: ${action}`);
        }

        if (identifier !== request.auth.uid) {
            throw new HttpsError('permission-denied', 'You can only reset your own rate limit');
        }

        const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
        await rateLimitRef.delete();

        return { success: true };
    }
);
