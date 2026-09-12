export interface TokenDocumentRef {
    delete: () => Promise<unknown>;
}

/**
 * FCM send-error classification for the firebase-admin version AnchorOS ships
 * (13.10.0, see functions/package-lock.json).
 *
 * firebase-admin normalises FCM v1 / legacy backend errors through
 * `MESSAGING_SERVER_TO_CLIENT_CODE` before application code observes them
 * (node_modules/firebase-admin/lib/utils/error.js), so the live
 * `getMessaging().send()` surface is the `messaging/<code>` form of
 * `MessagingClientErrorCode`:
 *
 *   UNREGISTERED / NOT_FOUND              -> messaging/registration-token-not-registered
 *   QUOTA_EXCEEDED / RESOURCE_EXHAUSTED   -> messaging/message-rate-exceeded
 *   APNS_AUTH_ERROR / UNAUTHENTICATED / InvalidApnsCredential
 *                                         -> messaging/third-party-auth-error
 *   SENDER_ID_MISMATCH / PERMISSION_DENIED-> messaging/mismatched-credential
 *
 * Raw backend/legacy aliases are therefore NOT part of the live surface; they
 * are normalised defensively below so an unexpected alias can never be
 * mistaken for a stale token.
 */

/**
 * Permanent-invalid token codes: the registration can never succeed again, so
 * the stored token document is deleted (ends ownership).
 */
export const PERMANENT_INVALID_TOKEN_ERROR_CODES = [
    // UNREGISTERED / NOT_FOUND — device unregistered or token rotated.
    'messaging/registration-token-not-registered',
    // Legacy invalid registration-token format. Cannot ever succeed.
    'messaging/invalid-registration-token',
] as const;

/**
 * Configuration / operator-actionable faults. The token is not at fault, so it
 * is retained and the fault is surfaced. `messaging/third-party-auth-error` is
 * the APNs/third-party credential failure the Admin SDK emits — an operator
 * fix, not a retryable token condition.
 */
export const CONFIGURATION_ERROR_CODES = [
    // APNs/third-party credential/authentication fault (APNS_AUTH_ERROR,
    // UNAUTHENTICATED, InvalidApnsCredential).
    'messaging/third-party-auth-error',
    // Credential/project mismatch (SENDER_ID_MISMATCH, PERMISSION_DENIED).
    'messaging/mismatched-credential',
    'messaging/authentication-error',
    // Message/payload construction faults — never the token's fault.
    'messaging/invalid-argument',
    'messaging/invalid-package-name',
    'messaging/payload-size-limit-exceeded',
    'messaging/invalid-payload',
    'messaging/invalid-data-payload-key',
    'messaging/invalid-options',
    'messaging/too-many-topics',
] as const;

/**
 * Transient/retryable codes. The token remains authoritative and a later
 * scheduler run may succeed. `message-rate-exceeded` is the normalised form of
 * both QUOTA_EXCEEDED and RESOURCE_EXHAUSTED.
 */
export const TRANSIENT_TOKEN_ERROR_CODES = [
    'messaging/internal-error',
    'messaging/server-unavailable',
    'messaging/message-rate-exceeded',
    'messaging/device-message-rate-exceeded',
    'messaging/topics-message-rate-exceeded',
    'messaging/unknown-error',
] as const;

export type TokenSendErrorDisposition =
    | 'permanent-invalid'
    | 'transient'
    | 'configuration'
    | 'unknown';

const PERMANENT_INVALID = new Set<string>(PERMANENT_INVALID_TOKEN_ERROR_CODES);
const CONFIGURATION = new Set<string>(CONFIGURATION_ERROR_CODES);
const TRANSIENT = new Set<string>(TRANSIENT_TOKEN_ERROR_CODES);

/**
 * Legacy/raw backend aliases that firebase-admin normalises before app code
 * sees them. Kept ONLY as a defensive map (never as the live surface) so an
 * alias cannot be misclassified — in particular so a raw quota/unregistered
 * alias is not treated as a new, unhandled token state.
 */
const RAW_BACKEND_ALIAS_TO_ADMIN_CODE: Readonly<Record<string, string>> = {
    'messaging/unregistered': 'messaging/registration-token-not-registered',
    'messaging/not-registered': 'messaging/registration-token-not-registered',
    'messaging/quota-exceeded': 'messaging/message-rate-exceeded',
    'messaging/resource-exhausted': 'messaging/message-rate-exceeded',
    'messaging/invalid-apns-credentials': 'messaging/third-party-auth-error',
    'messaging/apns-auth-error': 'messaging/third-party-auth-error',
};

/** Normalise a possibly-raw alias to the Admin SDK code it maps to. */
export function normalizeTokenSendErrorCode(code?: string): string | undefined {
    if (!code) {
        return undefined;
    }
    return RAW_BACKEND_ALIAS_TO_ADMIN_CODE[code] ?? code;
}

/**
 * Classify an FCM send error into the disposition that governs whether the
 * token document may be deleted.
 *
 *  - `permanent-invalid` — delete the stored registration (ends ownership).
 *  - `transient`         — keep the token; a later run may succeed.
 *  - `configuration`     — credential/project/payload fault; keep the token and
 *                          surface the fault for operator action.
 *  - `unknown`           — unrecognised or absent code; keep the token.
 */
export function classifyTokenSendError(code?: string): TokenSendErrorDisposition {
    const canonical = normalizeTokenSendErrorCode(code);
    if (!canonical) {
        return 'unknown';
    }
    if (PERMANENT_INVALID.has(canonical)) {
        return 'permanent-invalid';
    }
    if (TRANSIENT.has(canonical)) {
        return 'transient';
    }
    if (CONFIGURATION.has(canonical)) {
        return 'configuration';
    }
    // Any other Firebase Messaging namespace error is operator-actionable, never
    // a stale token.
    if (canonical.startsWith('messaging/')) {
        return 'configuration';
    }
    return 'unknown';
}

export function isStaleTokenError(code?: string): boolean {
    return classifyTokenSendError(code) === 'permanent-invalid';
}

/**
 * Idempotently delete a token document when the send failure proves the token
 * is permanently invalid. Deleting an already-deleted document is a no-op, so
 * retries and repeated scheduler runs cannot double-apply — a stale token
 * cannot be re-registered by a cleanup retry (SN-01/SN-08).
 */
export async function removeTokenIfStale(
    code: string | undefined,
    token: string,
    tokenDoc: TokenDocumentRef,
): Promise<boolean> {
    if (!isStaleTokenError(code)) {
        return false;
    }

    await tokenDoc.delete();
    console.warn(`[Reminders] Removed stale token: ${token.substring(0, 10)}...`);
    return true;
}