/**
 * SettingsView Notification Banners
 * Extracted from SettingsView.tsx per CLAUDE.md §3.2
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
import { AlertCircle } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface VerifyEmailBannerProps {
  isResending: boolean;
  onResend: () => void;
}
export const VerifyEmailBanner: React.FC<VerifyEmailBannerProps> = stryMutAct_9fa48("6344") ? () => undefined : (stryCov_9fa48("6344"), (() => {
  const VerifyEmailBanner: React.FC<VerifyEmailBannerProps> = ({
    isResending,
    onResend
  }) => <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-3xl text-red-700 dark:text-red-400">
        <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
                <h4 className="font-black uppercase tracking-wider text-[10px]">Email Not Verified</h4>
                <p className="text-sm opacity-80 mt-1">Please verify your email to secure your identity and enable full access.</p>
            </div>
        </div>
        <Button variant="primary" onClick={onResend} isLoading={isResending} className="bg-red-500 hover:bg-red-600 shadow-red-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]">
            Verify Now
        </Button>
    </div>;
  return VerifyEmailBanner;
})());
interface EnableMfaBannerProps {
  onEnable: () => void;
}
export const EnableMfaBanner: React.FC<EnableMfaBannerProps> = stryMutAct_9fa48("6345") ? () => undefined : (stryCov_9fa48("6345"), (() => {
  const EnableMfaBanner: React.FC<EnableMfaBannerProps> = ({
    onEnable
  }) => <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl text-blue-700 dark:text-blue-400">
        <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
                <h4 className="font-black uppercase tracking-wider text-[10px]">MFA Recommended</h4>
                <p className="text-sm opacity-80 mt-1">Protect your account with two-factor authentication.</p>
            </div>
        </div>
        <Button variant="primary" onClick={onEnable} className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]">
            Enable 2FA
        </Button>
    </div>;
  return EnableMfaBanner;
})());