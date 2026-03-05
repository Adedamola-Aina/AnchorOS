import { describe, expect, it, vi } from 'vitest';
import { isStaleTokenError, removeTokenIfStale } from './reminderTokenCleanup';

describe('reminderTokenCleanup', () => {
    it('detects stale FCM token error codes', () => {
        expect(isStaleTokenError('messaging/registration-token-not-registered')).toBe(true);
        expect(isStaleTokenError('messaging/invalid-registration-token')).toBe(true);
        expect(isStaleTokenError('messaging/some-other-error')).toBe(false);
        expect(isStaleTokenError(undefined)).toBe(false);
    });

    it('deletes token document when error is stale-token', async () => {
        const deleteMock = vi.fn().mockResolvedValue(undefined);
        const tokenDoc = { delete: deleteMock };

        const removed = await removeTokenIfStale(
            'messaging/invalid-registration-token',
            'token-1234567890',
            tokenDoc,
        );

        expect(removed).toBe(true);
        expect(deleteMock).toHaveBeenCalledOnce();
    });

    it('does not delete token document for non-stale errors', async () => {
        const deleteMock = vi.fn().mockResolvedValue(undefined);
        const tokenDoc = { delete: deleteMock };

        const removed = await removeTokenIfStale(
            'messaging/internal-error',
            'token-1234567890',
            tokenDoc,
        );

        expect(removed).toBe(false);
        expect(deleteMock).not.toHaveBeenCalled();
    });
});
