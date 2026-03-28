// @ts-nocheck
/**
 * parserHelpers.js
 *
 * Low-level markdown extraction utilities.
 * Extracted from parsers.js to keep files ≤200 lines (ARCH-001).
 */

function extractCheckboxItems(text) {
    const items = [];
    const regex = /- \[([ x\/])\] (.+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        items.push({
            status: match[1] === 'x' ? 'done' : match[1] === '/' ? 'in-progress' : 'todo',
            text: match[2].trim()
        });
    }
    return items;
}

function extractIssues(text) {
    const issues = [];
    const issueBlocks = text.split(/### \[([A-Z]+-\d+)\]/);
    for (let i = 1; i < issueBlocks.length; i += 2) {
        const id = issueBlocks[i];
        const content = issueBlocks[i + 1] || '';
        const titleMatch = content.match(/^([^\n]+)/);
        issues.push({
            id,
            title: titleMatch ? titleMatch[1].trim() : 'Unknown',
            content: content.trim()
        });
    }
    return issues;
}

function extractStat(text, label) {
    const match = text.match(new RegExp(`${label}[^:]*:\\s*([^\\n]+)`));
    return match ? match[1].trim() : null;
}

function parseTable(tableText) {
    const rows = [];
    const lines = tableText.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (lines.length < 2) return rows;

    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length >= headers.length) {
            const row = {};
            headers.forEach((h, idx) => row[h.toLowerCase().replace(/\s+/g, '_')] = cells[idx]);
            rows.push(row);
        }
    }
    return rows;
}

function extractListItems(text) {
    const items = [];
    const regex = /- \*\*([^*]+)\*\*/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        items.push(match[1].trim());
    }
    return items;
}

module.exports = {
    extractCheckboxItems,
    extractIssues,
    extractStat,
    parseTable,
    extractListItems
};
