// @ts-nocheck
const fs = require('fs');
const path = require('path');
const {
    fileBug,
    fileFeature
} = require('./conversationProcessorHelpers');

const PENDING_BUGS_PATH = path.join(__dirname, '../.dashboard/pending_bugs.json');
const PENDING_FEATURES_PATH = path.join(__dirname, '../.dashboard/pending_features.json');
const DASHBOARD_DIR = path.join(__dirname, '../.dashboard');

/**
 * Initialize dashboard directory
 */
function initializeDashboardDir() {
    if (!fs.existsSync(DASHBOARD_DIR)) {
        fs.mkdirSync(DASHBOARD_DIR, { recursive: true });
    }
}

/**
 * Process pending bugs from marker file
 */
function processPendingBugs() {
    if (!fs.existsSync(PENDING_BUGS_PATH)) {
        return { processed: 0, skipped: 0 };
    }

    try {
        const data = JSON.parse(fs.readFileSync(PENDING_BUGS_PATH, 'utf8'));
        let processed = 0;
        let skipped = 0;

        for (const bug of data.items || []) {
            const result = fileBug(bug);
            if (result.success) {
                processed++;
            } else {
                skipped++;
            }
        }

        // Delete marker file
        fs.unlinkSync(PENDING_BUGS_PATH);

        console.log(`[CONVERSATION AI] Processed ${processed} bugs, skipped ${skipped} duplicates`);
        return { processed, skipped };
    } catch (error) {
        console.error('[CONVERSATION AI] Error processing pending bugs:', error.message);
        return { processed: 0, skipped: 0, error: error.message };
    }
}

/**
 * Process pending features from marker file
 */
function processPendingFeatures() {
    if (!fs.existsSync(PENDING_FEATURES_PATH)) {
        return { processed: 0, skipped: 0 };
    }

    try {
        const data = JSON.parse(fs.readFileSync(PENDING_FEATURES_PATH, 'utf8'));
        let processed = 0;
        let skipped = 0;

        for (const feature of data.items || []) {
            const result = fileFeature(feature);
            if (result.success) {
                processed++;
            } else {
                skipped++;
            }
        }

        // Delete marker file
        fs.unlinkSync(PENDING_FEATURES_PATH);

        console.log(`[CONVERSATION AI] Processed ${processed} features, skipped ${skipped} duplicates`);
        return { processed, skipped };
    } catch (error) {
        console.error('[CONVERSATION AI] Error processing pending features:', error.message);
        return { processed: 0, skipped: 0, error: error.message };
    }
}

/**
 * Watch for marker files
 */
function watchMarkerFiles(callback) {
    initializeDashboardDir();

    const watcher = fs.watch(DASHBOARD_DIR, { persistent: true }, (eventType, filename) => {
        if (filename === 'pending_bugs.json' || filename === 'pending_features.json') {
            console.log(`[CONVERSATION AI] Detected ${filename} - processing...`);

            // Small delay to ensure file is fully written
            setTimeout(() => {
                if (filename === 'pending_bugs.json') {
                    const result = processPendingBugs();
                    if (callback) callback('bugs', result);
                } else if (filename === 'pending_features.json') {
                    const result = processPendingFeatures();
                    if (callback) callback('features', result);
                }
            }, 500);
        }
    });

    console.log('[CONVERSATION AI] Watching for marker files in .dashboard/');
    return watcher;
}

module.exports = {
    initializeDashboardDir,
    fileBug,
    fileFeature,
    processPendingBugs,
    processPendingFeatures,
    watchMarkerFiles
};
