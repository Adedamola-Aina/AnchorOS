// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const workIntelligence = require('./workIntelligence');

describe('workIntelligence', () => {
    it('infers finance and security domains from file paths', () => {
        const domains = workIntelligence.inferDomainsFromFiles([
            'src/features/finance/FinanceView.tsx',
            'config/firestore.rules'
        ]);

        expect(domains).toContain('finance');
        expect(domains).toContain('security');
    });

    it('classifies BUG items as bugfix with high confidence', () => {
        const result = workIntelligence.classifyWorkItem({
            id: 'BUG-204',
            type: 'bug',
            message: 'fix(finance): BUG-204 correct transfer rounding',
            files: ['src/features/finance/utils/rounding.ts'],
            category: 'anchorOS'
        });

        expect(result.workKind).toBe('bugfix');
        expect(result.domains).toContain('finance');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('maps lifecycle from deploy status', () => {
        expect(workIntelligence.deriveLifecycle('dev')).toBe('todo');
        expect(workIntelligence.deriveLifecycle('staging')).toBe('inProgress');
        expect(workIntelligence.deriveLifecycle('deployed')).toBe('done');
    });
});
