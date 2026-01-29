/**
 * SecuritySettings MFA Wizard Steps
 * Extracted from SecuritySettings.tsx per CLAUDE.md §3.2
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
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, QrCode, Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@anchor-os/ui';
interface Step1Props {
  onNext: () => void;
}
export const MfaStep1GetApp: React.FC<Step1Props> = stryMutAct_9fa48("6331") ? () => undefined : (stryCov_9fa48("6331"), (() => {
  const MfaStep1GetApp: React.FC<Step1Props> = ({
    onNext
  }) => <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400"><Smartphone className="w-8 h-8" /></div>
        <div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Get an Authenticator App</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Download a free authenticator app like <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> on your phone.</p>
        </div>
        <div className="flex justify-center pt-4"><Button onClick={onNext} className="w-full sm:w-auto gap-2 group">I have the app <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></div>
    </div>;
  return MfaStep1GetApp;
})());
interface Step2Props {
  qrUrl: string;
  manualKey: string;
  onBack: () => void;
  onNext: () => void;
}
export const MfaStep2ScanQR: React.FC<Step2Props> = stryMutAct_9fa48("6332") ? () => undefined : (stryCov_9fa48("6332"), (() => {
  const MfaStep2ScanQR: React.FC<Step2Props> = ({
    qrUrl,
    manualKey,
    onBack,
    onNext
  }) => <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400"><QrCode className="w-8 h-8" /></div>
        <div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Scan the QR Code</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Open your authenticator app and choose "Add Account" or "Scan QR Code".</p>
        </div>
        <div className="flex justify-center py-2">
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
                {qrUrl ? <QRCodeSVG value={qrUrl} size={160} level="H" /> : <div className="w-40 h-40 flex items-center justify-center bg-slate-50 text-slate-300"><QrCode className="w-8 h-8 animate-pulse" /></div>}
            </div>
        </div>
        <div className="text-xs"><p className="text-slate-400 mb-2 font-bold uppercase tracking-widest">Can't scan?</p><div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-slate-600 dark:text-slate-400 inline-block max-w-xs break-all select-all">{manualKey}</div></div>
        <div className="flex justify-center gap-3 pt-4"><Button variant="secondary" onClick={onBack} className="gap-2">Back</Button><Button onClick={onNext} className="gap-2 group">Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></div>
    </div>;
  return MfaStep2ScanQR;
})());
interface Step3Props {
  mfaCode: string;
  mfaError: string;
  isEnrolling: boolean;
  onSetMfaCode: (c: string) => void;
  onEnroll: () => void;
  onBack: () => void;
}
export const MfaStep3Verify: React.FC<Step3Props> = stryMutAct_9fa48("6333") ? () => undefined : (stryCov_9fa48("6333"), (() => {
  const MfaStep3Verify: React.FC<Step3Props> = ({
    mfaCode,
    mfaError,
    isEnrolling,
    onSetMfaCode,
    onEnroll,
    onBack
  }) => <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400"><Key className="w-8 h-8" /></div>
        <div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Verify Setup</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Enter the 6-digit code from your app to confirm everything is working.</p>
        </div>
        <div className="max-w-xs mx-auto space-y-4">
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000 000" value={mfaCode} onChange={stryMutAct_9fa48("6334") ? () => undefined : (stryCov_9fa48("6334"), e => onSetMfaCode(stryMutAct_9fa48("6335") ? e.target.value.replace(/\D/g, '') : (stryCov_9fa48("6335"), e.target.value.replace(stryMutAct_9fa48("6336") ? /\d/g : (stryCov_9fa48("6336"), /\D/g), stryMutAct_9fa48("6337") ? "Stryker was here!" : (stryCov_9fa48("6337"), '')).slice(0, 6))))} className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800" autoFocus />
            {stryMutAct_9fa48("6340") ? mfaError || <p className="text-xs font-bold text-rose-500 animate-in fade-in slide-in-from-top-1">{mfaError}</p> : stryMutAct_9fa48("6339") ? false : stryMutAct_9fa48("6338") ? true : (stryCov_9fa48("6338", "6339", "6340"), mfaError && <p className="text-xs font-bold text-rose-500 animate-in fade-in slide-in-from-top-1">{mfaError}</p>)}
            <Button onClick={onEnroll} isLoading={isEnrolling} disabled={stryMutAct_9fa48("6343") ? mfaCode.length === 6 : stryMutAct_9fa48("6342") ? false : stryMutAct_9fa48("6341") ? true : (stryCov_9fa48("6341", "6342", "6343"), mfaCode.length !== 6)} className="w-full py-6 font-black uppercase tracking-widest">Verify & Enable</Button>
        </div>
        <div className="flex justify-center pt-4"><Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-slate-600 gap-2"><ArrowLeft className="w-4 h-4" /> Back to QR</Button></div>
    </div>;
  return MfaStep3Verify;
})());