/**
 * Notifications — get & dismiss user notifications
 */

import * as functions from 'firebase-functions';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Get Notifications
// ============================================================================

export const getNotifications = functions.https.onCall(
    async (data: { limit?: number; includeRead?: boolean }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = context.auth.uid;
        await enforceRateLimit('getNotifications', userId);

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

export const dismissNotification = functions.https.onCall(
    async (data: { notificationId: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { notificationId } = data;
        const userId = context.auth.uid;
        await enforceRateLimit('dismissNotification', userId);

        const notifRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('notifications').doc(notificationId);

        const notifDoc = await notifRef.get();
        if (!notifDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Notification not found');
        }

        await notifRef.update({ dismissed: true });
        return { success: true };
    }
);
