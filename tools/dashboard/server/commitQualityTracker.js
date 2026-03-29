// @ts-nocheck
/**
 * commitQualityTracker.js
 *
 * Measures commit hygiene by analysing git log.
 *
 * Metrics reported:
 *   - ticketRate      : % of recent commits carrying a BUG/FEAT/GAP/etc. ID
 *   - conventionalRate: % following conventional commit format (type(scope): msg)
 *   - untrackedCount  : commits with no ID (noise in the kanban)
 *   - window          : number of commits analysed (default 50)
 *
 * Trust score impact: ticketRate < 20% → warning; < 5% → critical.
 * A low ticketRate means velocity data cannot be built from git history.
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');

// All ID prefixes recognised by the dashboard
const TICKET_ID_RE = /\b(BUG|FEAT|REG|GAP|UX|TASK|ARCH|FIN|SEC|PRD|SRE|PLT|DES|ENG|INN|AUTH|PWA|DB|QA|RND|DATA|BRAND|WEB)-\d+\b/i;

// Conventional commits: type(scope): description  OR  type: description
const CONVENTIONAL_RE = /^[\w-]+(\([\w/-]+\))?:\s+\S+/;

/**
 * Get commit quality metrics for the last `window` commits.
 */
function getCommitQuality(window = 50) {
    let lines;
    try {
        const out = execSync(`git log --oneline -${window} --no-merges`, {
            cwd: ROOT,
            encoding: 'utf8',
            timeout: 10000,
        });
        lines = out.trim().split('\n').filter(Boolean);
    } catch {
        return { available: false };
    }

    if (lines.length === 0) return { available: false };

    // Strip the short hash prefix (first 7–8 chars + space)
    const messages = lines.map((l) => l.replace(/^[0-9a-f]{7,8}\s+/, ''));

    const withTicket = messages.filter((m) => TICKET_ID_RE.test(m));
    const withConventional = messages.filter((m) => CONVENTIONAL_RE.test(m));
    const untracked = messages.filter((m) => !TICKET_ID_RE.test(m));

    const total = messages.length;
    const ticketRate = Math.round((withTicket.length / total) * 100);
    const conventionalRate = Math.round((withConventional.length / total) * 100);

    let health;
    if (ticketRate >= 50) health = 'good';
    else if (ticketRate >= 20) health = 'degraded';
    else health = 'critical';

    return {
        available: true,
        window: total,
        withTicket: withTicket.length,
        withConventional: withConventional.length,
        untracked: untracked.length,
        ticketRate,
        conventionalRate,
        health,
        // Surface the untracked messages for display (first 10)
        untrackedSample: untracked.slice(0, 10),
        scannedAt: new Date().toISOString(),
    };
}

module.exports = { getCommitQuality };
