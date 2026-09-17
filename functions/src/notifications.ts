/**
 * Notifications — get & dismiss user notifications
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Get Notifications
// ============================================================================

export const getNotifications = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = request.auth.uid;
        await enforceRateLimit('getNotifications', userId);

        const data = request.data as { limit?: unknown; includeRead?: unknown; startAfterId?: unknown };

        // RA-07 (#151): never trust an unbounded client-supplied page size.
        const DEFAULT_LIMIT = 50;
        const MAX_LIMIT = 100;
        const requested = typeof data?.limit === 'number' && Number.isFinite(data.limit)
            ? Math.floor(data.limit)
            : DEFAULT_LIMIT;
        const limit = Math.min(Math.max(requested, 1), MAX_LIMIT);
        const includeRead = data?.includeRead === true;
        const startAfterId = typeof data?.startAfterId === 'string' && data.startAfterId
            ? data.startAfterId
            : null;

        let query = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('notifications')
            .where('dismissed', '==', false)
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (!includeRead) {
            query = query.where('read', '==', false);
        }

        if (startAfterId) {
            const cursorDoc = await db.collection('artifacts').doc(APP_ID)
                .collection('users').doc(userId)
                .collection('notifications').doc(startAfterId).get();
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        }

        const snapshot = await query.get();
        return {
            notifications: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            limit,
            hasMore: snapshot.size === limit,
        };
    }
);

// ============================================================================
// Dismiss Notification
// ============================================================================

export const dismissNotification = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { notificationId } = request.data as { notificationId: string };
        const userId = request.auth.uid;
        await enforceRateLimit('dismissNotification', userId);

        const notifRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('notifications').doc(notificationId);

        const notifDoc = await notifRef.get();
        if (!notifDoc.exists) {
            throw new HttpsError('not-found', 'Notification not found');
        }

        await notifRef.update({ dismissed: true });
        return { success: true };
    }
);
