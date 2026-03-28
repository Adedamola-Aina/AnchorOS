// @ts-nocheck
/** Changelog generation from tracked items. */

const { getAllTrackedItems } = require('./tracker');

async function getChangelog(limit = 100) {
    const items = await getAllTrackedItems(limit);
    const grouped = {};

    items.forEach(item => {
        const date = item.date ? item.date.split('T')[0] : 'unknown';
        if (!grouped[date]) {
            grouped[date] = { date, security: [], features: [], fixes: [], improvements: [], other: [] };
        }
        const itemId = item.id || null;
        const message = item.title || item.commitMessage || '';
        const entry = { id: itemId, message, hash: item.hash };

        if (itemId && itemId.startsWith('SEC-')) {
            grouped[date].security.push(entry);
        } else if (item.type === 'bug' || item.type === 'regression') {
            grouped[date].fixes.push(entry);
        } else if (['feature', 'enhancement', 'ux', 'gap'].includes(item.type)) {
            grouped[date].features.push(entry);
        } else if (['architecture', 'task'].includes(item.type)) {
            grouped[date].improvements.push(entry);
        } else if (message) {
            grouped[date].other.push(entry);
        }
    });

    const releases = Object.values(grouped)
        .filter(r => r.security.length + r.features.length + r.fixes.length + r.improvements.length > 0)
        .sort((a, b) => b.date.localeCompare(a.date));

    return { source: 'git-automated', generatedAt: new Date().toISOString(), totalReleases: releases.length, releases };
}

module.exports = { getChangelog };
