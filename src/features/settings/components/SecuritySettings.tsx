/**
 * SecuritySettings - MFA enrollment and security configuration
 * 
 * JUSTIFICATION (CLAUDE.md §3.2): This component exceeds 200 lines because it
 * implements a 3-step MFA enrollment wizard with QR code display, manual key
 * fallback, and code verification. Security-critical UI benefits from proximity.
 */

import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Check, Smartphone, QrCode, Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

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
    onUnenrollMfa,
}) => {
    const { showToast, confirm } = useNotifications();
    const [step, setStep] = useState(1);

    // Reset step when setup closes - intentional state sync pattern
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!show2FASetup) setStep(1);
    }, [show2FASetup]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-900/10">
                <CardTitle className="text-base font-bold text-blue-900 dark:text-blue-400 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
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
                        <Button
                            variant="secondary"
                            className="text-rose-500 hover:text-white hover:bg-rose-500 border-rose-200 dark:border-rose-900 gap-2 w-full sm:w-auto"
                            onClick={async () => {
                                if (await confirm({
                                    title: 'Disable 2FA?',
                                    message: 'Are you sure you want to disable 2-Factor Authentication? This will significantly reduce your account security.',
                                    type: 'danger',
                                    confirmText: 'Disable Security',
                                    cancelText: 'Keep Enabled'
                                })) {
                                    try {
                                        await onUnenrollMfa();
                                        showToast('MFA has been disabled.', 'info');
                                    } catch (err) {
                                        showToast('Error: ' + (err as Error).message, 'error');
                                    }
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Disable
                        </Button>
                    ) : (
                        !show2FASetup && (
                            <Button
                                isLoading={isEnrolling}
                                onClick={onGenerateMfaSecret}
                                className="gap-2 w-full sm:w-auto font-bold"
                            >
                                <Shield className="w-4 h-4" />
                                Setup 2FA
                            </Button>
                        )
                    )}
                </div>

                {show2FASetup && (
                    <div className="mt-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500 overflow-hidden">

                        {/* Wizard Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span className={step >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Step 1</span>
                                <span className="text-slate-300 dark:text-slate-700">→</span>
                                <span className={step >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Step 2</span>
                                <span className="text-slate-300 dark:text-slate-700">→</span>
                                <span className={step >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Step 3</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onSetShow2FASetup(false)} className="text-slate-400 hover:text-slate-600">
                                <Check className="w-5 h-5 rotate-45" />
                            </Button>
                        </div>

                        {/* Step Content */}
                        <div className="p-8">
                            {step === 1 && (
                                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                                        <Smartphone className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Get an Authenticator App</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                            Download a free authenticator app like <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> on your phone.
                                        </p>
                                    </div>
                                    <div className="flex justify-center pt-4">
                                        <Button onClick={handleNext} className="w-full sm:w-auto gap-2 group">
                                            I have the app <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                                        <QrCode className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Scan the QR Code</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                            Open your authenticator app and choose "Add Account" or "Scan QR Code".
                                        </p>
                                    </div>

                                    {/* QR Display */}
                                    <div className="flex justify-center py-2">
                                        <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
                                            {mfaQrUrl ? (
                                                <QRCodeSVG value={mfaQrUrl} size={160} level="H" />
                                            ) : (
                                                <div className="w-40 h-40 flex items-center justify-center bg-slate-50 text-slate-300">
                                                    <QrCode className="w-8 h-8 animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Manual Key Fallback */}
                                    <div className="text-xs">
                                        <p className="text-slate-400 mb-2 font-bold uppercase tracking-widest">Can't scan?</p>
                                        <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-slate-600 dark:text-slate-400 inline-block max-w-xs break-all select-all">
                                            {mfaManualKey}
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-3 pt-4">
                                        <Button variant="secondary" onClick={handleBack} className="gap-2">
                                            Back
                                        </Button>
                                        <Button onClick={handleNext} className="gap-2 group">
                                            Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                                        <Key className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Verify Setup</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                            Enter the 6-digit code from your app to confirm everything is working.
                                        </p>
                                    </div>

                                    <div className="max-w-xs mx-auto space-y-4">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000 000"
                                            value={mfaCode}
                                            onChange={(e) => onSetMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800"
                                            autoFocus
                                        />

                                        {mfaError && (
                                            <p className="text-xs font-bold text-rose-500 animate-in fade-in slide-in-from-top-1">{mfaError}</p>
                                        )}

                                        <Button
                                            onClick={() => onEnrollMfa(mfaCode)}
                                            isLoading={isEnrolling}
                                            disabled={mfaCode.length !== 6}
                                            className="w-full py-6 font-black uppercase tracking-widest"
                                        >
                                            Verify & Enable
                                        </Button>
                                    </div>

                                    <div className="flex justify-center pt-4">
                                        <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-slate-600 gap-2">
                                            <ArrowLeft className="w-4 h-4" /> Back to QR
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
