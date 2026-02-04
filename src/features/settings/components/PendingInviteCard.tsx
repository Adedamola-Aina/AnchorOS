/**
 * PendingInviteCard - Shows when waiting for invitee to accept
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack } from '../../../components/primitives';

interface PendingInviteCardProps {
    inviteeEmail: string;
    createdAt: string;
    onCancelInvite: () => void;
}

export function PendingInviteCard({ inviteeEmail, createdAt, onCancelInvite }: PendingInviteCardProps) {
    return (
        <Card className="border-warning-200 dark:border-warning-800 bg-warning-50/50 dark:bg-warning-900/10">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-warning-900 dark:text-warning-400 flex items-center gap-3">
                    <div className="p-2 bg-warning-500/10 rounded-lg animate-pulse">
                        <Users className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                    </div>
                    Invitation Pending
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <VStack gap="md">
                    <div className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-warning-200 dark:border-warning-800">
                        <Text variant="muted" size="sm">
                            Waiting for <span className="font-semibold text-foreground dark:text-foreground-dark">{inviteeEmail}</span> to accept and enter the verification code.
                        </Text>
                        <Text variant="subtle" size="xs" className="mt-2">
                            Sent {new Date(createdAt).toLocaleDateString()}
                        </Text>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={onCancelInvite}
                        className="w-full text-danger-600 border-danger-200 hover:bg-danger-50 dark:border-danger-800 dark:hover:bg-danger-900/20"
                    >
                        Cancel Invitation
                    </Button>
                </VStack>
            </CardContent>
        </Card>
    );
}

