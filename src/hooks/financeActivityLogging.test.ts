/**
 * financeActivityLogging — activity logging for shared/non-owner transactions
 * Target: 90%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User } from 'firebase/auth';
import { logTransactionAdded, logTransactionDeleted, logTransactionEdited } from './financeActivityLogging';
import { logAccountActivity } from '../utils/activityLogger';
import { buildAccount, buildTransaction } from '../test/factories';

vi.mock('../utils/activityLogger', () => ({
    logAccountActivity: vi.fn(),
}));

describe('financeActivityLogging', () => {
    const user = { uid: 'user-1' } as User;
    const userName = 'Test User';

    beforeEach(() => vi.clearAllMocks());

    describe('logTransactionAdded', () => {
        it('logs when account is shared', () => {
            const account = buildAccount({ ownerId: 'user-1', sharedWith: { 'user-2': true } });
            const tx = { title: 'Lunch', amountCents: 1500, type: 'expense' as const, category: 'Food', accountId: 'acc-1', currency: 'NGN' as const, scope: 'personal' as const, date: '2024-01-01' };

            logTransactionAdded(user, userName, account, tx);

            expect(logAccountActivity).toHaveBeenCalledWith(expect.objectContaining({
                action: 'transaction_added',
                actorId: 'user-1',
                actorName: 'Test User',
                details: expect.objectContaining({ transactionTitle: 'Lunch', amountCents: 1500 }),
            }));
        });

        it('logs when actor is not the owner', () => {
            const account = buildAccount({ ownerId: 'other-user' });
            const tx = { title: 'Gas', amountCents: 3000, type: 'expense' as const, category: 'Transport', accountId: 'acc-1', currency: 'NGN' as const, scope: 'personal' as const, date: '2024-01-01' };

            logTransactionAdded(user, userName, account, tx);

            expect(logAccountActivity).toHaveBeenCalled();
        });

        it('does NOT log when own account and not shared', () => {
            const account = buildAccount({ ownerId: 'user-1' });
            const tx = { title: 'Coffee', amountCents: 500, type: 'expense' as const, category: 'Food', accountId: 'acc-1', currency: 'NGN' as const, scope: 'personal' as const, date: '2024-01-01' };

            logTransactionAdded(user, userName, account, tx);

            expect(logAccountActivity).not.toHaveBeenCalled();
        });
    });

    describe('logTransactionDeleted', () => {
        it('logs deletion when account is shared', () => {
            const account = buildAccount({ ownerId: 'user-1', sharedWith: { 'user-2': true } });
            const tx = buildTransaction({ id: 'tx-1', title: 'Old TX' });

            logTransactionDeleted(user, userName, account, 'tx-1', tx);

            expect(logAccountActivity).toHaveBeenCalledWith(expect.objectContaining({
                action: 'transaction_deleted',
                details: expect.objectContaining({ transactionId: 'tx-1', transactionTitle: 'Old TX' }),
            }));
        });

        it('uses "Unknown" when original transaction not provided', () => {
            const account = buildAccount({ ownerId: 'other-user' });

            logTransactionDeleted(user, userName, account, 'tx-1', undefined);

            expect(logAccountActivity).toHaveBeenCalledWith(expect.objectContaining({
                details: expect.objectContaining({ transactionTitle: 'Unknown' }),
            }));
        });

        it('does NOT log for own unshared account', () => {
            const account = buildAccount({ ownerId: 'user-1' });
            logTransactionDeleted(user, userName, account, 'tx-1');
            expect(logAccountActivity).not.toHaveBeenCalled();
        });
    });

    describe('logTransactionEdited', () => {
        it('logs edit when account is shared', () => {
            const account = buildAccount({ ownerId: 'user-1', sharedWith: { 'user-2': true } });
            const original = buildTransaction({ id: 'tx-1', title: 'Before', amountCents: 1000 });

            logTransactionEdited(user, userName, account, 'tx-1', { title: 'After' }, original);

            expect(logAccountActivity).toHaveBeenCalledWith(expect.objectContaining({
                action: 'transaction_edited',
                details: expect.objectContaining({
                    transactionTitle: 'After',
                    previousTitle: 'Before',
                    previousAmountCents: 1000,
                }),
            }));
        });

        it('falls back to "Unknown" when no title in updates or original', () => {
            const account = buildAccount({ ownerId: 'other-user' });

            logTransactionEdited(user, userName, account, 'tx-1', { amountCents: 2000 }, undefined);

            expect(logAccountActivity).toHaveBeenCalledWith(expect.objectContaining({
                details: expect.objectContaining({ transactionTitle: 'Unknown' }),
            }));
        });

        it('does NOT log for own unshared account', () => {
            const account = buildAccount({ ownerId: 'user-1' });
            logTransactionEdited(user, userName, account, 'tx-1', { title: 'X' });
            expect(logAccountActivity).not.toHaveBeenCalled();
        });
    });
});
