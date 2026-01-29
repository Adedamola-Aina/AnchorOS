/**
 * Recurring Transactions Hooks
 * 
 * React Query wrappers for RecurringApi operations.
 * Handles data fetching, caching, and mutations for recurring transactions.
 * 
 * @module hooks/useRecurringQueries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringApi } from '../api/RecurringApi';
import type { RecurringTransaction } from '../types';
import { useEffect, useState } from 'react';

/**
 * Hook to subscribe to user's recurring transactions
 */
export const useRecurringTransactions = (userId: string | undefined) => {
    const queryClient = useQueryClient();
    const queryKey = ['recurring_transactions', userId];

    // We use a dummy query to set up the cache via subscription
    // The actual data flow happens through onSnapshot in the effect
    const { data: initialData } = useQuery<RecurringTransaction[]>({
        queryKey,
        enabled: false, // Start disabled, we hydrate via subscription
        initialData: [],
    });

    const [data, setData] = useState<RecurringTransaction[]>(initialData || []);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = recurringApi.subscribeToRecurring(
            userId,
            (newData) => {
                setData(newData);
                queryClient.setQueryData(queryKey, newData);
                setIsLoading(false);
            },
            (err) => {
                setError(err);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId, queryClient, queryKey]);

    return {
        data,
        isLoading,
        error,
        isEmpty: data.length === 0
    };
};

/**
 * Mutation to create a recurring transaction
 */
export const useCreateRecurringTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<RecurringTransaction, 'id'>) =>
            recurringApi.createRecurring(data),
        onSuccess: (_, variables) => {
            // Invalidate to ensure consistency, though subscription handles it
            queryClient.invalidateQueries({
                queryKey: ['recurring_transactions', variables.userId]
            });
        }
    });
};

/**
 * Mutation to update a recurring transaction
 */
export const useUpdateRecurringTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<RecurringTransaction> }) =>
            recurringApi.updateRecurring(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring_transactions'] });
        }
    });
};

/**
 * Mutation to delete a recurring transaction
 */
export const useDeleteRecurringTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => recurringApi.deleteRecurring(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring_transactions'] });
        }
    });
};
