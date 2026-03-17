export type TransactionType = 'income' | 'expense' | 'transfer';
export type Currency = 'NGN' | 'USD';

export interface ExternalConnection {
  provider: 'mono';
  externalAccountId: string;
  institutionName: string;
  institutionCode: string;
  institutionLogo?: string;
  lastSyncedAt: string;
  syncStatus: 'active' | 'reconnect_required' | 'error';
  maskedAccountNumber?: string;
}

export interface AnchorAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'salary' | 'investment';
  currency: Currency;
  balanceCents: number;
  color: string;
  scope: 'personal' | 'family';
  ownerId?: string;
  shares?: Record<string, 'read' | 'transact' | 'manage'>;
  sharedWith?: Record<string, { grantedAt: string; grantedBy: string; permission?: 'read' | 'transact' | 'manage' }>;
  isArchived?: boolean;
  nameHistory?: Array<{
    date: string;
    oldName: string;
    newName: string;
    actorId: string;
    actorName: string;
  }>;
  source?: 'manual' | 'linked';
  externalConnection?: ExternalConnection;
}

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
  date: Date | string;
  transactionDate?: Date | string;
  createdAt?: string;
  isBackdated?: boolean;
  updatedAt?: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  linkedTransactionId?: string;
  linkedUserId?: string;
  recurringId?: string;
  linkId?: string;
  isSoftDeleted?: boolean;
  createdBy?: string;
  createdByName?: string;
  accountOwnerId?: string;
  source?: 'manual' | 'synced';
  externalTransactionId?: string;
  narration?: string;
}

export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';
export type RecurringStatus = 'active' | 'paused';

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
