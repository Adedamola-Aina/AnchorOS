/**
 * DashboardView - Central intelligence hub showing wealth, activity, and focus
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Widget components extracted to DashboardWidgets.tsx
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
  if (stryMutAct_9fa48("2956")) {
    {}
  } else {
    stryCov_9fa48("2956");
    const hour = new Date().getHours();
    if (stryMutAct_9fa48("2960") ? hour >= 12 : stryMutAct_9fa48("2959") ? hour <= 12 : stryMutAct_9fa48("2958") ? false : stryMutAct_9fa48("2957") ? true : (stryCov_9fa48("2957", "2958", "2959", "2960"), hour < 12)) return stryMutAct_9fa48("2961") ? "" : (stryCov_9fa48("2961"), 'Good morning');
    if (stryMutAct_9fa48("2965") ? hour >= 18 : stryMutAct_9fa48("2964") ? hour <= 18 : stryMutAct_9fa48("2963") ? false : stryMutAct_9fa48("2962") ? true : (stryCov_9fa48("2962", "2963", "2964", "2965"), hour < 18)) return stryMutAct_9fa48("2966") ? "" : (stryCov_9fa48("2966"), 'Good afternoon');
    return stryMutAct_9fa48("2967") ? "" : (stryCov_9fa48("2967"), 'Good evening');
  }
};
const DashboardView = () => {
  if (stryMutAct_9fa48("2968")) {
    {}
  } else {
    stryCov_9fa48("2968");
    const {
      navigateTo
    } = useApp();
    const {
      profile
    } = useAuth();
    const {
      tasks
    } = useTasks();
    const {
      accounts,
      recentActivity,
      cashFlow,
      refetch
    } = useFinance();
    const {
      isMobile
    } = useResponsive();
    const haptic = useHaptic();
    const [isRefreshing, setIsRefreshing] = useState(stryMutAct_9fa48("2969") ? true : (stryCov_9fa48("2969"), false));
    const productivity = getProductivityMetrics(tasks);
    const hasCommitments = stryMutAct_9fa48("2973") ? tasks.length <= 0 : stryMutAct_9fa48("2972") ? tasks.length >= 0 : stryMutAct_9fa48("2971") ? false : stryMutAct_9fa48("2970") ? true : (stryCov_9fa48("2970", "2971", "2972", "2973"), tasks.length > 0);
    const todaysPriorities = stryMutAct_9fa48("2975") ? tasks.slice(0, 3) : stryMutAct_9fa48("2974") ? tasks.filter(t => t.type === 'daily' && !t.completed) : (stryCov_9fa48("2974", "2975"), tasks.filter(stryMutAct_9fa48("2976") ? () => undefined : (stryCov_9fa48("2976"), t => stryMutAct_9fa48("2979") ? t.type === 'daily' || !t.completed : stryMutAct_9fa48("2978") ? false : stryMutAct_9fa48("2977") ? true : (stryCov_9fa48("2977", "2978", "2979"), (stryMutAct_9fa48("2981") ? t.type !== 'daily' : stryMutAct_9fa48("2980") ? true : (stryCov_9fa48("2980", "2981"), t.type === (stryMutAct_9fa48("2982") ? "" : (stryCov_9fa48("2982"), 'daily')))) && (stryMutAct_9fa48("2983") ? t.completed : (stryCov_9fa48("2983"), !t.completed))))).slice(0, 3));
    const assets = getAssetDistribution(accounts);
    const primaryCurrency: Currency = (stryMutAct_9fa48("2987") ? accounts.length <= 0 : stryMutAct_9fa48("2986") ? accounts.length >= 0 : stryMutAct_9fa48("2985") ? false : stryMutAct_9fa48("2984") ? true : (stryCov_9fa48("2984", "2985", "2986", "2987"), accounts.length > 0)) ? accounts[0].currency as Currency : stryMutAct_9fa48("2988") ? "" : (stryCov_9fa48("2988"), 'NGN');
    const handleRefresh = async () => {
      if (stryMutAct_9fa48("2989")) {
        {}
      } else {
        stryCov_9fa48("2989");
        setIsRefreshing(stryMutAct_9fa48("2990") ? false : (stryCov_9fa48("2990"), true));
        haptic.trigger(stryMutAct_9fa48("2991") ? "" : (stryCov_9fa48("2991"), 'light'));
        await refetch();
        haptic.trigger(stryMutAct_9fa48("2992") ? "" : (stryCov_9fa48("2992"), 'success'));
        setIsRefreshing(stryMutAct_9fa48("2993") ? true : (stryCov_9fa48("2993"), false));
      }
    };
    const dashboardContent = <FeatureErrorBoundary featureName="Dashboard">
      <div className={stryMutAct_9fa48("2994") ? `` : (stryCov_9fa48("2994"), `animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20 ${isMobile ? stryMutAct_9fa48("2995") ? "" : (stryCov_9fa48("2995"), 'space-y-4') : stryMutAct_9fa48("2996") ? "" : (stryCov_9fa48("2996"), 'space-y-6')}`)}>
        <SectionHeader title={stryMutAct_9fa48("2997") ? `` : (stryCov_9fa48("2997"), `${getTimeGreeting()}, ${profile.name}`)} subtitle="Life at a glance." />

        <div className={stryMutAct_9fa48("2998") ? `` : (stryCov_9fa48("2998"), `grid grid-cols-1 lg:grid-cols-3 ${isMobile ? stryMutAct_9fa48("2999") ? "" : (stryCov_9fa48("2999"), 'gap-3') : stryMutAct_9fa48("3000") ? "" : (stryCov_9fa48("3000"), 'gap-5')} ${isRefreshing ? stryMutAct_9fa48("3001") ? "" : (stryCov_9fa48("3001"), 'opacity-60') : stryMutAct_9fa48("3002") ? "Stryker was here!" : (stryCov_9fa48("3002"), '')}`)}>
          {/* Column 1: Wealth */}
          <div className="space-y-5">
            <PortfolioWidget assets={assets} onNavigate={stryMutAct_9fa48("3003") ? () => undefined : (stryCov_9fa48("3003"), () => navigateTo(stryMutAct_9fa48("3004") ? "" : (stryCov_9fa48("3004"), 'finance')))} accountCount={accounts.length} isMobile={isMobile} />
            {stryMutAct_9fa48("3007") ? accounts.length > 1 || <AssetAllocationWidget assets={assets} /> : stryMutAct_9fa48("3006") ? false : stryMutAct_9fa48("3005") ? true : (stryCov_9fa48("3005", "3006", "3007"), (stryMutAct_9fa48("3010") ? accounts.length <= 1 : stryMutAct_9fa48("3009") ? accounts.length >= 1 : stryMutAct_9fa48("3008") ? true : (stryCov_9fa48("3008", "3009", "3010"), accounts.length > 1)) && <AssetAllocationWidget assets={assets} />)}
          </div>

          {/* Column 2: Activity */}
          <div className="space-y-5">
            <CashFlowWidget cashFlow={cashFlow} currency={primaryCurrency} onNavigate={stryMutAct_9fa48("3011") ? () => undefined : (stryCov_9fa48("3011"), () => navigateTo(stryMutAct_9fa48("3012") ? "" : (stryCov_9fa48("3012"), 'finance')))} />
            <RecentActivityWidget activity={recentActivity} onNavigate={stryMutAct_9fa48("3013") ? () => undefined : (stryCov_9fa48("3013"), () => navigateTo(stryMutAct_9fa48("3014") ? "" : (stryCov_9fa48("3014"), 'finance')))} />
          </div>

          {/* Column 3: Focus */}
          <div className="space-y-5">
            <ProductivityWidget productivity={productivity} hasCommitments={hasCommitments} onNavigate={stryMutAct_9fa48("3015") ? () => undefined : (stryCov_9fa48("3015"), () => navigateTo(stryMutAct_9fa48("3016") ? "" : (stryCov_9fa48("3016"), 'commitments')))} />
            <TodaysFocusWidget priorities={todaysPriorities} onNavigate={stryMutAct_9fa48("3017") ? () => undefined : (stryCov_9fa48("3017"), () => navigateTo(stryMutAct_9fa48("3018") ? "" : (stryCov_9fa48("3018"), 'commitments')))} />
          </div>
        </div>
      </div>
    </FeatureErrorBoundary>;

    // Wrap with PullToRefresh on mobile
    if (stryMutAct_9fa48("3020") ? false : stryMutAct_9fa48("3019") ? true : (stryCov_9fa48("3019", "3020"), isMobile)) {
      if (stryMutAct_9fa48("3021")) {
        {}
      } else {
        stryCov_9fa48("3021");
        return <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
        {dashboardContent}
      </PullToRefresh>;
      }
    }
    return dashboardContent;
  }
};
export default DashboardView;