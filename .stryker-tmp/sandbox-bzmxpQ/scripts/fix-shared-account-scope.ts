/**
 * One-time migration script to fix shared accounts that don't have scope: 'family'
 * Run this with: npx ts-node scripts/fix-shared-account-scope.ts
 */
// @ts-nocheck


import * as admin from 'firebase-admin';

// Initialize Firebase Admin (you'll need your service account key)
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const APP_ID = 'anchor-os';

async function fixSharedAccountScopes() {
    console.log('🔍 Finding all accounts with sharedWith map...');

    const usersSnapshot = await db.collection('artifacts').doc(APP_ID).collection('users').get();

    let fixedCount = 0;
    let totalChecked = 0;

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const accountsSnapshot = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('accounts')
            .get();

        for (const accountDoc of accountsSnapshot.docs) {
            totalChecked++;
            const data = accountDoc.data();

            // If account has sharedWith map but scope is not 'family', fix it
            if (data.sharedWith && Object.keys(data.sharedWith).length > 0) {
                if (data.scope !== 'family') {
                    console.log(`✅ Fixing account "${data.name}" (${accountDoc.id}) for user ${userId}`);
                    await accountDoc.ref.update({ scope: 'family' });
                    fixedCount++;
                } else {
                    console.log(`✓ Account "${data.name}" already has correct scope`);
                }
            }
        }
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`   Total accounts checked: ${totalChecked}`);
    console.log(`   Accounts fixed: ${fixedCount}`);
}

fixSharedAccountScopes()
    .then(() => {
        console.log('✓ Done');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
