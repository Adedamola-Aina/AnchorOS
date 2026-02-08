/**
 * Test Factories — Centralized mock data builders for all tests.
 * 
 * Usage:
 *   import { buildAccount, buildTransaction, buildTask, buildUser } from '../test/factories';
 *   const account = buildAccount({ currency: 'USD' });
 */

import type {
    AnchorAccount,
    AnchorTransaction,
    AnchorTask,
    UserProfile,
    RecurringTransaction,
    FamilyConnection,
    AnchorNotification,
} from '../types';

let idCounter = 0;
const nextId = (prefix = 'test') => `${prefix}-${++idCounter}`;

/** Reset ID counter between test files */
export const resetFactoryIds = () => { idCounter = 0; };

// ─── Account ───────────────────────────────────────────────────────
export function buildAccount(overrides: Partial<AnchorAccount> = {}): AnchorAccount {
    return {
        id: nextId('acc'),
        name: 'Test Account',
        type: 'checking',
        currency: 'NGN',
        balanceCents: 500000, // ₦5,000.00
        color: '#3b82f6',
        scope: 'personal',
        ownerId: 'user-1',
        ...overrides,
    };
}

// ─── Transaction ───────────────────────────────────────────────────
export function buildTransaction(overrides: Partial<AnchorTransaction> = {}): AnchorTransaction {
    return {
        id: nextId('tx'),
        title: 'Test Transaction',
        amountCents: 10000, // ₦100.00
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'NGN',
        scope: 'personal',
        date: new Date().toISOString(),
        ...overrides,
    };
}

// ─── Task / Commitment ────────────────────────────────────────────
export function buildTask(overrides: Partial<AnchorTask> = {}): AnchorTask {
    return {
        id: nextId('task'),
        title: 'Test Task',
        type: 'daily',
        completed: false,
        category: 'personal',
        createdAt: new Date(),
        currentStreak: 0,
        longestStreak: 0,
        ...overrides,
    };
}

// ─── User Profile ──────────────────────────────────────────────────
export function buildProfile(overrides: Partial<UserProfile> = {}): UserProfile {
    return {
        name: 'Test User',
        familyMode: false,
        theme: 'light',
        mfaEnabled: false,
        onboardingComplete: true,
        ...overrides,
    };
}

// ─── Firebase Auth User (mock shape) ────────────────────────────────
export function buildAuthUser(overrides: Record<string, unknown> = {}) {
    return {
        uid: 'user-1',
        email: 'test@anchor.app',
        displayName: 'Test User',
        emailVerified: true,
        ...overrides,
    };
}

// ─── Recurring Transaction ─────────────────────────────────────────
export function buildRecurring(overrides: Partial<RecurringTransaction> = {}): RecurringTransaction {
    return {
        id: nextId('rec'),
        title: 'Monthly Rent',
        amountCents: 15000000, // ₦150,000.00
        type: 'expense',
        category: 'Housing',
        accountId: 'acc-1',
        frequency: 'monthly',
        interval: 1,
        nextRunAt: new Date().toISOString(),
        status: 'active',
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

// ─── Family Connection ─────────────────────────────────────────────
export function buildFamilyConnection(overrides: Partial<FamilyConnection> = {}): FamilyConnection {
    return {
        id: nextId('fam'),
        ownerUid: 'user-1',
        memberUid: 'user-2',
        ownerDisplayName: 'Owner User',
        memberDisplayName: 'Member User',
        status: 'active',
        connectedAt: new Date().toISOString(),
        ...overrides,
    };
}

// ─── Notification ──────────────────────────────────────────────────
export function buildNotification(overrides: Partial<AnchorNotification> = {}): AnchorNotification {
    return {
        id: nextId('notif'),
        type: 'finance',
        date: new Date().toISOString(),
        read: false,
        message: 'Test notification body',
        title: 'Test Notification',
        ...overrides,
    };
}
