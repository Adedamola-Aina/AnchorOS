export type TabView = 'dashboard' | 'commitments' | 'fabric' | 'finance' | 'settings';
export type TaskType = 'daily' | 'weekly' | 'monthly' | 'todo';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';
export type TaskPriority = 'high' | 'medium' | 'low';

export type {
  TransactionType,
  Currency,
  ExternalConnection,
  AnchorAccount,
  AnchorTransaction,
  RecurringFrequency,
  RecurringStatus,
  RecurringTransaction,
} from './financeTypes';

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
  notes?: string; // Optional context/notes (COMM-006), max 500 chars
  priority?: TaskPriority; // COMM-007: task priority level
}

export interface AnchorGoal {
  id: string;
  title: string;
  targetAmountCents: number;
  currentAmountCents: number;
  currency: 'USD' | 'NGN';
  goalType: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'other';
  accountId?: string; // linked finance account
  targetDate?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingProgress {
  gettingStartedStep: number;
  securityStepSeen: boolean;
  beyondBasicsComplete: boolean;
  completedItems: string[];
}

export const BEYOND_BASICS_ITEMS = [
  'explore_finance',
  'recurring_commitment',
  'review_dashboard',
  'customize_settings',
  'verify_email',
  'enable_mfa',
] as const;

export type BeyondBasicsItem = typeof BEYOND_BASICS_ITEMS[number];

export interface UserProfile {
  name: string;
  photoURL?: string;
  familyMode: boolean;
  theme: 'light' | 'dark' | 'system';
  timezone?: string;
  mfaEnabled?: boolean;
  onboardingComplete?: boolean;
  onboardingProgress?: OnboardingProgress;
  notificationPreferences?: {
    email: string;
    frequency: 'instant' | 'daily' | 'weekly';
    enabled: boolean;
    lastDigestAt?: string; // To track frequency
    categories?: {
      finance: boolean;
      commitments: boolean;
      family: boolean;
    };
    quietHours?: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  accessibility?: {
    fontSize: 'default' | 'large' | 'xl';
    highContrast: boolean;
    reducedMotion: boolean;
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

export * from './fabric';
export * from './fabricPrediction';
