const fs = require('fs');
const path = require('path');
const { runFullSync } = require('./docUpdater');

const DOCS_PATH = path.join(__dirname, '../../../docs');
const ROADMAP_PATH = path.join(DOCS_PATH, 'ROADMAP.md');
const KNOWN_ISSUES_PATH = path.join(DOCS_PATH, 'KNOWN_ISSUES.md');
const FEATURE_SUGGESTIONS_PATH = path.join(DOCS_PATH, 'FEATURE_SUGGESTIONS.md');
const DEPLOYMENT_STATUS_PATH = path.join(DOCS_PATH, 'DEPLOYMENT_STATUS.md');
const PROJECT_STATUS_PATH = path.join(DOCS_PATH, 'PROJECT_STATUS.md');
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
        runFullSync().then(results => {
            console.log(`[FILE WATCHER] Sync complete (${source}):`, {
                velocity: results.velocity?.newCompletions || 0,
                archive: results.archive?.archivedCount || 0,
                priority: results.priority?.totalBugs || 0
            });
        }).catch(err => {
            console.error('[FILE WATCHER] Sync failed:', err.message);
        });
    }, 1000);
}

/**
 * Start watching files for changes
 */
function startFileWatchers() {
    console.log('[FILE WATCHER] Starting file watchers...');

    const filesToWatch = [
        { path: ROADMAP_PATH, name: 'ROADMAP.md' },
        { path: KNOWN_ISSUES_PATH, name: 'KNOWN_ISSUES.md' },
        { path: FEATURE_SUGGESTIONS_PATH, name: 'FEATURE_SUGGESTIONS.md' },
        { path: DEPLOYMENT_STATUS_PATH, name: 'DEPLOYMENT_STATUS.md' },
        { path: PROJECT_STATUS_PATH, name: 'PROJECT_STATUS.md' }
    ];

    for (const file of filesToWatch) {
        if (fs.existsSync(file.path)) {
            const watcher = fs.watch(file.path, { persistent: true }, (eventType, filename) => {
                if (eventType === 'change') {
                    console.log(`[FILE WATCHER] ${file.name} changed`);
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
