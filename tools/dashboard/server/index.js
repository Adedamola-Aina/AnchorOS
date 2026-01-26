/**
 * index.js
 * 
 * Express server for the Internal PM Dashboard.
 * Provides API endpoints for documentation, git analysis, and environment status.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { readDoc, getAllDocs, getProjectBoard, getFeatureSuggestions } = require('./docReader');
const { getRecentCommits, getDeploymentTimeline, getRepoStats, searchBugInCommits, getImpactAnalysis } = require('./gitAnalyzer');
const { getEnvironmentStatus, checkEnvParity } = require('./envChecker');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client build (production)
app.use(express.static(path.join(__dirname, '../client/dist')));

// ============ API ROUTES ============

/**
 * GET /api/status
 * Returns parsed PROJECT_STATUS.md data
 */
app.get('/api/status', async (req, res) => {
    try {
        const data = await readDoc('PROJECT_STATUS.md');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/bugs
 * Returns parsed KNOWN_ISSUES.md data
 */
app.get('/api/bugs', async (req, res) => {
    try {
        const data = await readDoc('KNOWN_ISSUES.md');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/roadmap
 * Returns parsed ROADMAP.md data
 */
app.get('/api/roadmap', async (req, res) => {
    try {
        const data = await readDoc('ROADMAP.md');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/docs
 * Returns all documentation files with freshness status
 */
app.get('/api/docs', async (req, res) => {
    try {
        const docs = await getAllDocs();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/board
 * Returns Kanban board generated from ROADMAP.md (Single Source of Truth)
 */
app.get('/api/board', async (req, res) => {
    try {
        // Use ROADMAP.md as single source of truth for kanban
        const roadmap = await readDoc('ROADMAP.md');
        const kanban = roadmap.parsed?.kanban || {
            backlog: [],
            todo: [],
            inProgress: [],
            done: []
        };

        res.json({
            filename: 'ROADMAP.md',
            source: 'Single Source of Truth',
            lastModified: roadmap.lastModified,
            parsed: kanban,
            currentFocus: roadmap.parsed?.currentFocus,
            focusStatus: roadmap.parsed?.focusStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/features
 * Returns parsed FEATURE_SUGGESTIONS.md (Feature Backlog)
 */
app.get('/api/features', async (req, res) => {
    try {
        const features = await getFeatureSuggestions();
        res.json(features);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/parity
 * Returns feature parity across environments
 */
app.get('/api/parity', async (req, res) => {
    try {
        const parity = await checkEnvParity();
        res.json(parity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/environment
 * Returns full environment status (versions, health, parity)
 */
app.get('/api/environment', async (req, res) => {
    try {
        const status = await getEnvironmentStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/commits
 * Returns recent git commits
 */
app.get('/api/git/commits', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommits(limit);
        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/timeline
 * Returns deployment timeline
 */
app.get('/api/git/timeline', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 14;
        const timeline = await getDeploymentTimeline(days);
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/stats
 * Returns repo stats (branch, status, last commit)
 */
app.get('/api/git/stats', async (req, res) => {
    try {
        const stats = await getRepoStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/search/:bugId
 * Search for bug ID in commit history
 */
app.get('/api/git/search/:bugId', async (req, res) => {
    try {
        const commits = await searchBugInCommits(req.params.bugId);
        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/impact
 * Returns impact analysis for recent changes
 */
app.get('/api/impact', async (req, res) => {
    try {
        const analysis = await getImpactAnalysis();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/summary
 * Returns combined dashboard summary
 */
app.get('/api/summary', async (req, res) => {
    try {
        const [roadmap, bugs, board, parity, repoStats] = await Promise.all([
            readDoc('ROADMAP.md'),
            readDoc('KNOWN_ISSUES.md'),
            getProjectBoard(),
            checkEnvParity(),
            getRepoStats()
        ]);

        // Build projectStatus from ROADMAP.md instead of non-existent PROJECT_STATUS.md
        const roadmapData = roadmap.parsed || {};
        const projectStatus = {
            currentFocus: roadmapData.currentFocus || '',
            successCriteria: roadmapData.successCriteria || [],
            inProgress: roadmapData.inProgress || [],
            completed: roadmapData.completed || [],
            criticalBugs: (bugs.parsed?.critical || []).map(bug => ({
                id: bug.id,
                description: bug.title
            }))
        };

        // Calculate success criteria progress
        const totalCriteria = projectStatus.successCriteria.length;
        const completedCriteria = projectStatus.successCriteria.filter(c => c.status === 'done').length;
        const criteriaProgress = totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0;

        res.json({
            projectStatus,
            roadmap: roadmapData,
            criteriaProgress,
            bugs: bugs.parsed,
            kanban: board.parsed,
            parity: parity.summary,
            git: repoStats,
            lastRefresh: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/refresh
 * Trigger manual data refresh (cache invalidation if implemented)
 */
app.post('/api/refresh', (req, res) => {
    // In a full implementation, this would clear caches
    res.json({
        success: true,
        message: 'Data refreshed',
        timestamp: new Date().toISOString()
    });
});

// Catch-all: serve React app for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║     Anchor OS - Internal PM Dashboard          ║
║                                                ║
║     API Server running on port ${PORT}            ║
║     http://localhost:${PORT}                      ║
╚════════════════════════════════════════════════╝
    `);

    // Signal PM2 that we're ready
    if (process.send) {
        process.send('ready');
    }
});

// Handle port in use error
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error('   Run: lsof -ti:3001 | xargs kill -9');
        console.error('   Then restart the dashboard.');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down dashboard...');
    server.close(() => {
        console.log('✅ Dashboard stopped gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    server.close(() => {
        process.exit(0);
    });
});
