// @ts-nocheck
const fs = require('fs');
const path = require('path');

const KNOWN_ISSUES_PATH = path.join(__dirname, '../../../docs/KNOWN_ISSUES.md');
const FEATURE_SUGGESTIONS_PATH = path.join(__dirname, '../../../docs/FEATURE_SUGGESTIONS.md');

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

module.exports = {
    isDuplicateBug,
    isDuplicateFeature,
    parseKnownIssuesStructure,
    fileBug,
    fileFeature,
    KNOWN_ISSUES_PATH,
    FEATURE_SUGGESTIONS_PATH
};
