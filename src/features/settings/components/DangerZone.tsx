/**
 * DangerZone - Account deletion
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface DangerZoneProps {
    onDeleteAccount: () => Promise<void>;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
    const { confirm } = useNotifications();

    return (
        <Card className="overflow-hidden border-2 border-danger-100 dark:border-danger-900/20">
            <CardHeader className="p-6 border-b border-danger-100 dark:border-danger-900/30 bg-danger-50/50 dark:bg-danger-900/10">
                <CardTitle className="text-base font-bold text-danger-900 dark:text-danger-400 flex items-center gap-3">
                    <div className="p-2 bg-danger-500/10 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400" />
                    </div>
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <HStack justify="between" align="center" className="flex-col sm:flex-row gap-6">
                    <VStack gap="xs">
                        <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Delete Account</Text>
                        <Text variant="muted" size="sm" className="max-w-sm">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </Text>
                    </VStack>
                    <Button
                        onClick={async () => {
                            if (await confirm({
                                title: 'Delete Account?',
                                message: 'This will permanently delete your user profile, all accounts, transactions, and cancel all family connections. There is no going back.',
                                confirmText: 'Permanently Delete',
                                type: 'danger'
                            })) {
                                await onDeleteAccount();
                            }
                        }}
                        variant="primary"
                        className="bg-danger-500 hover:bg-danger-600 shadow-danger-500/20 h-11 px-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                        Delete Account
                    </Button>
                </HStack>
            </CardContent>
        </Card>
    );
};

