// @ts-nocheck
'use strict';

const router = require('express').Router();
const { getCommandCenterData, getProactiveAlerts } = require('../commandCenter');
const { checkEnvParity, checkEnvParityByGit, getEnvironmentStatus } = require('../envChecker');
const { getRepoStats } = require('../gitAnalyzer');
const gitData = require('../gitDataProvider');
const { publishEvent } = require('../eventIngestion');

router.get('/api/status', async (req, res) => {
    try {
        const data = await getCommandCenterData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/command-center', async (req, res) => {
    try {
        const data = await getCommandCenterData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await getProactiveAlerts();
        res.json({
            count: alerts.length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            warning: alerts.filter(a => a.severity === 'warning').length,
            info: alerts.filter(a => a.severity === 'info').length,
            items: alerts,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/summary', async (req, res) => {
    try {
        const [kanban, bugs, features, parity, repoStats] = await Promise.all([
            gitData.getKanbanData(),
            gitData.getBugs(),
            gitData.getFeatures(),
            checkEnvParity(),
            getRepoStats()
        ]);

        res.json({
            source: 'git-automated',
            kanban: kanban.summary,
            bugs: { count: bugs.length, bugs: bugs.slice(0, 10) },
            features: { count: features.length, features: features.slice(0, 10) },
            parity: parity.summary,
            git: repoStats,
            lastRefresh: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/refresh', (req, res) => {
    try {
        const deploymentTracker = require('../deploymentTracker');
        deploymentTracker.clearCache();
        gitData.clearCache();
        publishEvent({
            source: 'api',
            type: 'cache:refresh',
            level: 'info',
            message: 'Manual cache refresh requested'
        });
        res.json({
            success: true,
            message: 'All caches cleared',
            clearedCaches: ['deploymentTracker', 'gitDataProvider'],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/parity', async (req, res) => {
    try {
        const parity = await checkEnvParity();
        res.json(parity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/parity-git', async (req, res) => {
    try {
        const parity = await checkEnvParityByGit();
        res.json(parity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/environment', async (req, res) => {
    try {
        const status = await getEnvironmentStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
