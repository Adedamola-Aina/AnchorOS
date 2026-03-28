// @ts-nocheck
/**
 * commandCenterAlerts.js
 * Proactive alert generation for the command center.
 */

const gitData = require('./gitDataProvider');
const { checkEnvParity } = require('./envChecker');
const { getDependencyHealth } = require('./dependencyChecker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getCoverageSummary, getCoverageAlerts } = require('./coverageReader');

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
        const allFiles = health.fileHealth?.files || [];
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

        const severityOrder = { critical: 0, warning: 1, info: 2 };
        alerts.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

        return alerts;
    } catch (error) {
        console.error('Error getting proactive alerts:', error.message);
        return alerts;
    }
}

module.exports = { getProactiveAlerts };
