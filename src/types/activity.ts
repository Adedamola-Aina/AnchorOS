/**
 * Shared Account Activity Types
 * 
 * Used for tracking and displaying activity on shared family accounts
 */

export type ActivityAction =
    | 'transaction_added'
    | 'transaction_edited'
    | 'transaction_deleted'
    | 'account_renamed'
    | 'account_shared'
    | 'account_unshared';

export interface AccountActivity {
    id: string;
    accountId: string;
    accountOwnerId: string;
    action: ActivityAction;
    actorId: string;
    actorName: string;
    timestamp: string;
    details: {
        // For transactions
        transactionId?: string;
        transactionTitle?: string;
        amountCents?: number;
        currency?: string;
        type?: 'income' | 'expense' | 'transfer';
        // For edits
        previousTitle?: string;
        previousAmountCents?: number;
        // For account rename
        oldName?: string;
        newName?: string;
        // For sharing
        sharedWithName?: string;
        permission?: 'read' | 'transact' | 'manage';
    };
}

/**
 * Helper to create activity entries
 */
export const createActivityEntry = (
    action: ActivityAction,
    accountId: string,
    accountOwnerId: string,
    actorId: string,
    actorName: string,
    details: AccountActivity['details']
): Omit<AccountActivity, 'id'> => ({
    accountId,
    accountOwnerId,
    action,
    actorId,
    actorName,
    timestamp: new Date().toISOString(),
    details,
});

/**
 * Format activity for display
 */
export const formatActivityMessage = (activity: AccountActivity): string => {
    const { action, actorName, details } = activity;

    switch (action) {
        case 'transaction_added':
            return `${actorName} added "${details.transactionTitle}"`;
        case 'transaction_edited':
            if (details.previousTitle && details.previousTitle !== details.transactionTitle) {
                return `${actorName} renamed "${details.previousTitle}" to "${details.transactionTitle}"`;
            }
            if (details.previousAmountCents !== undefined && details.previousAmountCents !== details.amountCents) {
                return `${actorName} updated amount on "${details.transactionTitle}"`;
            }
            return `${actorName} edited "${details.transactionTitle}"`;
        case 'transaction_deleted':
            return `${actorName} deleted "${details.transactionTitle}"`;
        case 'account_renamed':
            return `${actorName} renamed account from "${details.oldName}" to "${details.newName}"`;
        case 'account_shared':
            return `${actorName} shared this account with ${details.sharedWithName}`;
        case 'account_unshared':
            return `${actorName} stopped sharing with ${details.sharedWithName}`;
        default:
            return `${actorName} performed an action`;
    }
};

/**
 * Get icon name for activity type
 */
export const getActivityIcon = (action: ActivityAction): string => {
    switch (action) {
        case 'transaction_added':
            return 'plus-circle';
        case 'transaction_edited':
            return 'pencil';
        case 'transaction_deleted':
            return 'trash-2';
        case 'account_renamed':
            return 'type';
        case 'account_shared':
            return 'user-plus';
        case 'account_unshared':
            return 'user-minus';
        default:
            return 'activity';
    }
};

/**
 * Get color class for activity type
 */
export const getActivityColor = (action: ActivityAction): string => {
    switch (action) {
        case 'transaction_added':
            return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
        case 'transaction_edited':
            return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
        case 'transaction_deleted':
            return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
        case 'account_renamed':
            return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
        case 'account_shared':
            return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
        case 'account_unshared':
            return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
        default:
            return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
};
