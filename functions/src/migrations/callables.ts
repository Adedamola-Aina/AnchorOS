/**
 * Migration Callable Handlers — ENG-003
 *
 * Cloud Function callables for running, listing, and checking
 * migration status. All require authentication and rate limiting.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from '../callable';
import { enforceRateLimit } from '../rateLimit';
import { runner } from './migrationRegistry';

/** List all registered migrations with metadata. */
export const listMigrations = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }
    return { migrations: runner.list() };
});

/** Get status of a specific migration. */
export const getMigrationStatus = secureOnCall<{ migrationId: string }>(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { migrationId } = request.data;
        if (!migrationId) {
            throw new HttpsError('invalid-argument', 'migrationId is required');
        }

        const status = await runner.getStatus(migrationId);
        return { status };
    }
);

/** Run a migration (with optional dry-run). */
export const runMigration = secureOnCall<{ migrationId: string; dryRun?: boolean }>(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const callerUid = request.auth.uid;
        await enforceRateLimit('familyMigration', callerUid);

        const { migrationId, dryRun = false } = request.data;
        if (!migrationId) {
            throw new HttpsError('invalid-argument', 'migrationId is required');
        }

        try {
            const result = await runner.run(migrationId, {
                callerUid,
                dryRun,
            });
            return { result };
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new HttpsError('failed-precondition', msg);
        }
    }
);

/** Rollback a completed migration. */
export const rollbackMigration = secureOnCall<{ migrationId: string }>(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const callerUid = request.auth.uid;
        await enforceRateLimit('familyMigration', callerUid);

        const { migrationId } = request.data;
        if (!migrationId) {
            throw new HttpsError('invalid-argument', 'migrationId is required');
        }

        try {
            const result = await runner.rollback(migrationId, { callerUid });
            return { result };
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new HttpsError('failed-precondition', msg);
        }
    }
);
