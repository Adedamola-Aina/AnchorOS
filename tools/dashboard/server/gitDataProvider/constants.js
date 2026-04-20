// @ts-nocheck
/** Shared patterns, types, and pure helpers for gitDataProvider. */

const ID_PATTERNS = {
    bug: /BUG-(\d+)/gi,    regression: /REG-(\d+)/gi,  feature: /FEAT-(\d+)/gi,
    ux: /UX-(\d+)/gi,      task: /TASK-(\d+)/gi,       gap: /GAP-(\d+)/gi,
    arch: /ARCH-(\d+)/gi,  fin: /FIN-(\d+)/gi,         sec: /SEC-(\d+)/gi,
    prd: /PRD-(\d+)/gi,    sre: /SRE-(\d+)/gi,         plt: /PLT-(\d+)/gi,
    des: /DES-(\d+)/gi,    eng: /ENG-(\d+)/gi,         inn: /INN-(\d+)/gi,
    auth: /AUTH-(\d+)/gi,  pwa: /PWA-(\d+)/gi,         db: /DB-(\d+)/gi,
    qa: /QA-(\d+)/gi,      rnd: /RND-(\d+)/gi,         data: /DATA-(\d+)/gi,
    brand: /BRAND-(\d+)/gi, web: /WEB-(\d+)/gi
};

const INITIATIVE_TYPES = [
    'feature', 'enhancement', 'ux', 'task', 'gap', 'architecture',
    'fin', 'sec', 'prd', 'sre', 'plt', 'des', 'eng', 'auth',
    'pwa', 'db', 'qa', 'rnd', 'data', 'brand', 'web'
];

const PRIORITY_ORDER = { P0: 0, P1: 1, P2: 2, P3: 3 };

function isInitiativeType(type) {
    return INITIATIVE_TYPES.includes(type);
}

function detectType(message) {
    const msg = message.toLowerCase();
    if (msg.includes('bug-') || msg.includes('fix(bug')) return 'bug';
    if (msg.includes('reg-')) return 'regression';
    if (msg.includes('gap-')) return 'gap';
    if (msg.includes('ux-')) return 'enhancement';
    if (msg.includes('task-')) return 'task';
    if (msg.includes('arch-')) return 'architecture';
    if (msg.includes('feat-') || msg.startsWith('feat')) return 'feature';
    if (msg.startsWith('fix')) return 'fix';
    if (msg.startsWith('docs')) return 'docs';
    if (msg.startsWith('chore')) return 'chore';
    return 'other';
}

function extractIds(message) {
    const ids = [];
    for (const [type, pattern] of Object.entries(ID_PATTERNS)) {
        const matches = message.matchAll(pattern);
        for (const match of matches) {
            ids.push({ type, id: `${type.toUpperCase()}-${match[1]}`, number: parseInt(match[1]) });
        }
    }
    return ids;
}

function isDashboardCommit(message) {
    const msg = message.toLowerCase();
    return msg.includes('dashboard') || msg.includes('deployment_status') ||
        msg.includes('docs:') || msg.includes('chore:') || msg.includes('refactor:') ||
        msg.includes('project_status') || msg.includes('known_issues') ||
        msg.includes('post-implementation') || msg.includes('.agent/') ||
        msg.includes('tools/dashboard');
}

function sortKanbanLane(items) {
    return [...items].sort((a, b) => {
        const aPriority = PRIORITY_ORDER[a.priority] ?? PRIORITY_ORDER.P2;
        const bPriority = PRIORITY_ORDER[b.priority] ?? PRIORITY_ORDER.P2;
        if (aPriority !== bPriority) return aPriority - bPriority;
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return bDate - aDate;
    });
}

function partitionFeatureBacklog(items) {
    const initiativeItems = items.filter(i => isInitiativeType(i.type));
    const completed = initiativeItems.filter(i => i.status === 'deployed');
    const inProgress = initiativeItems.filter(i => i.status === 'staging');
    const pending = initiativeItems.filter(i => i.status === 'dev');
    return {
        completed, inProgress, pending,
        summary: { total: initiativeItems.length, completed: completed.length, inProgress: inProgress.length, pending: pending.length }
    };
}

module.exports = { ID_PATTERNS, INITIATIVE_TYPES, PRIORITY_ORDER, isInitiativeType, detectType, extractIds, isDashboardCommit, sortKanbanLane, partitionFeatureBacklog };
