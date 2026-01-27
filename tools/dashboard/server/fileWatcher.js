const fs = require('fs');
const path = require('path');
const { runFullSync } = require('./docUpdater');

const ROADMAP_PATH = path.join(__dirname, '../../../docs/ROADMAP.md');
const KNOWN_ISSUES_PATH = path.join(__dirname, '../../../docs/KNOWN_ISSUES.md');
const FEATURE_SUGGESTIONS_PATH = path.join(__dirname, '../../../docs/FEATURE_SUGGESTIONS.md');

let watchers = [];

/**
 * Start watching files for changes
 */
function startFileWatchers() {
    console.log('[FILE WATCHER] Starting file watchers...');

    // Watch ROADMAP.md for task completions
    if (fs.existsSync(ROADMAP_PATH)) {
        const roadmapWatcher = fs.watch(ROADMAP_PATH, { persistent: true }, (eventType, filename) => {
            if (eventType === 'change') {
                console.log('[FILE WATCHER] ROADMAP.md changed - triggering sync...');
                setTimeout(() => {
                    runFullSync().then(results => {
                        console.log('[FILE WATCHER] Auto-sync complete:', {
                            velocity: results.velocity.newCompletions || 0,
                            archive: results.archive.archivedCount || 0
                        });
                    }).catch(err => {
                        console.error('[FILE WATCHER] Auto-sync failed:', err.message);
                    });
                }, 1000); // Debounce 1 second
            }
        });
        watchers.push(roadmapWatcher);
        console.log('[FILE WATCHER] Watching ROADMAP.md for changes');
    }

    // Watch KNOWN_ISSUES.md for bug updates
    if (fs.existsSync(KNOWN_ISSUES_PATH)) {
        const bugsWatcher = fs.watch(KNOWN_ISSUES_PATH, { persistent: true }, (eventType, filename) => {
            if (eventType === 'change') {
                console.log('[FILE WATCHER] KNOWN_ISSUES.md changed - triggering priority analysis...');
                setTimeout(() => {
                    runFullSync().then(results => {
                        console.log('[FILE WATCHER] Priority analysis complete:', {
                            totalBugs: results.priority.totalBugs || 0,
                            needsReview: results.priority.needsReview || 0
                        });
                    }).catch(err => {
                        console.error('[FILE WATCHER] Priority analysis failed:', err.message);
                    });
                }, 1000); // Debounce 1 second
            }
        });
        watchers.push(bugsWatcher);
        console.log('[FILE WATCHER] Watching KNOWN_ISSUES.md for changes');
    }

    // Watch FEATURE_SUGGESTIONS.md for feature updates
    if (fs.existsSync(FEATURE_SUGGESTIONS_PATH)) {
        const featuresWatcher = fs.watch(FEATURE_SUGGESTIONS_PATH, { persistent: true }, (eventType, filename) => {
            if (eventType === 'change') {
                console.log('[FILE WATCHER] FEATURE_SUGGESTIONS.md changed - triggering sync...');
                setTimeout(() => {
                    runFullSync().then(results => {
                        console.log('[FILE WATCHER] Feature sync complete');
                    }).catch(err => {
                        console.error('[FILE WATCHER] Feature sync failed:', err.message);
                    });
                }, 1000); // Debounce 1 second
            }
        });
        watchers.push(featuresWatcher);
        console.log('[FILE WATCHER] Watching FEATURE_SUGGESTIONS.md for changes');
    }

    console.log(`[FILE WATCHER] ${watchers.length} file watchers active`);
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
