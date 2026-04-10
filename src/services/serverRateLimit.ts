import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { AnchorError } from '../utils/error';

interface RateLimitResponse {
    allowed: boolean;
    blockedUntil?: number;
    reason?: string;
    remainingAttempts?: number;
}

function getRetryMs(blockedUntil?: number): number | null {
    if (!blockedUntil || !Number.isFinite(blockedUntil)) return null;
    const delta = blockedUntil - Date.now();
    return delta > 0 ? delta : null;
}

export async function enforceServerRateLimit(action: string, userId: string): Promise<void> {
    if (!userId) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // Offline mode uses local queueing + client fallback safeguards.
        return;
    }

    try {
        const callable = httpsCallable<{ action: string; identifier: string }, RateLimitResponse>(
            functions,
            'checkRateLimit',
        );
        const { data } = await callable({ action, identifier: userId });

        if (data.allowed) return;

        const retryMs = getRetryMs(data.blockedUntil);
        const retryText = retryMs ? ` Please try again in ${Math.ceil(retryMs / 60000)} minute(s).` : '';
        throw new AnchorError(
            (data.reason || 'Too many attempts. Please try again later.') + retryText,
            'RATE_LIMIT',
        );
    } catch (error) {
        if (error instanceof AnchorError) throw error;
        throw new AnchorError(
            'Unable to validate request limits right now. Please try again shortly.',
            'NETWORK',
            error,
        );
    }
}

