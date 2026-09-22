/**
 * BalancesSummary — what the user has, per currency, always labelled.
 *
 * Replaces `TotalAssetsSummaryBar`. The defect it inherited (UX-FN-02): mixed
 * currency balances were presented as **one headline figure** under a
 * "TOTAL ASSETS" heading, with no per-currency label, no account count and
 * nothing saying whether a conversion had been applied. Adding NGN to USD is
 * arithmetically meaningless, so the UI must never imply it did — and the
 * heading must not promise a total it cannot print.
 *
 * Now: the heading says "Balances" (what this actually is), each currency is its
 * own labelled figure, the account count is stated once, and when more than one
 * currency is present the block says plainly that no exchange rate is applied.
 * Cross-currency consolidation stays out of scope until an FX provider decision
 * exists (audit doc 18 §4.6.2, decision D5) — this component cannot imply a
 * conversion it cannot perform.
 */
import React, { useMemo } from 'react';
import { fromCents } from '../../utils/moneyUtils';
import { formatCurrency } from '../../utils/format';
import type { AnchorAccount, Currency } from '../../types';

interface BalancesSummaryProps {
  accounts: AnchorAccount[];
}

export const BalancesSummary: React.FC<BalancesSummaryProps> = ({ accounts }) => {
  const rows = useMemo(() => {
    const byCurrency: Partial<Record<Currency, { cents: number; count: number }>> = {};
    for (const account of accounts) {
      const entry = byCurrency[account.currency] ?? { cents: 0, count: 0 };
      entry.cents += account.balanceCents;
      entry.count += 1;
      byCurrency[account.currency] = entry;
    }
    // Largest first: the currency the user holds most of leads.
    return (Object.keys(byCurrency) as Currency[])
      .map((currency) => ({ currency, ...byCurrency[currency]! }))
      .sort((a, b) => b.cents - a.cents);
  }, [accounts]);

  if (rows.length === 0) return null;

  const totalAccounts = rows.reduce((sum, row) => sum + row.count, 0);
  const multiCurrency = rows.length > 1;

  return (
    <section data-testid="balances-summary" aria-labelledby="balances-heading">
      <h3
        id="balances-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500"
      >
        Balances
      </h3>

      <dl
        className={`mt-2 grid gap-x-6 gap-y-3 ${multiCurrency ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {rows.map(({ currency, cents, count }) => (
          <div key={currency} className="min-w-0" data-testid={`balances-${currency}`}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {currency}
              <span className="sr-only">
                {` balance across ${count} ${count === 1 ? 'account' : 'accounts'}`}
              </span>
            </dt>
            <dd
              className={`mt-0.5 font-bold tabular-nums leading-tight text-slate-900 dark:text-white ${
                multiCurrency ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
              }`}
            >
              {formatCurrency(fromCents(cents), currency)}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        {totalAccounts} {totalAccounts === 1 ? 'account' : 'accounts'}
        {multiCurrency && (
          <>
            {' · '}
            <span data-testid="balances-fx-note">
              Shown per currency — no exchange rate is applied.
            </span>
          </>
        )}
      </p>
    </section>
  );
};
