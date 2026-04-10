/**
 * Activity Logger Utility
 * 
 * Standalone function to log activities for shared accounts.
 * Can be used in services and hooks without the React hook overhead.
 */

import { db, collection, addDoc } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';
import type { ActivityAction, AccountActivity } from '../types/activity';
import { createActivityEntry } from '../types/activity';

interface LogActivityParams {
    action: ActivityAction;
    accountId: string;
    accountOwnerId: string;
    actorId: string;
    actorName: string;
    details: AccountActivity['details'];
}

/**
 * Log an activity to an account's activity feed.
 * Non-blocking - errors are logged but don't throw.
 */
export const logAccountActivity = async ({
    action,
    accountId,
    accountOwnerId,
    actorId,
    actorName,
    details,
}: LogActivityParams): Promise<void> => {
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
        // Non-blocking - don't throw
    }
};
