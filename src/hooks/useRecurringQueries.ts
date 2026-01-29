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

/**
 * Mutation to update a recurring transaction
 */
export const useUpdateRecurringTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<RecurringTransaction> }) =>
            recurringApi.updateRecurring(id, updates),
        onMutate: async ({ id, updates }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['recurring_transactions'] });

            // We need to find the userId from the existing data
            const allQueryData = queryClient.getQueriesData<RecurringTransaction[]>({
                queryKey: ['recurring_transactions']
            });

            let previousData: RecurringTransaction[] | undefined;
            let userId: string | undefined;

            // Find the transaction and update it optimistically
            for (const [key, data] of allQueryData) {
                if (data) {
                    const found = data.find(r => r.id === id);
                    if (found) {
                        previousData = data;
                        userId = key[1] as string;
                        queryClient.setQueryData<RecurringTransaction[]>(
                            key,
                            data.map(r => r.id === id ? { ...r, ...updates } : r)
                        );
                        break;
                    }
                }
            }

            return { previousData, userId };
        },
        onError: (_, __, context) => {
            // Rollback on error
            if (context?.previousData && context?.userId) {
                queryClient.setQueryData(
                    ['recurring_transactions', context.userId],
                    context.previousData
                );
            }
        },
        onSettled: () => {
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
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['recurring_transactions'] });

            const allQueryData = queryClient.getQueriesData<RecurringTransaction[]>({
                queryKey: ['recurring_transactions']
            });

            let previousData: RecurringTransaction[] | undefined;
            let userId: string | undefined;

            // Find and remove the transaction optimistically
            for (const [key, data] of allQueryData) {
                if (data) {
                    const found = data.find(r => r.id === id);
                    if (found) {
                        previousData = data;
                        userId = key[1] as string;
                        queryClient.setQueryData<RecurringTransaction[]>(
                            key,
                            data.filter(r => r.id !== id)
                        );
                        break;
                    }
                }
            }

            return { previousData, userId };
        },
        onError: (_, __, context) => {
            // Rollback on error
            if (context?.previousData && context?.userId) {
                queryClient.setQueryData(
                    ['recurring_transactions', context.userId],
                    context.previousData
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring_transactions'] });
        }
    });
};
