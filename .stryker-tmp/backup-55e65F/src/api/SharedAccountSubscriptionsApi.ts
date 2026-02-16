import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import type { DocumentSnapshot, QuerySnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTransaction } from '../types';

interface SharedAccountInfo {
  id: string;
  ownerUid: string;
}

export function subscribeToSharedAccountTransactions(
  account: SharedAccountInfo,
  allTransactions: Map<string, AnchorTransaction[]>,
  onUpdate: (transactions: AnchorTransaction[]) => void
): () => void {
  const key = `${account.ownerUid}:${account.id}`;

  const txQuery = query(
    collection(db, 'artifacts', APP_ID, 'users', account.ownerUid, 'finance'),
    where('accountId', '==', account.id),
    orderBy('date', 'desc')
  );

  return onSnapshot(
    txQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const transactions = snapshot.docs.map((transactionDoc) => ({
        id: transactionDoc.id,
        ...transactionDoc.data(),
        accountOwnerId: account.ownerUid,
      } as AnchorTransaction));

      allTransactions.set(key, transactions);

      const merged: AnchorTransaction[] = [];
      allTransactions.forEach((transactionList) => merged.push(...transactionList));
      merged.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
      onUpdate(merged);
    },
    (err: FirestoreError) => console.error(`Transaction subscription error for ${key}:`, err)
  );
}

export function subscribeToSharedAccountDetails(
  account: SharedAccountInfo,
  onUpdate: (updater: (prev: AnchorAccount[]) => AnchorAccount[]) => void
): () => void {
  const key = `${account.ownerUid}:${account.id}`;
  const accountRef = doc(db, 'artifacts', APP_ID, 'users', account.ownerUid, 'accounts', account.id);

  return onSnapshot(
    accountRef,
    (snapshot: DocumentSnapshot<DocumentData>) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate((prev) => {
          const index = prev.findIndex((accountItem) => accountItem.id === account.id);
          if (index === -1) return prev;

          const updatedAccount: AnchorAccount = {
            id: snapshot.id,
            ...(data as Record<string, unknown>),
            ownerId: account.ownerUid,
            sharedWith: data.sharedWith || prev[index].sharedWith,
          } as AnchorAccount;

          const next = [...prev];
          next[index] = updatedAccount;
          return next;
        });
      } else {
        onUpdate((prev) => prev.filter((accountItem) => accountItem.id !== account.id));
      }
    },
    (err: FirestoreError) => console.error(`Account subscription error for ${key}:`, err)
  );
}
