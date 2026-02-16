"use strict";
/**
 * Shared utility functions for Cloud Functions
 *
 * Common operations: audit logging, notifications, connection lookup,
 * and verification code generation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = generateVerificationCode;
exports.createAuditLog = createAuditLog;
exports.createNotification = createNotification;
exports.getActiveConnection = getActiveConnection;
const firestore_1 = require("firebase-admin/firestore");
const config_1 = require("./config");
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
async function createAuditLog(action, actorUid, metadata = {}, targetUid) {
    await config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('audit_log').add({
        action,
        actorUid,
        targetUid: targetUid || null,
        metadata,
        timestamp: firestore_1.FieldValue.serverTimestamp(),
    });
}
async function createNotification(userId, type, title, message, actorUid, actorName, extra = {}) {
    await config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('users').doc(userId)
        .collection('notifications').add({
        type,
        title,
        message,
        actorUid,
        actorName,
        read: false,
        dismissed: false,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        ...extra,
    });
}
async function getActiveConnection(userUid) {
    const connectionsRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('family_connections');
    // Check as owner
    const ownerQuery = await connectionsRef
        .where('ownerUid', '==', userUid)
        .where('status', '==', 'active')
        .limit(1)
        .get();
    if (!ownerQuery.empty) {
        return { id: ownerQuery.docs[0].id, ...ownerQuery.docs[0].data() };
    }
    // Check as member
    const memberQuery = await connectionsRef
        .where('memberUid', '==', userUid)
        .where('status', '==', 'active')
        .limit(1)
        .get();
    if (!memberQuery.empty) {
        return { id: memberQuery.docs[0].id, ...memberQuery.docs[0].data() };
    }
    return null;
}
//# sourceMappingURL=helpers.js.map