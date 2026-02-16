import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RecentActivityList } from './RecentActivityList';

vi.mock('../../../utils/moneyUtils', () => ({ fromCents: (c: number) => c / 100 }));
vi.mock('../../../utils/format', () => ({ formatCurrencyCompact: (a: number, c: string) => `${c}${a}` }));

describe('RecentActivityList', () => {
  it('shows empty state', () => {
    render(<RecentActivityList recentActivity={[]} />);
    expect(screen.getByText('No recent transactions')).toBeInTheDocument();
  });

  it('renders transactions', () => {
    const txs = [
      { id: 't1', title: 'Coffee', type: 'expense', amountCents: 500, date: '2025-01-15', category: 'Food', currency: 'NGN' },
      { id: 't2', title: 'Salary', type: 'income', amountCents: 100000, date: '2025-01-15', category: 'Income', currency: 'NGN' },
    ] as any[];
    render(<RecentActivityList recentActivity={txs} />);
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });
});
