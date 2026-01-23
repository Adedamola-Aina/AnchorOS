/**
 * Hook for fetching accounts shared with the current user
 * Used by family members (non-owners) to see shared accounts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, APP_ID } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, FirestoreError } from 'firebase/firestore';
import type { DocumentSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import type { AnchorAccount, AnchorTransaction } from '../types';

interface SharedAccountFromServer {
    id: string;
    ownerUid: string;
    name: string;
    type: string;
    balanceCents: number;
    currency: 'NGN' | 'USD';
    color?: string;
    scope: 'personal' | 'family';
    sharedAt: string;
    permission?: 'read' | 'transact' | 'manage';
}

interface UseSharedAccountsResult {
    sharedAccounts: AnchorAccount[];
    sharedTransactions: AnchorTransaction[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSharedAccounts(
    currentUserId: string | undefined,
    enabled: boolean = true
): UseSharedAccountsResult {
    const [sharedAccounts, setSharedAccounts] = useState<AnchorAccount[]>([]);
    const [sharedTransactions, setSharedTransactions] = useState<AnchorTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Track which owner/account combinations we're subscribed to
    const subscriptionsRef = useRef<Map<string, () => void>>(new Map());

    const fetchSharedAccounts = useCallback(async () => {
        if (!currentUserId || !enabled) {
            setSharedAccounts([]);
            setSharedTransactions([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const functions = getFunctions();
            const getSharedAccounts = httpsCallable<
                unknown,
                { accounts: SharedAccountFromServer[] }
            >(functions, 'getSharedAccountsWithMe');

            const result = await getSharedAccounts({});
            const accounts = result.data.accounts;

            // Transform to AnchorAccount format
            const transformedAccounts: AnchorAccount[] = accounts.map(acc => ({
                id: acc.id,
                name: acc.name,
                type: acc.type as AnchorAccount['type'],
                currency: acc.currency,
                balanceCents: acc.balanceCents,
                color: acc.color || '#6366f1',
                scope: 'family',
                ownerId: acc.ownerUid,
                sharedWith: {
                    [currentUserId]: {
                        grantedAt: acc.sharedAt,
                        grantedBy: acc.ownerUid,
                        permission: acc.permission
                    }
                }
            }));

            setSharedAccounts(transformedAccounts);

            // Clean up old subscriptions
            subscriptionsRef.current.forEach(unsub => unsub());
            subscriptionsRef.current.clear();

            // Subscribe to transactions AND account details for real-time updates
            const allTransactions: Map<string, AnchorTransaction[]> = new Map();

            accounts.forEach(acc => {
                const key = `${acc.ownerUid}:${acc.id}`;

                // 1. Transaction Subscription
                const txQuery = query(
                    collection(db, 'artifacts', APP_ID, 'users', acc.ownerUid, 'finance'),
                    where('accountId', '==', acc.id),
                    orderBy('date', 'desc')
                );

                const txUnsubscribe = onSnapshot(txQuery,
                    (snapshot: QuerySnapshot<DocumentData>) => {
                        const txs = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            accountOwnerId: acc.ownerUid,
                        } as AnchorTransaction));

                        allTransactions.set(key, txs);

                        // Merge all transactions
                        const merged: AnchorTransaction[] = [];
                        allTransactions.forEach(txList => merged.push(...txList));
                        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        setSharedTransactions(merged);
                    },
                    (err: FirestoreError) => console.error(`Transaction subscription error for ${key}:`, err)
                );

                subscriptionsRef.current.set(key + ':tx', txUnsubscribe);

                // 2. Account Details Subscription (Real-time Balance)
                const accRef = doc(db, 'artifacts', APP_ID, 'users', acc.ownerUid, 'accounts', acc.id);
                const accUnsubscribe = onSnapshot(accRef,
                    (snapshot: DocumentSnapshot<DocumentData>) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data();
                            setSharedAccounts(prev => {
                                const idx = prev.findIndex(a => a.id === acc.id);
                                if (idx === -1) return prev; // Should not happen given we initialized it

                                const updatedAccount: AnchorAccount = {
                                    id: snapshot.id,
                                    ...data as any,
                                    ownerId: acc.ownerUid,
                                    // Ensure sharedWith is preserved or updated from doc
                                    // We default to the doc's sharedWith, but fallback to initial match if missing (unlikely)
                                    sharedWith: data.sharedWith || prev[idx].sharedWith
                                };

                                const newArr = [...prev];
                                newArr[idx] = updatedAccount;
                                return newArr;
                            });
                        } else {
                            // Account deleted
                            setSharedAccounts(prev => prev.filter(a => a.id !== acc.id));
                        }
                    },
                    (err: FirestoreError) => console.error(`Account subscription error for ${key}:`, err)
                );

                subscriptionsRef.current.set(key + ':acc', accUnsubscribe);
            });

            setLoading(false);

        } catch (err) {
            console.error('Failed to fetch shared accounts:', err);
            setError('Unable to load shared accounts');
            setLoading(false);
        }
    }, [currentUserId, enabled]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchSharedAccounts();

        return () => {
            // Cleanup subscriptions
            subscriptionsRef.current.forEach(unsub => unsub());
            subscriptionsRef.current.clear();
        };
    }, [fetchSharedAccounts]);

    return {
        sharedAccounts,
        sharedTransactions,
        loading,
        error,
        refetch: fetchSharedAccounts
    };
}
