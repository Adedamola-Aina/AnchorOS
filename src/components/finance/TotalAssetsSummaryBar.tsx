/**
 * TotalAssetsSummaryBar — Apple-inspired total assets card.
 * Large hero typography for primary currency, secondary currency below.
 * UX-041 Phase 2 §3.2.
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
  const totals = useMemo(() => {
    const byC: Partial<Record<Currency, number>> = {};
    for (const a of accounts) {
      byC[a.currency] = (byC[a.currency] ?? 0) + a.balanceCents;
    }
    return byC;
  }, [accounts]);

  const usdTotal = totals.USD != null ? fromCents(totals.USD) : null;
  const ngnTotal = totals.NGN != null ? fromCents(totals.NGN) : null;

  if (usdTotal === null && ngnTotal === null) return null;

  // Primary = NGN if present, else USD
  const primaryCurrency: Currency = ngnTotal !== null ? 'NGN' : 'USD';
  const primaryAmount = primaryCurrency === 'NGN' ? ngnTotal! : usdTotal!;
  const secondaryCurrency: Currency | null =
    ngnTotal !== null && usdTotal !== null ? 'USD' : null;
  const secondaryAmount = secondaryCurrency ? usdTotal! : null;

  const hasBoth = secondaryCurrency !== null && secondaryAmount !== null;

  return (
    <div
      data-testid="total-assets-bar"
      className="px-4 py-4"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
        Total Assets
      </p>
      {hasBoth ? (
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight">
              {formatCurrency(primaryAmount, primaryCurrency)}
            </p>
          </div>
          <div className="w-px self-stretch bg-slate-200 dark:bg-slate-700" />
          <div className="min-w-0">
            <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight">
              {formatCurrency(secondaryAmount, secondaryCurrency)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight">
          {formatCurrency(primaryAmount, primaryCurrency)}
        </p>
      )}
    </div>
  );
};
