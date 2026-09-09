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
 *   - dry-run mode reports counts without mutation (and is intentionally
 *     unbounded when no connection bound is configured)
 *   - idempotent: re-running produces no further changes
 *   - chunked/bounded: cleanup uses paged queries and batches of
 *     CLEANUP_BATCH_SIZE (≤ Firestore batch limits); the number of connections
 *     processed per invocation is bounded by the `FS01_CLEANUP_MAX_CONNECTIONS`
 *     env var for staged production execution
 *   - fail-closed apply: apply mode (dryRun=false) REQUIRES
 *     `FS01_CLEANUP_MAX_CONNECTIONS` to be a finite positive integer; a
 *     missing, malformed, zero, negative or otherwise invalid configuration
 *     aborts the run BEFORE any connection is processed or any product data
 *     is mutated — an apply can never silently become unbounded
 *   - dry-run: intentionally runs WITHOUT the bound (full counting for CTO
 *     review); if the bound is present in dry-run it must still be a finite
 *     positive integer and is honored for bounded counting
 *
 * This migration is NEVER run automatically. Production execution follows the
 * documented rollout: dry-run/count → CTO review of counts → bounded apply →
 * post-migration verification. Apply mode is fail-closed: it refuses to run
 * without a valid positive-integer connection bound (initiative #118, B1
 * rollout-safety). Fail-closed semantics are proven in
 * familyRevocation.emulator.test.ts (real Firestore emulator).
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

/**
 * Resolve the per-invocation connection bound.
 *
 * Fail-closed policy (initiative #118, B1 rollout-safety):
 *   - apply mode (dryRun=false) REQUIRES the bound to be a finite positive
 *     integer — missing, malformed, zero or negative values abort the run
 *     before any connection is processed or any product data mutated
 *   - dry-run (dryRun=true) intentionally runs WITHOUT the bound (unbounded
 *     full counting); when the bound IS present it must still be a finite
 *     positive integer and is honored for bounded counting
 */
function resolveConnectionBound(dryRun: boolean): number {
    const raw = process.env[MAX_CONNECTIONS_ENV];
    const invalid = (): Error => new Error(
        `${MAX_CONNECTIONS_ENV} must be a positive integer for apply mode`
    );

    if (raw === undefined || raw.trim() === '') {
        if (!dryRun) {
            throw invalid();
        }
        return Number.POSITIVE_INFINITY;
    }

    // Strict decimal digits only — rejects '+12', '-12', '12.5', '1e2',
    // '0x10', '12abc' and whitespace-padded variants.
    const trimmed = raw.trim();
    if (!/^\d+$/.test(trimmed)) {
        throw invalid();
    }
    const bound = Number(trimmed);
    if (!Number.isSafeInteger(bound) || bound <= 0) {
        throw invalid();
    }
    return bound;
}

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
        + ' connections or financial contents. Apply mode is fail-closed: requires'
        + ' FS01_CLEANUP_MAX_CONNECTIONS to be a positive integer.',
    up: async (ctx: MigrationContext): Promise<MigrationResult> => {
        const dryRun = ctx.dryRun;

        // Fail-closed validation FIRST — before any query, connection
        // processing or product data mutation. Apply mode without a valid
        // positive-integer bound aborts here; dry-run proceeds (unbounded
        // when the bound is absent) for full counting.
        const maxConnections = resolveConnectionBound(dryRun);

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
                if (processed >= maxConnections) {
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
            connectionBound: Number.isFinite(maxConnections) ? maxConnections : 'unbounded',
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

