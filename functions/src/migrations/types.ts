/**
 * Migration Framework Types — ENG-003
 *
 * Versioned Firestore schema migration definitions.
 */

/** State of a single migration run */
export type MigrationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';

/** Definition of a migration registered in the framework */
export interface MigrationDefinition {
    /** Unique sequential ID, e.g. "001" */
    readonly id: string;
    /** Human-readable name, e.g. "family_v2_connections" */
    readonly name: string;
    /** ISO-8601 timestamp when migration was authored */
    readonly createdAt: string;
    /** Short description of what the migration does */
    readonly description: string;
    /** The forward migration logic */
    readonly up: (ctx: MigrationContext) => Promise<MigrationResult>;
    /** The rollback logic (best-effort for Firestore) */
    readonly down: (ctx: MigrationContext) => Promise<MigrationResult>;
}

/** Context passed to migration up/down functions */
export interface MigrationContext {
    /** Firestore database reference */
    readonly db: FirebaseFirestore.Firestore;
    /** The artifact app ID */
    readonly appId: string;
    /** Whether this is a dry-run (no writes) */
    readonly dryRun: boolean;
    /** UID of the user who triggered the migration */
    readonly callerUid: string;
}

/** Result returned by up/down functions */
export interface MigrationResult {
    /** Number of documents processed */
    readonly processed: number;
    /** Number of documents actually modified */
    readonly modified: number;
    /** Number of documents skipped (already migrated or not applicable) */
    readonly skipped: number;
    /** Optional error messages for partial failures */
    readonly errors: string[];
}

/** Record stored in Firestore tracking migration execution */
export interface MigrationRecord {
    readonly migrationId: string;
    readonly name: string;
    readonly status: MigrationStatus;
    readonly dryRun: boolean;
    readonly result: MigrationResult | null;
    readonly startedAt: string;
    readonly completedAt: string | null;
    readonly callerUid: string;
    readonly error: string | null;
}
