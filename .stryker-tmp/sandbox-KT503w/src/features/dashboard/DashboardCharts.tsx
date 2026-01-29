/**
 * DashboardCharts - Main dashboard visualization component
 * 
 * Refactored per CLAUDE.md 200-line rule.
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
import { useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction, AnchorTask } from '../../types';
import { groupSmallValues, deduplicateLabels } from '../../utils/finance';
import { fromCents } from '../../utils/moneyUtils';
import { AssetDistributionChart } from './components/AssetDistributionChart';
import { CashFlowChart } from './components/CashFlowChart';
import { ProductivityScoreCard } from './components/ProductivityScoreCard';
import { RecentActivityList } from './components/RecentActivityList';
interface DashboardChartsProps {
  accounts: AnchorAccount[];
  transactions: AnchorTransaction[];
  tasks: AnchorTask[];
  navigateTo?: (tab: 'dashboard' | 'commitments' | 'finance' | 'settings') => void;
}
const COLORS = stryMutAct_9fa48("2825") ? [] : (stryCov_9fa48("2825"), [stryMutAct_9fa48("2826") ? "" : (stryCov_9fa48("2826"), '#6366f1'), stryMutAct_9fa48("2827") ? "" : (stryCov_9fa48("2827"), '#10b981'), stryMutAct_9fa48("2828") ? "" : (stryCov_9fa48("2828"), '#f59e0b'), stryMutAct_9fa48("2829") ? "" : (stryCov_9fa48("2829"), '#ef4444'), stryMutAct_9fa48("2830") ? "" : (stryCov_9fa48("2830"), '#8b5cf6'), stryMutAct_9fa48("2831") ? "" : (stryCov_9fa48("2831"), '#ec4899')]);
const DashboardCharts = ({
  accounts,
  transactions,
  tasks,
  navigateTo
}: DashboardChartsProps) => {
  if (stryMutAct_9fa48("2832")) {
    {}
  } else {
    stryCov_9fa48("2832");
    const accountData = useMemo(() => {
      if (stryMutAct_9fa48("2833")) {
        {}
      } else {
        stryCov_9fa48("2833");
        const rawData = stryMutAct_9fa48("2834") ? accounts.map((acc, index) => ({
          name: acc.name,
          value: fromCents(acc.balanceCents),
          color: COLORS[index % COLORS.length]
        })) : (stryCov_9fa48("2834"), accounts.map(stryMutAct_9fa48("2835") ? () => undefined : (stryCov_9fa48("2835"), (acc, index) => stryMutAct_9fa48("2836") ? {} : (stryCov_9fa48("2836"), {
          name: acc.name,
          value: fromCents(acc.balanceCents),
          color: COLORS[stryMutAct_9fa48("2837") ? index * COLORS.length : (stryCov_9fa48("2837"), index % COLORS.length)]
        }))).filter(stryMutAct_9fa48("2838") ? () => undefined : (stryCov_9fa48("2838"), item => stryMutAct_9fa48("2842") ? item.value <= 0 : stryMutAct_9fa48("2841") ? item.value >= 0 : stryMutAct_9fa48("2840") ? false : stryMutAct_9fa48("2839") ? true : (stryCov_9fa48("2839", "2840", "2841", "2842"), item.value > 0))));
        return groupSmallValues(deduplicateLabels(rawData), 0.05);
      }
    }, stryMutAct_9fa48("2843") ? [] : (stryCov_9fa48("2843"), [accounts]));
    const financialTrend = useMemo(() => {
      if (stryMutAct_9fa48("2844")) {
        {}
      } else {
        stryCov_9fa48("2844");
        const last7Days = (stryMutAct_9fa48("2845") ? new Array() : (stryCov_9fa48("2845"), new Array(7))).fill(0).map((_, i) => {
          if (stryMutAct_9fa48("2846")) {
            {}
          } else {
            stryCov_9fa48("2846");
            const d = new Date();
            stryMutAct_9fa48("2847") ? d.setTime(d.getDate() - (6 - i)) : (stryCov_9fa48("2847"), d.setDate(stryMutAct_9fa48("2848") ? d.getDate() + (6 - i) : (stryCov_9fa48("2848"), d.getDate() - (stryMutAct_9fa48("2849") ? 6 + i : (stryCov_9fa48("2849"), 6 - i)))));
            return stryMutAct_9fa48("2850") ? {} : (stryCov_9fa48("2850"), {
              date: d.toLocaleDateString(stryMutAct_9fa48("2851") ? "" : (stryCov_9fa48("2851"), 'en-US'), stryMutAct_9fa48("2852") ? {} : (stryCov_9fa48("2852"), {
                weekday: stryMutAct_9fa48("2853") ? "" : (stryCov_9fa48("2853"), 'short')
              })),
              income: 0,
              expense: 0
            });
          }
        });
        transactions.forEach(tx => {
          if (stryMutAct_9fa48("2854")) {
            {}
          } else {
            stryCov_9fa48("2854");
            if (stryMutAct_9fa48("2857") ? tx.type !== 'transfer' : stryMutAct_9fa48("2856") ? false : stryMutAct_9fa48("2855") ? true : (stryCov_9fa48("2855", "2856", "2857"), tx.type === (stryMutAct_9fa48("2858") ? "" : (stryCov_9fa48("2858"), 'transfer')))) return;
            const txDate = new Date(tx.date);
            const diffDays = Math.floor(stryMutAct_9fa48("2859") ? (new Date().getTime() - txDate.getTime()) * (1000 * 3600 * 24) : (stryCov_9fa48("2859"), (stryMutAct_9fa48("2860") ? new Date().getTime() + txDate.getTime() : (stryCov_9fa48("2860"), new Date().getTime() - txDate.getTime())) / (stryMutAct_9fa48("2861") ? 1000 * 3600 / 24 : (stryCov_9fa48("2861"), (stryMutAct_9fa48("2862") ? 1000 / 3600 : (stryCov_9fa48("2862"), 1000 * 3600)) * 24))));
            if (stryMutAct_9fa48("2866") ? diffDays >= 7 : stryMutAct_9fa48("2865") ? diffDays <= 7 : stryMutAct_9fa48("2864") ? false : stryMutAct_9fa48("2863") ? true : (stryCov_9fa48("2863", "2864", "2865", "2866"), diffDays < 7)) {
              if (stryMutAct_9fa48("2867")) {
                {}
              } else {
                stryCov_9fa48("2867");
                const index = stryMutAct_9fa48("2868") ? 6 + diffDays : (stryCov_9fa48("2868"), 6 - diffDays);
                if (stryMutAct_9fa48("2871") ? tx.type !== 'income' : stryMutAct_9fa48("2870") ? false : stryMutAct_9fa48("2869") ? true : (stryCov_9fa48("2869", "2870", "2871"), tx.type === (stryMutAct_9fa48("2872") ? "" : (stryCov_9fa48("2872"), 'income')))) stryMutAct_9fa48("2873") ? last7Days[index].income -= fromCents(tx.amountCents || 0) : (stryCov_9fa48("2873"), last7Days[index].income += fromCents(stryMutAct_9fa48("2876") ? tx.amountCents && 0 : stryMutAct_9fa48("2875") ? false : stryMutAct_9fa48("2874") ? true : (stryCov_9fa48("2874", "2875", "2876"), tx.amountCents || 0)));else if (stryMutAct_9fa48("2879") ? tx.type !== 'expense' : stryMutAct_9fa48("2878") ? false : stryMutAct_9fa48("2877") ? true : (stryCov_9fa48("2877", "2878", "2879"), tx.type === (stryMutAct_9fa48("2880") ? "" : (stryCov_9fa48("2880"), 'expense')))) stryMutAct_9fa48("2881") ? last7Days[index].expense -= fromCents(tx.amountCents || 0) : (stryCov_9fa48("2881"), last7Days[index].expense += fromCents(stryMutAct_9fa48("2884") ? tx.amountCents && 0 : stryMutAct_9fa48("2883") ? false : stryMutAct_9fa48("2882") ? true : (stryCov_9fa48("2882", "2883", "2884"), tx.amountCents || 0)));
              }
            }
          }
        });
        return last7Days;
      }
    }, stryMutAct_9fa48("2885") ? [] : (stryCov_9fa48("2885"), [transactions]));
    const commitmentStats = useMemo(() => {
      if (stryMutAct_9fa48("2886")) {
        {}
      } else {
        stryCov_9fa48("2886");
        if (stryMutAct_9fa48("2889") ? tasks.length !== 0 : stryMutAct_9fa48("2888") ? false : stryMutAct_9fa48("2887") ? true : (stryCov_9fa48("2887", "2888", "2889"), tasks.length === 0)) return null;
        const completed = stryMutAct_9fa48("2890") ? tasks.length : (stryCov_9fa48("2890"), tasks.filter(stryMutAct_9fa48("2891") ? () => undefined : (stryCov_9fa48("2891"), t => t.completed)).length);
        const rate = Math.round(stryMutAct_9fa48("2892") ? completed / tasks.length / 100 : (stryCov_9fa48("2892"), (stryMutAct_9fa48("2893") ? completed * tasks.length : (stryCov_9fa48("2893"), completed / tasks.length)) * 100));
        const personalTasks = stryMutAct_9fa48("2894") ? tasks : (stryCov_9fa48("2894"), tasks.filter(stryMutAct_9fa48("2895") ? () => undefined : (stryCov_9fa48("2895"), t => stryMutAct_9fa48("2898") ? t.category !== 'personal' : stryMutAct_9fa48("2897") ? false : stryMutAct_9fa48("2896") ? true : (stryCov_9fa48("2896", "2897", "2898"), t.category === (stryMutAct_9fa48("2899") ? "" : (stryCov_9fa48("2899"), 'personal'))))));
        const familyTasks = stryMutAct_9fa48("2900") ? tasks : (stryCov_9fa48("2900"), tasks.filter(stryMutAct_9fa48("2901") ? () => undefined : (stryCov_9fa48("2901"), t => stryMutAct_9fa48("2904") ? t.category !== 'family' : stryMutAct_9fa48("2903") ? false : stryMutAct_9fa48("2902") ? true : (stryCov_9fa48("2902", "2903", "2904"), t.category === (stryMutAct_9fa48("2905") ? "" : (stryCov_9fa48("2905"), 'family'))))));
        const personalCompleted = stryMutAct_9fa48("2906") ? personalTasks.length : (stryCov_9fa48("2906"), personalTasks.filter(stryMutAct_9fa48("2907") ? () => undefined : (stryCov_9fa48("2907"), t => t.completed)).length);
        const familyCompleted = stryMutAct_9fa48("2908") ? familyTasks.length : (stryCov_9fa48("2908"), familyTasks.filter(stryMutAct_9fa48("2909") ? () => undefined : (stryCov_9fa48("2909"), t => t.completed)).length);
        return stryMutAct_9fa48("2910") ? {} : (stryCov_9fa48("2910"), {
          total: tasks.length,
          completed,
          rate,
          personal: stryMutAct_9fa48("2911") ? {} : (stryCov_9fa48("2911"), {
            total: personalTasks.length,
            completed: personalCompleted,
            rate: (stryMutAct_9fa48("2915") ? personalTasks.length <= 0 : stryMutAct_9fa48("2914") ? personalTasks.length >= 0 : stryMutAct_9fa48("2913") ? false : stryMutAct_9fa48("2912") ? true : (stryCov_9fa48("2912", "2913", "2914", "2915"), personalTasks.length > 0)) ? Math.round(stryMutAct_9fa48("2916") ? personalCompleted / personalTasks.length / 100 : (stryCov_9fa48("2916"), (stryMutAct_9fa48("2917") ? personalCompleted * personalTasks.length : (stryCov_9fa48("2917"), personalCompleted / personalTasks.length)) * 100)) : 0
          }),
          family: stryMutAct_9fa48("2918") ? {} : (stryCov_9fa48("2918"), {
            total: familyTasks.length,
            completed: familyCompleted,
            rate: (stryMutAct_9fa48("2922") ? familyTasks.length <= 0 : stryMutAct_9fa48("2921") ? familyTasks.length >= 0 : stryMutAct_9fa48("2920") ? false : stryMutAct_9fa48("2919") ? true : (stryCov_9fa48("2919", "2920", "2921", "2922"), familyTasks.length > 0)) ? Math.round(stryMutAct_9fa48("2923") ? familyCompleted / familyTasks.length / 100 : (stryCov_9fa48("2923"), (stryMutAct_9fa48("2924") ? familyCompleted * familyTasks.length : (stryCov_9fa48("2924"), familyCompleted / familyTasks.length)) * 100)) : 0
          })
        });
      }
    }, stryMutAct_9fa48("2925") ? [] : (stryCov_9fa48("2925"), [tasks]));
    const recentActivity = useMemo(() => {
      if (stryMutAct_9fa48("2926")) {
        {}
      } else {
        stryCov_9fa48("2926");
        return stryMutAct_9fa48("2929") ? transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) : stryMutAct_9fa48("2928") ? transactions.slice().slice(0, 5) : stryMutAct_9fa48("2927") ? transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : (stryCov_9fa48("2927", "2928", "2929"), transactions.slice().sort(stryMutAct_9fa48("2930") ? () => undefined : (stryCov_9fa48("2930"), (a, b) => stryMutAct_9fa48("2931") ? new Date(b.date).getTime() + new Date(a.date).getTime() : (stryCov_9fa48("2931"), new Date(b.date).getTime() - new Date(a.date).getTime()))).slice(0, 5));
      }
    }, stryMutAct_9fa48("2932") ? [] : (stryCov_9fa48("2932"), [transactions]));
    const cashFlowTotals = useMemo(stryMutAct_9fa48("2933") ? () => undefined : (stryCov_9fa48("2933"), () => stryMutAct_9fa48("2934") ? {} : (stryCov_9fa48("2934"), {
      income: financialTrend.reduce(stryMutAct_9fa48("2935") ? () => undefined : (stryCov_9fa48("2935"), (acc, curr) => stryMutAct_9fa48("2936") ? acc - curr.income : (stryCov_9fa48("2936"), acc + curr.income)), 0),
      expense: financialTrend.reduce(stryMutAct_9fa48("2937") ? () => undefined : (stryCov_9fa48("2937"), (acc, curr) => stryMutAct_9fa48("2938") ? acc - curr.expense : (stryCov_9fa48("2938"), acc + curr.expense)), 0)
    })), stryMutAct_9fa48("2939") ? [] : (stryCov_9fa48("2939"), [financialTrend]));
    if (stryMutAct_9fa48("2942") ? accounts.length === 0 || transactions.length === 0 : stryMutAct_9fa48("2941") ? false : stryMutAct_9fa48("2940") ? true : (stryCov_9fa48("2940", "2941", "2942"), (stryMutAct_9fa48("2944") ? accounts.length !== 0 : stryMutAct_9fa48("2943") ? true : (stryCov_9fa48("2943", "2944"), accounts.length === 0)) && (stryMutAct_9fa48("2946") ? transactions.length !== 0 : stryMutAct_9fa48("2945") ? true : (stryCov_9fa48("2945", "2946"), transactions.length === 0)))) {
      if (stryMutAct_9fa48("2947")) {
        {}
      } else {
        stryCov_9fa48("2947");
        return <div className="glass-card p-12 text-center animate-in fade-in zoom-in-95 duration-700">
                <p className="text-slate-400 font-medium italic">No financial data available to visualize.</p>
            </div>;
      }
    }
    const showAssetDist = stryMutAct_9fa48("2951") ? accounts.length <= 1 : stryMutAct_9fa48("2950") ? accounts.length >= 1 : stryMutAct_9fa48("2949") ? false : stryMutAct_9fa48("2948") ? true : (stryCov_9fa48("2948", "2949", "2950", "2951"), accounts.length > 1);
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stryMutAct_9fa48("2954") ? showAssetDist || <AssetDistributionChart accountData={accountData} /> : stryMutAct_9fa48("2953") ? false : stryMutAct_9fa48("2952") ? true : (stryCov_9fa48("2952", "2953", "2954"), showAssetDist && <AssetDistributionChart accountData={accountData} />)}
            <CashFlowChart financialTrend={financialTrend} cashFlowTotals={cashFlowTotals} transactions={transactions} fullWidth={stryMutAct_9fa48("2955") ? showAssetDist : (stryCov_9fa48("2955"), !showAssetDist)} />
            <ProductivityScoreCard commitmentStats={commitmentStats} navigateTo={navigateTo} />
            <RecentActivityList recentActivity={recentActivity} />
        </div>;
  }
};
export default DashboardCharts;