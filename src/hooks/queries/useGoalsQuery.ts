/**
 * Goals Queries — reads the financial goals written by onboarding step 3.
 *
 * RA-12 (#168): `users/{uid}/goals` was write-only — onboarding persisted a
 * goal and nothing in the product ever read it. This hook is the reader.
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { secureDb } from '../../utils/secureDb';
import type { AnchorGoal } from '../../types';

export const GOALS_KEYS = {
    all: ['goals'] as const,
    list: (userId: string) => [...GOALS_KEYS.all, userId] as const,
};

/**
 * Read the current user's goals, newest first.
 *
 * Owner-scoped: the `users/{uid}/goals` rule already allows owner reads, and
 * `secureDb` always scopes the path to the authenticated user.
 */
export const useGoalsQuery = (userId: string | undefined) => {
    const queryKey = useMemo(() => GOALS_KEYS.list(userId || ''), [userId]);

    return useQuery<AnchorGoal[]>({
        queryKey,
        enabled: !!userId,
        queryFn: async () => {
            if (!userId) return [];
            const goals = await secureDb.queryCollection<AnchorGoal>(userId, 'goals');
            return [...goals].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        },
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });
};
