// @ts-nocheck
/**
 * codeQualityScanner.js
 *
 * Scans src/ and functions/src/ for production code quality violations:
 *   1. console.log — leaks data, pollutes logs (CLAUDE.md hard rule)
 *   2. TypeScript `any` type drift — tracks regression over time
 *
 * Excludes: test files, eslint-disable lines, the logger utility itself.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');
const SRC_DIR = path.join(ROOT, 'src');
const FUNCTIONS_SRC_DIR = path.join(ROOT, 'functions', 'src');

const HISTORY_PATH = path.join(__dirname, '../data/code-quality-history.json');

const TEST_PATH_PATTERNS = [
    /\.test\.[tj]sx?$/,
    /\.spec\.[tj]sx?$/,
    /__tests__\//,
    /\/test\//,
    /src\/test\//,
];

function isTestFile(relPath) {
    return TEST_PATH_PATTERNS.some((re) => re.test(relPath));
}

function collectSourceFiles(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip node_modules and lib output
            if (entry.name === 'node_modules' || entry.name === 'lib') continue;
            collectSourceFiles(full, results);
        } else if (/\.[tj]sx?$/.test(entry.name)) {
            results.push(full);
        }
    }
    return results;
}

/**
 * Scan for console.log violations in production code.
 * Excludes lines with // eslint-disable and debug-only files (seeder, devtools).
 */
function scanConsoleLog() {
    const DEV_ONLY_PATHS = [
        'src/utils/seeder.ts',
        'src/features/settings/components/devtools/',
    ];

    const violations = [];

    const dirs = [SRC_DIR, FUNCTIONS_SRC_DIR];
    for (const dir of dirs) {
        const files = collectSourceFiles(dir);
        for (const fullPath of files) {
            const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
            if (isTestFile(relPath)) continue;

            // Dev-only files are exempt
            if (DEV_ONLY_PATHS.some((p) => relPath.startsWith(p))) continue;

            let content;
            try { content = fs.readFileSync(fullPath, 'utf8'); } catch { continue; }

            const lines = content.split('\n');
            const hits = [];
            lines.forEach((line, i) => {
                if (/console\.log/.test(line) && !/\/\/.*eslint-disable/.test(line)) {
                    hits.push({ line: i + 1, text: line.trim().slice(0, 80) });
                }
            });
            if (hits.length > 0) violations.push({ relPath, occurrences: hits });
        }
    }

    return violations;
}

/**
 * Scan for `: any` type annotations in src/ (not functions — they're less strict).
 * This tracks drift — a rising count is a regression signal.
 */
function scanAnyTypes() {
    const violations = [];

    const files = collectSourceFiles(SRC_DIR);
    for (const fullPath of files) {
        const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
        if (isTestFile(relPath)) continue;
        if (!/\.tsx?$/.test(fullPath)) continue;

        let content;
        try { content = fs.readFileSync(fullPath, 'utf8'); } catch { continue; }

        const lines = content.split('\n');
        const hits = [];
        lines.forEach((line, i) => {
            // Match `: any` but not inside comments or eslint-disable
            if (/:\s*any\b/.test(line) && !/\/\/.*eslint-disable/.test(line) && !/^\s*\/\//.test(line)) {
                hits.push({ line: i + 1, text: line.trim().slice(0, 80) });
            }
        });
        if (hits.length > 0) violations.push({ relPath, occurrences: hits });
    }

    return violations;
}

/**
 * Persist history entry so we can detect drift over time.
 */
function recordHistory(consoleLogCount, anyTypeCount) {
    let history = [];
    try {
        if (fs.existsSync(HISTORY_PATH)) {
            history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
        }
    } catch { /* start fresh */ }

    history.push({ ts: new Date().toISOString(), consoleLog: consoleLogCount, anyType: anyTypeCount });

    // Keep last 90 entries (~3 months of daily scans)
    if (history.length > 90) history = history.slice(-90);

    try {
        const dir = path.dirname(HISTORY_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
    } catch { /* non-fatal */ }

    return history;
}

/**
 * Return true if the most recent history entry shows a regression vs the previous.
 */
function detectRegression(history, field) {
    if (history.length < 2) return false;
    const prev = history[history.length - 2][field];
    const curr = history[history.length - 1][field];
    return curr > prev;
}

/**
 * Full code quality scan.
 */
function scanCodeQuality() {
    const consoleLogs = scanConsoleLog();
    const anyTypes = scanAnyTypes();

    const consoleLogCount = consoleLogs.reduce((n, f) => n + f.occurrences.length, 0);
    const anyTypeCount = anyTypes.reduce((n, f) => n + f.occurrences.length, 0);

    const history = recordHistory(consoleLogCount, anyTypeCount);

    return {
        scannedAt: new Date().toISOString(),
        consoleLogs: {
            fileCount: consoleLogs.length,
            totalOccurrences: consoleLogCount,
            files: consoleLogs,
            regression: detectRegression(history, 'consoleLog'),
        },
        anyTypes: {
            fileCount: anyTypes.length,
            totalOccurrences: anyTypeCount,
            files: anyTypes,
            regression: detectRegression(history, 'anyType'),
        },
    };
}

module.exports = { scanCodeQuality, scanConsoleLog, scanAnyTypes };
