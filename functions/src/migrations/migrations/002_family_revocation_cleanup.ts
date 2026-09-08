/**
 * Migration 002 — FS-01/FS-01b family revocation cleanup (bundle B1)
 *
 * One-time, explicit, idempotent cleanup of grant state left behind by
 * HISTORICALLY disconnected family connections (the code fix in
 * familyDisconnect.ts only protects future transitions):
 *
 *   - stale `sharedWith.<memberUid>` grants on owner accounts
 *   - stale `scope: 'family'` flags on accounts with no remaining modern grant
 *   - stale `accountShares.<otherUid>` row indexes in both parties' finance trees
 *
 * Safety properties:
 *   - only connections with `status == 'disconnected'` are processed; active
 *     and `revoking` connections are never touched
 *   - no transaction/finance row is deleted; no amounts, balances, categories,
 *     account ids, ownership or timestamps are modified — only authorization
 *     metadata created by revoked relationships is removed
 *   - dry-run mode reports counts without mutation
 *   - idempotent: re-running produces no further changes
 *   - chunked/bounded: cleanup uses paged queries and batches of
 *     CLEANUP_BATCH_SIZE (≤ Firestore batch limits); the number of connections
 *     processed per invocation can be bounded via the
 *     `FS01_CLEANUP_MAX_CONNECTIONS` env var for staged production execution
 *
 * This migration is NEVER run automatically. Production execution follows the
 * documented rollout: dry-run/count → CTO review of counts → bounded apply →
 * post-migration verification.
 */

import { logger } from 'firebase-functions';
import type {
    MigrationContext,
    MigrationDefinition,
    MigrationResult,
} from '../types';
import {
    cleanupFamilyGrants,
    emptyCleanupCounts,
    type FamilyGrantCleanupCounts,
} from '../../familyRevocationCleanup';

const MAX_CONNECTIONS_ENV = 'FS01_CLEANUP_MAX_CONNECTIONS';
const CONNECTION_PAGE_SIZE = 100;

function addCounts(total: FamilyGrantCleanupCounts, delta: FamilyGrantCleanupCounts): void {
    total.accountsScanned += delta.accountsScanned;
    total.accountsUpdated += delta.accountsUpdated;
    total.accountScopesReset += delta.accountScopesReset;
    total.financeRowsScanned += delta.financeRowsScanned;
    total.financeRowsUpdated += delta.financeRowsUpdated;
    total.batchesCommitted += delta.batchesCommitted;
}

export const migration002FamilyRevocationCleanup: MigrationDefinition = {
    id: '002',
    name: 'family_revocation_cleanup',
    createdAt: '2026-09-08',
    description: 'FS-01/FS-01b: remove stale sharedWith grants, reset stale family scope to'
        + " 'personal', and strip stale accountShares row indexes for existing disconnected"
        + ' family connections. Idempotent; dry-run supported; never touches active'
        + ' connections or financial contents.',
    up: async (ctx: MigrationContext): Promise<MigrationResult> => {
        const dryRun = ctx.dryRun;
        const maxConnections = process.env[MAX_CONNECTIONS_ENV]
            ? Number.parseInt(process.env[MAX_CONNECTIONS_ENV], 10)
            : undefined;

        const connectionsRef = ctx.db.collection('artifacts').doc(ctx.appId)
            .collection('family_connections');

        const totals = emptyCleanupCounts();
        let processed = 0;
        let modified = 0;
        let skipped = 0;
        const errors: string[] = [];

        let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;

        while (true) {
            let query = connectionsRef.where('status', '==', 'disconnected').limit(CONNECTION_PAGE_SIZE);
            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }
            const page = await query.get();
            if (page.empty) {
                break;
            }

            for (const connDoc of page.docs) {
                if (maxConnections !== undefined && processed >= maxConnections) {
                    logger.info('fs01_cleanup_migration_bounded', {
                        dryRun, processed, modified, skipped,
                        bound: maxConnections,
                    });
                    return { processed, modified, skipped, errors };
                }

                const data = connDoc.data() as { ownerUid?: string; memberUid?: string };
                const ownerUid = data.ownerUid;
                const memberUid = data.memberUid;

                if (!ownerUid || !memberUid) {
                    errors.push(`connection ${connDoc.id}: missing ownerUid/memberUid; skipped`);
                    skipped += 1;
                    continue;
                }

                try {
                    const counts = await cleanupFamilyGrants(ctx.db, ownerUid, memberUid, { dryRun });
                    addCounts(totals, counts);
                    processed += 1;
                    const touched = counts.accountsUpdated + counts.accountScopesReset
                        + counts.financeRowsUpdated;
                    if (touched > 0) {
                        modified += 1;
                    } else {
                        skipped += 1;
                    }
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    errors.push(`connection ${connDoc.id}: cleanup failed: ${msg}`);
                }
            }

            if (page.size < CONNECTION_PAGE_SIZE) {
                break;
            }
            lastDoc = page.docs[page.docs.length - 1];
        }

        // Observability: counts only — no UIDs, no financial content.
        logger.info('fs01_cleanup_migration', {
            dryRun,
            connectionsProcessed: processed,
            connectionsModified: modified,
            connectionsSkipped: skipped,
            accountsScanned: totals.accountsScanned,
            accountsUpdated: totals.accountsUpdated,
            accountScopesReset: totals.accountScopesReset,
            financeRowsScanned: totals.financeRowsScanned,
            financeRowsUpdated: totals.financeRowsUpdated,
            batchesCommitted: totals.batchesCommitted,
            errors: errors.length,
        });

        return { processed, modified, skipped, errors };
    },
    down: async (): Promise<MigrationResult> => ({
        processed: 0,
        modified: 0,
        skipped: 0,
        errors: [
            'Rollback not applicable: this migration only removes authorization '
            + 'metadata (sharedWith grants, scope flags, accountShares indexes) '
            + 'created by already-revoked family relationships. Removed state '
            + 'cannot be re-created from historical data and no destructive '
            + 'rollback is required.',
        ],
    }),
};

