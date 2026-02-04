/**
 * InviteMfaStep - Step 2.5 of family invitation flow
 * DES-002: Migrated to semantic tokens and primitives
 */

import { KeyRound, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface InviteMfaStepProps {
    mfaCode: string;
    setMfaCode: (code: string) => void;
    error: string;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function InviteMfaStep({
    mfaCode, setMfaCode, error, loading, onSubmit, onBack,
}: InviteMfaStepProps) {
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-warning-500 text-center text-2xl tracking-[0.3em] font-mono";

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 mb-4">
                <HStack gap="sm" align="center" className="text-warning-800 dark:text-warning-300">
                    <KeyRound className="w-5 h-5" />
                    <Text weight="semibold">Two-Factor Authentication Required</Text>
                </HStack>
                <Text size="sm" className="text-warning-700 dark:text-warning-400 mt-1">
                    Enter the 6-digit code from your authenticator app.
                </Text>
            </div>

            <VStack gap="sm">
                <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-wider">
                    Authenticator Code
                </Text>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className={inputClass}
                        autoFocus
                    />
                </div>
            </VStack>

            {error && (
                <HStack gap="sm" align="center" className="text-danger-600 dark:text-danger-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </HStack>
            )}

            <HStack gap="sm">
                <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
                    Back
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={loading || mfaCode.length !== 6}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify & Send
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </HStack>
        </form>
    );
}

