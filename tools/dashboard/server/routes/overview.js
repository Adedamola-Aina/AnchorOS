// @ts-nocheck
/**
 * overview.js — high-signal console summary.
 * Combines current git state, environment versions/SHAs, parity and quality
 * signals. Unknown/unavailable information is passed through as-is; no health
 * is invented here.
 */
const express = require('express');
const { getCurrentBranch, getRecentCommits } = require('../gitAnalyzer');
const {
    getEnvironmentVersions,
    checkEnvParity,
    getCurrentVersion
} = require('../envChecker');
const { getDependencyHealth } = require('../dependencyChecker');
const { scanSecureDbCompliance } = require('../secureDbScanner');
const { getE2EResults } = require('../e2eResultsReader');

const router = express.Router();

function trySnapshot(promise) {
    return Promise.resolve(promise)
        .then((data) => ({ available: true, data }))
        .catch((error) => ({ available: false, error: error.message }));
}

router.get('/api/overview', async (_req, res) => {
    try {
        const [branch, currentVersion, versions, parity, dependencies, secureDb, e2e, recentCommits] = await Promise.all([
            trySnapshot(getCurrentBranch()),
            trySnapshot(Promise.resolve(getCurrentVersion())),
            trySnapshot(getEnvironmentVersions()),
            trySnapshot(checkEnvParity()),
            trySnapshot(getDependencyHealth()),
            trySnapshot(scanSecureDbCompliance()),
            trySnapshot(getE2EResults()),
            trySnapshot(getRecentCommits(5))
        ]);

        res.json({
            git: { branch, currentVersion, recentCommits },
            environments: { versions, parity },
            quality: { dependencies, secureDb, e2e },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
