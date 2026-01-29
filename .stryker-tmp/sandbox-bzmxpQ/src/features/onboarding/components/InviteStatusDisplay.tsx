/**
 * InviteStatusDisplay - Displays various states of the invitation flow
 * 
 * Handles: validating, invalid, locked, and awaiting_confirmation states.
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
import { Loader2, AlertCircle, CheckCircle, Lock } from 'lucide-react';
interface InviteStatusDisplayProps {
  status: 'validating' | 'invalid' | 'locked' | 'awaiting_confirmation';
  error?: string;
  ownerName?: string;
}
export function InviteStatusDisplay({
  status,
  error,
  ownerName
}: InviteStatusDisplayProps) {
  if (stryMutAct_9fa48("5342")) {
    {}
  } else {
    stryCov_9fa48("5342");
    if (stryMutAct_9fa48("5345") ? status !== 'validating' : stryMutAct_9fa48("5344") ? false : stryMutAct_9fa48("5343") ? true : (stryCov_9fa48("5343", "5344", "5345"), status === (stryMutAct_9fa48("5346") ? "" : (stryCov_9fa48("5346"), 'validating')))) {
      if (stryMutAct_9fa48("5347")) {
        {}
      } else {
        stryCov_9fa48("5347");
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-slate-900 dark:text-white animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Checking invitation...</p>
                </div>
            </div>;
      }
    }
    if (stryMutAct_9fa48("5350") ? status !== 'invalid' : stryMutAct_9fa48("5349") ? false : stryMutAct_9fa48("5348") ? true : (stryCov_9fa48("5348", "5349", "5350"), status === (stryMutAct_9fa48("5351") ? "" : (stryCov_9fa48("5351"), 'invalid')))) {
      if (stryMutAct_9fa48("5352")) {
        {}
      } else {
        stryCov_9fa48("5352");
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Invitation Invalid</h2>
                    <p className="text-slate-500 dark:text-slate-400">{error}</p>
                    <button onClick={stryMutAct_9fa48("5353") ? () => undefined : (stryCov_9fa48("5353"), () => window.location.href = stryMutAct_9fa48("5354") ? "" : (stryCov_9fa48("5354"), '/'))} className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-900 dark:text-white font-bold transition-all w-full">
                        Go Home
                    </button>
                </div>
            </div>;
      }
    }
    if (stryMutAct_9fa48("5357") ? status !== 'locked' : stryMutAct_9fa48("5356") ? false : stryMutAct_9fa48("5355") ? true : (stryCov_9fa48("5355", "5356", "5357"), status === (stryMutAct_9fa48("5358") ? "" : (stryCov_9fa48("5358"), 'locked')))) {
      if (stryMutAct_9fa48("5359")) {
        {}
      } else {
        stryCov_9fa48("5359");
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Invitation Locked</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {stryMutAct_9fa48("5362") ? error && 'Too many failed verification attempts. Please ask the sender to create a new invitation.' : stryMutAct_9fa48("5361") ? false : stryMutAct_9fa48("5360") ? true : (stryCov_9fa48("5360", "5361", "5362"), error || (stryMutAct_9fa48("5363") ? "" : (stryCov_9fa48("5363"), 'Too many failed verification attempts. Please ask the sender to create a new invitation.')))}
                    </p>
                    <button onClick={stryMutAct_9fa48("5364") ? () => undefined : (stryCov_9fa48("5364"), () => window.location.href = stryMutAct_9fa48("5365") ? "" : (stryCov_9fa48("5365"), '/'))} className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-900 dark:text-white font-bold transition-all w-full">
                        Go Home
                    </button>
                </div>
            </div>;
      }
    }

    // awaiting_confirmation
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">You're All Set!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Waiting for <span className="font-semibold">{ownerName}</span> to confirm the connection.
                    </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm text-slate-600 dark:text-slate-300">
                    <p>You'll receive a notification when they confirm. This usually happens quickly.</p>
                </div>
                <button onClick={stryMutAct_9fa48("5366") ? () => undefined : (stryCov_9fa48("5366"), () => window.location.href = stryMutAct_9fa48("5367") ? "" : (stryCov_9fa48("5367"), '/'))} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold shadow-lg transition-all">
                    Continue to App
                </button>
            </div>
        </div>;
  }
}