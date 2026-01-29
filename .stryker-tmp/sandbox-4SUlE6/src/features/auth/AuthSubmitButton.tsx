/**
 * AuthSubmitButton - Submit button for auth forms
 * 
 * Displays appropriate icon and text based on auth mode.
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
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';
type AuthMode = 'login' | 'signup' | 'mfa' | 'reset';
interface AuthSubmitButtonProps {
  authMode: AuthMode;
  isAuthenticating: boolean;
}
export function AuthSubmitButton({
  authMode,
  isAuthenticating
}: AuthSubmitButtonProps) {
  if (stryMutAct_9fa48("2007")) {
    {}
  } else {
    stryCov_9fa48("2007");
    const icons = stryMutAct_9fa48("2008") ? {} : (stryCov_9fa48("2008"), {
      login: <LogIn className="w-5 h-5" />,
      signup: <UserPlus className="w-5 h-5" />,
      reset: <Mail className="w-5 h-5" />,
      mfa: <Lock className="w-5 h-5" />
    });
    const labels = stryMutAct_9fa48("2009") ? {} : (stryCov_9fa48("2009"), {
      login: stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'Sign In'),
      signup: stryMutAct_9fa48("2011") ? "" : (stryCov_9fa48("2011"), 'Create Account'),
      reset: stryMutAct_9fa48("2012") ? "" : (stryCov_9fa48("2012"), 'Send Link'),
      mfa: stryMutAct_9fa48("2013") ? "" : (stryCov_9fa48("2013"), 'Verify Securely')
    });
    return <button type="submit" disabled={isAuthenticating} className="w-full py-4 px-6 bg-slate-800 dark:bg-white dark:text-slate-950 text-white font-bold rounded-2xl transition-all hover:bg-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-3">
            {isAuthenticating ? <>
                    <div className="w-5 h-5 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
                    <span className="uppercase tracking-widest text-[10px] font-black">Processing...</span>
                </> : <>
                    {icons[authMode]}
                    <span className="uppercase tracking-widest text-[10px] font-black">{labels[authMode]}</span>
                </>}
        </button>;
  }
}