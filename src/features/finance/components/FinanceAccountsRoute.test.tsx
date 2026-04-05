import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinanceAccountsRoute } from './FinanceAccountsRoute';
import type { AnchorAccount } from '../../../types';

const accounts: AnchorAccount[] = [
  {
    id: 'acc-1',
    name: 'Main Checking',
    type: 'checking',
    currency: 'USD',
    balanceCents: 540000,
    color: '#111827',
    scope: 'personal',
    ownerId: 'user-1',
    source: 'linked',
  },
  {
    id: 'acc-2',
    name: 'Family Savings',
    type: 'savings',
    currency: 'USD',
    balanceCents: 820000,
    color: '#1d4ed8',
    scope: 'family',
    ownerId: 'owner-2',
    sharedWith: {
      'user-1': { grantedAt: '2026-04-01T00:00:00.000Z', grantedBy: 'owner-2', permission: 'read' },
    },
    source: 'manual',
  },
  {
    id: 'acc-3',
    name: 'Salary Vault',
    type: 'salary',
    currency: 'NGN',
    balanceCents: 1200000,
    color: '#0f766e',
    scope: 'personal',
    ownerId: 'user-1',
    source: 'manual',
  },
];

describe('FinanceAccountsRoute', () => {
  it('shows ownership summary and management metadata for each account', () => {
    render(
      <FinanceAccountsRoute
        accounts={accounts}
        currentUserId="user-1"
        onBack={vi.fn()}
        onCreateAccount={vi.fn()}
        onOpenAccount={vi.fn()}
      />,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('Owner').length).toBeGreaterThan(0);
    expect(screen.getByText('Read access')).toBeInTheDocument();
    expect(screen.getByText('Linked')).toBeInTheDocument();
    expect(screen.getAllByText('Manual').length).toBeGreaterThan(0);
  });

  it('filters to shared accounts only', async () => {
    render(
      <FinanceAccountsRoute
        accounts={accounts}
        currentUserId="user-1"
        onBack={vi.fn()}
        onCreateAccount={vi.fn()}
        onOpenAccount={vi.fn()}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Shared' }));

    expect(screen.getByText('Family Savings')).toBeInTheDocument();
    expect(screen.queryByText('Main Checking')).not.toBeInTheDocument();
    expect(screen.queryByText('Salary Vault')).not.toBeInTheDocument();
  });

  it('opens the create account flow from the management route', async () => {
    const onCreateAccount = vi.fn();
    render(
      <FinanceAccountsRoute
        accounts={accounts}
        currentUserId="user-1"
        onBack={vi.fn()}
        onCreateAccount={onCreateAccount}
        onOpenAccount={vi.fn()}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /new account/i }));

    expect(onCreateAccount).toHaveBeenCalledOnce();
  });
});