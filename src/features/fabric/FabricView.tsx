import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useFabric } from '../../hooks/useFabric';
import { FabricOnboarding } from './FabricOnboarding';
import { FabricPromptChips } from './FabricPromptChips';
import { FabricInsightCard } from './FabricInsightCard';

const FabricView: React.FC = () => {
  const navigate = useNavigate();
  const {
    isEnabled,
    isReady,
    context,
    patterns,
    insights,
    predictions,
    lastQueryResult,
    weeklyReport,
    dismissPrediction,
    runQuery,
    generateWeeklyReport,
  } = useFabric();
  const [input, setInput] = React.useState('');

  const submitPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    await runQuery(trimmed);
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Built from your own commitments and finance history.</p>
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

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Daily briefing</p>
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
            {`Good ${context.timeOfDay}. I currently know ${patterns.length} pattern${patterns.length === 1 ? '' : 's'} from your activity.`}
          </p>
        </section>

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
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Try asking with one tap</p>
          <FabricPromptChips onPrompt={submitPrompt} />
        </section>

        <section className="space-y-2">
          <label htmlFor="fabric-query" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Ask Anchor AI</label>
          <div className="flex gap-2">
            <input
              id="fabric-query"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="How much did I spend this month?"
              className="flex-1 min-h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => { void submitPrompt(input); setInput(''); }}
              className="min-h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium"
            >
              Ask
            </button>
          </div>
          {lastQueryResult && (
            <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{lastQueryResult.summary}</p>
              {lastQueryResult.detail ? <p className="text-sm text-slate-600 dark:text-slate-300">{lastQueryResult.detail}</p> : null}
            </article>
          )}
        </section>

        <section className="space-y-2">
          <button
            type="button"
            onClick={() => { void generateWeeklyReport(); }}
            className="min-h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium"
          >
            Generate weekly report
          </button>
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
