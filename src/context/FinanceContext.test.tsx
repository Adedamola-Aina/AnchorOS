// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

const mockLearnFrom = vi.fn();
vi.mock('./FabricContext', () => ({
  useFabricContext: () => ({ learnFrom: mockLearnFrom }),
}));

describe('FinanceContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FinanceProvider>{children}</FinanceProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockFinanceService.addTransaction.mockResolvedValue(undefined);
    mockFinanceService.deleteTransaction.mockResolvedValue(undefined);
    mockFinanceService.transactions = [];
  });

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

  it('calls learnFrom with transaction_recorded trigger after expense is created', async () => {
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await result.current.addTransaction({
        title: 'Groceries',
        amountCents: 5000,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'NGN',
        scope: 'personal',
      });
    });

    expect(mockLearnFrom).toHaveBeenCalledWith(
      { type: 'transaction_recorded', category: 'Food' },
      { type: 'review_budget', category: 'Food' },
    );
  });

  it('does NOT call learnFrom for income transactions', async () => {
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await result.current.addTransaction({
        title: 'Salary',
        amountCents: 150000,
        type: 'income',
        category: 'Salary',
        accountId: 'acc-1',
        currency: 'NGN',
        scope: 'personal',
      });
    });

    expect(mockLearnFrom).not.toHaveBeenCalled();
  });

  it('does NOT call learnFrom for transfer transactions', async () => {
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await result.current.addTransaction({
        title: 'Move to savings',
        amountCents: 10000,
        type: 'transfer',
        category: 'Transfer',
        accountId: 'acc-1',
        currency: 'NGN',
        scope: 'personal',
        destinationAccountId: 'acc-2',
      });
    });

    expect(mockLearnFrom).not.toHaveBeenCalled();
  });

  it('does not break addTransaction if learnFrom throws', async () => {
    mockLearnFrom.mockImplementation(() => { throw new Error('Fabric crash'); });
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await expect(result.current.addTransaction({
        title: 'Coffee',
        amountCents: 500,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'NGN',
        scope: 'personal',
      })).resolves.toBeUndefined();
    });

    expect(mockFinanceService.addTransaction).toHaveBeenCalled();
  });

  it('calls learnFrom after deleting an expense transaction', async () => {
    mockFinanceService.transactions = [
      { id: 'tx-1', title: 'Groceries', amountCents: 5000, type: 'expense', category: 'Food', accountId: 'acc-1', currency: 'NGN', scope: 'personal', date: '2026-03-10' },
    ];
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await result.current.deleteTransaction('tx-1', 'acc-1');
    });

    expect(mockLearnFrom).toHaveBeenCalledWith(
      { type: 'transaction_recorded', category: 'Food' },
      { type: 'review_budget', category: 'Food' },
    );
  });

  it('does NOT call learnFrom after deleting an income transaction', async () => {
    mockFinanceService.transactions = [
      { id: 'tx-2', title: 'Salary', amountCents: 150000, type: 'income', category: 'Salary', accountId: 'acc-1', currency: 'NGN', scope: 'personal', date: '2026-03-10' },
    ];
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await result.current.deleteTransaction('tx-2', 'acc-1');
    });

    expect(mockLearnFrom).not.toHaveBeenCalled();
  });

  it('does not break deleteTransaction if learnFrom throws', async () => {
    mockFinanceService.transactions = [
      { id: 'tx-3', title: 'Coffee', amountCents: 500, type: 'expense', category: 'Food', accountId: 'acc-1', currency: 'NGN', scope: 'personal', date: '2026-03-10' },
    ];
    mockLearnFrom.mockImplementation(() => { throw new Error('Fabric crash'); });
    const { result } = renderHook(() => useFinance(), { wrapper });

    await act(async () => {
      await expect(result.current.deleteTransaction('tx-3', 'acc-1')).resolves.toBeUndefined();
    });

    expect(mockFinanceService.deleteTransaction).toHaveBeenCalled();
  });
});
