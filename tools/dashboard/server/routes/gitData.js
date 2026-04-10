// @ts-nocheck
'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const gitData = require('../gitDataProvider');
const { enrichRoadmapInitiativesWithTrackedStatus } = require('../gitDataProvider/roadmap');

router.get('/api/git/bugs', async (req, res) => {
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

router.get('/api/git/features', async (req, res) => {
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

router.get('/api/git/kanban', async (req, res) => {
    try {
        const data = await gitData.getKanbanData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/command-center', async (req, res) => {
    try {
        const data = await gitData.getCommandCenterData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/backlog', async (req, res) => {
    try {
        const data = await gitData.getFeatureBacklog();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/changelog', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const data = await gitData.getChangelog(limit);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/all-items', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 200;
        const items = await gitData.getAllTrackedItems(limit);
        res.json({
            source: 'git-automated',
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/git/roadmap', async (req, res) => {
    try {
        const roadmapPath = path.join(__dirname, '../roadmap.json');
        const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
        const trackedItems = await gitData.getAllTrackedItems(500);
        const enrichedInitiatives = enrichRoadmapInitiativesWithTrackedStatus(roadmapData, trackedItems);

        // Calculate summary stats
        const completed = enrichedInitiatives.filter(i => i.status === 'completed');
        const inProgress = enrichedInitiatives.filter(i => i.status === 'in-progress');
        const planned = enrichedInitiatives.filter(i => i.status === 'planned');

        // Group by priority
        const byPriority = {
            P0: enrichedInitiatives.filter(i => i.priority === 'P0'),
            P1: enrichedInitiatives.filter(i => i.priority === 'P1'),
            P2: enrichedInitiatives.filter(i => i.priority === 'P2'),
            P3: enrichedInitiatives.filter(i => i.priority === 'P3')
        };

        // Group by team
        const teams = [...new Set(enrichedInitiatives.map(i => i.team))];
        const byTeam = {};
        teams.forEach(team => {
            byTeam[team] = enrichedInitiatives.filter(i => i.team === team);
        });

        res.json({
            source: 'roadmap.json + git-automated',
            lastUpdated: roadmapData.lastUpdated,
            version: roadmapData.version,
            summary: {
                total: enrichedInitiatives.length,
                completed: completed.length,
                inProgress: inProgress.length,
                planned: planned.length,
                autoDetected: enrichedInitiatives.filter(i => i.detectedFromGit).length
            },
            byPriority,
            byTeam,
            teams: teams.sort(),
            initiatives: enrichedInitiatives
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
