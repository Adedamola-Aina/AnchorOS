// @ts-nocheck
import { doc, updateDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

export type SharePermission = 'read' | 'transact' | 'manage';

export async function updateSharedPermission(
  ownerUid: string,
  accountId: string,
  sharedUid: string,
  permission: SharePermission
): Promise<void> {
  const accountRef = doc(db, 'artifacts', APP_ID, 'users', ownerUid, 'accounts', accountId);
  await updateDoc(accountRef, { [`sharedWith.${sharedUid}.permission`]: permission });
}
