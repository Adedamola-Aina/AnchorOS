/**
 * Activity Feed Component
 * DES-002: Migrated to semantic tokens and primitives
 * WEB-003: Framer Motion stagger animations for feed items
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import type { AccountActivity } from '../../../types/activity';
import { formatActivityMessage, getActivityColor } from '../../../types/activity';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency } from '../../../types';
import { formatRelativeTime, getActivityIcon } from './activityHelpers';
import { Text, VStack, Skeleton } from '../../../components/primitives';

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
            <VStack gap="sm">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton variant="circle" size={32} />
                        <VStack gap="xs" className="flex-1">
                            <Skeleton variant="text" width="75%" height={16} />
                            <Skeleton variant="text" width="50%" height={12} />
                        </VStack>
                    </div>
                ))}
            </VStack>
        );
    }

    if (displayActivities.length === 0) {
        return (
            <VStack align="center" justify="center" gap="sm" className="py-8">
                <div className="p-3 bg-surface-3 dark:bg-surface-3-dark rounded-full">
                    <Activity className="w-6 h-6 text-muted" />
                </div>
                <Text variant="muted" size="sm">No activity yet</Text>
                <Text variant="subtle" size="xs">
                    Activity will appear here when transactions are added
                </Text>
            </VStack>
        );
    }

    return (
        <VStack gap="xs">
            {displayActivities.map((activity, index) => {
                const isCurrentUser = activity.actorId === currentUserId;
                const colorClasses = getActivityColor(activity.action);
                const showAmount = activity.details?.amountCents !== undefined && activity.action !== 'transaction_deleted';

                return (
                    <motion.div
                        key={activity.id}
                        className={`
              flex gap-3 p-3 rounded-xl transition-colors
              ${index === 0 ? 'bg-surface-3 dark:bg-surface-3-dark' : 'hover:bg-surface-3 dark:hover:bg-surface-3-dark'}
            `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.3 }}
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
                            <Text variant="body" size="sm">
                                <Text as="span" variant={isCurrentUser ? 'primary' : 'body'} weight="semibold">
                                    {isCurrentUser ? 'You' : activity.actorName}
                                </Text>
                                {' '}
                                <Text as="span" variant="muted">
                                    {formatActivityMessage({ ...activity, actorName: '' }).trim()}
                                </Text>
                            </Text>

                            {/* Amount display for transaction activities */}
                            {showAmount && (
                                <Text
                                    variant={activity.details.type === 'income' ? 'finance' : 'muted'}
                                    size="xs"
                                    weight="semibold"
                                    className="mt-0.5"
                                >
                                    {activity.details.type === 'income' ? '+' : '-'}
                                    {formatCurrencyCompact(
                                        fromCents(activity.details.amountCents!),
                                        (activity.details.currency || 'USD') as Currency
                                    )}
                                    {activity.details.previousAmountCents !== undefined &&
                                        activity.details.previousAmountCents !== activity.details.amountCents && (
                                            <Text as="span" variant="subtle" className="ml-1">
                                                (was {formatCurrencyCompact(
                                                    fromCents(activity.details.previousAmountCents),
                                                    (activity.details.currency || 'USD') as Currency
                                                )})
                                            </Text>
                                        )}
                                </Text>
                            )}

                            {/* Timestamp */}
                            <div className="text-[10px] text-subtle dark:text-subtle-dark mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(activity.timestamp)}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {activities.length > maxItems && (
                <div className="pt-2 text-center">
                    <Text variant="subtle" size="xs">
                        +{activities.length - maxItems} more activities
                    </Text>
                </div>
            )}
        </VStack>
    );
};

