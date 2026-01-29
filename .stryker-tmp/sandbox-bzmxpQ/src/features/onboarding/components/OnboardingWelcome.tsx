/**
 * OnboardingWelcome - Step 1: Welcome screen
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
import { ArrowRight } from 'lucide-react';
import { AnchorLogo } from '../../../components/shared';
interface OnboardingWelcomeProps {
  userName: string;
  onStart: () => void;
  onSkip: () => void;
}
export function OnboardingWelcome({
  userName,
  onStart,
  onSkip
}: OnboardingWelcomeProps) {
  if (stryMutAct_9fa48("5434")) {
    {}
  } else {
    stryCov_9fa48("5434");
    return <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-center mb-6">
                <AnchorLogo className="w-20 h-20 text-slate-900 dark:text-white" />
            </div>
            <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">
                Welcome aboard, <span className="text-blue-500">{userName}</span>.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                Anchor OS is designed to organize your financial life and daily commitments in one unified system.
            </p>
            <button onClick={onStart} className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5">
                Start Setup
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div>
                <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    Skip for now →
                </button>
            </div>
        </div>;
  }
}