// @ts-nocheck
// 
/**
 * bundleSizeTracker.js
 *
 * Tracks JavaScript bundle size over time.
 * Reads dist/assets/*.js (excluding .map files), sums sizes, persists history.
 *
 * Mobile users are 75% of Anchor OS traffic — bundle growth has direct UX impact.
 * Alert threshold: >5% growth week-over-week triggers a warning.
 *
 * Called:
 *   - On demand via /api/bundle-size
 *   - Automatically after each build (via npm script hook — see scripts/track-bundle.js)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');
const DIST_ASSETS = path.join(ROOT, 'dist', 'assets');
const HISTORY_PATH = path.join(__dirname, '../data/bundle-history.json');

const ALERT_THRESHOLD_PCT = 5;   // >5% growth vs last snapshot = warning
const CRITICAL_THRESHOLD_PCT = 15; // >15% growth vs last snapshot = critical

/**
 * Read current bundle size from dist/assets/*.js (no .map files).
 * Returns null if dist doesn't exist yet.
 */
function readCurrentBundleSize() {
    if (!fs.existsSync(DIST_ASSETS)) return null;

    let totalBytes = 0;
    const files = [];

    const entries = fs.readdirSync(DIST_ASSETS);
    for (const entry of entries) {
        if (!entry.endsWith('.js') || entry.endsWith('.map')) continue;
        const fullPath = path.join(DIST_ASSETS, entry);
        try {
            const stat = fs.statSync(fullPath);
            totalBytes += stat.size;
            files.push({ name: entry, bytes: stat.size, kb: +(stat.size / 1024).toFixed(1) });
        } catch { /* skip */ }
    }

    if (files.length === 0) return null;

    // Sort largest-first for easy review
    files.sort((a, b) => b.bytes - a.bytes);

    return {
        totalBytes,
        totalKb: +(totalBytes / 1024).toFixed(1),
        fileCount: files.length,
        files,
        measuredAt: new Date().toISOString(),
    };
}

/**
 * Load history from disk.
 */
function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_PATH)) {
            return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
        }
    } catch { /* start fresh */ }
    return [];
}

/**
 * Persist a new entry to history, keeping last 90 snapshots.
 */
function appendHistory(entry) {
    let history = loadHistory();
    const last = history[history.length - 1];
    if (last) {
        const lastTs = new Date(last.measuredAt).getTime();
        const nextTs = new Date(entry.measuredAt).getTime();
        const withinSixHours = Number.isFinite(lastTs) && Number.isFinite(nextTs) && (nextTs - lastTs) < (6 * 60 * 60 * 1000);
        if (withinSixHours && last.totalKb === entry.totalKb && last.fileCount === entry.fileCount) {
            return history;
        }
    }

    history.push(entry);
    if (history.length > 90) history = history.slice(-90);
    try {
        const dir = path.dirname(HISTORY_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
    } catch { /* non-fatal */ }
    return history;
}

/**
 * Find the most recent snapshot from >= 7 days ago for week-over-week comparison.
 */
function getWeekAgoSnapshot(history) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    // Find the newest entry older than 7 days.
    // Do not fallback to same-day/nearby snapshots — that produces false "This Week" alerts.
    for (let i = history.length - 1; i >= 0; i--) {
        if (new Date(history[i].measuredAt).getTime() <= cutoff) {
            return history[i];
        }
    }
    return null;
}

/**
 * Full bundle size report with history and trend.
 * Persists the current snapshot.
 */
function getBundleSizeReport() {
    const current = readCurrentBundleSize();
    if (!current) {
        return {
            available: false,
            reason: 'dist/assets not found — run: npm run build',
        };
    }

    const history = appendHistory({
        totalKb: current.totalKb,
        fileCount: current.fileCount,
        measuredAt: current.measuredAt,
    });

    const baseline = getWeekAgoSnapshot(history);
    let trend = null;

    if (baseline) {
        const changePct = +((current.totalKb - baseline.totalKb) / baseline.totalKb * 100).toFixed(1);
        let severity = 'ok';
        if (changePct > CRITICAL_THRESHOLD_PCT) severity = 'critical';
        else if (changePct > ALERT_THRESHOLD_PCT) severity = 'warning';

        trend = {
            baselinKb: baseline.totalKb,
            baselineDate: baseline.measuredAt,
            changePct,
            severity,
        };
    }

    return {
        available: true,
        current,
        trend,
        history: history.slice(-30), // Last 30 entries for the chart
    };
}

module.exports = { getBundleSizeReport, readCurrentBundleSize };
