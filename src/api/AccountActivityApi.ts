// @ts-nocheck
import { addDoc, collection, limit, onSnapshot, orderBy, query, type Unsubscribe } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AccountActivity } from '../types/activity';

export function subscribeToAccountActivity(
  accountId: string,
  accountOwnerId: string,
  maxItems: number,
  onData: (activities: AccountActivity[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const activitiesRef = collection(
    db,
    'artifacts',
    APP_ID,
    'users',
    accountOwnerId,
    'accounts',
    accountId,
    'activity'
  );

  const activitiesQuery = query(activitiesRef, orderBy('timestamp', 'desc'), limit(maxItems));

  return onSnapshot(
    activitiesQuery,
    (snapshot) => {
      const activityList: AccountActivity[] = snapshot.docs.map((activityDoc) => ({
        id: activityDoc.id,
        ...activityDoc.data(),
      } as AccountActivity));
      onData(activityList);
    },
    (err) => onError(err)
  );
}

export async function createAccountActivity(
  accountId: string,
  accountOwnerId: string,
  activityData: Omit<AccountActivity, 'id'>
): Promise<void> {
  const activitiesRef = collection(
    db,
    'artifacts',
    APP_ID,
    'users',
    accountOwnerId,
    'accounts',
    accountId,
    'activity'
  );

  await addDoc(activitiesRef, activityData);
}
