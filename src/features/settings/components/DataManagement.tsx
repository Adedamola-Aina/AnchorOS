/**
 * DataManagement - Data export and wipe functionality
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Database } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface DataManagementProps {
    userUid: string;
    profile: any;
    onWipeData: () => Promise<void>;
}

export const DataManagement: React.FC<DataManagementProps> = ({ userUid, profile, onWipeData }) => {
    const { showToast } = useNotifications();

    const handleExportJson = async () => {
        try {
            const { getDocs, collection } = await import('firebase/firestore');
            const { db, APP_ID } = await import('../../../config/firebase');

            const [accSnap, txSnap, tasksSnap] = await Promise.all([
                getDocs(collection(db, 'artifacts', APP_ID, 'users', userUid, 'accounts')),
                getDocs(collection(db, 'artifacts', APP_ID, 'users', userUid, 'finance')),
                getDocs(collection(db, 'artifacts', APP_ID, 'users', userUid, 'commitments'))
            ]);

            const data = {
                profile,
                accounts: accSnap.docs.map(d => d.data()),
                transactions: txSnap.docs.map(d => d.data()),
                commitments: tasksSnap.docs.map(d => d.data()),
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `anchor-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('Data export started.', 'success');
        } catch (e) {
            showToast('Export failed: ' + (e as Error).message, 'error');
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)] bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-primary-900 dark:text-primary-400 flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    Data Management
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <HStack justify="between" align="center" className="flex-col sm:flex-row gap-6">
                    <VStack gap="xs">
                        <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Export Personal Data</Text>
                        <Text variant="muted" size="sm" className="max-w-sm">Download a JSON copy of all your accounts, transactions, and commitments.</Text>
                    </VStack>
                    <Button
                        onClick={handleExportJson}
                        variant="primary"
                        className="bg-primary-600 hover:bg-primary-700 h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                        Export JSON
                    </Button>
                </HStack>

                {import.meta.env.MODE !== 'production' && (
                    <HStack justify="between" align="center" className="flex-col sm:flex-row gap-6 border-t border-[var(--border-subtle)] pt-6">
                        <VStack gap="xs">
                            <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Wipe All Data (Dev Only)</Text>
                            <Text variant="muted" size="sm" className="max-w-sm">
                                Factory reset your account for testing. Removes all finance and task data, keeps profile.
                            </Text>
                        </VStack>
                        <Button
                            onClick={onWipeData}
                            variant="secondary"
                            className="h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                        >
                            Wipe Data
                        </Button>
                    </HStack>
                )}
            </CardContent>
        </Card>
    );
};

