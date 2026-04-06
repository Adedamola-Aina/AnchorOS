/**
 * Migration: 001 — Family V1 → V2 Connections
 *
 * Converts legacy spouseId-based connections to v2 family_connections
 * document model. Originally in familyMigration.ts, now in framework.
 */

import type { MigrationDefinition, MigrationContext } from '../types';

export const migration001FamilyV2: MigrationDefinition = {
    id: '001',
    name: 'family_v2_connections',
    createdAt: '2026-01-26T00:00:00Z',
    description: 'Convert legacy spouseId fields to v2 family_connections documents',

    async up(ctx: MigrationContext) {
        const usersRef = ctx.db
            .collection('artifacts')
            .doc(ctx.appId)
            .collection('users');
        const connectionsRef = ctx.db
            .collection('artifacts')
            .doc(ctx.appId)
            .collection('family_connections');

        const usersSnap = await usersRef.get();
        let processed = 0;
        let modified = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const userDoc of usersSnap.docs) {
            const data = userDoc.data();
            const spouseId = data?.spouseId;
            if (!spouseId) {
                skipped++;
                continue;
            }

            processed++;

            try {
                const connectionId = `${userDoc.id}_${spouseId}`;
                const existing = await connectionsRef.doc(connectionId).get();

                if (existing.exists) {
                    skipped++;
                    continue;
                }

                if (!ctx.dryRun) {
                    const spouseDoc = await usersRef.doc(spouseId).get();
                    const spouseData = spouseDoc.data() || {};

                    await connectionsRef.doc(connectionId).set({
                        id: connectionId,
                        ownerUid: userDoc.id,
                        memberUid: spouseId,
                        ownerDisplayName: data.name || data.email || 'User',
                        memberDisplayName:
                            spouseData.name || spouseData.email || 'Family Member',
                        status: 'active',
                        connectedAt: new Date().toISOString(),
                        migratedFromV1: true,
                    });
                }

                modified++;
            } catch (err) {
                const msg =
                    err instanceof Error ? err.message : String(err);
                errors.push(`User ${userDoc.id}: ${msg}`);
            }
        }

        return { processed, modified, skipped, errors };
    },

    async down(ctx: MigrationContext) {
        const connectionsRef = ctx.db
            .collection('artifacts')
            .doc(ctx.appId)
            .collection('family_connections');

        const migratedSnap = await connectionsRef
            .where('migratedFromV1', '==', true)
            .get();

        let processed = 0;
        let modified = 0;
        const errors: string[] = [];

        for (const doc of migratedSnap.docs) {
            processed++;
            try {
                if (!ctx.dryRun) {
                    await doc.ref.delete();
                }
                modified++;
            } catch (err) {
                const msg =
                    err instanceof Error ? err.message : String(err);
                errors.push(`Connection ${doc.id}: ${msg}`);
            }
        }

        return { processed, modified, skipped: 0, errors };
    },
};
