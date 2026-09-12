// @ts-nocheck
import { deleteDoc, doc, serverTimestamp, setDoc, db } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';

/**
 * Delete ONE stored push token registration document.
 *
 * The document id IS the FCM registration token, so this is the smallest
 * per-device/per-registration revocation primitive: it targets exactly the
 * device that owns `token` and can never revoke the same account's other
 * devices. Deleting an absent document is a successful no-op, so it is safe to
 * call repeatedly (SN-01/SN-08).
 */
export async function deleteStoredPushToken(userUid: string, token: string): Promise<void> {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', userUid, 'fcmTokens', token));
}

export async function upsertPushToken(
    userUid: string,
    token: string,
    userAgent: string,
    platform: string = 'web'
): Promise<void> {
    const tokenRef = doc(db, 'artifacts', APP_ID, 'users', userUid, 'fcmTokens', token);
    await setDoc(tokenRef, {
        token,
        platform,
        lastSeen: serverTimestamp(),
        userAgent,
    }, { merge: true });
}