/**
 * authEventService tests — SEC-009
 */
import { describe, it, expect } from 'vitest';
import { parseUserAgent } from './authEventService';

describe('parseUserAgent', () => {
    it('detects iOS + Safari', () => {
        const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
        const result = parseUserAgent(ua);
        expect(result.os).toBe('iOS');
        expect(result.browser).toBe('Safari');
    });

    it('detects Android + Chrome', () => {
        const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
        const result = parseUserAgent(ua);
        expect(result.os).toBe('Android');
        expect(result.browser).toBe('Chrome');
    });

    it('detects Windows + Edge', () => {
        const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0';
        const result = parseUserAgent(ua);
        expect(result.os).toBe('Windows');
        expect(result.browser).toBe('Edge');
    });

    it('detects macOS + Chrome', () => {
        const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        const result = parseUserAgent(ua);
        expect(result.os).toBe('macOS');
        expect(result.browser).toBe('Chrome');
    });

    it('detects Firefox on Linux', () => {
        const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0';
        const result = parseUserAgent(ua);
        expect(result.os).toBe('Linux');
        expect(result.browser).toBe('Firefox');
    });

    it('truncates raw UA to 200 chars', () => {
        const ua = 'a'.repeat(300);
        const result = parseUserAgent(ua);
        expect(result.raw.length).toBeLessThanOrEqual(200);
    });

    it('falls back gracefully for unrecognised UA', () => {
        const ua = 'Unknown/1.0';
        const result = parseUserAgent(ua);
        expect(result.os).toBe('Unknown OS');
        expect(result.browser).toBe('Unknown Browser');
    });
});
