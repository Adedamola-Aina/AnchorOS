/**
 * Test Factories — Centralized mock data builders for all tests.
 * 
 * Usage:
 *   import { buildAccount, buildTransaction, buildTask, buildUser } from '../test/factories';
 *   const account = buildAccount({ currency: 'USD' });
 */
// @ts-nocheck


import type {
    AnchorAccount,
    AnchorTransaction,
    AnchorTask,
} from '../types';

let idCounter = 0;
const nextId = (prefix = 'test') => `${prefix}-${++idCounter}`;

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
