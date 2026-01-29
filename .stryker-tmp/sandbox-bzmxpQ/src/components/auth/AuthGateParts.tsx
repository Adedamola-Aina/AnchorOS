/**
 * AuthGate Loading & Gate Components
 * Extracted from AuthGate.tsx per CLAUDE.md §3.2
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
import { Mail } from 'lucide-react';
import { AnchorLogo } from '../shared';
import { OnboardingView } from '../../features/onboarding/OnboardingView';
export const AuthLoadingScreen: React.FC = stryMutAct_9fa48("555") ? () => undefined : (stryCov_9fa48("555"), (() => {
  const AuthLoadingScreen: React.FC = () => <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-6">
        <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-slate-800 dark:border-white opacity-20"></div>
            <AnchorLogo className="absolute w-10 h-10 text-slate-800 dark:text-white animate-pulse" />
        </div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 animate-pulse">Initializing Anchor OS</p>
    </div>;
  return AuthLoadingScreen;
})());
interface EmailVerificationGateProps {
  email: string;
  onResend: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}
export const EmailVerificationGate: React.FC<EmailVerificationGateProps> = stryMutAct_9fa48("556") ? () => undefined : (stryCov_9fa48("556"), (() => {
  const EmailVerificationGate: React.FC<EmailVerificationGateProps> = ({
    email,
    onResend,
    onRefresh,
    onLogout
  }) => <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto text-primary-400"><Mail className="w-8 h-8" /></div>
            <div>
                <h2 className="text-h2 lg:text-h2-lg mb-2">Verify your Email</h2>
                <p className="text-slate-400">We've sent a verification link to <span className="text-white font-medium">{email}</span>. Please check your inbox to continue.</p>
            </div>
            <div className="space-y-3">
                <button onClick={onResend} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors">Resend Email</button>
                <button onClick={onRefresh} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">I've Verified It</button>
                <button onClick={onLogout} className="w-full text-slate-500 hover:text-white text-sm">Sign Out</button>
            </div>
        </div>
    </div>;
  return EmailVerificationGate;
})());
interface OnboardingGateProps {
  show: boolean;
}
export const OnboardingGate: React.FC<OnboardingGateProps> = stryMutAct_9fa48("557") ? () => undefined : (stryCov_9fa48("557"), (() => {
  const OnboardingGate: React.FC<OnboardingGateProps> = ({
    show
  }) => show ? <OnboardingView /> : null;
  return OnboardingGate;
})());