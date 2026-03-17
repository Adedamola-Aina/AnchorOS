// @ts-nocheck

const gitData = require('./gitDataProvider');
const { getEnvironmentStatus } = require('./envChecker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getEventStats } = require('./eventIngestion');
const { getIntegrationStatus } = require('./integrationBridge');

function evaluateTrustChecks(input) {
    const checks = [];
    let score = 100;

    const laneTotal = input.kanban.backlog + input.kanban.todo + input.kanban.inProgress + input.kanban.done;
    const totalConsistent = laneTotal === input.kanban.total;
    checks.push({
        key: 'kanban_consistency',
        pass: totalConsistent,
        impact: totalConsistent ? 0 : 20,
        detail: totalConsistent
            ? 'Kanban lane totals align with summary total'
            : `Lane total (${laneTotal}) differs from summary total (${input.kanban.total})`
    });
    if (!totalConsistent) score -= 20;

    const parityAligned = input.parity.stagingPending === input.kanban.inProgress;
    checks.push({
        key: 'parity_alignment',
        pass: parityAligned,
        impact: parityAligned ? 0 : 10,
        detail: parityAligned
            ? 'Environment parity aligns with in-progress lane'
            : `Parity stagingPending (${input.parity.stagingPending}) differs from kanban inProgress (${input.kanban.inProgress})`
    });
    if (!parityAligned) score -= 10;

    const noArchViolations = input.fileHealth.exceeding === 0;
    const archPenalty = Math.min(30, input.fileHealth.exceeding * 3);
    checks.push({
        key: 'arch_001_compliance',
        pass: noArchViolations,
        impact: noArchViolations ? 0 : archPenalty,
        detail: noArchViolations
            ? 'No files exceed the 200-line ARCH-001 limit'
            : `${input.fileHealth.exceeding} files exceed ARCH-001`
    });
    if (!noArchViolations) score -= archPenalty;

    const ingestionHealthy = input.events.total > 0;
    checks.push({
        key: 'ingestion_freshness',
        pass: ingestionHealthy,
        impact: ingestionHealthy ? 0 : 20,
        detail: ingestionHealthy
            ? `${input.events.total} ingestion events observed in the last ${input.events.hours}h`
            : `No ingestion events observed in the last ${input.events.hours}h`
    });
    if (!ingestionHealthy) score -= 20;

    const integrationCoverage = input.integrations.configured > 0;
    checks.push({
        key: 'integration_readiness',
        pass: integrationCoverage,
        impact: integrationCoverage ? 0 : 5,
        detail: integrationCoverage
            ? `${input.integrations.configured} integrations configured`
            : 'No external integrations configured (Jira/Asana in dry-run mode)'
    });
    if (!integrationCoverage) score -= 5;

    const finalScore = Math.max(0, Math.round(score));
    const status = finalScore >= 85 ? 'high' : finalScore >= 70 ? 'medium' : 'low';

    return {
        score: finalScore,
        status,
        checks,
        anomalies: checks.filter((check) => !check.pass)
    };
}

async function getTrustReport() {
    const [kanban, environment, health, events, integrations] = await Promise.all([
        gitData.getKanbanData(),
        getEnvironmentStatus(),
        getHealthReport(),
        Promise.resolve(getEventStats(24)),
        Promise.resolve(getIntegrationStatus())
    ]);

    const input = {
        kanban: {
            total: kanban.summary?.total || 0,
            backlog: kanban.backlog?.length || 0,
            todo: kanban.todo?.length || 0,
            inProgress: kanban.inProgress?.length || 0,
            done: kanban.done?.length || 0
        },
        parity: {
            stagingPending: environment.paritySummary?.stagingPending || 0
        },
        fileHealth: {
            exceeding: health.fileHealth?.summary?.exceeding || 0
        },
        events: {
            total: events.total || 0,
            hours: events.hours || 24
        },
        integrations: {
            configured: integrations.summary?.configured || 0
        }
    };

    const evaluation = evaluateTrustChecks(input);

    return {
        generatedAt: new Date().toISOString(),
        ...evaluation,
        metrics: {
            kanban: input.kanban,
            parity: input.parity,
            fileHealth: input.fileHealth,
            events: events,
            integrations: integrations.summary
        }
    };
}

module.exports = {
    evaluateTrustChecks,
    getTrustReport
};
