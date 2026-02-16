"use strict";
/**
 * Notifications — get & dismiss user notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dismissNotification = exports.getNotifications = void 0;
const https_1 = require("firebase-functions/v2/https");
const config_1 = require("./config");
const rateLimit_1 = require("./rateLimit");
// ============================================================================
// Get Notifications
// ============================================================================
exports.getNotifications = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const userId = request.auth.uid;
    await (0, rateLimit_1.enforceRateLimit)('getNotifications', userId);
    const data = request.data;
    const limit = data?.limit || 50;
    const includeRead = data?.includeRead ?? false;
    let query = config_1.db.collection('artifacts').doc(config_1.APP_ID)
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
});
// ============================================================================
// Dismiss Notification
// ============================================================================
exports.dismissNotification = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const { notificationId } = request.data;
    const userId = request.auth.uid;
    await (0, rateLimit_1.enforceRateLimit)('dismissNotification', userId);
    const notifRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('users').doc(userId)
        .collection('notifications').doc(notificationId);
    const notifDoc = await notifRef.get();
    if (!notifDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Notification not found');
    }
    await notifRef.update({ dismissed: true });
    return { success: true };
});
//# sourceMappingURL=notifications.js.map