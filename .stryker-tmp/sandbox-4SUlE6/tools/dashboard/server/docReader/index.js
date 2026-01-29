/**
 * docReader/index.js
 * 
 * Main entry point for documentation reading and parsing.
 * Orchestrates parsers, kanban, and features modules.
 */
// @ts-nocheck


const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

// Import sub-modules
const {
    parseProjectStatus,
    parseKnownIssues,
    parseRoadmap,
    parseDeploymentStatus
} = require('./parsers');

const {
    getProjectBoard,
    getEnhancedKanbanBoard
} = require('./kanban');

const {
    getFeatureSuggestions
} = require('./features');

const DOCS_PATH = path.join(__dirname, '../../../../docs');

/**
 * Calculate document freshness
 */
function calculateFreshness(mtime) {
    const ageHours = (Date.now() - new Date(mtime).getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) return { status: 'fresh', label: `${Math.round(ageHours)} hours ago`, color: 'green' };
    if (ageHours < 168) return { status: 'recent', label: `${Math.round(ageHours / 24)} days ago`, color: 'yellow' };
    return { status: 'stale', label: `${Math.round(ageHours / 24)} days ago`, color: 'red' };
}

/**
 * Parse content based on document type
 */
function parseByType(filename, markdown) {
    switch (filename) {
        case 'PROJECT_STATUS.md':
            return parseProjectStatus(markdown);
        case 'KNOWN_ISSUES.md':
            return parseKnownIssues(markdown);
        case 'ROADMAP.md':
            return parseRoadmap(markdown);
        case 'DEPLOYMENT_STATUS.md':
            return parseDeploymentStatus(markdown);
        default:
            return { raw: markdown };
    }
}

/**
 * Read and parse a documentation file
 */
async function readDoc(filename) {
    try {
        const filePath = path.join(DOCS_PATH, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);
        const { data: frontmatter, content: markdown } = matter(content);

        return {
            filename,
            frontmatter,
            content: markdown,
            lastModified: stats.mtime,
            freshness: calculateFreshness(stats.mtime),
            parsed: parseByType(filename, markdown)
        };
    } catch (error) {
        return { filename, error: error.message, exists: false };
    }
}

/**
 * Get all documentation files status
 */
async function getAllDocs() {
    const docFiles = ['PROJECT_STATUS.md', 'KNOWN_ISSUES.md', 'ROADMAP.md', 'DEPLOYMENT_STATUS.md'];
    const results = await Promise.all(docFiles.map(readDoc));
    return results;
}

// Re-export functions from sub-modules
module.exports = {
    readDoc,
    getAllDocs,
    getProjectBoard,
    getFeatureSuggestions,
    getEnhancedKanbanBoard
};
