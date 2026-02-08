/**
 * useBeyondBasics - Computes completion state for "Beyond the Basics" items
 * from live app data (accounts, tasks, profile settings).
 */

import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useFinance } from '../../../context/FinanceContext';
import { useTasks } from '../../../context/TaskContext';
import { BEYOND_BASICS_ITEMS, type BeyondBasicsItem } from '../../../types';

export interface BeyondBasicsItemState {
  id: BeyondBasicsItem;
  label: string;
  description: string;
  completed: boolean;
}

const ITEM_META: Record<BeyondBasicsItem, { label: string; description: string }> = {
  explore_finance: {
    label: 'Explore Finance',
    description: 'Add a transaction to your account',
  },
  recurring_commitment: {
    label: 'Set a Recurring Commitment',
    description: 'Try a weekly or monthly commitment',
  },
  review_dashboard: {
    label: 'Review Your Dashboard',
    description: 'Visit the Dashboard with data to see your life at a glance',
  },
  customize_settings: {
    label: 'Customize Settings',
    description: 'Make Anchor OS yours — theme, notifications',
  },
  secure_account: {
    label: 'Secure Your Account',
    description: 'Verify email and enable MFA',
  },
};

export function useBeyondBasics() {
  const { profile, user } = useAuth();
  const { transactions } = useFinance();
  const { tasks } = useTasks();

  const progress = profile.onboardingProgress;
  const completedItems = progress?.completedItems ?? [];

  const items: BeyondBasicsItemState[] = useMemo(() => {
    const hasTransaction = transactions.length > 0;
    const hasRecurring = tasks.some(t => t.type === 'weekly' || t.type === 'monthly');
    const hasDashboardData = tasks.length > 0;
    const hasCustomized = profile.theme !== 'light' ||
      profile.notificationPreferences !== undefined ||
      profile.accessibility !== undefined;
    const isSecure = (user?.emailVerified ?? false) && (profile.mfaEnabled ?? false);

    return BEYOND_BASICS_ITEMS.map((id) => ({
      id,
      ...ITEM_META[id],
      completed:
        completedItems.includes(id) ||
        (id === 'explore_finance' && hasTransaction) ||
        (id === 'recurring_commitment' && hasRecurring) ||
        (id === 'review_dashboard' && hasDashboardData) ||
        (id === 'customize_settings' && hasCustomized) ||
        (id === 'secure_account' && isSecure),
    }));
  }, [completedItems, transactions.length, tasks, profile, user?.emailVerified]);

  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount;
  const progress_pct = totalCount > 0 ? completedCount / totalCount : 0;

  return { items, completedCount, totalCount, allComplete, progress: progress_pct };
}
