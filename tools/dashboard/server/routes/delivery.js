// @ts-nocheck
/**
 * delivery.js — Git commit history and deployment-relevant delivery endpoints.
 * Read-only: derived from git history and deploy markers.
 */
const express = require('express');
const {
    getRecentCommits,
    getRecentCommitsFiltered,
    getDeploymentTimeline,
    getRepoStats,
    searchBugInCommits,
    getPendingChangesByGit,
    getCurrentBranch
} = require('../gitAnalyzer');
const { getDeploymentSummary } = require('../deploymentTracker');

const router = express.Router();

router.get('/api/git/commits', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 30;
        res.json(await getRecentCommits(limit));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/commits/anchorOS', async (_req, res) => {
    try {
        res.json(await getRecentCommitsFiltered('anchorOS', 30));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/commits/infra', async (_req, res) => {
    try {
        res.json(await getRecentCommitsFiltered('infra', 30));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/timeline', async (req, res) => {
    try {
        const days = parseInt(req.query.days, 10) || 14;
        res.json(await getDeploymentTimeline(days));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/stats', async (_req, res) => {
    try {
        res.json(await getRepoStats());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/search/:bugId', async (req, res) => {
    try {
        res.json(await searchBugInCommits(req.params.bugId));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/delivery', async (_req, res) => {
    try {
        const [branch, pending, deployments] = await Promise.all([
            getCurrentBranch(),
            getPendingChangesByGit(),
            getDeploymentSummary()
        ]);
        res.json({ branch, pending, deployments, generatedAt: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
