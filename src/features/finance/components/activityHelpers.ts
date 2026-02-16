/**
 * Activity Feed Helpers
 * 
 * Extracted from ActivityFeed.tsx for cleaner component structure.
 */
// @ts-nocheck


import React from 'react';
import {
    PlusCircle,
    Pencil,
    Trash2,
    Type,
    UserPlus,
    UserMinus,
    Activity
} from 'lucide-react';
import type { AccountActivity } from '../../../types/activity';

export const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return activityTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

export const getActivityIcon = (action: AccountActivity['action']): React.ReactElement => {
    const iconClass = "w-4 h-4";
    switch (action) {
        case 'transaction_added':
            return React.createElement(PlusCircle, { className: iconClass });
        case 'transaction_edited':
            return React.createElement(Pencil, { className: iconClass });
        case 'transaction_deleted':
            return React.createElement(Trash2, { className: iconClass });
        case 'account_renamed':
            return React.createElement(Type, { className: iconClass });
        case 'account_shared':
            return React.createElement(UserPlus, { className: iconClass });
        case 'account_unshared':
            return React.createElement(UserMinus, { className: iconClass });
        default:
            return React.createElement(Activity, { className: iconClass });
    }
};
