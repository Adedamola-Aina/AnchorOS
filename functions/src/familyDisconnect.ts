import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { logger } from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification, getActiveConnection } from './helpers';
import {
    cleanupFamilyGrants,
    type CleanupOptions,
    type FamilyGrantCleanupCounts,
} from './familyRevocationCleanup';

/**
 * Disconnect Family — FS-01/FS-01b/FS-04 remediation.
 *
 * ONE recoverable, idempotent, resumable revocation operation:
 *
 *   Phase 1 (containment, transactional + authoritative): re-reads the
 *     connection document at the write boundary and flips `active` → `revoking`
 *     only from an actually-`active` state. The security-rules family predicate
 *     keys on `status == 'active'`, so the moment this commits, NEITHER party
 *     can satisfy family-membership authorization anymore — before any grant
 *     cleanup runs.
 *   Phase 2 (cleanup, chunked + idempotent): removes the member's `sharedWith`
 *     grants, resets stale `scope: 'family'` to `'personal'`, and strips stale
 *     row-level `accountShares` indexes from both parties' finance trees.
 *   Phase 3 (finalize, transactional): flips `revoking` → `disconnected`.
 *
 * Retry/repeat semantics:
 *  - `disconnected` connection → idempotent no-op success (no duplicate
 *    notifications/audit spam).
 *  - `revoking` connection     → resume: containment already held; cleanup
 *    re-runs idempotently, then finalize.
 *  - unknown client/network result → client can simply retry the callable.
 */

export interface DisconnectResult {
    success: boolean;
    /** True when the connection was already fully disconnected (no-op). */
    alreadyDisconnected?: boolean;
    /** True when this call resumed a previously interrupted revocation. */
    resumed?: boolean;
    cleanup?: FamilyGrantCleanupCounts;
}

export interface DisconnectCoreOptions {
    /** Test seam passed through to the cleanup phase (partial-failure tests). */
    cleanupOptions?: CleanupOptions;
}

function connectionDocRef(connectionId: string) {
    return db.collection('artifacts').doc(APP_ID)
        .collection('family_connections').doc(connectionId);
}

interface ConnectionLike {
    id: string;
    ownerUid: string;
    memberUid: string;
    status: string;
    ownerDisplayName?: string;
    memberDisplayName?: string;
}

/**
 * Locate a connection involving callerUid with one of the given statuses.
 * Uses the existing (ownerUid,status)/(memberUid,status) composite indexes.
 */
async function findConnectionForUser(
    callerUid: string,
    statuses: string[],
): Promise<ConnectionLike | null> {
    const connectionsRef = db.collection('artifacts').doc(APP_ID)
        .collection('family_connections');

    const ownerQuery = await connectionsRef
        .where('ownerUid', '==', callerUid)
        .where('status', 'in', statuses)
        .limit(1)
        .get();
    if (!ownerQuery.empty) {
        return { id: ownerQuery.docs[0].id, ...ownerQuery.docs[0].data() } as ConnectionLike;
    }

    const memberQuery = await connectionsRef
        .where('memberUid', '==', callerUid)
        .where('status', 'in', statuses)
        .limit(1)
        .get();
    if (!memberQuery.empty) {
        return { id: memberQuery.docs[0].id, ...memberQuery.docs[0].data() } as ConnectionLike;
    }

    return null;
}

/**
 * Disconnect Family — marks the family connection as disconnected
 * and revokes all shared account access.
 */

/**
 * Core revocation. Exported for direct testing; the production entry point is
 * the `disconnectFamily` callable below.
 */
export async function disconnectFamilyCore(
    callerUid: string,
    options: DisconnectCoreOptions = {},
): Promise<DisconnectResult> {
    // ── Locate the authoritative connection ────────────────────────────────
    let connection: ConnectionLike | null = await getActiveConnection(callerUid);
    let resumed = false;

    if (!connection) {
        const revoking = await findConnectionForUser(callerUid, ['revoking']);
        if (revoking) {
            connection = revoking;
            resumed = true;
        }
    }

    if (!connection) {
        const disconnected = await findConnectionForUser(callerUid, ['disconnected']);
        if (disconnected) {
            // Idempotent repeat: nothing left to revoke.
            return { success: true, alreadyDisconnected: true };
        }
        throw new HttpsError('failed-precondition', 'No active family connection');
    }

    const connectionRef = connectionDocRef(connection.id);
    const isOwner = connection.ownerUid === callerUid;
    const otherUid = isOwner ? connection.memberUid : connection.ownerUid;
    const ownerUid = connection.ownerUid;
    const memberUid = connection.memberUid;

    // ── Phase 1: containment (authoritative write boundary, atomic) ────────
    // One transaction flips the connection status AND removes every modern
    // `sharedWith` grant on the owner's accounts (per-user account collections
    // are bounded; if they ever exceeded the transaction limit, disconnect
    // aborts atomically rather than partially). Committing this transaction
    // closes EVERY rules-authoritative grant channel at once:
    //   - sharedWith account/activity/finance branches → grant deleted
    //   - accountShares row branches → require a CURRENT account grant → dead
    //   - family-scope account/finance/commitments/dashboard → status!='active'
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(connectionRef);
        if (!snap.exists) {
            throw new HttpsError('failed-precondition', 'No active family connection');
        }
        const data = snap.data() as { status?: string; ownerUid?: string; memberUid?: string };
        if (data.ownerUid !== callerUid && data.memberUid !== callerUid) {
            throw new HttpsError('permission-denied', 'Not a party of this connection');
        }
        const status = data.status;
        if (status === 'disconnected') {
            return; // finalized concurrently — nothing to contain
        }
        if (status !== 'active' && status !== 'revoking') {
            throw new HttpsError('failed-precondition', 'No active family connection');
        }

        // Strip modern grants atomically with containment (idempotent on resume).
        const accountsSnap = await tx.get(
            db.collection('artifacts').doc(APP_ID)
                .collection('users').doc(ownerUid).collection('accounts')
        );
        accountsSnap.docs.forEach((accountDoc) => {
            const sharedWith = (accountDoc.get('sharedWith') ?? {}) as Record<string, unknown>;
            if (sharedWith[memberUid] !== undefined) {
                tx.update(accountDoc.ref, {
                    [`sharedWith.${memberUid}`]: FieldValue.delete(),
                });
            }
        });

        if (status === 'active') {
            tx.update(connectionRef, {
                status: 'revoking',
                revocationStartedAt: new Date().toISOString(),
                disconnectedBy: callerUid,
            });
            logger.info('family_disconnect_contained', { outcome: 'revoking' });
        } else {
            // Interrupted earlier run — containment already holds; resume.
        }
    });

    // ── Phase 2: chunked, idempotent grant cleanup (resumable) ─────────────
    const cleanup = await cleanupFamilyGrants(db, ownerUid, memberUid, options.cleanupOptions);
    logger.info('family_disconnect_cleanup', {
        dryRun: options.cleanupOptions?.dryRun ?? false,
        accountsUpdated: cleanup.accountsUpdated,
        accountScopesReset: cleanup.accountScopesReset,
        financeRowsUpdated: cleanup.financeRowsUpdated,
        batchesCommitted: cleanup.batchesCommitted,
    });

    // ── Phase 3: finalize ──────────────────────────────────────────────────
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(connectionRef);
        if (!snap.exists) {
            return;
        }
        const data = snap.data() as { status?: string };
        if (data.status !== 'disconnected') {
            tx.update(connectionRef, {
                status: 'disconnected',
                disconnectedAt: new Date().toISOString(),
                disconnectedBy: callerUid,
            });
        }
    });

    // ── Post-revocation notification + audit (best effort, after containment) ──
    const callerName = (isOwner ? connection.ownerDisplayName : connection.memberDisplayName) ?? 'A family member';
    await createNotification(
        otherUid, 'family_disconnected', 'Family Disconnected',
        isOwner
            ? `${callerName} has removed you from their household. All shared account access has been revoked.`
            : `${callerName} has left your household.`,
        callerUid, callerName
    );

    await createAuditLog(isOwner ? 'member_removed' : 'member_left', callerUid, {
        connectionId: connection.id, otherUid,
        resumed,
        cleanupAccountsUpdated: cleanup.accountsUpdated,
        cleanupAccountScopesReset: cleanup.accountScopesReset,
        cleanupFinanceRowsUpdated: cleanup.financeRowsUpdated,
    });

    return { success: true, resumed, cleanup };
}

export const disconnectFamily = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const callerUid = request.auth.uid;
        await enforceRateLimit('disconnectFamily', callerUid);

        return disconnectFamilyCore(callerUid);
    }
);
