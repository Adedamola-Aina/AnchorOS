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
