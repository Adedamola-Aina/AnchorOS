/**
 * Developer Tools Action Components
 * Split from DeveloperTools.tsx per CLAUDE.md §3.2 (200-line rule)
 */
// @ts-nocheck


import React, { useState } from 'react';
import { Button } from '@anchor-os/ui';
import { useNotifications } from '../../../../context/NotificationContext';
import { seedData } from '../../../../utils/seeder';

interface ActionProps {
    userUid: string;
}

/**
 * Seed Test Data Action
 */
export const SeedDataAction: React.FC<ActionProps> = ({ userUid }) => {
    const { showToast, confirm } = useNotifications();
    const [seeding, setSeeding] = useState(false);

    const handleSeedData = async () => {
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
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Seed Test Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Populate account with random data (Accounts, Tx, Commitments).</p>
            </div>
            <Button
                onClick={handleSeedData}
                isLoading={seeding}
                className="bg-purple-600 hover:bg-purple-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
            >
                Seed Data
            </Button>
        </div>
    );
};

/**
 * Simulate Family Data Action
 */
export const SimulateFamilyAction: React.FC<ActionProps> = ({ userUid }) => {
    const { showToast } = useNotifications();

    const handleSimulate = async () => {
        try {
            const { db, APP_ID } = await import('../../../../config/firebase');
            const { doc, collection, writeBatch } = await import('firebase/firestore');
            const batch = writeBatch(db);
            const timestamp = new Date().toISOString();

            // Enable Family Mode in Config
            const familyConfigRef = doc(db, 'artifacts', APP_ID, 'users', userUid, 'family', 'config');
            batch.set(familyConfigRef, {
                spouseId: 'simulated-sarah-uid',
                spouseName: 'Sarah',
                joinedAt: timestamp,
                status: 'active'
            });

            // Inject Shared Account
            const accountRef = doc(collection(db, 'artifacts', APP_ID, 'users', userUid, 'accounts'));
            batch.set(accountRef, {
                name: 'Family Savings',
                type: 'savings',
                balanceCents: 500000,
                currency: 'NGN',
                color: '#8b5cf6',
                scope: 'family',
                ownerId: userUid,
                isArchived: false,
                sharedWith: {
                    'simulated-sarah-uid': { role: 'transact', sharedAt: timestamp }
                }
            });

            // Inject Shared Notifications
            for (let i = 0; i < 3; i++) {
                const notifRef = doc(collection(db, 'artifacts', APP_ID, 'users', userUid, 'notifications'));
                batch.set(notifRef, {
                    type: 'finance',
                    date: timestamp,
                    read: false,
                    message: i === 0 ? 'Sarah added ₦10,000 to Family Savings'
                        : i === 1 ? 'Sarah updated the Rent commitment'
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
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Simulate Family Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mock a spouse, shared accounts, and activity for testing.</p>
            </div>
            <Button
                onClick={handleSimulate}
                className="bg-purple-700 hover:bg-purple-800 h-10 px-6 text-xs font-black uppercase tracking-widest gap-2"
            >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Simulate
            </Button>
        </div>
    );
};

/**
 * Fix Shared Accounts Action
 */
export const FixSharedAccountsAction: React.FC = () => {
    const { showToast } = useNotifications();

    const handleFix = async () => {
        try {
            const { getFunctions, httpsCallable } = await import('firebase/functions');
            const functions = getFunctions();
            const fix = httpsCallable(functions, 'fixSharedAccountScopes');
            const result = await fix();
            const data = result.data as { message: string };
            showToast(data.message, 'success');
        } catch (e) {
            showToast('Error: ' + (e as Error).message, 'error');
        }
    };

    return (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Fix Shared Accounts</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update all shared accounts to have correct scope (family).</p>
            </div>
            <Button
                onClick={handleFix}
                className="bg-green-600 hover:bg-green-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
            >
                Fix Now
            </Button>
        </div>
    );
};
