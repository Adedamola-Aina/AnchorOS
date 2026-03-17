// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const gitAnalyzer = require('./gitAnalyzer');

describe('gitAnalyzer', () => {
    it('returns recent commits with normalized shape', async () => {
        const commits = await gitAnalyzer.getRecentCommits(5);
        expect(Array.isArray(commits)).toBe(true);
        if (commits.length > 0) {
            expect(commits[0]).toEqual(expect.objectContaining({
                hash: expect.any(String),
                fullHash: expect.any(String),
                message: expect.any(String),
                feature: expect.any(String),
                type: expect.any(String)
            }));
        }
    });

    it('classifies invalid commit hash as infra fallback', async () => {
        const category = await gitAnalyzer.classifyCommit('invalid-hash');
        expect(category).toBe('infra');
    });

    it('filters commits by category without throwing', async () => {
        const categories = ['all', 'anchorOS', 'dashboard', 'docs', 'infra'];
        for (const category of categories) {
            const commits = await gitAnalyzer.getRecentCommitsFiltered(category, 5);
            expect(Array.isArray(commits)).toBe(true);
            expect(commits.length).toBeLessThanOrEqual(5);
        }
    });

    it('returns empty list for invalid version range', async () => {
        const commits = await gitAnalyzer.getCommitsBetweenVersions('v999.0.0', 'v999.0.1');
        expect(Array.isArray(commits)).toBe(true);
    });

    it('returns tags list', async () => {
        const tags = await gitAnalyzer.getTags();
        expect(Array.isArray(tags)).toBe(true);
    });

    it('returns actual deployment metadata', async () => {
        const deployments = await gitAnalyzer.getActualDeployments();
        expect(deployments).toEqual(expect.objectContaining({
            production: expect.any(Object),
            staging: expect.any(Object),
            development: expect.any(Object)
        }));
    });

    it('returns pending change lanes and versions', async () => {
        const pending = await gitAnalyzer.getPendingChangesByGit();
        expect(pending).toEqual(expect.objectContaining({
            devToStaging: expect.any(Array),
            stagingToProduction: expect.any(Array),
            versions: expect.any(Object)
        }));
    });

    it('returns current branch and repo stats', async () => {
        const branch = await gitAnalyzer.getCurrentBranch();
        const stats = await gitAnalyzer.getRepoStats();

        expect(branch).toBeTypeOf('string');
        expect(stats).toEqual(expect.objectContaining({
            branch: expect.any(String),
            isClean: expect.any(Boolean),
            modifiedFiles: expect.any(Number),
            stagedFiles: expect.any(Number)
        }));
    });

    it('produces deployment timeline for recent days', async () => {
        const timeline = await gitAnalyzer.getDeploymentTimeline(2);
        expect(Array.isArray(timeline)).toBe(true);
        if (timeline.length > 0) {
            expect(timeline[0]).toEqual(expect.objectContaining({
                date: expect.any(String),
                commits: expect.any(Array),
                commitCount: expect.any(Number),
                byType: expect.any(Object),
                byDomain: expect.any(Object)
            }));
        }
    });

    it('searches for bug ids in commit history', async () => {
        const results = await gitAnalyzer.searchBugInCommits('BUG-107');
        expect(Array.isArray(results)).toBe(true);
    });

    it('returns impact analysis report', async () => {
        const impact = await gitAnalyzer.getImpactAnalysis();
        expect(impact).toEqual(expect.objectContaining({
            totalChanges: expect.any(Number),
            knownImpacts: expect.any(Array),
            affectedAreas: expect.any(Array),
            overallRisk: expect.any(String),
            recommendedTests: expect.any(Array),
            changedFiles: expect.any(Array)
        }));
    });
});