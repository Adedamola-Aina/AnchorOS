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

const fs = require('fs').promises;
const path = require('path');

// Classification patterns
const PATTERNS = {
    BUG: {
        keywords: ['not working', 'broken', 'error', 'issue', 'fails', "doesn't work", "can't", "won't", 'bug', 'clears', 'deletes', 'removes', 'disappears', 'missing'],
        priority: {
            P0: ['data loss', 'security', 'crash', "can't use", 'completely broken', 'critical', 'clears all', 'deletes all'],
            P1: ['major', 'important', 'blocks', 'prevents', 'all users'],
            P2: ['minor', 'sometimes', 'occasionally', 'cosmetic'],
        }
    },
    REGRESSION: {
        keywords: ['used to work', 'stopped working', 'broke after', 'since the update', 'after deploying', 'regression'],
        priority: {
            P0: ['data loss', 'security', 'crash'],
            P1: ['major', 'blocks', 'prevents'],
            P2: ['minor', 'cosmetic'],
        }
    },
    FEATURE: {
        keywords: ['would be nice', 'can we add', 'suggestion', 'feature request', 'could we have', 'i wish', 'add'],
        priority: {
            P1: ['important', 'critical', 'must have'],
            P2: ['nice to have', 'would help'],
            P3: ['eventually', 'someday'],
        }
    },
    GAP: {
        keywords: ['missing', "doesn't have", 'no way to', "can't find", 'should have', 'needs', 'gap'],
        priority: {
            P1: ['critical', 'must have', 'expected'],
            P2: ['should have', 'nice to have'],
        }
    },
    TASK: {
        keywords: ['refactor', 'optimize', 'improve', 'update', 'upgrade', 'clean up', 'task'],
        priority: {
            P1: ['critical', 'urgent', 'blocking'],
            P2: ['should', 'nice to have'],
        }
    }
};

// Component detection patterns
const COMPONENTS = {
    'Finance': ['transaction', 'account', 'balance', 'transfer', 'pay bill', 'finance', 'money'],
    'Auth': ['login', 'signup', 'password', 'mfa', 'authentication', 'auth'],
    'Commitments': ['task', 'commitment', 'streak', 'daily', 'weekly', 'habit'],
    'Dashboard': ['dashboard', 'widget', 'overview', 'home'],
    'Family': ['family', 'spouse', 'sharing', 'invitation', 'member'],
    'Settings': ['settings', 'preferences', 'profile', 'configuration'],
    'UI/UX': ['button', 'modal', 'form', 'layout', 'design', 'ui', 'ux'],
    'Architecture': ['performance', 'bundle', 'optimization', 'refactor', 'architecture'],
};

/**
 * Classify a message into issue type
 */
function classifyMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Check each type
    for (const [type, config] of Object.entries(PATTERNS)) {
        const matchCount = config.keywords.filter(keyword =>
            lowerMessage.includes(keyword.toLowerCase())
        ).length;

        if (matchCount > 0) {
            return type;
        }
    }

    return null;
}

/**
 * Detect priority from message
 */
function detectPriority(message, type) {
    const lowerMessage = message.toLowerCase();
    const priorityConfig = PATTERNS[type]?.priority || {};

    // Check P0 first (highest priority)
    for (const level of ['P0', 'P1', 'P2', 'P3']) {
        const keywords = priorityConfig[level] || [];
        for (const keyword of keywords) {
            if (lowerMessage.includes(keyword.toLowerCase())) {
                return level;
            }
        }
    }

    // Default priorities by type
    const defaults = {
        BUG: 'P1',
        REGRESSION: 'P1',
        FEATURE: 'P2',
        GAP: 'P2',
        TASK: 'P2'
    };

    return defaults[type] || 'P2';
}

/**
 * Detect component from message
 */
function detectComponent(message) {
    const lowerMessage = message.toLowerCase();

    for (const [component, keywords] of Object.entries(COMPONENTS)) {
        const matchCount = keywords.filter(keyword =>
            lowerMessage.includes(keyword.toLowerCase())
        ).length;

        if (matchCount > 0) {
            return component;
        }
    }

    return 'General';
}

/**
 * Extract title from message
 */
function extractTitle(message, type) {
    // Take first sentence or first 80 chars
    const firstSentence = message.split(/[.!?]/)[0];
    let title = firstSentence.length > 80
        ? firstSentence.substring(0, 77) + '...'
        : firstSentence;

    // Clean up
    title = title.trim();

    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    return title;
}

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

/**
 * Extract keywords from message
 */
function extractKeywords(message, type) {
    const lowerMessage = message.toLowerCase();
    const keywords = [];

    const typeKeywords = PATTERNS[type]?.keywords || [];
    for (const keyword of typeKeywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
            keywords.push(keyword);
        }
    }

    return keywords.slice(0, 5); // Max 5 keywords
}

/**
 * Format issue for documentation
 */
function formatIssue(issue) {
    const timestamp = new Date(issue.reportedAt).toISOString().split('T')[0];

    if (issue.type === 'FEATURE') {
        return `
### ${issue.component.toUpperCase()}-XXX: ${issue.title}
- **Category**: ${issue.component}
- **Priority**: ${issue.priority === 'P1' ? 'High' : issue.priority === 'P2' ? 'Medium' : 'Low'}
- **Effort**: TBD
- **Impact**: TBD
- **Description**: ${issue.description}
- **Requested By**: ${issue.reporter} (${timestamp})
`;
    }

    if (issue.type === 'TASK') {
        return `| **${issue.priority}** | ${issue.id}: ${issue.title} | Agent | TBD | ⬜ Not Started |`;
    }

    // BUG, REGRESSION, GAP
    return `
### [${issue.id}] ${issue.title}
- **Reported**: ${timestamp}
- **Reporter**: ${issue.reporter}
- **Component**: ${issue.component}
- **Impact**: ${issue.description}
- **Priority**: ${issue.priority}
- **Status**: Reported
`;
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
