/**
 * Family Sharing — account sharing, notifications, triggers, maintenance
 *
 * Runtime operations for shared accounts, notification management,
 * Firestore write trigger, scheduled cleanup, and v1→v2 migration.
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification, getActiveConnection } from './helpers';

export { disconnectFamily } from './familyDisconnect';

// ============================================================================
// Share / Unshare Account
// ============================================================================

/**
 * Share / Unshare Account — FS-04 TOCTOU fix.
 *
 * The share decision is re-validated INSIDE the same transaction that writes
 * the account grant: the connection document is re-read at the write boundary
 * and must still be `status == 'active'` and owned by the caller. Firestore
 * transaction semantics guarantee that if a concurrent disconnect containment
 * (or any other connection-state change) commits after this read, the share
 * transaction aborts and retries — and on retry the stale `active` read is
 * gone, so the share is rejected. A share therefore cannot be created or
 * re-created after the relevant connection has ceased being active.
 */

export async function shareAccountCore(
    ownerUid: string,
    accountId: string,
    share: boolean,
): Promise<{ success: boolean }> {
    const connection = await getActiveConnection(ownerUid);
    if (!connection) {
        throw new HttpsError('failed-precondition', 'No active family connection');
    }
    if (connection.ownerUid !== ownerUid) {
        throw new HttpsError('permission-denied', 'Only the account owner can share accounts');
    }

    const memberUid = connection.memberUid;
    const connectionRef = db.collection('artifacts').doc(APP_ID)
        .collection('family_connections').doc(connection.id);
    const accountRef = db.collection('artifacts').doc(APP_ID)
        .collection('users').doc(ownerUid)
        .collection('accounts').doc(accountId);

    let accountName = 'Unknown Account';

    await db.runTransaction(async (tx) => {
        // Authoritative re-check at the account/grant write boundary (FS-04).
        const connSnap = await tx.get(connectionRef);
        const connData = connSnap.data() as { status?: string; ownerUid?: string } | undefined;
        if (!connSnap.exists || connData?.status !== 'active' || connData?.ownerUid !== ownerUid) {
            throw new HttpsError('failed-precondition', 'No active family connection');
        }

        const accountDoc = await tx.get(accountRef);
        if (!accountDoc.exists) {
            throw new HttpsError('not-found', 'Account not found');
        }
        accountName = accountDoc.data()?.name || 'Unknown Account';

        if (share) {
            tx.update(accountRef, {
                [`sharedWith.${memberUid}`]: {
                    grantedAt: new Date().toISOString(),
                    grantedBy: ownerUid,
                    permission: 'transact',
                },
                scope: 'family',
            });
        } else {
            const sharedWith = (accountDoc.data()?.sharedWith ?? {}) as Record<string, unknown>;
            const otherModernGrants = Object.keys(sharedWith).filter((uid) => uid !== memberUid);
            const update: Record<string, unknown> = {
                [`sharedWith.${memberUid}`]: FieldValue.delete(),
            };
            // FS-01 hygiene: when the last modern grant goes away, return the
            // account to the canonical non-family scope instead of leaving the
            // family flag behind.
            if (accountDoc.data()?.scope === 'family' && otherModernGrants.length === 0) {
                update.scope = 'personal';
            }
            tx.update(accountRef, update);
        }
    });

    if (share) {
        await createNotification(
            memberUid, 'account_shared', '👥 Account Shared',
            `${connection.ownerDisplayName} has shared "${accountName}" with you. You can now view and add transactions.`,
            ownerUid, connection.ownerDisplayName, { accountId, accountName }
        );
        await createAuditLog('account_shared', ownerUid, { accountId, accountName, memberUid });
    } else {
        await createNotification(
            memberUid, 'account_unshared', 'Account Access Removed',
            `Access to "${accountName}" has been removed.`,
            ownerUid, connection.ownerDisplayName, { accountId, accountName }
        );
        await createAuditLog('account_unshared', ownerUid, { accountId, accountName, memberUid });
    }

    return { success: true };
}

export const shareAccount = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { accountId, share } = request.data as { accountId: string; share: boolean };
        const ownerUid = request.auth.uid;

        await enforceRateLimit('shareAccount', ownerUid);

        return shareAccountCore(ownerUid, accountId, share === true);
    }
);

// ============================================================================
// Get Shared Accounts With Me
// ============================================================================

export const getSharedAccountsWithMe = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const memberUid = request.auth.uid;
        await enforceRateLimit('getSharedAccounts', memberUid);

        const accountsQuery = db.collectionGroup('accounts')
            .where(`sharedWith.${memberUid}.grantedAt`, '!=', null);
        const snapshot = await accountsQuery.get();

        const sharedAccounts = snapshot.docs.map(doc => {
            const data = doc.data();
            const pathParts = doc.ref.path.split('/');
            const ownerUid = pathParts[3];

            return {
                id: doc.id,
                ownerUid,
                name: data.name,
                type: data.type,
                balanceCents: data.balanceCents,
                currency: data.currency,
                color: data.color,
                scope: data.scope || 'family',
                sharedAt: data.sharedWith?.[memberUid]?.grantedAt,
                permission: data.sharedWith?.[memberUid]?.permission || 'read',
            };
        });

        return { accounts: sharedAccounts };
    }
);
