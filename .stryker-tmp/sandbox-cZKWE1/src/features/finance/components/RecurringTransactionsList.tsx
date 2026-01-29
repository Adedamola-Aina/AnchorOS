/**
 * RecurringTransactionsList - Displays detected recurring payments
 * 
 * CLAUDE.md Design Philosophy:
 * - Clarity: Each recurring item clearly shows title, frequency, and amount
 * - Compact: Minimal vertical space usage
 * - Informative: Shows total monthly recurring expense
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
import { RefreshCw, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency } from '../../../types';
interface RecurringItem {
  id: string;
  title: string;
  amountCents: number;
  frequency: string;
}
interface RecurringTransactionsListProps {
  recurring: RecurringItem[];
  currency: Currency;
  maxItems?: number;
}
export const RecurringTransactionsList = ({
  recurring,
  currency,
  maxItems = 4
}: RecurringTransactionsListProps) => {
  if (stryMutAct_9fa48("4459")) {
    {}
  } else {
    stryCov_9fa48("4459");
    // Calculate estimated monthly total
    const monthlyTotal = recurring.reduce((sum, r) => {
      if (stryMutAct_9fa48("4460")) {
        {}
      } else {
        stryCov_9fa48("4460");
        const amount = stryMutAct_9fa48("4463") ? r.amountCents && 0 : stryMutAct_9fa48("4462") ? false : stryMutAct_9fa48("4461") ? true : (stryCov_9fa48("4461", "4462", "4463"), r.amountCents || 0);
        // Estimate monthly: weekly*4, biweekly*2, monthly*1
        if (stryMutAct_9fa48("4466") ? r.frequency.toUpperCase().includes('week') : stryMutAct_9fa48("4465") ? false : stryMutAct_9fa48("4464") ? true : (stryCov_9fa48("4464", "4465", "4466"), r.frequency.toLowerCase().includes(stryMutAct_9fa48("4467") ? "" : (stryCov_9fa48("4467"), 'week')))) {
          if (stryMutAct_9fa48("4468")) {
            {}
          } else {
            stryCov_9fa48("4468");
            return stryMutAct_9fa48("4469") ? sum - (r.frequency.toLowerCase().includes('bi') ? amount * 2 : amount * 4) : (stryCov_9fa48("4469"), sum + ((stryMutAct_9fa48("4470") ? r.frequency.toUpperCase().includes('bi') : (stryCov_9fa48("4470"), r.frequency.toLowerCase().includes(stryMutAct_9fa48("4471") ? "" : (stryCov_9fa48("4471"), 'bi')))) ? stryMutAct_9fa48("4472") ? amount / 2 : (stryCov_9fa48("4472"), amount * 2) : stryMutAct_9fa48("4473") ? amount / 4 : (stryCov_9fa48("4473"), amount * 4)));
          }
        }
        return stryMutAct_9fa48("4474") ? sum - amount : (stryCov_9fa48("4474"), sum + amount);
      }
    }, 0);
    const currencySymbol = (stryMutAct_9fa48("4477") ? currency !== 'USD' : stryMutAct_9fa48("4476") ? false : stryMutAct_9fa48("4475") ? true : (stryCov_9fa48("4475", "4476", "4477"), currency === (stryMutAct_9fa48("4478") ? "" : (stryCov_9fa48("4478"), 'USD')))) ? stryMutAct_9fa48("4479") ? "" : (stryCov_9fa48("4479"), '$') : stryMutAct_9fa48("4480") ? "" : (stryCov_9fa48("4480"), '₦');
    return <div className="glass-card p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Recurring
                </h3>
                {stryMutAct_9fa48("4483") ? recurring.length > 0 || <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        ~{formatCurrency(fromCents(monthlyTotal), currency)}/mo
                    </span> : stryMutAct_9fa48("4482") ? false : stryMutAct_9fa48("4481") ? true : (stryCov_9fa48("4481", "4482", "4483"), (stryMutAct_9fa48("4486") ? recurring.length <= 0 : stryMutAct_9fa48("4485") ? recurring.length >= 0 : stryMutAct_9fa48("4484") ? true : (stryCov_9fa48("4484", "4485", "4486"), recurring.length > 0)) && <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        ~{formatCurrency(fromCents(monthlyTotal), currency)}/mo
                    </span>)}
            </div>

            {(stryMutAct_9fa48("4489") ? recurring.length !== 0 : stryMutAct_9fa48("4488") ? false : stryMutAct_9fa48("4487") ? true : (stryCov_9fa48("4487", "4488", "4489"), recurring.length === 0)) ? <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-400">No recurring payments detected</p>
                    <p className="text-[10px] text-slate-400/70 mt-1">Add more transactions to detect patterns</p>
                </div> : <div className="space-y-2">
                    {stryMutAct_9fa48("4490") ? recurring.map(rec => <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {currencySymbol}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                        {rec.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                                        {rec.frequency}
                                    </p>
                                </div>
                            </div>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-sm tabular-nums shrink-0">
                                {formatCurrency(fromCents(rec.amountCents || 0), currency)}
                            </p>
                        </div>) : (stryCov_9fa48("4490"), recurring.slice(0, maxItems).map(stryMutAct_9fa48("4491") ? () => undefined : (stryCov_9fa48("4491"), rec => <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {currencySymbol}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                        {rec.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                                        {rec.frequency}
                                    </p>
                                </div>
                            </div>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-sm tabular-nums shrink-0">
                                {formatCurrency(fromCents(stryMutAct_9fa48("4494") ? rec.amountCents && 0 : stryMutAct_9fa48("4493") ? false : stryMutAct_9fa48("4492") ? true : (stryCov_9fa48("4492", "4493", "4494"), rec.amountCents || 0)), currency)}
                            </p>
                        </div>)))}
                    {stryMutAct_9fa48("4497") ? recurring.length > maxItems || <p className="text-center text-[10px] text-slate-400 pt-2">
                            +{recurring.length - maxItems} more
                        </p> : stryMutAct_9fa48("4496") ? false : stryMutAct_9fa48("4495") ? true : (stryCov_9fa48("4495", "4496", "4497"), (stryMutAct_9fa48("4500") ? recurring.length <= maxItems : stryMutAct_9fa48("4499") ? recurring.length >= maxItems : stryMutAct_9fa48("4498") ? true : (stryCov_9fa48("4498", "4499", "4500"), recurring.length > maxItems)) && <p className="text-center text-[10px] text-slate-400 pt-2">
                            +{stryMutAct_9fa48("4501") ? recurring.length + maxItems : (stryCov_9fa48("4501"), recurring.length - maxItems)} more
                        </p>)}
                </div>}
        </div>;
  }
};