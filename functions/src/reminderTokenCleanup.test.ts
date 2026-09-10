import { describe, expect, it, vi } from 'vitest';
import {
    classifyTokenSendError,
    isStaleTokenError,
    removeTokenIfStale,
    PERMANENT_INVALID_TOKEN_ERROR_CODES,
} from './reminderTokenCleanup';

describe('reminderTokenCleanup', () => {
    describe('classifyTokenSendError (SN-08 error-code matrix)', () => {
        it('classifies every permanent-invalid token code', () => {
            for (const code of PERMANENT_INVALID_TOKEN_ERROR_CODES) {
                expect(classifyTokenSendError(code)).toBe('permanent-invalid');
            }
        });

        it('treats the legacy two codes as stale-token errors', () => {
            expect(isStaleTokenError('messaging/registration-token-not-registered')).toBe(true);
            expect(isStaleTokenError('messaging/invalid-registration-token')).toBe(true);
        });

        it('treats newly-covered permanent failures as stale-token errors', () => {
            expect(isStaleTokenError('messaging/unregistered')).toBe(true);
            expect(isStaleTokenError('messaging/invalid-recipient')).toBe(true);
        });

        it('classifies transient/retryable failures without ending ownership', () => {
            expect(classifyTokenSendError('messaging/server-unavailable')).toBe('transient');
            expect(classifyTokenSendError('messaging/internal-error')).toBe('transient');
            expect(classifyTokenSendError('messaging/quota-exceeded')).toBe('transient');
            expect(isStaleTokenError('messaging/server-unavailable')).toBe(false);
        });

        it('classifies configuration faults as non-deleting', () => {
            expect(classifyTokenSendError('messaging/mismatched-credential')).toBe('configuration');
            expect(classifyTokenSendError('messaging/invalid-apns-credentials')).toBe('configuration');
            expect(isStaleTokenError('messaging/mismatched-credential')).toBe(false);
        });

        it('treats unknown or absent codes as unknown', () => {
            expect(classifyTokenSendError(undefined)).toBe('unknown');
            expect(classifyTokenSendError('some/non-messaging-error')).toBe('unknown');
            expect(isStaleTokenError('some/other-error')).toBe(false);
        });
    });

    describe('removeTokenIfStale', () => {
        it('deletes the token document for a permanent-invalid code', async () => {
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

        it('deletes on rotation (registration-token-not-registered)', async () => {
            const deleteMock = vi.fn().mockResolvedValue(undefined);

            const removed = await removeTokenIfStale(
                'messaging/registration-token-not-registered',
                'rotated-token-1234567890',
                { delete: deleteMock },
            );

            expect(removed).toBe(true);
            expect(deleteMock).toHaveBeenCalledOnce();
        });

        it('does not delete the token for non-stale errors', async () => {
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

        it('is idempotent — repeated cleanup of the same token is safe', async () => {
            const deleteMock = vi.fn().mockResolvedValue(undefined);
            const tokenDoc = { delete: deleteMock };

            await removeTokenIfStale('messaging/unregistered', 'token-1234567890', tokenDoc);
            await removeTokenIfStale('messaging/unregistered', 'token-1234567890', tokenDoc);

            expect(deleteMock).toHaveBeenCalledTimes(2);
        });
    });
});
