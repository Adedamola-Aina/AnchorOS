/**
 * InviteSuccessStep - Step 3 of family invitation flow
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Copy, Check } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface InviteSuccessStepProps {
    inviteeEmail: string;
    verificationCode: string;
    copied: boolean;
    onCopyCode: () => void;
    onDone: () => void;
}

export function InviteSuccessStep({
    inviteeEmail, verificationCode, copied, onCopyCode, onDone,
}: InviteSuccessStepProps) {
    return (
        <VStack gap="lg">
            <VStack gap="md" align="center" className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-finance-100 dark:bg-finance-900/30">
                    <Check className="w-8 h-8 text-finance-600 dark:text-finance-400" />
                </div>
                <VStack gap="xs" align="center">
                    <Text as="h3" variant="heading" size="lg">Invitation Sent!</Text>
                    <Text variant="muted" size="sm">
                        An email has been sent to <span className="font-semibold text-foreground dark:text-foreground-dark">{inviteeEmail}</span>
                    </Text>
                </VStack>
            </VStack>

            <VStack gap="sm" className="p-6 rounded-2xl bg-surface-3 dark:bg-surface-3-dark border border-[var(--border)]">
                <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-wider text-center">
                    Verification Code
                </Text>
                <HStack gap="sm" justify="center" align="center">
                    <code className="text-4xl font-mono font-bold tracking-[0.5em] text-foreground dark:text-foreground-dark">
                        {verificationCode}
                    </code>
                    <button
                        onClick={onCopyCode}
                        className="p-2 rounded-lg hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors"
                    >
                        {copied ? (
                            <Check className="w-5 h-5 text-finance-600" />
                        ) : (
                            <Copy className="w-5 h-5 text-muted" />
                        )}
                    </button>
                </HStack>
                <Text variant="muted" size="xs" className="text-center">
                    For convenience, this code has also been included in the invitation email.
                </Text>
            </VStack>

            <Button onClick={onDone} className="w-full">
                Done
            </Button>
        </VStack>
    );
}

