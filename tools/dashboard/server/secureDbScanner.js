// @ts-nocheck
/**
 * secureDbScanner.js
 *
 * Scans src/ for files that import directly from 'firebase/firestore'
 * instead of routing through src/utils/secureDb.ts.
 *
 * Legitimate exceptions (excluded from violations):
 *   - src/utils/secureDb.ts itself
 *   - src/config/firebase.ts (SDK initialization)
 *   - src/utils/activityLogger.ts (audit logging primitive)
 *   - *.test.* / *.spec.* / __tests__ / test/ (test infrastructure)
 *   - Files whose only firestore usage is onSnapshot (real-time listener exception)
 *
 * Production rule: ALL writes/reads go through secureDb.ts.
 * Violation here caused a security audit failure (see CLAUDE.md).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');
const SRC_DIR = path.join(ROOT, 'src');

// Files legitimately allowed to import firebase/firestore directly
const LEGITIMATE_EXCEPTIONS = new Set([
    'src/utils/secureDb.ts',
    'src/config/firebase.ts',
    'src/utils/activityLogger.ts',  // audit logging primitive — intentional
    'src/utils/seeder.ts',          // dev-only data seeder — not shipped to production
]);

// Patterns indicating a test/dev-only file
const TEST_PATH_PATTERNS = [
    /\.test\.[tj]sx?$/,
    /\.spec\.[tj]sx?$/,
    /__tests__\//,
    /\/test\//,
    /\/test\.[tj]sx?$/,
    /src\/test\//,
];

function isTestFile(relPath) {
    return TEST_PATH_PATTERNS.some((re) => re.test(relPath));
}

function isLegitimateException(relPath) {
    return LEGITIMATE_EXCEPTIONS.has(relPath);
}

function extractFirestoreImports(content) {
    const importMatches = content.matchAll(
        /import\s+([\s\S]*?)\s+from\s+['"](?:firebase|@firebase)\/firestore['"]/g
    );

    const imports = [];

    for (const match of importMatches) {
        const clause = (match[1] || '').trim();
        const isTypeOnly = /^type\s+/.test(clause);
        const namedMatch = clause.match(/\{([\s\S]*?)\}/);
        const names = namedMatch
            ? namedMatch[1]
                .split(',')
                .map((s) => s.trim().replace(/\s+as\s+\w+/, '').trim())
                .filter(Boolean)
            : [];

        imports.push({
            clause,
            isTypeOnly,
            names,
            isNamespaceOrDefault: !namedMatch,
        });
    }

    return imports;
}

/**
 * Returns true if runtime firestore imports are listener-only.
 * We only allow this exception when `onSnapshot` is present and all runtime
 * identifiers are in the safe listener allow-list.
 */
function isOnlyOnSnapshot(runtimeIdentifiers) {
    if (!runtimeIdentifiers.includes('onSnapshot')) return false;

    const LISTENER_ONLY = new Set([
        'onSnapshot', 'getFirestore', 'collection', 'doc', 'query',
        'where', 'orderBy', 'limit',
    ]);

    return runtimeIdentifiers.every((id) => LISTENER_ONLY.has(id));
}

/**
 * Walk src/ recursively and collect all .ts/.tsx files.
 */
function collectSourceFiles(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectSourceFiles(full, results);
        } else if (/\.[tj]sx?$/.test(entry.name)) {
            results.push(full);
        }
    }
    return results;
}

/**
 * Scan src/ for secureDb compliance violations.
 *
 * Returns:
 *   {
 *     violations: [{ path: string, relPath: string, reason: string }],
 *     exempted: number,   // files excluded for legitimate reasons
 *     scannedAt: string,
 *   }
 */
function scanSecureDbCompliance() {
    const violations = [];
    let exempted = 0;

    let files;
    try {
        files = collectSourceFiles(SRC_DIR);
    } catch {
        return { violations: [], exempted: 0, scannedAt: new Date().toISOString(), error: 'src/ not found' };
    }

    const IMPORT_RE = /from\s+['"](?:firebase|@firebase)\/firestore['"]/;
    const DYNAMIC_IMPORT_RE = /import\s*\(\s*['"](?:firebase|@firebase)\/firestore['"]\s*\)/;

    for (const fullPath of files) {
        const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');

        if (isTestFile(relPath) || isLegitimateException(relPath)) {
            exempted++;
            continue;
        }

        let content;
        try {
            content = fs.readFileSync(fullPath, 'utf8');
        } catch {
            continue;
        }

        const hasStaticImport = IMPORT_RE.test(content);
        const hasDynamicImport = DYNAMIC_IMPORT_RE.test(content);
        if (!hasStaticImport && !hasDynamicImport) continue;

        if (hasDynamicImport) {
            violations.push({
                path: fullPath,
                relPath,
                reason: 'Dynamic firebase/firestore import bypasses secureDb.ts',
            });
            continue;
        }

        const imports = extractFirestoreImports(content);
        const runtimeImports = imports.filter((entry) => !entry.isTypeOnly);
        if (runtimeImports.length === 0) {
            exempted++;
            continue;
        }

        // Namespace/default runtime imports are too broad to guarantee listener-only safety.
        if (runtimeImports.some((entry) => entry.isNamespaceOrDefault)) {
            violations.push({
                path: fullPath,
                relPath,
                reason: 'Broad runtime firebase/firestore import (use secureDb.ts exports instead)',
            });
            continue;
        }

        const runtimeIdentifiers = runtimeImports.flatMap((entry) => entry.names);
        if (isOnlyOnSnapshot(runtimeIdentifiers)) {
            exempted++;
            continue;
        }

        violations.push({
            path: fullPath,
            relPath,
            reason: 'Direct firebase/firestore import (read/write ops should use secureDb.ts)',
        });
    }

    return {
        violations,
        violationCount: violations.length,
        exempted,
        scannedAt: new Date().toISOString(),
    };
}

module.exports = { scanSecureDbCompliance };
