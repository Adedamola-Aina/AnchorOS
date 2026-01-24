import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { seedData } from '../../../utils/seeder';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface DeveloperToolsProps {
    userUid: string;
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ userUid }) => {
    const { showToast, confirm } = useNotifications();
    const [seeding, setSeeding] = useState(false);

    const handleSimulateFamilyData = async () => {
        try {
            const { db, APP_ID } = await import('../../../config/firebase');
            const { doc, collection, writeBatch } = await import('firebase/firestore');
            const batch = writeBatch(db);
            const timestamp = new Date().toISOString();

            // 1. Enable Family Mode in Config
            const familyConfigRef = doc(db, 'artifacts', APP_ID, 'users', userUid, 'family', 'config');
            batch.set(familyConfigRef, {
                spouseId: 'simulated-sarah-uid',
                spouseName: 'Sarah',
                joinedAt: timestamp,
                status: 'active'
            });

            // 2. Inject Shared Account (with current user having transact permission)
            const accountRef = doc(collection(db, 'artifacts', APP_ID, 'users', userUid, 'accounts'));
            batch.set(accountRef, {
                name: 'Family Savings',
                type: 'savings',
                balanceCents: 500000,
                currency: 'NGN',
                color: '#8b5cf6',
                scope: 'family',
                ownerId: userUid, // Current user owns it but simulates shared scenario
                isArchived: false,
                sharedWith: {
                    'simulated-sarah-uid': { role: 'transact', sharedAt: timestamp }
                }
            });

            // 3. Inject Shared Notifications
            for (let i = 0; i < 3; i++) {
                const notifRef = doc(collection(db, 'artifacts', APP_ID, 'users', userUid, 'notifications'));
                batch.set(notifRef, {
                    type: 'finance',
                    date: timestamp,
                    read: false,
                    message: i === 0
                        ? 'Sarah added ₦10,000 to Family Savings'
                        : i === 1
                            ? 'Sarah updated the Rent commitment'
                            : 'Sarah shared a new grocery list',
                    title: i === 0 ? 'Transaction' : 'Family Update',
                    accountId: accountRef.id,
                    accountName: 'Family Savings',
                    actorId: 'simulated-sarah-uid',
                    actorName: 'Sarah'
                });
            }

            await batch.commit();
            showToast('Family data simulated! Refreshing...', 'success');
            setTimeout(() => window.location.reload(), 1500);
        } catch (e) {
            showToast('Simulation failed: ' + (e as Error).message, 'error');
        }
    };

    return (
        <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-purple-50/20 dark:bg-purple-900/10">
                <CardTitle className="text-base font-bold text-purple-900 dark:text-purple-400 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Developer Tools
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Seed Test Data</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Populate account with random data (Accounts, Tx, Commitments).</p>
                    </div>
                    <Button
                        onClick={async () => {
                            if (!userUid) return;
                            if (!await confirm({
                                title: 'Seed Test Data?',
                                message: 'This will add random transactions, accounts, and tasks to your profile. This is intended for development and testing only. Continue?',
                                confirmText: 'Seed Database',
                                type: 'danger'
                            })) return;
                            setSeeding(true);
                            try {
                                await seedData(userUid);
                                showToast('Seeding Complete! Refresh to see data.', 'success');
                            } catch (e) {
                                showToast('Error: ' + (e as Error).message, 'error');
                            } finally {
                                setSeeding(false);
                            }
                        }}
                        isLoading={seeding}
                        className="bg-purple-600 hover:bg-purple-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
                    >
                        Seed Data
                    </Button>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Simulate Family Data</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mock a spouse, shared accounts, and activity for testing.</p>
                    </div>
                    <Button
                        onClick={handleSimulateFamilyData}
                        className="bg-purple-700 hover:bg-purple-800 h-10 px-6 text-xs font-black uppercase tracking-widest gap-2"
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Simulate
                    </Button>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Fix Shared Accounts</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update all shared accounts to have correct scope (family).</p>
                    </div>
                    <Button
                        onClick={async () => {
                            try {
                                const { getFunctions, httpsCallable } = await import('firebase/functions');
                                const functions = getFunctions();
                                const fix = httpsCallable(functions, 'fixSharedAccountScopes');
                                const result = await fix();
                                const data = result.data as any;
                                showToast(data.message, 'success');
                            } catch (e) {
                                showToast('Error: ' + (e as Error).message, 'error');
                            }
                        }}
                        className="bg-green-600 hover:bg-green-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
                    >
                        Fix Now
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
