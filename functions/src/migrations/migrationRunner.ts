/**
 * Migration Runner — ENG-003
 *
 * Registers, executes, and tracks versioned Firestore schema migrations.
 * All migration state is stored in `artifacts/{appId}/migrations/{id}`.
 */

import { db, APP_ID } from '../config';
import { createAuditLog } from '../helpers';
import { getStoredRecord, saveRecord } from './migrationStore';
import type {
    MigrationDefinition,
    MigrationContext,
    MigrationRecord,
} from './types';

interface RunOptions {
    readonly callerUid: string;
    readonly dryRun: boolean;
}

interface RollbackOptions {
    readonly callerUid: string;
}

export class MigrationRunner {
    private readonly migrations = new Map<string, MigrationDefinition>();

    /** Register a migration definition. */
    register(migration: MigrationDefinition): void {
        if (this.migrations.has(migration.id)) {
            throw new Error(`Migration "${migration.id}" already registered`);
        }
        this.migrations.set(migration.id, migration);
    }

    /** List all registered migrations (sorted by ID). */
    list(): Array<{ id: string; name: string; description: string; createdAt: string }> {
        return [...this.migrations.values()]
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ id, name, description, createdAt }) => ({
                id,
                name,
                description,
                createdAt,
            }));
    }

    /** Run a migration forward. */
    async run(migrationId: string, options: RunOptions): Promise<MigrationRecord> {
        const migration = this.migrations.get(migrationId);
        if (!migration) {
            throw new Error(`Migration "${migrationId}" not found`);
        }

        // Check if already run
        const existing = await getStoredRecord(migrationId);
        if (existing && existing.status === 'completed' && !existing.dryRun) {
            throw new Error(
                `Migration "${migrationId}" already completed. Use rollback first.`
            );
        }

        const ctx: MigrationContext = {
            db,
            appId: APP_ID,
            dryRun: options.dryRun,
            callerUid: options.callerUid,
        };

        const startedAt = new Date().toISOString();
        let record: MigrationRecord;

        try {
            const result = await migration.up(ctx);
            record = {
                migrationId,
                name: migration.name,
                status: 'completed',
                dryRun: options.dryRun,
                result,
                startedAt,
                completedAt: new Date().toISOString(),
                callerUid: options.callerUid,
                error: null,
            };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            record = {
                migrationId,
                name: migration.name,
                status: 'failed',
                dryRun: options.dryRun,
                result: null,
                startedAt,
                completedAt: new Date().toISOString(),
                callerUid: options.callerUid,
                error: errorMsg,
            };
        }

        // Persist record
        await saveRecord(record);

        // Audit log
        await createAuditLog('migration_run', options.callerUid, {
            migrationId,
            migrationName: migration.name,
            dryRun: options.dryRun,
            status: record.status,
        });

        return record;
    }

    /** Rollback a previously completed migration. */
    async rollback(
        migrationId: string,
        options: RollbackOptions
    ): Promise<MigrationRecord> {
        const migration = this.migrations.get(migrationId);
        if (!migration) {
            throw new Error(`Migration "${migrationId}" not found`);
        }

        const existing = await getStoredRecord(migrationId);
        if (!existing) {
            throw new Error(
                `Migration "${migrationId}" has not been run yet`
            );
        }

        const ctx: MigrationContext = {
            db,
            appId: APP_ID,
            dryRun: false,
            callerUid: options.callerUid,
        };

        const startedAt = new Date().toISOString();
        const result = await migration.down(ctx);

        const record: MigrationRecord = {
            migrationId,
            name: migration.name,
            status: 'rolled_back',
            dryRun: false,
            result,
            startedAt,
            completedAt: new Date().toISOString(),
            callerUid: options.callerUid,
            error: null,
        };

        await saveRecord(record);

        await createAuditLog('migration_rollback', options.callerUid, {
            migrationId,
            migrationName: migration.name,
        });

        return record;
    }

    /** Get current status of a migration. */
    async getStatus(migrationId: string): Promise<MigrationRecord> {
        const stored = await getStoredRecord(migrationId);
        if (stored) return stored;

        const migration = this.migrations.get(migrationId);
        return {
            migrationId,
            name: migration?.name ?? 'unknown',
            status: 'pending',
            dryRun: false,
            result: null,
            startedAt: '',
            completedAt: null,
            callerUid: '',
            error: null,
        };
    }

}
