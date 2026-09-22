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
  /*
   * CM-30: these are written as outcomes, not as implementation steps. "Enable
   * Two-Factor Auth" is a setting's name; "Secure your account" is what the user gets.
   * Each route deep-links into the Settings *section* that owns the work, so the
   * checklist never duplicates configuration.
   */
  explore_finance: {
    label: 'Track your first transaction',
    description: 'Record what you spend or earn, and see it add up',
    route: { tab: 'finance', params: { action: 'add-transaction' } },
  },
  recurring_commitment: {
    label: 'Set up a commitment that repeats',
    description: 'A weekly or monthly commitment runs itself',
    route: { tab: 'commitments', params: { action: 'add-recurring' } },
  },
  review_dashboard: {
    label: 'See your day at a glance',
    description: 'Home pulls your commitments, money and goals together',
    route: { tab: 'dashboard' },
  },
  customize_settings: {
    label: 'Make AnchorOS yours',
    description: 'Theme and notifications, in Settings',
    route: { tab: 'settings', params: { section: 'appearance' } },
  },
  verify_email: {
    label: 'Confirm your email',
    description: 'It is how you recover your account',
    route: { tab: 'settings', params: { section: 'security' } },
  },
  enable_mfa: {
    label: 'Secure your account',
    description: 'A second step at sign-in, so a stolen password is not enough',
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

  /**
   * UX-OB-05: at 100% the "Getting Started" affordance used to vanish with no
   * acknowledgement — the work finished and nothing said so. It now stays until
   * the user dismisses it, and the dismissal is remembered on the profile.
   */
  const acknowledged = progress?.beyondBasicsComplete === true;

  return {
    items,
    completedCount,
    totalCount,
    allComplete,
    progress: progress_pct,
    acknowledged,
  };
}
