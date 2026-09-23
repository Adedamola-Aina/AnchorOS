/**
 * DashboardView - Central intelligence hub showing wealth, activity, and focus
 * Refactored.
 * Widget components extracted to DashboardWidgets.tsx
 */
// @ts-nocheck


import { useState, useMemo } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useHaptic } from '../../hooks/useHaptic';
import { useFabric } from '../../hooks/useFabric';
import { FabricMoodCard } from '../fabric/FabricMoodCard';
import { HomeTodaySection } from './components/HomeTodaySection';
import { HomeInsightCard } from './components/HomeInsightCard';
import { AskAnchorRow } from './components/AskAnchorRow';
import { selectTodayCommitments, selectTodayAlerts } from '../../services/fabric/todayCommitments';
import { selectHomeInsight } from '../../services/fabric/insights/homeInsight';
import { getAssetDistribution, getPortfolioTotals } from '../../utils/financeInsights';
import { getProductivityMetrics } from '../../utils/taskInsights';
import { AssetAllocationWidget } from './components/AssetAllocationWidget';
import { PortfolioWidget, CashFlowWidget, RecentActivityWidget, ProductivityWidget, TodaysFocusWidget } from './components/DashboardWidgets';
import type { Currency } from '../../types';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { PullToRefresh } from '../../components/mobile/PullToRefresh';
import { BeyondBasicsChecklist } from './components/BeyondBasicsChecklist';
import { useBeyondBasics } from './hooks/useBeyondBasics';
import { GoalProgressCard } from './components/GoalProgressCard';
import { useGoalsQuery } from '../../hooks/queries/useGoalsQuery';

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardView = () => {
  const { navigateTo } = useApp();
  /**
   * Deep links from an insight or an alert are paths ("/commitments"). The app's own
   * `navigateTo` is the single navigation abstraction — Home does not reach for the raw
   * router, so a section of Home cannot drift into navigating somewhere unexpected.
   */
  const goTo = (path: string) => navigateTo((path.replace(/^\//, '').split('/')[0] || 'dashboard') as never);
  const { profile, user, updateProfile } = useAuth();
  const { tasks } = useTasks();
  const { accounts, recentActivity, cashFlow, refetch } = useFinance();
  const { isMobile } = useResponsive();
  // UX-AI-04/UX-AI-09: the mood check-in lives on Home, not inside the
  // assistant, and Home is also the doorway to the assistant now that it is no
  // longer a nav destination.
  //
  // The substance comes with it: Home renders the assistant's briefing and its
  // top insights in place, so the dashboard *shows* what the assistant knows
  // rather than only linking to a page that does.
  const {
    isEnabled: anchorAIEnabled,
    moodToday,
    saveMood,
    briefing,
    insights: anchorInsights,
  } = useFabric();
  const haptic = useHaptic();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const beyondBasics = useBeyondBasics();
  /**
   * CM-30: one clock for the whole page, refreshed when the user pulls to refresh, so the
   * brief, the focus shortlist and the insight all agree about what "today" is.
   */
  const [now, setNow] = useState(() => new Date());
  /** Dismissals are session-scoped; remembering them across devices needs a profile field. */
  const [dismissedInsightIds, setDismissedInsightIds] = useState<string[]>([]);

  /**
   * UX-OB-05: the acknowledgement is dismissed deliberately and remembered, so
   * it neither vanishes on its own nor reappears on every visit.
   */
  const dismissGettingStarted = () => {
    haptic.trigger('light');
    void updateProfile({
      onboardingProgress: {
        gettingStartedStep: profile.onboardingProgress?.gettingStartedStep ?? 5,
        securityStepSeen: profile.onboardingProgress?.securityStepSeen ?? true,
        beyondBasicsComplete: true,
        completedItems: profile.onboardingProgress?.completedItems ?? [],
      },
    });
  };
  const { data: goals = [], isLoading: goalsLoading } = useGoalsQuery(user?.uid);

  const productivity = getProductivityMetrics(tasks);
  const hasCommitments = tasks.length > 0;
  /**
   * CM-30: the canonical "today", used by the brief, the focus shortlist and the insight
   * — and by the assistant's own briefing, so Home and Ask Anchor cannot disagree.
   */
  const today = useMemo(() => selectTodayCommitments(tasks, now), [tasks, now]);
  /**
   * The interpretation layer. Deterministic readings first, then the assistant's own
   * insights when it is enabled — and nothing at all when neither has anything to say.
   */
  const insight = useMemo(() => selectHomeInsight({
    today,
    insights: anchorAIEnabled ? anchorInsights : null,
    dismissedIds: dismissedInsightIds,
    now,
  }), [today, anchorAIEnabled, anchorInsights, dismissedInsightIds, now]);
  /** Alerts stand down when the insight already made the same point. */
  const alerts = useMemo(() => selectTodayAlerts(today, { shownInsightId: insight?.id ?? null }), [today, insight]);
  const assets = getAssetDistribution(accounts);
  const totals = getPortfolioTotals(accounts);
  const primaryCurrency: Currency = accounts.length > 0 ? (accounts[0].currency as Currency) : 'NGN';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    haptic.trigger('light');
    await refetch();
    setNow(new Date());
    haptic.trigger('success');
    setIsRefreshing(false);
  };

  const dashboardContent = (
    <FeatureErrorBoundary featureName="Dashboard">
      <div className={`animate-in fade-in slide-in-from-bottom-8 duration-500 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        <div className="flex items-center justify-between gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="min-w-0 flex-1">
            <p
              className="text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 truncate"
              title={profile.name ? `${getTimeGreeting()}, ${profile.name}` : getTimeGreeting()}
              data-testid="dashboard-greeting"
            >
              {profile.name ? `${getTimeGreeting()}, ${profile.name}` : getTimeGreeting()}
            </p>
            {/* UX-DB-06: the subtitle carries information instead of filler. */}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!beyondBasics.allComplete && (
              <button
                type="button"
                onClick={() => { haptic.trigger('light'); setChecklistOpen(true); }}
                data-testid="getting-started-pill"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-info-surface text-info border border-info-border text-xs font-semibold hover:opacity-90 transition-colors min-h-[36px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Getting Started</span>
                <span className="ml-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {beyondBasics.totalCount - beyondBasics.completedCount}
                </span>
              </button>
            )}
            {/*
              UX-OB-05: finishing used to be silent — the pill simply disappeared
              at 100%. It now acknowledges the work and stays until dismissed, so
              completion is stated rather than inferred from an absence.
            */}
            {beyondBasics.allComplete && !beyondBasics.acknowledged && (
              <div
                data-testid="getting-started-complete"
                role="status"
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-pill bg-success-surface text-success border border-success-border text-xs font-semibold min-h-[36px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Getting Started — all {beyondBasics.totalCount} done</span>
                <button
                  type="button"
                  onClick={dismissGettingStarted}
                  aria-label="Dismiss the getting started acknowledgement"
                  className="ml-1 w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
            {/*
              * UX-GL-02: the dashboard gear is gone. Settings has exactly ONE
              * entry point (the nav), and any contextual "manage X" need from
              * Home must deep-link into the relevant Settings *section* rather
              * than to the Settings root.
              *
              * UX-AI-09: this slot now carries the doorway to the assistant,
              * which is no longer a nav destination — "Anchor belongs inside
              * Home, not in the bar".
              */}
            {anchorAIEnabled && (
              <button
                type="button"
                onClick={() => { haptic.trigger('light'); navigateTo('fabric'); }}
                data-testid="ask-anchor-doorway"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors min-h-[36px]"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ask Anchor</span>
              </button>
            )}
          </div>
        </div>

        {/*
          * CM-30: the top of Home answers "what is happening", "what matters" and "what
          * next" — deterministic first (Today), interpretation second (the insight),
          * then anything genuinely actionable. Conversation is one row at the bottom,
          * not the price of admission.
          */}
        <HomeTodaySection
          today={today}
          trackedCommitments={tasks.length}
          nextDueLabel={briefing?.todayStats?.nextDueLabel}
          onOpenCommitments={() => navigateTo('commitments')}
        />

        {alerts.length > 0 && (
          <section aria-labelledby="home-alerts-heading" data-testid="home-alerts" className="space-y-2">
            <h2 id="home-alerts-heading" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Needs attention
            </h2>
            {alerts.map((alert) => (
              <div key={alert.id} data-testid={`home-alert-${alert.id}`} className="rounded-xl border border-warning-border bg-warning-surface p-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{alert.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{alert.detail}</p>
                <button
                  type="button"
                  onClick={() => goTo(alert.href)}
                  className="mt-2 inline-flex items-center min-h-11 text-xs font-semibold text-primary-700 dark:text-primary-400"
                >
                  {alert.actionLabel}
                </button>
              </div>
            ))}
          </section>
        )}

        {insight && (
          <HomeInsightCard
            insight={insight}
            onAction={goTo}
            onDismiss={(id) => setDismissedInsightIds((ids) => [...ids, id])}
          />
        )}

        <BeyondBasicsChecklist
          items={beyondBasics.items}
          completedCount={beyondBasics.completedCount}
          totalCount={beyondBasics.totalCount}
          isOpen={checklistOpen}
          onClose={() => setChecklistOpen(false)}
          onItemClick={(item) => {
            setChecklistOpen(false);
            navigateTo(item.route.tab, item.route.params);
          }}
        />

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${isMobile ? 'gap-3' : 'gap-5'} ${isRefreshing ? 'opacity-60' : ''}`}>
          {/* Column 1: Wealth */}
          <div className="space-y-5">
            <PortfolioWidget totals={totals} onNavigate={() => navigateTo('finance')} accountCount={accounts.length} isMobile={isMobile} />
            {accounts.length > 1 && <AssetAllocationWidget assets={assets} />}
            <GoalProgressCard goals={goals} isLoading={goalsLoading} />
          </div>

          {/* Column 2: Activity */}
          <div className="space-y-5">
            <CashFlowWidget cashFlow={cashFlow} currency={primaryCurrency} onNavigate={() => navigateTo('finance')} />
            <RecentActivityWidget activity={recentActivity} onNavigate={() => navigateTo('finance')} />
          </div>

          {/* Column 3: Focus */}
          <div className="space-y-5">
            <ProductivityWidget productivity={productivity} hasCommitments={hasCommitments} onNavigate={() => navigateTo('commitments')} />
            <TodaysFocusWidget priorities={today.focus} remaining={today.remaining} onNavigate={() => navigateTo('commitments')} />
          </div>
        </div>

        {/*
          * CM-30: the conversational entry point, at the bottom where a deeper question
          * belongs — after the dashboard has already told the user what it knows. Hidden
          * entirely when Anchor AI is off rather than nagging to be switched back on.
          */}
        {anchorAIEnabled && (
          <AskAnchorRow onOpenAssistant={() => { haptic.trigger('light'); navigateTo('fabric'); }} />
        )}

        {/*
          * UX-AI-04 / UX-AI-09: the mood check-in used to be the first
          * interactive block *inside* the assistant. Mood is not an AI feature,
          * so it relocates to the bottom of Home — adjacent to the assistant,
          * deliberately not part of it (doc 18 §4.3 item 5, matching Tiimo).
          */}
        {anchorAIEnabled && (
          <div data-testid="home-mood-section">
            <FabricMoodCard moodToday={moodToday} onSave={saveMood} />
          </div>
        )}
      </div>
    </FeatureErrorBoundary>
  );

  // Wrap with PullToRefresh on mobile
  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
        {dashboardContent}
      </PullToRefresh>
    );
  }

  return dashboardContent;
};

export default DashboardView;
