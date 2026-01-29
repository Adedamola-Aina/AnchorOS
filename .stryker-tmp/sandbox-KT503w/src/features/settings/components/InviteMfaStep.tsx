/**
 * InviteMfaStep - Step 2.5 of family invitation flow
 * 
 * Handles MFA verification when required during invitation.
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
import { KeyRound, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface InviteMfaStepProps {
  mfaCode: string;
  setMfaCode: (code: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}
export function InviteMfaStep({
  mfaCode,
  setMfaCode,
  error,
  loading,
  onSubmit,
  onBack
}: InviteMfaStepProps) {
  if (stryMutAct_9fa48("5974")) {
    {}
  } else {
    stryCov_9fa48("5974");
    return <form onSubmit={onSubmit} className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <KeyRound className="w-5 h-5" />
                    <p className="font-semibold">Two-Factor Authentication Required</p>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Enter the 6-digit code from your authenticator app.
                </p>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Authenticator Code
                </label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={mfaCode} onChange={stryMutAct_9fa48("5975") ? () => undefined : (stryCov_9fa48("5975"), e => setMfaCode(e.target.value.replace(stryMutAct_9fa48("5976") ? /\d/g : (stryCov_9fa48("5976"), /\D/g), stryMutAct_9fa48("5977") ? "Stryker was here!" : (stryCov_9fa48("5977"), ''))))} placeholder="000000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-2xl tracking-[0.3em] font-mono" autoFocus />
                </div>
            </div>

            {stryMutAct_9fa48("5980") ? error || <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div> : stryMutAct_9fa48("5979") ? false : stryMutAct_9fa48("5978") ? true : (stryCov_9fa48("5978", "5979", "5980"), error && <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>)}

            <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
                    Back
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={stryMutAct_9fa48("5983") ? loading && mfaCode.length !== 6 : stryMutAct_9fa48("5982") ? false : stryMutAct_9fa48("5981") ? true : (stryCov_9fa48("5981", "5982", "5983"), loading || (stryMutAct_9fa48("5985") ? mfaCode.length === 6 : stryMutAct_9fa48("5984") ? false : (stryCov_9fa48("5984", "5985"), mfaCode.length !== 6)))}>
                    {loading ? <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                        </> : <>
                            Verify & Send
                            <ArrowRight className="w-4 h-4" />
                        </>}
                </Button>
            </div>
        </form>;
  }
}