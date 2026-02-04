/**
 * InviteEmailStep - Step 1 of family invitation flow
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface InviteEmailStepProps {
    inviteeEmail: string;
    setInviteeEmail: (email: string) => void;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
}

export function InviteEmailStep({ inviteeEmail, setInviteeEmail, error, onSubmit }: InviteEmailStepProps) {
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-warning-500";

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <VStack gap="sm">
                <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-wider">
                    Family Member's Email
                </Text>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="email"
                        value={inviteeEmail}
                        onChange={(e) => setInviteeEmail(e.target.value)}
                        placeholder="spouse@example.com"
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

            <Button type="submit" className="w-full gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
            </Button>
        </form>
    );
}

