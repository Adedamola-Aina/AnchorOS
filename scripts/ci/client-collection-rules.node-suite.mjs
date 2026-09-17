/**
 * RA-15 (#169): tests for the static client-write -> Firestore rule gate, plus
 * an assertion that the repository itself currently has no unruled collection.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    collectWrittenCollections,
    collectRuledCollections,
    findUnruledCollections,
    listSourceFiles,
} from './check-client-collection-rules.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('extracts collection names from secureDb call shapes', () => {
    const source = `
        await secureDb.addDocument(uid, 'goals', {});
        await secureDb.queryCollection(uid, 'categories');
        await secureDb.getDocument(uid, ['fabric_monthly_reviews', month]);
        await secureDb.deleteDocument(uid, ['categories', id]);
        await secureDb.setDocument(uid, ['ledger', id], {});
    `;

    assert.deepEqual(
        [...collectWrittenCollections(source)].sort(),
        ['categories', 'fabric_monthly_reviews', 'goals', 'ledger'],
    );
});

test('extracts ruled collection names, including collection-group matchers', () => {
    const rules = `
        match /goals/{goalId} { }
        match /categories/{categoryId} { }
        match /{path=**}/accounts/{accountId} { }
    `;
    const ruled = collectRuledCollections(rules);

    assert.ok(ruled.has('goals'));
    assert.ok(ruled.has('categories'));
    assert.ok(ruled.has('accounts'));
});

test('reports unruled collections and honours reviewed exceptions', () => {
    assert.deepEqual(
        findUnruledCollections({ written: new Set(['goals', 'legacy']), ruled: new Set(['goals']) }),
        ['legacy'],
    );

    assert.deepEqual(
        findUnruledCollections({
            written: new Set(['legacy']),
            ruled: new Set(),
            exceptions: new Set(['legacy']),
        }),
        [],
    );
});

test('the repository has no unruled client-written collection', () => {
    const ruled = collectRuledCollections(readFileSync(path.join(ROOT, 'config/firestore.rules'), 'utf8'));
    const written = new Set();

    for (const file of listSourceFiles(path.join(ROOT, 'src'))) {
        for (const name of collectWrittenCollections(readFileSync(file, 'utf8'))) {
            written.add(name);
        }
    }

    assert.ok(written.size > 0, 'expected the scan to find client-written collections');
    assert.deepEqual(findUnruledCollections({ written, ruled }), []);
});
