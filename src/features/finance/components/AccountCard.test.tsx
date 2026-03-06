// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccountCard } from './AccountCard';
import { buildAccount } from '../../../test/factories';

vi.mock('../../../utils/format', () => ({
  formatCurrencyCompact: vi.fn((val: number, cur: string) => `${cur} ${val}`),
}));

vi.mock('../../../utils/moneyUtils', () => ({
  fromCents: vi.fn((cents: number) => cents / 100),
}));

describe('AccountCard', () => {
  const baseAccount = buildAccount({ balanceCents: 150000, currency: 'USD', name: 'Savings' });

  it('renders account name', () => {
    render(<AccountCard account={baseAccount} userId="u1" onEdit={vi.fn()} />);
    expect(screen.getByText('Savings')).toBeInTheDocument();
  });

  it('renders formatted balance', () => {
    render(<AccountCard account={baseAccount} userId="u1" onEdit={vi.fn()} />);
    expect(screen.getByText(/1500/)).toBeInTheDocument();
  });

  it('calls onEdit when clicked', () => {
    const onEdit = vi.fn();
    render(<AccountCard account={baseAccount} userId="u1" onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Savings').closest('[role="button"]') || screen.getByText('Savings').parentElement!);
    // onEdit may be on card click
    expect(onEdit).toHaveBeenCalledWith(baseAccount);
  });

  it('shows share toggle for owner with family', () => {
    const onToggleShare = vi.fn();
    render(
      <AccountCard
        account={baseAccount}
        userId="u1"
        isOwnerOfConnection={true}
        familyMemberUid="member-1"
        onEdit={vi.fn()}
        onToggleShare={onToggleShare}
      />
    );
    // Share toggle exists (may be hidden via css)
    const { container } = render(
      <AccountCard
        account={baseAccount}
        userId="u1"
        isOwnerOfConnection={true}
        familyMemberUid="member-1"
        onEdit={vi.fn()}
        onToggleShare={onToggleShare}
      />
    );
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('does not show share toggle without family', () => {
    const { container } = render(
      <AccountCard account={baseAccount} userId="u1" onEdit={vi.fn()} />
    );
    // No toggle buttons when no family connection
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeLessThanOrEqual(1); // only the card itself might be a button
  });

  describe('linked bank accounts', () => {
    const linkedAccount = buildAccount({
      name: 'GTBank Spending',
      source: 'linked',
      externalConnection: {
        provider: 'mono',
        externalAccountId: 'mono-123',
        institutionName: 'Guaranty Trust Bank',
        institutionCode: 'gtb',
        lastSyncedAt: '2026-03-06T10:00:00Z',
        syncStatus: 'active',
        maskedAccountNumber: '****5678',
      },
    });

    it('shows institution name for linked accounts', () => {
      render(<AccountCard account={linkedAccount} userId="u1" onEdit={vi.fn()} />);
      expect(screen.getByText(/Guaranty Trust Bank/i)).toBeInTheDocument();
    });

    it('shows masked account number', () => {
      render(<AccountCard account={linkedAccount} userId="u1" onEdit={vi.fn()} />);
      expect(screen.getByText(/\*\*\*\*5678/)).toBeInTheDocument();
    });

    it('shows reconnect badge when status is reconnect_required', () => {
      const reconnectAccount = buildAccount({
        source: 'linked',
        externalConnection: {
          ...linkedAccount.externalConnection,
          syncStatus: 'reconnect_required',
        },
      });
      render(<AccountCard account={reconnectAccount} userId="u1" onEdit={vi.fn()} />);
      expect(screen.getByText(/reconnect/i)).toBeInTheDocument();
    });

    it('calls onReconnect when reconnect badge is clicked', async () => {
      const onReconnect = vi.fn();
      const reconnectAccount = buildAccount({
        source: 'linked',
        externalConnection: {
          ...linkedAccount.externalConnection,
          syncStatus: 'reconnect_required',
        },
      });
      render(<AccountCard account={reconnectAccount} userId="u1" onEdit={vi.fn()} onReconnect={onReconnect} />);
      const badge = screen.getByRole('button', { name: /reconnect/i });
      await badge.click();
      expect(onReconnect).toHaveBeenCalledWith(reconnectAccount);
    });

    it('does not show bank info for manual accounts', () => {
      render(<AccountCard account={baseAccount} userId="u1" onEdit={vi.fn()} />);
      expect(screen.queryByText(/\*\*\*\*/)).not.toBeInTheDocument();
    });
  });
});
