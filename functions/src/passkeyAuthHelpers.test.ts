import { describe, expect, it } from 'vitest';
import { resolveChallengeRateLimitId } from './passkeyAuthHelpers';

/**
 * RA-03 (#150): anonymous challenge requests must not all share one rate-limit
 * bucket, or a single caller can deny passkey availability to everyone.
 */
describe('resolveChallengeRateLimitId', () => {
    it('prefers the authenticated uid', () => {
        expect(resolveChallengeRateLimitId({ uid: 'user-1', remoteIp: '10.0.0.1' })).toBe('user-1');
    });

    it('uses the first x-forwarded-for hop for anonymous callers', () => {
        expect(
            resolveChallengeRateLimitId({ forwardedFor: '203.0.113.7, 10.0.0.1' }),
        ).toBe('ip:203.0.113.7');
    });

    it('handles an array-valued x-forwarded-for header', () => {
        expect(resolveChallengeRateLimitId({ forwardedFor: ['198.51.100.4'] })).toBe('ip:198.51.100.4');
    });

    it('falls back to the socket remote address', () => {
        expect(resolveChallengeRateLimitId({ remoteIp: '192.0.2.9' })).toBe('ip:192.0.2.9');
    });

    it('gives distinct anonymous callers distinct buckets', () => {
        const a = resolveChallengeRateLimitId({ forwardedFor: '203.0.113.7' });
        const b = resolveChallengeRateLimitId({ forwardedFor: '203.0.113.8' });
        expect(a).not.toBe(b);
    });

    it('only falls back to the shared bucket when nothing identifies the caller', () => {
        expect(resolveChallengeRateLimitId({})).toBe('anon');
        expect(resolveChallengeRateLimitId({ uid: '  ' })).toBe('anon');
    });
});
