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
import { AlertCircle } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface DangerZoneProps {
  onDeleteAccount: () => Promise<void>;
}
export const DangerZone: React.FC<DangerZoneProps> = ({
  onDeleteAccount
}) => {
  if (stryMutAct_9fa48("5657")) {
    {}
  } else {
    stryCov_9fa48("5657");
    const {
      confirm
    } = useNotifications();
    return <Card className="overflow-hidden border-2 border-rose-100 dark:border-rose-900/20">
            <CardHeader className="p-6 border-b border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10">
                <CardTitle className="text-base font-bold text-rose-900 dark:text-rose-400 flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Delete Account</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button onClick={async () => {
            if (stryMutAct_9fa48("5658")) {
              {}
            } else {
              stryCov_9fa48("5658");
              if (stryMutAct_9fa48("5660") ? false : stryMutAct_9fa48("5659") ? true : (stryCov_9fa48("5659", "5660"), await confirm(stryMutAct_9fa48("5661") ? {} : (stryCov_9fa48("5661"), {
                title: stryMutAct_9fa48("5662") ? "" : (stryCov_9fa48("5662"), 'Delete Account?'),
                message: stryMutAct_9fa48("5663") ? "" : (stryCov_9fa48("5663"), 'This will permanently delete your user profile, all accounts, transactions, and cancel all family connections. There is no going back.'),
                confirmText: stryMutAct_9fa48("5664") ? "" : (stryCov_9fa48("5664"), 'Permanently Delete'),
                type: stryMutAct_9fa48("5665") ? "" : (stryCov_9fa48("5665"), 'danger')
              })))) {
                if (stryMutAct_9fa48("5666")) {
                  {}
                } else {
                  stryCov_9fa48("5666");
                  await onDeleteAccount();
                }
              }
            }
          }} variant="primary" className="bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 h-11 px-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>;
  }
};