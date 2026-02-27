/**
 * SecuritySettings MFA Wizard Steps
 * Extracted from SecuritySettings.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, QrCode, Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface Step1Props { onNext: () => void; }
export const MfaStep1GetApp: React.FC<Step1Props> = ({ onNext }) => (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400"><Smartphone className="w-8 h-8" /></div>
        <div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Get an Authenticator App</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Download a free authenticator app like <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> on your phone.</p>
        </div>
        <div className="flex justify-center pt-4"><Button onClick={onNext} className="w-full sm:w-auto gap-2 group">I have the app <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></div>
    </div>
);

interface Step2Props { qrUrl: string; manualKey: string; isLoading?: boolean; errorMessage?: string; onBack: () => void; onNext: () => void; onRetry?: () => void; }
export const MfaStep2ScanQR: React.FC<Step2Props> = ({ qrUrl, manualKey, isLoading = false, errorMessage = '', onBack, onNext, onRetry }) => {
    const hasRenderableQr = qrUrl.startsWith('otpauth://');

    return (
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400"><QrCode className="w-8 h-8" /></div>
            <div>
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Scan the QR Code</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Open your authenticator app and choose "Add Account" or "Scan QR Code".</p>
            </div>
            <div className="flex justify-center py-2">
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 min-h-48 min-w-48 flex items-center justify-center">
                    {hasRenderableQr ? (
                        <QRCodeSVG value={qrUrl} size={160} level="H" />
                    ) : (
                        <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400 rounded-lg">
                            <QrCode className={`w-8 h-8 ${isLoading ? 'animate-pulse' : ''}`} />
                            <p className="text-[11px] font-semibold px-2">
                                {isLoading ? 'Preparing QR code…' : 'QR code unavailable. Use manual key below.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {!hasRenderableQr && !isLoading && onRetry && (
                <div className="-mt-3">
                    <Button type="button" variant="secondary" onClick={onRetry}>Retry QR</Button>
                </div>
            )}
            {errorMessage && !isLoading && <p className="text-xs font-semibold text-rose-500 -mt-2">{errorMessage}</p>}
            <div className="text-xs"><p className="text-slate-400 mb-2 font-bold uppercase tracking-widest">Can't scan?</p><div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-slate-600 dark:text-slate-400 inline-block max-w-xs break-all select-all">{manualKey || 'Manual key unavailable. Retry QR generation.'}</div></div>
            <div className="flex justify-center gap-3 pt-4"><Button variant="secondary" onClick={onBack} className="gap-2">Back</Button><Button onClick={onNext} className="gap-2 group">Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></div>
        </div>
    );
};

interface Step3Props { mfaCode: string; mfaError: string; isEnrolling: boolean; onSetMfaCode: (c: string) => void; onEnroll: () => void; onBack: () => void; }
export const MfaStep3Verify: React.FC<Step3Props> = ({ mfaCode, mfaError, isEnrolling, onSetMfaCode, onEnroll, onBack }) => {
    const submittedRef = useRef(false);

    useEffect(() => {
        if (mfaCode.length === 6 && !isEnrolling && !submittedRef.current) {
            submittedRef.current = true;
            onEnroll();
        }
        if (mfaCode.length < 6) submittedRef.current = false;
    }, [mfaCode, isEnrolling, onEnroll]);

    return (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400"><Key className="w-8 h-8" /></div>
        <div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">Verify Setup</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Enter the 6-digit code from your app to confirm everything is working.</p>
        </div>
        <div className="max-w-xs mx-auto space-y-4">
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000 000" value={mfaCode} onChange={(e) => onSetMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800" autoFocus />
            {mfaError && <p className="text-xs font-bold text-rose-500 animate-in fade-in slide-in-from-top-1">{mfaError}</p>}
            <Button onClick={onEnroll} isLoading={isEnrolling} disabled={mfaCode.length !== 6} className="w-full py-6 font-black uppercase tracking-widest">Verify & Enable</Button>
        </div>
        <div className="flex justify-center pt-4"><Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-slate-600 gap-2"><ArrowLeft className="w-4 h-4" /> Back to QR</Button></div>
    </div>
    );
};
