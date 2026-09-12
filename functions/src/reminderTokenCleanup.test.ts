import { describe, expect, it, vi } from 'vitest';
import {
    classifyTokenSendError,
    isStaleTokenError,
    normalizeTokenSendErrorCode,
    removeTokenIfStale,
    CONFIGURATION_ERROR_CODES,
    PERMANENT_INVALID_TOKEN_ERROR_CODES,
    TRANSIENT_TOKEN_ERROR_CODES,
} from './reminderTokenCleanup';

describe('reminderTokenCleanup', () => {
    describe('classifyTokenSendError (firebase-admin 13.10.0 code surface)', () => {
        it('classifies every permanent-invalid token code', () => {
            for (const code of PERMANENT_INVALID_TOKEN_ERROR_CODES) {
                expect(classifyTokenSendError(code)).toBe('permanent-invalid');
            }
        });

        it('treats the Admin SDK unregistered/rotation code as a stale-token error', () => {
            // Backend UNREGISTERED / NOT_FOUND normalise to this Admin SDK code.
            expect(isStaleTokenError('messaging/registration-token-not-registered')).toBe(true);
            expect(isStaleTokenError('messaging/invalid-registration-token')).toBe(true);
        });

        it('classifies transient/retryable failures without ending ownership', () => {
            for (const code of TRANSIENT_TOKEN_ERROR_CODES) {
                expect(classifyTokenSendError(code)).toBe('transient');
                expect(isStaleTokenError(code)).toBe(false);
            }
            // Backend QUOTA_EXCEEDED / RESOURCE_EXHAUSTED normalise to this code.
            expect(classifyTokenSendError('messaging/message-rate-exceeded')).toBe('transient');
        });

        it('classifies APNs/third-party credential failures as configuration, not transient', () => {
            // APNS_AUTH_ERROR / UNAUTHENTICATED / InvalidApnsCredential.
            expect(classifyTokenSendError('messaging/third-party-auth-error')).toBe('configuration');
            expect(isStaleTokenError('messaging/third-party-auth-error')).toBe(false);
        });

        it('classifies credential/project/payload faults as configuration', () => {
            for (const code of CONFIGURATION_ERROR_CODES) {
                expect(classifyTokenSendError(code)).toBe('configuration');
                expect(isStaleTokenError(code)).toBe(false);
            }
        });

        it('treats unknown or absent codes as unknown', () => {
            expect(classifyTokenSendError(undefined)).toBe('unknown');
            expect(classifyTokenSendError('some/non-messaging-error')).toBe('unknown');
            expect(isStaleTokenError('some/other-error')).toBe(false);
        });
    });

    describe('raw backend/legacy alias normalisation', () => {
        it('normalises raw aliases to the Admin SDK code they map to', () => {
            expect(normalizeTokenSendErrorCode('messaging/unregistered'))
                .toBe('messaging/registration-token-not-registered');
            expect(normalizeTokenSendErrorCode('messaging/quota-exceeded'))
                .toBe('messaging/message-rate-exceeded');
            expect(normalizeTokenSendErrorCode('messaging/invalid-apns-credentials'))
                .toBe('messaging/third-party-auth-error');
        });

        it('never mistakes a raw alias for a new/unhandled state', () => {
            expect(classifyTokenSendError('messaging/unregistered')).toBe('permanent-invalid');
            expect(classifyTokenSendError('messaging/quota-exceeded')).toBe('transient');
            expect(classifyTokenSendError('messaging/invalid-apns-credentials')).toBe('configuration');
            // Unreachable legacy recipient code must not delete a token.
            expect(isStaleTokenError('messaging/invalid-recipient')).toBe(false);
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

        it('does not delete the token for transient or configuration errors', async () => {
            const deleteMock = vi.fn().mockResolvedValue(undefined);

            expect(await removeTokenIfStale('messaging/internal-error', 'token-1234567890', { delete: deleteMock })).toBe(false);
            expect(await removeTokenIfStale('messaging/third-party-auth-error', 'token-1234567890', { delete: deleteMock })).toBe(false);

            expect(deleteMock).not.toHaveBeenCalled();
        });

        it('is idempotent — repeated cleanup of the same token is safe', async () => {
            const deleteMock = vi.fn().mockResolvedValue(undefined);
            const tokenDoc = { delete: deleteMock };

            await removeTokenIfStale('messaging/registration-token-not-registered', 'token-1234567890', tokenDoc);
            await removeTokenIfStale('messaging/registration-token-not-registered', 'token-1234567890', tokenDoc);

            expect(deleteMock).toHaveBeenCalledTimes(2);
        });
    });
});