/**
 * TransferDetails
 * 
 * Transfer-specific form fields including destination account and exchange rate.
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
import { formatCurrency } from '../../../utils/format';
import { toCents } from '../../../utils/moneyUtils';
import type { AnchorAccount } from '../../../types';
interface TransferDetailsProps {
  accounts: AnchorAccount[];
  sourceAccount: AnchorAccount | undefined;
  destinationAccId: string;
  onDestinationChange: (id: string) => void;
  exchangeRate: string;
  onExchangeRateChange: (rate: string) => void;
  amount: string;
  error?: string;
}
export const TransferDetails: React.FC<TransferDetailsProps> = ({
  accounts,
  sourceAccount,
  destinationAccId,
  onDestinationChange,
  exchangeRate,
  onExchangeRateChange,
  amount,
  error
}) => {
  if (stryMutAct_9fa48("4732")) {
    {}
  } else {
    stryCov_9fa48("4732");
    const destAccount = accounts.find(stryMutAct_9fa48("4733") ? () => undefined : (stryCov_9fa48("4733"), a => stryMutAct_9fa48("4736") ? a.id !== destinationAccId : stryMutAct_9fa48("4735") ? false : stryMutAct_9fa48("4734") ? true : (stryCov_9fa48("4734", "4735", "4736"), a.id === destinationAccId)));
    const isDifferentCurrency = stryMutAct_9fa48("4739") ? sourceAccount && destAccount || sourceAccount.currency !== destAccount.currency : stryMutAct_9fa48("4738") ? false : stryMutAct_9fa48("4737") ? true : (stryCov_9fa48("4737", "4738", "4739"), (stryMutAct_9fa48("4741") ? sourceAccount || destAccount : stryMutAct_9fa48("4740") ? true : (stryCov_9fa48("4740", "4741"), sourceAccount && destAccount)) && (stryMutAct_9fa48("4743") ? sourceAccount.currency === destAccount.currency : stryMutAct_9fa48("4742") ? true : (stryCov_9fa48("4742", "4743"), sourceAccount.currency !== destAccount.currency)));
    const filteredAccounts = stryMutAct_9fa48("4744") ? accounts : (stryCov_9fa48("4744"), accounts.filter(stryMutAct_9fa48("4745") ? () => undefined : (stryCov_9fa48("4745"), a => stryMutAct_9fa48("4748") ? a.id === sourceAccount?.id : stryMutAct_9fa48("4747") ? false : stryMutAct_9fa48("4746") ? true : (stryCov_9fa48("4746", "4747", "4748"), a.id !== (stryMutAct_9fa48("4749") ? sourceAccount.id : (stryCov_9fa48("4749"), sourceAccount?.id))))));
    if (stryMutAct_9fa48("4753") ? accounts.length >= 2 : stryMutAct_9fa48("4752") ? accounts.length <= 2 : stryMutAct_9fa48("4751") ? false : stryMutAct_9fa48("4750") ? true : (stryCov_9fa48("4750", "4751", "4752", "4753"), accounts.length < 2)) {
      if (stryMutAct_9fa48("4754")) {
        {}
      } else {
        stryCov_9fa48("4754");
        return <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg text-xs text-amber-600 dark:text-amber-400">
                <p className="font-bold mb-1">Transfer Unavailable</p>
                Transfers require at least two accounts. Please create another account first, or switch to Expense/Income.
            </div>;
      }
    }
    return <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
            <label htmlFor="tx-destination" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                <ArrowRightLeft className="w-3 h-3 inline mr-1" /> To Account
                {stryMutAct_9fa48("4757") ? error || <span className="text-rose-500 ml-2 normal-case font-normal">{error}</span> : stryMutAct_9fa48("4756") ? false : stryMutAct_9fa48("4755") ? true : (stryCov_9fa48("4755", "4756", "4757"), error && <span className="text-rose-500 ml-2 normal-case font-normal">{error}</span>)}
            </label>

            <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>From:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{stryMutAct_9fa48("4758") ? sourceAccount.name : (stryCov_9fa48("4758"), sourceAccount?.name)}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">To:</span>
                    <select id="tx-destination" value={destinationAccId} onChange={stryMutAct_9fa48("4759") ? () => undefined : (stryCov_9fa48("4759"), e => onDestinationChange(e.target.value))} className="p-1 rounded bg-transparent text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-0 text-right cursor-pointer">
                        {filteredAccounts.map(stryMutAct_9fa48("4760") ? () => undefined : (stryCov_9fa48("4760"), acc => <option key={acc.id} value={acc.id}>{acc.name}</option>))}
                    </select>
                </div>
            </div>

            {stryMutAct_9fa48("4763") ? isDifferentCurrency || <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Exchange Rate</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-1.5 py-0.5 rounded">
                            Manual
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">1 {sourceAccount?.currency} =</span>
                        <input type="number" step="0.0001" value={exchangeRate} onChange={e => onExchangeRateChange(e.target.value)} className="flex-1 p-1.5 text-right text-sm font-bold rounded border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500" />
                        <span className="text-xs font-mono text-slate-500">{destAccount?.currency}</span>
                    </div>
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-1 text-right">
                        Receives: {formatCurrency(toCents(amount) * parseFloat(exchangeRate || '0'), destAccount?.currency || '')}
                    </p>
                </div> : stryMutAct_9fa48("4762") ? false : stryMutAct_9fa48("4761") ? true : (stryCov_9fa48("4761", "4762", "4763"), isDifferentCurrency && <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Exchange Rate</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-1.5 py-0.5 rounded">
                            Manual
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">1 {stryMutAct_9fa48("4764") ? sourceAccount.currency : (stryCov_9fa48("4764"), sourceAccount?.currency)} =</span>
                        <input type="number" step="0.0001" value={exchangeRate} onChange={stryMutAct_9fa48("4765") ? () => undefined : (stryCov_9fa48("4765"), e => onExchangeRateChange(e.target.value))} className="flex-1 p-1.5 text-right text-sm font-bold rounded border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500" />
                        <span className="text-xs font-mono text-slate-500">{stryMutAct_9fa48("4766") ? destAccount.currency : (stryCov_9fa48("4766"), destAccount?.currency)}</span>
                    </div>
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-1 text-right">
                        Receives: {formatCurrency(stryMutAct_9fa48("4767") ? toCents(amount) / parseFloat(exchangeRate || '0') : (stryCov_9fa48("4767"), toCents(amount) * parseFloat(stryMutAct_9fa48("4770") ? exchangeRate && '0' : stryMutAct_9fa48("4769") ? false : stryMutAct_9fa48("4768") ? true : (stryCov_9fa48("4768", "4769", "4770"), exchangeRate || (stryMutAct_9fa48("4771") ? "" : (stryCov_9fa48("4771"), '0'))))), stryMutAct_9fa48("4774") ? destAccount?.currency && '' : stryMutAct_9fa48("4773") ? false : stryMutAct_9fa48("4772") ? true : (stryCov_9fa48("4772", "4773", "4774"), (stryMutAct_9fa48("4775") ? destAccount.currency : (stryCov_9fa48("4775"), destAccount?.currency)) || (stryMutAct_9fa48("4776") ? "Stryker was here!" : (stryCov_9fa48("4776"), ''))))}
                    </p>
                </div>)}
        </div>;
  }
};