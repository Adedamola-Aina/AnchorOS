// @ts-nocheck
/**
 * analysis.js
 *
 * Impact analysis: component dependency map, area inference, and recommended tests.
 */

const { git } = require('./commits');

/**
 * Component dependency map - tracks what depends on what
 */
const COMPONENT_DEPS = {
    'src/context/AnchorContext.tsx': {
        dependents: ['All views', 'Navigation', 'State management'],
        impactLevel: 'critical',
        areas: ['navigation', 'finance', 'tasks', 'settings']
    },
    'src/context/AuthContext.tsx': {
        dependents: ['Login', 'Protected routes', 'User data'],
        impactLevel: 'critical',
        areas: ['auth', 'security']
    },
    'src/context/FinanceContext.tsx': {
        dependents: ['FinanceView', 'TransactionForm', 'AccountDetails'],
        impactLevel: 'high',
        areas: ['finance']
    },
    'src/context/FamilyContext.tsx': {
        dependents: ['FamilySettings', 'Shared accounts', 'Invites'],
        impactLevel: 'high',
        areas: ['family']
    },
    'src/layouts/MainLayout.tsx': {
        dependents: ['All views', 'Navigation', 'Mobile responsiveness'],
        impactLevel: 'high',
        areas: ['ui', 'mobile', 'navigation']
    },
    'src/components/ui/Button.tsx': {
        dependents: ['All UI', '100+ components'],
        impactLevel: 'high',
        areas: ['ui']
    },
    'src/components/shared/Modal.tsx': {
        dependents: ['ConfirmationModal', 'Forms', 'Dialogs'],
        impactLevel: 'medium',
        areas: ['ui', 'mobile']
    },
    'src/index.css': {
        dependents: ['Global styles', 'All components'],
        impactLevel: 'high',
        areas: ['ui', 'styling']
    }
};

/**
 * Infer affected area from file path
 */
function inferAreaFromPath(filePath) {
    if (filePath.includes('/finance/')) return 'finance';
    if (filePath.includes('/settings/')) return 'settings';
    if (filePath.includes('/family/')) return 'family';
    if (filePath.includes('/auth/')) return 'auth';
    if (filePath.includes('/dashboard/')) return 'dashboard';
    if (filePath.includes('/tasks/') || filePath.includes('/commitments/')) return 'tasks';
    if (filePath.includes('/mobile/')) return 'mobile';
    if (filePath.includes('/ui/') || filePath.includes('/shared/')) return 'ui';
    if (filePath.includes('Context')) return 'state';
    return null;
}

/**
 * Generate recommended tests based on affected areas
 */
function generateRecommendedTests(areas) {
    const tests = [];
    if (areas.includes('finance')) tests.push('npm test -- --grep Finance', 'E2E: Transaction CRUD');
    if (areas.includes('auth')) tests.push('npm test -- --grep Auth', 'E2E: Login/Signup flow');
    if (areas.includes('mobile')) tests.push('Run on real iPhone', 'Lighthouse mobile audit');
    if (areas.includes('ui')) tests.push('Visual regression check', 'Dark mode test');
    if (areas.includes('navigation')) tests.push('E2E: Navigation flows');
    if (areas.includes('family')) tests.push('E2E: Family invite flow');
    return tests.length > 0 ? tests : ['npm test', 'Manual smoke test'];
}

/**
 * Get impact analysis for recently changed files
 */
async function getImpactAnalysis() {
    try {
        const status = await git.status();
        const modifiedFiles = [...status.modified, ...status.not_added, ...status.created];

        // Get recent commit files too
        const log = await git.log({ maxCount: 5 });
        const recentCommitFiles = [];
        for (const commit of log.all) {
            try {
                const diff = await git.show([commit.hash, '--name-only', '--format=']);
                const files = diff.split('\n').filter(f => f.trim());
                recentCommitFiles.push(...files);
            } catch (e) {
                // Ignore errors
            }
        }

        const allChangedFiles = [...new Set([...modifiedFiles, ...recentCommitFiles])];

        const impacts = [];
        const affectedAreas = new Set();
        let maxImpactLevel = 'low';

        for (const file of allChangedFiles) {
            const dep = COMPONENT_DEPS[file];
            if (dep) {
                impacts.push({
                    file,
                    ...dep
                });
                dep.areas.forEach(a => affectedAreas.add(a));
                if (dep.impactLevel === 'critical') maxImpactLevel = 'critical';
                else if (dep.impactLevel === 'high' && maxImpactLevel !== 'critical') maxImpactLevel = 'high';
                else if (dep.impactLevel === 'medium' && maxImpactLevel === 'low') maxImpactLevel = 'medium';
            } else {
                // Infer from file path
                const area = inferAreaFromPath(file);
                if (area) affectedAreas.add(area);
            }
        }

        return {
            totalChanges: allChangedFiles.length,
            knownImpacts: impacts,
            affectedAreas: Array.from(affectedAreas),
            overallRisk: maxImpactLevel,
            recommendedTests: generateRecommendedTests(Array.from(affectedAreas)),
            changedFiles: allChangedFiles.slice(0, 20) // Show first 20
        };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    COMPONENT_DEPS,
    inferAreaFromPath,
    generateRecommendedTests,
    getImpactAnalysis
};
