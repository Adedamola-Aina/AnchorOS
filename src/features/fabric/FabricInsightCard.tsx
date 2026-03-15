import React, { useEffect } from 'react';
import type { Insight } from '../../types';
import { logProductEvent } from '../../services/telemetry';

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
  useEffect(() => {
    try {
      logProductEvent('fabric_insight_viewed', {
        insightId: insight.id,
        category: insight.category,
        severity: insight.severity,
      });
    } catch { /* telemetry must never break the UI */ }
  }, [insight.id, insight.category, insight.severity]);

  const handleDismiss = () => {
    try {
      logProductEvent('fabric_insight_dismissed', {
        insightId: insight.id,
        category: insight.category,
      });
    } catch { /* telemetry must never break the UI */ }
    onDismiss?.(insight.id);
  };

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
          onClick={handleDismiss}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          Dismiss
        </button>
      )}
    </article>
  );
};
