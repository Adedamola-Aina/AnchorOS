'use strict';

/**
 * Invariant: every Playwright *test* invocation in the workflows must select an
 * explicit config (directly via `--config`, or through a canonical npm script
 * that supplies one).
 *
 * Why (#143): `npx playwright test` without `--config` falls back to Playwright's
 * default discovery, which collects the repository's Vitest suites
 * (`src/**\/*.test.tsx`, `functions/src/**\/*.test.ts`, …). Loading
 * `@vitest/expect` into the Playwright process then throws
 * `TypeError: Cannot redefine property: Symbol($$jest-matchers-object)` at
 * collection time — the whole run lists "0 tests in 0 files" and the scheduled
 * E2E regression fails without ever exercising a browser.
 *
 * This is a static check over the workflow files: it never starts Playwright,
 * emulators or browsers. Run: node --test scripts/ci/playwright-config.node-suite.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WORKFLOWS_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
    '.github',
    'workflows',
);

/** npm scripts that are allowed to invoke Playwright (each passes --config). */
const ALLOWED_SCRIPT_INVOCATIONS = [
    'npm run test:e2e',
    'npm run test:e2e:local',
    'npm run test:release-smoke',
];

function readWorkflows() {
    return fs.readdirSync(WORKFLOWS_DIR)
        .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
        .map((name) => ({
            name,
            text: fs.readFileSync(path.join(WORKFLOWS_DIR, name), 'utf8'),
        }));
}

/**
 * Lines that actually run Playwright tests — `playwright install` is excluded
 * because it installs browsers and does not collect tests.
 */
function findPlaywrightTestLines() {
    const found = [];
    for (const { name, text } of readWorkflows()) {
        text.split('\n').forEach((line, index) => {
            if (!/playwright\s+test\b/.test(line)) return;
            if (/playwright\s+install\b/.test(line)) return;
            found.push({ workflow: name, line: index + 1, text: line.trim() });
        });
    }
    return found;
}

test('the workflows directory is readable and non-empty', () => {
    const workflows = readWorkflows();
    assert.ok(workflows.length > 0, 'expected at least one workflow file');
    assert.ok(workflows.some((w) => w.name === 'ci.yml'), 'expected ci.yml');
});

test('every Playwright test invocation selects an explicit config', () => {
    const invocations = findPlaywrightTestLines();
    assert.ok(invocations.length > 0, 'expected at least one playwright test invocation');

    for (const invocation of invocations) {
        const selectsConfig = invocation.text.includes('--config');
        const viaAllowedScript = ALLOWED_SCRIPT_INVOCATIONS.some((script) => invocation.text.includes(script));
        assert.ok(
            selectsConfig || viaAllowedScript,
            `${invocation.workflow}:${invocation.line} runs Playwright without a config ` +
            `(collects the Vitest suites and dies on Symbol($$jest-matchers-object)): ${invocation.text}`,
        );
    }
});

test('no bare `npx playwright test` remains in any workflow', () => {
    const bare = findPlaywrightTestLines().filter((invocation) =>
        /^(?:-\s*run:\s*)?npx\s+playwright\s+test(?:\s|$)/.test(invocation.text) &&
        !invocation.text.includes('--config'),
    );
    assert.deepEqual(bare, [], 'bare playwright test invocations found');
});

test('the weekly full regression uses the canonical local runner', () => {
    const ci = fs.readFileSync(path.join(WORKFLOWS_DIR, 'ci.yml'), 'utf8');
    const job = ci.slice(ci.indexOf('scheduled-full-regression:'));

    assert.ok(
        job.includes('npm run test:e2e:local -- --shard='),
        'the weekly regression must run through `npm run test:e2e:local` so --config is always applied',
    );
    assert.ok(
        !job.includes('E2E_BASE_URL'),
        'the weekly regression must stay loopback/hermetic — the general suite fail-closes on a cloud origin',
    );
});
