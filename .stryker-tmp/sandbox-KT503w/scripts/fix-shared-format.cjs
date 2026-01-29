/**
 * Fix sharedWith format to match what getSharedAccountsWithMe expects
 */
// @ts-nocheck

const admin = require('firebase-admin');

const env = process.argv[2] || 'staging';
const PROJECTS = {
    dev: 'anchor-os-dev-1c6ec',
    staging: 'anchor-os-staging'
};

admin.initializeApp({
    projectId: PROJECTS[env],
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function fixSharedWithFormat() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   BOARD REVIEW: FIXING SHARED ACCOUNT FORMAT');
    console.log(`   Environment: ${env.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const timestamp = new Date().toISOString();
    const batch = db.batch();
    let fixCount = 0;

    // Get all owner accounts
    const accounts = await db.collection('artifacts').doc('anchor-os')
        .collection('users').doc('test-owner')
        .collection('accounts').get();

    for (const doc of accounts.docs) {
        const data = doc.data();
        const name = data.name;

        // Check if sharedWith exists but has wrong format
        if (data.sharedWith && data.sharedWith['test-member']) {
            const sw = data.sharedWith['test-member'];

            // If using 'role' instead of 'permission', or 'sharedAt' instead of 'grantedAt'
            if (sw.role || sw.sharedAt || !sw.grantedAt) {
                console.log('   🔧 Fixing: ' + name);
                console.log('      Before:', JSON.stringify(sw));

                const corrected = {
                    grantedAt: sw.grantedAt || sw.sharedAt || timestamp,
                    grantedBy: sw.grantedBy || sw.sharedBy || 'test-owner',
                    permission: sw.permission || sw.role || 'transact'
                };

                console.log('      After:', JSON.stringify(corrected));

                batch.update(doc.ref, {
                    'sharedWith.test-member': corrected,
                    scope: 'family'
                });
                fixCount++;
            }
        }
    }

    if (fixCount > 0) {
        await batch.commit();
        console.log('\n   ✅ Fixed ' + fixCount + ' accounts');
    } else {
        console.log('   ℹ️  No accounts needed fixing');
    }

    // Verify
    console.log('\n📋 VERIFICATION:\n');
    const verifyAccounts = await db.collection('artifacts').doc('anchor-os')
        .collection('users').doc('test-owner')
        .collection('accounts').where('scope', '==', 'family').get();

    console.log('   Accounts with scope=family: ' + verifyAccounts.size);
    verifyAccounts.forEach(doc => {
        const d = doc.data();
        console.log('   - ' + d.name);
        console.log('     sharedWith:', JSON.stringify(d.sharedWith));
    });

    console.log('\n✅ Now test: Login as member@anchor.local and go to Finance.\n');
}

fixSharedWithFormat().catch(console.error);
