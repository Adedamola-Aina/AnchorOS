/**
 * useBeyondBasics tests — TDD
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

  it('returns 5 items with all incomplete by default', () => {
    const { result } = renderHook(() => useBeyondBasics());
    expect(result.current.items).toHaveLength(5);
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

  it('marks secure_account complete when email verified AND mfa enabled', () => {
    mockUser = { emailVerified: true };
    mockProfile.mfaEnabled = true;
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'secure_account');
    expect(item?.completed).toBe(true);
  });

  it('does not mark secure_account with only email verified', () => {
    mockUser = { emailVerified: true };
    mockProfile.mfaEnabled = false;
    const { result } = renderHook(() => useBeyondBasics());
    const item = result.current.items.find(i => i.id === 'secure_account');
    expect(item?.completed).toBe(false);
  });

  it('computes allComplete when all items are done', () => {
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
});
