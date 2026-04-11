// @ts-nocheck
// 
/**
 * commandCenterAlerts.js
 * Proactive alert generation for the command center.
 */

const gitData = require('./gitDataProvider');
const { checkEnvParity } = require('./envChecker');
const { getDependencyHealth } = require('./dependencyChecker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getCoverageSummary, getCoverageAlerts } = require('./coverageReader');
const { scanSecureDbCompliance } = require('./secureDbScanner');
const { scanCodeQuality } = require('./codeQualityScanner');
const { getCommitQuality } = require('./commitQualityTracker');
const { getBundleSizeReport } = require('./bundleSizeTracker');
const { getE2EResults } = require('./e2eResultsReader');
const { getFunctionsCoverageSummary, getFunctionsCoverageAlerts } = require('./functionsCoverageReader');

async function getProactiveAlerts() {
    const alerts = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    try {
        // 1. Pending bugs (dev-only, not yet deployed)
        const bugs = await gitData.getBugs();
        const devOnlyBugs = bugs.filter(b => b.status === 'dev');
        if (devOnlyBugs.length > 0) {
            alerts.push({
                type: 'pending_bugs',
                severity: 'warning',
                title: `${devOnlyBugs.length} Bug Fix(es) Pending Deploy`,
                description: devOnlyBugs.slice(0, 3).map(b => b.id).join(', '),
                action: 'Deploy to staging/production',
                source: 'Git History',
                date: today
            });
        }

        // 2. Environment parity drift
        const parity = await checkEnvParity();
        if (parity.summary?.stagingPending > 10) {
            alerts.push({
                type: 'env_drift',
                severity: 'warning',
                title: `${parity.summary.stagingPending} Changes Pending Production Deploy`,
                description: 'Large backlog of staging changes not in production',
                action: 'Schedule production deployment',
                source: 'Environment Parity',
                date: today
            });
        }

        // 3. ARCH-001 file size violations
        const health = await getHealthReport();
        const allFiles = (health.fileHealth?.files || []).filter((f) => {
            const p = String(f?.path || '').replace(/\\/g, '/');
            return !p.includes('/.stryker-tmp/') && !p.endsWith('/.stryker-mutator.log');
        });
        const exceedingFiles = allFiles.filter(f => f.status === 'exceeding');
        const approachingFiles = allFiles.filter(f => f.status === 'warning' || f.status === 'caution');

        if (exceedingFiles.length > 0) {
            alerts.push({
                type: 'arch_violation_critical',
                severity: 'critical',
                title: `${exceedingFiles.length} Files Exceed 200-Line Limit`,
                description: exceedingFiles.slice(0, 6).map(f => `${f.path.split('/').pop()} (${f.lines})`).join(', '),
                details: exceedingFiles.map(f => ({ path: f.path, lines: f.lines, status: f.status })),
                action: 'Refactor immediately to restore ARCH-001 compliance',
                source: 'Code Health',
                date: today
            });
        }

        if (approachingFiles.length > 0) {
            alerts.push({
                type: 'arch_violation',
                severity: 'info',
                title: `${approachingFiles.length} Files Approaching 200-Line Limit`,
                description: approachingFiles.slice(0, 6).map(f => `${f.path.split('/').pop()} (${f.lines})`).join(', '),
                details: approachingFiles.map(f => ({ path: f.path, lines: f.lines, status: f.status })),
                action: 'Plan refactoring to maintain ARCH-001 compliance',
                source: 'Code Health',
                date: today
            });
        }

        // 4. Critical dependency vulnerabilities
        const deps = await getDependencyHealth();
        if (deps.security?.vulnerabilities?.critical > 0) {
            alerts.push({
                type: 'security_vuln',
                severity: 'critical',
                title: `${deps.security.vulnerabilities.critical} Critical Security Vulnerabilities`,
                description: 'Immediate patching required',
                action: 'Run npm audit fix --force',
                source: 'Dependency Health',
                date: today
            });
        }

        // 5. Outdated dependencies
        const outdatedDeps = deps.outdated?.dependencies || [];
        if (outdatedDeps.length > 0) {
            alerts.push({
                type: 'deps_outdated',
                severity: 'warning',
                title: `${outdatedDeps.length} Dependency Updates Available`,
                description: outdatedDeps.slice(0, 5).map(d => `${d.name}: ${d.current} → ${d.latest}`).join(', '),
                details: outdatedDeps.map(d => ({ name: d.name, current: d.current, latest: d.latest, severity: d.severity })),
                action: 'Review and update dependencies',
                source: 'Dependency Health',
                date: today
            });
        }

        // 6. Coverage staleness + threshold alerts
        const coverage = await getCoverageSummary();
        alerts.push(...getCoverageAlerts(coverage, today));

        // 7. secureDb compliance — P0 security rule
        const secureDbScan = scanSecureDbCompliance();
        if (secureDbScan.violationCount > 0) {
            alerts.push({
                type: 'securedb_violation',
                severity: 'critical',
                title: `${secureDbScan.violationCount} Files Bypass secureDb.ts`,
                description: secureDbScan.violations.slice(0, 5).map(v => v.relPath.split('/').pop()).join(', '),
                details: secureDbScan.violations.map(v => ({ path: v.relPath, reason: v.reason })),
                action: 'Migrate direct firebase/firestore calls to src/utils/secureDb.ts',
                source: 'secureDb Compliance',
                date: today,
            });
        }

        // 8. Code quality — console.log regression
        const codeQuality = scanCodeQuality();
        if (codeQuality.consoleLogs.regression || codeQuality.consoleLogs.fileCount > 5) {
            alerts.push({
                type: 'console_log_violation',
                severity: codeQuality.consoleLogs.regression ? 'warning' : 'info',
                title: `${codeQuality.consoleLogs.totalOccurrences} console.log Calls in Production Code`,
                description: codeQuality.consoleLogs.files.slice(0, 4).map(f => f.relPath.split('/').pop()).join(', '),
                action: 'Remove console.log — use structured logging or remove debug output',
                source: 'Code Quality',
                date: today,
            });
        }
        if (codeQuality.anyTypes.regression) {
            alerts.push({
                type: 'any_type_regression',
                severity: 'warning',
                title: `TypeScript \`any\` Count Increased (${codeQuality.anyTypes.totalOccurrences} total)`,
                description: 'TypeScript strictness is degrading — new any types were introduced',
                action: 'Replace any types with proper TypeScript types',
                source: 'Code Quality',
                date: today,
            });
        }

        // 9. Commit quality
        const commitQuality = getCommitQuality(50);
        if (commitQuality.available && commitQuality.health === 'critical') {
            alerts.push({
                type: 'commit_quality_critical',
                severity: 'warning',
                title: `Only ${commitQuality.ticketRate}% of Recent Commits Have Ticket IDs`,
                description: `${commitQuality.untracked}/50 commits lack BUG-XXX/FEAT-XXX IDs — velocity tracking is blind`,
                action: 'Use conventional commits with ticket IDs (e.g. fix(finance): BUG-123 ...)',
                source: 'Commit Quality',
                date: today,
            });
        }

        // 10. Bundle size growth
        const bundleReport = getBundleSizeReport();
        if (bundleReport.available && bundleReport.trend) {
            if (bundleReport.trend.severity === 'critical') {
                alerts.push({
                    type: 'bundle_size_critical',
                    severity: 'critical',
                    title: `Bundle Grew ${bundleReport.trend.changePct}% This Week`,
                    description: `${bundleReport.current.totalKb} KB total JS (was ${bundleReport.trend.baselinKb} KB)`,
                    action: 'Audit recent additions — 75% of users are on mobile',
                    source: 'Bundle Size',
                    date: today,
                });
            } else if (bundleReport.trend.severity === 'warning') {
                alerts.push({
                    type: 'bundle_size_warning',
                    severity: 'warning',
                    title: `Bundle Grew ${bundleReport.trend.changePct}% This Week`,
                    description: `${bundleReport.current.totalKb} KB total JS`,
                    action: 'Review bundle growth — consider lazy-loading large chunks',
                    source: 'Bundle Size',
                    date: today,
                });
            }
        }

        // 11. E2E new failures
        const e2eResults = getE2EResults();
        if (e2eResults.available && e2eResults.hasNewFailures) {
            alerts.push({
                type: 'e2e_new_failures',
                severity: 'critical',
                title: `${e2eResults.summary.newFailures} New E2E Test Failure(s)`,
                description: e2eResults.newFailures.slice(0, 3).map(f => f.humanName).join(', '),
                details: e2eResults.newFailures,
                action: 'Investigate failing E2E tests before next deploy',
                source: 'E2E Tests',
                date: today,
            });
        }

        // 12. Functions coverage
        const funcCoverage = getFunctionsCoverageSummary();
        const funcDate = today;
        alerts.push(...getFunctionsCoverageAlerts(funcCoverage, funcDate));

        const severityOrder = { critical: 0, warning: 1, info: 2 };
        alerts.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

        return alerts;
    } catch (error) {
        console.error('Error getting proactive alerts:', error.message);
        return alerts;
    }
}

module.exports = { getProactiveAlerts };
