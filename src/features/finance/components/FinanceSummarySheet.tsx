import { useMemo } from 'react';
import type { AnchorAccount, Currency } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';

interface FinanceSummarySheetProps {
  accounts: AnchorAccount[];
  onOpenAccount: (accountId: string) => void;
}

export const FinanceSummarySheet = ({
  accounts,
  onOpenAccount,
}: FinanceSummarySheetProps) => {
  const totalsByCurrency = useMemo(() => {
    return accounts.reduce((totals, account) => {
      const currentTotal = totals[account.currency] || 0;
      return {
        ...totals,
        [account.currency]: currentTotal + account.balanceCents,
      };
    }, {} as Partial<Record<Currency, number>>);
  }, [accounts]);

  const sortedAccounts = useMemo(
    () => [...accounts].sort((left, right) => right.balanceCents - left.balanceCents),
    [accounts],
  );

  return (
    <div className="space-y-5" data-testid="finance-summary-sheet">
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(totalsByCurrency).map(([currency, total]) => (
          <div
            key={currency}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {currency} Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(fromCents(total || 0), currency as Currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {accounts.length} active account{accounts.length === 1 ? '' : 's'}
        </p>
        {sortedAccounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => onOpenAccount(account.id)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {account.name}
              </p>
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                {account.type}
              </p>
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {formatCurrency(fromCents(account.balanceCents), account.currency)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};