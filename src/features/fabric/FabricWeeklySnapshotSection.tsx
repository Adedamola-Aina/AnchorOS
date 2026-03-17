import { formatCents } from '../../services/fabric/fabricUtils';
import type { WeeklyReport } from '../../types';
import type { Currency } from '../../services/fabric/fabricUtils';

interface FabricWeeklySnapshotSectionProps {
  weeklyReport: WeeklyReport | null;
  onGenerate: () => void;
}

export function FabricWeeklySnapshotSection({ weeklyReport, onGenerate }: FabricWeeklySnapshotSectionProps) {
  return (
    <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      <button
        type="button"
        onClick={onGenerate}
        className="min-h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300"
      >
        Generate weekly report
      </button>
      {weeklyReport && (
        <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Snapshot</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {(() => {
              const cur = (weeklyReport.currency ?? 'USD') as Currency;
              const income = formatCents(Math.round(weeklyReport.financeSummary.totalIncome * 100), cur);
              const spent = formatCents(Math.round(weeklyReport.financeSummary.totalSpent * 100), cur);
              return `Income: ${income} · Spent: ${spent} · Commitments: ${weeklyReport.commitmentSummary.completionRate}%`;
            })()}
          </p>
        </article>
      )}
    </section>
  );
}
