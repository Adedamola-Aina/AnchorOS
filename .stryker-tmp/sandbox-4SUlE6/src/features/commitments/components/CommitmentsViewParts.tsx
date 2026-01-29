/**
 * CommitmentsView Empty State & Helpers
 * Extracted from CommitmentsView.tsx per CLAUDE.md §3.2
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
import { Plus, CheckCircle2, LayoutList, CalendarDays } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface EmptyStateProps {
  filter: string;
  hasFamilyActive: boolean;
  onCreateFirst: () => void;
  onLearnMore: () => void;
}
export const CommitmentsEmptyState: React.FC<EmptyStateProps> = stryMutAct_9fa48("2352") ? () => undefined : (stryCov_9fa48("2352"), (() => {
  const CommitmentsEmptyState: React.FC<EmptyStateProps> = ({
    filter,
    hasFamilyActive,
    onCreateFirst,
    onLearnMore
  }) => <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-task-500/60 dark:text-task-400/60" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"><Plus className="w-4 h-4 text-emerald-500" /></div>
        </div>
        <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-2">{(stryMutAct_9fa48("2355") ? filter !== 'all' : stryMutAct_9fa48("2354") ? false : stryMutAct_9fa48("2353") ? true : (stryCov_9fa48("2353", "2354", "2355"), filter === (stryMutAct_9fa48("2356") ? "" : (stryCov_9fa48("2356"), 'all')))) ? stryMutAct_9fa48("2357") ? "" : (stryCov_9fa48("2357"), 'Welcome to your Commitments') : stryMutAct_9fa48("2358") ? `` : (stryCov_9fa48("2358"), `No ${filter} commitments`)}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
            {(stryMutAct_9fa48("2361") ? filter !== 'all' : stryMutAct_9fa48("2360") ? false : stryMutAct_9fa48("2359") ? true : (stryCov_9fa48("2359", "2360", "2361"), filter === (stryMutAct_9fa48("2362") ? "" : (stryCov_9fa48("2362"), 'all')))) ? hasFamilyActive ? stryMutAct_9fa48("2363") ? "" : (stryCov_9fa48("2363"), "This is where you'll build consistency. Commitments are recurring obligations that keep you and your family on track.") : stryMutAct_9fa48("2364") ? "" : (stryCov_9fa48("2364"), "This is where you'll build consistency. Commitments are recurring obligations that keep you on track.") : stryMutAct_9fa48("2365") ? `` : (stryCov_9fa48("2365"), `You don't have any ${filter} commitments. Create one to get started.`)}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onCreateFirst} className="gap-3" size="lg"><Plus className="w-5 h-4" /><span>Create First Commitment</span></Button>
            <Button onClick={onLearnMore} variant="secondary" size="lg">Learn More</Button>
        </div>
    </div>;
  return CommitmentsEmptyState;
})());
interface FilterBarProps {
  filter: string;
  viewMode: string;
  onFilterChange: (f: 'all' | 'daily' | 'weekly' | 'monthly' | 'todo') => void;
  onViewChange: (v: 'list' | 'calendar') => void;
}
export const CommitmentsFilterBar: React.FC<FilterBarProps> = stryMutAct_9fa48("2366") ? () => undefined : (stryCov_9fa48("2366"), (() => {
  const CommitmentsFilterBar: React.FC<FilterBarProps> = ({
    filter,
    viewMode,
    onFilterChange,
    onViewChange
  }) => <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mb-2">
            {(['all', 'daily', 'weekly', 'monthly', 'todo'] as const).map(stryMutAct_9fa48("2367") ? () => undefined : (stryCov_9fa48("2367"), f => <Button key={f} onClick={stryMutAct_9fa48("2368") ? () => undefined : (stryCov_9fa48("2368"), () => onFilterChange(f))} variant={(stryMutAct_9fa48("2371") ? filter !== f : stryMutAct_9fa48("2370") ? false : stryMutAct_9fa48("2369") ? true : (stryCov_9fa48("2369", "2370", "2371"), filter === f)) ? stryMutAct_9fa48("2372") ? "" : (stryCov_9fa48("2372"), 'primary') : stryMutAct_9fa48("2373") ? "" : (stryCov_9fa48("2373"), 'secondary')} size="sm" className="capitalize uppercase tracking-widest text-[10px]">{f}</Button>))}
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
            <button onClick={stryMutAct_9fa48("2374") ? () => undefined : (stryCov_9fa48("2374"), () => onViewChange(stryMutAct_9fa48("2375") ? "" : (stryCov_9fa48("2375"), 'list')))} className={stryMutAct_9fa48("2376") ? `` : (stryCov_9fa48("2376"), `p-3 sm:p-2 rounded-md transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${(stryMutAct_9fa48("2379") ? viewMode !== 'list' : stryMutAct_9fa48("2378") ? false : stryMutAct_9fa48("2377") ? true : (stryCov_9fa48("2377", "2378", "2379"), viewMode === (stryMutAct_9fa48("2380") ? "" : (stryCov_9fa48("2380"), 'list')))) ? stryMutAct_9fa48("2381") ? "" : (stryCov_9fa48("2381"), 'bg-white dark:bg-slate-600 shadow-sm text-task-600 dark:text-task-400') : stryMutAct_9fa48("2382") ? "" : (stryCov_9fa48("2382"), 'text-slate-400')}`)} title="List View" aria-label="List View"><LayoutList className="w-4 h-4" /></button>
            <button onClick={stryMutAct_9fa48("2383") ? () => undefined : (stryCov_9fa48("2383"), () => onViewChange(stryMutAct_9fa48("2384") ? "" : (stryCov_9fa48("2384"), 'calendar')))} className={stryMutAct_9fa48("2385") ? `` : (stryCov_9fa48("2385"), `p-3 sm:p-2 rounded-md transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${(stryMutAct_9fa48("2388") ? viewMode !== 'calendar' : stryMutAct_9fa48("2387") ? false : stryMutAct_9fa48("2386") ? true : (stryCov_9fa48("2386", "2387", "2388"), viewMode === (stryMutAct_9fa48("2389") ? "" : (stryCov_9fa48("2389"), 'calendar')))) ? stryMutAct_9fa48("2390") ? "" : (stryCov_9fa48("2390"), 'bg-white dark:bg-slate-600 shadow-sm text-task-600 dark:text-task-400') : stryMutAct_9fa48("2391") ? "" : (stryCov_9fa48("2391"), 'text-slate-400')}`)} title="Week View" aria-label="Week View"><CalendarDays className="w-4 h-4" /></button>
        </div>
    </div>;
  return CommitmentsFilterBar;
})());