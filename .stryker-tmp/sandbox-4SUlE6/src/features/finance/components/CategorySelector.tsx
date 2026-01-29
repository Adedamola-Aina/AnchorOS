/**
 * CategorySelector
 * 
 * Category input with datalist suggestions and smart category hints.
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
import { CategoryIcon } from '../../../components/shared';
const DEFAULT_CATEGORIES = stryMutAct_9fa48("4394") ? [] : (stryCov_9fa48("4394"), [stryMutAct_9fa48("4395") ? "" : (stryCov_9fa48("4395"), 'General'), stryMutAct_9fa48("4396") ? "" : (stryCov_9fa48("4396"), 'Food'), stryMutAct_9fa48("4397") ? "" : (stryCov_9fa48("4397"), 'Groceries'), stryMutAct_9fa48("4398") ? "" : (stryCov_9fa48("4398"), 'Transport'), stryMutAct_9fa48("4399") ? "" : (stryCov_9fa48("4399"), 'Housing'), stryMutAct_9fa48("4400") ? "" : (stryCov_9fa48("4400"), 'Utilities'), stryMutAct_9fa48("4401") ? "" : (stryCov_9fa48("4401"), 'Health'), stryMutAct_9fa48("4402") ? "" : (stryCov_9fa48("4402"), 'Entertainment'), stryMutAct_9fa48("4403") ? "" : (stryCov_9fa48("4403"), 'Travel'), stryMutAct_9fa48("4404") ? "" : (stryCov_9fa48("4404"), 'Education'), stryMutAct_9fa48("4405") ? "" : (stryCov_9fa48("4405"), 'Salary'), stryMutAct_9fa48("4406") ? "" : (stryCov_9fa48("4406"), 'Investments'), stryMutAct_9fa48("4407") ? "" : (stryCov_9fa48("4407"), 'Shopping'), stryMutAct_9fa48("4408") ? "" : (stryCov_9fa48("4408"), 'Personal Care')]);
interface CategorySelectorProps {
  category: string;
  onChange: (category: string) => void;
  suggestedCategory: string | null;
  onAcceptSuggestion: () => void;
  error?: string;
}
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  onChange,
  suggestedCategory,
  onAcceptSuggestion,
  error
}) => {
  if (stryMutAct_9fa48("4409")) {
    {}
  } else {
    stryCov_9fa48("4409");
    return <div>
            <label htmlFor="tx-category" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Category
                {stryMutAct_9fa48("4412") ? error || <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span> : stryMutAct_9fa48("4411") ? false : stryMutAct_9fa48("4410") ? true : (stryCov_9fa48("4410", "4411", "4412"), error && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{error}</span>)}
            </label>
            <div className="flex items-center gap-3 relative">
                <CategoryIcon category={category} size={14} className="scale-110" />
                <div className="flex-1 relative">
                    <select id="tx-category" value={category} onChange={stryMutAct_9fa48("4413") ? () => undefined : (stryCov_9fa48("4413"), e => onChange(e.target.value))} className={stryMutAct_9fa48("4414") ? `` : (stryCov_9fa48("4414"), `w-full p-3 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer appearance-none ${error ? stryMutAct_9fa48("4415") ? "" : (stryCov_9fa48("4415"), 'border-rose-500 ring-1 ring-rose-500') : stryMutAct_9fa48("4416") ? "" : (stryCov_9fa48("4416"), 'border-slate-300 dark:border-slate-600')}`)}>
                        {DEFAULT_CATEGORIES.map(stryMutAct_9fa48("4417") ? () => undefined : (stryCov_9fa48("4417"), cat => <option key={cat} value={cat}>{cat}</option>))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {stryMutAct_9fa48("4420") ? suggestedCategory && suggestedCategory !== category || <button type="button" onClick={onAcceptSuggestion} className="absolute -bottom-6 left-0 text-[10px] text-blue-500 hover:text-blue-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                            💡 Use "{suggestedCategory}" like before?
                        </button> : stryMutAct_9fa48("4419") ? false : stryMutAct_9fa48("4418") ? true : (stryCov_9fa48("4418", "4419", "4420"), (stryMutAct_9fa48("4422") ? suggestedCategory || suggestedCategory !== category : stryMutAct_9fa48("4421") ? true : (stryCov_9fa48("4421", "4422"), suggestedCategory && (stryMutAct_9fa48("4424") ? suggestedCategory === category : stryMutAct_9fa48("4423") ? true : (stryCov_9fa48("4423", "4424"), suggestedCategory !== category)))) && <button type="button" onClick={onAcceptSuggestion} className="absolute -bottom-6 left-0 text-[10px] text-blue-500 hover:text-blue-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                            💡 Use "{suggestedCategory}" like before?
                        </button>)}
                </div>
            </div>
        </div>;
  }
};
export { DEFAULT_CATEGORIES };