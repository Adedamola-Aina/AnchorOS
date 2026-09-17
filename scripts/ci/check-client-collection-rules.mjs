#!/usr/bin/env node
/**
 * RA-15 (#169): static guard that every collection the client writes through
 * `secureDb` has a matching Firestore rule.
 *
 * Why this exists: the emulator-backed coverage gate
 * (`tools/ci/check-rules-coverage.ts`) cannot detect this class of defect —
 * cloud-firestore-emulator v1.20.2 reports 0 rule expressions, so the gate has
 * always passed vacuously. `users/{uid}/goals` therefore shipped writable
 * without a rule and broke onboarding step 3 (RA-10 / issue #165).
 *
 * Deterministic, no emulator required.
 *
 * Usage: node scripts/ci/check-client-collection-rules.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RULES_PATH = path.join(ROOT, 'config/firestore.rules');
const SRC_DIR = path.join(ROOT, 'src');

/**
 * Client-written collections that are deliberately unruled (reviewed). Keep
 * empty unless a true exception is agreed — the point of the gate is that
 * exceptions are explicit.
 */
export const KNOWN_EXCEPTIONS = new Set();

/** secureDb/task-queue call shapes that name a user subcollection. */
const WRITE_PATTERNS = [
    /secureDb\.addDocument\(\s*[^,]+,\s*'([A-Za-z0-9_]+)'/g,
    /secureDb\.queryCollection(?:<[^>]*>)?\(\s*[^,]+,\s*'([A-Za-z0-9_]+)'/g,
    /secureDb\.getDocument(?:<[^>]*>)?\(\s*[^,]+,\s*\[\s*'([A-Za-z0-9_]+)'/g,
    /secureDb\.setDocument\(\s*[^,]+,\s*\[\s*'([A-Za-z0-9_]+)'/g,
    /secureDb\.updateDocument\(\s*[^,]+,\s*\[\s*'([A-Za-z0-9_]+)'/g,
    /secureDb\.deleteDocument\(\s*[^,]+,\s*\[\s*'([A-Za-z0-9_]+)'/g,
    /getUserDocRef\(\s*[^,]+,\s*'([A-Za-z0-9_]+)'/g,
];

export function listSourceFiles(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
            if (entry === '__tests__') continue;
            out.push(...listSourceFiles(full));
            continue;
        }
        if (!/\.(ts|tsx)$/.test(entry)) continue;
        if (/\.test\.(ts|tsx)$/.test(entry)) continue;
        out.push(full);
    }
    return out;
}

/** Collection names the client passes to secureDb. */
export function collectWrittenCollections(sourceText) {
    const found = new Set();
    for (const pattern of WRITE_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(sourceText)) !== null) {
            found.add(match[1]);
        }
    }
    return found;
}

/** Collection names with a `match /<collection>/...` block in the rules. */
export function collectRuledCollections(rulesText) {
    const found = new Set();
    const patterns = [
        /match\s+\/([A-Za-z0-9_]+)\s*\//g,             // match /goals/{goalId}
        /match\s+\/\{[^}]*\}\/([A-Za-z0-9_]+)\s*\//g,  // match /{path=**}/accounts/{accountId}
    ];
    for (const re of patterns) {
        re.lastIndex = 0;
        let match;
        while ((match = re.exec(rulesText)) !== null) {
            found.add(match[1]);
        }
    }
    return found;
}

export function findUnruledCollections({ written, ruled, exceptions = KNOWN_EXCEPTIONS }) {
    return [...written].filter((name) => !ruled.has(name) && !exceptions.has(name)).sort();
}

function main() {
    const ruled = collectRuledCollections(readFileSync(RULES_PATH, 'utf8'));

    const written = new Set();
    for (const file of listSourceFiles(SRC_DIR)) {
        const rel = path.relative(ROOT, file);
        for (const name of collectWrittenCollections(readFileSync(file, 'utf8'))) {
            written.add(name);
        }
        void rel;
    }

    const missing = findUnruledCollections({ written, ruled });

    if (missing.length > 0) {
        console.error(`❌ RA-15: ${missing.length} client-written collection(s) have no Firestore rule:`);
        for (const name of missing) {
            console.error(`   • ${name}`);
        }
        console.error('\n   Add a match block in config/firestore.rules (owner-scoped, validated)');
        console.error('   or record a reviewed exception in KNOWN_EXCEPTIONS.');
        process.exit(1);
    }

    console.log(`✅ RA-15: all ${written.size} client-written collection(s) have a Firestore rule.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
