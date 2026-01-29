/**
 * Reauthentication Modal
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
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface ReauthModalProps {
  show: boolean;
  password: string;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}
export const ReauthModal: React.FC<ReauthModalProps> = ({
  show,
  password,
  isLoading,
  onPasswordChange,
  onConfirm,
  onClose
}) => {
  if (stryMutAct_9fa48("6246")) {
    {}
  } else {
    stryCov_9fa48("6246");
    if (stryMutAct_9fa48("6249") ? false : stryMutAct_9fa48("6248") ? true : stryMutAct_9fa48("6247") ? show : (stryCov_9fa48("6247", "6248", "6249"), !show)) return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl">
                <div>
                    <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">Verify Identity</h3>
                    <p className="text-slate-500 text-sm mt-1">Please enter your password to confirm this security change.</p>
                </div>
                <input type="password" placeholder="Your Password" value={password} onChange={stryMutAct_9fa48("6250") ? () => undefined : (stryCov_9fa48("6250"), e => onPasswordChange(e.target.value))} onKeyDown={stryMutAct_9fa48("6251") ? () => undefined : (stryCov_9fa48("6251"), e => stryMutAct_9fa48("6254") ? e.key === 'Enter' || onConfirm() : stryMutAct_9fa48("6253") ? false : stryMutAct_9fa48("6252") ? true : (stryCov_9fa48("6252", "6253", "6254"), (stryMutAct_9fa48("6256") ? e.key !== 'Enter' : stryMutAct_9fa48("6255") ? true : (stryCov_9fa48("6255", "6256"), e.key === (stryMutAct_9fa48("6257") ? "" : (stryCov_9fa48("6257"), 'Enter')))) && onConfirm()))} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" />
                <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose} className="flex-1 h-12 font-bold">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} isLoading={isLoading} disabled={stryMutAct_9fa48("6258") ? password : (stryCov_9fa48("6258"), !password)} className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        Confirm
                    </Button>
                </div>
            </Card>
        </div>;
  }
};