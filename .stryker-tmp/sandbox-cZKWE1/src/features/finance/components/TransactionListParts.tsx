/**
 * TransactionListVirtual Parts
 * Extracted from TransactionListVirtual.tsx per CLAUDE.md §3.2
 * Note: TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem
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
import { Search, Pencil } from 'lucide-react';
interface FilterHeaderProps {
  searchQuery: string;
  filterType: 'all' | 'income' | 'expense';
  hasWeekFilter: boolean;
  onSearchChange: (q: string) => void;
  onFilterChange: (f: 'all' | 'income' | 'expense') => void;
}
export const TransactionFilterHeader: React.FC<FilterHeaderProps> = stryMutAct_9fa48("4675") ? () => undefined : (stryCov_9fa48("4675"), (() => {
  const TransactionFilterHeader: React.FC<FilterHeaderProps> = ({
    searchQuery,
    filterType,
    hasWeekFilter,
    onSearchChange,
    onFilterChange
  }) => <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            History {stryMutAct_9fa48("4678") ? hasWeekFilter || <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Filtered by Week</span> : stryMutAct_9fa48("4677") ? false : stryMutAct_9fa48("4676") ? true : (stryCov_9fa48("4676", "4677", "4678"), hasWeekFilter && <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Filtered by Week</span>)}
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={stryMutAct_9fa48("4679") ? () => undefined : (stryCov_9fa48("4679"), e => onSearchChange(e.target.value))} className="w-full sm:w-48 pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white" />
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {(['all', 'expense', 'income'] as const).map(stryMutAct_9fa48("4680") ? () => undefined : (stryCov_9fa48("4680"), type => <button key={type} onClick={stryMutAct_9fa48("4681") ? () => undefined : (stryCov_9fa48("4681"), () => onFilterChange(type))} className={stryMutAct_9fa48("4682") ? `` : (stryCov_9fa48("4682"), `px-3 py-1.5 text-xs font-bold rounded-md transition-all ${(stryMutAct_9fa48("4685") ? filterType !== type : stryMutAct_9fa48("4684") ? false : stryMutAct_9fa48("4683") ? true : (stryCov_9fa48("4683", "4684", "4685"), filterType === type)) ? stryMutAct_9fa48("4686") ? "" : (stryCov_9fa48("4686"), 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white') : stryMutAct_9fa48("4687") ? "" : (stryCov_9fa48("4687"), 'text-slate-400')}`)}>
                        {(stryMutAct_9fa48("4690") ? type !== 'all' : stryMutAct_9fa48("4689") ? false : stryMutAct_9fa48("4688") ? true : (stryCov_9fa48("4688", "4689", "4690"), type === (stryMutAct_9fa48("4691") ? "" : (stryCov_9fa48("4691"), 'all')))) ? stryMutAct_9fa48("4692") ? "" : (stryCov_9fa48("4692"), 'All') : (stryMutAct_9fa48("4695") ? type !== 'expense' : stryMutAct_9fa48("4694") ? false : stryMutAct_9fa48("4693") ? true : (stryCov_9fa48("4693", "4694", "4695"), type === (stryMutAct_9fa48("4696") ? "" : (stryCov_9fa48("4696"), 'expense')))) ? stryMutAct_9fa48("4697") ? "" : (stryCov_9fa48("4697"), 'Out') : stryMutAct_9fa48("4698") ? "" : (stryCov_9fa48("4698"), 'In')}
                    </button>))}
            </div>
        </div>
    </div>;
  return TransactionFilterHeader;
})());
interface NameHistoryEntry {
  oldName: string;
  newName: string;
  date: string;
  actorName: string;
}
interface NameHistoryProps {
  entries: NameHistoryEntry[];
}
export const AccountNameHistory: React.FC<NameHistoryProps> = stryMutAct_9fa48("4699") ? () => undefined : (stryCov_9fa48("4699"), (() => {
  const AccountNameHistory: React.FC<NameHistoryProps> = ({
    entries
  }) => <div className="border-b border-amber-100 dark:border-amber-900/30">
        {stryMutAct_9fa48("4701") ? entries.reverse().map((entry, idx) => <div key={`rename-${idx}`} className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl"><Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-amber-900 dark:text-amber-200">Account renamed</p><p className="text-xs text-amber-700/70 dark:text-amber-400/70"><span className="line-through">{entry.oldName}</span><span className="mx-2">→</span><span className="font-semibold">{entry.newName}</span></p></div>
                <div className="text-right text-xs text-amber-600/60 dark:text-amber-400/60"><p>{new Date(entry.date).toLocaleDateString()}</p><p>by {entry.actorName}</p></div>
            </div>) : stryMutAct_9fa48("4700") ? entries.slice().map((entry, idx) => <div key={`rename-${idx}`} className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl"><Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-amber-900 dark:text-amber-200">Account renamed</p><p className="text-xs text-amber-700/70 dark:text-amber-400/70"><span className="line-through">{entry.oldName}</span><span className="mx-2">→</span><span className="font-semibold">{entry.newName}</span></p></div>
                <div className="text-right text-xs text-amber-600/60 dark:text-amber-400/60"><p>{new Date(entry.date).toLocaleDateString()}</p><p>by {entry.actorName}</p></div>
            </div>) : (stryCov_9fa48("4700", "4701"), entries.slice().reverse().map(stryMutAct_9fa48("4702") ? () => undefined : (stryCov_9fa48("4702"), (entry, idx) => <div key={stryMutAct_9fa48("4703") ? `` : (stryCov_9fa48("4703"), `rename-${idx}`)} className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl"><Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-amber-900 dark:text-amber-200">Account renamed</p><p className="text-xs text-amber-700/70 dark:text-amber-400/70"><span className="line-through">{entry.oldName}</span><span className="mx-2">→</span><span className="font-semibold">{entry.newName}</span></p></div>
                <div className="text-right text-xs text-amber-600/60 dark:text-amber-400/60"><p>{new Date(entry.date).toLocaleDateString()}</p><p>by {entry.actorName}</p></div>
            </div>)))}
    </div>;
  return AccountNameHistory;
})());

// TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem instead