/**
 * Family Migration — V1 → V2 connection format
 *
 * One-time migration callable that converts legacy spouseId-based
 * connections to the v2 family_connections document model.
 */
// @ts-nocheck


import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db, APP_ID } from './config';
import { createAuditLog } from './helpers';

// ============================================================================
// Migration: V1 → V2 Family Connections
// ============================================================================

export const migrateFamilyConnectionsV2 = onCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Must be authenticated to run migration');
        }

        const callerUid = request.auth.uid;

        const results: Array<{
            ownerUid: string;
            memberUid: string;
            status: 'migrated' | 'skipped' | 'error';
            message?: string;
        }> = [];

        try {
            const usersRef = db.collection('artifacts').doc(APP_ID).collection('users');
            const usersSnapshot = await usersRef.get();
            const processedPairs = new Set<string>();

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const spouseId = userData.spouseId;
                if (!spouseId) continue;

                const pairKey = [userDoc.id, spouseId].sort().join(':');
                if (processedPairs.has(pairKey)) continue;
                processedPairs.add(pairKey);

                const connectionsRef = db.collection('artifacts').doc(APP_ID).collection('family_connections');
                const existingQuery = await connectionsRef
                    .where('ownerUid', '==', userDoc.id)
                    .where('memberUid', '==', spouseId)
                    .where('status', '==', 'active')
                    .get();

                if (!existingQuery.empty) {
                    results.push({ ownerUid: userDoc.id, memberUid: spouseId, status: 'skipped', message: 'V2 connection already exists' });
                    continue;
                }

                const spouseDoc = await usersRef.doc(spouseId).get();
                const spouseData = spouseDoc.data() || {};

                const ownerUid = userDoc.id;
                const memberUid = spouseId;
                const connectionId = `${ownerUid}_${memberUid}`;

                await connectionsRef.doc(connectionId).set({
                    id: connectionId,
                    ownerUid,
                    memberUid,
                    ownerDisplayName: userData.name || userData.email || 'User',
                    memberDisplayName: spouseData.name || spouseData.email || 'Family Member',
                    status: 'active',
                    connectedAt: new Date().toISOString(),
                    migratedFromV1: true,
                });

                await createAuditLog(ownerUid, 'migration_v1_to_v2', {
                    ownerUid, memberUid, actor: callerUid,
                });

                results.push({ ownerUid, memberUid, status: 'migrated' });
            }

            return {
                success: true,
                totalProcessed: results.length,
                migrated: results.filter(r => r.status === 'migrated').length,
                skipped: results.filter(r => r.status === 'skipped').length,
                details: results,
            };
        } catch (error) {
            console.error('Migration error:', error);
            throw new HttpsError('internal', 'Migration failed: ' + (error as Error).message);
        }
    }
);
