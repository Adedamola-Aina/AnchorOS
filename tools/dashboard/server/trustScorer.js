// @ts-nocheck

const gitData = require('./gitDataProvider');
const { getEnvironmentStatus } = require('./envChecker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getEventStats } = require('./eventIngestion');
const { getCoverageSummary } = require('./coverageReader');
const { scanSecureDbCompliance } = require('./secureDbScanner');
const { getCommitQuality } = require('./commitQualityTracker');
const { getFunctionsCoverageSummary } = require('./functionsCoverageReader');

function evaluateTrustChecks(input) {
    const normalizedInput = {
        kanban: input?.kanban || { total: 0, backlog: 0, todo: 0, inProgress: 0, done: 0 },
        parity: input?.parity || { stagingPending: 0 },
        fileHealth: input?.fileHealth || { exceeding: 0 },
        events: input?.events || { total: 0, hours: 24 },
        coverage: input?.coverage || { available: false, generatedAt: null },
        secureDb: input?.secureDb || { violationCount: 0 },
        commitQuality: input?.commitQuality || { available: false, health: 'unknown', ticketRate: 0 },
        functionsCoverage: input?.functionsCoverage || { available: false, statements: 0 },
    };

    const checks = [];
    let score = 100;

    const laneTotal = normalizedInput.kanban.backlog + normalizedInput.kanban.todo + normalizedInput.kanban.inProgress + normalizedInput.kanban.done;
    const totalConsistent = laneTotal === normalizedInput.kanban.total;
    checks.push({
        key: 'kanban_consistency',
        pass: totalConsistent,
        impact: totalConsistent ? 0 : 20,
        detail: totalConsistent
            ? 'Kanban lane totals align with summary total'
            : `Lane total (${laneTotal}) differs from summary total (${normalizedInput.kanban.total})`
    });
    if (!totalConsistent) score -= 20;

    const parityAligned = normalizedInput.parity.stagingPending === normalizedInput.kanban.inProgress;
    checks.push({
        key: 'parity_alignment',
        pass: parityAligned,
        impact: parityAligned ? 0 : 10,
        detail: parityAligned
            ? 'Environment parity aligns with in-progress lane'
            : `Parity stagingPending (${normalizedInput.parity.stagingPending}) differs from kanban inProgress (${normalizedInput.kanban.inProgress})`
    });
    if (!parityAligned) score -= 10;

    const noArchViolations = normalizedInput.fileHealth.exceeding === 0;
    const archPenalty = Math.min(30, normalizedInput.fileHealth.exceeding * 3);
    checks.push({
        key: 'arch_001_compliance',
        pass: noArchViolations,
        impact: noArchViolations ? 0 : archPenalty,
        detail: noArchViolations
            ? 'No files exceed the 200-line ARCH-001 limit'
            : `${normalizedInput.fileHealth.exceeding} files exceed ARCH-001`
    });
    if (!noArchViolations) score -= archPenalty;

    const ingestionHealthy = normalizedInput.events.total > 0;
    checks.push({
        key: 'ingestion_freshness',
        pass: ingestionHealthy,
        impact: ingestionHealthy ? 0 : 20,
        detail: ingestionHealthy
            ? `${normalizedInput.events.total} ingestion events observed in the last ${normalizedInput.events.hours}h`
            : `No ingestion events observed in the last ${normalizedInput.events.hours}h`
    });
    if (!ingestionHealthy) score -= 20;

    const COVERAGE_FRESHNESS_MS = 24 * 60 * 60 * 1000;
    const coverageFresh = normalizedInput.coverage?.available &&
        normalizedInput.coverage?.generatedAt &&
        (Date.now() - new Date(normalizedInput.coverage.generatedAt).getTime()) < COVERAGE_FRESHNESS_MS;
    checks.push({
        key: 'coverage_freshness',
        pass: coverageFresh,
        impact: coverageFresh ? 0 : 5,
        detail: coverageFresh
            ? 'Coverage data is fresh (< 24h old)'
            : 'Coverage data is stale or unavailable — run: npm run test:coverage'
    });
    if (!coverageFresh) score -= 5;

    // secureDb compliance — P0; each violation -5 points, max -25
    const secureDbClean = normalizedInput.secureDb.violationCount === 0;
    const secureDbPenalty = Math.min(25, normalizedInput.secureDb.violationCount * 5);
    checks.push({
        key: 'securedb_compliance',
        pass: secureDbClean,
        impact: secureDbClean ? 0 : secureDbPenalty,
        detail: secureDbClean
            ? 'All Firestore ops route through secureDb.ts'
            : `${normalizedInput.secureDb.violationCount} files bypass secureDb.ts — security audit risk`,
    });
    if (!secureDbClean) score -= secureDbPenalty;

    // Commit quality — low ticket rate means velocity data is unreliable
    const commitHealthy = !normalizedInput.commitQuality.available || normalizedInput.commitQuality.health !== 'critical';
    const commitPenalty = normalizedInput.commitQuality.available && normalizedInput.commitQuality.health === 'critical' ? 10 : 0;
    checks.push({
        key: 'commit_quality',
        pass: commitHealthy,
        impact: commitPenalty,
        detail: normalizedInput.commitQuality.available
            ? `${normalizedInput.commitQuality.ticketRate}% of recent commits carry ticket IDs (${normalizedInput.commitQuality.health})`
            : 'Commit quality data unavailable',
    });
    if (!commitHealthy) score -= commitPenalty;

    // Functions coverage availability — critical financial code
    const funcCovAvailable = normalizedInput.functionsCoverage.available;
    checks.push({
        key: 'functions_coverage',
        pass: funcCovAvailable,
        impact: funcCovAvailable ? 0 : 10,
        detail: funcCovAvailable
            ? `Functions coverage: ${normalizedInput.functionsCoverage.statements}% statements`
            : 'Functions coverage unavailable — 70+ Cloud Function files untracked',
    });
    if (!funcCovAvailable) score -= 10;

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
    const [kanban, environment, health, events, coverageRaw, secureDbScan, commitQuality, funcCoverage] = await Promise.all([
        gitData.getKanbanData(),
        getEnvironmentStatus(),
        getHealthReport(),
        Promise.resolve(getEventStats(24)),
        getCoverageSummary(),
        Promise.resolve(scanSecureDbCompliance()),
        Promise.resolve(getCommitQuality(50)),
        Promise.resolve(getFunctionsCoverageSummary()),
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
        coverage: {
            available: coverageRaw.available || false,
            generatedAt: coverageRaw.generatedAt || null
        },
        secureDb: {
            violationCount: secureDbScan.violationCount || 0,
        },
        commitQuality: {
            available: commitQuality.available || false,
            health: commitQuality.health || 'critical',
            ticketRate: commitQuality.ticketRate || 0,
        },
        functionsCoverage: {
            available: funcCoverage.available || false,
            statements: funcCoverage.statements || 0,
        },
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
            coverage: input.coverage
        }
    };
}

module.exports = {
    evaluateTrustChecks,
    getTrustReport
};
