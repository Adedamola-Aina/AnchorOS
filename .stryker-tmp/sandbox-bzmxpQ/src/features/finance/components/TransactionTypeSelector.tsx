/**
 * TransactionTypeSelector
 * 
 * Toggle component for selecting transaction type.
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
import type { TransactionType } from '../../../types';
interface TransactionTypeSelectorProps {
  type: TransactionType;
  onChange: (type: TransactionType) => void;
}
export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  type,
  onChange
}) => {
  if (stryMutAct_9fa48("4704")) {
    {}
  } else {
    stryCov_9fa48("4704");
    return <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button type="button" onClick={stryMutAct_9fa48("4705") ? () => undefined : (stryCov_9fa48("4705"), () => onChange(stryMutAct_9fa48("4706") ? "" : (stryCov_9fa48("4706"), 'expense')))} className={stryMutAct_9fa48("4707") ? `` : (stryCov_9fa48("4707"), `flex-1 rounded-md text-xs font-medium py-2 transition-all ${(stryMutAct_9fa48("4710") ? type !== 'expense' : stryMutAct_9fa48("4709") ? false : stryMutAct_9fa48("4708") ? true : (stryCov_9fa48("4708", "4709", "4710"), type === (stryMutAct_9fa48("4711") ? "" : (stryCov_9fa48("4711"), 'expense')))) ? stryMutAct_9fa48("4712") ? "" : (stryCov_9fa48("4712"), 'bg-white dark:bg-slate-600 text-rose-600 dark:text-rose-400 shadow-sm') : stryMutAct_9fa48("4713") ? "" : (stryCov_9fa48("4713"), 'text-slate-500 dark:text-slate-400')}`)}>
                Expense
            </button>
            <button type="button" onClick={stryMutAct_9fa48("4714") ? () => undefined : (stryCov_9fa48("4714"), () => onChange(stryMutAct_9fa48("4715") ? "" : (stryCov_9fa48("4715"), 'income')))} className={stryMutAct_9fa48("4716") ? `` : (stryCov_9fa48("4716"), `flex-1 rounded-md text-xs font-medium py-2 transition-all ${(stryMutAct_9fa48("4719") ? type !== 'income' : stryMutAct_9fa48("4718") ? false : stryMutAct_9fa48("4717") ? true : (stryCov_9fa48("4717", "4718", "4719"), type === (stryMutAct_9fa48("4720") ? "" : (stryCov_9fa48("4720"), 'income')))) ? stryMutAct_9fa48("4721") ? "" : (stryCov_9fa48("4721"), 'bg-white dark:bg-slate-600 text-finance-600 dark:text-finance-400 shadow-sm') : stryMutAct_9fa48("4722") ? "" : (stryCov_9fa48("4722"), 'text-slate-500 dark:text-slate-400')}`)}>
                Income
            </button>
            <button type="button" onClick={stryMutAct_9fa48("4723") ? () => undefined : (stryCov_9fa48("4723"), () => onChange(stryMutAct_9fa48("4724") ? "" : (stryCov_9fa48("4724"), 'transfer')))} className={stryMutAct_9fa48("4725") ? `` : (stryCov_9fa48("4725"), `flex-1 rounded-md text-xs font-medium py-2 transition-all flex items-center justify-center gap-1 ${(stryMutAct_9fa48("4728") ? type !== 'transfer' : stryMutAct_9fa48("4727") ? false : stryMutAct_9fa48("4726") ? true : (stryCov_9fa48("4726", "4727", "4728"), type === (stryMutAct_9fa48("4729") ? "" : (stryCov_9fa48("4729"), 'transfer')))) ? stryMutAct_9fa48("4730") ? "" : (stryCov_9fa48("4730"), 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm') : stryMutAct_9fa48("4731") ? "" : (stryCov_9fa48("4731"), 'text-slate-500 dark:text-slate-400')}`)}>
                <ArrowRightLeft className="w-3 h-3" />
                Transfer
            </button>
        </div>;
  }
};