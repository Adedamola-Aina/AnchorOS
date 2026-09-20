// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VirtualTransactionList } from './VirtualTransactionList';
import type { AnchorTransaction } from '../../../types';

// Mock @tanstack/react-virtual to avoid actual virtualization in tests
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        key: i,
        start: i * 88,
        size: 88,
      })),
    getTotalSize: () => count * 88,
    measureElement: vi.fn(),
  }),
}));

vi.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({ isMobile: false, isTablet: false, isDesktop: true }),
}));

vi.mock('./TransactionItem', () => ({
  TransactionItem: ({ transaction }: { transaction: AnchorTransaction }) => (
    <div data-testid={`tx-${transaction.id}`}>{transaction.title}</div>
  ),
}));

vi.mock('./SwipeableTransactionItem', () => ({
  SwipeableTransactionItem: ({ transaction }: { transaction: AnchorTransaction }) => (
    <div data-testid={`swipe-tx-${transaction.id}`}>{transaction.title}</div>
  ),
}));

const makeTx = (id: string, title: string): AnchorTransaction => ({
  id,
  title,
  amountCents: -5000,
  type: 'expense',
  accountId: 'acc-1',
  accountName: 'Checking',
  date: '2025-01-15',
  createdBy: 'user-1',
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
} as AnchorTransaction);

describe('VirtualTransactionList', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  it('shows empty state when no transactions', () => {
    render(<VirtualTransactionList transactions={[]} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    expect(screen.getByText(/record your first transaction/i)).toBeInTheDocument();
  });

  // UX-FN-01: the empty state instructed an action and offered no control.
  it('carries its own action in the empty state (UX-FN-01)', () => {
    const onRecordTransaction = vi.fn();
    render(<VirtualTransactionList transactions={[]} onEdit={onEdit} onDelete={onDelete} onRecordTransaction={onRecordTransaction} />);

    const action = screen.getByTestId('record-first-transaction');
    fireEvent.click(action);
    expect(onRecordTransaction).toHaveBeenCalledTimes(1);
  });

  // UX-FN-10: "nothing this month" is not "nothing at all".
  describe('UX-FN-10: activity elsewhere', () => {
    it('says where the activity is and offers the one-tap way there', () => {
      const onJump = vi.fn();
      render(
        <VirtualTransactionList
          transactions={[]}
          onEdit={onEdit}
          onDelete={onDelete}
          latestActivityLabel="August 2026"
          onJumpToLatestActivity={onJump}
        />
      );

      expect(screen.getByText('Nothing this month')).toBeInTheDocument();
      expect(screen.getByText(/You have activity in August 2026/)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('jump-to-latest-activity'));
      expect(onJump).toHaveBeenCalledTimes(1);
    });

    it('does not claim activity elsewhere when there is none', () => {
      render(<VirtualTransactionList transactions={[]} onEdit={onEdit} onDelete={onDelete} />);
      expect(screen.queryByTestId('jump-to-latest-activity')).not.toBeInTheDocument();
      expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    });

    it('keeps the search reason distinct from the empty-month reason', () => {
      render(
        <VirtualTransactionList
          transactions={[]}
          onEdit={onEdit}
          onDelete={onDelete}
          searchQuery="coffee"
          latestActivityLabel="August 2026"
          onJumpToLatestActivity={vi.fn()}
        />
      );

      expect(screen.getByText('No transactions found')).toBeInTheDocument();
      expect(screen.queryByText('Nothing this month')).not.toBeInTheDocument();
    });
  });

  it('handles undefined transactions defensively', () => {
    render(<VirtualTransactionList transactions={undefined as unknown as AnchorTransaction[]} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
  });

  it('shows search-specific empty state', () => {
    render(<VirtualTransactionList transactions={[]} onEdit={onEdit} onDelete={onDelete} searchQuery="groceries" />);
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
    expect(screen.getByText(/different search term/i)).toBeInTheDocument();
  });

  it('shows clear search button with onClearSearch', () => {
    const onClear = vi.fn();
    render(<VirtualTransactionList transactions={[]} onEdit={onEdit} onDelete={onDelete} searchQuery="test" onClearSearch={onClear} />);
    const clearBtn = screen.getByText('Clear search');
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();
  });

  it('renders transactions via TransactionItem on desktop', () => {
    const txs = [makeTx('t1', 'Coffee'), makeTx('t2', 'Lunch')];
    render(<VirtualTransactionList transactions={txs} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByTestId('tx-t1')).toBeInTheDocument();
    expect(screen.getByTestId('tx-t2')).toBeInTheDocument();
    expect(screen.getByText('End of list')).toBeInTheDocument();
  });

  it('applies loading styles', () => {
    const txs = [makeTx('t1', 'Coffee')];
    const { container } = render(<VirtualTransactionList transactions={txs} onEdit={onEdit} onDelete={onDelete} loading />);
    expect(container.firstChild).toHaveClass('opacity-40');
  });

  it('shows Previous month divider at carryoverStartIndex', () => {
    const txs = [makeTx('t1', 'Current'), makeTx('t2', 'Previous')];
    render(<VirtualTransactionList transactions={txs} onEdit={onEdit} onDelete={onDelete} carryoverStartIndex={1} />);
    expect(screen.getByText('Previous month')).toBeInTheDocument();
  });
});
