/**
 * SecuritySettings - MFA enrollment and security configuration
 * DES-002: Migrated to semantic tokens and primitives
 */

import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Check } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { MfaStep1GetApp, MfaStep2ScanQR, MfaStep3Verify } from './SecuritySettingsParts';
import { Text, VStack, HStack } from '../../../components/primitives';

interface SecuritySettingsProps {
    mfaEnabled?: boolean; isEnrolling: boolean; show2FASetup: boolean; mfaQrUrl: string; mfaManualKey: string; mfaCode: string; mfaError: string;
    onSetShow2FASetup: (show: boolean) => void; onSetMfaCode: (code: string) => void; onGenerateMfaSecret: () => Promise<void>; onEnrollMfa: (code: string) => Promise<void>; onUnenrollMfa: () => Promise<void>;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ mfaEnabled, isEnrolling, show2FASetup, mfaQrUrl, mfaManualKey, mfaCode, mfaError, onSetShow2FASetup, onSetMfaCode, onGenerateMfaSecret, onEnrollMfa, onUnenrollMfa }) => {
    const { showToast, confirm } = useNotifications();
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (!show2FASetup) {
            const timer = setTimeout(() => setStep(1), 500);
            return () => clearTimeout(timer);
        }
    }, [show2FASetup]);

    const handleDisableMfa = async () => {
        if (await confirm({ title: 'Disable 2FA?', message: 'Are you sure you want to disable 2-Factor Authentication? This will significantly reduce your account security.', type: 'danger', confirmText: 'Disable Security', cancelText: 'Keep Enabled' })) {
            try { await onUnenrollMfa(); showToast('MFA has been disabled.', 'info'); }
            catch (err) { showToast('Error: ' + (err as Error).message, 'error'); }
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)] bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-primary-900 dark:text-primary-400 flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg"><Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" /></div>
                    Identity & Security
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <HStack justify="between" align="center" className="flex-col sm:flex-row text-center sm:text-left gap-4">
                    <VStack gap="xs" className="flex-1">
                        <HStack gap="sm" align="center">
                            <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Two-Factor Authentication (2FA)</Text>
                            {!mfaEnabled && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">RECOMMENDED</span>}
                        </HStack>
                        <Text variant="muted" size="sm">Secure your account with a secondary TOTP verification.</Text>
                    </VStack>
                    {mfaEnabled ? (
                        <Button variant="secondary" className="text-danger-500 hover:text-white hover:bg-danger-500 border-danger-200 dark:border-danger-900 gap-2 w-full sm:w-auto shrink-0" onClick={handleDisableMfa}><Trash2 className="w-4 h-4" />Disable</Button>
                    ) : (!show2FASetup && <Button isLoading={isEnrolling} onClick={onGenerateMfaSecret} className="gap-2 w-full sm:w-auto font-bold shrink-0"><Shield className="w-4 h-4" />Setup 2FA</Button>)}
                </HStack>

                {show2FASetup && (
                    <div className="mt-8 bg-surface-3 dark:bg-surface-3-dark/40 rounded-3xl border border-[var(--border)] animate-in zoom-in-95 duration-500 overflow-hidden">
                        <HStack justify="between" align="center" className="p-6 border-b border-[var(--border)] bg-surface-2/50 dark:bg-surface-2-dark/50 backdrop-blur-sm">
                            <HStack gap="sm" align="center" className="text-xs font-bold uppercase tracking-widest text-muted">
                                <span className={step >= 1 ? "text-primary-600 dark:text-primary-400" : ""}>Step 1</span><span className="text-muted">→</span>
                                <span className={step >= 2 ? "text-primary-600 dark:text-primary-400" : ""}>Step 2</span><span className="text-muted">→</span>
                                <span className={step >= 3 ? "text-primary-600 dark:text-primary-400" : ""}>Step 3</span>
                            </HStack>
                            <Button variant="ghost" size="icon" onClick={() => onSetShow2FASetup(false)} className="text-muted hover:text-foreground"><Check className="w-5 h-5 rotate-45" /></Button>
                        </HStack>
                        <div className="p-8">
                            {step === 1 && <MfaStep1GetApp onNext={() => setStep(2)} />}
                            {step === 2 && <MfaStep2ScanQR qrUrl={mfaQrUrl} manualKey={mfaManualKey} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
                            {step === 3 && <MfaStep3Verify mfaCode={mfaCode} mfaError={mfaError} isEnrolling={isEnrolling} onSetMfaCode={onSetMfaCode} onEnroll={() => onEnrollMfa(mfaCode)} onBack={() => setStep(2)} />}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

