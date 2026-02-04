/**
 * MfaConfirmationCard - MFA verification step for family connection confirmation
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Lock, AlertCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface MfaConfirmationCardProps {
    inviteeEmail: string;
    mfaCode: string;
    setMfaCode: (code: string) => void;
    error: string;
    confirmingConnection: boolean;
    onMfaSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function MfaConfirmationCard({
    inviteeEmail, mfaCode, setMfaCode, error,
    confirmingConnection, onMfaSubmit, onBack,
}: MfaConfirmationCardProps) {
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xl tracking-widest text-center";

    return (
        <Card className="border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500" />
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-primary-900 dark:text-primary-400 flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    Two-Factor Authentication
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <form onSubmit={onMfaSubmit} className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-primary-200 dark:border-primary-800">
                        <Text variant="muted" size="sm">Connecting with: <span className="font-semibold text-foreground dark:text-foreground-dark">{inviteeEmail}</span></Text>
                        <Text size="xs" className="text-primary-600 dark:text-primary-400 mt-1">✓ Password verified • MFA required</Text>
                    </div>
                    <VStack gap="sm">
                        <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-wider">Enter 2FA Code</Text>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={mfaCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setMfaCode(value);
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className={inputClass}
                                autoFocus
                                autoComplete="one-time-code"
                            />
                        </div>
                        <Text variant="muted" size="xs" className="text-center">Enter the 6-digit code from your authenticator app</Text>
                    </VStack>
                    {error && (
                        <HStack gap="sm" align="center" className="text-danger-600 dark:text-danger-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </HStack>
                    )}
                    <HStack gap="sm">
                        <Button type="button" variant="secondary" onClick={onBack} className="flex-1 gap-2">
                            <ArrowLeft className="w-4 h-4" />Back
                        </Button>
                        <Button type="submit" disabled={confirmingConnection || mfaCode.length !== 6} className="flex-1 bg-primary-600 hover:bg-primary-700 gap-2">
                            {confirmingConnection ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : <>Confirm<ArrowRight className="w-4 h-4" /></>}
                        </Button>
                    </HStack>
                </form>
            </CardContent>
        </Card>
    );
}

