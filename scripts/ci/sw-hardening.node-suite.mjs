/**
 * RA-08 (#153): static guards for the service-worker runtime-cache hardening.
 * The worker is not covered by the TS/Vitest suites, so assert the invariants
 * that the F-04/F-05/R-08 cleanup must not regress.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = readFileSync(path.resolve(here, '../../public/sw.js'), 'utf8');

test('sw.js never precaches with cache.addAll (one missing asset must not block activation)', () => {
    assert.ok(!/cache\.addAll\s*\(/.test(source), 'cache.addAll must not be used in sw.js');
});

test('sw.js gates cache writes behind isCacheableResponse', () => {
    assert.ok(/function isCacheableResponse/.test(source), 'isCacheableResponse helper must exist');

    const puts = source.match(/cache\.put\(/g) || [];
    assert.ok(puts.length >= 2, `expected guarded cache.put call sites, found ${puts.length}`);

    const guarded = source.match(/isCacheableResponse\(event\.request, networkResponse\)/g) || [];
    assert.ok(guarded.length >= 2, `expected both cache.put sites to be guarded, found ${guarded.length}`);
});

test('sw.js does not log FCM payloads or the resolved environment in production', () => {
    assert.ok(!/Received background message/.test(source), 'background payload logging must be removed');
    assert.ok(!/Initializing Firebase for environment/.test(source), 'environment logging must be removed');
});
