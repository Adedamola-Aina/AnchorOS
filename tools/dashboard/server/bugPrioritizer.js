// @ts-nocheck
const { calculatePriorityScore } = require('./bugPrioritizerHelpers');

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
