/**
 * conversationAnalyzer.js
 *
 * AI-powered conversation analyzer that detects and classifies:
 * - BUG: Broken functionality
 * - REGRESSION: Previously working, now broken
 * - FEATURE: New functionality requests
 * - GAP: Missing expected functionality
 * - TASK: Internal improvements
 */
// @ts-nocheck

const fs = require('fs').promises;
const path = require('path');
const {
    PATTERNS,
    COMPONENTS,
    classifyMessage,
    detectPriority,
    detectComponent,
    extractTitle,
    extractKeywords,
    formatIssue
} = require('./conversationAnalyzerHelpers');

/**
 * Get next ID for issue type
 */
async function getNextId(type, projectRoot) {
    const knownIssuesPath = path.join(projectRoot, 'docs', 'KNOWN_ISSUES.md');
    const featuresPath = path.join(projectRoot, 'docs', 'FEATURE_SUGGESTIONS.md');
    const statusPath = path.join(projectRoot, 'docs', 'PROJECT_STATUS.md');

    try {
        let content = '';

        if (type === 'FEATURE') {
            content = await fs.readFile(featuresPath, 'utf-8');
        } else if (type === 'TASK') {
            content = await fs.readFile(statusPath, 'utf-8');
        } else {
            content = await fs.readFile(knownIssuesPath, 'utf-8');
        }

        // Find all IDs of this type
        const regex = new RegExp(`${type}-(\\d+)`, 'g');
        const matches = [...content.matchAll(regex)];

        if (matches.length === 0) {
            return `${type}-001`;
        }

        // Get highest number
        const numbers = matches.map(m => parseInt(m[1]));
        const maxNumber = Math.max(...numbers);
        const nextNumber = maxNumber + 1;

        return `${type}-${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
        console.error('Error getting next ID:', error.message);
        return `${type}-001`;
    }
}

/**
 * Analyze a user message and extract issue
 */
async function analyzeMessage(message, projectRoot) {
    const type = classifyMessage(message);

    if (!type) {
        return null; // Not an issue
    }

    const priority = detectPriority(message, type);
    const component = detectComponent(message);
    const title = extractTitle(message, type);
    const id = await getNextId(type, projectRoot);

    return {
        type,
        id,
        title,
        component,
        priority,
        description: message.trim(),
        keywords: extractKeywords(message, type),
        reportedAt: new Date().toISOString(),
        reporter: 'User'
    };
}

module.exports = {
    analyzeMessage,
    classifyMessage,
    detectPriority,
    detectComponent,
    extractTitle,
    getNextId,
    formatIssue,
    PATTERNS,
    COMPONENTS
};
