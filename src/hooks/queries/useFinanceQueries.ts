/**
 * Finance Queries - Handles data fetching for own accounts/transactions only
 * 
 * Family member shared data is handled by useSharedAccounts hook separately
 */
// @ts-nocheck


import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { financeApi } from '../../api/FinanceApi';
import type { AnchorTransaction, AnchorAccount } from '../../types';
import type { TransactionPageCursor } from '../../api/financePagination';

export const FINANCE_KEYS = {
    all: ['finance'] as const,
    transactions: (userId: string, start: string, end: string) =>
        [...FINANCE_KEYS.all, 'transactions', userId, { start, end }] as const,
    recentTransactions: (userId: string, limitCount: number) =>
        [...FINANCE_KEYS.all, 'recentTransactions', userId, limitCount] as const,
    paginatedTransactions: (userId: string, start: string, end: string, pageSize: number) =>
        [...FINANCE_KEYS.all, 'paginatedTransactions', userId, { start, end, pageSize }] as const,
    accounts: (userId: string) =>
        [...FINANCE_KEYS.all, 'accounts', userId] as const,
};

/**
 * Query own transactions for a date range
 */
export const useTransactionsQuery = (userId: string | undefined, start: string, end: string) => {
    const paged = useInfiniteTransactionsQuery(userId, start, end, 200, !!userId);
    const { hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, error, refetch } = paged;
    const data = useMemo(
        () => (paged.data?.pages || []).flatMap(page => page.page || []),
        [paged.data]
    );

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        void fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        data,
        isLoading: isLoading || isFetchingNextPage,
        error,
        refetch,
    };
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

/**
 * Cursor-based transactions query for large lists.
 */
export const useInfiniteTransactionsQuery = (
    userId: string | undefined,
    start: string,
    end: string,
    pageSize: number = 100,
    enabled: boolean = true
) => {
    const queryKey = useMemo(
        () => FINANCE_KEYS.paginatedTransactions(userId || '', start, end, pageSize),
        [userId, start, end, pageSize]
    );

    return useInfiniteQuery({
        queryKey,
        enabled: !!userId && enabled,
        initialPageParam: null as TransactionPageCursor | null,
        queryFn: ({ pageParam }) =>
            financeApi.fetchTransactionsPage(userId || '', start, end, pageSize, pageParam || undefined),
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });
};

// REMOVED: useFamilyTransactionsQuery - use useSharedAccounts instead
// REMOVED: useFamilyAccountsQuery - use useSharedAccounts instead
// REMOVED: useRecentFamilyTransactionsQuery - use useSharedAccounts instead
