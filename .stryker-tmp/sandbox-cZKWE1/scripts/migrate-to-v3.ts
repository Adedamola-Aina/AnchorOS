/**
 * Family Mode V3 Migration Script
 * 
 * This script updates the existing database to match the V3 schema:
 * 1. Ensures all accounts have ownerId
 * 2. Adds accountOwnerId to all transactions
 * 3. Removes scope field (no longer needed)
 */
// @ts-nocheck


import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const APP_ID = 'anchor-os';

async function migrateToV3() {
    console.log('🚀 Starting Family Mode V3 Migration...\n');

    let accountsUpdated = 0;
    let transactionsUpdated = 0;

    // Get all users
    const usersSnapshot = await db
        .collection('artifacts')
        .doc(APP_ID)
        .collection('users')
        .get();

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        console.log(`\n👤 Processing user: ${userId}`);

        // Migrate accounts
        const accountsSnapshot = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('accounts')
            .get();

        const accountBatch = db.batch();
        let accountBatchCount = 0;

        for (const accountDoc of accountsSnapshot.docs) {
            const accountData = accountDoc.data();
            const updates: any = {};

            // Ensure ownerId exists
            if (!accountData.ownerId) {
                updates.ownerId = userId;
                console.log(`  📝 Account ${accountDoc.id} (${accountData.name}): Adding ownerId`);
            }

            // Remove scope field (V3 doesn't use it)
            if (accountData.scope !== undefined) {
                updates.scope = admin.firestore.FieldValue.delete();
                console.log(`  📝 Account ${accountDoc.id} (${accountData.name}): Removing scope field`);
            }

            if (Object.keys(updates).length > 0) {
                accountBatch.update(accountDoc.ref, updates);
                accountBatchCount++;
                accountsUpdated++;
            }

            // Commit batch every 500 operations (Firestore limit)
            if (accountBatchCount >= 500) {
                await accountBatch.commit();
                accountBatchCount = 0;
            }
        }

        if (accountBatchCount > 0) {
            await accountBatch.commit();
        }

        // Migrate transactions
        const transactionsSnapshot = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('finance')
            .get();

        const txBatch = db.batch();
        let txBatchCount = 0;

        for (const txDoc of transactionsSnapshot.docs) {
            const txData = txDoc.data();
            const updates: any = {};

            // Add accountOwnerId if missing
            if (!txData.accountOwnerId) {
                // Get the account to find its owner
                if (txData.accountId) {
                    const accountRef = await db
                        .collection('artifacts')
                        .doc(APP_ID)
                        .collection('users')
                        .doc(userId)
                        .collection('accounts')
                        .doc(txData.accountId)
                        .get();

                    if (accountRef.exists) {
                        const accountData = accountRef.data();
                        updates.accountOwnerId = accountData?.ownerId || userId;
                        console.log(`  💰 Transaction ${txDoc.id}: Adding accountOwnerId`);
                    }
                }
            }

            // Remove scope field
            if (txData.scope !== undefined) {
                updates.scope = admin.firestore.FieldValue.delete();
                console.log(`  💰 Transaction ${txDoc.id}: Removing scope field`);
            }

            if (Object.keys(updates).length > 0) {
                txBatch.update(txDoc.ref, updates);
                txBatchCount++;
                transactionsUpdated++;
            }

            if (txBatchCount >= 500) {
                await txBatch.commit();
                txBatchCount = 0;
            }
        }

        if (txBatchCount > 0) {
            await txBatch.commit();
        }
    }

    console.log('\n✅ Migration Complete!');
    console.log(`   Accounts updated: ${accountsUpdated}`);
    console.log(`   Transactions updated: ${transactionsUpdated}`);
    console.log('\n🎉 Family Mode V3 is ready!');
}

migrateToV3()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
