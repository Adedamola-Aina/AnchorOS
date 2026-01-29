// @ts-nocheck
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const APP_ID = 'anchor-os';

/**
 * Diagnostic function to check family sharing setup
 */
export const diagnoseFamilySharing = functions.https.onCall(
    async (_data: unknown, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = context.auth.uid;
        const userEmail = context.auth.token.email;

        const report: any = {
            userId,
            userEmail,
            timestamp: new Date().toISOString(),
            checks: {},
        };

        // 1. Check family connections
        const connectionsAsOwner = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('family_connections')
            .where('ownerUid', '==', userId)
            .where('status', '==', 'active')
            .get();

        const connectionsAsMember = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('family_connections')
            .where('memberUid', '==', userId)
            .where('status', '==', 'active')
            .get();

        report.checks.familyConnection = {
            asOwner: connectionsAsOwner.docs.map(d => ({ id: d.id, ...d.data() })),
            asMember: connectionsAsMember.docs.map(d => ({ id: d.id, ...d.data() })),
        };

        // 2. Check accounts I own with sharedWith
        const myAccounts = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('accounts')
            .get();

        report.checks.myAccounts = myAccounts.docs.map(d => ({
            id: d.id,
            name: d.data().name,
            scope: d.data().scope,
            sharedWith: d.data().sharedWith ? Object.keys(d.data().sharedWith) : [],
            hasSharedWith: !!d.data().sharedWith && Object.keys(d.data().sharedWith).length > 0,
        }));

        // 3. If I'm a member, check what accounts are shared with me
        if (!connectionsAsMember.empty) {
            const ownerUid = connectionsAsMember.docs[0].data().ownerUid;

            const ownerAccounts = await db
                .collection('artifacts')
                .doc(APP_ID)
                .collection('users')
                .doc(ownerUid)
                .collection('accounts')
                .get();

            report.checks.accountsSharedWithMe = ownerAccounts.docs
                .filter(d => {
                    const sharedWith = d.data().sharedWith || {};
                    return sharedWith[userId] !== undefined;
                })
                .map(d => ({
                    id: d.id,
                    name: d.data().name,
                    scope: d.data().scope,
                    sharedAt: d.data().sharedWith?.[userId]?.grantedAt,
                }));

            report.checks.ownerUid = ownerUid;
        }

        // 4. If I'm an owner, check member's access
        if (!connectionsAsOwner.empty) {
            const memberUid = connectionsAsOwner.docs[0].data().memberUid;
            report.checks.memberUid = memberUid;
        }

        return report;
    }
);
