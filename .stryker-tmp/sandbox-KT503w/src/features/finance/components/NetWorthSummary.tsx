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
import React from 'react';
import { DollarSign, Landmark } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
interface NetWorthSummaryProps {
  netWorth: {
    NGN: number;
    USD: number;
  };
}
export const NetWorthSummary: React.FC<NetWorthSummaryProps> = ({
  netWorth
}) => {
  if (stryMutAct_9fa48("4448")) {
    {}
  } else {
    stryCov_9fa48("4448");
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <Landmark className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Worth (NGN)</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                            {formatCurrency(netWorth.NGN, stryMutAct_9fa48("4449") ? "" : (stryCov_9fa48("4449"), 'NGN'))}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-finance-50 dark:bg-finance-900/20 rounded-xl">
                        <DollarSign className="w-6 h-6 text-finance-600 dark:text-finance-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Worth (USD)</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                            {formatCurrency(netWorth.USD, stryMutAct_9fa48("4450") ? "" : (stryCov_9fa48("4450"), 'USD'))}
                        </h3>
                    </div>
                </div>
            </div>
        </div>;
  }
};