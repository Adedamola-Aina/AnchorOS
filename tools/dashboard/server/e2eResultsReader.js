// @ts-nocheck
/**
 * e2eResultsReader.js
 *
 * Reads Playwright E2E test results from:
 *   - test-results/.last-run.json  — last run status and failed test IDs
 *   - test-results/                — individual result directories (failure artifacts)
 *   - playwright-report/index.html — HTML report (scraped for summary stats)
 *
 * Returns a summary suitable for display and alerting.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');
const LAST_RUN_PATH = path.join(ROOT, 'test-results', '.last-run.json');
const RESULTS_DIR = path.join(ROOT, 'test-results');

/**
 * Parse individual result directories.
 * Each directory name encodes the test name + browser.
 * Presence of test-failed-*.png indicates a failure.
 */
function parseResultDirectories() {
    if (!fs.existsSync(RESULTS_DIR)) return { total: 0, failed: [], passed: 0 };

    const entries = fs.readdirSync(RESULTS_DIR, { withFileTypes: true });
    const dirs = entries.filter(
        (e) => e.isDirectory() && !e.name.startsWith('.')
    );

    const failed = [];
    let passed = 0;

    for (const dir of dirs) {
        const dirPath = path.join(RESULTS_DIR, dir.name);
        const dirContents = fs.readdirSync(dirPath);
        const hasFailureArtifact = dirContents.some(
            (f) => f.startsWith('test-failed') || f === 'error-context.md'
        );

        if (hasFailureArtifact) {
            // Directory name format: {spec}-{TestSuite}-{hash}-{browser}
            // Parse a human-readable name from it
            const humanName = dir.name
                .replace(/-chromium$|-firefox$|-webkit$/, '')
                .replace(/-[a-f0-9]{5,}-/, ' … ')
                .replace(/-/g, ' ');
            failed.push({
                id: dir.name,
                humanName,
                browser: dir.name.endsWith('-chromium') ? 'chromium'
                    : dir.name.endsWith('-firefox') ? 'firefox' : 'webkit',
                artifacts: dirContents,
            });
        } else {
            passed++;
        }
    }

    return { total: dirs.length, failed, passed };
}

function getE2EResults() {
    // 1. Last run status
    let lastRun = null;
    try {
        if (fs.existsSync(LAST_RUN_PATH)) {
            lastRun = JSON.parse(fs.readFileSync(LAST_RUN_PATH, 'utf8'));
        }
    } catch { /* ignore */ }

    // 2. Parse result directories
    const dirResults = parseResultDirectories();

    // 3. Failures (the read-only console reports every failing test;
    // triage decisions stay with the owner, not the dashboard)
    const failures = dirResults.failed;

    // 4. Last run age (to detect stale results)
    let lastRunAge = null;
    let lastRunStat = null;
    try {
        if (fs.existsSync(LAST_RUN_PATH)) {
            lastRunStat = fs.statSync(LAST_RUN_PATH);
            lastRunAge = Math.round((Date.now() - lastRunStat.mtime.getTime()) / (1000 * 60 * 60));
        }
    } catch { /* ignore */ }

    const status = lastRun?.status ?? 'unknown';
    const hasNewFailures = failures.length > 0;

    return {
        available: lastRun !== null || dirResults.total > 0,
        status,
        lastRunAgeHours: lastRunAge,
        summary: {
            total: dirResults.total,
            passed: dirResults.passed,
            failed: failures.length,
        },
        failures,
        hasNewFailures,
        scannedAt: new Date().toISOString(),
    };
}

module.exports = { getE2EResults };
