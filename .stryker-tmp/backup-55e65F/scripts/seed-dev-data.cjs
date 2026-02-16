/**
 * Seed Developer Data Script
 * 
 * Creates comprehensive test data for dev/staging environments that demonstrates
 * ALL app features and behaviors. This ensures test environments mirror production
 * capabilities for realistic testing.
 * 
 * Usage: 
 * 1. Authenticate: gcloud auth application-default login
 * 2. Run: node scripts/seed-dev-data.cjs dev|staging
 * 
 * What this seeds:
 * - Test users (owner + member) with verified emails
 * - Multiple accounts (USD + NGN, checking + savings)
 * - Sample transactions (income, expenses, transfers)
 * - Sample commitments/habits
 * - Family connection between owner and member
 * - Activity feed entries
 */

const admin = require('firebase-admin');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const PROJECTS = {
    dev: 'anchor-os-dev-1c6ec',
    staging: 'anchor-os-staging'
};

const env = process.argv[2];
if (!env || !PROJECTS[env]) {
    console.error('❌ Please specify environment: dev or staging');
    console.error('   Usage: node scripts/seed-dev-data.cjs dev');
    process.exit(1);
}

const projectId = PROJECTS[env];
console.log(`\n🔌 Connecting to ${projectId}...\n`);

admin.initializeApp({
    projectId: projectId,
    credential: admin.credential.applicationDefault()
});

const auth = admin.auth();
const db = admin.firestore();

// ═══════════════════════════════════════════════════════════════════════════
// TEST DATA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const USERS = [
    {
        uid: 'test-owner',
        email: 'owner@anchor.local',
        password: 'password123',
        displayName: 'Test Owner',
        name: 'Alex Owner'
    },
    {
        uid: 'test-member',
        email: 'member@anchor.local',
        password: 'password123',
        displayName: 'Test Member',
        name: 'Jordan Member'
    }
];

// Accounts for the owner
const ACCOUNTS = [
    {
        id: 'acc-usd-checking',
        name: 'Primary Checking',
        type: 'checking',
        balanceCents: 2547832,  // $25,478.32
        currency: 'USD',
        color: '#6366f1',
        scope: 'personal',
        isArchived: false
    },
    {
        id: 'acc-usd-savings',
        name: 'Emergency Fund',
        type: 'savings',
        balanceCents: 1500000,  // $15,000.00
        currency: 'USD',
        color: '#10b981',
        scope: 'personal',
        isArchived: false
    },
    {
        id: 'acc-ngn-ops',
        name: 'Naira Operations',
        type: 'checking',
        balanceCents: 85000000,  // ₦850,000.00
        currency: 'NGN',
        color: '#f59e0b',
        scope: 'personal',
        isArchived: false
    }
];

// Generate dates for the past 30 days
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
}

// Transactions demonstrating various features
const TRANSACTIONS = [
    // Income
    { accountId: 'acc-usd-checking', title: 'Upwork Salary', amountCents: 450000, type: 'income', category: 'Salary', date: daysAgo(1) },
    { accountId: 'acc-usd-checking', title: 'Freelance Project', amountCents: 85000, type: 'income', category: 'Freelance', date: daysAgo(8) },
    { accountId: 'acc-ngn-ops', title: 'Client Payment', amountCents: 25000000, type: 'income', category: 'Business', date: daysAgo(5) },

    // Regular expenses
    { accountId: 'acc-usd-checking', title: 'Netflix Subscription', amountCents: 1599, type: 'expense', category: 'Entertainment', date: daysAgo(2) },
    { accountId: 'acc-usd-checking', title: 'Grocery Shopping', amountCents: 15647, type: 'expense', category: 'Food', date: daysAgo(3) },
    { accountId: 'acc-usd-checking', title: 'Electric Bill', amountCents: 12500, type: 'expense', category: 'Utilities', date: daysAgo(7) },
    { accountId: 'acc-usd-checking', title: 'Gas Station', amountCents: 4520, type: 'expense', category: 'Transport', date: daysAgo(4) },
    { accountId: 'acc-usd-checking', title: 'Amazon Purchase', amountCents: 8999, type: 'expense', category: 'Shopping', date: daysAgo(10) },
    { accountId: 'acc-usd-checking', title: 'Spotify Premium', amountCents: 999, type: 'expense', category: 'Entertainment', date: daysAgo(15) },
    { accountId: 'acc-usd-checking', title: 'Internet Bill', amountCents: 7999, type: 'expense', category: 'Utilities', date: daysAgo(12) },

    // Naira expenses
    { accountId: 'acc-ngn-ops', title: 'Office Rent', amountCents: 15000000, type: 'expense', category: 'Business', date: daysAgo(6) },
    { accountId: 'acc-ngn-ops', title: 'Staff Lunch', amountCents: 850000, type: 'expense', category: 'Food', date: daysAgo(2) },

    // Transfers (between accounts)
    { accountId: 'acc-usd-checking', title: 'Transfer to Savings', amountCents: 100000, type: 'transfer', category: 'Transfer', date: daysAgo(9), destinationAccountId: 'acc-usd-savings' },
];

// Commitments/Habits
const COMMITMENTS = [
    {
        id: 'habit-exercise',
        title: 'Morning Exercise',
        description: 'At least 30 minutes of physical activity',
        frequency: 'daily',
        streak: 12,
        completedToday: true,
        totalCompletions: 45,
        createdAt: daysAgo(60)
    },
    {
        id: 'habit-reading',
        title: 'Read for Growth',
        description: 'Read at least 20 pages of a book',
        frequency: 'daily',
        streak: 7,
        completedToday: false,
        totalCompletions: 28,
        createdAt: daysAgo(45)
    },
    {
        id: 'habit-budget',
        title: 'Weekly Budget Review',
        description: 'Review spending and adjust budget',
        frequency: 'weekly',
        streak: 4,
        completedToday: false,
        totalCompletions: 8,
        createdAt: daysAgo(90)
    },
    {
        id: 'habit-savings',
        title: 'Monthly Savings Goal',
        description: 'Transfer $500 to emergency fund',
        frequency: 'monthly',
        streak: 3,
        completedToday: false,
        totalCompletions: 3,
        createdAt: daysAgo(120)
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// SEEDING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

async function seedUsers() {
    console.log('👤 Seeding Users...');

    for (const user of USERS) {
        try {
            await auth.deleteUser(user.uid);
            console.log(`   🗑️  Deleted existing ${user.email}`);
        } catch (e) {
            // User doesn't exist, that's fine
        }

        await auth.createUser({
            uid: user.uid,
            email: user.email,
            password: user.password,
            displayName: user.displayName,
            emailVerified: true
        });
        console.log(`   ✅ Created ${user.email}`);
    }
}

async function seedProfiles() {
    console.log('\n📋 Seeding User Profiles...');

    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');
    const memberRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-member');

    // Owner profile with family mode enabled
    await ownerRef.set({
        name: 'Alex Owner',
        email: 'owner@anchor.local',
        theme: 'dark',
        familyMode: true,
        onboardingComplete: true,
        mfaEnabled: false,
        createdAt: daysAgo(180)
    });
    console.log('   ✅ Owner profile created with Family Mode enabled');

    // Member profile
    await memberRef.set({
        name: 'Jordan Member',
        email: 'member@anchor.local',
        theme: 'light',
        familyMode: true,
        onboardingComplete: true,
        mfaEnabled: false,
        createdAt: daysAgo(90)
    });
    console.log('   ✅ Member profile created');
}

async function seedFamilyConnection() {
    console.log('\n👨‍👩‍👧 Seeding Family Connection...');

    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');

    // Create family connection from owner to member
    await ownerRef.update({
        familyMemberId: 'test-member',
        familyMemberEmail: 'member@anchor.local',
        familyMemberName: 'Jordan Member',
        familyConnectionStatus: 'connected',
        familyConnectedAt: daysAgo(30)
    });
    console.log('   ✅ Family connection established (Owner → Member)');
}

async function seedAccounts() {
    console.log('\n🏦 Seeding Accounts...');

    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');
    const accountsRef = ownerRef.collection('accounts');

    // Clear existing accounts
    const existing = await accountsRef.get();
    for (const doc of existing.docs) {
        await doc.ref.delete();
    }

    for (const account of ACCOUNTS) {
        await accountsRef.doc(account.id).set({
            ...account,
            ownerId: 'test-owner',
            createdAt: daysAgo(60),
            sharedWith: account.id === 'acc-usd-checking' ? {
                'test-member': { sharedAt: daysAgo(25), role: 'viewer' }
            } : {}
        });
        console.log(`   ✅ ${account.name} (${account.currency})`);
    }

    console.log('   📤 Primary Checking shared with family member');
}

async function seedTransactions() {
    console.log('\n💳 Seeding Transactions...');

    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');

    for (const tx of TRANSACTIONS) {
        const accountRef = ownerRef.collection('accounts').doc(tx.accountId);
        const account = ACCOUNTS.find(a => a.id === tx.accountId);

        await accountRef.collection('finance').add({
            ...tx,
            accountName: account?.name || 'Unknown',
            currency: account?.currency || 'USD',
            createdAt: tx.date,
            createdBy: 'test-owner'
        });
    }
    console.log(`   ✅ Created ${TRANSACTIONS.length} transactions`);
}

async function seedCommitments() {
    console.log('\n🎯 Seeding Commitments/Habits...');

    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');
    const commitmentsRef = ownerRef.collection('commitments');

    // Clear existing
    const existing = await commitmentsRef.get();
    for (const doc of existing.docs) {
        await doc.ref.delete();
    }

    for (const commitment of COMMITMENTS) {
        await commitmentsRef.doc(commitment.id).set({
            ...commitment,
            userId: 'test-owner'
        });
        console.log(`   ✅ ${commitment.title} (${commitment.frequency})`);
    }
}

async function seedActivityFeed() {
    console.log('\n📰 Seeding Activity Feed...');

    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');
    const checkingRef = ownerRef.collection('accounts').doc('acc-usd-checking');
    const activityRef = checkingRef.collection('activity');

    // Clear existing
    const existing = await activityRef.get();
    for (const doc of existing.docs) {
        await doc.ref.delete();
    }

    const activities = [
        { type: 'transaction_created', message: 'Added expense: Netflix Subscription', userId: 'test-owner', userName: 'Alex Owner', timestamp: daysAgo(2) },
        { type: 'transaction_created', message: 'Added expense: Grocery Shopping', userId: 'test-owner', userName: 'Alex Owner', timestamp: daysAgo(3) },
        { type: 'account_shared', message: 'Shared account with Jordan Member', userId: 'test-owner', userName: 'Alex Owner', timestamp: daysAgo(25) },
        { type: 'transaction_created', message: 'Added income: Upwork Salary', userId: 'test-owner', userName: 'Alex Owner', timestamp: daysAgo(1) },
    ];

    for (const activity of activities) {
        await activityRef.add(activity);
    }
    console.log(`   ✅ Created ${activities.length} activity entries`);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   ANCHOR OS - DEVELOPER DATA SEEDER');
    console.log(`   Environment: ${env.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════════════');

    try {
        await seedUsers();
        await seedProfiles();
        await seedAccounts();
        await seedTransactions();
        await seedCommitments();
        await seedFamilyConnection();
        await seedActivityFeed();

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('   ✨ SEEDING COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('\n📋 Test Credentials:');
        console.log('   Owner:  owner@anchor.local / password123');
        console.log('   Member: member@anchor.local / password123');
        console.log('\n🔗 Features Seeded:');
        console.log('   • 2 Users with verified emails');
        console.log('   • 3 Accounts (2 USD, 1 NGN)');
        console.log('   • 13 Transactions (income, expenses, transfers)');
        console.log('   • 4 Habits/Commitments with streaks');
        console.log('   • Family connection (Owner ↔ Member)');
        console.log('   • Shared account (Primary Checking)');
        console.log('   • Activity feed entries');
        console.log('');

    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

main();
