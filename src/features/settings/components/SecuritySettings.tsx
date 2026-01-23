import React from 'react';
import { Shield, Trash2, Check } from 'lucide-react';
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
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Secure your account with a secondary TOTP verification.</p>
                    </div>
                    {mfaEnabled ? (
                        <Button
                            variant="secondary"
                            className="text-rose-500 hover:text-white hover:bg-rose-500 border-rose-200 dark:border-rose-900 gap-2"
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
                        <Button
                            isLoading={isEnrolling && !show2FASetup}
                            onClick={onGenerateMfaSecret}
                            className="gap-2"
                        >
                            Setup 2FA
                        </Button>
                    )}
                </div>

                {show2FASetup && (
                    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Configure Authenticator</h4>
                                <p className="text-xs text-slate-500 mt-1">Scan this code with Google Authenticator, Bitwarden, or 1Password.</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onSetShow2FASetup(false)} className="text-slate-400">
                                <Check className="w-5 h-5 rotate-45" />
                            </Button>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-56 h-56 bg-white p-4 rounded-3xl flex items-center justify-center border-8 border-slate-100 dark:border-slate-800 shadow-2xl relative group overflow-hidden">
                                {mfaError ? (
                                    <div className="text-rose-500 text-[10px] text-center p-4 font-bold">
                                        {mfaError}
                                    </div>
                                ) : mfaQrUrl ? (
                                    <div className="w-full h-full flex items-center justify-center p-2 bg-white rounded-xl">
                                        <QRCodeSVG
                                            value={mfaQrUrl}
                                            size={180}
                                            level="H"
                                            includeMargin={false}
                                            className="w-full h-full"
                                            title="MFA QR Code"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                        <div className="animate-pulse bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Generating...</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center w-full px-4">
                                {mfaManualKey && (
                                    <div className="flex flex-col items-center gap-3 w-full text-center">
                                        <div className="bg-slate-200/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 break-all w-full select-all">
                                            {mfaManualKey}
                                        </div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Manual Entry Key</p>
                                        <Button
                                            variant="ghost"
                                            onClick={onGenerateMfaSecret}
                                            className="text-[10px] text-blue-500 hover:text-blue-600 font-black uppercase tracking-widest h-8"
                                        >
                                            Reset / New Key
                                        </Button>
                                    </div>
                                )}
                                {!mfaManualKey && (
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">Scan to Begin Verification</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Verification Code</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000 000"
                                    value={mfaCode}
                                    onChange={(e) => onSetMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="flex-1 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-2xl font-mono tracking-[0.3em] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                />
                                <Button
                                    onClick={() => onEnrollMfa(mfaCode)}
                                    isLoading={isEnrolling}
                                    disabled={mfaCode.length !== 6}
                                    className="sm:w-32 h-auto py-4 font-black uppercase tracking-widest text-xs"
                                >
                                    Verify
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
