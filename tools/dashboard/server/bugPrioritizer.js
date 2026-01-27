const fs = require('fs');
const path = require('path');

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

/**
 * Suggest priority based on score
 */
function suggestPriority(bug) {
    const analysis = calculatePriorityScore(bug);

    let suggestedPriority = 'P3';
    let confidence = 'low';

    // Determine priority based on score
    if (analysis.score >= 15) {
        suggestedPriority = 'P0';
        confidence = 'high';
    } else if (analysis.score >= 10) {
        suggestedPriority = 'P0';
        confidence = 'medium';
    } else if (analysis.score >= 7) {
        suggestedPriority = 'P1';
        confidence = 'high';
    } else if (analysis.score >= 5) {
        suggestedPriority = 'P1';
        confidence = 'medium';
    } else if (analysis.score >= 3) {
        suggestedPriority = 'P2';
        confidence = 'medium';
    } else {
        suggestedPriority = 'P3';
        confidence = 'low';
    }

    // Extract current priority from bug text
    const currentPriorityMatch = bug.text.match(/\[?(P[0-3])\]?/i);
    const currentPriority = currentPriorityMatch ? currentPriorityMatch[1].toUpperCase() : null;

    return {
        bugId: bug.id || 'unknown',
        bugText: bug.text,
        currentPriority,
        suggestedPriority,
        confidence,
        score: analysis.score,
        reasoning: {
            keywords: analysis.keywordAnalysis.keywords,
            category: analysis.keywordAnalysis.category,
            environment: analysis.environment,
            envMultiplier: analysis.envWeight
        }
    };
}

/**
 * Get priority suggestions for all bugs
 */
function getPrioritySuggestionsForBugs(bugs) {
    if (!bugs || !Array.isArray(bugs)) {
        return [];
    }

    const suggestions = bugs.map(bug => suggestPriority(bug));

    // Sort by score (highest first)
    suggestions.sort((a, b) => b.score - a.score);

    return suggestions;
}

/**
 * Get priority suggestions from KNOWN_ISSUES.md data
 */
function analyzeBugsFromKnownIssues(knownIssuesData) {
    const allBugs = [];

    // Collect all bugs from different priority sections
    const sections = ['critical', 'high', 'medium', 'low'];

    sections.forEach(section => {
        if (knownIssuesData[section] && Array.isArray(knownIssuesData[section])) {
            knownIssuesData[section].forEach(bug => {
                if (bug && bug.text) {
                    allBugs.push({
                        id: bug.id || `${section}-${allBugs.length}`,
                        text: bug.text,
                        currentSection: section
                    });
                }
            });
        }
    });

    // Also check recentlyFixed for learning
    if (knownIssuesData.recentlyFixed && Array.isArray(knownIssuesData.recentlyFixed)) {
        knownIssuesData.recentlyFixed.forEach(bug => {
            if (bug && bug.text) {
                allBugs.push({
                    id: bug.id || `fixed-${allBugs.length}`,
                    text: bug.text,
                    currentSection: 'fixed'
                });
            }
        });
    }

    return getPrioritySuggestionsForBugs(allBugs);
}

/**
 * Get statistics on priority suggestions
 */
function getPrioritySuggestionStats(suggestions) {
    const stats = {
        total: suggestions.length,
        byPriority: {
            P0: 0,
            P1: 0,
            P2: 0,
            P3: 0
        },
        byConfidence: {
            high: 0,
            medium: 0,
            low: 0
        },
        needsReview: 0 // Bugs where suggested != current
    };

    suggestions.forEach(suggestion => {
        stats.byPriority[suggestion.suggestedPriority]++;
        stats.byConfidence[suggestion.confidence]++;

        if (suggestion.currentPriority && suggestion.currentPriority !== suggestion.suggestedPriority) {
            stats.needsReview++;
        }
    });

    return stats;
}

module.exports = {
    suggestPriority,
    getPrioritySuggestionsForBugs,
    analyzeBugsFromKnownIssues,
    getPrioritySuggestionStats,
    calculatePriorityScore
};
