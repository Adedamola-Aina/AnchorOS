import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountCard } from './AccountCard';
import type { AnchorAccount } from '../../types';

vi.mock('../../utils/format', () => ({
  formatCurrency: (amount: number, _currency: string) => `$${amount.toFixed(2)}`,
}));
vi.mock('../../utils/moneyUtils', () => ({
  fromCents: (cents: number) => cents / 100,
}));

const baseAccount: AnchorAccount = {
  id: 'acc-1', name: 'Main Checking', type: 'checking',
  currency: 'USD', balanceCents: 150000, color: '',
  scope: 'personal', isArchived: false,
  externalConnection: {
    provider: 'mono', externalAccountId: 'ext-1',
    institutionName: 'Chase Bank', institutionCode: 'chase',
    lastSyncedAt: '2026-04-01', syncStatus: 'active',
    maskedAccountNumber: '****5678',
  },
} as AnchorAccount;

const noop = vi.fn();

describe('AccountCard — Apple Wallet layout', () => {
  it('renders institution name at the top (peek-visible)', () => {
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    expect(screen.getByText('Chase Bank')).toBeInTheDocument();
  });

  it('renders balance at the top alongside name', () => {
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
  });

  it('uses Wallet-style top bar typography for the visible header row', () => {
    const { container } = render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );

    expect(screen.getByText('Chase Bank')).toHaveStyle({ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.4px' });
    expect(screen.getByText('$1500.00')).toHaveStyle({ fontSize: '18px', fontWeight: '500', letterSpacing: '-0.4px' });

    const content = container.querySelector('.card-header')?.parentElement;
    expect(content).toHaveClass('px-6');
  });

  it('shows sub-name when different from institution', () => {
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="expanded" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    expect(screen.getByText('Main Checking')).toBeInTheDocument();
  });

  it('renders last 4 digits of linked account', () => {
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    expect(screen.getByText(/5678/)).toBeInTheDocument();
  });

  it('renders account type badge', () => {
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    expect(screen.getByText('checking')).toBeInTheDocument();
  });

  it('uses type-based color for checking accounts', () => {
    const { container } = render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    const card = container.querySelector('.account-card');
    expect(card).toHaveStyle({ backgroundColor: '#1E293B' });
  });

  it('uses custom cardColor when set (overrides type color)', () => {
    const custom = { ...baseAccount, cardColor: '#FF0000' };
    const { container } = render(
      <AccountCard account={custom} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    const card = container.querySelector('.account-card');
    expect(card).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('calls onTap when clicked', async () => {
    const onTap = vi.fn();
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={onTap} onDragStart={noop} />
    );
    await userEvent.click(screen.getByTestId('account-card-acc-1'));
    expect(onTap).toHaveBeenCalledOnce();
  });

  it('has accessible label with institution name', () => {
    render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    expect(screen.getByRole('button', { name: /Chase Bank/ })).toBeInTheDocument();
  });

  it('renders decorative chip element', () => {
    const { container } = render(
      <AccountCard account={baseAccount} index={0} totalCards={3}
        mode="stack" isActive={true} isDragging={false} dragOffset={0}
        onTap={noop} onDragStart={noop} />
    );
    const chip = container.querySelector('.rounded-sm');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveStyle({ width: '36px', height: '26px' });
  });
});
