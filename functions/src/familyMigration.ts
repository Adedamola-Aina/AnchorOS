/**
 * Family Migration — V1 → V2 connection format
 *
 * One-time migration callable that converts legacy spouseId-based
 * connections to the v2 family_connections document model.
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db, APP_ID } from './config';
import { createAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Migration: V1 → V2 Family Connections
// ============================================================================

export const migrateFamilyConnectionsV2 = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Must be authenticated to run migration');
        }

        const callerUid = request.auth.uid;
        await enforceRateLimit('familyMigration', callerUid);

        const results: Array<{
            ownerUid: string;
            memberUid: string;
            status: 'migrated' | 'skipped' | 'error';
            message?: string;
        }> = [];

        try {
            const usersRef = db.collection('artifacts').doc(APP_ID).collection('users');
            const callerDoc = await usersRef.doc(callerUid).get();

            if (!callerDoc.exists) {
                throw new HttpsError('not-found', 'User profile not found');
            }

            const callerData = callerDoc.data();
            const spouseId = callerData?.spouseId;
            if (!spouseId) {
                return { success: true, totalProcessed: 0, migrated: 0, skipped: 0, details: [] };
            }

            const connectionsRef = db.collection('artifacts').doc(APP_ID).collection('family_connections');
            const existingQuery = await connectionsRef
                .where('ownerUid', '==', callerUid)
                .where('memberUid', '==', spouseId)
                .where('status', '==', 'active')
                .get();

            if (!existingQuery.empty) {
                results.push({ ownerUid: callerUid, memberUid: spouseId, status: 'skipped', message: 'V2 connection already exists' });
            } else {
                const spouseDoc = await usersRef.doc(spouseId).get();
                const spouseData = spouseDoc.data() || {};
                const connectionId = `${callerUid}_${spouseId}`;

                await connectionsRef.doc(connectionId).set({
                    id: connectionId,
                    ownerUid: callerUid,
                    memberUid: spouseId,
                    ownerDisplayName: callerData?.name || callerData?.email || 'User',
                    memberDisplayName: spouseData.name || spouseData.email || 'Family Member',
                    status: 'active',
                    connectedAt: new Date().toISOString(),
                    migratedFromV1: true,
                });

                await createAuditLog('migration_v1_to_v2', callerUid, {
                    ownerUid: callerUid, memberUid: spouseId, actor: callerUid,
                });

                results.push({ ownerUid: callerUid, memberUid: spouseId, status: 'migrated' });
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
            throw new HttpsError('internal', 'Migration failed. Please try again or contact support.');
        }
    }
);
