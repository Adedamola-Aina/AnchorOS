export interface TokenDocumentRef {
    delete: () => Promise<unknown>;
}

/**
 * FCM Admin SDK error codes that mean the *token itself* is permanently
 * invalid. These are terminal token-lifecycle states: the device
 * uninstalled/cleared the app, the registration was revoked, or the token
 * rotated to a new value. The stored token document must be deleted so
 * producers stop targeting it.
 *
 * SN-08: the previous implementation only recognised two of these codes
 * (`registration-token-not-registered`, `invalid-registration-token`). Every
 * other permanent failure — notably `unregistered` (APNs) and
 * `invalid-recipient` — was retried forever on each scheduler run, so a dead
 * token stayed authoritative indefinitely and masked real delivery gaps.
 */
export const PERMANENT_INVALID_TOKEN_ERROR_CODES = [
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
    'messaging/invalid-recipient',
    'messaging/unregistered',
] as const;

/**
 * FCM error codes that are transient/retryable. The token remains
 * authoritative and a later scheduler run may succeed, so the token document
 * is retained (ownership is NOT ended by a transient failure).
 */
export const TRANSIENT_TOKEN_ERROR_CODES = [
    'messaging/internal-error',
    'messaging/server-unavailable',
    'messaging/quota-exceeded',
    'messaging/message-rate-exceeded',
    'messaging/device-message-rate-exceeded',
    'messaging/topics-message-rate-exceeded',
    'messaging/third-party-auth-error',
    'messaging/unknown-error',
] as const;

export type TokenSendErrorDisposition =
    | 'permanent-invalid'
    | 'transient'
    | 'configuration'
    | 'unknown';

const PERMANENT_INVALID = new Set<string>(PERMANENT_INVALID_TOKEN_ERROR_CODES);
const TRANSIENT = new Set<string>(TRANSIENT_TOKEN_ERROR_CODES);

/**
 * Classify an FCM send error into the disposition that governs whether the
 * token document may be deleted.
 *
 *  - `permanent-invalid` — the token can never succeed again: delete the
 *                          stored token document (ends ownership).
 *  - `transient`         — keep the token; a later run may succeed.
 *  - `configuration`     — credential/project/payload misconfiguration. The
 *                          token is not at fault, so it must NOT be deleted;
 *                          this needs operator action.
 *  - `unknown`           — unrecognised or absent code; keep the token and
 *                          surface it in logs.
 */
export function classifyTokenSendError(code?: string): TokenSendErrorDisposition {
    if (!code) {
        return 'unknown';
    }
    if (PERMANENT_INVALID.has(code)) {
        return 'permanent-invalid';
    }
    if (TRANSIENT.has(code)) {
        return 'transient';
    }
    if (code.startsWith('messaging/')) {
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
 * retries and repeated scheduler runs cannot double-apply — there is no way
 * for a stale token to be re-registered by a cleanup retry (SN-01/SN-08).
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
