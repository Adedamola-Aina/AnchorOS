/**
 * SharedActivitySection - Activity feed for shared accounts
 * Extracted from AccountDetailsView per CLAUDE.md §3.2
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
import { Users } from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';
import type { AccountActivity } from '../../../types/activity';
interface SharedActivitySectionProps {
  activities: AccountActivity[];
  currentUserId?: string;
  loading: boolean;
}
export const SharedActivitySection = stryMutAct_9fa48("4502") ? () => undefined : (stryCov_9fa48("4502"), (() => {
  const SharedActivitySection = ({
    activities,
    currentUserId,
    loading
  }: SharedActivitySectionProps) => <div className="glass-card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary-500" />
            <span>Recent Activity</span>
            <span className="text-[10px] font-black text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Shared
            </span>
        </h3>
        <ActivityFeed activities={activities} currentUserId={currentUserId} loading={loading} maxItems={5} />
    </div>;
  return SharedActivitySection;
})());