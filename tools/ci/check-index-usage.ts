#!/usr/bin/env npx tsx
/**
 * DB-001: Firestore Index Usage Cross-Reference
 *
 * Validates that every composite index in firestore.indexes.json
 * has a corresponding query in the codebase (src/ or functions/src/).
 * Detects potentially unused indexes that should be reviewed.
 *
 * Run: npx tsx tools/ci/check-index-usage.ts
 * Or:  npm run check:index-usage
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname ?? __dirname, '../..');
const INDEXES_PATH = path.join(ROOT, 'config/firestore.indexes.json');

interface IndexField {
    fieldPath: string;
    order?: string;
}

interface CompositeIndex {
    collectionGroup: string;
    queryScope: string;
    fields: IndexField[];
}

interface FieldOverride {
    collectionGroup: string;
    fieldPath: string;
    ttl?: boolean;
}

interface IndexFile {
    indexes: CompositeIndex[];
    fieldOverrides: FieldOverride[];
}

interface UsageResult {
    collection: string;
    fields: string[];
    used: boolean;
    locations: string[];
}

function findUsageInCode(collection: string, fields: string[]): string[] {
    const locations: string[] = [];

    // Search for the collection name in source files
    const searchDirs = ['src/', 'functions/src/'];
    for (const dir of searchDirs) {
        const fullDir = path.join(ROOT, dir);
        if (!fs.existsSync(fullDir)) continue;

        try {
            // Search for collection reference + field usage
            const grepResult = execSync(
                `grep -rn "${collection}" "${fullDir}" --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
                { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
            ).trim();

            if (!grepResult) continue;

            for (const line of grepResult.split('\n')) {
                if (!line) continue;
                // Check if the file also references the index fields
                const filePath = line.split(':')[0];
                if (!filePath) continue;

                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const fieldsFound = fields.filter(
                        (f) =>
                            fileContent.includes(`'${f}'`) ||
                            fileContent.includes(`"${f}"`)
                    );

                    if (fieldsFound.length > 0) {
                        const relPath = path.relative(ROOT, filePath);
                        if (!locations.includes(relPath)) {
                            locations.push(relPath);
                        }
                    }
                } catch {
                    // skip unreadable files
                }
            }
        } catch {
            // grep failure is non-fatal
        }
    }

    return locations;
}

function main(): void {
    if (!fs.existsSync(INDEXES_PATH)) {
        process.stderr.write(`❌ Index file not found: ${INDEXES_PATH}\n`);
        process.exit(1);
    }

    const indexFile: IndexFile = JSON.parse(
        fs.readFileSync(INDEXES_PATH, 'utf-8')
    );

    const results: UsageResult[] = [];
    const unused: UsageResult[] = [];

    // Check composite indexes
    for (const idx of indexFile.indexes) {
        const fields = idx.fields.map((f) => f.fieldPath);
        const locations = findUsageInCode(idx.collectionGroup, fields);
        const result: UsageResult = {
            collection: idx.collectionGroup,
            fields,
            used: locations.length > 0,
            locations,
        };
        results.push(result);
        if (!result.used) unused.push(result);
    }

    // Check field overrides
    for (const ov of indexFile.fieldOverrides) {
        if (ov.ttl) continue; // TTL overrides are system-managed
        const locations = findUsageInCode(ov.collectionGroup, [ov.fieldPath]);
        const result: UsageResult = {
            collection: ov.collectionGroup,
            fields: [ov.fieldPath],
            used: locations.length > 0,
            locations,
        };
        results.push(result);
        if (!result.used) unused.push(result);
    }

    // Report
    const total = results.length;
    const usedCount = results.filter((r) => r.used).length;

    process.stdout.write(`\nFirestore Index Usage Report\n`);
    process.stdout.write(`${'='.repeat(40)}\n\n`);

    for (const r of results) {
        const icon = r.used ? '✅' : '⚠️';
        const fieldsStr = r.fields.join(' + ');
        process.stdout.write(`${icon} ${r.collection} [${fieldsStr}]\n`);
        if (r.used) {
            for (const loc of r.locations) {
                process.stdout.write(`   → ${loc}\n`);
            }
        } else {
            process.stdout.write(`   → NO USAGE FOUND — review for removal\n`);
        }
    }

    process.stdout.write(`\n${'='.repeat(40)}\n`);
    process.stdout.write(`Total: ${total} | Used: ${usedCount} | Unused: ${unused.length}\n\n`);

    if (unused.length > 0) {
        process.stderr.write(
            `⚠️  ${unused.length} index(es) have no detected query usage.\n`
        );
        process.stderr.write(
            `   Review these indexes — they may be unused or queries may use dynamic field names.\n`
        );
        // Exit 0 — unused indexes are warnings, not errors
    } else {
        process.stdout.write(`✅ All indexes have detected code-level usage.\n`);
    }
}

main();
