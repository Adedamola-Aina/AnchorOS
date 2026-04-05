import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountOverviewPanel } from './AccountOverviewPanel';
import type { AnchorAccount, AnchorTransaction } from '../../../types';

const account: AnchorAccount = {
  id: 'acc-1',
  name: 'Checking',
  type: 'checking',
  currency: 'USD',
  balanceCents: 250000,
  color: '',
  scope: 'personal',
};

const transactions: AnchorTransaction[] = [
  {
    id: 'tx-1',
    title: 'Salary',
    amountCents: 300000,
    type: 'income',
    category: 'Salary',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'tx-2',
    title: 'Streaming',
    amountCents: 1500,
    type: 'expense',
    category: 'Subscriptions',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-04-02T00:00:00.000Z',
    recurringId: 'rec-1',
  },
];

describe('AccountOverviewPanel', () => {
  it('renders key overview stats for the account', () => {
    render(
      <AccountOverviewPanel
        account={account}
        transactions={transactions}
        monthlyNetCents={298500}
      />,
    );

    expect(screen.getByText('Account Overview')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Recurring')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});