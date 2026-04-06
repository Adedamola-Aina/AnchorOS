/**
 * FinanceDesktopContent — Production desktop/tablet layout
 * Net worth hero cards, monthly insights, and account grid.
 * Extracted from FinanceView per ARCH-001 200-line rule.
 */
// @ts-nocheck

import { NetWorthCards } from './NetWorthCards';
import { MonthlyInsight } from '../MonthlyInsight';
import { AccountCard } from './AccountCard';
import { SkeletonCards } from '../../../components/finance/SkeletonCards';
import type { AnchorAccount, AnchorTransaction, Currency } from '../../../types';

interface FinanceDesktopContentProps {
  netWorth: { NGN: number; USD: number };
  transactions: AnchorTransaction[];
  currency: Currency;
  accounts: AnchorAccount[];
  activeAccounts: AnchorAccount[];
  loading: boolean;
  userId: string;
  onOpenAccount: (accountId: string) => void;
}

export const FinanceDesktopContent = ({
  netWorth, transactions, currency, accounts, activeAccounts, loading, userId, onOpenAccount,
}: FinanceDesktopContentProps) => (
  <>
    <NetWorthCards netWorth={netWorth} />
    <MonthlyInsight transactions={transactions} currency={currency} />
    {loading && accounts.length === 0 && <SkeletonCards count={3} />}
    {activeAccounts.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeAccounts.map(account => (
          <AccountCard key={account.id} account={account} userId={userId} onEdit={() => onOpenAccount(account.id)} />
        ))}
      </div>
    )}
  </>
);
