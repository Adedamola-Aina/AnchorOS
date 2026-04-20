/**
 * workIntelligence.js
 *
 * Shared classification logic for dashboard intelligence features.
 */
// @ts-nocheck

const DOMAIN_RULES = [
    { domain: 'finance', patterns: ['src/features/finance/', 'src/services/finance/', 'functions/src/bank', 'functions/src/recurring'] },
    { domain: 'fabric', patterns: ['src/features/fabric/', 'src/services/fabric/', 'src/context/FabricContext', 'functions/src/fabric'] },
    { domain: 'auth', patterns: ['src/features/auth/', 'src/context/auth/', 'functions/src/auth', 'src/api/Mfa'] },
    { domain: 'family', patterns: ['src/features/family/', 'src/features/settings/components/invite', 'functions/src/family'] },
    { domain: 'dashboard', patterns: ['tools/dashboard/'] },
    { domain: 'security', patterns: ['config/firestore.rules', 'src/utils/secureDb', 'functions/src/rateLimit', 'functions/src/appCheck'] },
    { domain: 'mobile', patterns: ['src/components/mobile/', 'capacitor.config.ts'] },
    // Native app domains — separate from Capacitor mobile wrapper
    { domain: 'ios-native', patterns: ['apps/ios-native/', 'apps/ios-native/AnchorOSNative/'] },
    { domain: 'android-native', patterns: ['apps/android-native/', 'android/app/src/main/java/'] },
    { domain: 'infrastructure', patterns: ['config/', '.github/', 'firebase.json', 'package.json', 'tools/'] },
    { domain: 'docs', patterns: ['docs/', 'README.md', 'CONTRIBUTING.md', 'CLAUDE.md'] }
];

function inferDomainsFromFiles(files = []) {
    if (!Array.isArray(files) || files.length === 0) {
        return ['unknown'];
    }

    const domains = new Set();

    for (const file of files) {
        for (const rule of DOMAIN_RULES) {
            if (rule.patterns.some((pattern) => file.startsWith(pattern) || file.includes(pattern))) {
                domains.add(rule.domain);
            }
        }
    }

    if (domains.size === 0) {
        return ['other'];
    }

    return Array.from(domains);
}

function inferWorkKind({ id, type, message = '' }) {
    const upperId = (id || '').toUpperCase();
    const msg = message.toLowerCase();

    if (upperId.startsWith('BUG-') || upperId.startsWith('REG-') || type === 'bug' || type === 'regression') {
        return 'bugfix';
    }
    if (type === 'fix' || msg.startsWith('fix')) {
        return 'bugfix';
    }
    if (upperId.startsWith('SEC-')) {
        return 'security';
    }
    if (upperId.startsWith('ARCH-') || type === 'architecture') {
        return 'architecture';
    }
    if (msg.startsWith('feat') || type === 'feature' || type === 'fin' || type === 'ux' || type === 'enhancement') {
        return 'feature';
    }
    if (msg.startsWith('docs') || type === 'docs') {
        return 'docs';
    }
    if (msg.startsWith('test') || type === 'test') {
        return 'test';
    }
    if (msg.startsWith('chore') || msg.startsWith('refactor')) {
        return 'infra';
    }

    return 'other';
}

function computeConfidence({ id, category, files, domains }) {
    let score = 0.35;

    if (id && /[A-Z]+-\d+/i.test(id)) {
        score += 0.25;
    }

    if (category === 'anchorOS') {
        score += 0.15;
    }

    if (Array.isArray(files) && files.length > 0) {
        score += 0.15;
    }

    if (Array.isArray(domains) && domains[0] !== 'unknown' && domains[0] !== 'other') {
        score += 0.1;
    }

    return Math.min(1, Number(score.toFixed(2)));
}

function classifyWorkItem({ id, type, message, files, category }) {
    const domains = inferDomainsFromFiles(files);
    const workKind = inferWorkKind({ id, type, message });
    const confidence = computeConfidence({ id, category, files, domains });

    return {
        workKind,
        domains,
        confidence,
        evidence: {
            category: category || 'unknown',
            fileCount: files?.length || 0,
            sampleFiles: (files || []).slice(0, 4)
        }
    };
}

function deriveLifecycle(status) {
    if (status === 'deployed') return 'done';
    if (status === 'staging') return 'inProgress';
    if (status === 'dev') return 'todo';
    return 'backlog';
}

module.exports = {
    inferDomainsFromFiles,
    inferWorkKind,
    classifyWorkItem,
    deriveLifecycle
};
