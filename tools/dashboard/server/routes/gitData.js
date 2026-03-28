// @ts-nocheck
'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { getRecentCommits } = require('../gitAnalyzer');
const gitData = require('../gitDataProvider');

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

        // Get all git commits for pattern matching
        const commits = await getRecentCommits(500);
        const commitMessages = commits.map(c => c.message.toLowerCase());

        // Auto-detect status based on git history
        // IMPORTANT: Only detect completion if the EXACT ID appears in a commit message
        // Generic keyword matching caused massive false positives (e.g., "mobile" matching all mobile commits)
        // Also skip revert/remove commits — those indicate feature was rolled back, not completed
        const enrichedInitiatives = roadmapData.initiatives.map(item => {
            // If already marked completed or deferred, keep it (don't auto-detect)
            if (item.status === 'completed' || item.status === 'deferred') {
                return { ...item, detectedFromGit: false };
            }

            // Only check for the exact ID (first pattern is always the ID)
            // This prevents false positives from generic keywords like "mobile", "error", "transfer"
            const itemId = item.id.toLowerCase();
            const matchedCommits = [];

            for (let i = 0; i < commits.length; i++) {
                const msg = commitMessages[i];
                // Skip revert/remove commits — they indicate rollback, not completion
                if (msg.includes('revert') || msg.includes('remove')) {
                    continue;
                }
                // Require the exact ID to appear in the commit message
                // e.g., "fix: BUG-043 resolve autofill issue" must contain "bug-043"
                if (msg.includes(itemId)) {
                    matchedCommits.push({
                        hash: commits[i].hash,
                        message: commits[i].message,
                        date: commits[i].date
                    });
                    break; // One match is enough
                }
            }

            // If we found a commit with the exact ID, mark as completed
            if (matchedCommits.length > 0) {
                return {
                    ...item,
                    status: 'completed',
                    detectedFromGit: true,
                    matchedCommits: matchedCommits
                };
            }

            return { ...item, detectedFromGit: false };
        });

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
