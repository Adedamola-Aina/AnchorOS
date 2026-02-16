/**
 * Tests for fcmTokenService.ts — getFcmTokenWithRetry
 * Target: 90%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFcmTokenWithRetry } from './fcmTokenService';
import { getToken } from 'firebase/messaging';

vi.mock('firebase/messaging', () => ({
    getToken: vi.fn(),
}));

describe('getFcmTokenWithRetry', () => {
    const mockMessaging = {} as any;
    const vapidKey = 'test-vapid-key-123';

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock navigator.serviceWorker.ready
        Object.defineProperty(navigator, 'serviceWorker', {
            value: { ready: Promise.resolve({ scope: '/' }) },
            writable: true,
            configurable: true,
        });
    });

    it('returns token on first successful attempt', async () => {
        vi.mocked(getToken).mockResolvedValueOnce('fcm-token-abc');

        const token = await getFcmTokenWithRetry({ messaging: mockMessaging, vapidKey });
        expect(token).toBe('fcm-token-abc');
        expect(getToken).toHaveBeenCalledOnce();
    });

    it('retries on IDB closing error and succeeds', async () => {
        vi.mocked(getToken)
            .mockRejectedValueOnce(Object.assign(new Error('IDB database closing'), { name: 'Error' }))
            .mockResolvedValueOnce('recovered-token');

        const token = await getFcmTokenWithRetry({
            messaging: mockMessaging,
            vapidKey,
            maxRetries: 2,
            initialDelay: 10, // fast for tests
        });
        expect(token).toBe('recovered-token');
        expect(getToken).toHaveBeenCalledTimes(2);
    });

    it('retries on InvalidStateError', async () => {
        const idbError = new Error('Invalid state');
        idbError.name = 'InvalidStateError';
        vi.mocked(getToken)
            .mockRejectedValueOnce(idbError)
            .mockResolvedValueOnce('ok-token');

        const token = await getFcmTokenWithRetry({
            messaging: mockMessaging,
            vapidKey,
            maxRetries: 1,
            initialDelay: 10,
        });
        expect(token).toBe('ok-token');
    });

    it('throws non-retryable errors immediately', async () => {
        vi.mocked(getToken).mockRejectedValueOnce(new Error('permission denied'));

        await expect(
            getFcmTokenWithRetry({ messaging: mockMessaging, vapidKey, maxRetries: 3 })
        ).rejects.toThrow('permission denied');
        expect(getToken).toHaveBeenCalledOnce();
    });

    it('throws after exhausting retries', async () => {
        const closingError = new Error('database closing');
        vi.mocked(getToken)
            .mockRejectedValueOnce(closingError)
            .mockRejectedValueOnce(closingError)
            .mockRejectedValueOnce(closingError);

        await expect(
            getFcmTokenWithRetry({
                messaging: mockMessaging,
                vapidKey,
                maxRetries: 2,
                initialDelay: 10,
            })
        ).rejects.toThrow('database closing');
    });

    it('uses default maxRetries and initialDelay when not provided', async () => {
        vi.mocked(getToken).mockResolvedValueOnce('token');
        const token = await getFcmTokenWithRetry({ messaging: mockMessaging, vapidKey });
        expect(token).toBe('token');
    });
});
