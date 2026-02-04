/**
 * InvitePasswordStep - Step 2 of family invitation flow
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface InvitePasswordStepProps {
    inviteeEmail: string;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function InvitePasswordStep({
    inviteeEmail, password, setPassword, error, loading, onSubmit, onBack,
}: InvitePasswordStepProps) {
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-warning-500";

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-3 dark:bg-surface-3-dark mb-4">
                <Text variant="muted" size="sm">
                    Inviting: <span className="font-semibold text-foreground dark:text-foreground-dark">{inviteeEmail}</span>
                </Text>
            </div>

            <VStack gap="sm">
                <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-wider">
                    Confirm Your Password
                </Text>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={inputClass}
                        autoFocus
                        autoComplete="current-password"
                    />
                </div>
                <Text variant="muted" size="xs">
                    This confirms your intent to invite a family member.
                </Text>
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
                <Button type="submit" className="flex-1 gap-2" disabled={loading || !password}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            Send Invitation
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </HStack>
        </form>
    );
}

