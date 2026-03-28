// @ts-nocheck
'use strict';

const router = require('express').Router();
const { getAllDocs } = require('../docReader/index');
const { getImpactAnalysis } = require('../gitAnalyzer');
const { getPrioritySuggestions } = require('../prioritySuggester');
const { getDependencyHealth } = require('../dependencyChecker');
const { getProgressReport } = require('../progressTracker');
const { runFullSync, getSyncStatus } = require('../docUpdater');
const { publishEvent } = require('../eventIngestion');
const gitData = require('../gitDataProvider');

router.get('/api/bugs', async (req, res) => {
    try {
        const bugs = await gitData.getBugs();
        res.json({
            source: 'git-automated',
            count: bugs.length,
            bugs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/features', async (req, res) => {
    try {
        const features = await gitData.getFeatures();
        res.json({
            source: 'git-automated',
            count: features.length,
            features
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/docs', async (req, res) => {
    try {
        const docs = await getAllDocs();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/roadmap', async (req, res) => {
    try {
        res.redirect('/api/git/roadmap');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/bugs/priority-suggestions', async (req, res) => {
    try {
        const bugs = await gitData.getBugs();
        // Map git bugs to priority suggestion format
        const suggestions = bugs.map(bug => ({
            id: bug.id,
            title: bug.title,
            currentStatus: bug.status,
            suggestedPriority: bug.status === 'dev' ? 'P0' : bug.status === 'staging' ? 'P1' : 'P2',
            reason: bug.status === 'deployed' ? 'Already deployed' : `Pending deploy (${bug.status})`
        }));
        const stats = {
            total: suggestions.length,
            deployed: bugs.filter(b => b.status === 'deployed').length,
            pending: bugs.filter(b => b.status !== 'deployed').length
        };

        res.json({ source: 'git-automated', suggestions, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/impact', async (req, res) => {
    try {
        const analysis = await getImpactAnalysis();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/suggestions', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const suggestions = await getPrioritySuggestions(limit);
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/dependencies', async (req, res) => {
    try {
        const health = await getDependencyHealth();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/progress', async (req, res) => {
    try {
        const progress = await getProgressReport();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/docs/sync', async (req, res) => {
    try {
        publishEvent({
            source: 'api',
            type: 'docs:sync:start',
            level: 'info',
            message: 'Manual docs sync requested'
        });
        const results = await runFullSync();
        publishEvent({
            source: 'api',
            type: 'docs:sync:complete',
            level: 'info',
            status: 'completed',
            message: 'Manual docs sync completed'
        });
        res.json(results);
    } catch (error) {
        publishEvent({
            source: 'api',
            type: 'docs:sync:failed',
            level: 'warning',
            status: 'failed',
            message: 'Manual docs sync failed',
            payload: { error: error.message }
        });
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/docs/sync/status', (req, res) => {
    try {
        const status = getSyncStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
