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
import { useEffect, useState, useMemo } from 'react';

// Re-export mutation hooks from extracted module
export { useUpdateRecurringTransaction, useDeleteRecurringTransaction } from './useRecurringMutations';

/**
 * Hook to subscribe to user's recurring transactions
 */
export const useRecurringTransactions = (userId: string | undefined) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['recurring_transactions', userId], [userId]);

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
            return;
        }

        // isLoading is initialized to true. We rely on that for the first load.
        // For subsequent user changes, we might want to reset it, but doing so 
        // synchronously in useEffect causes lint errors.

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
        onMutate: async (newRecurring) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['recurring_transactions', newRecurring.userId] });

            // Snapshot current data
            const previousData = queryClient.getQueryData<RecurringTransaction[]>(
                ['recurring_transactions', newRecurring.userId]
            );

            // Optimistically add the new recurring transaction
            queryClient.setQueryData<RecurringTransaction[]>(
                ['recurring_transactions', newRecurring.userId],
                (old = []) => [...old, { ...newRecurring, id: `temp-${Date.now()}` } as RecurringTransaction]
            );

            return { previousData };
        },
        onError: (_, variables, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['recurring_transactions', variables.userId],
                    context.previousData
                );
            }
        },
        onSettled: (_, __, variables) => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({
                queryKey: ['recurring_transactions', variables.userId]
            });
        }
    });
};
