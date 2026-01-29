/**
 * TransactionForm Field Components
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
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
import { Calendar } from 'lucide-react';
import { toCents, fromCents } from '../../../../utils/moneyUtils';
interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onClearError: () => void;
}
export const DescriptionField: React.FC<DescriptionFieldProps> = stryMutAct_9fa48("4871") ? () => undefined : (stryCov_9fa48("4871"), (() => {
  const DescriptionField: React.FC<DescriptionFieldProps> = ({
    value,
    onChange,
    error,
    onClearError
  }) => <div>
        <label htmlFor="tx-title" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Description {stryMutAct_9fa48("4874") ? error || <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span> : stryMutAct_9fa48("4873") ? false : stryMutAct_9fa48("4872") ? true : (stryCov_9fa48("4872", "4873", "4874"), error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>)}
        </label>
        <input id="tx-title" type="text" placeholder="e.g. Groceries, Upwork Salary" className={stryMutAct_9fa48("4875") ? `` : (stryCov_9fa48("4875"), `w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 transition-colors ${error ? stryMutAct_9fa48("4876") ? "" : (stryCov_9fa48("4876"), 'border-rose-500 ring-1 ring-rose-500') : stryMutAct_9fa48("4877") ? "" : (stryCov_9fa48("4877"), 'border-slate-300 dark:border-slate-600')}`)} value={value} onChange={e => {
      if (stryMutAct_9fa48("4878")) {
        {}
      } else {
        stryCov_9fa48("4878");
        onChange(e.target.value);
        if (stryMutAct_9fa48("4880") ? false : stryMutAct_9fa48("4879") ? true : (stryCov_9fa48("4879", "4880"), error)) onClearError();
      }
    }} autoFocus />
    </div>;
  return DescriptionField;
})());
interface AmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onClearError: () => void;
  currency?: string;
}
export const AmountField: React.FC<AmountFieldProps> = stryMutAct_9fa48("4881") ? () => undefined : (stryCov_9fa48("4881"), (() => {
  const AmountField: React.FC<AmountFieldProps> = ({
    value,
    onChange,
    error,
    onClearError,
    currency
  }) => <div>
        <label htmlFor="tx-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Amount {stryMutAct_9fa48("4884") ? error || <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span> : stryMutAct_9fa48("4883") ? false : stryMutAct_9fa48("4882") ? true : (stryCov_9fa48("4882", "4883", "4884"), error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>)}
        </label>
        <div className="relative">
            <input id="tx-amount" type="text" inputMode="decimal" placeholder="0.00" className={stryMutAct_9fa48("4885") ? `` : (stryCov_9fa48("4885"), `w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold placeholder:text-slate-500 transition-all ${error ? stryMutAct_9fa48("4886") ? "" : (stryCov_9fa48("4886"), 'border-rose-500 ring-1 ring-rose-500') : stryMutAct_9fa48("4887") ? "" : (stryCov_9fa48("4887"), 'border-slate-300 dark:border-slate-600')}`)} value={value} onChange={e => {
        if (stryMutAct_9fa48("4888")) {
          {}
        } else {
          stryCov_9fa48("4888");
          if (stryMutAct_9fa48("4890") ? false : stryMutAct_9fa48("4889") ? true : (stryCov_9fa48("4889", "4890"), (stryMutAct_9fa48("4894") ? /^[^0-9.,]*$/ : stryMutAct_9fa48("4893") ? /^[0-9.,]$/ : stryMutAct_9fa48("4892") ? /^[0-9.,]*/ : stryMutAct_9fa48("4891") ? /[0-9.,]*$/ : (stryCov_9fa48("4891", "4892", "4893", "4894"), /^[0-9.,]*$/)).test(e.target.value))) {
            if (stryMutAct_9fa48("4895")) {
              {}
            } else {
              stryCov_9fa48("4895");
              onChange(e.target.value);
              if (stryMutAct_9fa48("4897") ? false : stryMutAct_9fa48("4896") ? true : (stryCov_9fa48("4896", "4897"), error)) onClearError();
            }
          }
        }
      }} onBlur={() => {
        if (stryMutAct_9fa48("4898")) {
          {}
        } else {
          stryCov_9fa48("4898");
          if (stryMutAct_9fa48("4900") ? false : stryMutAct_9fa48("4899") ? true : (stryCov_9fa48("4899", "4900"), value)) onChange(fromCents(toCents(value)).toLocaleString(stryMutAct_9fa48("4901") ? "" : (stryCov_9fa48("4901"), 'en-US'), stryMutAct_9fa48("4902") ? {} : (stryCov_9fa48("4902"), {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })));
        }
      }} onFocus={() => {
        if (stryMutAct_9fa48("4903")) {
          {}
        } else {
          stryCov_9fa48("4903");
          if (stryMutAct_9fa48("4905") ? false : stryMutAct_9fa48("4904") ? true : (stryCov_9fa48("4904", "4905"), value)) onChange(value.replace(/,/g, stryMutAct_9fa48("4906") ? "Stryker was here!" : (stryCov_9fa48("4906"), '')));
        }
      }} />
            {stryMutAct_9fa48("4909") ? currency || <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{currency}</span> : stryMutAct_9fa48("4908") ? false : stryMutAct_9fa48("4907") ? true : (stryCov_9fa48("4907", "4908", "4909"), currency && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{currency}</span>)}
        </div>
    </div>;
  return AmountField;
})());
interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export const DateField: React.FC<DateFieldProps> = stryMutAct_9fa48("4910") ? () => undefined : (stryCov_9fa48("4910"), (() => {
  const DateField: React.FC<DateFieldProps> = ({
    value,
    onChange
  }) => <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Date</label>
        <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input type="date" value={value} onChange={stryMutAct_9fa48("4911") ? () => undefined : (stryCov_9fa48("4911"), e => onChange(e.target.value))} className="flex-1 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]" />
        </div>
    </div>;
  return DateField;
})());