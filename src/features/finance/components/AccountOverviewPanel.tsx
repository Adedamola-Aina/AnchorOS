import { CalendarDays, CreditCard, Repeat2, Wallet } from 'lucide-react';
import type { AnchorAccount, AnchorTransaction } from '../../../types';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';

interface AccountOverviewPanelProps {
  account: AnchorAccount;
  transactions: AnchorTransaction[];
  monthlyNetCents: number;
}

export const AccountOverviewPanel = ({
  account,
  transactions,
  monthlyNetCents,
}: AccountOverviewPanelProps) => {
  const recurringCount = transactions.filter((transaction) => Boolean(transaction.recurringId)).length;
  const latestActivity = transactions[0]?.transactionDate || transactions[0]?.date;

  const items = [
    {
      label: 'Balance',
      value: formatCurrencyCompact(fromCents(account.balanceCents), account.currency),
      icon: Wallet,
    },
    {
      label: 'Monthly Net',
      value: `${monthlyNetCents > 0 ? '+' : ''}${formatCurrencyCompact(fromCents(monthlyNetCents), account.currency)}`,
      icon: CreditCard,
    },
    {
      label: 'Transactions',
      value: `${transactions.length}`,
      icon: CalendarDays,
    },
    {
      label: 'Recurring',
      value: `${recurringCount}`,
      icon: Repeat2,
      hint: latestActivity ? `Latest ${new Date(latestActivity).toLocaleDateString()}` : 'No recent activity',
    },
  ];

  return (
    <section className="space-y-3" aria-label="Account Overview">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Account Overview
        </h3>
        {latestActivity ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Updated {new Date(latestActivity).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</span>
            </div>
            <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
            {hint ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};