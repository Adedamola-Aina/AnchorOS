/**
 * InviteEmailStep - Step 1 of family invitation flow
 * 
 * Collects the invitee's email address.
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
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface InviteEmailStepProps {
  inviteeEmail: string;
  setInviteeEmail: (email: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}
export function InviteEmailStep({
  inviteeEmail,
  setInviteeEmail,
  error,
  onSubmit
}: InviteEmailStepProps) {
  if (stryMutAct_9fa48("5825")) {
    {}
  } else {
    stryCov_9fa48("5825");
    return <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Family Member's Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" value={inviteeEmail} onChange={stryMutAct_9fa48("5826") ? () => undefined : (stryCov_9fa48("5826"), e => setInviteeEmail(e.target.value))} placeholder="spouse@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500" autoFocus />
                </div>
            </div>

            {stryMutAct_9fa48("5829") ? error || <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div> : stryMutAct_9fa48("5828") ? false : stryMutAct_9fa48("5827") ? true : (stryCov_9fa48("5827", "5828", "5829"), error && <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>)}

            <Button type="submit" className="w-full gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
            </Button>
        </form>;
  }
}