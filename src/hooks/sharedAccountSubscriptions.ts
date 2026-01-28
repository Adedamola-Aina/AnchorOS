/**
 * Shared Account Subscription Helpers
 * 
 * Extracted from useSharedAccounts.ts to keep hooks under 200 lines.
 * Handles real-time Firestore subscriptions for shared accounts.
 */

import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import type { DocumentSnapshot, QuerySnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTransaction } from '../types';

interface SharedAccountInfo {
    id: string;
    ownerUid: string;
}

/**
 * Subscribe to transactions for a shared account
 */
export function subscribeToTransactions(
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

    return onSnapshot(txQuery,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const txs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                accountOwnerId: account.ownerUid,
            } as AnchorTransaction));

            allTransactions.set(key, txs);

            // Merge and sort all transactions
            const merged: AnchorTransaction[] = [];
            allTransactions.forEach(txList => merged.push(...txList));
            merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            onUpdate(merged);
        },
        (err: FirestoreError) => console.error(`Transaction subscription error for ${key}:`, err)
    );
}

/**
 * Subscribe to account document for real-time balance updates
 */
export function subscribeToAccountDetails(
    account: SharedAccountInfo,
    onUpdate: (updater: (prev: AnchorAccount[]) => AnchorAccount[]) => void
): () => void {
    const key = `${account.ownerUid}:${account.id}`;
    const accRef = doc(db, 'artifacts', APP_ID, 'users', account.ownerUid, 'accounts', account.id);

    return onSnapshot(accRef,
        (snapshot: DocumentSnapshot<DocumentData>) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                onUpdate(prev => {
                    const idx = prev.findIndex(a => a.id === account.id);
                    if (idx === -1) return prev;

                    const updatedAccount: AnchorAccount = {
                        id: snapshot.id,
                        ...data as Record<string, unknown>,
                        ownerId: account.ownerUid,
                        sharedWith: data.sharedWith || prev[idx].sharedWith
                    } as AnchorAccount;

                    const newArr = [...prev];
                    newArr[idx] = updatedAccount;
                    return newArr;
                });
            } else {
                // Account deleted
                onUpdate(prev => prev.filter(a => a.id !== account.id));
            }
        },
        (err: FirestoreError) => console.error(`Account subscription error for ${key}:`, err)
    );
}
