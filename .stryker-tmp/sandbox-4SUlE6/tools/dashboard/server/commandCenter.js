/**
 * commandCenter.js
 * 
 * Unified Command Center - Single Source of Truth
 * Aggregates all dashboard data into one coherent view like Google's internal tools.
 * 
 * Features:
 * - Real-time project health summary
 * - Proactive alerts for issues requiring attention
 * - Environment parity with deployment history
 * - Work tracking with dates
 * - Dependency health
 * - Documentation status
 */
// @ts-nocheck


const { getEnhancedKanbanBoard } = require('./docReader/kanban');
const { readDoc, getAllDocs } = require('./docReader/index');
const { getEnvironmentStatus, checkEnvParity } = require('./envChecker');
const { getDependencyHealth } = require('./dependencyChecker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getRecentCommits, getDeploymentTimeline } = require('./gitAnalyzer');
const { getVelocityStats } = require('./velocityTracker');

/**
 * Get proactive alerts - things that need attention NOW
 */
async function getProactiveAlerts() {
    const alerts = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    try {
        // 1. Check for critical bugs
        const bugs = await readDoc('KNOWN_ISSUES.md');
        if (bugs.parsed?.critical && bugs.parsed.critical.length > 0) {
            alerts.push({
                type: 'critical_bug',
                severity: 'critical',
                title: `${bugs.parsed.critical.length} Critical Bug(s) Open`,
                description: bugs.parsed.critical.map(b => b.title || b.id).join(', '),
                action: 'Review and prioritize fix',
                source: 'KNOWN_ISSUES.md',
                date: today
            });
        }

        // 2. Check for stale bugs (open > 3 days)
        const staleDays = 3;
        if (bugs.parsed) {
            const allActiveBugs = [
                ...(bugs.parsed.critical || []),
                ...(bugs.parsed.high || []),
                ...(bugs.parsed.low || [])
            ];
            
            const staleBugs = allActiveBugs.filter(bug => {
                if (!bug.content) return false;
                const reportedMatch = bug.content.match(/Reported[:\s]+(\d{4}-\d{2}-\d{2})/i);
                if (reportedMatch) {
                    const reportedDate = new Date(reportedMatch[1]);
                    const daysSince = Math.floor((now - reportedDate) / (1000 * 60 * 60 * 24));
                    return daysSince > staleDays;
                }
                return false;
            });

            if (staleBugs.length > 0) {
                alerts.push({
                    type: 'stale_bugs',
                    severity: 'warning',
                    title: `${staleBugs.length} Bug(s) Open > ${staleDays} Days`,
                    description: staleBugs.map(b => b.id || b.title).join(', '),
                    action: 'Review and update status or escalate',
                    source: 'KNOWN_ISSUES.md',
                    date: today
                });
            }
        }

        // 3. Check environment parity drift
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

        // 4. Check for files approaching 200-line limit
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

        // 5. Check for critical dependency vulnerabilities
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

        // 6. Check for outdated major dependencies
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

        // 7. Check for stale documentation
        const docs = await getAllDocs();
        const staleDocs = docs.filter(doc => {
            if (!doc.lastModified) return false;
            const docDate = new Date(doc.lastModified);
            const daysSince = Math.floor((now - docDate) / (1000 * 60 * 60 * 24));
            return daysSince > 7 && ['ROADMAP.md', 'PROJECT_STATUS.md', 'KNOWN_ISSUES.md'].includes(doc.filename);
        });

        if (staleDocs.length > 0) {
            alerts.push({
                type: 'stale_docs',
                severity: 'info',
                title: `${staleDocs.length} Key Doc(s) Not Updated in 7+ Days`,
                description: staleDocs.map(d => d.filename).join(', '),
                action: 'Review and update documentation',
                source: 'Documentation',
                date: today
            });
        }

    } catch (error) {
        console.error('Error generating alerts:', error.message);
    }

    // Sort by severity: critical > warning > info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Get deployment history with dates from DEPLOYMENT_STATUS.md
 */
async function getDeploymentHistory() {
    try {
        const status = await readDoc('DEPLOYMENT_STATUS.md');
        const content = status.content || '';

        // Parse deployment history section if exists
        const historyMatch = content.match(/## 📜 DEPLOYMENT HISTORY([\s\S]*?)(?=\n---|\n## |$)/);
        const history = [];

        if (historyMatch) {
            // Parse table rows: | 2026-01-28 | v1.5.0-dev | Staging | Features... |
            const rows = historyMatch[1].match(/\| (\d{4}-\d{2}-\d{2}[^|]*) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|/g) || [];
            for (const row of rows) {
                const parts = row.split('|').map(p => p.trim()).filter(Boolean);
                if (parts.length >= 4) {
                    history.push({
                        date: parts[0],
                        version: parts[1],
                        environment: parts[2],
                        changes: parts[3]
                    });
                }
            }
        }

        // Also extract last update date
        const lastUpdateMatch = content.match(/\*\*Last Updated\*\*:\s*(\d{4}-\d{2}-\d{2}[^*\n]*)/);

        return {
            lastUpdated: lastUpdateMatch ? lastUpdateMatch[1].trim() : null,
            history: history.slice(0, 20)
        };
    } catch (error) {
        return { lastUpdated: null, history: [] };
    }
}

/**
 * Get work summary - what's done, in progress, planned
 */
async function getWorkSummary() {
    try {
        const kanban = await getEnhancedKanbanBoard();
        
        // Calculate stats
        const doneThisWeek = [];
        const inProgress = [];
        const upcoming = [];
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        // Process done items
        for (const id of kanban.columns.done || []) {
            const item = kanban.items[id];
            if (item) {
                const itemDate = item.createdDate ? new Date(item.createdDate) : null;
                if (itemDate && itemDate >= weekAgo) {
                    doneThisWeek.push({
                        id: item.id,
                        title: item.title,
                        type: item.type,
                        date: item.createdDate
                    });
                }
            }
        }

        // Process in-progress items
        for (const id of [...(kanban.columns.inProgress || []), ...(kanban.columns.todo || [])]) {
            const item = kanban.items[id];
            if (item && item.status !== 'done' && item.status !== 'Fixed' && item.status !== 'Completed') {
                inProgress.push({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    priority: item.priority,
                    status: item.status
                });
            }
        }

        // Process backlog items
        for (const id of kanban.columns.backlog || []) {
            const item = kanban.items[id];
            if (item) {
                upcoming.push({
                    id: item.id,
                    title: item.title,
                    type: item.type
                });
            }
        }

        return {
            doneThisWeek: doneThisWeek.slice(0, 10),
            inProgress: inProgress.slice(0, 10),
            upcoming: upcoming.slice(0, 5),
            stats: kanban.stats
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
            kanban: '/api/kanban-enhanced',
            bugs: '/api/bugs',
            roadmap: '/api/roadmap',
            features: '/api/features',
            parity: '/api/parity',
            git: '/api/git/timeline'
        }
    };
}

module.exports = {
    getProactiveAlerts,
    getDeploymentHistory,
    getWorkSummary,
    getCommandCenterData
};
