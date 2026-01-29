/**
 * NetWorthCards - Displays net worth by currency
 * Extracted from FinanceView per CLAUDE.md 200-line rule
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
import { Landmark, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
interface NetWorthCardsProps {
  netWorth: {
    NGN: number;
    USD: number;
  };
}
export const NetWorthCards = ({
  netWorth
}: NetWorthCardsProps) => {
  if (stryMutAct_9fa48("4426")) {
    {}
  } else {
    stryCov_9fa48("4426");
    const hasNGN = stryMutAct_9fa48("4430") ? netWorth.NGN <= 0 : stryMutAct_9fa48("4429") ? netWorth.NGN >= 0 : stryMutAct_9fa48("4428") ? false : stryMutAct_9fa48("4427") ? true : (stryCov_9fa48("4427", "4428", "4429", "4430"), netWorth.NGN > 0);
    const hasUSD = stryMutAct_9fa48("4434") ? netWorth.USD <= 0 : stryMutAct_9fa48("4433") ? netWorth.USD >= 0 : stryMutAct_9fa48("4432") ? false : stryMutAct_9fa48("4431") ? true : (stryCov_9fa48("4431", "4432", "4433", "4434"), netWorth.USD > 0);
    if (stryMutAct_9fa48("4437") ? !hasNGN || !hasUSD : stryMutAct_9fa48("4436") ? false : stryMutAct_9fa48("4435") ? true : (stryCov_9fa48("4435", "4436", "4437"), (stryMutAct_9fa48("4438") ? hasNGN : (stryCov_9fa48("4438"), !hasNGN)) && (stryMutAct_9fa48("4439") ? hasUSD : (stryCov_9fa48("4439"), !hasUSD)))) return null;
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* NGN Net Worth Card */}
            {stryMutAct_9fa48("4442") ? hasNGN || <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <Landmark className="w-16 h-16 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Worth (NGN)</p>
                    <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(netWorth.NGN, 'NGN')}
                    </h2>
                </div> : stryMutAct_9fa48("4441") ? false : stryMutAct_9fa48("4440") ? true : (stryCov_9fa48("4440", "4441", "4442"), hasNGN && <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <Landmark className="w-16 h-16 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Worth (NGN)</p>
                    <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(netWorth.NGN, stryMutAct_9fa48("4443") ? "" : (stryCov_9fa48("4443"), 'NGN'))}
                    </h2>
                </div>)}

            {/* USD Net Worth Card */}
            {stryMutAct_9fa48("4446") ? hasUSD || <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-indigo-800">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <DollarSign className="w-16 h-16 text-primary-300" />
                    </div>
                    <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mb-1">Net Worth (USD)</p>
                    <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(netWorth.USD, 'USD')}
                    </h2>
                </div> : stryMutAct_9fa48("4445") ? false : stryMutAct_9fa48("4444") ? true : (stryCov_9fa48("4444", "4445", "4446"), hasUSD && <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-indigo-800">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <DollarSign className="w-16 h-16 text-primary-300" />
                    </div>
                    <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mb-1">Net Worth (USD)</p>
                    <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(netWorth.USD, stryMutAct_9fa48("4447") ? "" : (stryCov_9fa48("4447"), 'USD'))}
                    </h2>
                </div>)}
        </div>;
  }
};