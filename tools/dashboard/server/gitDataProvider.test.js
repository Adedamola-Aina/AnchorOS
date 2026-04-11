// @ts-nocheck
// 
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const gitDataProvider = require('./gitDataProvider');
const {
    enrichRoadmapInitiativesWithTrackedStatus,
    roadmapBacklogItems,
    inferRoadmapIdsFromCommitEvidence
} = require('./gitDataProvider/roadmap');

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

    it('detects commit types across known prefixes and fallbacks', () => {
        expect(gitDataProvider.detectType('fix(bug): BUG-001 patch')).toBe('bug');
        expect(gitDataProvider.detectType('REG-003 causes issue')).toBe('regression');
        expect(gitDataProvider.detectType('GAP-006 increase coverage')).toBe('gap');
        expect(gitDataProvider.detectType('UX-012 update spacing')).toBe('enhancement');
        expect(gitDataProvider.detectType('TASK-100 work item')).toBe('task');
        expect(gitDataProvider.detectType('ARCH-001 split file')).toBe('architecture');
        expect(gitDataProvider.detectType('feat(finance): FEAT-008 add feature')).toBe('feature');
        expect(gitDataProvider.detectType('fix(auth): patch')).toBe('fix');
        expect(gitDataProvider.detectType('docs(readme): update')).toBe('docs');
        expect(gitDataProvider.detectType('chore: bump deps')).toBe('chore');
        expect(gitDataProvider.detectType('random message')).toBe('other');
    });

    it('extracts multiple IDs from a commit message body', () => {
        const ids = gitDataProvider.extractIds([
            'fix(finance): BUG-111 and REG-004',
            'Implements FEAT-010',
            'Follow-up FIN-005 + SEC-001 and UX-003',
            'Also touches QA-002 and DATA-007',
            'Plus COMM-005 FAB-003 FAM-003 PSE-001 PERF-005 OBS-002 DX-003'
        ].join('\n'));

        expect(ids.map((item) => item.id)).toEqual(expect.arrayContaining([
            'BUG-111',
            'REGRESSION-004',
            'FEATURE-010',
            'FIN-005',
            'SEC-001',
            'UX-003',
            'QA-002',
            'DATA-007',
            'COMM-005',
            'FAB-003',
            'FAM-003',
            'PSE-001',
            'PERF-005',
            'OBS-002',
            'DX-003'
        ]));
    });

    it('identifies dashboard/tooling commits', () => {
        expect(gitDataProvider.isDashboardCommit('feat: dashboard endpoint')).toBe(true);
        expect(gitDataProvider.isDashboardCommit('docs: update known_issues')).toBe(true);
        expect(gitDataProvider.isDashboardCommit('refactor: tools/dashboard/server cleanup')).toBe(true);
        expect(gitDataProvider.isDashboardCommit('feat(finance): FEAT-020 add transfer wizard')).toBe(false);
    });

    it('allocates next id sequentially for known prefixes', async () => {
        const nextBugId = await gitDataProvider.getNextId('BUG');
        const nextFinId = await gitDataProvider.getNextId('FIN');

        expect(nextBugId).toMatch(/^BUG-\d{3}$/);
        expect(nextFinId).toMatch(/^FIN-\d{3}$/);
    });

    it('returns all used ids as numeric sets', async () => {
        const usedIds = await gitDataProvider.getAllUsedIds();

        expect(usedIds).toBeTypeOf('object');
        expect(Object.keys(usedIds).length).toBeGreaterThan(0);
        expect(Object.values(usedIds).every((entry) => entry instanceof Set)).toBe(true);
    });
});

describe('roadmap status enrichment consistency', () => {
    it('infers roadmap IDs from commit evidence when explicit IDs are missing', () => {
        const inferred = inferRoadmapIdsFromCommitEvidence({
            message: 'refactor(finance): replace limit-only query with cursor startAfter pagination',
            files: ['src/api/financePagination.ts', 'src/hooks/queries/useFinanceQueries.ts']
        });

        const ids = inferred.map(item => item.id);
        expect(ids).toContain('FIN-016');
    });

    it('maps tracked deployment status to effective roadmap status', () => {
        const roadmapData = {
            initiatives: [
                { id: 'BUG-105', title: 'Stack overflow', status: 'planned', priority: 'P1', team: 'Engineering' },
                { id: 'FIN-016', title: 'Pagination', status: 'planned', priority: 'P1', team: 'Engineering' },
                { id: 'SEC-010', title: 'Policy reacceptance', status: 'deferred', priority: 'P2', team: 'Security' }
            ]
        };
        const tracked = [
            { id: 'BUG-105', status: 'deployed', relatedCommits: ['abc1234'] },
            { id: 'FIN-016', status: 'staging', relatedCommits: ['def5678'] },
            { id: 'SEC-010', status: 'deployed', relatedCommits: ['zzz9999'] }
        ];

        const enriched = enrichRoadmapInitiativesWithTrackedStatus(roadmapData, tracked);
        const byId = Object.fromEntries(enriched.map(item => [item.id, item]));

        expect(byId['BUG-105'].status).toBe('completed');
        expect(byId['BUG-105'].detectedFromGit).toBe(true);
        expect(byId['FIN-016'].status).toBe('in-progress');
        expect(byId['SEC-010'].status).toBe('deferred');
    });

    it('excludes non-planned enriched items from kanban backlog', () => {
        const roadmapData = {
            initiatives: [
                { id: 'BUG-105', title: 'Stack overflow', status: 'planned', priority: 'P1', team: 'Engineering' },
                { id: 'FIN-016', title: 'Pagination', status: 'planned', priority: 'P1', team: 'Engineering' },
                { id: 'PLT-007', title: 'Offline queue', status: 'planned', priority: 'P1', team: 'Engineering' }
            ]
        };
        const tracked = [
            { id: 'BUG-105', status: 'deployed' },
            { id: 'FIN-016', status: 'staging' }
        ];

        const enriched = {
            ...roadmapData,
            initiatives: enrichRoadmapInitiativesWithTrackedStatus(roadmapData, tracked)
        };

        const backlog = roadmapBacklogItems(enriched, tracked, new Set());
        expect(backlog.map(item => item.id)).toEqual(['PLT-007']);
    });
});
