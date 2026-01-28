/**
 * Hook for fetching accounts shared with the current user
 * Used by family members (non-owners) to see shared accounts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { AnchorAccount, AnchorTransaction } from '../types';
import { subscribeToTransactions, subscribeToAccountDetails } from './sharedAccountSubscriptions';

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
                const accountInfo = { id: acc.id, ownerUid: acc.ownerUid };

                // Transaction Subscription
                const txUnsubscribe = subscribeToTransactions(
                    accountInfo,
                    allTransactions,
                    setSharedTransactions
                );
                subscriptionsRef.current.set(key + ':tx', txUnsubscribe);

                // Account Details Subscription (Real-time Balance)
                const accUnsubscribe = subscribeToAccountDetails(
                    accountInfo,
                    setSharedAccounts
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
        // Copy ref to local variable for cleanup function
        const subscriptions = subscriptionsRef.current;

        // Use an IIFE to handle the async fetch
        const controller = new AbortController();

        // Trigger fetch - data fetching is an exception to the set-state-in-effect rule
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchSharedAccounts();

        return () => {
            controller.abort();
            // Cleanup subscriptions using the captured variable
            subscriptions.forEach(unsub => unsub());
            subscriptions.clear();
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
