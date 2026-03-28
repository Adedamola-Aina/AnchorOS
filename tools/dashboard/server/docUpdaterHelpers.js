// @ts-nocheck
const fs = require('fs');
const path = require('path');
const os = require('os');

const LEGACY_SYNC_LOG_PATH = path.join(__dirname, '../data/doc_sync_log.json');

function resolveSyncLogPath(env = process.env) {
    const configuredPath = env.ANCHOR_DASHBOARD_SYNC_LOG_PATH;
    if (configuredPath && configuredPath.trim()) {
        return path.resolve(configuredPath.trim());
    }

    return path.join(os.tmpdir(), 'anchor-dashboard', 'doc_sync_log.json');
}

const SYNC_LOG_PATH = resolveSyncLogPath();

/**
 * Initialize sync log
 */
function initializeSyncLog() {
    const dataDir = path.dirname(SYNC_LOG_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(SYNC_LOG_PATH)) {
        if (fs.existsSync(LEGACY_SYNC_LOG_PATH) && LEGACY_SYNC_LOG_PATH !== SYNC_LOG_PATH) {
            fs.copyFileSync(LEGACY_SYNC_LOG_PATH, SYNC_LOG_PATH);
            return;
        }

        const initialLog = {
            lastSync: null,
            syncHistory: [],
            stats: {
                totalSyncs: 0,
                lastVelocityUpdate: null,
                lastPriorityUpdate: null,
                lastArchiveRun: null
            }
        };
        fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(initialLog, null, 2));
    }
}

/**
 * Read sync log
 */
function readSyncLog() {
    initializeSyncLog();
    return JSON.parse(fs.readFileSync(SYNC_LOG_PATH, 'utf8'));
}

/**
 * Write sync log
 */
function writeSyncLog(log) {
    fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2));
}

function shouldPersistSyncEvent(type, details = {}) {
    if (details.error || details.success === false) {
        return true;
    }

    if (type === 'velocity') {
        return (details.newCompletions || 0) > 0;
    }

    if (type === 'priority') {
        return (details.needsReview || 0) > 0;
    }

    if (type === 'archive') {
        return (details.archivedCount || 0) > 0;
    }

    return true;
}

/**
 * Log a sync event
 */
function logSyncEvent(type, details) {
    const log = readSyncLog();

    log.syncHistory.unshift({
        timestamp: new Date().toISOString(),
        type,
        details
    });

    // Keep only last 50 sync events
    if (log.syncHistory.length > 50) {
        log.syncHistory = log.syncHistory.slice(0, 50);
    }

    log.lastSync = new Date().toISOString();
    log.stats.totalSyncs++;

    if (type === 'velocity') {
        log.stats.lastVelocityUpdate = new Date().toISOString();
    } else if (type === 'priority') {
        log.stats.lastPriorityUpdate = new Date().toISOString();
    } else if (type === 'archive') {
        log.stats.lastArchiveRun = new Date().toISOString();
    }

    writeSyncLog(log);
}

module.exports = {
    resolveSyncLogPath,
    SYNC_LOG_PATH,
    initializeSyncLog,
    readSyncLog,
    writeSyncLog,
    shouldPersistSyncEvent,
    logSyncEvent
};
