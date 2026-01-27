/**
 * features.js
 * 
 * Feature suggestions processing logic.
 * Parses and manages FEATURE_SUGGESTIONS.md
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const DOCS_PATH = path.join(__dirname, '../../../../docs');

/**
 * Parse FEATURE_SUGGESTIONS.md
 * Now tracks completed features separately from pending
 */
function parseFeatureSuggestions(markdown) {
    const categories = [];

    // First, parse the COMPLETED FEATURES table
    const completedFeatures = [];
    const completedMatch = markdown.match(/## ✅ COMPLETED FEATURES\s*\n\|[^\n]+\n\|[-|\s]+\n([\s\S]*?)(?=\n---|\n## )/);
    if (completedMatch) {
        const rows = completedMatch[1].split('\n').filter(r => r.includes('|'));
        rows.forEach(row => {
            const cells = row.split('|').map(c => c.trim()).filter(Boolean);
            if (cells.length >= 2) {
                completedFeatures.push({
                    id: cells[0],
                    title: cells[1] || 'Completed',
                    completedDate: cells[2] || '',
                    summary: cells[3] || '',
                    status: 'completed'
                });
            }
        });
    }

    // Get completed IDs for filtering
    const completedIds = new Set(completedFeatures.map(f => f.id));

    // Match category headers (## 🏗️ 1. ARCHITECTURE, etc.)
    const categoryRegex = /## [🏗🔐🎨💰✅👨‍👩‍👧‍👦⚙🚪🎯🆘].+\d+\. (.+)\n/g;
    const categoryMatches = [...markdown.matchAll(categoryRegex)];

    // Get all feature items with IDs like [ARCH-001], [AUTH-002], etc.
    const featureRegex = /#### \[([A-Z]+-\d+)\] (.+)\n([\s\S]*?)(?=####|\n## |\n---|\n### |$)/g;
    const features = [];
    let match;

    while ((match = featureRegex.exec(markdown)) !== null) {
        const id = match[1];
        const title = match[2].trim();
        const content = match[3];

        // Check if this feature is marked completed inline
        const isCompleted = completedIds.has(id) ||
            title.includes('✅ COMPLETED') ||
            title.includes('~~');

        // Determine category from ID prefix
        const prefix = id.split('-')[0];
        const categoryMap = {
            'ARCH': 'Architecture & Code',
            'AUTH': 'Authentication & Security',
            'UX': 'UI/UX & Design',
            'FIN': 'Finance Module',
            'TASK': 'Commitments (Todo)',
            'FAM': 'Family Mode',
            'SET': 'Settings & Account',
            'ONB': 'Onboarding',
            'BRAND': 'Brand & Marketing',
            'HELP': 'Support & Help'
        };

        // Extract priority from section header (HIGH/MEDIUM/LOW)
        let priority = 'medium';
        const priorityMatch = markdown.substring(0, match.index).match(/### (HIGH|MEDIUM|LOW) Priority[^#]*$/i);
        if (priorityMatch) {
            priority = priorityMatch[1].toLowerCase();
        }

        // Extract effort
        const effortMatch = content.match(/\*\*Effort\*\*:\s*([^\n]+)/);
        const effort = effortMatch ? effortMatch[1].trim() : 'Unknown';

        // Extract impact
        const impactMatch = content.match(/\*\*Impact\*\*:\s*([^\n]+)/);
        const impact = impactMatch ? impactMatch[1].trim() : '';

        features.push({
            id,
            title: title.replace(/~~|✅ COMPLETED/g, '').trim(),
            category: categoryMap[prefix] || 'Other',
            priority,
            effort,
            impact,
            description: content.trim().substring(0, 200) + '...',
            status: isCompleted ? 'completed' : 'pending'
        });
    }

    // Separate pending and completed
    const pendingFeatures = features.filter(f => f.status === 'pending');
    const allCompleted = [
        ...completedFeatures,
        ...features.filter(f => f.status === 'completed')
    ];

    // Group by category (pending only for main list)
    const grouped = {};
    pendingFeatures.forEach(f => {
        if (!grouped[f.category]) grouped[f.category] = [];
        grouped[f.category].push(f);
    });

    // Calculate summary stats
    const summary = {
        total: features.length,
        pending: pendingFeatures.length,
        completed: allCompleted.length,
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
        features: pendingFeatures,  // Return only pending for main list
        completedFeatures: allCompleted,
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
