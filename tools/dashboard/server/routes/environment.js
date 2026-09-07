// @ts-nocheck
/**
 * environment.js — environment state and parity endpoints.
 * Read-only: versions/SHAs and git-ancestry-based parity/drift.
 */
const express = require('express');
const {
    checkEnvParity,
    checkEnvParityByGit,
    getEnvironmentStatus,
    getEnvironmentVersions,
    getCurrentVersion
} = require('../envChecker');

const router = express.Router();

router.get('/api/environment', async (_req, res) => {
    try {
        const [status, versions, currentVersion] = await Promise.all([
            getEnvironmentStatus(),
            getEnvironmentVersions(),
            Promise.resolve(getCurrentVersion())
        ]);
        res.json({ currentVersion, versions, status, generatedAt: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/parity', async (_req, res) => {
    try {
        res.json(await checkEnvParity());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/parity-git', async (_req, res) => {
    try {
        res.json(await checkEnvParityByGit());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
