/**
 * OverdraftWarning
 * 
 * Warning banner displayed when a transaction would cause overdraft.
 * Extracted from TransactionForm for modularity.
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
import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { fromCents } from '../../../utils/moneyUtils';
interface OverdraftWarningProps {
  projectedBalance: number;
  amountCents: number;
}
export const OverdraftWarning: React.FC<OverdraftWarningProps> = ({
  projectedBalance,
  amountCents
}) => {
  if (stryMutAct_9fa48("4451")) {
    {}
  } else {
    stryCov_9fa48("4451");
    return <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
            <div className="p-1 bg-rose-100 dark:bg-rose-800 rounded-full mt-0.5">
                <ArrowRightLeft className="w-3 h-3 text-rose-600 dark:text-rose-300" />
            </div>
            <div>
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase">Warning: Overdraft Risk</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                    This transaction will take your account balance to{stryMutAct_9fa48("4452") ? "" : (stryCov_9fa48("4452"), ' ')}
                    <span className="font-mono font-bold">
                        {(stryMutAct_9fa48("4456") ? amountCents <= 0 : stryMutAct_9fa48("4455") ? amountCents >= 0 : stryMutAct_9fa48("4454") ? false : stryMutAct_9fa48("4453") ? true : (stryCov_9fa48("4453", "4454", "4455", "4456"), amountCents > 0)) ? stryMutAct_9fa48("4457") ? "" : (stryCov_9fa48("4457"), '-') : stryMutAct_9fa48("4458") ? "Stryker was here!" : (stryCov_9fa48("4458"), '')}{fromCents(Math.abs(projectedBalance)).toLocaleString()}
                    </span>.
                </p>
            </div>
        </div>;
  }
};