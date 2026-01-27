const fs = require('fs');
const path = require('path');

const KNOWN_ISSUES_PATH = path.join(__dirname, '../../../docs/KNOWN_ISSUES.md');
const FEATURE_SUGGESTIONS_PATH = path.join(__dirname, '../../../docs/FEATURE_SUGGESTIONS.md');
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
 * Check if a bug already exists in KNOWN_ISSUES.md
 */
function isDuplicateBug(description) {
    if (!fs.existsSync(KNOWN_ISSUES_PATH)) {
        return false;
    }

    const content = fs.readFileSync(KNOWN_ISSUES_PATH, 'utf8');
    const lines = content.toLowerCase().split('\n');
    const descLower = description.toLowerCase();

    // Simple keyword matching - check if key phrases exist
    const keywords = descLower.split(' ').filter(w => w.length > 4);
    let matchCount = 0;

    for (const line of lines) {
        for (const keyword of keywords) {
            if (line.includes(keyword)) {
                matchCount++;
            }
        }
    }

    // If more than 50% of keywords match, likely duplicate
    return matchCount > keywords.length * 0.5;
}

/**
 * Check if a feature already exists in FEATURE_SUGGESTIONS.md
 */
function isDuplicateFeature(title) {
    if (!fs.existsSync(FEATURE_SUGGESTIONS_PATH)) {
        return false;
    }

    const content = fs.readFileSync(FEATURE_SUGGESTIONS_PATH, 'utf8');
    const titleLower = title.toLowerCase();

    // Check if title or similar phrase exists
    return content.toLowerCase().includes(titleLower);
}

/**
 * Parse KNOWN_ISSUES.md to understand structure
 */
function parseKnownIssuesStructure() {
    if (!fs.existsSync(KNOWN_ISSUES_PATH)) {
        return {
            hasSections: false,
            sections: ['Critical', 'High Priority', 'Medium Priority', 'Low Priority']
        };
    }

    const content = fs.readFileSync(KNOWN_ISSUES_PATH, 'utf8');
    const lines = content.split('\n');
    const sections = [];

    for (const line of lines) {
        if (line.match(/^##\s+/)) {
            sections.push(line.replace(/^##\s+/, '').trim());
        }
    }

    return {
        hasSections: sections.length > 0,
        sections: sections.length > 0 ? sections : ['Critical', 'High Priority', 'Medium Priority', 'Low Priority']
    };
}

/**
 * File a bug to KNOWN_ISSUES.md
 */
function fileBug(bug) {
    const { description, severity = 'medium', context = '', suggestedPriority = 'P2' } = bug;

    // Check for duplicate
    if (isDuplicateBug(description)) {
        console.log(`[CONVERSATION AI] Skipping duplicate bug: ${description.substring(0, 50)}...`);
        return { success: false, reason: 'duplicate' };
    }

    // Parse structure
    const structure = parseKnownIssuesStructure();

    // Determine section based on severity
    let targetSection = 'Medium Priority';
    if (severity === 'critical' || suggestedPriority === 'P0') {
        targetSection = 'Critical';
    } else if (severity === 'high' || suggestedPriority === 'P1') {
        targetSection = 'High Priority';
    } else if (severity === 'low' || suggestedPriority === 'P3') {
        targetSection = 'Low Priority';
    }

    // Create bug entry
    const timestamp = new Date().toISOString().split('T')[0];
    const bugEntry = `- [ ] [${suggestedPriority}] ${description}${context ? ` (${context})` : ''} - Added ${timestamp}`;

    // Read or create file
    let content = '';
    if (fs.existsSync(KNOWN_ISSUES_PATH)) {
        content = fs.readFileSync(KNOWN_ISSUES_PATH, 'utf8');
    } else {
        content = '# Known Issues\n\n';
    }

    // Find target section and insert
    const lines = content.split('\n');
    let inserted = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`## ${targetSection}`)) {
            // Insert after section header
            lines.splice(i + 1, 0, bugEntry);
            inserted = true;
            break;
        }
    }

    // If section not found, create it
    if (!inserted) {
        lines.push(`\n## ${targetSection}\n${bugEntry}`);
    }

    // Write back
    fs.writeFileSync(KNOWN_ISSUES_PATH, lines.join('\n'));

    console.log(`[CONVERSATION AI] Filed bug to ${targetSection}: ${description.substring(0, 50)}...`);
    return { success: true, section: targetSection };
}

/**
 * File a feature to FEATURE_SUGGESTIONS.md
 */
function fileFeature(feature) {
    const { title, description, priority = 'medium', context = '' } = feature;

    // Check for duplicate
    if (isDuplicateFeature(title)) {
        console.log(`[CONVERSATION AI] Skipping duplicate feature: ${title}`);
        return { success: false, reason: 'duplicate' };
    }

    // Create feature entry
    const timestamp = new Date().toISOString().split('T')[0];
    const featureEntry = `\n### ${title}\n- **Priority**: ${priority}\n- **Description**: ${description}${context ? `\n- **Context**: ${context}` : ''}\n- **Status**: Backlog\n- **Added**: ${timestamp}\n`;

    // Read or create file
    let content = '';
    if (fs.existsSync(FEATURE_SUGGESTIONS_PATH)) {
        content = fs.readFileSync(FEATURE_SUGGESTIONS_PATH, 'utf8');
    } else {
        content = '# Feature Suggestions\n\n';
    }

    // Append feature
    content += featureEntry;

    // Write back
    fs.writeFileSync(FEATURE_SUGGESTIONS_PATH, content);

    console.log(`[CONVERSATION AI] Filed feature: ${title}`);
    return { success: true };
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
