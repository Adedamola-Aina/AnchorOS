/**
 * Activity Feed Component
 * 
 * Displays a timeline of activities on a shared account.
 * Shows who did what and when for full transparency in family mode.
 */

import React from 'react';
import { Activity, Clock } from 'lucide-react';
import type { AccountActivity } from '../../../types/activity';
import { formatActivityMessage, getActivityColor } from '../../../types/activity';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency } from '../../../types';
import { formatRelativeTime, getActivityIcon } from './activityHelpers';

interface ActivityFeedProps {
    activities: AccountActivity[];
    currentUserId?: string;
    loading?: boolean;
    maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
    activities,
    currentUserId,
    loading = false,
    maxItems = 10,
}) => {
    const displayActivities = activities.slice(0, maxItems);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (displayActivities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <Activity className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    No activity yet
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Activity will appear here when transactions are added
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {displayActivities.map((activity, index) => {
                const isCurrentUser = activity.actorId === currentUserId;
                const colorClasses = getActivityColor(activity.action);
                const showAmount = activity.details?.amountCents !== undefined && activity.action !== 'transaction_deleted';

                return (
                    <div
                        key={activity.id}
                        className={`
              flex gap-3 p-3 rounded-xl transition-colors
              ${index === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}
            `}
                    >
                        {/* Icon */}
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${colorClasses}
            `}>
                            {getActivityIcon(activity.action)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 dark:text-slate-200">
                                <span className={`font-semibold ${isCurrentUser ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                                    {isCurrentUser ? 'You' : activity.actorName}
                                </span>
                                {' '}
                                <span className="text-slate-600 dark:text-slate-300">
                                    {formatActivityMessage({ ...activity, actorName: '' }).trim()}
                                </span>
                            </p>

                            {/* Amount display for transaction activities */}
                            {showAmount && (
                                <p className={`text-xs font-semibold mt-0.5 ${activity.details.type === 'income'
                                    ? 'text-finance-600 dark:text-finance-400'
                                    : 'text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {activity.details.type === 'income' ? '+' : '-'}
                                    {formatCurrency(
                                        fromCents(activity.details.amountCents!),
                                        (activity.details.currency || 'USD') as Currency
                                    )}
                                    {activity.details.previousAmountCents !== undefined &&
                                        activity.details.previousAmountCents !== activity.details.amountCents && (
                                            <span className="text-slate-400 ml-1">
                                                (was {formatCurrency(
                                                    fromCents(activity.details.previousAmountCents),
                                                    (activity.details.currency || 'USD') as Currency
                                                )})
                                            </span>
                                        )}
                                </p>
                            )}

                            {/* Timestamp */}
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(activity.timestamp)}
                            </p>
                        </div>
                    </div>
                );
            })}

            {activities.length > maxItems && (
                <div className="pt-2 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        +{activities.length - maxItems} more activities
                    </p>
                </div>
            )}
        </div>
    );
};
