/**
 * InviteCodeEntry - Manual verification code entry form
 * 
 * Handles the 6-digit code input with validation.
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
import { AlertCircle } from 'lucide-react';
interface InviteCodeEntryProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  attemptsRemaining: number;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}
export function InviteCodeEntry({
  verificationCode,
  setVerificationCode,
  attemptsRemaining,
  error,
  onSubmit,
  onBack
}: InviteCodeEntryProps) {
  if (stryMutAct_9fa48("5318")) {
    {}
  } else {
    stryCov_9fa48("5318");
    return <form onSubmit={onSubmit} className="space-y-6">
            <div className="text-center">
                <h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Enter Verification Code</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Enter the 6-digit code found in your invitation email.
                </p>
            </div>

            <div>
                <input type="text" value={verificationCode} onChange={e => {
          if (stryMutAct_9fa48("5319")) {
            {}
          } else {
            stryCov_9fa48("5319");
            const val = stryMutAct_9fa48("5320") ? e.target.value.replace(/\D/g, '') : (stryCov_9fa48("5320"), e.target.value.replace(stryMutAct_9fa48("5321") ? /\d/g : (stryCov_9fa48("5321"), /\D/g), stryMutAct_9fa48("5322") ? "Stryker was here!" : (stryCov_9fa48("5322"), '')).slice(0, 6));
            setVerificationCode(val);
          }
        }} placeholder="000000" className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] py-4 px-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={6} autoFocus />
                <p className="text-xs text-slate-400 text-center mt-2">
                    {attemptsRemaining} attempt{(stryMutAct_9fa48("5325") ? attemptsRemaining !== 1 : stryMutAct_9fa48("5324") ? false : stryMutAct_9fa48("5323") ? true : (stryCov_9fa48("5323", "5324", "5325"), attemptsRemaining === 1)) ? stryMutAct_9fa48("5326") ? "Stryker was here!" : (stryCov_9fa48("5326"), '') : stryMutAct_9fa48("5327") ? "" : (stryCov_9fa48("5327"), 's')} remaining
                </p>
            </div>

            {stryMutAct_9fa48("5330") ? error || <div className="flex items-center gap-2 justify-center text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div> : stryMutAct_9fa48("5329") ? false : stryMutAct_9fa48("5328") ? true : (stryCov_9fa48("5328", "5329", "5330"), error && <div className="flex items-center gap-2 justify-center text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>)}

            <div className="flex gap-3">
                <button type="button" onClick={onBack} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-bold transition-all">
                    Back
                </button>
                <button type="submit" disabled={stryMutAct_9fa48("5333") ? verificationCode.length === 6 : stryMutAct_9fa48("5332") ? false : stryMutAct_9fa48("5331") ? true : (stryCov_9fa48("5331", "5332", "5333"), verificationCode.length !== 6)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    Verify
                </button>
            </div>
        </form>;
  }
}