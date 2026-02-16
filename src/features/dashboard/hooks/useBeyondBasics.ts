/**
 * useBeyondBasics - Computes completion state for "Beyond the Basics" items
 * from live app data (accounts, tasks, profile settings).
 * Each item has a route for deep-linking (Fix #2) and verify_email / enable_mfa
 * are tracked independently (Fix #3).
 */
// @ts-nocheck


import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useFinance } from '../../../context/FinanceContext';
import { useTasks } from '../../../context/TaskContext';
import { BEYOND_BASICS_ITEMS, type BeyondBasicsItem } from '../../../types';
import type { TabView } from '../../../types';

export interface BeyondBasicsRoute {
  tab: TabView;
  params?: Record<string, string>;
}

export interface BeyondBasicsItemState {
  id: BeyondBasicsItem;
  label: string;
  description: string;
  completed: boolean;
  route: BeyondBasicsRoute;
}

interface ItemMeta { label: string; description: string; route: BeyondBasicsRoute }

const ITEM_META: Record<BeyondBasicsItem, ItemMeta> = {
  explore_finance: {
    label: 'Explore Finance',
    description: 'Add a transaction to your account',
    route: { tab: 'finance', params: { action: 'add-transaction' } },
  },
  recurring_commitment: {
    label: 'Set a Recurring Commitment',
    description: 'Try a weekly or monthly commitment',
    route: { tab: 'commitments', params: { action: 'add-recurring' } },
  },
  review_dashboard: {
    label: 'Review Your Dashboard',
    description: 'Visit the Dashboard with data to see your life at a glance',
    route: { tab: 'dashboard' },
  },
  customize_settings: {
    label: 'Customize Settings',
    description: 'Make Anchor OS yours — theme, notifications',
    route: { tab: 'settings', params: { section: 'appearance' } },
  },
  verify_email: {
    label: 'Verify Your Email',
    description: 'Confirm your email address to secure account ownership',
    route: { tab: 'settings', params: { section: 'security' } },
  },
  enable_mfa: {
    label: 'Enable Two-Factor Auth',
    description: 'Add an extra layer of protection with 2FA',
    route: { tab: 'settings', params: { section: 'security' } },
  },
};

export function useBeyondBasics() {
  const { profile, user } = useAuth();
  const { transactions } = useFinance();
  const { tasks } = useTasks();

  const progress = profile.onboardingProgress;

  const items: BeyondBasicsItemState[] = useMemo(() => {
    const completedItems = progress?.completedItems ?? [];
    const hasTransaction = transactions.length > 0;
    const hasRecurring = tasks.some(t => t.type === 'weekly' || t.type === 'monthly');
    const hasDashboardData = tasks.length > 0;
    const hasCustomized = profile.theme !== 'light' ||
      profile.notificationPreferences !== undefined ||
      profile.accessibility !== undefined;
    const emailVerified = user?.emailVerified ?? false;
    const mfaEnabled = profile.mfaEnabled ?? false;

    return BEYOND_BASICS_ITEMS.map((id) => ({
      id,
      ...ITEM_META[id],
      completed:
        completedItems.includes(id) ||
        (id === 'explore_finance' && hasTransaction) ||
        (id === 'recurring_commitment' && hasRecurring) ||
        (id === 'review_dashboard' && hasDashboardData) ||
        (id === 'customize_settings' && hasCustomized) ||
        (id === 'verify_email' && emailVerified) ||
        (id === 'enable_mfa' && mfaEnabled),
    }));
  }, [progress?.completedItems, transactions.length, tasks, profile, user?.emailVerified]);

  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount;
  const progress_pct = totalCount > 0 ? completedCount / totalCount : 0;

  return { items, completedCount, totalCount, allComplete, progress: progress_pct };
}
