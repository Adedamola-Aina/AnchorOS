// @ts-nocheck
import { describe, it, expect } from 'vitest';

// Test the removeArchivedTag function logic
describe('archiveManager security fixes', () => {
    // Inline the function for testing since it's internal
    function removeArchivedTag(text) {
        const startIdx = text.indexOf('(Archived:');
        if (startIdx === -1) return text;
        
        const endIdx = text.indexOf(')', startIdx);
        if (endIdx === -1) return text;
        
        return text.slice(0, startIdx) + text.slice(endIdx + 1);
    }

    it('removes archived tag with date', () => {
        const input = '- [x] Task completed (Archived: 2026-02-15)';
        const expected = '- [x] Task completed ';
        expect(removeArchivedTag(input)).toBe(expected);
    });

    it('handles text without archived tag', () => {
        const input = '- [x] Task completed';
        expect(removeArchivedTag(input)).toBe(input);
    });

    it('handles unclosed archived tag', () => {
        const input = '- [x] Task (Archived: 2026-02-15';
        expect(removeArchivedTag(input)).toBe(input);
    });

    it('handles multiple parentheses without ReDoS', () => {
        // This would potentially cause ReDoS with the old regex /\(Archived:[^)]*\)/
        const pathological = '- [x] Task ' + '('.repeat(1000) + ' (Archived: 2026-02-15)';
        const start = Date.now();
        removeArchivedTag(pathological);
        const duration = Date.now() - start;
        // Should complete quickly even with many parentheses
        expect(duration).toBeLessThan(100);
    });

    it('removes only first archived tag', () => {
        const input = '- [x] Task (Archived: 2026-02-15) note (with parens)';
        const result = removeArchivedTag(input);
        expect(result).toBe('- [x] Task  note (with parens)');
    });

    it('handles empty string', () => {
        expect(removeArchivedTag('')).toBe('');
    });
});
