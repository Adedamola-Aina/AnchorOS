#!/usr/bin/env node
/**
 * Seed Test User Data for Dev and Staging Environments
 * 
 * This script seeds Firestore with test data for the standardized test users.
 * Run with: npx ts-node scripts/seed-test-users.ts --env=dev|staging
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Configuration
const ENVIRONMENTS = {
    dev: {
        projectId: 'anchor-os-dev-1c6ec',
        userId: 'gYokI34qmTgZeN0LloGIJGaOITE2'
    },
    staging: {
        projectId: 'anchor-os-staging',
        userId: 'XYVBzwyPQvUbkEjCEmKCEMPQZXb2'
    }
};

const APP_ID = 'anchor-os';

// Test Data Templates
const TEST_PROFILE = {
    name: 'Test User',
    theme: 'dark',
    familyMode: false,
    onboardingComplete: true,
    mfaEnabled: false
};

const TEST_ACCOUNTS = [
    {
        name: 'Checking Account',
        type: 'checking',
        currency: 'NGN',
        balanceCents: 1500000, // ₦15,000
        color: '#3b82f6',
        scope: 'personal'
    },
    {
        name: 'Savings Account',
        type: 'savings',
        currency: 'NGN',
        balanceCents: 5000000, // ₦50,000
        color: '#10b981',
        scope: 'personal'
    },
    {
        name: 'USD Account',
        type: 'checking',
        currency: 'USD',
        balanceCents: 50000, // $500
        color: '#8b5cf6',
        scope: 'personal'
    }
];

const TEST_TRANSACTIONS = [
    { title: 'Salary Deposit', amountCents: 2500000, type: 'income', category: 'Salary' },
    { title: 'Rent Payment', amountCents: 800000, type: 'expense', category: 'Housing' },
    { title: 'Groceries', amountCents: 45000, type: 'expense', category: 'Food' },
    { title: 'Netflix Subscription', amountCents: 5000, type: 'expense', category: 'Entertainment' },
    { title: 'Electricity Bill', amountCents: 25000, type: 'expense', category: 'Utilities' },
    { title: 'Freelance Project', amountCents: 350000, type: 'income', category: 'Income' },
    { title: 'Gym Membership', amountCents: 15000, type: 'expense', category: 'Health' },
    { title: 'Coffee', amountCents: 2500, type: 'expense', category: 'Food' },
    { title: 'Internet Bill', amountCents: 18000, type: 'expense', category: 'Utilities' },
    { title: 'Dining Out', amountCents: 12000, type: 'expense', category: 'Food' }
];

const TEST_TASKS = [
    { title: 'Morning Workout', type: 'daily', completed: false, category: 'health', timeOfDay: 'morning' },
    { title: 'Read 30 minutes', type: 'daily', completed: true, category: 'personal', timeOfDay: 'evening' },
    { title: 'Weekly Budget Review', type: 'weekly', completed: false, category: 'finance', timeOfDay: 'afternoon' },
    { title: 'Call Family', type: 'weekly', completed: false, category: 'personal', timeOfDay: 'evening' },
    { title: 'Meditation', type: 'daily', completed: true, category: 'health', timeOfDay: 'morning' }
];

async function seedTestUser(env: 'dev' | 'staging') {
    const config = ENVIRONMENTS[env];
    console.log(`\n🌱 Seeding ${env.toUpperCase()} environment (${config.projectId})...`);
    console.log(`   User ID: ${config.userId}\n`);

    // Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS or default credentials)
    const app = initializeApp({
        projectId: config.projectId
    }, env);

    const db = getFirestore(app);
    const userDocRef = db.doc(`artifacts/${APP_ID}/users/${config.userId}`);

    // 1. Create User Profile
    console.log('📝 Creating user profile...');
    await userDocRef.set(TEST_PROFILE);

    // 2. Create Accounts
    console.log('💳 Creating accounts...');
    const accountIds: string[] = [];
    for (const account of TEST_ACCOUNTS) {
        const docRef = await userDocRef.collection('accounts').add({
            ...account,
            ownerId: config.userId
        });
        accountIds.push(docRef.id);
        console.log(`   ✓ ${account.name}`);
    }

    // 3. Create Transactions (spread across accounts)
    console.log('💸 Creating transactions...');
    const now = new Date();
    for (let i = 0; i < TEST_TRANSACTIONS.length; i++) {
        const tx = TEST_TRANSACTIONS[i];
        const accountIndex = i % accountIds.length;
        const account = TEST_ACCOUNTS[accountIndex];
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        await userDocRef.collection('finance').add({
            ...tx,
            accountId: accountIds[accountIndex],
            accountName: account.name,
            currency: account.currency,
            scope: 'personal',
            date: date.toISOString(),
            createdBy: config.userId,
            isSoftDeleted: false
        });
        console.log(`   ✓ ${tx.title}`);
    }

    // 4. Create Tasks/Commitments
    console.log('✅ Creating commitments...');
    for (const task of TEST_TASKS) {
        await userDocRef.collection('commitments').add({
            ...task,
            createdAt: FieldValue.serverTimestamp()
        });
        console.log(`   ✓ ${task.title}`);
    }

    console.log(`\n✨ ${env.toUpperCase()} seeding complete!`);
}

// Main
const args = process.argv.slice(2);
const envArg = args.find(a => a.startsWith('--env='));
const env = envArg?.split('=')[1] as 'dev' | 'staging' | undefined;

if (!env || !['dev', 'staging'].includes(env)) {
    console.log('Usage: npx ts-node scripts/seed-test-users.ts --env=dev|staging');
    console.log('       npx ts-node scripts/seed-test-users.ts --env=dev --env=staging (both)');
    process.exit(1);
}

seedTestUser(env).catch(console.error);
