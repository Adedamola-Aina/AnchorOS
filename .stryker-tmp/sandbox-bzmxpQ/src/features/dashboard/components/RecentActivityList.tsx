/**
 * RecentActivityList - Shows recent transactions
 * 
 * Follows CLAUDE.md design system with consistent styling
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
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
import { formatCurrency } from '../../../utils/format';
interface RecentActivityListProps {
  recentActivity: AnchorTransaction[];
}
export function RecentActivityList({
  recentActivity
}: RecentActivityListProps) {
  if (stryMutAct_9fa48("3260")) {
    {}
  } else {
    stryCov_9fa48("3260");
    return <div className="glass-card p-6 overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Recent Activity</h4>
            <div className="space-y-2">
                {(stryMutAct_9fa48("3264") ? recentActivity.length <= 0 : stryMutAct_9fa48("3263") ? recentActivity.length >= 0 : stryMutAct_9fa48("3262") ? false : stryMutAct_9fa48("3261") ? true : (stryCov_9fa48("3261", "3262", "3263", "3264"), recentActivity.length > 0)) ? recentActivity.map((tx, idx) => {
          if (stryMutAct_9fa48("3265")) {
            {}
          } else {
            stryCov_9fa48("3265");
            // Use transactionDate (actual date) if available, else entry date
            const displayDate = stryMutAct_9fa48("3268") ? tx.transactionDate && tx.date : stryMutAct_9fa48("3267") ? false : stryMutAct_9fa48("3266") ? true : (stryCov_9fa48("3266", "3267", "3268"), tx.transactionDate || tx.date);
            const dateStr = displayDate ? new Date(displayDate).toLocaleDateString(stryMutAct_9fa48("3269") ? "" : (stryCov_9fa48("3269"), 'en-US'), stryMutAct_9fa48("3270") ? {} : (stryCov_9fa48("3270"), {
              month: stryMutAct_9fa48("3271") ? "" : (stryCov_9fa48("3271"), 'short'),
              day: stryMutAct_9fa48("3272") ? "" : (stryCov_9fa48("3272"), 'numeric')
            })) : stryMutAct_9fa48("3273") ? "Stryker was here!" : (stryCov_9fa48("3273"), '');
            return <div key={stryMutAct_9fa48("3276") ? tx.id && idx : stryMutAct_9fa48("3275") ? false : stryMutAct_9fa48("3274") ? true : (stryCov_9fa48("3274", "3275", "3276"), tx.id || idx)} className="flex items-center justify-between text-sm group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={stryMutAct_9fa48("3277") ? `` : (stryCov_9fa48("3277"), `p-2 rounded-xl shrink-0 ${(stryMutAct_9fa48("3280") ? tx.type !== 'income' : stryMutAct_9fa48("3279") ? false : stryMutAct_9fa48("3278") ? true : (stryCov_9fa48("3278", "3279", "3280"), tx.type === (stryMutAct_9fa48("3281") ? "" : (stryCov_9fa48("3281"), 'income')))) ? stryMutAct_9fa48("3282") ? "" : (stryCov_9fa48("3282"), 'bg-emerald-500/10 text-emerald-500') : (stryMutAct_9fa48("3285") ? tx.type !== 'expense' : stryMutAct_9fa48("3284") ? false : stryMutAct_9fa48("3283") ? true : (stryCov_9fa48("3283", "3284", "3285"), tx.type === (stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), 'expense')))) ? stryMutAct_9fa48("3287") ? "" : (stryCov_9fa48("3287"), 'bg-rose-500/10 text-rose-500') : stryMutAct_9fa48("3288") ? "" : (stryCov_9fa48("3288"), 'bg-blue-500/10 text-blue-500')}`)}>
                                        {(stryMutAct_9fa48("3291") ? tx.type !== 'income' : stryMutAct_9fa48("3290") ? false : stryMutAct_9fa48("3289") ? true : (stryCov_9fa48("3289", "3290", "3291"), tx.type === (stryMutAct_9fa48("3292") ? "" : (stryCov_9fa48("3292"), 'income')))) ? <TrendingUp className="w-4 h-4" /> : (stryMutAct_9fa48("3295") ? tx.type !== 'expense' : stryMutAct_9fa48("3294") ? false : stryMutAct_9fa48("3293") ? true : (stryCov_9fa48("3293", "3294", "3295"), tx.type === (stryMutAct_9fa48("3296") ? "" : (stryCov_9fa48("3296"), 'expense')))) ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate">
                                            {tx.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 min-w-0">
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {dateStr}
                                            </span>
                                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded truncate">
                                                {tx.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={stryMutAct_9fa48("3297") ? `` : (stryCov_9fa48("3297"), `font-mono font-bold text-sm tabular-nums shrink-0 ${(stryMutAct_9fa48("3300") ? tx.type !== 'income' : stryMutAct_9fa48("3299") ? false : stryMutAct_9fa48("3298") ? true : (stryCov_9fa48("3298", "3299", "3300"), tx.type === (stryMutAct_9fa48("3301") ? "" : (stryCov_9fa48("3301"), 'income')))) ? stryMutAct_9fa48("3302") ? "" : (stryCov_9fa48("3302"), 'text-emerald-500') : (stryMutAct_9fa48("3305") ? tx.type !== 'expense' : stryMutAct_9fa48("3304") ? false : stryMutAct_9fa48("3303") ? true : (stryCov_9fa48("3303", "3304", "3305"), tx.type === (stryMutAct_9fa48("3306") ? "" : (stryCov_9fa48("3306"), 'expense')))) ? stryMutAct_9fa48("3307") ? "" : (stryCov_9fa48("3307"), 'text-rose-500') : stryMutAct_9fa48("3308") ? "" : (stryCov_9fa48("3308"), 'text-blue-500')}`)}>
                                    {(stryMutAct_9fa48("3311") ? tx.type !== 'income' : stryMutAct_9fa48("3310") ? false : stryMutAct_9fa48("3309") ? true : (stryCov_9fa48("3309", "3310", "3311"), tx.type === (stryMutAct_9fa48("3312") ? "" : (stryCov_9fa48("3312"), 'income')))) ? stryMutAct_9fa48("3313") ? "" : (stryCov_9fa48("3313"), '+') : (stryMutAct_9fa48("3316") ? tx.type !== 'expense' : stryMutAct_9fa48("3315") ? false : stryMutAct_9fa48("3314") ? true : (stryCov_9fa48("3314", "3315", "3316"), tx.type === (stryMutAct_9fa48("3317") ? "" : (stryCov_9fa48("3317"), 'expense')))) ? stryMutAct_9fa48("3318") ? "" : (stryCov_9fa48("3318"), '-') : stryMutAct_9fa48("3319") ? "Stryker was here!" : (stryCov_9fa48("3319"), '')}
                                    {formatCurrency(fromCents(stryMutAct_9fa48("3322") ? tx.amountCents && 0 : stryMutAct_9fa48("3321") ? false : stryMutAct_9fa48("3320") ? true : (stryCov_9fa48("3320", "3321", "3322"), tx.amountCents || 0)), stryMutAct_9fa48("3325") ? tx.currency && 'NGN' : stryMutAct_9fa48("3324") ? false : stryMutAct_9fa48("3323") ? true : (stryCov_9fa48("3323", "3324", "3325"), tx.currency || (stryMutAct_9fa48("3326") ? "" : (stryCov_9fa48("3326"), 'NGN'))))}
                                </span>
                            </div>;
          }
        }) : <p className="text-sm text-slate-400 italic text-center py-4">No recent transactions</p>}
            </div>
        </div>;
  }
}