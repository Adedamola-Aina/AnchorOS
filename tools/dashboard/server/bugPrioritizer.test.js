// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bugPrioritizer = require('./bugPrioritizer');

describe('bugPrioritizer', () => {
    it('calculates critical production regression with user-facing boost', () => {
        const result = bugPrioritizer.calculatePriorityScore({
            text: 'Critical security regression affecting production users'
        });

        expect(result.environment).toBe('production');
        expect(result.keywordAnalysis.category).toBe('critical');
        expect(result.keywordAnalysis.keywords).toContain('security');
        expect(result.keywordAnalysis.keywords).toContain('critical');
        expect(result.score).toBe(36);
    });

    it('detects staging, dev and local environment hints', () => {
        expect(bugPrioritizer.calculatePriorityScore({ text: 'major issue on staging' }).environment).toBe('staging');
        expect(bugPrioritizer.calculatePriorityScore({ text: 'bug in development environment' }).environment).toBe('dev');
        expect(bugPrioritizer.calculatePriorityScore({ text: 'minor typo only on local setup' }).environment).toBe('local');
    });

    it('defaults to production when environment is unspecified', () => {
        const result = bugPrioritizer.calculatePriorityScore({ text: 'unexpected bug in reports' });
        expect(result.environment).toBe('production');
        expect(result.envWeight).toBe(2);
    });

    it('maps score buckets to suggested priorities and confidence levels', () => {
        const cases = [
            { text: 'critical crash in production', priority: 'P0', confidence: 'high' },
            { text: 'major production issue', priority: 'P0', confidence: 'medium' },
            { text: 'urgent blocker in development', priority: 'P1', confidence: 'high' },
            { text: 'bug in staging', priority: 'P1', confidence: 'medium' },
            { text: 'bug in development', priority: 'P2', confidence: 'medium' },
            { text: 'minor typo on local machine', priority: 'P3', confidence: 'low' }
        ];

        for (const item of cases) {
            const suggestion = bugPrioritizer.suggestPriority({ id: 'BUG-X', text: item.text });
            expect(suggestion.suggestedPriority).toBe(item.priority);
            expect(suggestion.confidence).toBe(item.confidence);
        }
    });

    it('extracts current priority token from bug text', () => {
        const suggestion = bugPrioritizer.suggestPriority({
            id: 'BUG-123',
            text: '[P2] bug in development checkout flow'
        });

        expect(suggestion.currentPriority).toBe('P2');
        expect(suggestion.bugId).toBe('BUG-123');
    });

    it('returns sorted suggestions and guards invalid input', () => {
        expect(bugPrioritizer.getPrioritySuggestionsForBugs(null)).toEqual([]);

        const suggestions = bugPrioritizer.getPrioritySuggestionsForBugs([
            { id: 'BUG-1', text: 'minor typo on local setup' },
            { id: 'BUG-2', text: 'critical crash in production' },
            { id: 'BUG-3', text: 'bug in development' }
        ]);

        expect(suggestions.map((s) => s.bugId)).toEqual(['BUG-2', 'BUG-3', 'BUG-1']);
        expect(suggestions[0].score).toBeGreaterThanOrEqual(suggestions[1].score);
        expect(suggestions[1].score).toBeGreaterThanOrEqual(suggestions[2].score);
    });

    it('analyzes known issues data across all sections and filters bad rows', () => {
        const data = {
            critical: [
                { id: 'BUG-100', text: 'critical production crash' },
                { id: 'BUG-101' }
            ],
            high: [{ id: 'BUG-102', text: 'major regression in staging' }],
            medium: [{ id: 'BUG-103', text: 'bug in development account settings' }],
            low: [{ id: 'BUG-104', text: 'minor typo on local screen' }],
            recentlyFixed: [
                { id: 'BUG-105', text: 'security issue resolved in production' },
                null
            ]
        };

        const suggestions = bugPrioritizer.analyzeBugsFromKnownIssues(data);

        expect(suggestions.length).toBe(5);
        expect(suggestions.some((s) => s.bugId === 'BUG-105')).toBe(true);
        expect(suggestions.some((s) => s.bugText.includes('critical production crash'))).toBe(true);
    });

    it('computes suggestion statistics and review drift', () => {
        const suggestions = [
            { suggestedPriority: 'P0', confidence: 'high', currentPriority: 'P1' },
            { suggestedPriority: 'P1', confidence: 'medium', currentPriority: 'P1' },
            { suggestedPriority: 'P2', confidence: 'medium', currentPriority: null },
            { suggestedPriority: 'P3', confidence: 'low', currentPriority: 'P2' }
        ];

        const stats = bugPrioritizer.getPrioritySuggestionStats(suggestions);

        expect(stats.total).toBe(4);
        expect(stats.byPriority).toEqual({ P0: 1, P1: 1, P2: 1, P3: 1 });
        expect(stats.byConfidence).toEqual({ high: 1, medium: 2, low: 1 });
        expect(stats.needsReview).toBe(2);
    });
});