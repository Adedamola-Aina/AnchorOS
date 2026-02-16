/**
 * Data Seeder Utility
 * Refactored per CLAUDE.md §3.2 - data constants extracted to seederData.ts
 */

import { collection, doc, writeBatch, serverTimestamp, getDoc, type FieldValue } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTask, TimeOfDay } from '../types';
import { TITLES, ACCOUNT_NAMES, TASK_TITLES, CATEGORIES, DOMAINS, ACCOUNT_COLORS, randomDate, randomItem, secureRandomInt } from './seederData';

export const seedData = async (userId: string) => {
    if (!userId) throw new Error('User ID required');
    if (import.meta.env.DEV) console.info('🌱 Starting Enhanced Data Seeding...');

    let batch = writeBatch(db);
    let opCount = 0;
    const MAX_BATCH_SIZE = 450;

    const commitAndResetBatch = async () => {
        if (opCount > 0) { await batch.commit(); if (import.meta.env.DEV) console.info('Batch committed.'); batch = writeBatch(db); opCount = 0; }
    };

    // Fetch User Profile for Family Mode
    let spouseId: string | undefined;
    const userProfileRef = doc(db, 'artifacts', APP_ID, 'users', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    if (userProfileSnap.exists()) {
        const data = userProfileSnap.data();
        if (data.familyMode) {
            const familyConfigRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'family', 'config');
            const familySnap = await getDoc(familyConfigRef);
            if (familySnap.exists()) spouseId = familySnap.data().spouseId;
        }
    }

    const accounts: AnchorAccount[] = [];
    const accountsRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'accounts');

    // Create 5 Accounts
    for (let i = 0; i < 5; i++) {
        const accType = i === 0 ? 'checking' : i === 1 ? 'savings' : 'checking';
        const currency = secureRandomInt(100) >= 80 ? 'USD' : 'NGN';
        const isShared = spouseId && i === 4;
        const newDocRef = doc(accountsRef);
        const newAccount: AnchorAccount = {
            id: newDocRef.id, name: ACCOUNT_NAMES[i] || `Account ${i}`, type: accType, currency,
            balanceCents: secureRandomInt(800000) + 5000, color: ACCOUNT_COLORS[i],
            scope: isShared ? 'family' : 'personal', ownerId: userId,
            shares: isShared && spouseId ? { [spouseId]: 'read' } : {}, isArchived: false
        };
        batch.set(newDocRef, newAccount);
        accounts.push(newAccount);
        opCount++;
    }
    await commitAndResetBatch();
    if (import.meta.env.DEV) console.info('✅ Accounts Created');

    // Create Transactions
    const financeRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'finance');
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 60; i++) {
        if (opCount >= MAX_BATCH_SIZE) await commitAndResetBatch();
        const account = randomItem(accounts);
        const date = i < 20 ? randomDate(oneWeekAgo, now) : i < 40 ? randomDate(twoWeeksAgo, oneWeekAgo) : randomDate(oneMonthAgo, twoWeeksAgo);
        const isTransfer = secureRandomInt(100) >= 85;

        if (isTransfer && accounts.length > 1) {
            const toAccount = accounts.find(a => a.id !== account.id) || accounts[0];
            const amount = secureRandomInt(50000) + 1000;
            const linkId = crypto.randomUUID();
            const txId1 = doc(financeRef).id, txId2 = doc(financeRef).id;

            batch.set(doc(financeRef, txId1), { id: txId1, title: `Transfer to ${toAccount.name}`, amountCents: amount, type: 'expense', category: 'Transfer', accountId: account.id, accountName: account.name, currency: account.currency, scope: account.scope, date: date.toISOString(), createdBy: userId, linkId, isSoftDeleted: false, accountShares: account.shares || {} });
            batch.set(doc(financeRef, txId2), { id: txId2, title: `Transfer from ${account.name}`, amountCents: amount, type: 'income', category: 'Transfer', accountId: toAccount.id, accountName: toAccount.name, currency: toAccount.currency, scope: toAccount.scope, date: date.toISOString(), createdBy: userId, linkId, isSoftDeleted: false, accountShares: toAccount.shares || {} });
            opCount += 2;
        } else {
            const type = secureRandomInt(100) >= 30 ? 'expense' : 'income';
            const title = randomItem(TITLES);
            const category = type === 'income' ? 'Income' : randomItem(CATEGORIES.slice(0, -2));
            const isSharedActivity = account.scope === 'family' && spouseId && secureRandomInt(100) >= 50;
            const newTxRef = doc(financeRef);
            batch.set(newTxRef, { id: newTxRef.id, title, amountCents: secureRandomInt(20000) + 500, type, category, accountId: account.id, accountName: account.name, currency: account.currency, scope: account.scope, date: date.toISOString(), createdBy: isSharedActivity ? spouseId : userId, isSoftDeleted: false, accountShares: account.shares || {} });
            if (isSharedActivity && spouseId) {
                const notifRef = doc(collection(db, 'artifacts', APP_ID, 'users', userId, 'notifications'));
                batch.set(notifRef, { type: 'transaction', message: `Spouse added ${title}`, accountId: account.id, transactionId: newTxRef.id, timestamp: date.toISOString(), read: false });
                opCount++;
            }
            opCount++;
        }
    }

    // Create Commitments
    const tasksRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'commitments');
    for (let i = 0; i < 11; i++) {
        const title = randomItem(TASK_TITLES);
        const taskType = i < 4 ? 'daily' : i < 8 ? 'weekly' : i < 10 ? 'monthly' : 'todo';
        const domain = randomItem(DOMAINS);
        const timeOfDay = ['morning', 'afternoon', 'evening', 'any'][secureRandomInt(4)] as TimeOfDay;
        const taskData: Omit<AnchorTask, 'createdAt'> & { createdAt: FieldValue } = { id: doc(tasksRef).id, title, type: taskType, completed: secureRandomInt(100) >= 60, category: 'personal', createdAt: serverTimestamp(), domain, reminderTime: '08:00' };
        if (taskType === 'daily') taskData.timeOfDay = timeOfDay;
        else if (taskType === 'weekly') taskData.daysOfWeek = ['Monday', 'Wednesday', 'Friday'];
        else if (taskType === 'monthly') taskData.dayOfMonth = 15;
        batch.set(doc(tasksRef, taskData.id), taskData);
        opCount++;
    }

    await commitAndResetBatch();
    if (import.meta.env.DEV) console.info('✅ Seeding Complete!');
    return true;
};
