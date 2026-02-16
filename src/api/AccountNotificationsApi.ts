// @ts-nocheck
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc, where, writeBatch, type Unsubscribe } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorNotification } from '../types';

export function subscribeToAccountNotifications(
  userUid: string,
  accountId: string | undefined,
  onData: (notifications: AnchorNotification[]) => void
): Unsubscribe {
  const notificationsRef = collection(db, 'artifacts', APP_ID, 'users', userUid, 'notifications');
  const notificationsQuery = accountId
    ? query(notificationsRef, where('accountId', '==', accountId), orderBy('date', 'desc'), limit(20))
    : query(notificationsRef, orderBy('date', 'desc'), limit(50));

  return onSnapshot(notificationsQuery, (snapshot) => {
    const notifications = snapshot.docs.map((notificationDoc) => ({
      id: notificationDoc.id,
      ...notificationDoc.data(),
    } as AnchorNotification));
    onData(notifications);
  });
}

export async function markAccountNotificationAsRead(userUid: string, notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'artifacts', APP_ID, 'users', userUid, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
}

export async function markAllAccountNotificationsAsRead(
  userUid: string,
  notifications: AnchorNotification[]
): Promise<void> {
  const unreadNotifications = notifications.filter((notification) => !notification.read);
  if (unreadNotifications.length === 0) return;

  const batch = writeBatch(db);
  unreadNotifications.forEach((notification) => {
    const notificationRef = doc(db, 'artifacts', APP_ID, 'users', userUid, 'notifications', notification.id);
    batch.update(notificationRef, { read: true });
  });

  await batch.commit();
}