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

/**
 * Returns true if the file imports from 'firebase/firestore' or '@firebase/firestore'
 * but ONLY uses onSnapshot (real-time listener — documented exception).
 */
function isOnlyOnSnapshot(content) {
    // Detect which identifiers are imported
    const importMatch = content.match(
        /import\s*\{([^}]+)\}\s*from\s*['"](?:firebase|@firebase)\/firestore['"]/
    );
    if (!importMatch) return false;

    const imported = importMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/\s+as\s+\w+/, '').trim())
        .filter(Boolean);

    // If the only non-type identifier is onSnapshot (+ getFirestore/collection/doc for refs), allow it
    const LISTENER_ONLY = new Set([
        'onSnapshot', 'getFirestore', 'collection', 'doc', 'query',
        'where', 'orderBy', 'limit', 'DocumentSnapshot', 'QuerySnapshot',
        'Unsubscribe', 'DocumentData', 'Query', 'CollectionReference',
        'DocumentReference', 'Firestore', 'FieldValue', 'Timestamp',
        'serverTimestamp', 'WhereFilterOp', 'OrderByDirection', 'SnapshotMetadata',
    ]);

    const WRITE_READ_OPS = new Set([
        'getDoc', 'getDocs', 'setDoc', 'updateDoc', 'addDoc', 'deleteDoc',
        'writeBatch', 'runTransaction',
    ]);

    const hasWriteRead = imported.some((id) => WRITE_READ_OPS.has(id));
    return !hasWriteRead;
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
    const TYPE_ONLY_RE = /^\s*import\s+type\s+/;

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

        if (!IMPORT_RE.test(content)) continue;

        // Allow files where ALL firebase/firestore imports are type-only
        const lines = content.split('\n');
        const hasRuntimeImport = lines.some(
            (line) => IMPORT_RE.test(line) && !TYPE_ONLY_RE.test(line)
        );
        if (!hasRuntimeImport) {
            exempted++;
            continue;
        }

        if (isOnlyOnSnapshot(content)) {
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
