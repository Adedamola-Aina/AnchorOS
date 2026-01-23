import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const APP_ID = 'anchor-os';

/**
 * Force update a specific account to family scope
 */
export const forceUpdateAccountScope = functions.https.onCall(
    async (data: { accountId: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { accountId } = data;
        const userId = context.auth.uid;

        if (!accountId) {
            throw new functions.https.HttpsError('invalid-argument', 'accountId is required');
        }

        // Update the specific account
        const accountRef = db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('accounts')
            .doc(accountId);

        const accountDoc = await accountRef.get();

        if (!accountDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Account not found');
        }

        const accountData = accountDoc.data();

        await accountRef.update({ scope: 'family' });

        return {
            success: true,
            message: `Updated account "${accountData?.name}" to family scope`,
            before: { scope: accountData?.scope },
            after: { scope: 'family' },
        };
    }
);
