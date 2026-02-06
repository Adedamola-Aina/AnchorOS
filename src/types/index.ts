export type TabView = 'dashboard' | 'commitments' | 'finance' | 'settings';
export type TaskType = 'daily' | 'weekly' | 'monthly' | 'todo';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';
export type Currency = 'NGN' | 'USD';

export interface AnchorTask {
  id: string;
  title: string;
  type: TaskType;
  completed: boolean;
  category: 'personal' | 'family';
  createdAt: Date | null;
  timeOfDay?: TimeOfDay;
  daysOfWeek?: string[]; // Array for multiple days (S, M, T, W, T, F, S)
  dayOfMonth?: number;
  daysOfMonth?: number[];
  domain?: string; // Health, Fitness, Work, Bible, Personal Development, etc.
  reminderTime?: string; // HH:mm format
  lastCompletedAt?: string; // ISO date string for reset logic
  currentStreak?: number;
  longestStreak?: number;
}

export interface AnchorAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'salary' | 'investment';
  currency: Currency;
  balanceCents: number; // Stored as integer cents
  color: string;
  scope: 'personal' | 'family';
  ownerId?: string; // User ID who owns this account (for family mode)
  shares?: Record<string, 'read' | 'transact' | 'manage'>; // Legacy shared access permissions
  sharedWith?: Record<string, { grantedAt: string; grantedBy: string; permission?: 'read' | 'transact' | 'manage' }>; // Family Mode v2 sharing
  isArchived?: boolean;
  nameHistory?: Array<{
    date: string;
    oldName: string;
    newName: string;
    actorId: string;
    actorName: string;
  }>;
}

export interface AnchorTransaction {
  id: string;
  title: string;
  amountCents: number; // Stored as integer cents
  type: TransactionType;
  category: string;
  accountId: string;
  accountName?: string;
  currency: Currency;
  scope: 'personal' | 'family';
  date: Date | string; // Entry date (system timestamp)
  transactionDate?: Date | string; // User-selected transaction date (for backdating)
  createdAt?: string; // Actual creation timestamp
  isBackdated?: boolean; // Flag for backdated transactions
  updatedAt?: string; // For Optimistic Locking
  // Transfer-specific fields
  sourceAccountId?: string;
  destinationAccountId?: string;
  linkedTransactionId?: string;
  linkedUserId?: string;
  // Internal fields
  linkId?: string;
  isSoftDeleted?: boolean;
  createdBy?: string;
  createdByName?: string;
  accountOwnerId?: string;
}

export interface UserProfile {
  name: string;
  familyMode: boolean;
  theme: 'light' | 'dark' | 'system';
  mfaEnabled?: boolean;
  onboardingComplete?: boolean;
  notificationPreferences?: {
    email: string;
    frequency: 'instant' | 'daily' | 'weekly';
    enabled: boolean;
    lastDigestAt?: string; // To track frequency
  };
}

export interface AnchorNotification {
  id: string;
  type: 'finance' | 'system';
  date: string;
  read: boolean;
  message: string;
  title: string;
  accountId?: string;
  accountName?: string;
  actorId?: string;
  actorName?: string;
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
  accountName?: string; // Denormalized for display
  frequency: RecurringFrequency;
  interval: number; // e.g., 1 = every month, 2 = every 2 months
  nextRunAt: string; // ISO date string
  status: RecurringStatus;
  userId: string;
  createdAt: string;
  lastRunAt?: string;
  failureReason?: string; // If auto-creation failed
}

/** ARCH-002: Single source of truth for FamilyConnection */
export interface FamilyConnection {
  id: string;
  ownerUid: string;
  memberUid: string;
  ownerDisplayName: string;
  memberDisplayName: string;
  status: 'active' | 'disconnected';
  connectedAt: string;
}
