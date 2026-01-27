/**
 * prioritySuggester.js
 * 
 * Analyzes feature backlog and suggests what to build next based on:
 * - Impact vs Effort ratio
 * - Dependencies resolved
 * - Feature age
 * - Priority level
 */

const { getFeatureSuggestions } = require('./docReader');

/**
 * Score a feature for priority suggestion
 */
function scoreFeature(feature) {
    let score = 0;

    // Priority weight (high = 30, medium = 20, low = 10)
    const priorityScores = { high: 30, medium: 20, low: 10 };
    score += priorityScores[feature.priority] || 15;

    // Effort weight (lower effort = higher score)
    const effortScores = {
        'low': 25,
        'medium': 15,
        'high': 5,
        'unknown': 10
    };
    const effortKey = (feature.effort || 'unknown').toLowerCase().split(' ')[0];
    score += effortScores[effortKey] || 10;

    // Impact bonus (keywords that indicate high impact)
    const highImpactKeywords = ['conversion', 'security', 'performance', 'core', 'critical'];
    const impactText = (feature.impact || '').toLowerCase();
    if (highImpactKeywords.some(k => impactText.includes(k))) {
        score += 15;
    }

    // Quick win bonus (low effort + high priority)
    if (feature.priority === 'high' && effortKey === 'low') {
        score += 20;
    }

    return score;
}

/**
 * Get prioritized feature suggestions
 */
async function getPrioritySuggestions(limit = 5) {
    try {
        const data = await getFeatureSuggestions();
        if (!data.parsed || !data.parsed.features) {
            return { suggestions: [], error: 'No features found' };
        }

        const features = data.parsed.features;

        // Score and sort features
        const scored = features.map(f => ({
            ...f,
            score: scoreFeature(f),
            reasoning: generateReasoning(f)
        }));

        scored.sort((a, b) => b.score - a.score);

        // Return top suggestions
        return {
            suggestions: scored.slice(0, limit),
            totalPending: features.length,
            analysis: {
                quickWins: scored.filter(f => f.priority === 'high' && f.effort?.toLowerCase().includes('low')).length,
                highImpact: scored.filter(f => f.score >= 50).length
            }
        };
    } catch (error) {
        return { suggestions: [], error: error.message };
    }
}

/**
 * Generate human-readable reasoning for priority
 */
function generateReasoning(feature) {
    const reasons = [];

    if (feature.priority === 'high') {
        reasons.push('High priority');
    }

    const effort = (feature.effort || '').toLowerCase();
    if (effort.includes('low') || effort.includes('1 day')) {
        reasons.push('Quick win');
    }

    const impact = (feature.impact || '').toLowerCase();
    if (impact.includes('conversion')) {
        reasons.push('Improves conversion');
    }
    if (impact.includes('security')) {
        reasons.push('Security improvement');
    }
    if (impact.includes('performance')) {
        reasons.push('Performance boost');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Standard priority';
}

module.exports = { getPrioritySuggestions };
