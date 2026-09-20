/**
 * TotalAssetsSummaryBar — per-currency totals, always labelled (UX-FN-02).
 *
 * The defect: mixed-currency balances were presented as **one headline figure**
 * — two amounts separated by a divider under a single "Total Assets" heading,
 * with no per-currency label, no account count, and nothing saying whether a
 * conversion had been applied. Adding NGN to USD is arithmetically meaningless,
 * so the UI must never imply it did.
 *
 * Now each currency is its own labelled row with its account count, and when
 * more than one currency is present the card states plainly that no exchange
 * rate is applied. Cross-currency consolidation stays out of scope until an FX
 * provider decision exists (doc 18 §4.6.2) — this component cannot imply a
 * conversion it cannot perform.
 */
import React, { useMemo } from 'react';
import { fromCents } from '../../utils/moneyUtils';
import { formatCurrency } from '../../utils/format';
import type { AnchorAccount, Currency } from '../../types';

interface TotalAssetsSummaryBarProps {
  accounts: AnchorAccount[];
  onShowDetails?: () => void;
}

export const TotalAssetsSummaryBar: React.FC<TotalAssetsSummaryBarProps> = ({ accounts }) => {
  const rows = useMemo(() => {
    const byCurrency: Partial<Record<Currency, { cents: number; count: number }>> = {};
    for (const account of accounts) {
      const entry = byCurrency[account.currency] ?? { cents: 0, count: 0 };
      entry.cents += account.balanceCents;
      entry.count += 1;
      byCurrency[account.currency] = entry;
    }
    return (Object.keys(byCurrency) as Currency[]).map((currency) => ({
      currency,
      ...byCurrency[currency]!,
    }));
  }, [accounts]);

  if (rows.length === 0) return null;

  return (
    <div data-testid="total-assets-bar" className="px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
        Total Assets
      </p>

      <div className="space-y-2">
        {rows.map(({ currency, cents, count }) => (
          <div
            key={currency}
            data-testid={`total-assets-${currency}`}
            className="flex items-baseline justify-between gap-3"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {currency} · {count} {count === 1 ? 'account' : 'accounts'}
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight">
              {formatCurrency(fromCents(cents), currency)}
            </span>
          </div>
        ))}
      </div>

      {rows.length > 1 && (
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500" data-testid="total-assets-fx-note">
          Shown per currency — no exchange rate is applied.
        </p>
      )}
    </div>
  );
};
