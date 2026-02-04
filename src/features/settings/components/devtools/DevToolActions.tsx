/**
 * Developer Tools Action Components
 * DES-002: Migrated to semantic tokens and primitives
 */

import React, { useState } from 'react';
import { Button } from '@anchor-os/ui';
import { useNotifications } from '../../../../context/NotificationContext';
import { seedData } from '../../../../utils/seeder';
import { Text, VStack, HStack } from '../../../../components/primitives';

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
        <HStack justify="between" align="center">
            <VStack gap="xs">
                <Text weight="bold" size="xs" className="uppercase tracking-wider">Seed Test Data</Text>
                <Text variant="muted" size="sm">Populate account with random data (Accounts, Tx, Commitments).</Text>
            </VStack>
            <Button
                onClick={handleSeedData}
                isLoading={seeding}
                className="bg-task-600 hover:bg-task-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
            >
                Seed Data
            </Button>
        </HStack>
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
        <HStack justify="between" align="center" className="mt-6 pt-6 border-t border-border-subtle">
            <VStack gap="xs">
                <Text weight="bold" size="xs" className="uppercase tracking-wider">Simulate Family Data</Text>
                <Text variant="muted" size="sm">Mock a spouse, shared accounts, and activity for testing.</Text>
            </VStack>
            <Button
                onClick={handleSimulate}
                className="bg-task-700 hover:bg-task-800 h-10 px-6 text-xs font-black uppercase tracking-widest gap-2"
            >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Simulate
            </Button>
        </HStack>
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
        <HStack justify="between" align="center" className="mt-6 pt-6 border-t border-border-subtle">
            <VStack gap="xs">
                <Text weight="bold" size="xs" className="uppercase tracking-wider">Fix Shared Accounts</Text>
                <Text variant="muted" size="sm">Update all shared accounts to have correct scope (family).</Text>
            </VStack>
            <Button
                onClick={handleFix}
                className="bg-finance-600 hover:bg-finance-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
            >
                Fix Now
            </Button>
        </HStack>
    );
};

