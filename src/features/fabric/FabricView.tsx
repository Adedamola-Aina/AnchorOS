import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useApp } from '../../context/AnchorContext';
import { FabricOnboarding } from './FabricOnboarding';
import { FabricInsightCard } from './FabricInsightCard';
import { FabricProactiveQuestionCard } from './FabricProactiveQuestionCard';
import { FabricTodayCard } from './FabricTodayCard';
import { FabricUpcomingCard } from './FabricUpcomingCard';
import { FabricMoodCard } from './FabricMoodCard';
import { FabricPredictionsSection } from './FabricPredictionsSection';
import { FabricQuerySection } from './FabricQuerySection';
import { FabricWeeklySnapshotSection } from './FabricWeeklySnapshotSection';
import { logProductEvent } from '../../services/telemetry';
import { useFabricView } from './useFabricView';

const FabricView: React.FC = () => {
  const { navigateTo } = useApp();
  const {
    isEnabled,
    isReady,
    patterns,
    insights,
    predictions,
    weeklyReport,
    briefing,
    moodToday,
    dismissPrediction,
    generateWeeklyReport,
    saveMood,
    proactiveQuestion,
    markQuestionShown,
    queryResult,
    isQuerying,
    freeText,
    setFreeText,
    questionDismissed,
    setQuestionDismissed,
    inputRef,
    submitPrompt,
    handleAction,
    currency,
  } = useFabricView();

  if (!isEnabled) {
    return (
      <FeatureErrorBoundary featureName="Anchor AI">
        {/* UX-AI-02: a dead end became a doorway — explain the value and link to the switch. */}
        <div className="max-w-3xl mx-auto space-y-4 ">
          <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white">Anchor AI</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Anchor AI is off. Turn it on to get a daily briefing, notice spending patterns, and ask questions
            about your own commitments and accounts.
          </p>
          <Button onClick={() => navigateTo('settings')} className="gap-2">
            Open Settings to enable it
          </Button>
        </div>
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary featureName="Anchor AI">
      <div data-testid="fabric-view" className="max-w-3xl mx-auto space-y-5  animate-in fade-in duration-300">

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

        {proactiveQuestion && !questionDismissed && (
          <FabricProactiveQuestionCard
            question={proactiveQuestion}
            onDismiss={() => {
              setQuestionDismissed(true);
              markQuestionShown(proactiveQuestion);
              try {
                logProductEvent('fabric_proactive_question_dismissed', {
                  questionType: 'proactive',
                });
              } catch { /* telemetry never breaks UI */ }
            }}
            onTap={(q) => {
              inputRef.current?.focus();
              setFreeText(q);
            }}
          />
        )}

        {/* ── Coming up (recurring bills in next 7 days) ──────────────────── */}
        {briefing && briefing.upcoming.length > 0 && (
          <FabricUpcomingCard items={briefing.upcoming} currency={currency} />
        )}

        <FabricPredictionsSection
          predictions={predictions}
          dismissPrediction={dismissPrediction}
          navigateTo={navigateTo}
        />

        {/* ── Insights ────────────────────────────────────────────────────── */}
        {insights.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Insights</p>
            <div className="space-y-2">
              {insights.map((insight) => <FabricInsightCard key={insight.id} insight={insight} />)}
            </div>
          </section>
        )}

        <FabricQuerySection
          freeText={freeText}
          inputRef={inputRef}
          isQuerying={isQuerying}
          queryResult={queryResult}
          onChangeText={setFreeText}
          onSubmitText={() => {
            void submitPrompt(freeText);
            setFreeText('');
          }}
          onPrompt={submitPrompt}
          onGenerateWeeklyReport={() => { void generateWeeklyReport(); }}
          onAction={handleAction}
        />

        <FabricWeeklySnapshotSection
          weeklyReport={weeklyReport}
        />

      </div>
    </FeatureErrorBoundary>
  );
};

export default FabricView;
