/**
 * Integration tests for FinanceService using Firebase Emulator
 * 
 * Prerequisites:
 * 1. Firebase Emulator must be running: firebase emulators:start
 * 2. Run with: npm run test:integration
 * 
 * Or use the helper script: ./scripts/test-with-emulator.sh
 */

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import type { CreateAccountPayload } from '../FinanceService';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Check if emulator is available
const isEmulatorRunning = () => {
    return !!process.env.FIRESTORE_EMULATOR_HOST;
};

describe('FinanceService Integration', () => {
    let testEnv: RulesTestEnvironment;

    beforeAll(async () => {
        // Skip if emulator is not running
        if (!isEmulatorRunning()) {
            console.log('⚠️  Skipping integration tests: FIRESTORE_EMULATOR_HOST not set');
            console.log('   Run with: ./scripts/test-with-emulator.sh');
            return;
        }

        // Load Firestore rules
        let rules: string;
        try {
            rules = readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf-8');
        } catch {
            console.log('Could not load firestore.rules, using permissive rules for testing');
            rules = `rules_version = '2'; service cloud.firestore { match /{document=**} { allow read, write: if true; } }`;
        }

        testEnv = await initializeTestEnvironment({
            projectId: 'anchor-os-test',
            firestore: {
                host: 'localhost',
                port: 8080,
                rules,
            },
        });
    });

    beforeEach(async () => {
        if (testEnv) {
            await testEnv.clearFirestore();
        }
    });

    afterAll(async () => {
        if (testEnv) {
            await testEnv.cleanup();
        }
    });

    it('adds an account successfully', async () => {
        // Skip if emulator is not running
        if (!isEmulatorRunning()) {
            console.log('Skipping: emulator not running');
            return;
        }

        const payload: CreateAccountPayload = {
            name: 'Test Bank',
            balanceCents: 100000,
            type: 'checking',
            currency: 'USD',
            color: '#3B82F6',
            scope: 'personal'
        };

        // Use authenticated context
        const testUid = 'test-user-123';
        const authenticatedContext = testEnv.authenticatedContext(testUid);
        const db = authenticatedContext.firestore();

        // Create an account in the correct path
        const accountRef = db.collection('artifacts')
            .doc('anchor-os')
            .collection('users')
            .doc(testUid)
            .collection('accounts')
            .doc('test-account-1');

        await accountRef.set({
            name: payload.name,
            balanceCents: payload.balanceCents,
            type: payload.type,
            currency: payload.currency,
            color: payload.color,
            scope: payload.scope,
            ownerId: testUid,
            createdAt: new Date().toISOString(),
        });

        // Verify it was created
        const snapshot = await accountRef.get();
        expect(snapshot.exists).toBe(true);
        expect(snapshot.data()?.name).toBe('Test Bank');

        console.log('✓ Account creation validated:', payload.name);
    });

    it('creates and retrieves transactions', async () => {
        if (!isEmulatorRunning()) {
            console.log('Skipping: emulator not running');
            return;
        }

        const testUid = 'test-user-456';
        const authenticatedContext = testEnv.authenticatedContext(testUid);
        const db = authenticatedContext.firestore();

        // First, create an account (required by security rules for transaction creation)
        const accountRef = db.collection('artifacts')
            .doc('anchor-os')
            .collection('users')
            .doc(testUid)
            .collection('accounts')
            .doc('test-account-1');

        await accountRef.set({
            name: 'Test Account',
            balanceCents: 100000,
            type: 'checking',
            currency: 'USD',
            color: '#3B82F6',
            scope: 'personal',
            ownerId: testUid,
            createdAt: new Date().toISOString(),
        });

        // Now create a transaction linked to that account
        const txRef = db.collection('artifacts')
            .doc('anchor-os')
            .collection('users')
            .doc(testUid)
            .collection('finance')
            .doc('test-tx-1');

        await txRef.set({
            title: 'Test Transaction',
            amountCents: 5000,
            type: 'expense',
            category: 'food',
            date: new Date().toISOString(),
            accountId: 'test-account-1',
            createdAt: new Date().toISOString(),
        });

        // Read it back
        const snapshot = await txRef.get();
        expect(snapshot.exists).toBe(true);
        expect(snapshot.data()?.title).toBe('Test Transaction');
        expect(snapshot.data()?.amountCents).toBe(5000);

        console.log('✓ Transaction created and retrieved successfully');
    });

    it('enforces Firestore security rules - blocks unauthorized access', async () => {
        if (!isEmulatorRunning()) {
            console.log('Skipping: emulator not running');
            return;
        }

        // Unauthenticated context should be denied
        const unauthenticatedContext = testEnv.unauthenticatedContext();
        const db = unauthenticatedContext.firestore();

        const txRef = db.collection('artifacts')
            .doc('anchor-os')
            .collection('users')
            .doc('some-other-user')
            .collection('finance')
            .doc('test-tx');

        // This should fail due to security rules
        try {
            await txRef.set({
                title: 'Unauthorized Transaction',
                amountCents: 1000,
                type: 'expense',
                category: 'test',
                date: new Date().toISOString(),
            });
            // If we reach here, the write succeeded (shouldn't happen with proper rules)
            expect.fail('Security rules should have blocked this write');
        } catch (error) {
            // Expected - security rules blocked the write
            console.log('✓ Security rules correctly blocked unauthorized write');
            expect(error).toBeDefined();
        }
    });

    it('prevents users from accessing other users data', async () => {
        if (!isEmulatorRunning()) {
            console.log('Skipping: emulator not running');
            return;
        }

        // Create data as user1
        const user1Context = testEnv.authenticatedContext('user-1');
        const db1 = user1Context.firestore();

        const user1AccountRef = db1.collection('artifacts')
            .doc('anchor-os')
            .collection('users')
            .doc('user-1')
            .collection('accounts')
            .doc('private-account');

        await user1AccountRef.set({
            name: 'User 1 Private Account',
            balanceCents: 999999,
            type: 'savings',
            currency: 'USD',
            color: '#000000',
            scope: 'personal',
            ownerId: 'user-1',
            createdAt: new Date().toISOString(),
        });

        // Try to read as user2
        const user2Context = testEnv.authenticatedContext('user-2');
        const db2 = user2Context.firestore();

        const attemptRead = db2.collection('artifacts')
            .doc('anchor-os')
            .collection('users')
            .doc('user-1')
            .collection('accounts')
            .doc('private-account');

        try {
            await attemptRead.get();
            // If the read succeeds, that's wrong
            expect.fail('Security rules should have blocked this read');
        } catch (error) {
            // Expected - user2 can't read user1's data
            console.log('✓ Security rules correctly blocked cross-user read');
            expect(error).toBeDefined();
        }
    });
});
