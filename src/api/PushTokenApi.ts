// @ts-nocheck
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

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