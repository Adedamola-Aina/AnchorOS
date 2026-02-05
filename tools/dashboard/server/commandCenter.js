/**
 * commandCenter.js
 * 
 * Unified Command Center - Single Source of Truth
 * NOW USES GIT-BASED DATA - No more markdown dependencies
 * 
 * Features:
 * - Real-time project health summary
 * - Proactive alerts for issues requiring attention
 * - Environment parity with deployment history
 * - Work tracking with dates
 * - Dependency health
 * - Documentation status
 */

const gitData = require('./gitDataProvider');
const { getEnvironmentStatus, checkEnvParity } = require('./envChecker');
const { getDependencyHealth } = require('./dependencyChecker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getRecentCommits, getDeploymentTimeline } = require('./gitAnalyzer');
const { getVelocityStats } = require('./velocityTracker');

/**
 * Get proactive alerts - things that need attention NOW
 * NOW USES GIT-BASED DATA
 */
async function getProactiveAlerts() {
    const alerts = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    try {
        // 1. Check for dev-only bugs (pending deploy) using git data
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

        // 2. Check environment parity drift
        const parity = await checkEnvParity();
        if (parity.summary) {
            if (parity.summary.stagingPending > 10) {
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
        }

        // 3. Check for files approaching 200-line limit
        const health = await getHealthReport();
        const approachingFiles = health.fileHealth?.files?.filter(f => f.status === 'warning' || f.status === 'caution') || [];
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

        // 4. Check for critical dependency vulnerabilities
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

        // 5. Check for outdated major dependencies
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

        // Sort by severity
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        alerts.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

        return alerts;
    } catch (error) {
        console.error('Error getting proactive alerts:', error.message);
        return alerts;
    }
}

/**
 * Get deployment history using git commit data
 * NOW USES GIT-BASED DATA
 */
async function getDeploymentHistory() {
    try {
        // Use git-based deploy timeline instead of deleted DEPLOYMENT_STATUS.md
        const timeline = await getDeploymentTimeline();

        // Map to history format
        const history = timeline.slice(0, 20).map(item => ({
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown',
            version: item.version || item.message?.match(/v?(\d+\.\d+\.\d+)/)?.[0] || 'Unknown',
            environment: item.environment || 'dev',
            changes: item.message?.substring(0, 100) || ''
        }));

        return {
            lastUpdated: new Date().toISOString(),
            history
        };
    } catch (error) {
        console.error('Error getting deployment history:', error.message);
        return { lastUpdated: null, history: [] };
    }
}

/**
 * Get work summary - what's done, in progress, planned
 * NOW USES GIT-BASED DATA
 */
async function getWorkSummary() {
    try {
        // Use git-based data instead of deleted markdown files
        const kanbanData = await gitData.getKanbanData();

        // Map git data to work summary format
        const doneThisWeek = [];
        const inProgress = [];
        const upcoming = [];
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        // Process deployed items (done)
        for (const item of kanbanData.done || []) {
            const itemDate = item.date ? new Date(item.date) : null;
            if (itemDate && itemDate >= weekAgo) {
                doneThisWeek.push({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    date: item.date
                });
            }
        }

        // Process in-progress items (dev only)
        for (const item of kanbanData.inProgress || []) {
            inProgress.push({
                id: item.id,
                title: item.title,
                type: item.type,
                priority: 'medium',
                status: 'dev'
            });
        }

        // Process staging items
        for (const item of kanbanData.staging || []) {
            inProgress.push({
                id: item.id,
                title: item.title,
                type: item.type,
                priority: 'high',
                status: 'staging'
            });
        }

        // Populate upcoming from roadmap.json planned items
        try {
            const fs = require('fs');
            const path = require('path');
            const roadmapPath = path.join(__dirname, 'roadmap.json');
            const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
            const planned = roadmapData.initiatives
                .filter(i => i.status === 'planned')
                .sort((a, b) => {
                    // P0 first, then P1, etc.
                    const pOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
                    return (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4);
                });
            for (const item of planned.slice(0, 10)) {
                upcoming.push({
                    id: item.id,
                    title: item.title,
                    type: item.team || 'planned',
                    priority: item.priority || 'P2'
                });
            }
        } catch (e) {
            // roadmap.json not available - upcoming stays empty
        }

        return {
            doneThisWeek: doneThisWeek.slice(0, 10),
            inProgress: inProgress.slice(0, 10),
            upcoming: upcoming.slice(0, 5),
            stats: kanbanData.summary
        };
    } catch (error) {
        console.error('Error getting work summary:', error.message);
        return { doneThisWeek: [], inProgress: [], upcoming: [], stats: {} };
    }
}

/**
 * Get full command center data - the unified view
 */
async function getCommandCenterData() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Fetch all data in parallel for speed
    const [
        alerts,
        workSummary,
        environment,
        deployHistory,
        dependencies,
        timeline
    ] = await Promise.all([
        getProactiveAlerts(),
        getWorkSummary(),
        getEnvironmentStatus(),
        getDeploymentHistory(),
        getDependencyHealth().catch(() => ({})),
        getDeploymentTimeline(7).catch(() => [])
    ]);

    // Get velocity stats (sync function)
    let velocity = {};
    try {
        velocity = getVelocityStats() || {};
    } catch (e) {
        velocity = {};
    }

    // Build the unified response
    return {
        generatedAt: now.toISOString(),
        date: today,

        // Proactive alerts - what needs attention NOW
        alerts: {
            count: alerts.length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            warning: alerts.filter(a => a.severity === 'warning').length,
            info: alerts.filter(a => a.severity === 'info').length,
            items: alerts
        },

        // Work tracking - what's happening
        work: {
            completedThisWeek: workSummary.doneThisWeek.length,
            inProgress: workSummary.inProgress.length,
            upcoming: workSummary.upcoming.length,
            velocity: velocity.currentVelocity || 0,
            cycleTime: velocity.averageCycleTime || 0,
            details: workSummary
        },

        // Environment parity - deployment status
        environments: {
            versions: environment.versions,
            parity: {
                devOnly: environment.paritySummary?.devOnly || 0,
                stagingPending: environment.paritySummary?.stagingPending || 0,
                synced: (environment.paritySummary?.devOnly === 0 && environment.paritySummary?.stagingPending === 0)
            },
            health: environment.health,
            lastDeployment: deployHistory.lastUpdated,
            history: deployHistory.history.slice(0, 5)
        },

        // Dependencies - package health
        dependencies: {
            status: dependencies.status || 'unknown',
            outdated: dependencies.outdated?.total || 0,
            vulnerabilities: dependencies.security?.vulnerabilities?.total || 0,
            lastChecked: now.toISOString()
        },

        // Git activity - recent commits by date
        gitActivity: {
            last7Days: timeline.map(day => ({
                date: day.date,
                commits: day.commits?.length || 0,
                features: day.features?.length || 0
            }))
        },

        // Quick links
        links: {
            kanban: '/api/git/kanban',
            bugs: '/api/git/bugs',
            roadmap: '/api/git/roadmap',
            features: '/api/git/features',
            parity: '/api/parity',
            backlog: '/api/git/backlog',
            changelog: '/api/git/changelog',
            timeline: '/api/git/timeline'
        }
    };
}

module.exports = {
    getProactiveAlerts,
    getDeploymentHistory,
    getWorkSummary,
    getCommandCenterData
};
