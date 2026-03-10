/**
 * Notifications — get & dismiss user notifications
 */


import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Get Notifications
// ============================================================================

export const getNotifications = onCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = request.auth.uid;
        await enforceRateLimit('getNotifications', userId);

        const data = request.data as { limit?: number; includeRead?: boolean };
        const limit = data?.limit || 50;
        const includeRead = data?.includeRead ?? false;

        let query = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('notifications')
            .where('dismissed', '==', false)
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (!includeRead) {
            query = query.where('read', '==', false);
        }

        const snapshot = await query.get();
        return { notifications: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
    }
);

// ============================================================================
// Dismiss Notification
// ============================================================================

export const dismissNotification = onCall(
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
