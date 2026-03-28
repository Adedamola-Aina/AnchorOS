// @ts-nocheck
const fs = require('fs');
const path = require('path');
const { getVelocityStats, autoDetectCompletions } = require('./velocityTracker');
const { analyzeBugsFromKnownIssues } = require('./bugPrioritizer');
const { archiveOldItems } = require('./archiveManager');
const {
    resolveSyncLogPath,
    SYNC_LOG_PATH,
    readSyncLog,
    shouldPersistSyncEvent,
    logSyncEvent
} = require('./docUpdaterHelpers');

const KNOWN_ISSUES_PATH = path.join(__dirname, '../../../docs/KNOWN_ISSUES.md');

/**
 * Auto-sync velocity data
 */
async function syncVelocityData() {
    try {
        const newCompletions = await autoDetectCompletions();
        const completionCount = Number.isFinite(newCompletions) ? newCompletions : 0;

        const details = {
            newCompletions: completionCount,
            message: `Detected ${completionCount} new completions`
        };

        if (shouldPersistSyncEvent('velocity', details)) {
            logSyncEvent('velocity', details);
        }

        return {
            success: true,
            newCompletions: completionCount
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

        const details = {
            totalBugs: suggestions.length,
            needsReview: needsReview.length,
            message: `Analyzed ${suggestions.length} bugs, ${needsReview.length} need priority review`
        };

        if (shouldPersistSyncEvent('priority', details)) {
            logSyncEvent('priority', details);
        }

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

        const details = {
            archivedCount: result.archivedCount,
            message: result.message
        };

        if (shouldPersistSyncEvent('archive', details)) {
            logSyncEvent('archive', details);
        }

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
async function runFullSync(options = {}) {
    const { syncVelocity = true } = options;
    console.log('[DOC SYNC] Starting full documentation sync...');

    const velocityResult = syncVelocity
        ? await syncVelocityData()
        : { success: true, newCompletions: 0, skipped: true };

    const results = {
        timestamp: new Date().toISOString(),
        velocity: velocityResult,
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
    getSyncStatus,
    shouldPersistSyncEvent,
    resolveSyncLogPath,
    SYNC_LOG_PATH
};
