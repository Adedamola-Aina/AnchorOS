/**
 * index.js
 *
 * Express server for the AnchorOS Engineering Console.
 * Read-mostly engineering telemetry: environment parity, delivery history,
 * quality snapshots, and dashboard self-health.
 */
// @ts-nocheck

require('dotenv').config();
const express = require('express');
const path = require('path');

const { setupMiddleware } = require('./middleware');

const overviewRouter = require('./routes/overview');
const environmentRouter = require('./routes/environment');
const deliveryRouter = require('./routes/delivery');
const qualityRouter = require('./routes/quality');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

setupMiddleware(app);

app.use('/', overviewRouter);
app.use('/', environmentRouter);
app.use('/', deliveryRouter);
app.use('/', qualityRouter);
app.use('/', healthRouter);

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

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║             🛠️  AnchorOS Engineering Console                    ║
║                                                                  ║
║  📊 Console: http://localhost:${PORT}                            ║
║  📁 Sources: Git History + deploy markers + generated reports    ║
║                                                                  ║
║  ⚡ Read-only telemetry:                                          ║
║     • Environment parity (git merge-base ancestry)              ║
║     • Delivery timeline (commits + deployments)                 ║
║     • Quality snapshots (coverage/deps/secureDb/bundle/E2E)     ║
║     • Explicit cache refresh only — no background watchers      ║
╚════════════════════════════════════════════════════════════════╝
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
        console.error('   Then restart the console.');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n[SHUTDOWN] Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n[SHUTDOWN] Received SIGINT, shutting down gracefully...');
    server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
    });
});

