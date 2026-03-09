import React from 'react';
import type { Insight } from '../../types';

interface FabricInsightCardProps {
  insight: Insight;
  onDismiss?: (id: string) => void;
}

const TREND_ICON: Record<Insight['trend'], string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

export const FabricInsightCard: React.FC<FabricInsightCardProps> = ({ insight, onDismiss }) => {
  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{insight.headline}</p>
        <span className="text-xs text-slate-500 dark:text-slate-400" aria-hidden="true">{TREND_ICON[insight.trend]}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{insight.detail}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={() => onDismiss(insight.id)}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          Dismiss
        </button>
      )}
    </article>
  );
};
