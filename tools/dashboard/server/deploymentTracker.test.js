// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const deploymentTracker = require('./deploymentTracker');

describe('deploymentTracker', () => {
    it('parses deployments and always maps development to HEAD', async () => {
        const deployments = await deploymentTracker.parseDeployMarkers();

        expect(deployments).toHaveProperty('production');
        expect(deployments).toHaveProperty('staging');
        expect(deployments).toHaveProperty('development');
        expect(deployments.development.source).toBe('head');
        expect(deployments.development.fullDeployedHash).toMatch(/^[a-f0-9]{40}$/);
    });

    it('returns summary format for all environments', async () => {
        const summary = await deploymentTracker.getDeploymentSummary();

        expect(summary.production).toHaveProperty('version');
        expect(summary.production).toHaveProperty('source');
        expect(summary.staging).toHaveProperty('version');
        expect(summary.development).toHaveProperty('hash');
    });

    it('handles invalid hashes in ancestry checks', async () => {
        const result = await deploymentTracker.isAncestorOf('not-a-hash', 'also-not-a-hash');
        expect(result).toBe(false);
    });

    it('returns false when environment deployment hash is missing', async () => {
        const result = await deploymentTracker.isCommitInEnvironment('abc1234', { fullDeployedHash: null });
        expect(result).toBe(false);
    });

    it('checks commit deployment status map for a batch', async () => {
        const deployments = await deploymentTracker.parseDeployMarkers();
        const headHash = deployments.development.fullDeployedHash;
        const fakeHash = '0000000000000000000000000000000000000000';

        const status = await deploymentTracker.getCommitDeploymentStatus(headHash, deployments);
        expect(status).toEqual({
            production: expect.any(Boolean),
            staging: expect.any(Boolean),
            development: true
        });

        const batch = await deploymentTracker.batchCheckDeploymentStatus([headHash, fakeHash], deployments);
        expect(batch.size).toBe(2);
        expect(batch.get(headHash).development).toBe(true);
        expect(batch.get(fakeHash)).toEqual({
            production: false,
            staging: false,
            development: false
        });
    });

    it('clears internal cache without throwing', () => {
        expect(() => deploymentTracker.clearCache()).not.toThrow();
    });
});