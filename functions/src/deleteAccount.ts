/**
 * Account Deletion (FIN-005 / A-04)
 *
 * Callable entry point for GDPR/right-to-erasure. The erasure orchestration lives in
 * accountDeletion.ts so the contract (tree / Storage / provider / tokens / family)
 * can be proven independently of the callable wrapper.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { createFinanceAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';
import { deleteAccountData } from './accountDeletion';

const REAUTH_WINDOW_SECONDS = 5 * 60;

function ensureRecentAuth(authTime?: number): void {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!authTime || nowSeconds - authTime > REAUTH_WINDOW_SECONDS) {
        throw new HttpsError(
            'failed-precondition',
            'Recent authentication required. Please sign in again before deleting your account.'
        );
    }
}

export const deleteMyAccount = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const userUid = request.auth.uid;
    const userEmail = request.auth.token.email as string | undefined;
    ensureRecentAuth(request.auth.token.auth_time as number | undefined);
    await enforceRateLimit('deleteAccount', userUid);

    const outcome = await deleteAccountData(userUid, userEmail);

    if (outcome.status !== 'complete') {
        // The job record carries the progress; the user can retry while still able
        // to authenticate, because the auth user is only deleted at the very end.
        await createFinanceAuditLog('account_delete_failed', userUid, {
            deletedAt: new Date().toISOString(),
            reason: outcome.error ?? 'unknown',
            completedSteps: outcome.completedSteps,
        });

        throw new HttpsError('internal', 'Failed to delete account. Please try again.');
    }

    await createFinanceAuditLog('account_deleted', userUid, {
        deletedAt: new Date().toISOString(),
        alreadyComplete: outcome.alreadyComplete,
        steps: outcome.completedSteps,
    });

    return {
        success: true,
        deleted: true,
    };
});
