// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./NetWorthCards', () => ({
  NetWorthCards: ({ netWorth }: any) => <div data-testid="networth">{netWorth.NGN}/{netWorth.USD}</div>,
}));
vi.mock('../MonthlyInsight', () => ({
  MonthlyInsight: ({ currency }: any) => <div data-testid="insight">{currency}</div>,
}));
vi.mock('./AccountCard', () => ({
  AccountCard: ({ account, onEdit }: any) => (
    <button data-testid={`card-${account.id}`} onClick={onEdit}>{account.name}</button>
  ),
}));
vi.mock('../../../components/finance/SkeletonCards', () => ({
  SkeletonCards: ({ count }: any) => <div data-testid="skeleton">{count}</div>,
}));

import { FinanceDesktopContent } from './FinanceDesktopContent';

const baseProps = {
  netWorth: { NGN: 1000, USD: 50 },
  transactions: [],
  currency: 'NGN' as const,
  accounts: [],
  activeAccounts: [],
  loading: false,
  userId: 'u1',
  onOpenAccount: vi.fn(),
};

describe('FinanceDesktopContent', () => {
  it('renders net worth and monthly insight', () => {
    render(<FinanceDesktopContent {...baseProps} />);
    expect(screen.getByTestId('networth')).toHaveTextContent('1000/50');
    expect(screen.getByTestId('insight')).toHaveTextContent('NGN');
  });

  it('shows skeleton when loading with no accounts', () => {
    render(<FinanceDesktopContent {...baseProps} loading={true} />);
    expect(screen.getByTestId('skeleton')).toHaveTextContent('3');
  });

  it('does not show skeleton when accounts exist', () => {
    render(
      <FinanceDesktopContent
        {...baseProps}
        loading={true}
        accounts={[{ id: 'a1', name: 'A' } as any]}
      />,
    );
    expect(screen.queryByTestId('skeleton')).toBeNull();
  });

  it('renders an AccountCard for each active account and wires onEdit', () => {
    const onOpenAccount = vi.fn();
    render(
      <FinanceDesktopContent
        {...baseProps}
        accounts={[{ id: 'a1' } as any, { id: 'a2' } as any]}
        activeAccounts={[{ id: 'a1', name: 'Checking' } as any, { id: 'a2', name: 'Savings' } as any]}
        onOpenAccount={onOpenAccount}
      />,
    );
    const card = screen.getByTestId('card-a1');
    expect(card).toBeDefined();
    expect(screen.getByTestId('card-a2')).toBeDefined();
    card.click();
    expect(onOpenAccount).toHaveBeenCalledWith('a1');
  });
});
