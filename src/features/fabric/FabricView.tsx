import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useFabric } from '../../hooks/useFabric';
import { useApp } from '../../context/AnchorContext';
import { FabricOnboarding } from './FabricOnboarding';
import { FabricPromptChips } from './FabricPromptChips';
import { FabricInsightCard } from './FabricInsightCard';
import { FabricTodayCard } from './FabricTodayCard';
import { FabricUpcomingCard } from './FabricUpcomingCard';
import { FabricMoodCard } from './FabricMoodCard';
import { formatCents } from '../../services/fabric/fabricUtils';
import type { FabricQueryResult, TabView } from '../../types';
import type { Currency } from '../../services/fabric/fabricUtils';

const FabricView: React.FC = () => {
  const { navigateTo } = useApp();
  const [queryResult, setQueryResult] = useState<FabricQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [freeText, setFreeText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isEnabled,
    isReady,
    patterns,
    insights,
    predictions,
    weeklyReport,
    briefing,
    moodToday,
    learnFrom,
    dismissPrediction,
    runQuery,
    generateWeeklyReport,
    saveMood,
  } = useFabric();

  useEffect(() => {
    learnFrom({ type: 'page_visited', page: 'fabric' }, { type: 'view_page', page: 'fabric' });
  }, [learnFrom]);

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

  const currency = (briefing?.currency ?? 'USD') as Currency;

  return (
    <FeatureErrorBoundary featureName="Anchor AI">
      <div className="max-w-3xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">Anchor AI</h1>
          </div>
          {briefing?.subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 pl-7">{briefing.subtitle}</p>
          )}
        </header>

        {/* ── Onboarding (first-time only) ────────────────────────────────── */}
        {(!isReady || patterns.length === 0) && <FabricOnboarding />}

        {/* ── Today's tasks ───────────────────────────────────────────────── */}
        {briefing && (
          <FabricTodayCard
            todayStats={briefing.todayStats}
            onOpenCommitments={() => navigateTo('commitments')}
          />
        )}

        {/* ── Mood check-in ────────────────────────────────────────────────── */}
        <FabricMoodCard moodToday={moodToday} onSave={saveMood} />

        {/* ── Coming up (recurring bills in next 7 days) ──────────────────── */}
        {briefing && briefing.upcoming.length > 0 && (
          <FabricUpcomingCard items={briefing.upcoming} currency={currency} />
        )}

        {/* ── Predictions (time-sensitive alerts) ─────────────────────────── */}
        {predictions.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Alerts</p>
            <div className="space-y-2">
              {predictions.map((prediction) => (
                <article key={prediction.id} className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{prediction.message}</p>
                  {prediction.detail && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">{prediction.detail}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {prediction.action?.navigateTo && (
                      <button
                        type="button"
                        onClick={() => {
                          const page = prediction.action!.navigateTo!.replace('/', '') as TabView;
                          navigateTo(page);
                        }}
                        className="min-h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        {prediction.action.label}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => dismissPrediction(prediction.id)}
                      className="min-h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Insights ────────────────────────────────────────────────────── */}
        {insights.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Insights</p>
            <div className="space-y-2">
              {insights.map((insight) => <FabricInsightCard key={insight.id} insight={insight} />)}
            </div>
          </section>
        )}

        {/* ── Ask Anchor AI ────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Ask Anchor AI</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitPrompt(freeText);
              setFreeText('');
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="What do I have today? Plan my week…"
              className="flex-1 min-h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!freeText.trim() || isQuerying}
              aria-label="Send"
              className="min-h-11 min-w-[44px] flex items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <FabricPromptChips onPrompt={submitPrompt} />
        </section>

        {/* ── Query response ───────────────────────────────────────────────── */}
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
                  <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{queryResult.detail}</p>
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

        {/* ── Weekly snapshot ──────────────────────────────────────────────── */}
        <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => { void generateWeeklyReport(); }}
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

      </div>
    </FeatureErrorBoundary>
  );
};

export default FabricView;
