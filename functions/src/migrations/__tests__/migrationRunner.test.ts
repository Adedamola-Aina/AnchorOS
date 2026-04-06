/**
 * Migration Runner Tests — ENG-003
 *
 * TDD: Written before implementation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MigrationDefinition, MigrationContext, MigrationResult } from '../types';

// Mock Firestore — use vi.hoisted so factories can reference them
const {
    mockDoc: _mockDoc, mockSet, mockGet, mockCollection,
    mockWhere: _mockWhere, mockOrderBy, mockGetQuery,
} = vi.hoisted(() => {
    const mockDoc = vi.fn();
    const mockSet = vi.fn().mockResolvedValue(undefined);
    const mockGet = vi.fn();
    const mockCollection = vi.fn();
    const mockWhere = vi.fn();
    const mockOrderBy = vi.fn();
    const mockGetQuery = vi.fn();

    mockCollection.mockReturnValue({ doc: mockDoc, where: mockWhere, orderBy: mockOrderBy });
    mockDoc.mockReturnValue({ set: mockSet, get: mockGet, collection: mockCollection });
    mockWhere.mockReturnValue({ where: mockWhere, orderBy: mockOrderBy, get: mockGetQuery });
    mockOrderBy.mockReturnValue({ get: mockGetQuery });

    return { mockDoc, mockSet, mockGet, mockCollection, mockWhere, mockOrderBy, mockGetQuery };
});

const mockDb = { collection: mockCollection } as unknown as FirebaseFirestore.Firestore;

vi.mock('../../config', () => ({
    db: { collection: mockCollection },
    APP_ID: 'anchor-os',
}));

vi.mock('../../helpers', () => ({
    createAuditLog: vi.fn().mockResolvedValue(undefined),
}));

function makeMigration(overrides: Partial<MigrationDefinition> = {}): MigrationDefinition {
    return {
        id: '001',
        name: 'test_migration',
        createdAt: '2026-04-06T00:00:00Z',
        description: 'Test migration',
        up: vi.fn<(ctx: MigrationContext) => Promise<MigrationResult>>().mockResolvedValue({
            processed: 5,
            modified: 3,
            skipped: 2,
            errors: [],
        }),
        down: vi.fn<(ctx: MigrationContext) => Promise<MigrationResult>>().mockResolvedValue({
            processed: 3,
            modified: 3,
            skipped: 0,
            errors: [],
        }),
        ...overrides,
    };
}

// Import after mocks
import { MigrationRunner } from '../migrationRunner';
import { createAuditLog } from '../../helpers';

describe('MigrationRunner', () => {
    let runner: MigrationRunner;

    beforeEach(() => {
        vi.clearAllMocks();
        runner = new MigrationRunner();
        // Default: no existing migration records
        mockGetQuery.mockResolvedValue({ empty: true, docs: [] });
        mockGet.mockResolvedValue({ exists: false });
    });

    describe('register', () => {
        it('registers a migration', () => {
            const migration = makeMigration();
            runner.register(migration);
            expect(runner.list()).toHaveLength(1);
            expect(runner.list()[0]).toEqual({
                id: '001',
                name: 'test_migration',
                description: 'Test migration',
                createdAt: '2026-04-06T00:00:00Z',
            });
        });

        it('rejects duplicate migration IDs', () => {
            const m1 = makeMigration({ id: '001' });
            const m2 = makeMigration({ id: '001', name: 'duplicate' });
            runner.register(m1);
            expect(() => runner.register(m2)).toThrow('already registered');
        });

        it('lists migrations in order', () => {
            runner.register(makeMigration({ id: '002', name: 'second' }));
            runner.register(makeMigration({ id: '001', name: 'first' }));
            const list = runner.list();
            expect(list[0].id).toBe('001');
            expect(list[1].id).toBe('002');
        });
    });

    describe('run', () => {
        it('executes migration up function with context', async () => {
            const migration = makeMigration();
            runner.register(migration);

            const result = await runner.run('001', {
                callerUid: 'user-1',
                dryRun: false,
            });

            expect(migration.up).toHaveBeenCalledWith(
                expect.objectContaining({
                    db: mockDb,
                    appId: 'anchor-os',
                    dryRun: false,
                    callerUid: 'user-1',
                })
            );
            expect(result.status).toBe('completed');
            expect(result.result?.modified).toBe(3);
        });

        it('records migration status in Firestore', async () => {
            const migration = makeMigration();
            runner.register(migration);

            await runner.run('001', { callerUid: 'user-1', dryRun: false });

            expect(mockSet).toHaveBeenCalledWith(
                expect.objectContaining({
                    migrationId: '001',
                    name: 'test_migration',
                    status: 'completed',
                    dryRun: false,
                }),
                expect.anything()
            );
        });

        it('supports dry-run mode (no status write)', async () => {
            const migration = makeMigration();
            runner.register(migration);

            const result = await runner.run('001', {
                callerUid: 'user-1',
                dryRun: true,
            });

            expect(migration.up).toHaveBeenCalledWith(
                expect.objectContaining({ dryRun: true })
            );
            expect(result.status).toBe('completed');
            // Dry run should still record (with dryRun flag)
            expect(mockSet).toHaveBeenCalledWith(
                expect.objectContaining({ dryRun: true }),
                expect.anything()
            );
        });

        it('throws for unknown migration ID', async () => {
            await expect(
                runner.run('999', { callerUid: 'user-1', dryRun: false })
            ).rejects.toThrow('not found');
        });

        it('prevents re-running a completed migration', async () => {
            const migration = makeMigration();
            runner.register(migration);

            // Mock: migration already completed in Firestore
            mockGet.mockResolvedValueOnce({
                exists: true,
                data: () => ({ status: 'completed', dryRun: false }),
            });

            await expect(
                runner.run('001', { callerUid: 'user-1', dryRun: false })
            ).rejects.toThrow('already completed');
        });

        it('allows re-running after a dry-run', async () => {
            const migration = makeMigration();
            runner.register(migration);

            // Mock: previous run was dry-run
            mockGet.mockResolvedValueOnce({
                exists: true,
                data: () => ({ status: 'completed', dryRun: true }),
            });

            const result = await runner.run('001', {
                callerUid: 'user-1',
                dryRun: false,
            });

            expect(result.status).toBe('completed');
        });

        it('records failure status on error', async () => {
            const migration = makeMigration({
                up: vi.fn().mockRejectedValue(new Error('Boom')),
            });
            runner.register(migration);

            const result = await runner.run('001', {
                callerUid: 'user-1',
                dryRun: false,
            });

            expect(result.status).toBe('failed');
            expect(result.error).toBe('Boom');
            expect(mockSet).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'failed',
                    error: 'Boom',
                }),
                expect.anything()
            );
        });

        it('creates audit log entry', async () => {
            const migration = makeMigration();
            runner.register(migration);

            await runner.run('001', { callerUid: 'user-1', dryRun: false });

            expect(createAuditLog).toHaveBeenCalledWith(
                'migration_run',
                'user-1',
                expect.objectContaining({
                    migrationId: '001',
                    migrationName: 'test_migration',
                    dryRun: false,
                })
            );
        });
    });

    describe('rollback', () => {
        it('executes migration down function', async () => {
            const migration = makeMigration();
            runner.register(migration);

            // Mock: migration is completed
            mockGet.mockResolvedValueOnce({
                exists: true,
                data: () => ({ status: 'completed', dryRun: false }),
            });

            const result = await runner.rollback('001', { callerUid: 'user-1' });

            expect(migration.down).toHaveBeenCalled();
            expect(result.status).toBe('rolled_back');
        });

        it('throws if migration was never run', async () => {
            const migration = makeMigration();
            runner.register(migration);

            mockGet.mockResolvedValueOnce({ exists: false });

            await expect(
                runner.rollback('001', { callerUid: 'user-1' })
            ).rejects.toThrow('not been run');
        });
    });

    describe('getStatus', () => {
        it('returns pending for unrun migrations', async () => {
            const migration = makeMigration();
            runner.register(migration);

            mockGet.mockResolvedValueOnce({ exists: false });

            const status = await runner.getStatus('001');
            expect(status).toEqual(
                expect.objectContaining({ migrationId: '001', status: 'pending' })
            );
        });

        it('returns stored record for run migrations', async () => {
            const migration = makeMigration();
            runner.register(migration);

            const record = {
                migrationId: '001',
                status: 'completed',
                dryRun: false,
                result: { processed: 5, modified: 3, skipped: 2, errors: [] },
            };
            mockGet.mockResolvedValueOnce({
                exists: true,
                data: () => record,
            });

            const status = await runner.getStatus('001');
            expect(status.status).toBe('completed');
            expect(status.result?.modified).toBe(3);
        });
    });
});
