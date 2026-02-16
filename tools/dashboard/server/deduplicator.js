/**
 * deduplicator.js
 * 
 * Maintains ID registry and prevents duplicate entries across documentation files.
 * Scans KNOWN_ISSUES.md, FEATURE_SUGGESTIONS.md, DEPLOYMENT_STATUS.md for duplicates.
 */
// @ts-nocheck


const fs = require('fs').promises;
const path = require('path');

const DOCS_PATH = path.join(__dirname, '../../../docs');

// Known ID patterns
const ID_PATTERNS = {
    BUG: /\bBUG-(\d+)\b/gi,
    REG: /\bREG-(\d+)\b/gi,
    GAP: /\bGAP-(\d+)\b/gi,
    UX: /\bUX-(\d+)\b/gi,
    TASK: /\bTASK-(\d+)\b/gi,
    ARCH: /\bARCH-(\d+)\b/gi,
    FIN: /\bFIN-(\d+)\b/gi,
    FEAT: /\bFEAT-(\d+)\b/gi,
    BRAND: /\bBRAND-(\d+)\b/gi
};

/**
 * Scan a file for all IDs and return their locations
 */
function extractIdsFromContent(content, filename) {
    const ids = [];

    for (const [prefix, pattern] of Object.entries(ID_PATTERNS)) {
        let match;
        const regex = new RegExp(pattern.source, 'gi'); // Create new regex instance
        while ((match = regex.exec(content)) !== null) {
            ids.push({
                id: match[0].toUpperCase(),
                prefix,
                number: parseInt(match[1]),
                position: match.index,
                line: content.substring(0, match.index).split('\n').length,
                file: filename
            });
        }
    }

    return ids;
}

/**
 * Get ID registry - all IDs across all doc files
 */
async function getIdRegistry() {
    const registry = new Map(); // id -> [locations]
    const filesToScan = [
        'KNOWN_ISSUES.md',
        'FEATURE_SUGGESTIONS.md',
        'DEPLOYMENT_STATUS.md',
        'ROADMAP.md',
        'PROJECT_STATUS.md'
    ];

    for (const filename of filesToScan) {
        try {
            const filePath = path.join(DOCS_PATH, filename);
            const content = await fs.readFile(filePath, 'utf-8');
            const ids = extractIdsFromContent(content, filename);

            for (const idInfo of ids) {
                if (!registry.has(idInfo.id)) {
                    registry.set(idInfo.id, []);
                }
                registry.get(idInfo.id).push(idInfo);
            }
        } catch (error) {
            // File doesn't exist or can't be read - skip
        }
    }

    return registry;
}

/**
 * Find duplicates - IDs that appear more than once in the same file
 */
async function findDuplicates() {
    const registry = await getIdRegistry();
    const duplicates = [];

    for (const [id, locations] of registry.entries()) {
        // Group by file
        const byFile = {};
        for (const loc of locations) {
            if (!byFile[loc.file]) byFile[loc.file] = [];
            byFile[loc.file].push(loc);
        }

        // Check for duplicates within same file
        for (const [file, locs] of Object.entries(byFile)) {
            if (locs.length > 1) {
                duplicates.push({
                    id,
                    file,
                    count: locs.length,
                    lines: locs.map(l => l.line)
                });
            }
        }
    }

    return duplicates;
}

/**
 * Get next available ID for a prefix
 */
async function getNextId(prefix) {
    const registry = await getIdRegistry();
    let maxNum = 0;

    for (const [id, locations] of registry.entries()) {
        if (id.startsWith(prefix + '-')) {
            const num = parseInt(id.split('-')[1]);
            if (num > maxNum) maxNum = num;
        }
    }

    return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
}

/**
 * Check if an ID already exists
 */
async function idExists(id) {
    const registry = await getIdRegistry();
    return registry.has(id.toUpperCase());
}

/**
 * Get summary stats
 */
async function getDeduplicationStats() {
    const registry = await getIdRegistry();
    const duplicates = await findDuplicates();

    // Count by prefix
    const byPrefix = {};
    for (const id of registry.keys()) {
        const prefix = id.split('-')[0];
        byPrefix[prefix] = (byPrefix[prefix] || 0) + 1;
    }

    return {
        totalUniqueIds: registry.size,
        byPrefix,
        duplicatesFound: duplicates.length,
        duplicates: duplicates.slice(0, 10), // First 10 duplicates
        healthy: duplicates.length === 0
    };
}

module.exports = {
    extractIdsFromContent,
    getIdRegistry,
    findDuplicates,
    getNextId,
    idExists,
    getDeduplicationStats
};
