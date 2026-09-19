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

/**
 * UX-FN-07 regression guard.
 * A non-front card previously exposed its whole box as the hit area, but that box
 * is painted underneath the front card, so real pointer clicks were intercepted and
 * the account could not be opened at all. Only the peek strip is reachable.
 */
describe('AccountCard — stacked peek strip is a real hit target (UX-FN-07)', () => {
  it('gives a non-front card a tappable 48px strip', () => {
    render(card({ isActive: false }));
    const strip = screen.getByTestId('account-card-acc-1');
    expect(strip).toHaveAttribute('data-account-card-strip', 'true');
    expect(strip).toHaveStyle({ height: '48px', pointerEvents: 'auto' });
  });

  it('removes the non-front card body from the hit-test surface', () => {
    const { container } = render(card({ isActive: false }));
    const body = container.querySelector('.account-card');
    expect(body).toHaveStyle({ pointerEvents: 'none' });
    expect(body).toHaveAttribute('role', 'presentation');
    expect(body).not.toHaveAttribute('aria-label');
  });

  it('opens the account when the strip is tapped', async () => {
    const onTap = vi.fn();
    render(card({ isActive: false, onTap }));
    await userEvent.click(screen.getByTestId('account-card-acc-1'));
    expect(onTap).toHaveBeenCalledOnce();
  });

  it('exposes exactly one interactive element per card (no duplicate accessible name)', () => {
    render(card({ isActive: false }));
    expect(screen.getAllByTestId('account-card-acc-1')).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /Chase Bank/ })).toHaveLength(1);
  });

  it('keeps the front card fully tappable (no strip, body handles the tap)', async () => {
    const onTap = vi.fn();
    const { container } = render(card({ isActive: true, onTap }));
    const body = container.querySelector('.account-card');
    expect(body).not.toHaveStyle({ pointerEvents: 'none' });
    expect(screen.queryByTestId('account-card-acc-1')).not.toHaveAttribute('data-account-card-strip');
    await userEvent.click(screen.getByTestId('account-card-acc-1'));
    expect(onTap).toHaveBeenCalledOnce();
  });

  it('keeps the strip in expanded mode off (whole card is visible there)', () => {
    render(card({ mode: 'expanded', isActive: false }));
    expect(screen.queryByTestId('account-card-acc-1')).not.toHaveAttribute('data-account-card-strip');
  });
});
