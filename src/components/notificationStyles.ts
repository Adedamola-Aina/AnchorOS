/**
 * Notification Styling Helpers
 * 
 * Extracted from FamilyNotificationBanner.tsx
 */

import { Users, Bell } from 'lucide-react';

export type NotificationType =
    | 'family_connected'
    | 'invitation_accepted'
    | 'account_shared'
    | string;

export const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'family_connected':
        case 'invitation_accepted':
        case 'account_shared':
            return Users;
        default:
            return Bell;
    }
};

export const getNotificationBgColor = (type: NotificationType): string => {
    switch (type) {
        case 'family_connected':
            return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
        case 'account_shared':
            return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        case 'invitation_accepted':
            return 'bg-family-50 dark:bg-family-900/20 border-family-200 dark:border-family-800';
        default:
            return 'bg-surface-2 dark:bg-surface-2-dark border-border-subtle dark:border-border-dark';
    }
};

export const getNotificationIconColor = (type: NotificationType): string => {
    switch (type) {
        case 'family_connected':
            return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
        case 'account_shared':
            return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
        case 'invitation_accepted':
            return 'text-family-600 dark:text-family-400 bg-family-100 dark:bg-family-900/30';
        default:
            return 'text-muted dark:text-muted-dark bg-surface-2 dark:bg-surface-2-dark';
    }
};
