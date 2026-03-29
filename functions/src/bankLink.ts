import { logger } from 'firebase-functions';
/**
 * Bank Link — link / unlink a bank account via Mono
 *
 * Exchanges the auth code from the Mono Connect widget,
 * fetches account details, and creates a linked AnchorAccount.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createFinanceAuditLog } from './helpers';
import { exchangeAuthCode, getAccountDetails } from './mono/monoClient';
import type { BankConnectionDoc } from './mono/monoTypes';

export { unlinkBankAccount } from './bankUnlink';

const ACCOUNT_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

function maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
}

function pickColor(index: number): string {
    return ACCOUNT_COLORS[index % ACCOUNT_COLORS.length];
}

function mapMonoAccountType(monoType: string): string {
    const lower = monoType.toLowerCase();
    if (lower.includes('saving')) return 'savings';
    if (lower.includes('current') || lower.includes('checking')) return 'checking';
    if (lower.includes('salary')) return 'salary';
    return 'savings';
}

/**
 * Link a bank account via Mono Connect widget auth code.
 */
export const linkBankAccount = secureOnCall(
    { secrets: ['MONO_SECRET_KEY'] },
    async (request) => {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required.');
        const uid = request.auth.uid;
        const { code } = request.data as { code?: string };
        if (!code || typeof code !== 'string') {
            throw new HttpsError('invalid-argument', 'Mono auth code is required.');
        }

        await enforceRateLimit('bankLink', uid);

        // Exchange auth code for Mono account ID
        const authResult = await exchangeAuthCode(code);
        const monoAccountId = authResult.id;

        // Check for duplicate connections
        const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(uid);
        const existingSnap = await userRef.collection('bankConnections')
            .where('monoAccountId', '==', monoAccountId)
            .where('status', '==', 'active')
            .limit(1)
            .get();

        if (!existingSnap.empty) {
            throw new HttpsError('already-exists', 'This bank account is already linked.');
        }

        // Fetch account details from Mono
        const details = await getAccountDetails(monoAccountId);
        const acct = details.account;
        const currency = acct.currency === 'USD' ? 'USD' : 'NGN';

        // Count existing accounts for color selection
        const accountsSnap = await userRef.collection('accounts').get();

        // Create the linked AnchorAccount
        const accountData = {
            name: `${acct.institution.name} ${acct.name}`.trim(),
            type: mapMonoAccountType(acct.type),
            currency,
            balanceCents: Math.round(acct.balance * 100),
            color: pickColor(accountsSnap.size),
            scope: 'personal',
            ownerId: uid,
            isArchived: false,
            shares: {},
            source: 'linked',
            externalConnection: {
                provider: 'mono',
                externalAccountId: monoAccountId,
                institutionName: acct.institution.name,
                institutionCode: acct.institution.bankCode,
                lastSyncedAt: new Date().toISOString(),
                syncStatus: 'active',
                maskedAccountNumber: maskAccountNumber(acct.accountNumber),
            },
        };

        const accountRef = await userRef.collection('accounts').add(accountData);

        // Store the connection mapping (admin-only collection)
        const connectionDoc: BankConnectionDoc = {
            provider: 'mono',
            monoAccountId,
            anchorAccountId: accountRef.id,
            userId: uid,
            institutionName: acct.institution.name,
            linkedAt: new Date().toISOString(),
            status: 'active',
        };
        await userRef.collection('bankConnections').add(connectionDoc);

        await createFinanceAuditLog('bank_account_linked', uid, {
            accountId: accountRef.id,
            institution: acct.institution.name,
            provider: 'mono',
        });

        logger.info(`[BankLink] Linked ${acct.institution.name} for user ${uid}`);
        return { accountId: accountRef.id, institutionName: acct.institution.name };
    },
);
