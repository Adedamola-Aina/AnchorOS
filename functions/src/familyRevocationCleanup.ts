/**
 * Family Revocation Grant Cleanup — FS-01 / FS-01b / FS-04 remediation (bundle B1)
 *
 * Shared, idempotent, chunked cleanup of the grant state created by the modern
 * family-sharing flow for a (ownerUid, memberUid) pair:
 *
 *  1. Owner accounts: remove the member's `sharedWith` grant (idempotent) and
 *     reset `scope: 'family'` back to the canonical non-family value
 *     `scope: 'personal'` once no modern grants remain. Ownership, balances and
 *     all unrelated account state are untouched.
 *  2. Finance rows (BOTH parties' trees): strip the other party's UID from any
 *     row-embedded `accountShares` snapshot (FS-01b). Historical transactions
 *     are never deleted and no amount/category/account/ownership/timestamp
 *     field is modified — only the stale authorization index key is removed.
 *
 * Scale limits: finance collections can exceed Firestore's 500-operation batch
 * limit, so cleanup is chunked (batches of CLEANUP_BATCH_SIZE) and paged
 * (single-field-index equality queries). It is therefore NOT performed inside
 * the revocation transaction — containment is handled separately by
 * `disconnectFamily` flipping the connection status first (see
 * familyDisconnect.ts). Every step is safe to re-run; a completed pass makes no
 * further changes.
 */

import { FieldValue, type Firestore } from 'firebase-admin/firestore';
import { APP_ID } from './config';

/** Batch size for chunked cleanup — below Firestore's 500-op batch limit. */
export const CLEANUP_BATCH_SIZE = 250;

/** Firestore page size when scanning finance rows for stale indexes. */
export const CLEANUP_PAGE_SIZE = 250;

/** Canonical non-family account scope (see `scope: 'personal' | 'family'`). */
export const PERSONAL_SCOPE = 'personal' as const;

export interface FamilyGrantCleanupCounts {
    /** Owner account documents scanned. */
    accountsScanned: number;
    /** Owner accounts where the member's `sharedWith` grant was (or would be) removed. */
    accountsUpdated: number;
    /** Owner accounts where `scope` was (or would be) reset from 'family' to 'personal'. */
    accountScopesReset: number;
    /** Finance rows scanned for stale `accountShares` indexes (both trees). */
    financeRowsScanned: number;
    /** Finance rows where the stale `accountShares` key was (or would be) removed. */
    financeRowsUpdated: number;
    /** Number of Firestore write batches committed (0 in dry-run). */
    batchesCommitted: number;
}

export function emptyCleanupCounts(): FamilyGrantCleanupCounts {
    return {
        accountsScanned: 0,
        accountsUpdated: 0,
        accountScopesReset: 0,
        financeRowsScanned: 0,
        financeRowsUpdated: 0,
        batchesCommitted: 0,
    };
}

export interface CleanupOptions {
    /** When true, only count what would change — no mutation. */
    dryRun?: boolean;
    /**
     * Test seam: called before each batch commit. Return an Error to abort the
     * batch (simulating partial failure) so resumability can be proven. Never
     * used in production code paths.
     */
    failBatchPredicate?: (phase: 'accounts' | 'finance', batchIndex: number) => Error | null;
}

function usersRef(db: Firestore) {
    return db.collection('artifacts').doc(APP_ID).collection('users');
}

/**
 * Phase A — owner accounts: remove the member's modern grant and reset stale
 * family scope. Owner account collections are per-user and bounded, so a full
 * collection read is safe here.
 */
async function cleanupOwnerAccounts(
    db: Firestore,
    ownerUid: string,
    memberUid: string,
    counts: FamilyGrantCleanupCounts,
    options: CleanupOptions,
): Promise<void> {
    const accountsSnap = await usersRef(db).doc(ownerUid).collection('accounts').get();
    const batch = db.batch();
    let batchOps = 0;
    let batchIndex = 0;

    for (const accountDoc of accountsSnap.docs) {
        counts.accountsScanned += 1;
        const data = accountDoc.data();
        const sharedWith = (data.sharedWith ?? {}) as Record<string, unknown>;
        const hasGrant = sharedWith[memberUid] !== undefined;
        const otherModernGrants = Object.keys(sharedWith).filter((uid) => uid !== memberUid);
        const isStaleFamilyScope = data.scope === 'family' && otherModernGrants.length === 0;

        if (!hasGrant && !isStaleFamilyScope) {
            continue;
        }

        if (hasGrant) {
            counts.accountsUpdated += 1;
        }
        if (isStaleFamilyScope) {
            counts.accountScopesReset += 1;
        }

        if (options.dryRun) {
            continue;
        }

        const update: Record<string, unknown> = {};
        if (hasGrant) {
            update[`sharedWith.${memberUid}`] = FieldValue.delete();
        }
        if (isStaleFamilyScope) {
            // Preserve unrelated account state; only the scope flag changes.
            update.scope = PERSONAL_SCOPE;
        }
        batch.update(accountDoc.ref, update);
        batchOps += 1;

        if (batchOps >= CLEANUP_BATCH_SIZE) {
            const failure = options.failBatchPredicate?.('accounts', batchIndex);
            if (failure) {
                throw failure;
            }
            await batch.commit();
            counts.batchesCommitted += 1;
            batchIndex += 1;
            batchOps = 0;
        }
    }

    if (batchOps > 0) {
        const failure = options.failBatchPredicate?.('accounts', batchIndex);
        if (failure) {
            throw failure;
        }
        await batch.commit();
        counts.batchesCommitted += 1;
    }
}


/**
 * Phase B — strip the other party's UID from row-embedded `accountShares`
 * snapshots in both parties' finance trees, using paged single-field-index
 * equality queries and chunked batches.
 */
async function cleanupFinanceRowIndexes(
    db: Firestore,
    ownerUid: string,
    memberUid: string,
    counts: FamilyGrantCleanupCounts,
    options: CleanupOptions,
): Promise<void> {
    const trees: Array<{ treeUid: string; otherUid: string }> = [
        { treeUid: ownerUid, otherUid: memberUid },
        { treeUid: memberUid, otherUid: ownerUid },
    ];

    for (const { treeUid, otherUid } of trees) {
        const financeRef = usersRef(db).doc(treeUid).collection('finance');
        const fieldPath = `accountShares.${otherUid}`;

        let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
        let batch = db.batch();
        let batchOps = 0;
        let batchIndex = 0;

        // Paginate until exhausted. Removing the field takes the row out of the
        // query result; startAfter(lastDoc) keeps paging past already-handled
        // rows so progress is monotonic and re-runs converge to a no-op.
        while (true) {
            let query = financeRef.where(fieldPath, '==', true).limit(CLEANUP_PAGE_SIZE);
            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }
            const page = await query.get();

            for (const rowDoc of page.docs) {
                counts.financeRowsScanned += 1;
                counts.financeRowsUpdated += 1;
                if (!options.dryRun) {
                    batch.update(rowDoc.ref, { [fieldPath]: FieldValue.delete() });
                    batchOps += 1;
                }
            }

            if (options.dryRun) {
                if (page.empty || page.size < CLEANUP_PAGE_SIZE) {
                    break;
                }
                lastDoc = page.docs[page.docs.length - 1];
                continue;
            }

            if (batchOps > 0) {
                const failure = options.failBatchPredicate?.('finance', batchIndex);
                if (failure) {
                    throw failure;
                }
                await batch.commit();
                counts.batchesCommitted += 1;
                batchIndex += 1;
                batch = db.batch();
                batchOps = 0;
            }

            if (page.empty || page.size < CLEANUP_PAGE_SIZE) {
                break;
            }
            lastDoc = page.docs[page.docs.length - 1];
        }
    }
}

/**
 * Idempotently clean all modern grant state for a revoked (owner, member) pair.
 * Returns counts (counts reflect intended changes in dry-run mode).
 */
export async function cleanupFamilyGrants(
    db: Firestore,
    ownerUid: string,
    memberUid: string,
    options: CleanupOptions = {},
): Promise<FamilyGrantCleanupCounts> {
    const counts = emptyCleanupCounts();
    await cleanupOwnerAccounts(db, ownerUid, memberUid, counts, options);
    await cleanupFinanceRowIndexes(db, ownerUid, memberUid, counts, options);
    return counts;
}

