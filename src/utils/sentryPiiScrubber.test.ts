/**
 * sentryPiiScrubber tests — SEC-007
 */
import { describe, it, expect } from 'vitest';
import { sentryBeforeSend } from './sentryPiiScrubber';
import type { Event } from '@sentry/react';

describe('sentryBeforeSend — PII scrubber', () => {
    it('redacts sensitive field names in extra', () => {
        const event: Event = {
            extra: { accountId: 'abc123FID', balance: 500000, message: 'hello' },
        };
        const result = sentryBeforeSend(event);
        expect(result!.extra!.accountId).toBe('[redacted]');
        expect(result!.extra!.balance).toBe('[redacted]');
        expect(result!.extra!.message).toBe('hello');
    });

    it('redacts emails in string values', () => {
        const event: Event = {
            extra: { details: 'user test@example.com failed login' },
        };
        const result = sentryBeforeSend(event);
        expect(result!.extra!.details).not.toContain('test@example.com');
        expect(result!.extra!.details).toContain('[redacted]');
    });

    it('redacts Firestore document paths', () => {
        const event: Event = {
            extra: { context: 'users/abcdef123456789012345/finance/txnXYZ' },
        };
        const result = sentryBeforeSend(event);
        expect(result!.extra!.context).not.toContain('abcdef123456789012345');
    });

    it('redacts naira amounts', () => {
        const event: Event = {
            extra: { msg: 'Balance is ₦1,250,000.00' },
        };
        const result = sentryBeforeSend(event);
        expect(result!.extra!.msg).not.toContain('₦1,250,000.00');
    });

    it('strips email from user context but keeps id', () => {
        const event: Event = {
            user: { id: 'uid123', email: 'user@test.com' },
        };
        const result = sentryBeforeSend(event);
        expect(result!.user!.id).toBe('uid123');
        expect(result!.user!.email).toBeUndefined();
    });

    it('scrubs breadcrumb data', () => {
        const event: Event = {
            breadcrumbs: [{ type: 'http', data: { accountId: 'secret123', url: '/api' } }],
        };
        const result = sentryBeforeSend(event);
        expect(result!.breadcrumbs![0].data!.accountId).toBe('[redacted]');
        expect(result!.breadcrumbs![0].data!.url).toBe('/api');
    });

    it('handles missing optional fields gracefully', () => {
        const event: Event = { message: 'simple error' };
        expect(() => sentryBeforeSend(event)).not.toThrow();
    });
});
