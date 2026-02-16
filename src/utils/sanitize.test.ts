// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { encodeHtml, decodeHtml, sanitizeObject, stripHtml, sanitizeUrl } from './sanitize';

describe('sanitize', () => {
    describe('encodeHtml', () => {
        it('encodes HTML special characters', () => {
            expect(encodeHtml('<script>alert("XSS")</script>')).toBe(
                '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
            );
        });

        it('encodes ampersands', () => {
            expect(encodeHtml('AT&T')).toBe('AT&amp;T');
        });

        it('encodes single quotes', () => {
            expect(encodeHtml("It's fine")).toBe('It&#x27;s fine');
        });

        it('returns non-strings unchanged', () => {
            expect(encodeHtml(123 as unknown as string)).toBe(123);
            expect(encodeHtml(null as unknown as string)).toBe(null);
        });

        it('handles empty strings', () => {
            expect(encodeHtml('')).toBe('');
        });
    });

    describe('decodeHtml', () => {
        it('decodes HTML entities back to original', () => {
            expect(decodeHtml('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')).toBe(
                '<script>alert("XSS")</script>'
            );
        });

        it('decodes ampersands', () => {
            expect(decodeHtml('AT&amp;T')).toBe('AT&T');
        });

        it('roundtrips encode/decode', () => {
            const original = '<div class="test">Hello & Goodbye</div>';
            expect(decodeHtml(encodeHtml(original))).toBe(original);
        });
    });

    describe('sanitizeObject', () => {
        it('sanitizes nested objects', () => {
            const input = {
                name: '<script>bad</script>',
                nested: {
                    value: '<img onerror="alert(1)">'
                }
            };
            const result = sanitizeObject(input);
            expect(result.name).toBe('&lt;script&gt;bad&lt;/script&gt;');
            expect(result.nested.value).toBe('&lt;img onerror=&quot;alert(1)&quot;&gt;');
        });

        it('sanitizes arrays', () => {
            const input = { tags: ['<b>bold</b>', 'normal'] };
            const result = sanitizeObject(input);
            expect(result.tags).toEqual(['&lt;b&gt;bold&lt;/b&gt;', 'normal']);
        });

        it('preserves non-string values', () => {
            const input = { count: 42, active: true, name: '<script>' };
            const result = sanitizeObject(input);
            expect(result.count).toBe(42);
            expect(result.active).toBe(true);
            expect(result.name).toBe('&lt;script&gt;');
        });

        it('handles null and undefined', () => {
            expect(sanitizeObject(null as unknown as object)).toBe(null);
            expect(sanitizeObject(undefined as unknown as object)).toBe(undefined);
        });
    });

    describe('stripHtml', () => {
        it('removes all HTML tags', () => {
            expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World');
        });

        it('handles self-closing tags', () => {
            expect(stripHtml('Line 1<br/>Line 2')).toBe('Line 1Line 2');
        });

        it('handles complex XSS payloads', () => {
            expect(stripHtml('<script>alert("XSS")</script>')).toBe('alert("XSS")');
        });
    });

    describe('sanitizeUrl', () => {
        it('allows http URLs', () => {
            expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
        });

        it('blocks javascript: protocol', () => {
            expect(sanitizeUrl('javascript:alert(1)')).toBe('');
            expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('');
        });

        it('blocks data: protocol', () => {
            expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
        });

        it('blocks vbscript: protocol', () => {
            expect(sanitizeUrl('vbscript:msgbox("XSS")')).toBe('');
        });

        it('handles whitespace', () => {
            expect(sanitizeUrl('  javascript:alert(1)  ')).toBe('');
        });
    });
});
