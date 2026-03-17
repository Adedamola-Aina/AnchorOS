// @ts-nocheck
const fs = require('fs');
const path = require('path');
const { runFullSync } = require('./docUpdater');
const { publishEvent } = require('./eventIngestion');

// Roadmap JSON is the single source of truth for tracked initiatives
const ROADMAP_JSON_PATH = path.join(__dirname, 'roadmap.json');
const GIT_DIR = path.join(__dirname, '../../../.git');

let watchers = [];
let debounceTimers = {};

/**
 * Debounced sync to prevent multiple triggers
 */
function debouncedSync(source) {
    if (debounceTimers[source]) {
        clearTimeout(debounceTimers[source]);
    }
    debounceTimers[source] = setTimeout(() => {
        console.log(`[FILE WATCHER] Syncing due to: ${source}`);
        publishEvent({
            source: 'watcher',
            type: 'sync:triggered',
            level: 'info',
            status: 'started',
            message: `Sync triggered by ${source}`,
            payload: { source }
        });
        runFullSync({ syncVelocity: false }).then(results => {
            console.log(`[FILE WATCHER] Sync complete (${source}):`, {
                velocity: results.velocity?.newCompletions || 0,
                archive: results.archive?.archivedCount || 0,
                priority: results.priority?.totalBugs || 0
            });
            publishEvent({
                source: 'watcher',
                type: 'sync:completed',
                level: 'info',
                status: 'completed',
                message: `Sync completed for ${source}`,
                payload: {
                    source,
                    velocity: results.velocity?.newCompletions || 0,
                    archive: results.archive?.archivedCount || 0,
                    priority: results.priority?.totalBugs || 0
                }
            });
        }).catch(err => {
            console.error('[FILE WATCHER] Sync failed:', err.message);
            publishEvent({
                source: 'watcher',
                type: 'sync:failed',
                level: 'warning',
                status: 'failed',
                message: `Sync failed for ${source}`,
                payload: { source, error: err.message }
            });
        });
    }, 1000);
}

/**
 * Start watching files for changes
 */
function startFileWatchers() {
    console.log('[FILE WATCHER] Starting file watchers...');

    // Watch roadmap.json - the single source of truth for tracked initiatives
    const filesToWatch = [
        { path: ROADMAP_JSON_PATH, name: 'roadmap.json' }
    ];

    for (const file of filesToWatch) {
        if (fs.existsSync(file.path)) {
            const watcher = fs.watch(file.path, { persistent: true }, (eventType, filename) => {
                if (eventType === 'change') {
                    console.log(`[FILE WATCHER] ${file.name} changed`);
                    publishEvent({
                        source: 'watcher',
                        type: 'file:changed',
                        level: 'info',
                        message: `${file.name} changed`,
                        payload: { file: file.name }
                    });
                    debouncedSync(file.name);
                }
            });
            watchers.push(watcher);
            console.log(`[FILE WATCHER] Watching ${file.name}`);
        }
    }

    // Watch git HEAD for commit changes
    const gitHeadPath = path.join(GIT_DIR, 'HEAD');
    if (fs.existsSync(gitHeadPath)) {
        const gitWatcher = fs.watch(GIT_DIR, { persistent: true, recursive: true }, (eventType, filename) => {
            // Only trigger on relevant git changes (commits, merges)
            if (filename && (filename.includes('HEAD') || filename.includes('refs/heads') || filename.includes('COMMIT_EDITMSG'))) {
                console.log(`[FILE WATCHER] Git state changed: ${filename}`);
                publishEvent({
                    source: 'watcher',
                    type: 'git:changed',
                    level: 'info',
                    message: 'Git state changed',
                    payload: { filename }
                });
                debouncedSync('git-commit');
            }
        });
        watchers.push(gitWatcher);
        console.log('[FILE WATCHER] Watching .git for commits');
    }

    console.log(`[FILE WATCHER] ${watchers.length} watchers active`);
}

/**
 * Stop all file watchers
 */
function stopFileWatchers() {
    console.log('[FILE WATCHER] Stopping file watchers...');
    watchers.forEach(watcher => watcher.close());
    watchers = [];
}

module.exports = {
    startFileWatchers,
    stopFileWatchers
};
