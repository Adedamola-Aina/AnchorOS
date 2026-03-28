// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { evaluateTrustChecks } = require('./trustScorer');

describe('trustScorer', () => {
    it('returns high trust for aligned and healthy metrics', () => {
        const result = evaluateTrustChecks({
            kanban: { total: 10, backlog: 2, todo: 3, inProgress: 1, done: 4 },
            parity: { stagingPending: 1 },
            fileHealth: { exceeding: 0 },
            events: { total: 15, hours: 24 },
            coverage: { available: true, generatedAt: new Date().toISOString() }
        });

        expect(result.status).toBe('high');
        expect(result.score).toBeGreaterThanOrEqual(85);
        expect(result.anomalies.length).toBe(0);
    });

    it('flags low trust when metrics are inconsistent', () => {
        const result = evaluateTrustChecks({
            kanban: { total: 20, backlog: 2, todo: 3, inProgress: 1, done: 4 },
            parity: { stagingPending: 7 },
            fileHealth: { exceeding: 5 },
            events: { total: 0, hours: 24 },
            coverage: { available: false }
        });

        expect(result.status).toBe('low');
        expect(result.score).toBeLessThan(70);
        expect(result.anomalies.length).toBeGreaterThan(0);
    });
});
