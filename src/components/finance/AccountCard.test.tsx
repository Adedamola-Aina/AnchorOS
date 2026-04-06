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

const card = (overrides: Partial<React.ComponentProps<typeof AccountCard>> = {}) => (
  <AccountCard account={baseAccount} index={0} totalCards={3}
    mode="stack" isActive={true} onTap={noop} {...overrides} />
);

describe('AccountCard — Apple Wallet panel', () => {
  it('renders institution name at the top (peek-visible)', () => {
    render(card());
    expect(screen.getByText('Chase Bank')).toBeInTheDocument();
  });

  it('renders balance at the top alongside name', () => {
    render(card());
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
  });

  it('uses clean panel typography for the header row', () => {
    render(card());
    expect(screen.getByText('Chase Bank')).toHaveStyle({ fontSize: '15px', fontWeight: '600', letterSpacing: '-0.3px' });
    expect(screen.getByText('$1500.00')).toHaveStyle({ fontSize: '15px', fontWeight: '500', letterSpacing: '-0.3px' });
  });

  it('shows sub-name when different from institution', () => {
    render(card({ mode: 'expanded' }));
    expect(screen.getByText('Main Checking')).toBeInTheDocument();
  });

  it('renders last 4 digits of linked account in footer', () => {
    render(card());
    expect(screen.getByText(/5678/)).toBeInTheDocument();
  });

  it('renders account type in footer', () => {
    render(card());
    expect(screen.getByText('checking')).toBeInTheDocument();
  });

  it('uses type-based color for checking accounts', () => {
    const { container } = render(card());
    expect(container.querySelector('.account-card')).toHaveStyle({ backgroundColor: '#1E293B' });
  });

  it('uses custom cardColor when set (overrides type color)', () => {
    const { container } = render(card({ account: { ...baseAccount, cardColor: '#FF0000' } }));
    expect(container.querySelector('.account-card')).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('calls onTap when clicked', async () => {
    const onTap = vi.fn();
    render(card({ onTap }));
    await userEvent.click(screen.getByTestId('account-card-acc-1'));
    expect(onTap).toHaveBeenCalledOnce();
  });

  it('has accessible label with institution name', () => {
    render(card());
    expect(screen.getByRole('button', { name: /Chase Bank/ })).toBeInTheDocument();
  });

  it('has no decorative chip element (clean panel)', () => {
    const { container } = render(card());
    expect(container.querySelector('.rounded-sm')).not.toBeInTheDocument();
  });

  it('uses credit card aspect ratio', () => {
    const { container } = render(card());
    expect(container.querySelector('.account-card')).toHaveStyle({ aspectRatio: '1.586' });
  });
});
