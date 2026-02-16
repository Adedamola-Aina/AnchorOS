// @ts-nocheck
const fs = require('fs');
const path = require('path');
const { getVelocityStats, autoDetectCompletions } = require('./velocityTracker');
const { analyzeBugsFromKnownIssues } = require('./bugPrioritizer');
const { archiveOldItems } = require('./archiveManager');

const ROADMAP_PATH = path.join(__dirname, '../../../docs/ROADMAP.md');
const KNOWN_ISSUES_PATH = path.join(__dirname, '../../../docs/KNOWN_ISSUES.md');
const SYNC_LOG_PATH = path.join(__dirname, '../data/doc_sync_log.json');

/**
 * Initialize sync log
 */
function initializeSyncLog() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(SYNC_LOG_PATH)) {
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

/**
 * Auto-sync velocity data
 */
async function syncVelocityData() {
    try {
        const roadmapData = fs.readFileSync(ROADMAP_PATH, 'utf8');
        const newCompletions = autoDetectCompletions({ content: roadmapData });

        logSyncEvent('velocity', {
            newCompletions: newCompletions.length,
            message: `Detected ${newCompletions.length} new completions`
        });

        return {
            success: true,
            newCompletions: newCompletions.length
        };
    } catch (error) {
        logSyncEvent('velocity', {
            error: error.message,
            success: false
        });
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Auto-sync priority data
 */
async function syncPriorityData() {
    try {
        if (!fs.existsSync(KNOWN_ISSUES_PATH)) {
            return {
                success: true,
                message: 'KNOWN_ISSUES.md not found, skipping priority sync'
            };
        }

        const knownIssuesContent = fs.readFileSync(KNOWN_ISSUES_PATH, 'utf8');

        // Parse KNOWN_ISSUES.md into sections
        const sections = {
            critical: [],
            high: [],
            medium: [],
            low: []
        };

        const lines = knownIssuesContent.split('\n');
        let currentSection = null;

        for (const line of lines) {
            if (line.match(/## Critical/i)) currentSection = 'critical';
            else if (line.match(/## High/i)) currentSection = 'high';
            else if (line.match(/## Medium/i)) currentSection = 'medium';
            else if (line.match(/## Low/i)) currentSection = 'low';
            else if (currentSection && line.match(/^[\s]*[-*]\s*\[[ x]\]/i)) {
                sections[currentSection].push({ text: line });
            }
        }

        const suggestions = analyzeBugsFromKnownIssues(sections);
        const needsReview = suggestions.filter(s =>
            s.currentPriority && s.currentPriority !== s.suggestedPriority
        );

        logSyncEvent('priority', {
            totalBugs: suggestions.length,
            needsReview: needsReview.length,
            message: `Analyzed ${suggestions.length} bugs, ${needsReview.length} need priority review`
        });

        return {
            success: true,
            totalBugs: suggestions.length,
            needsReview: needsReview.length
        };
    } catch (error) {
        logSyncEvent('priority', {
            error: error.message,
            success: false
        });
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Auto-sync archive
 */
async function syncArchive() {
    try {
        const result = archiveOldItems(30, false);

        logSyncEvent('archive', {
            archivedCount: result.archivedCount,
            message: result.message
        });

        return result;
    } catch (error) {
        logSyncEvent('archive', {
            error: error.message,
            success: false
        });
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Run full auto-sync
 */
async function runFullSync() {
    console.log('[DOC SYNC] Starting full documentation sync...');

    const results = {
        timestamp: new Date().toISOString(),
        velocity: await syncVelocityData(),
        priority: await syncPriorityData(),
        archive: await syncArchive()
    };

    console.log('[DOC SYNC] Full sync complete:', {
        velocity: results.velocity.newCompletions || 0,
        priority: results.priority.totalBugs || 0,
        archive: results.archive.archivedCount || 0
    });

    return results;
}

/**
 * Get sync status
 */
function getSyncStatus() {
    const log = readSyncLog();
    const velocityStats = getVelocityStats();

    return {
        lastSync: log.lastSync,
        stats: log.stats,
        recentSyncs: log.syncHistory.slice(0, 10),
        velocityData: {
            currentVelocity: velocityStats.currentVelocity,
            totalCompletions: velocityStats.totalCompletions
        }
    };
}

module.exports = {
    runFullSync,
    syncVelocityData,
    syncPriorityData,
    syncArchive,
    getSyncStatus
};
