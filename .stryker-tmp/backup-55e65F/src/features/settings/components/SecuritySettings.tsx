/**
 * SecuritySettings - MFA enrollment and security configuration
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * MFA wizard steps extracted to SecuritySettingsParts.tsx
 */

import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Check } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { captureError } from '../../../utils/error';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { MfaStep1GetApp, MfaStep2ScanQR, MfaStep3Verify } from './SecuritySettingsParts';
import { PasswordChange } from './PasswordChange';

interface SecuritySettingsProps {
    mfaEnabled?: boolean; isEnrolling: boolean; show2FASetup: boolean; mfaQrUrl: string; mfaManualKey: string; mfaCode: string; mfaError: string;
    onSetShow2FASetup: (show: boolean) => void; onSetMfaCode: (code: string) => void; onGenerateMfaSecret: () => Promise<void>; onEnrollMfa: (code: string) => Promise<void>; onUnenrollMfa: () => Promise<void>;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ mfaEnabled, isEnrolling, show2FASetup, mfaQrUrl, mfaManualKey, mfaCode, mfaError, onSetShow2FASetup, onSetMfaCode, onGenerateMfaSecret, onEnrollMfa, onUnenrollMfa }) => {
    const { showToast, confirm } = useNotifications();
    const [step, setStep] = useState(1);
    // Reset step when dialog closes - using a ref to track open state would be better, but for now just depend on mount cycle
    useEffect(() => {
        if (!show2FASetup) {
            // Setup closed, reset step after animation
            const timer = setTimeout(() => setStep(1), 500);
            return () => clearTimeout(timer);
        }
    }, [show2FASetup]);

    const handleDisableMfa = async () => {
        if (await confirm({ title: 'Disable 2FA?', message: 'Are you sure you want to disable 2-Factor Authentication? This will significantly reduce your account security.', type: 'danger', confirmText: 'Disable Security', cancelText: 'Keep Enabled' })) {
            try { await onUnenrollMfa(); showToast('MFA has been disabled.', 'info'); }
            catch (err) { captureError(err, 'Security.disableMfa'); showToast('Error: ' + (err as Error).message, 'error'); }
        }
    };

    return (
        <Card className="overflow-hidden">
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
                    {mfaEnabled ? (
                        <Button variant="secondary" className="text-rose-500 hover:text-white hover:bg-rose-500 border-rose-200 dark:border-rose-900 gap-2 w-full sm:w-auto" onClick={handleDisableMfa}><Trash2 className="w-4 h-4" />Disable</Button>
                    ) : (!show2FASetup && <Button isLoading={isEnrolling} onClick={onGenerateMfaSecret} className="gap-2 w-full sm:w-auto font-bold"><Shield className="w-4 h-4" />Setup 2FA</Button>)}
                </div>

                {show2FASetup && (
                    <div className="mt-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500 overflow-hidden">
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
                    </div>
                )}
                <PasswordChange />
            </CardContent>
        </Card>
    );
};
