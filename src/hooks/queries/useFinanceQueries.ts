/**
 * Finance Queries - Handles data fetching for own accounts/transactions only
 * 
 * Family member shared data is handled by useSharedAccounts hook separately
 */
// @ts-nocheck


import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { financeApi } from '../../api/FinanceApi';
import type { AnchorTransaction, AnchorAccount } from '../../types';

export const FINANCE_KEYS = {
    all: ['finance'] as const,
    transactions: (userId: string, start: string, end: string) =>
        [...FINANCE_KEYS.all, 'transactions', userId, { start, end }] as const,
    recentTransactions: (userId: string, limitCount: number) =>
        [...FINANCE_KEYS.all, 'recentTransactions', userId, limitCount] as const,
    accounts: (userId: string) =>
        [...FINANCE_KEYS.all, 'accounts', userId] as const,
};

/**
 * Query own transactions for a date range
 */
export const useTransactionsQuery = (userId: string | undefined, start: string, end: string) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(
        () => FINANCE_KEYS.transactions(userId || '', start, end),
        [userId, start, end]
    );

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = financeApi.subscribeToTransactions(
            userId,
            start,
            end,
            (data) => queryClient.setQueryData(queryKey, data),
            (error) => console.error("Transactions Query Error:", error)
        );

        return () => unsubscribe();
    }, [userId, start, end, queryClient, queryKey]);

    return useQuery<AnchorTransaction[]>({
        queryKey,
        queryFn: () => Promise.resolve([]),
        enabled: !!userId,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

/**
 * Query own accounts
 */
export const useAccountsQuery = (userId: string | undefined) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => FINANCE_KEYS.accounts(userId || ''), [userId]);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = financeApi.subscribeToAccounts(
            userId,
            (data) => queryClient.setQueryData(queryKey, data),
            (error) => console.error("Accounts Query Error:", error)
        );

        return () => unsubscribe();
    }, [userId, queryClient, queryKey]);

    return useQuery<AnchorAccount[]>({
        queryKey,
        queryFn: () => Promise.resolve([]),
        enabled: !!userId,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

/**
 * Query recent transactions (for dashboard)
 */
export const useRecentTransactionsQuery = (userId: string | undefined, limitCount: number = 5) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(
        () => FINANCE_KEYS.recentTransactions(userId || '', limitCount),
        [userId, limitCount]
    );

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = financeApi.subscribeToRecentTransactions(
            userId,
            limitCount,
            (data) => queryClient.setQueryData(queryKey, data),
            (error) => console.error("Recent Transactions Query Error:", error)
        );

        return () => unsubscribe();
    }, [userId, limitCount, queryClient, queryKey]);

    return useQuery<AnchorTransaction[]>({
        queryKey,
        queryFn: () => Promise.resolve([]),
        enabled: !!userId,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

// REMOVED: useFamilyTransactionsQuery - use useSharedAccounts instead
// REMOVED: useFamilyAccountsQuery - use useSharedAccounts instead
// REMOVED: useRecentFamilyTransactionsQuery - use useSharedAccounts instead
