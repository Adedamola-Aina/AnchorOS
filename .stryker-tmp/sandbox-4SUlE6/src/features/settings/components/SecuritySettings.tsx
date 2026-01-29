/**
 * SecuritySettings - MFA enrollment and security configuration
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * MFA wizard steps extracted to SecuritySettingsParts.tsx
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
import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Check } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { MfaStep1GetApp, MfaStep2ScanQR, MfaStep3Verify } from './SecuritySettingsParts';
interface SecuritySettingsProps {
  mfaEnabled?: boolean;
  isEnrolling: boolean;
  show2FASetup: boolean;
  mfaQrUrl: string;
  mfaManualKey: string;
  mfaCode: string;
  mfaError: string;
  onSetShow2FASetup: (show: boolean) => void;
  onSetMfaCode: (code: string) => void;
  onGenerateMfaSecret: () => Promise<void>;
  onEnrollMfa: (code: string) => Promise<void>;
  onUnenrollMfa: () => Promise<void>;
}
export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  mfaEnabled,
  isEnrolling,
  show2FASetup,
  mfaQrUrl,
  mfaManualKey,
  mfaCode,
  mfaError,
  onSetShow2FASetup,
  onSetMfaCode,
  onGenerateMfaSecret,
  onEnrollMfa,
  onUnenrollMfa
}) => {
  if (stryMutAct_9fa48("6259")) {
    {}
  } else {
    stryCov_9fa48("6259");
    const {
      showToast,
      confirm
    } = useNotifications();
    const [step, setStep] = useState(1);
    // Reset step when dialog closes - using a ref to track open state would be better, but for now just depend on mount cycle
    useEffect(() => {
      if (stryMutAct_9fa48("6260")) {
        {}
      } else {
        stryCov_9fa48("6260");
        if (stryMutAct_9fa48("6263") ? false : stryMutAct_9fa48("6262") ? true : stryMutAct_9fa48("6261") ? show2FASetup : (stryCov_9fa48("6261", "6262", "6263"), !show2FASetup)) {
          if (stryMutAct_9fa48("6264")) {
            {}
          } else {
            stryCov_9fa48("6264");
            // Setup closed, reset step after animation
            const timer = setTimeout(stryMutAct_9fa48("6265") ? () => undefined : (stryCov_9fa48("6265"), () => setStep(1)), 500);
            return stryMutAct_9fa48("6266") ? () => undefined : (stryCov_9fa48("6266"), () => clearTimeout(timer));
          }
        }
      }
    }, stryMutAct_9fa48("6267") ? [] : (stryCov_9fa48("6267"), [show2FASetup]));
    const handleDisableMfa = async () => {
      if (stryMutAct_9fa48("6268")) {
        {}
      } else {
        stryCov_9fa48("6268");
        if (stryMutAct_9fa48("6270") ? false : stryMutAct_9fa48("6269") ? true : (stryCov_9fa48("6269", "6270"), await confirm(stryMutAct_9fa48("6271") ? {} : (stryCov_9fa48("6271"), {
          title: stryMutAct_9fa48("6272") ? "" : (stryCov_9fa48("6272"), 'Disable 2FA?'),
          message: stryMutAct_9fa48("6273") ? "" : (stryCov_9fa48("6273"), 'Are you sure you want to disable 2-Factor Authentication? This will significantly reduce your account security.'),
          type: stryMutAct_9fa48("6274") ? "" : (stryCov_9fa48("6274"), 'danger'),
          confirmText: stryMutAct_9fa48("6275") ? "" : (stryCov_9fa48("6275"), 'Disable Security'),
          cancelText: stryMutAct_9fa48("6276") ? "" : (stryCov_9fa48("6276"), 'Keep Enabled')
        })))) {
          if (stryMutAct_9fa48("6277")) {
            {}
          } else {
            stryCov_9fa48("6277");
            try {
              if (stryMutAct_9fa48("6278")) {
                {}
              } else {
                stryCov_9fa48("6278");
                await onUnenrollMfa();
                showToast(stryMutAct_9fa48("6279") ? "" : (stryCov_9fa48("6279"), 'MFA has been disabled.'), stryMutAct_9fa48("6280") ? "" : (stryCov_9fa48("6280"), 'info'));
              }
            } catch (err) {
              if (stryMutAct_9fa48("6281")) {
                {}
              } else {
                stryCov_9fa48("6281");
                showToast((stryMutAct_9fa48("6282") ? "" : (stryCov_9fa48("6282"), 'Error: ')) + (err as Error).message, stryMutAct_9fa48("6283") ? "" : (stryCov_9fa48("6283"), 'error'));
              }
            }
          }
        }
      }
    };
    return <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-900/10">
                <CardTitle className="text-base font-bold text-blue-900 dark:text-blue-400 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                    Identity & Security
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Secure your account with a secondary TOTP verification.</p>
                    </div>
                    {mfaEnabled ? <Button variant="secondary" className="text-rose-500 hover:text-white hover:bg-rose-500 border-rose-200 dark:border-rose-900 gap-2 w-full sm:w-auto" onClick={handleDisableMfa}><Trash2 className="w-4 h-4" />Disable</Button> : stryMutAct_9fa48("6286") ? !show2FASetup || <Button isLoading={isEnrolling} onClick={onGenerateMfaSecret} className="gap-2 w-full sm:w-auto font-bold"><Shield className="w-4 h-4" />Setup 2FA</Button> : stryMutAct_9fa48("6285") ? false : stryMutAct_9fa48("6284") ? true : (stryCov_9fa48("6284", "6285", "6286"), (stryMutAct_9fa48("6287") ? show2FASetup : (stryCov_9fa48("6287"), !show2FASetup)) && <Button isLoading={isEnrolling} onClick={onGenerateMfaSecret} className="gap-2 w-full sm:w-auto font-bold"><Shield className="w-4 h-4" />Setup 2FA</Button>)}
                </div>

                {stryMutAct_9fa48("6290") ? show2FASetup || <div className="mt-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span className={step >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Step 1</span><span className="text-slate-300 dark:text-slate-700">→</span>
                                <span className={step >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Step 2</span><span className="text-slate-300 dark:text-slate-700">→</span>
                                <span className={step >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Step 3</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onSetShow2FASetup(false)} className="text-slate-400 hover:text-slate-600"><Check className="w-5 h-5 rotate-45" /></Button>
                        </div>
                        <div className="p-8">
                            {step === 1 && <MfaStep1GetApp onNext={() => setStep(2)} />}
                            {step === 2 && <MfaStep2ScanQR qrUrl={mfaQrUrl} manualKey={mfaManualKey} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
                            {step === 3 && <MfaStep3Verify mfaCode={mfaCode} mfaError={mfaError} isEnrolling={isEnrolling} onSetMfaCode={onSetMfaCode} onEnroll={() => onEnrollMfa(mfaCode)} onBack={() => setStep(2)} />}
                        </div>
                    </div> : stryMutAct_9fa48("6289") ? false : stryMutAct_9fa48("6288") ? true : (stryCov_9fa48("6288", "6289", "6290"), show2FASetup && <div className="mt-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span className={(stryMutAct_9fa48("6294") ? step < 1 : stryMutAct_9fa48("6293") ? step > 1 : stryMutAct_9fa48("6292") ? false : stryMutAct_9fa48("6291") ? true : (stryCov_9fa48("6291", "6292", "6293", "6294"), step >= 1)) ? stryMutAct_9fa48("6295") ? "" : (stryCov_9fa48("6295"), "text-blue-600 dark:text-blue-400") : stryMutAct_9fa48("6296") ? "Stryker was here!" : (stryCov_9fa48("6296"), "")}>Step 1</span><span className="text-slate-300 dark:text-slate-700">→</span>
                                <span className={(stryMutAct_9fa48("6300") ? step < 2 : stryMutAct_9fa48("6299") ? step > 2 : stryMutAct_9fa48("6298") ? false : stryMutAct_9fa48("6297") ? true : (stryCov_9fa48("6297", "6298", "6299", "6300"), step >= 2)) ? stryMutAct_9fa48("6301") ? "" : (stryCov_9fa48("6301"), "text-blue-600 dark:text-blue-400") : stryMutAct_9fa48("6302") ? "Stryker was here!" : (stryCov_9fa48("6302"), "")}>Step 2</span><span className="text-slate-300 dark:text-slate-700">→</span>
                                <span className={(stryMutAct_9fa48("6306") ? step < 3 : stryMutAct_9fa48("6305") ? step > 3 : stryMutAct_9fa48("6304") ? false : stryMutAct_9fa48("6303") ? true : (stryCov_9fa48("6303", "6304", "6305", "6306"), step >= 3)) ? stryMutAct_9fa48("6307") ? "" : (stryCov_9fa48("6307"), "text-blue-600 dark:text-blue-400") : stryMutAct_9fa48("6308") ? "Stryker was here!" : (stryCov_9fa48("6308"), "")}>Step 3</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={stryMutAct_9fa48("6309") ? () => undefined : (stryCov_9fa48("6309"), () => onSetShow2FASetup(stryMutAct_9fa48("6310") ? true : (stryCov_9fa48("6310"), false)))} className="text-slate-400 hover:text-slate-600"><Check className="w-5 h-5 rotate-45" /></Button>
                        </div>
                        <div className="p-8">
                            {stryMutAct_9fa48("6313") ? step === 1 || <MfaStep1GetApp onNext={() => setStep(2)} /> : stryMutAct_9fa48("6312") ? false : stryMutAct_9fa48("6311") ? true : (stryCov_9fa48("6311", "6312", "6313"), (stryMutAct_9fa48("6315") ? step !== 1 : stryMutAct_9fa48("6314") ? true : (stryCov_9fa48("6314", "6315"), step === 1)) && <MfaStep1GetApp onNext={stryMutAct_9fa48("6316") ? () => undefined : (stryCov_9fa48("6316"), () => setStep(2))} />)}
                            {stryMutAct_9fa48("6319") ? step === 2 || <MfaStep2ScanQR qrUrl={mfaQrUrl} manualKey={mfaManualKey} onBack={() => setStep(1)} onNext={() => setStep(3)} /> : stryMutAct_9fa48("6318") ? false : stryMutAct_9fa48("6317") ? true : (stryCov_9fa48("6317", "6318", "6319"), (stryMutAct_9fa48("6321") ? step !== 2 : stryMutAct_9fa48("6320") ? true : (stryCov_9fa48("6320", "6321"), step === 2)) && <MfaStep2ScanQR qrUrl={mfaQrUrl} manualKey={mfaManualKey} onBack={stryMutAct_9fa48("6322") ? () => undefined : (stryCov_9fa48("6322"), () => setStep(1))} onNext={stryMutAct_9fa48("6323") ? () => undefined : (stryCov_9fa48("6323"), () => setStep(3))} />)}
                            {stryMutAct_9fa48("6326") ? step === 3 || <MfaStep3Verify mfaCode={mfaCode} mfaError={mfaError} isEnrolling={isEnrolling} onSetMfaCode={onSetMfaCode} onEnroll={() => onEnrollMfa(mfaCode)} onBack={() => setStep(2)} /> : stryMutAct_9fa48("6325") ? false : stryMutAct_9fa48("6324") ? true : (stryCov_9fa48("6324", "6325", "6326"), (stryMutAct_9fa48("6328") ? step !== 3 : stryMutAct_9fa48("6327") ? true : (stryCov_9fa48("6327", "6328"), step === 3)) && <MfaStep3Verify mfaCode={mfaCode} mfaError={mfaError} isEnrolling={isEnrolling} onSetMfaCode={onSetMfaCode} onEnroll={stryMutAct_9fa48("6329") ? () => undefined : (stryCov_9fa48("6329"), () => onEnrollMfa(mfaCode))} onBack={stryMutAct_9fa48("6330") ? () => undefined : (stryCov_9fa48("6330"), () => setStep(2))} />)}
                        </div>
                    </div>)}
            </CardContent>
        </Card>;
  }
};