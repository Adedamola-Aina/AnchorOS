/**
 * useOptimisticMutation
 * 
 * A standardized pattern for optimistic updates with automatic rollback.
 * Wraps React Query's useMutation with optimistic update logic.
 * 
 * @module hooks/useOptimisticMutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface OptimisticMutationOptions<TData, TVariables, TContext> {
    /** Query key(s) to update optimistically */
    queryKey: unknown[];

    /** The mutation function */
    mutationFn: (variables: TVariables) => Promise<TData>;

    /** Function to optimistically update the cache */
    optimisticUpdate: (variables: TVariables, currentData: TData | undefined) => TData;

    /** Optional callback on success */
    onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;

    /** Optional callback on error */
    onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
}

/**
 * Hook for performing mutations with optimistic updates and automatic rollback
 * 
 * @example
 * ```tsx
 * const { mutate: updateAccount } = useOptimisticMutation({
 *   queryKey: ['accounts'],
 *   mutationFn: AccountService.updateAccount,
 *   optimisticUpdate: (variables, currentAccounts) => 
 *     currentAccounts?.map(a => a.id === variables.id ? { ...a, ...variables } : a),
 * });
 * ```
 */
export function useOptimisticMutation<TData, TVariables>({
    queryKey,
    mutationFn,
    optimisticUpdate,
    onSuccess,
    onError,
}: OptimisticMutationOptions<TData, TVariables, { previousData: TData | undefined }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        onMutate: async (variables) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<TData>(queryKey);

            // Optimistically update the cache
            if (previousData !== undefined) {
                queryClient.setQueryData<TData>(queryKey, optimisticUpdate(variables, previousData));
            }

            // Return a context object with the previous data
            return { previousData };
        },

        onError: (error, variables, context) => {
            // Rollback to the previous value on error
            if (context?.previousData !== undefined) {
                queryClient.setQueryData(queryKey, context.previousData);
            }

            onError?.(error as Error, variables, context);
        },

        onSettled: () => {
            // Refetch after error or success to ensure consistency
            queryClient.invalidateQueries({ queryKey });
        },

        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
        },
    });
}

export default useOptimisticMutation;
