/**
 * DashboardView - Central intelligence hub showing wealth, activity, and focus
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Widget components extracted to DashboardWidgets.tsx
 */
// @ts-nocheck


import { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useHaptic } from '../../hooks/useHaptic';
import { useFabric } from '../../hooks/useFabric';
import { FabricMoodCard } from '../fabric/FabricMoodCard';
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
  const { profile, user } = useAuth();
  const { tasks } = useTasks();
  const { accounts, recentActivity, cashFlow, refetch } = useFinance();
  const { isMobile } = useResponsive();
  // UX-AI-04/UX-AI-09: the mood check-in lives on Home, not inside the
  // assistant, and Home is also the doorway to the assistant now that it is no
  // longer a nav destination.
  const { isEnabled: anchorAIEnabled, moodToday, saveMood } = useFabric();
  const haptic = useHaptic();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const beyondBasics = useBeyondBasics();
  const { data: goals = [], isLoading: goalsLoading } = useGoalsQuery(user?.uid);

  const productivity = getProductivityMetrics(tasks);
  const hasCommitments = tasks.length > 0;
  const todaysPriorities = tasks.filter(t => t.type === 'daily' && !t.completed).slice(0, 3);
  const assets = getAssetDistribution(accounts);
  const totals = getPortfolioTotals(accounts);
  const primaryCurrency: Currency = accounts.length > 0 ? (accounts[0].currency as Currency) : 'NGN';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    haptic.trigger('light');
    await refetch();
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors min-h-[36px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Getting Started</span>
                <span className="ml-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {beyondBasics.totalCount - beyondBasics.completedCount}
                </span>
              </button>
            )}
            {/*
              * UX-GL-02: the dashboard gear is gone. Settings has exactly ONE
              * entry point (the nav), and any contextual "manage X" need from
              * Home must deep-link into the relevant Settings *section* rather
              * than to the Settings root.
              *
              * UX-AI-09: this slot now carries the doorway to the assistant,
              * which is no longer a nav destination — "Anchor belongs inside
              * Home, not in the bar" (doc 20 §4.1).
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
            <TodaysFocusWidget priorities={todaysPriorities} onNavigate={() => navigateTo('commitments')} />
          </div>
        </div>

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
