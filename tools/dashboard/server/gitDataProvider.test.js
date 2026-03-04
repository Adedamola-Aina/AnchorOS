// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const gitDataProvider = require('./gitDataProvider');

describe('gitDataProvider initiative type grouping', () => {
    it('treats FIN items as initiative work', () => {
        expect(gitDataProvider.isInitiativeType('fin')).toBe(true);
        expect(gitDataProvider.isInitiativeType('bug')).toBe(false);
    });

    it('partitions FIN items in backlog status buckets', () => {
        const data = gitDataProvider.partitionFeatureBacklog([
            { id: 'FIN-005', type: 'fin', status: 'dev' },
            { id: 'FIN-006', type: 'fin', status: 'staging' },
            { id: 'FIN-007', type: 'fin', status: 'deployed' },
            { id: 'BUG-001', type: 'bug', status: 'dev' }
        ]);

        expect(data.completed.map(item => item.id)).toEqual(['FIN-007']);
        expect(data.inProgress.map(item => item.id)).toEqual(['FIN-006']);
        expect(data.pending.map(item => item.id)).toEqual(['FIN-005']);
        expect(data.summary).toEqual({
            total: 3,
            completed: 1,
            inProgress: 1,
            pending: 1
        });
    });
});
