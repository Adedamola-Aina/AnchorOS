/**
 * Shared type definitions for Cloud Functions
 */
// @ts-nocheck


// ============================================================================
// Family Mode Types
// ============================================================================

export type InvitationStatus = 'pending' | 'awaiting_confirmation' | 'accepted' | 'rejected' | 'expired' | 'revoked' | 'locked';

export interface FamilyInvitation {
    id: string;
    ownerUid: string;
    ownerEmail: string;
    ownerDisplayName: string;
    inviteeEmail: string;
    inviteeUid?: string;
    status: InvitationStatus;
    verificationCodeHash: string;
    verificationAttempts: number;
    createdAt: string;
    expiresAt: string;
    acceptedAt?: string;
    confirmedAt?: string;
    revokedAt?: string;
    lockedAt?: string;
}

export interface FamilyConnection {
    id: string;
    ownerUid: string;
    memberUid: string;
    ownerDisplayName: string;
    memberDisplayName: string;
    status: 'active' | 'disconnected';
    connectedAt: string;
    disconnectedAt?: string;
    disconnectedBy?: string;
}

// ============================================================================
// Rate Limiting Types
// ============================================================================

export interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs: number;
}

// ============================================================================
// Recurring & Finance Types
// ============================================================================

export type TransactionType = 'income' | 'expense' | 'transfer';
export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';
export type RecurringStatus = 'active' | 'paused';
export type Currency = 'NGN' | 'USD';

export interface RecurringTransaction {
    id: string;
    title: string;
    amountCents: number;
    type: TransactionType;
    category: string;
    accountId: string;
    accountName?: string;
    frequency: RecurringFrequency;
    interval: number;
    nextRunAt: string;
    status: RecurringStatus;
    userId: string;
    createdAt: string;
    lastRunAt?: string;
    failureReason?: string;
}

// Subset of AnchorTransaction needed for creation
export interface AnchorTransaction {
    id: string;
    title: string;
    amountCents: number;
    type: TransactionType;
    category: string;
    accountId: string;
    accountName?: string;
    currency: Currency;
    scope: 'personal' | 'family';
    date: string;
    createdAt: string;
    createdBy: string;
    accountOwnerId: string;
    // Optional
    recurringTransactionId?: string;
    isSoftDeleted?: boolean;
}
