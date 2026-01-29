/**
 * DeveloperTools
 * 
 * Developer-only tools for seeding data and simulating scenarios.
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Logic extracted to devtools/ subfolder.
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
import { Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { SeedDataAction, SimulateFamilyAction, FixSharedAccountsAction, AutoAcceptInvitationAction } from './devtools';
interface DeveloperToolsProps {
  userUid: string;
}
export const DeveloperTools: React.FC<DeveloperToolsProps> = ({
  userUid
}) => {
  if (stryMutAct_9fa48("5703")) {
    {}
  } else {
    stryCov_9fa48("5703");
    return <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-purple-50/20 dark:bg-purple-900/10">
                <CardTitle className="text-base font-bold text-purple-900 dark:text-purple-400 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Developer Tools
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <SeedDataAction userUid={userUid} />
                <SimulateFamilyAction userUid={userUid} />
                <FixSharedAccountsAction />
                <AutoAcceptInvitationAction userUid={userUid} />
            </CardContent>
        </Card>;
  }
};