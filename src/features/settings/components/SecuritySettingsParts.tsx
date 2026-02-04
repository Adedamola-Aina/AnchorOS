/**
 * SecuritySettings MFA Wizard Steps
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, QrCode, Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack } from '../../../components/primitives';

interface Step1Props { onNext: () => void; }
export const MfaStep1GetApp: React.FC<Step1Props> = ({ onNext }) => (
    <VStack gap="lg" align="center" className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400"><Smartphone className="w-8 h-8" /></div>
        <VStack gap="sm" align="center">
            <Text as="h3" variant="heading" size="lg">Get an Authenticator App</Text>
            <Text variant="muted" size="sm" className="max-w-sm">Download a free authenticator app like <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> on your phone.</Text>
        </VStack>
        <div className="flex justify-center pt-4"><Button onClick={onNext} className="w-full sm:w-auto gap-2 group">I have the app <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></div>
    </VStack>
);

interface Step2Props { qrUrl: string; manualKey: string; onBack: () => void; onNext: () => void; }
export const MfaStep2ScanQR: React.FC<Step2Props> = ({ qrUrl, manualKey, onBack, onNext }) => (
    <VStack gap="lg" align="center" className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-task-100 dark:bg-task-900/30 rounded-full flex items-center justify-center text-task-600 dark:text-task-400"><QrCode className="w-8 h-8" /></div>
        <VStack gap="sm" align="center">
            <Text as="h3" variant="heading" size="lg">Scan the QR Code</Text>
            <Text variant="muted" size="sm" className="max-w-sm">Open your authenticator app and choose "Add Account" or "Scan QR Code".</Text>
        </VStack>
        <div className="flex justify-center py-2">
            <div className="p-4 bg-surface-1 dark:bg-surface-1-dark rounded-2xl shadow-lg border border-border dark:border-border-dark">
                {qrUrl ? <QRCodeSVG value={qrUrl} size={160} level="H" /> : <div className="w-40 h-40 flex items-center justify-center bg-surface-3 text-muted"><QrCode className="w-8 h-8 animate-pulse" /></div>}
            </div>
        </div>
        <div className="text-xs"><Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-widest mb-2">Can't scan?</Text><div className="bg-surface-3 dark:bg-surface-3-dark/50 p-3 rounded-lg font-mono text-muted inline-block max-w-xs break-all select-all">{manualKey}</div></div>
        <div className="flex justify-center gap-3 pt-4"><Button variant="secondary" onClick={onBack} className="gap-2">Back</Button><Button onClick={onNext} className="gap-2 group">Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></div>
    </VStack>
);

interface Step3Props { mfaCode: string; mfaError: string; isEnrolling: boolean; onSetMfaCode: (c: string) => void; onEnroll: () => void; onBack: () => void; }
export const MfaStep3Verify: React.FC<Step3Props> = ({ mfaCode, mfaError, isEnrolling, onSetMfaCode, onEnroll, onBack }) => (
    <VStack gap="lg" align="center" className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-16 h-16 bg-finance-100 dark:bg-finance-900/30 rounded-full flex items-center justify-center text-finance-600 dark:text-finance-400"><Key className="w-8 h-8" /></div>
        <VStack gap="sm" align="center">
            <Text as="h3" variant="heading" size="lg">Verify Setup</Text>
            <Text variant="muted" size="sm" className="max-w-sm">Enter the 6-digit code from your app to confirm everything is working.</Text>
        </VStack>
        <VStack gap="md" className="max-w-xs w-full">
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000 000" value={mfaCode} onChange={(e) => onSetMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full p-4 bg-surface-1 dark:bg-surface-1-dark border border-border dark:border-border-dark rounded-2xl text-center text-3xl font-mono tracking-[0.5em] text-foreground dark:text-foreground-dark focus:ring-4 focus:ring-primary-500/20 outline-none transition-all placeholder:text-muted" autoFocus />
            {mfaError && <Text variant="danger" size="xs" weight="bold" className="animate-in fade-in slide-in-from-top-1">{mfaError}</Text>}
            <Button onClick={onEnroll} isLoading={isEnrolling} disabled={mfaCode.length !== 6} className="w-full py-6 font-black uppercase tracking-widest">Verify & Enable</Button>
        </VStack>
        <div className="flex justify-center pt-4"><Button variant="ghost" onClick={onBack} className="text-muted hover:text-foreground gap-2"><ArrowLeft className="w-4 h-4" /> Back to QR</Button></div>
    </VStack>
);

