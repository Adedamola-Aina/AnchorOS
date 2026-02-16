// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { FinanceProvider, useFinance } from './FinanceContext';

// Mock dependencies
const mockFinanceService = {
  transactions: [],
  accounts: [],
  loadingFinance: false,
  addAccount: vi.fn(),
  deleteAccount: vi.fn(),
  addTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  restoreTransaction: vi.fn(),
  convertCurrency: vi.fn(),
  renameAccount: vi.fn(),
  updateTransaction: vi.fn(),
  currentMonth: '2025-01',
  nextMonth: vi.fn(),
  prevMonth: vi.fn(),
  jumpToMonth: vi.fn(),
  netWorth: { NGN: 0, USD: 0 },
  recentActivity: [],
  cashFlow: { income: 0, expense: 0, net: 0, trend: 0 },
  refetch: vi.fn(),
};

vi.mock('../hooks/useFinanceService', () => ({
  useFinanceService: () => mockFinanceService,
}));

vi.mock('./AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user-1' }, profile: { name: 'Test' } }),
}));

vi.mock('../hooks/useFamilySharing', () => ({
  useFamilySharing: () => ({ familyMemberUid: null }),
}));

describe('FinanceContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FinanceProvider>{children}</FinanceProvider>
  );

  it('provides finance context to children', () => {
    const { result } = renderHook(() => useFinance(), { wrapper });
    expect(result.current.transactions).toEqual([]);
    expect(result.current.accounts).toEqual([]);
  });

  it('exposes CRUD operations', () => {
    const { result } = renderHook(() => useFinance(), { wrapper });
    expect(result.current.addAccount).toBeDefined();
    expect(result.current.deleteAccount).toBeDefined();
    expect(result.current.addTransaction).toBeDefined();
  });

  it('exposes month navigation', () => {
    const { result } = renderHook(() => useFinance(), { wrapper });
    expect(result.current.currentMonth).toBe('2025-01');
    expect(result.current.nextMonth).toBeDefined();
    expect(result.current.prevMonth).toBeDefined();
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useFinance());
    }).toThrow('useFinance must be used within a FinanceProvider');
  });
});
