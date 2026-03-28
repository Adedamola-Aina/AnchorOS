// @ts-nocheck
/**
 * commandCenter.js — Unified Command Center aggregator.
 * Delegates to sub-modules; assembles the single response shape.
 */

const { getProactiveAlerts } = require('./commandCenterAlerts');
const { getWorkSummary, getDeploymentHistory } = require('./commandCenterWork');
const { getEnvironmentStatus } = require('./envChecker');
const { getDependencyHealth } = require('./dependencyChecker');
const { getRecentCommitsFiltered, getDeploymentTimeline } = require('./gitAnalyzer');
const { getVelocityStats } = require('./velocityTracker');
const { getTrustReport } = require('./trustScorer');
const { getIntegrationStatus } = require('./integrationBridge');
const { getEventStats, getRecentEvents } = require('./eventIngestion');
const { getCoverageSummary } = require('./coverageReader');
const { getHealthReport } = require('./fileHealthMonitor');

async function getCommandCenterData() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const [
        alerts, workSummary, environment, deployHistory,
        dependencies, timeline,
        anchorOSCommits, dashboardCommits, docsCommits, infraCommits,
        coverageData, healthReport, trust, integrations, eventStats, recentEvents
    ] = await Promise.all([
        getProactiveAlerts(),
        getWorkSummary(),
        getEnvironmentStatus(),
        getDeploymentHistory(),
        getDependencyHealth().catch(() => ({})),
        getDeploymentTimeline(7).catch(() => []),
        getRecentCommitsFiltered('anchorOS', 20).catch(() => []),
        getRecentCommitsFiltered('dashboard', 20).catch(() => []),
        getRecentCommitsFiltered('docs', 20).catch(() => []),
        getRecentCommitsFiltered('infra', 20).catch(() => []),
        getCoverageSummary(),
        getHealthReport().catch(() => ({ fileHealth: { summary: { exceeding: 0, approaching: 0, healthy: 0 }, files: [] } })),
        getTrustReport().catch(() => ({ score: 0, status: 'unknown', checks: [] })),
        Promise.resolve(getIntegrationStatus()),
        Promise.resolve(getEventStats(24)),
        Promise.resolve(getRecentEvents({ limit: 10 }))
    ]);

    let velocity = {};
    try { velocity = getVelocityStats() || {}; } catch { velocity = {}; }

    return {
        generatedAt: now.toISOString(),
        date: today,

        alerts: {
            count: alerts.length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            warning: alerts.filter(a => a.severity === 'warning').length,
            info: alerts.filter(a => a.severity === 'info').length,
            items: alerts
        },

        work: {
            completedThisWeek: workSummary.doneThisWeek.length,
            inProgress: workSummary.inProgress.length,
            upcoming: workSummary.upcoming.length,
            velocity: velocity.currentVelocity || 0,
            cycleTime: velocity.averageCycleTime || 0,
            details: workSummary
        },

        workByCategory: {
            anchorOS:  { count: anchorOSCommits.length,  recent: anchorOSCommits.slice(0, 5).map(c => ({ hash: c.hash, message: c.message.split('\n')[0], date: c.date })) },
            dashboard: { count: dashboardCommits.length, recent: dashboardCommits.slice(0, 5).map(c => ({ hash: c.hash, message: c.message.split('\n')[0], date: c.date })) },
            docs:      { count: docsCommits.length,      recent: docsCommits.slice(0, 5).map(c => ({ hash: c.hash, message: c.message.split('\n')[0], date: c.date })) },
            infra:     { count: infraCommits.length,     recent: infraCommits.slice(0, 5).map(c => ({ hash: c.hash, message: c.message.split('\n')[0], date: c.date })) }
        },

        coverage: coverageData,

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

        dependencies: {
            status: dependencies.status || 'unknown',
            outdated: dependencies.outdated?.total || 0,
            vulnerabilities: dependencies.security?.vulnerabilities?.total || 0,
            lastChecked: now.toISOString()
        },

        codeHealth: {
            exceeding:    healthReport.fileHealth?.summary?.exceeding  || 0,
            approaching:  healthReport.fileHealth?.summary?.approaching || 0,
            healthy:      healthReport.fileHealth?.summary?.healthy     || 0,
            topRiskFiles: (healthReport.fileHealth?.files || []).slice(0, 6)
        },

        gitActivity: {
            last7Days: timeline.map(day => ({
                date: day.date,
                commits: day.commits?.length || 0,
                features: day.features?.length || 0
            }))
        },

        intelligence: {
            trust: { score: trust.score, status: trust.status, anomalies: trust.anomalies || [] },
            integrations,
            ingestion: { eventsLast24h: eventStats.total, latestEventAt: eventStats.latestEventAt, recentEvents }
        },

        links: {
            kanban: '/api/git/kanban', bugs: '/api/git/bugs', roadmap: '/api/git/roadmap',
            features: '/api/git/features', parity: '/api/parity', backlog: '/api/git/backlog',
            changelog: '/api/git/changelog', timeline: '/api/git/timeline', coverage: '/api/coverage',
            intelligence: { trust: '/api/intelligence/trust', events: '/api/intelligence/events', integrations: '/api/integrations/status' },
            commitsByCategory: { anchorOS: '/api/git/commits/anchorOS', dashboard: '/api/git/commits/dashboard', docs: '/api/git/commits/docs', infra: '/api/git/commits/infra' }
        }
    };
}

module.exports = { getProactiveAlerts, getDeploymentHistory, getWorkSummary, getCommandCenterData };
