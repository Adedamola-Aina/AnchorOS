/**
 * ProductivityScoreCard - Shows commitment completion stats
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
import { Activity } from 'lucide-react';
interface CommitmentStats {
  total: number;
  completed: number;
  rate: number;
  personal: {
    total: number;
    completed: number;
    rate: number;
  };
  family: {
    total: number;
    completed: number;
    rate: number;
  };
}
interface ProductivityScoreCardProps {
  commitmentStats: CommitmentStats | null;
  navigateTo?: (tab: 'dashboard' | 'commitments' | 'finance' | 'settings') => void;
}
export function ProductivityScoreCard({
  commitmentStats,
  navigateTo
}: ProductivityScoreCardProps) {
  if (stryMutAct_9fa48("3246")) {
    {}
  } else {
    stryCov_9fa48("3246");
    if (stryMutAct_9fa48("3249") ? false : stryMutAct_9fa48("3248") ? true : stryMutAct_9fa48("3247") ? commitmentStats : (stryCov_9fa48("3247", "3248", "3249"), !commitmentStats)) {
      if (stryMutAct_9fa48("3250")) {
        {}
      } else {
        stryCov_9fa48("3250");
        return <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-1">Boost Productivity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">
                    Set daily or weekly commitments to track your consistency across life domains.
                </p>
                <button onClick={stryMutAct_9fa48("3251") ? () => undefined : (stryCov_9fa48("3251"), () => stryMutAct_9fa48("3254") ? navigateTo || navigateTo('commitments') : stryMutAct_9fa48("3253") ? false : stryMutAct_9fa48("3252") ? true : (stryCov_9fa48("3252", "3253", "3254"), navigateTo && navigateTo(stryMutAct_9fa48("3255") ? "" : (stryCov_9fa48("3255"), 'commitments'))))} className="text-xs font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest">
                    + Set Commitments
                </button>
            </div>;
      }
    }
    return <div className="premium-gradient text-white p-6 rounded-3xl shadow-2xl overflow-hidden relative border border-white/10 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4 relative z-10 transition-transform duration-700 group-hover:-translate-y-1">
                <div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Productivity Score</h4>
                    <p className="text-5xl font-bold tracking-tighter">{commitmentStats.rate}% <span className="text-xs font-black uppercase opacity-40 ml-1 tracking-widest">Done</span></p>
                </div>
                <Activity className="w-6 h-6 text-white/20" />
            </div>

            <div className="space-y-3 relative z-10">
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="opacity-70">Personal</span>
                        <span>{commitmentStats.personal.completed}/{commitmentStats.personal.total}</span>
                    </div>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 rounded-full transition-all duration-1000" style={stryMutAct_9fa48("3256") ? {} : (stryCov_9fa48("3256"), {
              width: stryMutAct_9fa48("3257") ? `` : (stryCov_9fa48("3257"), `${commitmentStats.personal.rate}%`)
            })} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="opacity-70">Family</span>
                        <span>{commitmentStats.family.completed}/{commitmentStats.family.total}</span>
                    </div>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/50 rounded-full transition-all duration-1000" style={stryMutAct_9fa48("3258") ? {} : (stryCov_9fa48("3258"), {
              width: stryMutAct_9fa48("3259") ? `` : (stryCov_9fa48("3259"), `${commitmentStats.family.rate}%`)
            })} />
                    </div>
                </div>
            </div>
        </div>;
  }
}