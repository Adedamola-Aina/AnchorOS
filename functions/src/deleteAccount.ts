/**
 * Account Deletion (FIN-005)
 *
 * Callable backend erasure flow for GDPR/right-to-erasure.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { APP_ID, db } from './config';
import { createFinanceAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';

const REAUTH_WINDOW_SECONDS = 5 * 60;
const DELETE_CHUNK_SIZE = 100;
const WRITE_BATCH_CHUNK_SIZE = 400;

async function deleteDocumentTree(docRef: FirebaseFirestore.DocumentReference): Promise<void> {
    const subcollections = await docRef.listCollections();
    for (const subcollection of subcollections) {
        await deleteCollectionTree(subcollection);
    }
    await docRef.delete();
}

async function deleteCollectionTree(collectionRef: FirebaseFirestore.CollectionReference): Promise<void> {
    while (true) {
        const snapshot = await collectionRef.limit(DELETE_CHUNK_SIZE).get();
        if (snapshot.empty) return;

        for (const docSnapshot of snapshot.docs) {
            await deleteDocumentTree(docSnapshot.ref);
        }

        if (snapshot.size < DELETE_CHUNK_SIZE) return;
    }
}

async function revokeSharedAccess(userUid: string): Promise<void> {
    const sharedAccounts = await db.collectionGroup('accounts')
        .where(`sharedWith.${userUid}.grantedAt`, '!=', null)
        .get();

    if (sharedAccounts.empty) return;

    for (let index = 0; index < sharedAccounts.docs.length; index += WRITE_BATCH_CHUNK_SIZE) {
        const chunk = sharedAccounts.docs.slice(index, index + WRITE_BATCH_CHUNK_SIZE);
        const batch = db.batch();
        chunk.forEach((docSnapshot) => {
            batch.update(docSnapshot.ref, {
                [`sharedWith.${userUid}`]: FieldValue.delete(),
            });
        });
        await batch.commit();
    }
}

async function deleteFamilyArtifacts(userUid: string, userEmail?: string): Promise<void> {
    const artifactsRef = db.collection('artifacts').doc(APP_ID);

    const connectionQuery = artifactsRef.collection('family_connections')
        .where('ownerUid', '==', userUid)
        .get();
    const memberConnectionQuery = artifactsRef.collection('family_connections')
        .where('memberUid', '==', userUid)
        .get();
    const ownerInvitationQuery = artifactsRef.collection('family_invitations')
        .where('ownerUid', '==', userUid)
        .get();

    const [ownerConnections, memberConnections, ownerInvitations] = await Promise.all([
        connectionQuery,
        memberConnectionQuery,
        ownerInvitationQuery,
    ]);

    const docsToDelete: FirebaseFirestore.QueryDocumentSnapshot[] = [
        ...ownerConnections.docs,
        ...memberConnections.docs,
        ...ownerInvitations.docs,
    ];

    if (userEmail) {
        const inviteeInvitations = await artifactsRef.collection('family_invitations')
            .where('inviteeEmail', '==', userEmail)
            .get();
        docsToDelete.push(...inviteeInvitations.docs);
    }

    for (let index = 0; index < docsToDelete.length; index += WRITE_BATCH_CHUNK_SIZE) {
        const chunk = docsToDelete.slice(index, index + WRITE_BATCH_CHUNK_SIZE);
        const batch = db.batch();
        chunk.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
        await batch.commit();
    }
}

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

    try {
        await revokeSharedAccess(userUid);
        await deleteFamilyArtifacts(userUid, userEmail);

        const userDocRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userUid);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            await deleteDocumentTree(userDocRef);
        }

        await createFinanceAuditLog('account_deleted', userUid, {
            deletedAt: new Date().toISOString(),
        });

        try {
            await getAuth().deleteUser(userUid);
        } catch (authError) {
            const code = authError != null && typeof authError === 'object' && 'code' in authError
                ? String((authError as { code: string }).code)
                : '';
            if (code !== 'auth/user-not-found') {
                throw authError;
            }
        }

        return {
            success: true,
            deleted: true,
        };
    } catch (error) {
        await createFinanceAuditLog('account_delete_failed', userUid, {
            deletedAt: new Date().toISOString(),
            reason: error instanceof Error ? error.message : String(error),
        });

        if (error instanceof HttpsError) {
            throw error;
        }

        throw new HttpsError('internal', 'Failed to delete account');
    }
});
