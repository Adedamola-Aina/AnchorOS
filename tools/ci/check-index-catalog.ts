#!/usr/bin/env npx tsx
/**
 * DB-004: Firestore Index Catalog Enforcement
 *
 * Validates that every composite index and field override in
 * config/firestore.indexes.json is documented in docs/FIRESTORE_INDEXES.md.
 *
 * Run: npx tsx tools/ci/check-index-catalog.ts
 * Or:  npm run check:indexes
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname ?? __dirname, '../..');
const INDEXES_PATH = path.join(ROOT, 'config/firestore.indexes.json');
const CATALOG_PATH = path.join(ROOT, 'docs/FIRESTORE_INDEXES.md');

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
  indexes?: unknown[];
}

interface IndexFile {
  indexes: CompositeIndex[];
  fieldOverrides: FieldOverride[];
}

function indexKey(idx: CompositeIndex): string {
  const fields = idx.fields.map(f => f.fieldPath).join('+');
  return `${idx.collectionGroup}:${fields}`;
}

function overrideKey(ov: FieldOverride): string {
  return `${ov.collectionGroup}:${ov.fieldPath}`;
}

function main(): void {
  if (!fs.existsSync(INDEXES_PATH)) {
    console.error(`❌ Index file not found: ${INDEXES_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error(`❌ Catalog doc not found: ${CATALOG_PATH}`);
    console.error('   Create docs/FIRESTORE_INDEXES.md — see DB-004.');
    process.exit(1);
  }

  const indexFile: IndexFile = JSON.parse(fs.readFileSync(INDEXES_PATH, 'utf-8'));
  const catalog = fs.readFileSync(CATALOG_PATH, 'utf-8');

  const missing: string[] = [];

  for (const idx of indexFile.indexes) {
    const fields = idx.fields.map(f => f.fieldPath);
    const allDocumented = fields.every(f => catalog.includes(f));
    const collectionDocumented = catalog.includes(idx.collectionGroup);
    if (!allDocumented || !collectionDocumented) {
      missing.push(`Composite: ${indexKey(idx)}`);
    }
  }

  for (const ov of indexFile.fieldOverrides) {
    const fieldDocumented = catalog.includes(ov.fieldPath);
    const collectionDocumented = catalog.includes(ov.collectionGroup);
    if (!fieldDocumented || !collectionDocumented) {
      missing.push(`Override: ${overrideKey(ov)}`);
    }
  }

  const totalIndexes = indexFile.indexes.length;
  const totalOverrides = indexFile.fieldOverrides.length;
  const total = totalIndexes + totalOverrides;
  const documented = total - missing.length;

  if (missing.length > 0) {
    console.error(`❌ ${missing.length} index(es) not documented in FIRESTORE_INDEXES.md:\n`);
    for (const m of missing) {
      console.error(`   • ${m}`);
    }
    console.error(`\n   Documented: ${documented}/${total}`);
    process.exit(1);
  }

  console.log(`✅ All ${total} indexes documented (${totalIndexes} composite + ${totalOverrides} overrides)`);
}

main();
