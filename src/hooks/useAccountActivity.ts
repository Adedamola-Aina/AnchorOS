/**
 * useAccountActivity Hook
 * 
 * Fetches and manages activity feed data for shared accounts.
 * Provides real-time updates via Firestore subscriptions.
 */

import { useState, useEffect, useCallback } from 'react';
import { db, APP_ID } from '../config/firebase';
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    addDoc
} from 'firebase/firestore';
import type { AccountActivity, ActivityAction } from '../types/activity';
import { createActivityEntry } from '../types/activity';

interface UseAccountActivityOptions {
    accountId: string;
    accountOwnerId: string;
    enabled?: boolean;
    maxItems?: number;
}

interface UseAccountActivityReturn {
    activities: AccountActivity[];
    loading: boolean;
    error: string | null;
    logActivity: (
        action: ActivityAction,
        actorId: string,
        actorName: string,
        details: AccountActivity['details']
    ) => Promise<void>;
}

export const useAccountActivity = ({
    accountId,
    accountOwnerId,
    enabled = true,
    maxItems = 20,
}: UseAccountActivityOptions): UseAccountActivityReturn => {
    const [activities, setActivities] = useState<AccountActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to activity feed
    useEffect(() => {
        if (!enabled || !accountId || !accountOwnerId) {
            // Reset state for disabled/missing parameters - intentional early exit pattern
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActivities([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const activitiesRef = collection(
            db,
            'artifacts',
            APP_ID,
            'users',
            accountOwnerId,
            'accounts',
            accountId,
            'activity'
        );

        const q = query(
            activitiesRef,
            orderBy('timestamp', 'desc'),
            limit(maxItems)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const activityList: AccountActivity[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as AccountActivity));

                setActivities(activityList);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Activity subscription error:', err);
                setError('Unable to load activity');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [accountId, accountOwnerId, enabled, maxItems]);

    // Log a new activity
    const logActivity = useCallback(async (
        action: ActivityAction,
        actorId: string,
        actorName: string,
        details: AccountActivity['details']
    ) => {
        if (!accountId || !accountOwnerId) return;

        try {
            const activitiesRef = collection(
                db,
                'artifacts',
                APP_ID,
                'users',
                accountOwnerId,
                'accounts',
                accountId,
                'activity'
            );

            const activityData = createActivityEntry(
                action,
                accountId,
                accountOwnerId,
                actorId,
                actorName,
                details
            );

            await addDoc(activitiesRef, activityData);
        } catch (err) {
            console.error('Failed to log activity:', err);
            // Don't throw - activity logging should be non-blocking
        }
    }, [accountId, accountOwnerId]);

    return {
        activities,
        loading,
        error,
        logActivity,
    };
};
