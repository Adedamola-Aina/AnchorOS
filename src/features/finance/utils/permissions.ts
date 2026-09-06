// @ts-nocheck
import type { AnchorAccount } from '../../../types';

// Permission levels for Family Mode
type AccountPermission = 'owner' | 'read' | 'transact' | 'manage' | null;

/**
 * Get the permission level for a user on a specific account
 */
export const getAccountPermission = (account: AnchorAccount, userId: string): AccountPermission => {
    if (!userId) return null;
    if (account.ownerId === userId) return 'owner';

    // Check V2 SharedWith
    if (account.sharedWith && account.sharedWith[userId]) {
        return account.sharedWith[userId].permission || 'read';
    }

    // Legacy Shares
    if (account.shares && account.shares[userId]) {
        return account.shares[userId] as AccountPermission;
    }

    return null;
};

/**
 * Check if a user can view an account
 */
export const canViewAccount = (account: AnchorAccount, userId: string): boolean => {
    const perm = getAccountPermission(account, userId);
    return perm !== null;
};

/**
 * Check if a user can add a transaction to an account
 */
export const canAddTransaction = (account: AnchorAccount, userId: string): boolean => {
    const perm = getAccountPermission(account, userId);
    return perm === 'owner' || perm === 'transact' || perm === 'manage';
};

/**
 * Check if a user can edit a transaction in an account
 */
export const canEditTransaction = (account: AnchorAccount, userId: string): boolean => {
    const perm = getAccountPermission(account, userId);
    return perm === 'owner' || perm === 'manage';
};

/**
 * Check if a user can delete a transaction from an account
 */
export const canDeleteTransaction = (account: AnchorAccount, userId: string): boolean => {
    const perm = getAccountPermission(account, userId);
    return perm === 'owner' || perm === 'manage';
};

/**
 * Check if a user can manage (delete/share) an account
 */
export const canManageAccount = (account: AnchorAccount, userId: string): boolean => {
    const perm = getAccountPermission(account, userId);
    return perm === 'owner' || perm === 'manage';
};
