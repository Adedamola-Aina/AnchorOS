// @ts-nocheck

// Impact keyword weights
const IMPACT_KEYWORDS = {
    // Critical (P0) keywords
    critical: {
        keywords: ['crash', 'data loss', 'security', 'vulnerability', 'exploit', 'breach', 'corruption', 'fatal', 'critical'],
        weight: 10
    },
    // High (P1) keywords
    high: {
        keywords: ['regression', 'broken', 'blocker', 'urgent', 'production', 'major', 'severe', 'failure'],
        weight: 7
    },
    // Medium (P2) keywords
    medium: {
        keywords: ['bug', 'issue', 'problem', 'error', 'incorrect', 'wrong', 'unexpected'],
        weight: 4
    },
    // Low (P3) keywords
    low: {
        keywords: ['minor', 'cosmetic', 'typo', 'improvement', 'enhancement', 'nice to have'],
        weight: 2
    }
};

// Environment weights
const ENV_WEIGHTS = {
    production: 2.0,
    staging: 1.5,
    dev: 1.0,
    local: 0.5
};

/**
 * Analyze bug text for impact keywords
 */
function analyzeKeywords(bugText) {
    const text = bugText.toLowerCase();
    let maxWeight = 0;
    let matchedCategory = 'low';
    let matchedKeywords = [];

    for (const [category, data] of Object.entries(IMPACT_KEYWORDS)) {
        for (const keyword of data.keywords) {
            if (text.includes(keyword)) {
                matchedKeywords.push(keyword);
                if (data.weight > maxWeight) {
                    maxWeight = data.weight;
                    matchedCategory = category;
                }
            }
        }
    }

    return {
        weight: maxWeight,
        category: matchedCategory,
        keywords: matchedKeywords
    };
}

/**
 * Detect environment from bug text
 */
function detectEnvironment(bugText) {
    const text = bugText.toLowerCase();

    if (text.includes('production') || text.includes('prod') || text.includes('live')) {
        return 'production';
    }
    if (text.includes('staging') || text.includes('stage')) {
        return 'staging';
    }
    if (text.includes('dev') || text.includes('development')) {
        return 'dev';
    }
    if (text.includes('local')) {
        return 'local';
    }

    // Default to production if not specified (safer assumption)
    return 'production';
}

/**
 * Calculate priority score for a bug
 */
function calculatePriorityScore(bug) {
    const keywordAnalysis = analyzeKeywords(bug.text);
    const environment = detectEnvironment(bug.text);
    const envWeight = ENV_WEIGHTS[environment] || 1.0;

    // Base score from keywords
    let score = keywordAnalysis.weight;

    // Apply environment multiplier
    score *= envWeight;

    // Boost for regression (always critical)
    if (bug.text.toLowerCase().includes('regression')) {
        score *= 1.5;
    }

    // Boost for user-facing issues
    if (bug.text.toLowerCase().includes('user') || bug.text.toLowerCase().includes('customer')) {
        score *= 1.2;
    }

    return {
        score: parseFloat(score.toFixed(2)),
        keywordAnalysis,
        environment,
        envWeight
    };
}

module.exports = {
    IMPACT_KEYWORDS,
    ENV_WEIGHTS,
    analyzeKeywords,
    detectEnvironment,
    calculatePriorityScore
};
