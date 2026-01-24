/**
 * Setup Family Sharing Script
 * 
 * Creates a complete family sharing scenario between owner@anchor.local and member@anchor.local
 * with completed invitation, confirmed connection, and shared accounts.
 * 
 * Usage: node scripts/setup-family-sharing.cjs staging|dev
 */

const admin = require('firebase-admin');

const PROJECTS = {
    dev: 'anchor-os-dev-1c6ec',
    staging: 'anchor-os-staging'
};

const env = process.argv[2];
if (!env || !PROJECTS[env]) {
    console.error('❌ Please specify environment: dev or staging');
    process.exit(1);
}

admin.initializeApp({
    projectId: PROJECTS[env],
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const timestamp = new Date().toISOString();
const connectedAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago

async function setupFamilySharing() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   ANCHOR OS - FAMILY SHARING SETUP');
    console.log(`   Environment: ${env.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('🔗 Setting up Family Sharing between owner and member...\n');

    const batch = db.batch();
    const ownerRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-owner');
    const memberRef = db.collection('artifacts').doc('anchor-os').collection('users').doc('test-member');

    // 1. Update owner profile with family connection
    batch.update(ownerRef, {
        familyMode: true,
        familyMemberId: 'test-member',
        familyMemberEmail: 'member@anchor.local',
        familyMemberName: 'Jordan Member',
        familyConnectionStatus: 'connected',
        familyConnectedAt: connectedAt
    });
    console.log('   ✅ Owner profile updated with family connection');

    // 2. Update member profile with family connection
    batch.update(memberRef, {
        familyMode: true,
        familyMemberId: 'test-owner',
        familyMemberEmail: 'owner@anchor.local',
        familyMemberName: 'Alex Owner',
        familyConnectionStatus: 'connected',
        familyConnectedAt: connectedAt
    });
    console.log('   ✅ Member profile updated with family connection');

    await batch.commit();

    // 3. Create family_connections document (V2 structure)
    const connectionId = 'test-owner_test-member';
    await db.collection('artifacts').doc('anchor-os').collection('family_connections').doc(connectionId).set({
        ownerUid: 'test-owner',
        ownerEmail: 'owner@anchor.local',
        ownerName: 'Alex Owner',
        memberUid: 'test-member',
        memberEmail: 'member@anchor.local',
        memberName: 'Jordan Member',
        status: 'active',
        createdAt: connectedAt,
        confirmedAt: connectedAt
    });
    console.log('   ✅ Family connection document created');

    // 4. Share USD accounts with member
    const accountsRef = ownerRef.collection('accounts');
    const accounts = await accountsRef.get();

    let sharedCount = 0;
    for (const doc of accounts.docs) {
        const data = doc.data();
        if (data.currency === 'USD') {
            await doc.ref.update({
                sharedWith: {
                    'test-member': {
                        grantedAt: connectedAt,
                        grantedBy: 'test-owner',
                        permission: 'transact'
                    }
                },
                scope: 'family'
            });
            sharedCount++;
            console.log('   📤 Shared: ' + data.name + ' with member (transact permission)');
        }
    }

    // 5. Create activity feed entries for shared accounts
    const checkingQuery = await accountsRef.where('name', '==', 'Primary Checking').limit(1).get();
    if (!checkingQuery.empty) {
        const checkingDoc = checkingQuery.docs[0];
        const activityRef = checkingDoc.ref.collection('activity');

        // Clear old activity
        const oldActivity = await activityRef.get();
        for (const doc of oldActivity.docs) {
            await doc.ref.delete();
        }

        // Add realistic activity
        const activities = [
            { type: 'account_shared', message: 'Shared account with Jordan Member', userId: 'test-owner', userName: 'Alex Owner', timestamp: connectedAt },
            { type: 'transaction_created', message: 'Added expense: Netflix Subscription', userId: 'test-owner', userName: 'Alex Owner', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { type: 'transaction_created', message: 'Added expense: Grocery Shopping', userId: 'test-member', userName: 'Jordan Member', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { type: 'transaction_created', message: 'Added income: Upwork Payment', userId: 'test-owner', userName: 'Alex Owner', timestamp: timestamp }
        ];

        for (const activity of activities) {
            await activityRef.add(activity);
        }
        console.log('   📰 Created 4 activity feed entries');
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   ✨ FAMILY SHARING SETUP COMPLETE!');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📋 Test Credentials:');
    console.log('   Owner:  owner@anchor.local / password123');
    console.log('   Member: member@anchor.local / password123\n');
    console.log('🔗 Family Connection:');
    console.log('   Alex Owner ↔ Jordan Member (connected ' + connectedAt.split('T')[0] + ')\n');
    console.log('📤 Shared Accounts (Owner → Member):');
    console.log('   - Primary Checking (USD) - transact permission');
    console.log('   - Emergency Fund (USD) - transact permission\n');
    console.log('🧪 What to test:');
    console.log('   1. Login as owner → See all accounts');
    console.log('   2. Login as member → See shared accounts in Finance');
    console.log('   3. Member can add transactions to shared accounts');
    console.log('   4. Activity feed shows transactions from both users\n');
}

setupFamilySharing().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
