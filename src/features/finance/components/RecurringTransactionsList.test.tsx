import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { RecurringTransactionsList } from './RecurringTransactionsList';

const mockUpdateRule = vi.fn();
const mockDeleteRule = vi.fn();

vi.mock('../../../hooks/useRecurringQueries', () => ({
  useRecurringTransactions: vi.fn(),
  useUpdateRecurringTransaction: () => ({ mutateAsync: mockUpdateRule }),
  useDeleteRecurringTransaction: () => ({ mutateAsync: mockDeleteRule }),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user-1' } }),
}));

vi.mock('../../../context/FinanceContext', () => ({
  useFinance: () => ({
    accounts: [{ id: 'acc-1', currency: 'NGN', name: 'Main' }],
  }),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  useHaptic: () => ({ trigger: vi.fn() }),
}));

vi.mock('../../../utils/moneyUtils', () => ({
  fromCents: (c: number) => c / 100,
}));

vi.mock('../../../utils/format', () => ({
  formatCurrency: (amount: number, currency: string) => `${currency} ${amount}`,
}));

import { useRecurringTransactions } from '../../../hooks/useRecurringQueries';

const mockUseRecurring = vi.mocked(useRecurringTransactions);

describe('RecurringTransactionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('shows loading skeleton', () => {
    mockUseRecurring.mockReturnValue({ data: [], isLoading: true, isEmpty: false } as any);
    const { container } = render(<RecurringTransactionsList />);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
  });

  it('shows empty state', () => {
    mockUseRecurring.mockReturnValue({ data: [], isLoading: false, isEmpty: true } as any);
    render(<RecurringTransactionsList />);
    expect(screen.getByText(/no recurring rules/i)).toBeInTheDocument();
    expect(screen.getByText(/make recurring/i)).toBeInTheDocument();
  });

  it('renders active rules', () => {
    mockUseRecurring.mockReturnValue({
      data: [{
        id: 'r1', title: 'Netflix', frequency: 'monthly', status: 'active',
        nextRunAt: '2025-02-15T00:00:00Z', amountCents: 1500, type: 'expense', accountId: 'acc-1',
      }],
      isLoading: false, isEmpty: false,
    } as any);

    render(<RecurringTransactionsList />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('monthly')).toBeInTheDocument();
  });

  it('renders paused rules with badge', () => {
    mockUseRecurring.mockReturnValue({
      data: [{
        id: 'r2', title: 'Gym', frequency: 'monthly', status: 'paused',
        nextRunAt: '2025-02-15T00:00:00Z', amountCents: 3000, type: 'expense', accountId: 'acc-1',
      }],
      isLoading: false, isEmpty: false,
    } as any);

    render(<RecurringTransactionsList />);
    expect(screen.getByText('Gym')).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('toggles rule status', async () => {
    mockUseRecurring.mockReturnValue({
      data: [{
        id: 'r1', title: 'Netflix', frequency: 'monthly', status: 'active',
        nextRunAt: '2025-02-15T00:00:00Z', amountCents: 1500, type: 'expense', accountId: 'acc-1',
      }],
      isLoading: false, isEmpty: false,
    } as any);

    render(<RecurringTransactionsList />);
    fireEvent.click(screen.getByTitle('Pause Rule'));
    await waitFor(() => {
      expect(mockUpdateRule).toHaveBeenCalledWith({ id: 'r1', updates: { status: 'paused' } });
    });
  });

  it('deletes a rule', async () => {
    mockUseRecurring.mockReturnValue({
      data: [{
        id: 'r1', title: 'Netflix', frequency: 'monthly', status: 'active',
        nextRunAt: '2025-02-15T00:00:00Z', amountCents: 1500, type: 'expense', accountId: 'acc-1',
      }],
      isLoading: false, isEmpty: false,
    } as any);

    render(<RecurringTransactionsList />);
    fireEvent.click(screen.getByTitle('Delete Rule'));
    await waitFor(() => {
      expect(mockDeleteRule).toHaveBeenCalledWith('r1');
    });
  });

  it('shows income with + prefix', () => {
    mockUseRecurring.mockReturnValue({
      data: [{
        id: 'r3', title: 'Salary', frequency: 'monthly', status: 'active',
        nextRunAt: '2025-02-01T00:00:00Z', amountCents: 500000, type: 'income', accountId: 'acc-1',
      }],
      isLoading: false, isEmpty: false,
    } as any);

    render(<RecurringTransactionsList />);
    expect(screen.getByText('Salary')).toBeInTheDocument();
    // The + is prepended before the formatted currency
    expect(screen.getByText(/\+/)).toBeInTheDocument();
  });
});
