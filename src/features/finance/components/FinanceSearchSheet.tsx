import { useMemo, useState } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';

interface FinanceSearchSheetProps {
  accounts: AnchorAccount[];
  transactions: AnchorTransaction[];
  onOpenAccount: (accountId: string) => void;
}

function normalizeValue(value: string | undefined): string {
  return (value || '').trim().toLowerCase();
}

export const FinanceSearchSheet = ({
  accounts,
  transactions,
  onOpenAccount,
}: FinanceSearchSheetProps) => {
  const [query, setQuery] = useState('');

  const accountNames = useMemo(
    () => new Map(accounts.map((account) => [account.id, account.name])),
    [accounts],
  );

  const results = useMemo(() => {
    const normalizedQuery = normalizeValue(query);
    const sortedTransactions = [...transactions].sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
    );

    if (!normalizedQuery) {
      return sortedTransactions.slice(0, 8);
    }

    return sortedTransactions.filter((transaction) => {
      const accountName = accountNames.get(transaction.accountId) || transaction.accountName || '';
      const amount = formatCurrency(fromCents(transaction.amountCents), transaction.currency);
      const haystack = [
        transaction.title,
        transaction.category,
        accountName,
        amount,
      ].map(normalizeValue);

      return haystack.some((value) => value.includes(normalizedQuery));
    });
  }, [accountNames, query, transactions]);

  return (
    <div className="space-y-4" data-testid="finance-search-sheet">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Search Transactions
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search transactions, categories, or accounts"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No transactions matched that search.
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((transaction) => {
            const accountName = accountNames.get(transaction.accountId) || transaction.accountName || 'Unknown account';
            return (
              <button
                key={transaction.id}
                type="button"
                onClick={() => onOpenAccount(transaction.accountId)}
                className="flex w-full items-start justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {transaction.title}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {accountName} · {transaction.category}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {formatCurrency(fromCents(transaction.amountCents), transaction.currency)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};