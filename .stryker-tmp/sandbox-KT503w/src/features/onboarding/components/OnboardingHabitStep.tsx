/**
 * OnboardingHabitStep - Step 3: Create first commitment
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
import { CheckCircle2, Sparkles } from 'lucide-react';
interface OnboardingHabitStepProps {
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onSkip: () => void;
}
const SUGGESTIONS = stryMutAct_9fa48("5419") ? [] : (stryCov_9fa48("5419"), [stryMutAct_9fa48("5420") ? "" : (stryCov_9fa48("5420"), 'Drink 2L Water'), stryMutAct_9fa48("5421") ? "" : (stryCov_9fa48("5421"), 'Read 15 Mins'), stryMutAct_9fa48("5422") ? "" : (stryCov_9fa48("5422"), 'Walk 5000 Steps'), stryMutAct_9fa48("5423") ? "" : (stryCov_9fa48("5423"), 'Review Finances')]);
export function OnboardingHabitStep({
  taskTitle,
  setTaskTitle,
  loading,
  onSubmit,
  onSkip
}: OnboardingHabitStepProps) {
  if (stryMutAct_9fa48("5424")) {
    {}
  } else {
    stryCov_9fa48("5424");
    return <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">One Small Habit</h2>
                    <p className="text-slate-500 text-sm">Consistency starts with one daily action.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">I commit to...</label>
                    <input type="text" value={taskTitle} onChange={stryMutAct_9fa48("5425") ? () => undefined : (stryCov_9fa48("5425"), e => setTaskTitle(e.target.value))} className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="e.g. Drink water, Read pages, Exercise" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map(stryMutAct_9fa48("5426") ? () => undefined : (stryCov_9fa48("5426"), s => <button key={s} onClick={stryMutAct_9fa48("5427") ? () => undefined : (stryCov_9fa48("5427"), () => setTaskTitle(s))} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {s}
                        </button>))}
                </div>

                <button onClick={onSubmit} disabled={stryMutAct_9fa48("5430") ? !taskTitle && loading : stryMutAct_9fa48("5429") ? false : stryMutAct_9fa48("5428") ? true : (stryCov_9fa48("5428", "5429", "5430"), (stryMutAct_9fa48("5431") ? taskTitle : (stryCov_9fa48("5431"), !taskTitle)) || loading)} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    {loading ? stryMutAct_9fa48("5432") ? "" : (stryCov_9fa48("5432"), 'Committing...') : stryMutAct_9fa48("5433") ? "" : (stryCov_9fa48("5433"), 'Finish Setup')} <Sparkles className="w-4 h-4" />
                </button>

                <div className="text-center">
                    <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Skip for now →</button>
                </div>
            </div>
        </div>;
  }
}