/**
 * useBeyondBasics tests — TDD
 * Updated: secure_account split into verify_email + enable_mfa (6 items)
 * Updated: each item now has a route for deep-linking
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBeyondBasics } from './useBeyondBasics';

const mockProfile: Record<string, unknown> = {
  name: 'Test',
  theme: 'light',
  familyMode: false,
  onboardingProgress: { gettingStartedStep: 4, securityStepSeen: true, beyondBasicsComplete: false, completedItems: [] },
};

let mockTransactions: unknown[] = [];
let mockTasks: unknown[] = [];
let mockUser: Record<string, unknown> = { emailVerified: false };

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ profile: mockProfile, user: mockUser }),
}));

vi.mock('../../../context/FinanceContext', () => ({
  useFinance: () => ({ transactions: mockTransactions }),
}));

vi.mock('../../../context/TaskContext', () => ({
  useTasks: () => ({ tasks: mockTasks }),
}));

describe('useBeyondBasics', () => {
  beforeEach(() => {
    mockTransactions = [];
    mockTasks = [];
    mockUser = { emailVerified: false };
    mockProfile.theme = 'light';
    mockProfile.mfaEnabled = false;
    mockProfile.notificationPreferences = undefined;
    mockProfile.accessibility = undefined;
    mockProfile.onboardingProgress = { gettingStartedStep: 4, securityStepSeen: true, beyondBasicsComplete: false, completedItems: [] };
  });

  it('returns 6 items with all incomplete by default', () => {
    const { result } = renderHook(() => useBeyondBasics());
    expect(result.current.items).toHaveLength(6);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.allComplete).toBe(false);
  });

  it('marks explore_finance complete when transactions exist', () => {
    mockTransactions = [{ id: '1', amount: 100 }];
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'explore_finance');
    expect(item?.completed).toBe(true);
    expect(result.current.completedCount).toBe(1);
  });

  it('marks recurring_commitment complete when weekly task exists', () => {
    mockTasks = [{ id: '1', type: 'weekly', title: 'Review' }];
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'recurring_commitment');
    expect(item?.completed).toBe(true);
  });

  it('marks review_dashboard complete when tasks exist', () => {
    mockTasks = [{ id: '1', type: 'daily', title: 'Read' }];
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'review_dashboard');
    expect(item?.completed).toBe(true);
  });

  it('marks customize_settings complete when theme is not light', () => {
    mockProfile.theme = 'dark';
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'customize_settings');
    expect(item?.completed).toBe(true);
  });

  it('marks verify_email complete when email verified (independent of MFA)', () => {
    mockUser = { emailVerified: true };
    mockProfile.mfaEnabled = false;
    const { result } = renderHook(() => useBeyondBasics());
    const verifyItem = result.current.items.find(i => i.id === 'verify_email');
    const mfaItem = result.current.items.find(i => i.id === 'enable_mfa');
    expect(verifyItem?.completed).toBe(true);
    expect(mfaItem?.completed).toBe(false);
  });

  it('marks enable_mfa complete when mfa enabled (independent of email)', () => {
    mockUser = { emailVerified: false };
    mockProfile.mfaEnabled = true;
    const { result } = renderHook(() => useBeyondBasics());
    const verifyItem = result.current.items.find(i => i.id === 'verify_email');
    const mfaItem = result.current.items.find(i => i.id === 'enable_mfa');
    expect(verifyItem?.completed).toBe(false);
    expect(mfaItem?.completed).toBe(true);
  });

  it('computes allComplete when all 6 items are done', () => {
    mockTransactions = [{ id: '1' }];
    mockTasks = [{ id: '1', type: 'weekly', title: 'a' }];
    mockProfile.theme = 'dark';
    mockUser = { emailVerified: true };
    mockProfile.mfaEnabled = true;
    const { result } = renderHook(() => useBeyondBasics());
    expect(result.current.allComplete).toBe(true);
    expect(result.current.progress).toBe(1);
  });

  it('respects manually completed items from progress', () => {
    (mockProfile.onboardingProgress as Record<string, unknown>).completedItems = ['explore_finance'];
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'explore_finance');
    expect(item?.completed).toBe(true);
  });

  it('each item has a route for deep-linking', () => {
    const { result } = renderHook(() => useBeyondBasics());
    for (const item of result.current.items) {
      expect(item.route).toBeDefined();
      expect(item.route.tab).toBeTruthy();
    }
  });

  it('verify_email routes to settings with section=security', () => {
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'verify_email');
    expect(item?.route).toEqual({ tab: 'settings', params: { section: 'security' } });
  });

  it('enable_mfa routes to settings with section=security', () => {
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'enable_mfa');
    expect(item?.route).toEqual({ tab: 'settings', params: { section: 'security' } });
  });

  it('explore_finance routes to finance with action=add-transaction', () => {
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'explore_finance');
    expect(item?.route).toEqual({ tab: 'finance', params: { action: 'add-transaction' } });
  });
});
