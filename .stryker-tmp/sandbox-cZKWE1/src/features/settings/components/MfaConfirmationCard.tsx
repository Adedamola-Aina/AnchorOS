/**
 * MfaConfirmationCard - MFA verification step for family connection confirmation
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
import { Lock, AlertCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface MfaConfirmationCardProps {
  inviteeEmail: string;
  mfaCode: string;
  setMfaCode: (code: string) => void;
  error: string;
  confirmingConnection: boolean;
  onMfaSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}
export function MfaConfirmationCard({
  inviteeEmail,
  mfaCode,
  setMfaCode,
  error,
  confirmingConnection,
  onMfaSubmit,
  onBack
}: MfaConfirmationCardProps) {
  if (stryMutAct_9fa48("5996")) {
    {}
  } else {
    stryCov_9fa48("5996");
    return <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-blue-900 dark:text-blue-400 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Two-Factor Authentication
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <form onSubmit={onMfaSubmit} className="space-y-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Connecting with: <span className="font-semibold">{inviteeEmail}</span></p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">✓ Password verified • MFA required</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Enter 2FA Code</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" inputMode="numeric" value={mfaCode} onChange={e => {
                if (stryMutAct_9fa48("5997")) {
                  {}
                } else {
                  stryCov_9fa48("5997");
                  // Only allow numeric input
                  const value = e.target.value.replace(stryMutAct_9fa48("5998") ? /[0-9]/g : (stryCov_9fa48("5998"), /[^0-9]/g), stryMutAct_9fa48("5999") ? "Stryker was here!" : (stryCov_9fa48("5999"), ''));
                  setMfaCode(value);
                }
              }} placeholder="000000" maxLength={6} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xl tracking-widest text-center" autoFocus autoComplete="one-time-code" />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">Enter the 6-digit code from your authenticator app</p>
                    </div>
                    {stryMutAct_9fa48("6002") ? error || <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div> : stryMutAct_9fa48("6001") ? false : stryMutAct_9fa48("6000") ? true : (stryCov_9fa48("6000", "6001", "6002"), error && <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>)}
                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" onClick={onBack} className="flex-1 gap-2">
                            <ArrowLeft className="w-4 h-4" />Back
                        </Button>
                        <Button type="submit" disabled={stryMutAct_9fa48("6005") ? confirmingConnection && mfaCode.length !== 6 : stryMutAct_9fa48("6004") ? false : stryMutAct_9fa48("6003") ? true : (stryCov_9fa48("6003", "6004", "6005"), confirmingConnection || (stryMutAct_9fa48("6007") ? mfaCode.length === 6 : stryMutAct_9fa48("6006") ? false : (stryCov_9fa48("6006", "6007"), mfaCode.length !== 6)))} className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
                            {confirmingConnection ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : <>Confirm<ArrowRight className="w-4 h-4" /></>}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>;
  }
}