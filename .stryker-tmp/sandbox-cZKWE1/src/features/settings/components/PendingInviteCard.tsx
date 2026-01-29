/**
 * PendingInviteCard - Shows when waiting for invitee to accept
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
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface PendingInviteCardProps {
  inviteeEmail: string;
  createdAt: string;
  onCancelInvite: () => void;
}
export function PendingInviteCard({
  inviteeEmail,
  createdAt,
  onCancelInvite
}: PendingInviteCardProps) {
  if (stryMutAct_9fa48("6243")) {
    {}
  } else {
    stryCov_9fa48("6243");
    return <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-400 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg animate-pulse">
                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    Invitation Pending
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Waiting for <span className="font-semibold">{inviteeEmail}</span> to accept and enter the verification code.
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Sent {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="secondary" onClick={onCancelInvite} className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20">
                        Cancel Invitation
                    </Button>
                </div>
            </CardContent>
        </Card>;
  }
}