/**
 * Seed Test Users Script
 * 
 * Usage: 
 * 1. Authenticate: gcloud auth application-default login
 * 2. Run for Dev: node scripts/seed-users.js dev
 * 3. Run for Staging: node scripts/seed-users.js staging
 */
// @ts-nocheck


const admin = require('firebase-admin');

// Configuration
const USERS = [
    {
        uid: 'test-owner',
        email: 'owner@anchor.local',
        password: 'password123',
        displayName: 'Test Owner',
        role: 'owner'
    },
    {
        uid: 'test-member',
        email: 'member@anchor.local',
        password: 'password123',
        displayName: 'Test Member',
        role: 'member'
    }
];

const PROJECTS = {
    dev: 'anchor-os-dev-1c6ec',
    staging: 'anchor-os-staging'
};

const env = process.argv[2];
if (!env || !PROJECTS[env]) {
    console.error('Please specify environment: dev or staging');
    console.error('Example: node scripts/seed-users.js dev');
    process.exit(1);
}

const projectId = PROJECTS[env];
console.log(`🔌 Connecting to ${projectId}...`);

// Initialize Admin SDK
// Assumes GOOGLE_APPLICATION_CREDENTIALS is set or gcloud auth application-default login ran
admin.initializeApp({
    projectId: projectId,
    credential: admin.credential.applicationDefault()
});

const auth = admin.auth();
const db = admin.firestore();

async function seed() {
    for (const user of USERS) {
        console.log(`\n👤 Processing ${user.email}...`);

        // 1. Create/Update Auth User
        try {
            await auth.updateUser(user.uid, {
                email: user.email,
                password: user.password,
                displayName: user.displayName,
                emailVerified: true // Important for Family Mode
            });
            console.log(`   ✅ Auth: Updated existing user`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                await auth.createUser({
                    uid: user.uid,
                    email: user.email,
                    password: user.password,
                    displayName: user.displayName,
                    emailVerified: true
                });
                console.log(`   ✅ Auth: Created new user`);
            } else {
                console.error(`   ❌ Auth Error:`, error.message);
                continue;
            }
        }

        // 2. Initialize Firestore Profile (Onboarding Complete)
        const userRef = db.collection('artifacts').doc('anchor-os').collection('users').doc(user.uid);

        // Check if exists
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                onboardingComplete: true,
                createdAt: new Date().toISOString(),
                theme: 'system',
                currency: 'USD'
            });
            console.log(`   ✅ Firestore: Created profile`);
        } else {
            console.log(`   ℹ️ Firestore: Profile already exists`);
        }

        // 3. Create Default Account (if none)
        const accountsRef = userRef.collection('accounts');
        const accounts = await accountsRef.limit(1).get();

        if (accounts.empty) {
            await accountsRef.add({
                name: 'Main Checking',
                type: 'checking',
                balanceCents: 1000000, // $10,000
                currency: 'USD',
                color: '#6366f1',
                scope: 'personal',
                isArchived: false,
                ownerId: user.uid,
                createdAt: new Date().toISOString()
            });
            console.log(`   ✅ Firestore: Created default account`);
        }
    }

    console.log('\n✨ Seeding Complete!');
}

seed().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
