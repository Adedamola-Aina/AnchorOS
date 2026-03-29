import { logger } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createFinanceAuditLog } from './helpers';
import { unlinkAccount as monoUnlink } from './mono/monoClient';

/**
 * Unlink a bank account — archives the account and revokes Mono access.
 */
export const unlinkBankAccount = secureOnCall(
    { secrets: ['MONO_SECRET_KEY'] },
    async (request) => {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required.');
        const uid = request.auth.uid;
        const { accountId } = request.data as { accountId?: string };
        if (!accountId || typeof accountId !== 'string') {
            throw new HttpsError('invalid-argument', 'Account ID is required.');
        }

        await enforceRateLimit('bankUnlink', uid);

        const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(uid);
        const accountRef = userRef.collection('accounts').doc(accountId);
        const accountSnap = await accountRef.get();

        if (!accountSnap.exists) throw new HttpsError('not-found', 'Account not found.');
        const account = accountSnap.data();
        if (account?.source !== 'linked' || !account?.externalConnection) {
            throw new HttpsError('failed-precondition', 'Account is not a linked bank account.');
        }

        const monoAccountId = account.externalConnection.externalAccountId;

        // Revoke Mono access (best-effort — don't fail if Mono is down)
        try {
            await monoUnlink(monoAccountId);
        } catch (err) {
            console.error('[BankLink] Mono unlink failed (non-blocking):', err);
        }

        await accountRef.update({
            isArchived: true,
            'externalConnection.syncStatus': 'error',
        });

        const connSnap = await userRef.collection('bankConnections')
            .where('monoAccountId', '==', monoAccountId)
            .where('status', '==', 'active')
            .limit(1)
            .get();

        if (!connSnap.empty) {
            await connSnap.docs[0].ref.update({ status: 'revoked' });
        }

        await createFinanceAuditLog('bank_account_unlinked', uid, {
            accountId, institution: account.externalConnection.institutionName,
        });

        logger.info(`[BankLink] Unlinked account ${accountId} for user ${uid}`);
        return { success: true };
    },
);
