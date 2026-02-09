/**
 * Recurring Transaction Mutation Hooks
 *
 * Extracted from useRecurringQueries.ts for ARCH-001 compliance.
 * Handles optimistic updates for update and delete operations.
 *
 * @module hooks/useRecurringMutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringApi } from '../api/RecurringApi';
import type { RecurringTransaction } from '../types';

/**
 * Mutation to update a recurring transaction
 */
export const useUpdateRecurringTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<RecurringTransaction> }) =>
            recurringApi.updateRecurring(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['recurring_transactions'] });

            const allQueryData = queryClient.getQueriesData<RecurringTransaction[]>({
                queryKey: ['recurring_transactions']
            });

            let previousData: RecurringTransaction[] | undefined;
            let userId: string | undefined;

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
            await queryClient.cancelQueries({ queryKey: ['recurring_transactions'] });

            const allQueryData = queryClient.getQueriesData<RecurringTransaction[]>({
                queryKey: ['recurring_transactions']
            });

            let previousData: RecurringTransaction[] | undefined;
            let userId: string | undefined;

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
