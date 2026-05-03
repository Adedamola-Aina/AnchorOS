/**
 * DashboardView - Central intelligence hub showing wealth, activity, and focus
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Widget components extracted to DashboardWidgets.tsx
 */
// @ts-nocheck


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useHaptic } from '../../hooks/useHaptic';
import { getAssetDistribution } from '../../utils/financeInsights';
import { getProductivityMetrics } from '../../utils/taskInsights';
import { AssetAllocationWidget } from './components/AssetAllocationWidget';
import { PortfolioWidget, CashFlowWidget, RecentActivityWidget, ProductivityWidget, TodaysFocusWidget } from './components/DashboardWidgets';
import type { Currency } from '../../types';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { PullToRefresh } from '../../components/mobile/PullToRefresh';
import { BeyondBasicsChecklist } from './components/BeyondBasicsChecklist';
import { useBeyondBasics } from './hooks/useBeyondBasics';

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardView = () => {
  const { navigateTo } = useApp();
  const { profile } = useAuth();
  const { tasks } = useTasks();
  const { accounts, recentActivity, cashFlow, refetch } = useFinance();
  const { isMobile } = useResponsive();
  const haptic = useHaptic();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const beyondBasics = useBeyondBasics();

  const productivity = getProductivityMetrics(tasks);
  const hasCommitments = tasks.length > 0;
  const todaysPriorities = tasks.filter(t => t.type === 'daily' && !t.completed).slice(0, 3);
  const assets = getAssetDistribution(accounts);
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
              title={`${getTimeGreeting()}, ${profile.name}`}
              data-testid="dashboard-greeting"
            >
              {getTimeGreeting()}, {profile.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Life at a glance.</p>
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
            <button
              type="button"
              onClick={() => { haptic.trigger('light'); navigate('/settings'); }}
              aria-label="Settings"
              data-testid="settings-pill"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
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
            <PortfolioWidget assets={assets} onNavigate={() => navigateTo('finance')} accountCount={accounts.length} isMobile={isMobile} />
            {accounts.length > 1 && <AssetAllocationWidget assets={assets} />}
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
