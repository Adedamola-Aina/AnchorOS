/**
 * BalancesSummary — what the user has, per currency, always labelled.
 *
 * The defect it inherited (UX-FN-02): mixed currency balances were presented as one
 * headline figure under a "TOTAL ASSETS" heading, with no per-currency label and
 * nothing saying whether a conversion had been applied. Adding NGN to USD is
 * arithmetically meaningless, so the UI must never imply it did.
 *
 * It then over-corrected: a "BALANCES" heading (the page above already says
 * "Finance · your accounts, balances and spending in one place"), an account count,
 * and a sentence explaining that no exchange rate is applied. Three lines of
 * furniture around one number — reported as clutter. What actually prevents a
 * misleading total is that every figure is labelled with its own currency and the
 * figures are never summed, so that is all this renders now.
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

  const multiCurrency = rows.length > 1;

  return (
    <section data-testid="balances-summary" aria-label="Balances">
      <dl
        className={`grid gap-x-6 gap-y-3 ${multiCurrency ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {rows.map(({ currency, cents, count }) => (
          <div key={currency} className="min-w-0" data-testid={`balances-${currency}`}>
            {/*
              * The label is the currency and nothing else, visually. The count stays
              * in the accessible name, where it is information rather than furniture.
              */}
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
    </section>
  );
};
