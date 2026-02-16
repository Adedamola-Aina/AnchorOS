/**
 * Tests for activityLogger.ts — logAccountActivity
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc } from 'firebase/firestore';
import { logAccountActivity } from './activityLogger';

// Mock the activity type module
vi.mock('../types/activity', () => ({
    createActivityEntry: vi.fn(
        (action: string, accountId: string, accountOwnerId: string, actorId: string, actorName: string, details: any) => ({
            action,
            accountId,
            accountOwnerId,
            actorId,
            actorName,
            details,
            timestamp: new Date().toISOString(),
        })
    ),
}));

describe('logAccountActivity', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('writes activity to Firestore', async () => {
        await logAccountActivity({
            action: 'transaction_added' as any,
            accountId: 'acc-1',
            accountOwnerId: 'owner-1',
            actorId: 'actor-1',
            actorName: 'Test User',
            details: { amountCents: 5000 } as any,
        });

        expect(addDoc).toHaveBeenCalledOnce();
    });

    it('returns early when accountId is empty', async () => {
        await logAccountActivity({
            action: 'transaction_added' as any,
            accountId: '',
            accountOwnerId: 'owner-1',
            actorId: 'actor-1',
            actorName: 'Test',
            details: {} as any,
        });

        expect(addDoc).not.toHaveBeenCalled();
    });

    it('returns early when accountOwnerId is empty', async () => {
        await logAccountActivity({
            action: 'transaction_added' as any,
            accountId: 'acc-1',
            accountOwnerId: '',
            actorId: 'actor-1',
            actorName: 'Test',
            details: {} as any,
        });

        expect(addDoc).not.toHaveBeenCalled();
    });

    it('swallows errors (non-blocking)', async () => {
        vi.mocked(addDoc).mockRejectedValueOnce(new Error('network failure'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Should NOT throw
        await expect(
            logAccountActivity({
                action: 'transaction_added' as any,
                accountId: 'acc-1',
                accountOwnerId: 'owner-1',
                actorId: 'actor-1',
                actorName: 'Test',
                details: {} as any,
            })
        ).resolves.toBeUndefined();

        expect(consoleSpy).toHaveBeenCalled();
    });
});
