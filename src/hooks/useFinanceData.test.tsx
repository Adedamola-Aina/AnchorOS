// @ts-nocheck
import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ── Hoisted state for all dependency mocks ────────────────────────────────
const mockState = vi.hoisted(() => ({
  ownTransactions: [] as any[],
  ownAccounts: [] as any[],
  recentOwn: [] as any[],
  sharedAccounts: [] as any[],
  sharedTransactions: [] as any[],
  loadingOwnTx: false,
  loadingOwnAcc: false,
  loadingShared: false,
  isOwner: false,
  connection: null as any,
}));

vi.mock('./queries/useFinanceQueries', () => ({
  useTransactionsQuery: () => ({
    data: mockState.ownTransactions,
    isLoading: mockState.loadingOwnTx,
  }),
  useAccountsQuery: () => ({
    data: mockState.ownAccounts,
    isLoading: mockState.loadingOwnAcc,
  }),
  useRecentTransactionsQuery: () => ({ data: mockState.recentOwn }),
}));

vi.mock('./useSharedAccounts', () => ({
  useSharedAccounts: () => ({
    sharedAccounts: mockState.sharedAccounts,
    sharedTransactions: mockState.sharedTransactions,
    loading: mockState.loadingShared,
  }),
}));

vi.mock('./useFamilySharing', () => ({
  useFamilySharing: () => ({
    isOwner: mockState.isOwner,
    connection: mockState.connection,
  }),
}));

vi.mock('../utils/finance', () => ({
  calculateNetWorth: (accounts: any[]) => ({ total: accounts.length * 100 }),
}));

vi.mock('../utils/financeInsights', () => ({
  getCashFlowAnalysis: () => ({ income: 0, expenses: 0 }),
}));

import { useFinanceData } from './useFinanceData';

const FAKE_USER = { uid: 'user-1' } as any;

// Current-month date for shared transaction filter tests
const NOW = new Date();
const CURRENT_MONTH_DATE = `${NOW.getFullYear()}-${String(NOW.getMonth() + 1).padStart(2, '0')}-15`;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe('useFinanceData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.ownTransactions = [];
    mockState.ownAccounts = [];
    mockState.recentOwn = [];
    mockState.sharedAccounts = [];
    mockState.sharedTransactions = [];
    mockState.loadingOwnTx = false;
    mockState.loadingOwnAcc = false;
    mockState.loadingShared = false;
    mockState.isOwner = false;
    mockState.connection = null;
  });

  // ── Basic return shape ───────────────────────────────────────────────────

  it('returns empty transactions and accounts when there is no data', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toEqual([]);
    expect(result.current.accounts).toEqual([]);
    expect(result.current.loadingFinance).toBe(false);
  });

  it('returns own transactions', () => {
    mockState.ownTransactions = [
      { id: 'tx-1', amount: 100, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe('tx-1');
  });

  // ── Soft-deleted filtering ───────────────────────────────────────────────

  it('excludes soft-deleted transactions', () => {
    mockState.ownTransactions = [
      { id: 'tx-keep', amount: 100, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
      { id: 'tx-gone', amount: 200, date: CURRENT_MONTH_DATE, isSoftDeleted: true },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe('tx-keep');
  });

  // ── Deduplication ────────────────────────────────────────────────────────

  it('deduplicates transactions with the same id', () => {
    const tx = { id: 'dup', amount: 100, date: CURRENT_MONTH_DATE, isSoftDeleted: false };
    mockState.ownTransactions = [tx, tx];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(1);
  });

  it('deduplicates accounts with the same id', () => {
    const acc = { id: 'acc-1', name: 'Checking', balance: 1000 };
    mockState.ownAccounts = [acc];
    mockState.sharedAccounts = [acc]; // same id, different source
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.accounts).toHaveLength(1);
  });

  // ── Effective date sorting ───────────────────────────────────────────────

  it('sorts by transactionDate over date field (transactionDate wins)', () => {
    mockState.ownTransactions = [
      // date is newer but transactionDate is older → should sort last
      { id: 'tx-old-tx-date', amount: 50, date: '2024-01-20', transactionDate: '2024-01-10', isSoftDeleted: false },
      // date is older but transactionDate is newer → should sort first
      { id: 'tx-new-tx-date', amount: 100, date: '2024-01-10', transactionDate: '2024-01-20', isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions[0].id).toBe('tx-new-tx-date');
    expect(result.current.transactions[1].id).toBe('tx-old-tx-date');
  });

  it('falls back to date field when transactionDate is absent', () => {
    mockState.ownTransactions = [
      { id: 'tx-earlier', amount: 50, date: '2024-01-10', isSoftDeleted: false },
      { id: 'tx-later', amount: 100, date: '2024-01-20', isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    // sorted descending — later date comes first
    expect(result.current.transactions[0].id).toBe('tx-later');
    expect(result.current.transactions[1].id).toBe('tx-earlier');
  });

  // ── Family / shared data ─────────────────────────────────────────────────

  it('does not include shared transactions when there is no family connection', () => {
    mockState.connection = null;
    mockState.sharedTransactions = [
      { id: 'shared-tx', amount: 500, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(0);
  });

  it('includes shared transactions for non-owner with an active connection', () => {
    mockState.connection = { id: 'conn-1' };
    mockState.isOwner = false;
    mockState.ownTransactions = [
      { id: 'own-tx', amount: 100, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
    ];
    mockState.sharedTransactions = [
      { id: 'shared-tx', amount: 500, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(2);
    const ids = result.current.transactions.map((t: any) => t.id);
    expect(ids).toContain('own-tx');
    expect(ids).toContain('shared-tx');
  });

  it('does not include shared transactions when user isOwner', () => {
    mockState.connection = { id: 'conn-1' };
    mockState.isOwner = true;
    mockState.sharedTransactions = [
      { id: 'shared-tx', amount: 500, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(0);
  });

  it('filters out shared transactions outside the current month range', () => {
    mockState.connection = { id: 'conn-1' };
    mockState.isOwner = false;
    mockState.sharedTransactions = [
      { id: 'in-range', amount: 100, date: CURRENT_MONTH_DATE, isSoftDeleted: false },
      { id: 'out-of-range', amount: 200, date: '2020-01-15', isSoftDeleted: false },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe('in-range');
  });

  // ── Loading states ───────────────────────────────────────────────────────

  it('reports loadingFinance true when own transactions are loading', () => {
    mockState.loadingOwnTx = true;
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.loadingFinance).toBe(true);
  });

  it('reports loadingFinance true when own accounts are loading', () => {
    mockState.loadingOwnAcc = true;
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.loadingFinance).toBe(true);
  });

  // ── recentActivity ───────────────────────────────────────────────────────

  it('limits recentActivity to 5 items', () => {
    mockState.recentOwn = Array.from({ length: 10 }, (_, i) => ({
      id: `tx-${i}`,
      amount: i * 10,
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      isSoftDeleted: false,
    }));
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(result.current.recentActivity).toHaveLength(5);
  });

  it('excludes soft-deleted from recentActivity', () => {
    mockState.recentOwn = [
      { id: 'r-keep', amount: 10, date: '2024-01-15', isSoftDeleted: false },
      { id: 'r-gone', amount: 20, date: '2024-01-16', isSoftDeleted: true },
    ];
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    const ids = result.current.recentActivity.map((t: any) => t.id);
    expect(ids).not.toContain('r-gone');
  });

  // ── Navigation helpers ───────────────────────────────────────────────────

  it('nextMonth advances currentMonth by one month', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    const before = result.current.currentMonth.getMonth();
    act(() => result.current.nextMonth());
    expect(result.current.currentMonth.getMonth()).toBe((before + 1) % 12);
  });

  it('prevMonth moves currentMonth back one month', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    const before = result.current.currentMonth.getMonth();
    act(() => result.current.prevMonth());
    expect(result.current.currentMonth.getMonth()).toBe((before - 1 + 12) % 12);
  });

  it('jumpToMonth sets currentMonth to specified date', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    const target = new Date(2023, 5, 1); // June 2023
    act(() => result.current.jumpToMonth(target));

    expect(result.current.currentMonth.getMonth()).toBe(5);
    expect(result.current.currentMonth.getFullYear()).toBe(2023);
  });

  it('exposes a refetch function', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useFinanceData(FAKE_USER), { wrapper });

    expect(typeof result.current.refetch).toBe('function');
  });
});
