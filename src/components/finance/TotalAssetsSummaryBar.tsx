/**
 * TotalAssetsSummaryBar — Zone 2 of the finance page.
 * Shows aggregated balances across all accounts, abbreviated.
 * UX-041 Phase 2 §3.2.
 */
import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { fromCents } from '../../utils/moneyUtils';
import { formatCurrencyCompact } from '../../utils/format';
import type { AnchorAccount, Currency } from '../../types';

interface TotalAssetsSummaryBarProps {
  accounts: AnchorAccount[];
  onShowDetails?: () => void;
}

export const TotalAssetsSummaryBar: React.FC<TotalAssetsSummaryBarProps> = ({ accounts, onShowDetails }) => {
  const totals = useMemo(() => {
    const byC: Partial<Record<Currency, number>> = {};
    for (const a of accounts) {
      byC[a.currency] = (byC[a.currency] ?? 0) + a.balanceCents;
    }
    return byC;
  }, [accounts]);

  const usdTotal = totals.USD ? fromCents(totals.USD) : null;
  const ngnTotal = totals.NGN ? fromCents(totals.NGN) : null;

  if (usdTotal === null && ngnTotal === null) return null;

  return (
    <div
      data-testid="total-assets-bar"
      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
        <span className="text-sm text-slate-500 dark:text-slate-400 opacity-60">
          Total Assets
        </span>
        <div className="flex flex-wrap items-baseline gap-1 text-base font-semibold text-slate-800 dark:text-slate-100">
          {usdTotal !== null && (
            <span>~{formatCurrencyCompact(usdTotal, 'USD', { forceCompact: true })}</span>
          )}
          {usdTotal !== null && ngnTotal !== null && (
            <span className="text-slate-400 dark:text-slate-500 mx-1">|</span>
          )}
          {ngnTotal !== null && (
            <span>~{formatCurrencyCompact(ngnTotal, 'NGN', { forceCompact: true })}</span>
          )}
        </div>
      </div>
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors min-h-[44px]"
        onClick={() => {
          // TODO: wire Show Details navigation
          onShowDetails?.();
        }}
      >
        Show Details
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
