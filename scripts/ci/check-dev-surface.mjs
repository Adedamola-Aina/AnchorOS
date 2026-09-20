#!/usr/bin/env node
/**
 * UX-GL-07 — proves the developer surfaces are not shippable.
 *
 * Gates are intentions; this is the proof. It scans a real production build and
 * fails if any dev-only marker survived into the shipped assets, so a gate that
 * silently stops working (an env var that never gets set, a refactor that drops
 * the guard) is caught here rather than by a user seeing "STAGING — TEST DATA".
 *
 * Usage: node scripts/ci/check-dev-surface.mjs [distDir]
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = process.argv[2] || 'dist';

/**
 * The markers themselves. Kept in step with src/utils/devSurface.ts — a marker
 * that is added there without being added here would make this gate vacuous, so
 * the module's test asserts the two lists match.
 */
const MARKERS = [
    'DEVELOPMENT ENVIRONMENT',
    'STAGING — TEST DATA',
    'Developer Tools',
    'react-query-devtools',
];

/** Assets worth scanning: the shipped code, not maps or images. */
const SCANNABLE = /\.(js|mjs|css|html)$/;

function collect(dir) {
    const found = [];
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        const stat = statSync(path);
        if (stat.isDirectory()) found.push(...collect(path));
        else if (SCANNABLE.test(entry)) found.push(path);
    }
    return found;
}

let files;
try {
    files = collect(DIST);
} catch {
    console.error(`✗ check-dev-surface: no build found at ${DIST}. Run the production build first.`);
    process.exit(1);
}

if (files.length === 0) {
    console.error(`✗ check-dev-surface: ${DIST} contains no scannable assets — the gate would pass vacuously.`);
    process.exit(1);
}

const violations = [];
for (const file of files) {
    const contents = readFileSync(file, 'utf8');
    for (const marker of MARKERS) {
        if (contents.includes(marker)) violations.push(`${file}: ${marker}`);
    }
}

if (violations.length > 0) {
    console.error('✗ check-dev-surface: developer-only surfaces reached the production bundle:');
    for (const violation of violations) console.error(`   - ${violation}`);
    process.exit(1);
}

console.log(`✓ check-dev-surface: ${files.length} production assets scanned, no developer surfaces present.`);
