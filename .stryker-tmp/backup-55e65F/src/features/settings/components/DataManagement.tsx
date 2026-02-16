import React from 'react';
import { Database } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { downloadCsv } from '../../../utils/csvExport';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';

import type { UserProfile } from '../../../types';

interface DataManagementProps {
    userUid: string;
    profile: UserProfile;
    onWipeData: () => Promise<void>;
}

export const DataManagement: React.FC<DataManagementProps> = ({
    userUid,
    profile,
    onWipeData,
}) => {
    const { showToast } = useNotifications();

    const fetchAllData = async () => {
        const { getDocs, collection } = await import('firebase/firestore');
        const { db, APP_ID } = await import('../../../config/firebase');
        const [accSnap, txSnap, tasksSnap] = await Promise.all([
            getDocs(collection(db, 'artifacts', APP_ID, 'users', userUid, 'accounts')),
            getDocs(collection(db, 'artifacts', APP_ID, 'users', userUid, 'finance')),
            getDocs(collection(db, 'artifacts', APP_ID, 'users', userUid, 'commitments'))
        ]);
        return {
            accounts: accSnap.docs.map(d => d.data()),
            transactions: txSnap.docs.map(d => d.data()),
            commitments: tasksSnap.docs.map(d => d.data()),
        };
    };

    const handleExportJson = async () => {
        try {
            const raw = await fetchAllData();
            const data = { profile, ...raw, exportedAt: new Date().toISOString() };

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

    const handleExportCsv = async () => {
        try {
            const raw = await fetchAllData();
            downloadCsv(raw);
            showToast('CSV export started.', 'success');
        } catch (e) {
            showToast('CSV export failed: ' + (e as Error).message, 'error');
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-primary-900 dark:text-primary-400 flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    Data Management
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Export Personal Data</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Download a JSON copy of all your accounts, transactions, and commitments.</p>
                    </div>
                    <div className="flex gap-2">
                    <Button
                        onClick={handleExportJson}
                        variant="primary"
                        className="bg-primary-600 hover:bg-primary-700 h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                        Export JSON
                    </Button>
                    <Button
                        onClick={handleExportCsv}
                        variant="secondary"
                        className="h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                        Export CSV
                    </Button>
                    </div>
                </div>

                {import.meta.env.MODE !== 'production' && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Wipe All Data (Dev Only)</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                Factory reset your account for testing. Removes all finance and task data, keeps profile.
                            </p>
                        </div>
                        <Button
                            onClick={onWipeData}
                            variant="secondary"
                            className="h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                        >
                            Wipe Data
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
