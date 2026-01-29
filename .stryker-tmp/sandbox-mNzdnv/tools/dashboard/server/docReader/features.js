/**
 * features.js
 * 
 * Feature suggestions processing logic.
 * Parses and manages FEATURE_SUGGESTIONS.md
 */
// @ts-nocheck


const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const DOCS_PATH = path.join(__dirname, '../../../../docs');

/**
 * Category mapping from ID prefix
 */
const CATEGORY_MAP = {
    'ARCH': 'Architecture & Code',
    'AUTH': 'Authentication & Security',
    'UX': 'UI/UX & Design',
    'FIN': 'Finance Module',
    'TASK': 'Commitments (Todo)',
    'FAM': 'Family Mode',
    'SET': 'Settings & Account',
    'ONB': 'Onboarding',
    'BRAND': 'Brand & Marketing',
    'HELP': 'Support & Help',
    'BUG': 'Bug Fixes'
};

/**
 * Parse FEATURE_SUGGESTIONS.md
 * Unified parsing with deduplication and proper data merging
 */
function parseFeatureSuggestions(markdown) {
    // Map to store features by ID (for deduplication)
    const featuresById = new Map();

    // First, parse detailed feature sections (these have full data)
    const featureRegex = /#### \[([A-Z]+-\d+)\] (.+)\n([\s\S]*?)(?=####|\n## |\n---|\n### |$)/g;
    let match;

    while ((match = featureRegex.exec(markdown)) !== null) {
        const id = match[1];
        const rawTitle = match[2].trim();
        const content = match[3];

        // Check if this feature is marked completed inline
        const isCompleted = rawTitle.includes('✅ COMPLETED') || rawTitle.includes('~~');
        const title = rawTitle.replace(/~~|✅ COMPLETED/g, '').trim();

        // Determine category from ID prefix
        const prefix = id.split('-')[0];
        const category = CATEGORY_MAP[prefix] || 'Other';

        // Extract priority from section header
        let priority = 'medium';
        const priorityMatch = markdown.substring(0, match.index).match(/### (HIGH|MEDIUM|LOW) Priority[^#]*$/i);
        if (priorityMatch) {
            priority = priorityMatch[1].toLowerCase();
        }

        // Extract effort
        const effortMatch = content.match(/\*\*Effort\*\*:\s*([^\n]+)/);
        const effort = effortMatch ? effortMatch[1].trim() : 'Not estimated';

        // Extract impact
        const impactMatch = content.match(/\*\*Impact\*\*:\s*([^\n]+)/);
        const impact = impactMatch ? impactMatch[1].trim() : 'Not assessed';

        // Extract completed date if available
        const dateMatch = content.match(/\*\*Status\*\*:.*\(([^)]+)\)/);
        const completedDate = dateMatch ? dateMatch[1] : '';

        // Extract result/summary if completed
        const resultMatch = content.match(/\*\*Result\*\*:\s*([^\n]+)/);
        const summary = resultMatch ? resultMatch[1].trim() : '';

        // Store with full data
        featuresById.set(id, {
            id,
            title,
            category,
            priority,
            effort,
            impact,
            description: content.trim().substring(0, 300) + (content.length > 300 ? '...' : ''),
            status: isCompleted ? 'completed' : 'pending',
            completedDate: isCompleted ? completedDate : undefined,
            summary: isCompleted ? summary : undefined
        });
    }

    // Then, parse the COMPLETED FEATURES table (add any missing, update dates)
    const completedMatch = markdown.match(/## ✅ COMPLETED FEATURES\s*\n\|[^\n]+\n\|[-|\s]+\n([\s\S]*?)(?=\n---|\n## )/);
    if (completedMatch) {
        const rows = completedMatch[1].split('\n').filter(r => r.includes('|'));
        rows.forEach(row => {
            const cells = row.split('|').map(c => c.trim()).filter(Boolean);
            if (cells.length >= 2) {
                const id = cells[0];
                const tableTitle = cells[1] || '';
                const completedDate = cells[2] || '';
                const tableSummary = cells[3] || '';

                // If feature exists, update with table data (dates are more accurate there)
                if (featuresById.has(id)) {
                    const existing = featuresById.get(id);
                    existing.status = 'completed';
                    existing.completedDate = completedDate || existing.completedDate;
                    existing.summary = tableSummary || existing.summary;
                } else {
                    // Feature only in table - add with inferred data
                    const prefix = id.split('-')[0];
                    featuresById.set(id, {
                        id,
                        title: tableTitle,
                        category: CATEGORY_MAP[prefix] || 'Other',
                        priority: 'medium', // Default for table-only items
                        effort: 'Completed',
                        impact: 'Delivered',
                        description: tableSummary,
                        status: 'completed',
                        completedDate,
                        summary: tableSummary
                    });
                }
            }
        });
    }

    // Convert map to arrays
    const allFeatures = Array.from(featuresById.values());
    const pendingFeatures = allFeatures.filter(f => f.status === 'pending');
    const completedFeatures = allFeatures.filter(f => f.status === 'completed')
        .sort((a, b) => {
            // Sort completed by date (newest first)
            if (a.completedDate && b.completedDate) {
                return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
            }
            return 0;
        });

    // Group pending by category
    const grouped = {};
    pendingFeatures.forEach(f => {
        if (!grouped[f.category]) grouped[f.category] = [];
        grouped[f.category].push(f);
    });

    // Calculate summary stats
    const summary = {
        total: allFeatures.length,
        pending: pendingFeatures.length,
        completed: completedFeatures.length,
        byPriority: {
            high: pendingFeatures.filter(f => f.priority === 'high').length,
            medium: pendingFeatures.filter(f => f.priority === 'medium').length,
            low: pendingFeatures.filter(f => f.priority === 'low').length
        },
        byCategory: Object.entries(grouped).map(([cat, items]) => ({
            category: cat,
            count: items.length
        }))
    };

    return {
        features: pendingFeatures,
        completedFeatures,
        grouped,
        summary
    };
}

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
