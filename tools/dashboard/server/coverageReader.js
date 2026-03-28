// @ts-nocheck
/**
 * coverageReader.js
 *
 * Reads coverage-final.json and produces:
 *   - getCoverageSummary()  — parsed metrics + freshness metadata
 *   - getCoverageAlerts()   — staleness + threshold alerts for command center
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_PATH = path.join(__dirname, '../../..', 'coverage', 'coverage-final.json');
const STALE_WARN_MS  = 24 * 60 * 60 * 1000;  // 24 hours
const STALE_CRIT_MS  = 72 * 60 * 60 * 1000;  // 72 hours

const THRESHOLDS = { statements: 80, branches: 70, functions: 90, lines: 80 };

function pct(covered, total) {
    return total === 0 ? 100 : Math.round((covered / total) * 10000) / 100;
}

async function getCoverageSummary() {
    try {
        if (!fs.existsSync(COVERAGE_PATH)) return { available: false };

        const raw  = JSON.parse(fs.readFileSync(COVERAGE_PATH, 'utf8'));
        const stat = fs.statSync(COVERAGE_PATH);

        let totalS = 0, covS = 0, totalB = 0, covB = 0, totalF = 0, covF = 0, totalL = 0, covL = 0;

        for (const file of Object.values(raw)) {
            for (const v of Object.values(file.s || {})) { totalS++; if (v > 0) covS++; }
            for (const arr of Object.values(file.b || {})) {
                for (const v of arr) { totalB++; if (v > 0) covB++; }
            }
            for (const v of Object.values(file.f || {})) { totalF++; if (v > 0) covF++; }
            for (const v of Object.values(file.l || {})) { totalL++; if (v > 0) covL++; }
        }

        const statements = pct(covS, totalS);
        const branches   = pct(covB, totalB);
        const functions  = pct(covF, totalF);
        const lines      = pct(covL, totalL);
        const passing    = statements >= THRESHOLDS.statements &&
                           branches   >= THRESHOLDS.branches &&
                           functions  >= THRESHOLDS.functions &&
                           lines      >= THRESHOLDS.lines;

        return {
            available: true,
            generatedAt: stat.mtime.toISOString(),
            filesAnalyzed: Object.keys(raw).length,
            statements, branches, functions, lines,
            thresholds: THRESHOLDS,
            passing,
            status: passing ? 'passing' : 'below-threshold',
            coverage: { statements: { covered: covS, total: totalS, pct: statements },
                        branches:   { covered: covB, total: totalB, pct: branches },
                        functions:  { covered: covF, total: totalF, pct: functions },
                        lines:      { covered: covL, total: totalL, pct: lines } }
        };
    } catch {
        return { available: false };
    }
}

/**
 * Returns alert objects suitable for inclusion in getProactiveAlerts().
 * Call AFTER getCoverageSummary() resolves.
 */
function getCoverageAlerts(coverage, today) {
    const alerts = [];
    if (!coverage.available) return alerts;

    // Staleness alert
    const ageMs = Date.now() - new Date(coverage.generatedAt).getTime();
    if (ageMs > STALE_CRIT_MS) {
        const h = Math.round(ageMs / 3600000);
        alerts.push({
            type: 'coverage_stale',
            severity: 'critical',
            title: `Coverage Data Critically Stale (${h}h old)`,
            description: `Last run: ${coverage.generatedAt}. CI signal is blind.`,
            action: 'Run: npm run test:coverage',
            source: 'Code Health',
            date: today
        });
    } else if (ageMs > STALE_WARN_MS) {
        const h = Math.round(ageMs / 3600000);
        alerts.push({
            type: 'coverage_stale',
            severity: 'warning',
            title: `Coverage Data Stale (${h}h old)`,
            description: `Coverage report should be refreshed daily.`,
            action: 'Run: npm run test:coverage',
            source: 'Code Health',
            date: today
        });
    }

    // Threshold alert
    if (!coverage.passing) {
        const failing = [];
        if (coverage.functions  < THRESHOLDS.functions)  failing.push(`functions: ${coverage.functions}% < ${THRESHOLDS.functions}%`);
        if (coverage.branches   < THRESHOLDS.branches)   failing.push(`branches: ${coverage.branches}% < ${THRESHOLDS.branches}%`);
        if (coverage.statements < THRESHOLDS.statements) failing.push(`statements: ${coverage.statements}% < ${THRESHOLDS.statements}%`);
        if (coverage.lines      < THRESHOLDS.lines)      failing.push(`lines: ${coverage.lines}% < ${THRESHOLDS.lines}%`);
        alerts.push({
            type: 'coverage_below_threshold',
            severity: 'critical',
            title: 'Test Coverage Below Policy Threshold',
            description: failing.join(', '),
            action: 'Increase test coverage — see GAP-006',
            source: 'Code Health',
            date: today
        });
    }

    return alerts;
}

module.exports = { getCoverageSummary, getCoverageAlerts };
