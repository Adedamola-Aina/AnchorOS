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

// RA-01 (issue #147): the client-callable `resetRateLimit` was RETIRED.
//
// It accepted `{ action, identifier }` with the only guard being
// `identifier === request.auth.uid`, then deleted the caller's own rate-limit
// document. The client enforcement path (`enforceServerRateLimit`) consumes the
// same bucket through `checkRateLimit`, so any authenticated user could clear
// their own block and nullify the gate.
//
// Rate-limit resets are an operator concern. If a reset capability is ever
// required again it must be gated on an admin custom claim and must not be part
// of the deployed client callable surface.
