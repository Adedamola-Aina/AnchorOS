/**
 * index.js
 *
 * Express server for the Internal PM Dashboard.
 * Provides API endpoints for documentation, git analysis, and environment status.
 */
// @ts-nocheck

require('dotenv').config();
const express = require('express');
const path = require('path');

const { setupMiddleware } = require('./middleware');
const { setupCrons } = require('./cron');

const { startFileWatchers, stopFileWatchers } = require('./fileWatcher');
const { watchMarkerFiles, initializeDashboardDir } = require('./conversationProcessor');
const { publishEvent, startHeartbeat, stopHeartbeat } = require('./eventIngestion');
const { archiveOldItems } = require('./archiveManager');
const { autoDetectCompletions } = require('./velocityTracker');
const { runFullSync } = require('./docUpdater');

const coreRouter = require('./routes/core');
const healthRouter = require('./routes/health');
const gitCommitsRouter = require('./routes/gitCommits');
const gitDataRouter = require('./routes/gitData');
const intakeRouter = require('./routes/intake');
const webhooksRouter = require('./routes/webhooks');
const velocityRouter = require('./routes/velocity');
const archiveRouter = require('./routes/archive');
const intelligenceRouter = require('./routes/intelligence');
const dataRouter = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 3001;

setupMiddleware(app);

app.use('/', coreRouter);
app.use('/', healthRouter);
app.use('/', gitCommitsRouter);
app.use('/', gitDataRouter);
app.use('/', intakeRouter);
app.use('/', webhooksRouter);
app.use('/', velocityRouter);
app.use('/', archiveRouter);
app.use('/', intelligenceRouter);
app.use('/', dataRouter);

/**
 * Catch-all route - serve index.html for client-side routing
 * Must set no-cache to prevent browsers from caching stale builds
 * Handles both direct access (/) and Tailscale proxy (/dashboard/*)
 */
app.get(['/dashboard', '/dashboard/*'], (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
app.get('*', (req, res) => {
    // Skip API routes (they have their own handlers)
    if (req.path.startsWith('/api/')) return;
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

let heartbeatHandle = null;

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  🚀 Anchor OS PM Dashboard                     ║
║                                                                ║
║  📊 Dashboard: http://localhost:${PORT}                        ║
║  🔄 Auto-refresh: Enabled                                      ║
║  📁 Data Source: Git History + roadmap.json (auto-detected)    ║
║                                                                ║
║  ⚡ Features:                                                   ║
║     • Git-Based Tracking (zero manual maintenance)            ║
║     • Deployment Ancestry (git merge-base)                    ║
║     • Velocity Auto-Detect (from git deploys)                 ║
║     • Auto-Archive (daily at 2 AM)                            ║
║     • Environment Parity (3-env tracking)                     ║
╚════════════════════════════════════════════════════════════════╝
    `);

    // Start file watchers for real-time updates
    startFileWatchers();
    heartbeatHandle = startHeartbeat({ intervalMs: 60_000 });
    publishEvent({
        source: 'system',
        type: 'server:started',
        level: 'info',
        message: 'Dashboard server started'
    });

    // Start conversation processor for AI-detected bugs/features
    initializeDashboardDir();
    watchMarkerFiles((type, result) => {
        console.log(`[CONVERSATION AI] Auto-filed ${result.processed} ${type}, skipped ${result.skipped} duplicates`);
        publishEvent({
            source: 'conversation-ai',
            type: `intake:${type}`,
            level: 'info',
            message: `Conversation AI processed ${type}`,
            payload: { processed: result.processed, skipped: result.skipped }
        });
        // Trigger full sync after filing
        runFullSync({ syncVelocity: false }).catch(err => console.error('[CONVERSATION AI] Sync failed:', err.message));
    });
    // Signal PM2 that we're ready
    if (process.send) {
        process.send('ready');
    }

    setupCrons({ archiveOldItems, autoDetectCompletions, publishEvent });
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
process.on('SIGTERM', () => {
    console.log('\n[SHUTDOWN] Received SIGTERM, shutting down gracefully...');
    stopHeartbeat();
    publishEvent({ source: 'system', type: 'server:shutdown', level: 'info', message: 'SIGTERM received' });
    stopFileWatchers();
    server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n[SHUTDOWN] Received SIGINT, shutting down gracefully...');
    stopHeartbeat();
    publishEvent({ source: 'system', type: 'server:shutdown', level: 'info', message: 'SIGINT received' });
    stopFileWatchers();
    server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
    });
});
