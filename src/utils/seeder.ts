import { collection, doc, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTask, TimeOfDay } from '../types';

const TITLES = ['Groceries', 'Rent', 'Salary', 'Netflix', 'Coffee', 'Gym', 'Internet', 'Electricity', 'Dining Out', 'Freelance Project', 'Gas', 'Insurance', 'Phone Bill', 'School Fees', 'Books', 'Amazon', 'Apple', 'Spotify', 'Pharmacy', 'Vet'];
const ACCOUNT_NAMES = ['Main Checking', 'Savings Goal', 'Emergency Fund', 'Travel Card', 'Investment Portfolio', 'Joint Account', 'House Fund'];
const TASK_TITLES = ['Morning Jog', 'Read 30 mins', 'Weekly Review', 'Pay Bills', 'Call Mom', 'Gym Workout', 'Meal Prep', 'Clean House', 'Check Stocks', 'Plan Vacation', 'Bible Study', 'Code Review', 'Stretching'];
const CATEGORIES = ['Living', 'Food', 'Entertainment', 'Health', 'Transport', 'Utilities', 'Personal', 'Income', 'Transfer'];
const DOMAINS = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];

const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const seedData = async (userId: string) => {
    if (!userId) throw new Error('User ID required');

    console.log('🌱 Starting Enhanced Data Seeding...');
    let batch = writeBatch(db);
    let opCount = 0;
    const MAX_BATCH_SIZE = 450;

    const commitAndResetBatch = async () => {
        if (opCount > 0) {
            await batch.commit();
            console.log('Batch committed.');
            batch = writeBatch(db); // Create new batch for next set
            opCount = 0;
        }
    };

    // 0. Fetch User Profile for Family Mode
    let spouseId: string | undefined;
    const userProfileRef = doc(db, 'artifacts', APP_ID, 'users', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    if (userProfileSnap.exists()) {
        const data = userProfileSnap.data();
        if (data.familyMode) {
            const familyConfigRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'family', 'config');
            const familySnap = await getDoc(familyConfigRef);
            if (familySnap.exists()) {
                spouseId = familySnap.data().spouseId;
            }
        }
    }

    const accounts: AnchorAccount[] = [];

    // 1. Create Accounts
    const accountsRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'accounts');

    // Create 5 Random Accounts
    for (let i = 0; i < 5; i++) {
        const accType = i === 0 ? 'checking' : i === 1 ? 'savings' : 'checking';
        const currency = Math.random() > 0.8 ? 'USD' : 'NGN';
        const isShared = spouseId && i === 4;

        const newDocRef = doc(accountsRef);
        const newAccount: AnchorAccount = {
            id: newDocRef.id,
            name: ACCOUNT_NAMES[i] || `Account ${i}`,
            type: accType,
            currency: currency,
            balanceCents: Math.floor(Math.random() * 800000) + 5000,
            color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#6366f1'][i],
            scope: isShared ? 'family' : 'personal',
            ownerId: userId,
            shares: isShared && spouseId ? { [spouseId]: 'read' } : {},
            isArchived: false
        };

        batch.set(newDocRef, newAccount);
        accounts.push(newAccount);
        opCount++;
    }

    // CRITICAL: Commit Accounts FIRST so Rules can read them in subsequent Transaction writes
    await commitAndResetBatch();
    console.log('✅ Accounts Created (Batch 1)');

    // 2. Create Transactions (Bulk)
    const financeRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'finance');

    // Generate 60 Transactions
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 60; i++) {
        if (opCount >= MAX_BATCH_SIZE) {
            await commitAndResetBatch();
        }

        const account = accounts[Math.floor(Math.random() * accounts.length)];
        let date: Date;

        if (i < 20) date = randomDate(oneWeekAgo, now);
        else if (i < 40) date = randomDate(twoWeeksAgo, oneWeekAgo);
        else date = randomDate(oneMonthAgo, twoWeeksAgo);

        const isTransfer = Math.random() > 0.85;

        if (isTransfer && accounts.length > 1) {
            const toAccount = accounts.find(a => a.id !== account.id) || accounts[0];
            const amount = Math.floor(Math.random() * 50000) + 1000;
            const linkId = crypto.randomUUID();
            const txId1 = doc(financeRef).id;
            const txId2 = doc(financeRef).id;

            // Debit Source
            batch.set(doc(financeRef, txId1), {
                id: txId1,
                title: `Transfer to ${toAccount.name}`,
                amountCents: amount, // ALWAYS POSITIVE
                type: 'expense',
                category: 'Transfer',
                accountId: account.id,
                accountName: account.name,
                currency: account.currency,
                scope: account.scope,
                date: date.toISOString(),
                createdBy: userId,
                linkId,
                isSoftDeleted: false,
                accountShares: account.shares || {}
            });

            // Credit Dest
            batch.set(doc(financeRef, txId2), {
                id: txId2,
                title: `Transfer from ${account.name}`,
                amountCents: amount, // POSITIVE
                type: 'income',
                category: 'Transfer',
                accountId: toAccount.id,
                accountName: toAccount.name,
                currency: toAccount.currency,
                scope: toAccount.scope,
                date: date.toISOString(),
                createdBy: userId,
                linkId,
                isSoftDeleted: false,
                accountShares: toAccount.shares || {}
            });

            opCount += 2;

        } else {
            const type = Math.random() > 0.3 ? 'expense' : 'income';
            const title = TITLES[Math.floor(Math.random() * TITLES.length)];
            const category = type === 'income' ? 'Income' : CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 2))];
            const isSharedActivity = account.scope === 'family' && spouseId && Math.random() > 0.5;

            const newTxRef = doc(financeRef);
            batch.set(newTxRef, {
                id: newTxRef.id,
                title: title,
                amountCents: Math.floor(Math.random() * 20000) + 500, // ALWAYS POSITIVE
                type: type,
                category: category,
                accountId: account.id,
                accountName: account.name,
                currency: account.currency,
                scope: account.scope,
                date: date.toISOString(),
                createdBy: isSharedActivity ? spouseId : userId,
                isSoftDeleted: false,
                accountShares: account.shares || {}
            });

            if (isSharedActivity && spouseId) {
                const notifRef = doc(collection(db, 'artifacts', APP_ID, 'users', userId, 'notifications'));
                batch.set(notifRef, {
                    type: 'transaction',
                    message: `Spouse added ${title}`,
                    accountId: account.id,
                    transactionId: newTxRef.id,
                    timestamp: date.toISOString(),
                    read: false
                });
                opCount++;
            }

            opCount++;
        }
    }

    // 3. Create Commitments
    const tasksRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'commitments');

    for (let i = 0; i < 11; i++) {
        const title = TASK_TITLES[Math.floor(Math.random() * TASK_TITLES.length)];
        const taskType = i < 4 ? 'daily' : i < 8 ? 'weekly' : i < 10 ? 'monthly' : 'todo';
        const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
        const timeOfDay = ['morning', 'afternoon', 'evening', 'any'][Math.floor(Math.random() * 4)] as TimeOfDay;

        const taskData: Omit<AnchorTask, 'createdAt'> & { createdAt: any } = {
            id: doc(tasksRef).id,
            title: title,
            type: taskType,
            completed: Math.random() > 0.6,
            category: 'personal',
            createdAt: serverTimestamp(),
            domain: domain,
            reminderTime: '08:00'
        };

        if (taskType === 'daily') {
            taskData.timeOfDay = timeOfDay;
        } else if (taskType === 'weekly') {
            const days = ['Monday', 'Wednesday', 'Friday'];
            taskData.daysOfWeek = days;
        } else if (taskType === 'monthly') {
            taskData.dayOfMonth = 15;
        }

        const newTaskRef = doc(tasksRef, taskData.id);
        batch.set(newTaskRef, taskData);
        opCount++;
    }

    // Final Commit
    await commitAndResetBatch();
    console.log('✅ Specific Data Seeding Complete!');
    return true;
};
