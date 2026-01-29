/**
 * AccountSelector
 * 
 * Grid of account cards for selecting source account.
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
import type { AnchorAccount } from '../../../types';
interface AccountSelectorProps {
  accounts: AnchorAccount[];
  selectedId: string;
  onSelect: (id: string) => void;
  label: string;
}
export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedId,
  onSelect,
  label
}) => {
  if (stryMutAct_9fa48("4314")) {
    {}
  } else {
    stryCov_9fa48("4314");
    return <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                {label}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {accounts.map(stryMutAct_9fa48("4315") ? () => undefined : (stryCov_9fa48("4315"), acc => <button key={acc.id} type="button" onClick={stryMutAct_9fa48("4316") ? () => undefined : (stryCov_9fa48("4316"), () => onSelect(acc.id))} className={stryMutAct_9fa48("4317") ? `` : (stryCov_9fa48("4317"), `text-left p-3 rounded-lg border transition-all ${(stryMutAct_9fa48("4320") ? selectedId !== acc.id : stryMutAct_9fa48("4319") ? false : stryMutAct_9fa48("4318") ? true : (stryCov_9fa48("4318", "4319", "4320"), selectedId === acc.id)) ? stryMutAct_9fa48("4321") ? "" : (stryCov_9fa48("4321"), 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500') : stryMutAct_9fa48("4322") ? "" : (stryCov_9fa48("4322"), 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')}`)}>
                        <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {acc.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {acc.currency} • {acc.type}
                        </div>
                    </button>))}
            </div>
        </div>;
  }
};