"use strict";
/**
 * Rate Limiting — configuration, enforcement, and public API
 *
 * Protects all Cloud Functions from abuse with per-action rate limits.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRateLimit = exports.checkRateLimit = exports.RATE_LIMITS = void 0;
exports.enforceRateLimit = enforceRateLimit;
const https_1 = require("firebase-functions/v2/https");
const config_1 = require("./config");
const helpers_1 = require("./helpers");
// ============================================================================
// Rate Limit Configuration
// ============================================================================
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
exports.RATE_LIMITS = {
    auth: { maxAttempts: 5, windowMs: 15 * MIN, blockDurationMs: HOUR },
    invite: { maxAttempts: 10, windowMs: DAY, blockDurationMs: DAY },
    shareAccount: { maxAttempts: 20, windowMs: HOUR, blockDurationMs: 30 * MIN },
    tokenValidation: { maxAttempts: 10, windowMs: HOUR, blockDurationMs: HOUR },
    codeVerification: { maxAttempts: 5, windowMs: 15 * MIN, blockDurationMs: HOUR },
    disconnectFamily: { maxAttempts: 3, windowMs: HOUR, blockDurationMs: DAY },
    emailSend: { maxAttempts: 5, windowMs: HOUR, blockDurationMs: HOUR },
    transactionCreate: { maxAttempts: 100, windowMs: HOUR, blockDurationMs: 15 * MIN },
    revokeInvitation: { maxAttempts: 5, windowMs: HOUR, blockDurationMs: HOUR },
    createInvitation: { maxAttempts: 5, windowMs: HOUR, blockDurationMs: HOUR },
    getNotifications: { maxAttempts: 60, windowMs: MIN, blockDurationMs: 5 * MIN },
    dismissNotification: { maxAttempts: 30, windowMs: MIN, blockDurationMs: 5 * MIN },
    commitmentCreate: { maxAttempts: 20, windowMs: DAY, blockDurationMs: HOUR },
    passwordReset: { maxAttempts: 3, windowMs: HOUR, blockDurationMs: HOUR },
};
// ============================================================================
// Internal enforcement (used by other modules)
// ============================================================================
async function enforceRateLimit(action, identifier) {
    const config = exports.RATE_LIMITS[action];
    if (!config) {
        console.warn(`[RateLimit] Unknown action: ${action}. Skipping enforcement.`);
        return;
    }
    const rateLimitRef = config_1.db.collection('rateLimits').doc(`${action}:${identifier}`);
    const now = Date.now();
    try {
        await config_1.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(rateLimitRef);
            const docData = doc.data();
            if (docData?.blockedUntil && docData.blockedUntil > now) {
                const remainingMs = docData.blockedUntil - now;
                const remainingMin = Math.ceil(remainingMs / 60000);
                await (0, helpers_1.createAuditLog)('rate_limit_blocked', identifier, {
                    action, remainingMinutes: remainingMin,
                    blockedUntil: new Date(docData.blockedUntil).toISOString(),
                    severity: 'high',
                });
                throw new https_1.HttpsError('resource-exhausted', `Too many attempts. Please try again in ${remainingMin} minute(s).`);
            }
            const windowStart = now - config.windowMs;
            const attempts = (docData?.attempts || []).filter((ts) => ts > windowStart);
            if (attempts.length >= config.maxAttempts) {
                const blockedUntil = now + config.blockDurationMs;
                transaction.set(rateLimitRef, { attempts: [], blockedUntil, lastAttempt: now });
                await (0, helpers_1.createAuditLog)('rate_limit_exceeded', identifier, {
                    action, attempts: attempts.length, maxAttempts: config.maxAttempts,
                    blockedForMinutes: Math.ceil(config.blockDurationMs / 60000),
                    severity: 'critical',
                });
                throw new https_1.HttpsError('resource-exhausted', 'Rate limit exceeded. You have been temporarily blocked.');
            }
            const warningThreshold = Math.floor(config.maxAttempts * 0.8);
            if (attempts.length >= warningThreshold && attempts.length < config.maxAttempts) {
                await (0, helpers_1.createAuditLog)('rate_limit_warning', identifier, {
                    action, attempts: attempts.length + 1, maxAttempts: config.maxAttempts,
                    severity: 'medium',
                });
            }
            attempts.push(now);
            transaction.set(rateLimitRef, { attempts, blockedUntil: null, lastAttempt: now });
        });
    }
    catch (error) {
        if (error instanceof https_1.HttpsError)
            throw error;
        console.error('[RateLimit] Enforcement failed:', error);
    }
}
// ============================================================================
// Public API — callable functions
// ============================================================================
exports.checkRateLimit = (0, https_1.onCall)(async (request) => {
    const { action, identifier } = request.data;
    if (!action || !identifier) {
        throw new https_1.HttpsError('invalid-argument', 'Action and identifier are required');
    }
    const config = exports.RATE_LIMITS[action];
    if (!config) {
        throw new https_1.HttpsError('invalid-argument', `Unknown rate limit action: ${action}`);
    }
    const rateLimitRef = config_1.db.collection('rateLimits').doc(`${action}:${identifier}`);
    const now = Date.now();
    try {
        const result = await config_1.db.runTransaction(async (transaction) => {
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
            const attempts = (docData?.attempts || []).filter((ts) => ts > windowStart);
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
    }
    catch (error) {
        console.error('Rate limit check failed:', error);
        return { allowed: true };
    }
});
exports.resetRateLimit = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const { action, identifier } = request.data;
    const rateLimitRef = config_1.db.collection('rateLimits').doc(`${action}:${identifier}`);
    await rateLimitRef.delete();
    return { success: true };
});
//# sourceMappingURL=rateLimit.js.map