/**
 * DashboardView - Central intelligence hub showing wealth, activity, and focus
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Widget components extracted to DashboardWidgets.tsx
 */

import { useState } from 'react';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useHaptic } from '../../hooks/useHaptic';
import { SectionHeader } from '../../components/shared';
import { getAssetDistribution } from '../../utils/financeInsights';
import { getProductivityMetrics } from '../../utils/taskInsights';
import { AssetAllocationWidget } from './components/AssetAllocationWidget';
import { PortfolioWidget, CashFlowWidget, RecentActivityWidget, ProductivityWidget, TodaysFocusWidget } from './components/DashboardWidgets';
import type { Currency } from '../../types';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { PullToRefresh } from '../../components/mobile/PullToRefresh';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      <div className={`animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        <SectionHeader title={`${getTimeGreeting()}, ${profile.name}`} subtitle="Life at a glance." />

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
