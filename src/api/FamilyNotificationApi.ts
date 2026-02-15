import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

export interface FamilyNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  actorUid: string;
  actorName: string;
  read: boolean;
  dismissed: boolean;
  createdAt: { seconds: number };
  accountId?: string;
  accountName?: string;
}

export function subscribeToUnreadNotifications(
  uid: string,
  onData: (notifications: FamilyNotification[]) => void
): Unsubscribe {
  const notificationsRef = collection(db, 'artifacts', APP_ID, 'users', uid, 'notifications');
  const notificationsQuery = query(
    notificationsRef,
    where('dismissed', '==', false),
    where('read', '==', false),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  return onSnapshot(notificationsQuery, (snapshot) => {
    const notifications = snapshot.docs.map((notificationDoc) => ({
      id: notificationDoc.id,
      ...notificationDoc.data(),
    })) as FamilyNotification[];
    onData(notifications);
  });
}

export async function dismissNotification(uid: string, notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'artifacts', APP_ID, 'users', uid, 'notifications', notificationId);
  await updateDoc(notificationRef, { dismissed: true });
}

export async function markNotificationRead(uid: string, notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'artifacts', APP_ID, 'users', uid, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
}