import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useFabric } from '../../hooks/useFabric';
import { useApp } from '../../context/AnchorContext';
import { FabricOnboarding } from './FabricOnboarding';
import { FabricPromptChips } from './FabricPromptChips';
import { FabricInsightCard } from './FabricInsightCard';
import type { FabricQueryResult, TabView } from '../../types';

const FabricView: React.FC = () => {
  const navigate = useNavigate();
  const { navigateTo } = useApp();
  const [queryResult, setQueryResult] = useState<FabricQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const {
    isEnabled,
    isReady,
    context,
    patterns,
    insights,
    predictions,
    weeklyReport,
    dismissPrediction,
    runQuery,
    generateWeeklyReport,
  } = useFabric();

  const submitPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setIsQuerying(true);
    setQueryResult(null);
    const result = await runQuery(trimmed);
    setQueryResult(result ?? null);
    setIsQuerying(false);
  };

  const handleAction = (type: string, payload: Record<string, unknown>) => {
    if (type === 'navigate' && typeof payload.page === 'string') {
      navigateTo(payload.page as TabView);
    }
  };

  if (!isEnabled) {
    return (
      <FeatureErrorBoundary featureName="Anchor AI">
        <div className="max-w-3xl mx-auto space-y-4 pb-20">
          <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">Anchor AI</h1>
          <p className="text-slate-600 dark:text-slate-300">Anchor AI is disabled. Enable it in Settings to view your assistant tab.</p>
        </div>
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary featureName="Anchor AI">
      <div className="max-w-3xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">Anchor AI</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {`Good ${context.timeOfDay}. Tracking ${patterns.length} pattern${patterns.length === 1 ? '' : 's'} from your activity.`}
            </p>
          </div>
          <button
            type="button"
            aria-label="Open Anchor AI transparency"
            onClick={() => navigate('/fabric/transparency')}
            className="min-h-11 min-w-[44px] rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            <Settings className="w-4 h-4" />
          </button>
        </header>

        {!isReady || patterns.length === 0 ? <FabricOnboarding /> : null}

        {predictions.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Predictions</p>
            <div className="space-y-2">
              {predictions.map((prediction) => (
                <article key={prediction.id} className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{prediction.message}</p>
                  {prediction.detail ? <p className="text-sm text-slate-600 dark:text-slate-300">{prediction.detail}</p> : null}
                  <button
                    type="button"
                    onClick={() => dismissPrediction(prediction.id)}
                    className="min-h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200"
                  >
                    Dismiss prediction
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {insights.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Insights</p>
            <div className="space-y-2">
              {insights.map((insight) => <FabricInsightCard key={insight.id} insight={insight} />)}
            </div>
          </section>
        )}

        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Quick actions</p>
          <FabricPromptChips onPrompt={submitPrompt} />
        </section>

        {(isQuerying || queryResult) && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Response</p>
            {isQuerying ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Thinking…</p>
              </div>
            ) : queryResult ? (
              <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{queryResult.summary}</p>
                {queryResult.detail && (
                  <p className="text-sm text-slate-600 dark:text-slate-300">{queryResult.detail}</p>
                )}
                {queryResult.actions && queryResult.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {queryResult.actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => handleAction(action.type, action.payload)}
                        className="min-h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ) : null}
          </section>
        )}

        <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => { void generateWeeklyReport(); }}
              className="min-h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Generate weekly report
            </button>
          </div>
          {weeklyReport && (
            <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Snapshot</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {`Income: $${weeklyReport.financeSummary.totalIncome.toFixed(2)} · Spent: $${weeklyReport.financeSummary.totalSpent.toFixed(2)} · Commitment completion: ${weeklyReport.commitmentSummary.completionRate}%`}
              </p>
            </article>
          )}
        </section>
      </div>
    </FeatureErrorBoundary>
  );
};

export default FabricView;
