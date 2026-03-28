// @ts-nocheck
'use strict';

function normalizeForCompare(value = '') {
    return String(value)
        .toLowerCase()
        .replace(/[""''`'".,!?()[\]{}:;\/\\|*_+=~]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenize(value = '') {
    return new Set(
        normalizeForCompare(value)
            .split(' ')
            .filter((token) => token.length >= 3)
    );
}

function jaccardSimilarity(left, right) {
    if (!left.size || !right.size) return 0;
    let intersection = 0;
    for (const token of left) {
        if (right.has(token)) intersection += 1;
    }
    const union = new Set([...left, ...right]).size;
    return union === 0 ? 0 : intersection / union;
}

function extractWorkIds(text = '') {
    const matches = String(text).toUpperCase().match(/\b[A-Z]{2,6}-\d{3}\b/g);
    return new Set(matches || []);
}

function findPotentialDuplicate(initiatives, title, description) {
    const normalizedTitle = normalizeForCompare(title);
    const normalizedDescription = normalizeForCompare(description);
    const inputTokens = tokenize(title);
    const inputIds = extractWorkIds(`${title} ${description}`);

    let bestMatch = null;

    for (const item of initiatives) {
        const existingTitle = normalizeForCompare(item.title || '');
        const existingDescription = normalizeForCompare(item.description || '');
        const existingIds = extractWorkIds(`${item.id || ''} ${item.title || ''} ${item.description || ''}`);

        if (existingTitle && normalizedTitle === existingTitle) {
            return {
                id: item.id,
                title: item.title,
                reason: 'exact-title-match',
                status: item.status,
                team: item.team,
                priority: item.priority,
            };
        }

        for (const id of inputIds) {
            if (existingIds.has(id)) {
                return {
                    id: item.id,
                    title: item.title,
                    reason: `shared-id:${id}`,
                    status: item.status,
                    team: item.team,
                    priority: item.priority,
                };
            }
        }

        const titleContains = existingTitle && (
            existingTitle.includes(normalizedTitle) || normalizedTitle.includes(existingTitle)
        );

        const semanticScore = jaccardSimilarity(inputTokens, tokenize(item.title || ''));
        const sameDomain = normalizedDescription && existingDescription && (
            existingDescription.includes(normalizedDescription.substring(0, Math.min(40, normalizedDescription.length))) ||
            normalizedDescription.includes(existingDescription.substring(0, Math.min(40, existingDescription.length)))
        );

        if (titleContains || semanticScore >= 0.82 || (semanticScore >= 0.72 && sameDomain)) {
            const candidate = {
                id: item.id,
                title: item.title,
                reason: titleContains ? 'title-overlap' : `semantic-similarity:${semanticScore.toFixed(2)}`,
                score: semanticScore,
                status: item.status,
                team: item.team,
                priority: item.priority,
            };

            if (!bestMatch || candidate.score > (bestMatch.score || 0)) {
                bestMatch = candidate;
            }
        }
    }

    return bestMatch;
}

module.exports = { normalizeForCompare, tokenize, jaccardSimilarity, extractWorkIds, findPotentialDuplicate };
