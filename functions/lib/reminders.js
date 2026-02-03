"use strict";
/**
 * PLT-003: Commitment Reminders - Server-Side Push Delivery
 *
 * Scheduled function that runs every 5 minutes to check for due reminders
 * and sends native push notifications via FCM.
 *
 * Design Philosophy: Notifications are minimal, calm, straight to the point.
 * - No emoji clutter
 * - No "It's time for..." fluff
 * - Just the commitment title
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processReminders = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const date_fns_1 = require("date-fns");
const db = admin.firestore();
const APP_ID = 'anchor-os';
/**
 * Scheduled function: runs every 5 minutes
 * Queries commitments with reminders in the current time window and sends push notifications.
 */
exports.processReminders = functions.pubsub
    .schedule('every 1 minutes')
    .timeZone('Africa/Lagos') // WAT - adjust as needed
    .onRun(async () => {
    var _a;
    const now = new Date();
    const currentTime = (0, date_fns_1.format)(now, 'HH:mm');
    const todayDate = (0, date_fns_1.format)(now, 'yyyy-MM-dd');
    console.log(`[Reminders] Processing reminders for ${currentTime} on ${todayDate}`);
    try {
        // Query all incomplete commitments with reminderTime matching current window
        // Note: This is a collection group query across all users
        const snapshot = await db.collectionGroup('commitments')
            .where('reminderTime', '==', currentTime)
            .where('completed', '==', false)
            .get();
        if (snapshot.empty) {
            console.log('[Reminders] No reminders due at this time.');
            return null;
        }
        console.log(`[Reminders] Found ${snapshot.size} commitments with reminders.`);
        const sendPromises = [];
        for (const doc of snapshot.docs) {
            const commitment = doc.data();
            const userId = (_a = doc.ref.parent.parent) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                console.warn('[Reminders] Could not determine userId for commitment:', doc.id);
                continue;
            }
            // Check if already notified today (prevent duplicates)
            const lastNotified = commitment.lastReminderSent;
            if (lastNotified === todayDate) {
                console.log(`[Reminders] Already notified for ${doc.id} today, skipping.`);
                continue;
            }
            // Get user's FCM tokens
            const tokensSnapshot = await db
                .collection('artifacts')
                .doc(APP_ID)
                .collection('users')
                .doc(userId)
                .collection('fcmTokens')
                .get();
            if (tokensSnapshot.empty) {
                console.log(`[Reminders] No FCM tokens for user ${userId}, skipping.`);
                continue;
            }
            // Send notification to each token
            for (const tokenDoc of tokensSnapshot.docs) {
                const token = tokenDoc.id;
                sendPromises.push(sendReminderNotification(token, commitment.title, doc.ref, todayDate));
            }
        }
        await Promise.allSettled(sendPromises);
        console.log(`[Reminders] Processed ${sendPromises.length} notification(s).`);
        return null;
    }
    catch (error) {
        console.error('[Reminders] Error processing reminders:', error);
        throw error;
    }
});
/**
 * Send a single FCM notification for a commitment reminder.
 *
 * Notification Copy (per DESIGN_PHILOSOPHY.md):
 * - Title: Just the commitment title (no prefix)
 * - Body: Empty or minimal - the title IS the message
 */
async function sendReminderNotification(token, title, commitmentRef, todayDate) {
    // FCM message - minimal, calm, direct
    const message = {
        token,
        notification: {
            title: title, // Just the commitment. No "Reminder:" prefix.
            body: undefined // No body - the title says it all
        },
        webpush: {
            notification: {
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                requireInteraction: false,
                silent: false
            },
            fcmOptions: {
                link: '/commitments' // Open commitments page when tapped
            }
        },
        // For iOS/Android native apps (future)
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                    badge: 1
                }
            }
        },
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
                channelId: 'reminders'
            }
        }
    };
    try {
        await admin.messaging().send(message);
        console.log(`[Reminders] Sent notification to token: ${token.substring(0, 10)}...`);
        // Mark as notified today to prevent duplicates
        await commitmentRef.update({
            lastReminderSent: todayDate
        });
    }
    catch (error) {
        // Handle stale tokens
        if (error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-registration-token') {
            console.warn(`[Reminders] Removing stale token: ${token.substring(0, 10)}...`);
            // Token is invalid, could delete it here if needed
        }
        else {
            console.error(`[Reminders] Failed to send to ${token.substring(0, 10)}...:`, error.message);
        }
    }
}
//# sourceMappingURL=reminders.js.map