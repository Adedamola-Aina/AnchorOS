/**
 * useFinanceData Hook
 * 
 * Handles finance data fetching, combination of own and shared data,
 * and memoized calculations for net worth and cash flow.
 * 
 * @module hooks/useFinanceData
 */
// @ts-nocheck


import { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import type { AnchorTransaction, AnchorAccount } from '../types';
import { calculateNetWorth } from '../utils/finance';
import { getCashFlowAnalysis } from '../utils/financeInsights';
import { useTransactionsQuery, useAccountsQuery, useRecentTransactionsQuery } from './queries/useFinanceQueries';
import { useSharedAccounts } from './useSharedAccounts';
import { useFamilySharing } from './useFamilySharing';

/** 
 * Get the effective date for sorting/display
 * Uses transactionDate (actual date of transaction) if available,
 * otherwise falls back to date (entry creation date)
 */
const getEffectiveDate = (tx: { transactionDate?: string | Date; date?: string | Date }): number => {
    const d = tx.transactionDate || tx.date;
    if (!d) return 0;
    if (d instanceof Date) return d.getTime();
    return new Date(d).getTime();
};

export const useFinanceData = (user: User | null) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const queryClient = useQueryClient();

    const start = useMemo(() =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString(),
        [currentMonth]
    );
    const end = useMemo(() =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
        [currentMonth]
    );

    // Get family connection status
    const { isOwner, connection } = useFamilySharing(user?.uid);
    const hasConnection = !!connection;

    // Own data
    const { data: ownTransactions = [], isLoading: loadingOwnTx } = useTransactionsQuery(user?.uid, start, end);
    const { data: ownAccounts = [], isLoading: loadingOwnAcc } = useAccountsQuery(user?.uid);
    const { data: recentOwn = [] } = useRecentTransactionsQuery(user?.uid, 20);

    // Shared accounts (only for non-owners with active connection)
    const shouldLoadShared = hasConnection && !isOwner;
    const { sharedAccounts, sharedTransactions: allSharedTransactions, loading: loadingShared } = useSharedAccounts(user?.uid, shouldLoadShared);

    // Filter shared transactions by current month
    const sharedTransactions = useMemo(() => {
        if (!shouldLoadShared || !Array.isArray(allSharedTransactions)) return [];
        return allSharedTransactions.filter(tx => {
            const txDate = new Date(tx.date);
            const startDate = new Date(start);
            const endDate = new Date(end);
            return txDate >= startDate && txDate <= endDate;
        });
    }, [allSharedTransactions, start, end, shouldLoadShared]);

    // Combine own and shared data with O(n) deduplication
    const transactions = useMemo(() => {
        const all = [...ownTransactions, ...sharedTransactions].filter(t => !t.isSoftDeleted);
        const uniqueMap = new Map<string, AnchorTransaction>();
        for (const tx of all) {
            if (!uniqueMap.has(tx.id)) uniqueMap.set(tx.id, tx);
        }
        // Sort by effective date (transactionDate if available, else entry date)
        return Array.from(uniqueMap.values()).sort((a, b) => getEffectiveDate(b) - getEffectiveDate(a));
    }, [ownTransactions, sharedTransactions]);

    const accounts = useMemo(() => {
        const all = [...ownAccounts, ...sharedAccounts];
        const uniqueMap = new Map<string, AnchorAccount>();
        for (const acc of all) {
            if (!uniqueMap.has(acc.id)) uniqueMap.set(acc.id, acc);
        }
        return Array.from(uniqueMap.values());
    }, [ownAccounts, sharedAccounts]);

    const loadingFinance = loadingOwnTx || loadingOwnAcc || (shouldLoadShared && loadingShared);

    const recentActivity = useMemo(() => {
        const sharedTx = Array.isArray(allSharedTransactions) ? allSharedTransactions : [];
        const ownTx = Array.isArray(recentOwn) ? recentOwn : [];
        const combined = [...ownTx, ...sharedTx.slice(0, 20)]
            .filter(t => t && !t.isSoftDeleted)
            .sort((a, b) => getEffectiveDate(b) - getEffectiveDate(a));

        const seen = new Set<string>();
        const unique: AnchorTransaction[] = [];
        for (const tx of combined) {
            if (!seen.has(tx.id)) {
                seen.add(tx.id);
                unique.push(tx);
            }
        }
        return unique.slice(0, 5);
    }, [recentOwn, allSharedTransactions]);

    const netWorth = useMemo(() => {
        const activeAccounts = accounts.filter(a => !a.isArchived);
        return calculateNetWorth(activeAccounts);
    }, [accounts]);

    const cashFlow = useMemo(() => getCashFlowAnalysis(transactions), [transactions]);

    // Navigation helpers
    const nextMonth = () => setCurrentMonth(prev => {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });

    const prevMonth = () => setCurrentMonth(prev => {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });

    const jumpToMonth = (date: Date) => setCurrentMonth(date);

    // Refetch transaction data only (for pull-to-refresh)
    // Use refetchQueries instead of invalidateQueries to avoid clearing the cache
    const refetch = useCallback(async () => {
        await Promise.all([
            queryClient.refetchQueries({ queryKey: ['finance', 'transactions'] }),
            queryClient.refetchQueries({ queryKey: ['finance', 'recentTransactions'] }),
        ]);
    }, [queryClient]);

    return {
        transactions,
        accounts,
        loadingFinance,
        currentMonth,
        nextMonth,
        prevMonth,
        jumpToMonth,
        netWorth,
        recentActivity,
        cashFlow,
        refetch,
    };
};
