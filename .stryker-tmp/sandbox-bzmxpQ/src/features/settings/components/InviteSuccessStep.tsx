/**
 * InviteSuccessStep - Step 3 of family invitation flow
 * 
 * Displays the verification code after successful invitation.
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
import { Copy, Check } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface InviteSuccessStepProps {
  inviteeEmail: string;
  verificationCode: string;
  copied: boolean;
  onCopyCode: () => void;
  onDone: () => void;
}
export function InviteSuccessStep({
  inviteeEmail,
  verificationCode,
  copied,
  onCopyCode,
  onDone
}: InviteSuccessStepProps) {
  if (stryMutAct_9fa48("5995")) {
    {}
  } else {
    stryCov_9fa48("5995");
    return <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">Invitation Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    An email has been sent to <span className="font-semibold">{inviteeEmail}</span>
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
                    Verification Code
                </p>
                <div className="flex items-center justify-center gap-2">
                    <code className="text-4xl font-mono font-bold tracking-[0.5em] text-slate-900 dark:text-white">
                        {verificationCode}
                    </code>
                    <button onClick={onCopyCode} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
                    </button>
                </div>
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                    For convenience, this code has also been included in the invitation email.
                </p>
            </div>

            <Button onClick={onDone} className="w-full">
                Done
            </Button>
        </div>;
  }
}