/**
 * EmptyAccountsState - Empty state for when no accounts exist
 * Extracted from FinanceView per CLAUDE.md 200-line rule
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
import { Landmark, Plus } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface EmptyAccountsStateProps {
  onCreateAccount: () => void;
}
export const EmptyAccountsState = ({
  onCreateAccount
}: EmptyAccountsStateProps) => {
  if (stryMutAct_9fa48("4425")) {
    {}
  } else {
    stryCov_9fa48("4425");
    return <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
                    <Landmark className="w-10 h-10 text-emerald-500/60 dark:text-emerald-400/60" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                </div>
            </div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-2">No accounts yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6 text-sm">
                Create your first account to start tracking your finances.
            </p>
            <Button variant="secondary" onClick={onCreateAccount} className="gap-2 text-finance-600 border-finance-200 hover:bg-finance-50 dark:text-finance-400 dark:border-finance-800 dark:hover:bg-finance-950">
                <Landmark className="w-4 h-4" />
                <span>Create your first account</span>
            </Button>
        </div>;
  }
};