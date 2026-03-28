// @ts-nocheck
'use strict';

const router = require('express').Router();
const { getRecentCommits, getRecentCommitsFiltered, getDeploymentTimeline, getRepoStats, searchBugInCommits } = require('../gitAnalyzer');

router.get('/api/git/commits', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommits(limit);
        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/commits/anchorOS', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('anchorOS', limit);
        res.json({
            category: 'anchorOS',
            description: 'Anchor OS product changes (src/, functions/, public/, native mobile, deploy/rules)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/commits/infra', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('infra', limit);
        res.json({
            category: 'infra',
            description: 'Infrastructure & config changes (config/, docs/, scripts/, root files)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/commits/dashboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('dashboard', limit);
        res.json({
            category: 'dashboard',
            description: 'Internal Dashboard & tooling changes (tools/dashboard/, tools/mcp-server/)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/commits/docs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('docs', limit);
        res.json({
            category: 'docs',
            description: 'Documentation & process governance (docs/, .github/, CLAUDE.md, CONTRIBUTING.md)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/timeline', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 14;
        const timeline = await getDeploymentTimeline(days);
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/stats', async (req, res) => {
    try {
        const stats = await getRepoStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/search/:bugId', async (req, res) => {
    try {
        const commits = await searchBugInCommits(req.params.bugId);
        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
