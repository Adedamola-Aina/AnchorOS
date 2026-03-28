// @ts-nocheck
/**
 * features.js
 *
 * Feature suggestions processing logic.
 * Parses and manages FEATURE_SUGGESTIONS.md
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const { parseFeatureSuggestions } = require('./featuresParser');

const DOCS_PATH = path.join(__dirname, '../../../../docs');

/**
 * Get Feature Suggestions
 */
async function getFeatureSuggestions() {
    try {
        const filePath = path.join(DOCS_PATH, 'FEATURE_SUGGESTIONS.md');
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);
        const { content: markdown } = matter(content);

        return {
            filename: 'FEATURE_SUGGESTIONS.md',
            lastModified: stats.mtime,
            parsed: {
                exists: true,
                ...parseFeatureSuggestions(markdown)
            }
        };
    } catch (error) {
        return {
            filename: 'FEATURE_SUGGESTIONS.md',
            error: error.message,
            parsed: {
                exists: false,
                features: [],
                completedFeatures: [],
                grouped: {},
                summary: { total: 0, pending: 0, completed: 0, byPriority: {}, byCategory: [] }
            }
        };
    }
}

module.exports = {
    parseFeatureSuggestions,
    getFeatureSuggestions
};
