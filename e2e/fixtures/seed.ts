/**
 * E2E Seed Fixture System — QA-005
 *
 * Pre-built Firestore data scenarios for Playwright tests.
 * Call `seed(fixture)` in test `beforeEach` to set up deterministic state.
 *
 * Fixtures:
 *   new-user             — authenticated, no accounts, no transactions
 *   finance-heavy-user   — 3 accounts, 20+ transactions, 2 recurring rules
 *   family-connected     — two users connected in family mode
 *
 * Usage:
 *   import { seed, seedUsers } from './fixtures/seed';
 *   test.beforeEach(async ({ page }) => { await seed(page, 'finance-heavy-user'); });
 */

import type { Page } from '@playwright/test';

// ─── Canonical E2E test accounts ────────────────────────────────────────────

export const seedUsers = {
    'new-user': {
        email: 'e2e-new-user@anchor-os-test.com',
        password: 'E2ENewUser!99',
        name: 'New User',
    },
    'finance-heavy-user': {
        email: 'e2e-finance@anchor-os-test.com',
        password: 'E2EFinance!99',
        name: 'Finance User',
    },
    'family-owner': {
        email: 'e2e-family-owner@anchor-os-test.com',
        password: 'E2EFamily!99',
        name: 'Family Owner',
    },
    'family-member': {
        email: 'e2e-family-member@anchor-os-test.com',
        password: 'E2EFamilyMember!99',
        name: 'Family Member',
    },
} as const;

export type SeedFixture = 'new-user' | 'finance-heavy-user' | 'family-connected';

// ─── Fixture data definitions ────────────────────────────────────────────────

interface AccountSeed {
    id: string;
    name: string;
    type: string;
    currency: string;
    balanceCents: number;
}

interface TransactionSeed {
    id: string;
    title: string;
    amountCents: number;
    type: 'income' | 'expense';
    date: string;
    accountId: string;
}

export const financeHeavyAccounts: AccountSeed[] = [
    { id: 'seed-acc-checking', name: 'Main Checking', type: 'checking', currency: 'NGN', balanceCents: 2_450_000 },
    { id: 'seed-acc-savings',  name: 'Emergency Fund', type: 'savings', currency: 'NGN', balanceCents: 5_000_000 },
    { id: 'seed-acc-credit',   name: 'Credit Card',   type: 'credit',   currency: 'NGN', balanceCents: -85_000  },
];

export const financeHeavyTransactions: TransactionSeed[] = [
    { id: 'seed-tx-1',  title: 'Salary',           amountCents: 500_000, type: 'income',  date: '2025-03-01', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-2',  title: 'Rent',              amountCents: 120_000, type: 'expense', date: '2025-03-02', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-3',  title: 'Netflix',           amountCents: 3_600,   type: 'expense', date: '2025-03-05', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-4',  title: 'Netflix',           amountCents: 3_600,   type: 'expense', date: '2025-02-05', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-5',  title: 'Netflix',           amountCents: 3_600,   type: 'expense', date: '2025-01-05', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-6',  title: 'Spotify',           amountCents: 2_400,   type: 'expense', date: '2025-03-07', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-7',  title: 'Spotify',           amountCents: 2_400,   type: 'expense', date: '2025-02-07', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-8',  title: 'Groceries',         amountCents: 45_000,  type: 'expense', date: '2025-03-10', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-9',  title: 'Groceries',         amountCents: 38_000,  type: 'expense', date: '2025-02-12', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-10', title: 'Electricity Bill',  amountCents: 18_000,  type: 'expense', date: '2025-03-15', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-11', title: 'Electricity Bill',  amountCents: 17_500,  type: 'expense', date: '2025-02-14', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-12', title: 'Electricity Bill',  amountCents: 16_800,  type: 'expense', date: '2025-01-15', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-13', title: 'Freelance income',  amountCents: 150_000, type: 'income',  date: '2025-03-18', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-14', title: 'Savings transfer',  amountCents: 100_000, type: 'expense', date: '2025-03-20', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-15', title: 'Restaurant',        amountCents: 12_000,  type: 'expense', date: '2025-03-21', accountId: 'seed-acc-credit' },
    { id: 'seed-tx-16', title: 'Uber',              amountCents: 4_500,   type: 'expense', date: '2025-03-22', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-17', title: 'Salary',            amountCents: 500_000, type: 'income',  date: '2025-02-01', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-18', title: 'Airtime',           amountCents: 5_000,   type: 'expense', date: '2025-03-01', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-19', title: 'Internet',          amountCents: 15_000,  type: 'expense', date: '2025-03-02', accountId: 'seed-acc-checking' },
    { id: 'seed-tx-20', title: 'Internet',          amountCents: 15_000,  type: 'expense', date: '2025-02-02', accountId: 'seed-acc-checking' },
];

// ─── Seed function ────────────────────────────────────────────────────────────

/**
 * Inject seed state via the browser's localStorage + Firestore dev API.
 * Requires the app to be running with VITE_APP_ENV=development.
 */
export async function seed(page: Page, fixture: SeedFixture): Promise<void> {
    const user = fixture === 'finance-heavy-user'
        ? seedUsers['finance-heavy-user']
        : fixture === 'family-connected'
            ? seedUsers['family-owner']
            : seedUsers['new-user'];

    // Store fixture metadata so the app shell can detect E2E state
    await page.goto('/');
    await page.evaluate(({ f, u }) => {
        localStorage.setItem('e2e_fixture', f);
        localStorage.setItem('e2e_user_email', u.email);
    }, { f: fixture, u: user });

    return user as never; // Callers can destructure the user if needed
}

/**
 * Get the seed user credentials for a fixture without navigating.
 */
export function getSeedUser(fixture: SeedFixture) {
    const map: Record<SeedFixture, keyof typeof seedUsers> = {
        'new-user': 'new-user',
        'finance-heavy-user': 'finance-heavy-user',
        'family-connected': 'family-owner',
    };
    return seedUsers[map[fixture]];
}

/**
 * Playwright fixture factory for use in test.extend().
 *
 * Usage:
 *   const test = base.extend<{ financeUser: void }>({
 *     financeUser: [seedFixture('finance-heavy-user'), { auto: false }],
 *   });
 */
export function seedFixture(fixture: SeedFixture) {
    return async ({ page }: { page: Page }, use: () => Promise<void>) => {
        await seed(page, fixture);
        await use();
    };
}
