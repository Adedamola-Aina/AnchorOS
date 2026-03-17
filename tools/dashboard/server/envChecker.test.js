// @ts-nocheck
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const envChecker = require('./envChecker');

describe('envChecker', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('gets current version from package metadata', () => {
        const version = envChecker.getCurrentVersion();
        expect(version).toMatch(/^v|unknown/);
    });

    it('returns environment versions and deploy detail hash map', async () => {
        const versions = await envChecker.getEnvironmentVersions();

        expect(versions).toEqual(expect.objectContaining({
            production: expect.any(String),
            staging: expect.any(String),
            development: expect.any(String),
            hashes: expect.any(Object),
            details: expect.any(Object)
        }));
    });

    it('finds deploy commits via deployment tracker delegation', async () => {
        const deployments = await envChecker.findDeployCommits();
        expect(deployments).toEqual(expect.objectContaining({
            production: expect.any(Object),
            staging: expect.any(Object),
            development: expect.any(Object)
        }));
    });

    it('computes parity summary from tracked git items', async () => {
        const parity = await envChecker.checkEnvParity();
        expect(parity).toEqual(expect.objectContaining({
            source: 'git-ancestry',
            versions: expect.any(Object),
            features: expect.any(Array),
            summary: expect.any(Object)
        }));
    });

    it('handles fetch failures in environment health checks', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

        const health = await envChecker.checkEnvironmentHealth();
        expect(health.production.healthy).toBe(false);
        expect(health.staging.healthy).toBe(false);
        expect(health.development.healthy).toBe(false);
    });

    it('builds environment status bundle', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));

        const status = await envChecker.getEnvironmentStatus();
        expect(status).toEqual(expect.objectContaining({
            source: 'git-ancestry',
            versions: expect.any(Object),
            parity: expect.any(Array),
            paritySummary: expect.any(Object),
            health: expect.any(Object)
        }));
    });

    it('keeps legacy parity alias behavior', async () => {
        const result = await envChecker.checkEnvParityByGit();
        expect(result).toEqual(expect.objectContaining({
            source: 'git-ancestry',
            summary: expect.any(Object)
        }));
    });
});