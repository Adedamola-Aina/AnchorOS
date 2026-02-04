/**
 * Skeleton Components
 * 
 * Loading skeleton placeholders for better UX than spinners.
 * Provides visual indication of content structure while loading.
 * 
 * @example
 * <Skeleton className="w-32 h-4" />
 * <TransactionSkeleton />
 * <AccountSkeleton />
 */

import React from 'react';

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton component
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div
        className={`animate-pulse bg-surface-3 dark:bg-surface-3-dark rounded ${className}`}
        aria-hidden="true"
    />
);

/**
 * Transaction list item skeleton
 */
export const TransactionSkeleton: React.FC = () => (
    <div className="flex items-center gap-4 p-4 border-b border-border-subtle dark:border-border-dark">
        {/* Icon placeholder */}
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
            <Skeleton className="w-3/4 h-4 mb-2" />
            <Skeleton className="w-1/2 h-3" />
        </div>

        {/* Amount placeholder */}
        <Skeleton className="w-20 h-6 flex-shrink-0" />
    </div>
);

/**
 * Account card skeleton
 */
export const AccountSkeleton: React.FC = () => (
    <div className="p-4 rounded-2xl border border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-2-dark">
        <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-16 h-3" />
            </div>
        </div>
        <Skeleton className="w-32 h-6" />
    </div>
);

/**
 * Commitment/Task item skeleton
 */
export const CommitmentSkeleton: React.FC = () => (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle dark:border-border-dark">
        <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
        <div className="flex-1">
            <Skeleton className="w-3/4 h-4 mb-1" />
            <Skeleton className="w-1/3 h-3" />
        </div>
        <Skeleton className="w-12 h-5 rounded-full" />
    </div>
);

/**
 * Dashboard widget skeleton
 */
export const DashboardWidgetSkeleton: React.FC = () => (
    <div className="p-6 rounded-2xl border border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-2-dark">
        <Skeleton className="w-24 h-4 mb-4" />
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-full h-3" />
    </div>
);

/**
 * List skeleton - renders multiple transaction skeletons
 */
interface ListSkeletonProps {
    count?: number;
    type?: 'transaction' | 'commitment' | 'account';
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 5, type = 'transaction' }) => {
    const SkeletonComponent = {
        transaction: TransactionSkeleton,
        commitment: CommitmentSkeleton,
        account: AccountSkeleton,
    }[type];

    return (
        <div className="space-y-1">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonComponent key={i} />
            ))}
        </div>
    );
};
