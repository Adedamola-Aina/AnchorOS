'use strict';

/**
 * Focused self-tests for the canonical local E2E harness.
 * Run: node --test scripts/ci/e2e-local.node-suite.mjs
 *
 * These cover the pure decision logic that protects the local run:
 * loopback/demo-project guards, origin resolution, fixture naming and the
 * emulator-state → execution-plan mapping. They never start emulators or
 * browsers.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';

import {
    DEFAULT_LOCAL_ORIGIN,
    DEMO_PROJECT_ID,
    HarnessError,
    describePortOccupant,
    requireDemoProjectId,
    requireLoopbackHostEnv,
    resolveLocalOrigin,
    shellQuote,
} from './emulator-harness.mjs';
import {
    buildChildEnv,
    buildInnerCommand,
    buildPlaywrightCommand,
    createRunId,
    planEmulatorExecution,
} from './run-e2e-local.mjs';
import { resolveFinanceFixture, sanitizeRunId } from '../../e2e/fixtures/financeFixture.mjs';

test('resolveLocalOrigin defaults to the dedicated local port', () => {
    const origin = resolveLocalOrigin({});
    assert.equal(origin.origin, DEFAULT_LOCAL_ORIGIN);
    assert.equal(origin.port, '5273');
    assert.equal(origin.host, '127.0.0.1');
});

test('resolveLocalOrigin accepts loopback E2E_BASE_URL overrides', () => {
    assert.equal(resolveLocalOrigin({ E2E_BASE_URL: 'http://localhost:5199' }).origin, 'http://localhost:5199');
    assert.equal(resolveLocalOrigin({ E2E_BASE_URL: 'http://127.0.0.1:5199' }).port, '5199');
});

test('resolveLocalOrigin refuses non-loopback targets', () => {
    for (const target of [
        'https://anchor-os-staging.web.app',
        'https://anchor-os.web.app',
        'http://10.0.0.5:5173',
        'http://anchor.tail2fa2e.ts.net',
    ]) {
        assert.throws(() => resolveLocalOrigin({ E2E_BASE_URL: target }), HarnessError, target);
    }
    assert.throws(() => resolveLocalOrigin({ E2E_BASE_URL: 'not a url' }), HarnessError);
    assert.throws(() => resolveLocalOrigin({ E2E_BASE_URL: 'file:///tmp/index.html' }), HarnessError);
});

test('emulator host env must be loopback', () => {
    assert.equal(requireLoopbackHostEnv({}, 'FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099'), '127.0.0.1:9099');
    assert.equal(requireLoopbackHostEnv({ FOO: 'localhost:9099' }, 'FOO', ''), 'localhost:9099');
    assert.throws(() => requireLoopbackHostEnv({ FOO: '10.1.2.3:9099' }, 'FOO', ''), HarnessError);
    assert.throws(() => requireLoopbackHostEnv({}, 'FOO', ''), HarnessError);
});

test('only the disposable demo project id is accepted', () => {
    assert.equal(requireDemoProjectId({ FIREBASE_PROJECT_ID: DEMO_PROJECT_ID }), DEMO_PROJECT_ID);
    assert.throws(() => requireDemoProjectId({}), HarnessError);
    assert.throws(() => requireDemoProjectId({ FIREBASE_PROJECT_ID: 'anchor-os-staging' }), HarnessError);
    assert.throws(() => requireDemoProjectId({ FIREBASE_PROJECT_ID: 'anchor-os' }), HarnessError);
});

test('run ids are shell/firestore safe and unique', () => {
    const runId = createRunId();
    assert.match(runId, /^e2e-[a-z0-9]+-[0-9a-f]{6}$/);
    assert.notEqual(runId, createRunId());
    assert.match(createRunId(1, 'abcdef'), /^e2e-1-abcdef$/);
});

test('fixture naming is derived from the run id and rejects unsafe ids', () => {
    const fixture = resolveFinanceFixture('abc-123');
    assert.equal(fixture.accountId, 'rename-target-abc-123');
    assert.equal(fixture.accountName, 'E2E Rename abc-123');
    assert.deepEqual(fixture.transactionIds, ['rename-tx-1-abc-123', 'rename-tx-2-abc-123']);
    for (const bad of ['', 'has space', 'slash/here', "quote'here", '-leading', 'a'.repeat(65)]) {
        assert.throws(() => sanitizeRunId(bad), /E2E_RUN_ID/, JSON.stringify(bad));
    }
});

test('shell quoting survives single quotes in forwarded arguments', () => {
    assert.equal(shellQuote("it's"), `'it'\\''s'`);
    assert.equal(
        buildPlaywrightCommand(['e2e/finance.spec.ts', '-g', "rename it's"]),
        `'npx' 'playwright' 'test' '--config' 'config/playwright.config.ts' 'e2e/finance.spec.ts' '-g' 'rename it'\\''s'`,
    );
});

test('the inner command seeds before Playwright and forwards args', () => {
    const inner = buildInnerCommand(['e2e/finance.spec.ts', '-g', 'rename']);
    assert.match(inner, /^node 'scripts\/ci\/seed-e2e-finance\.mjs' && /);
    assert.match(
        inner,
        /'npx' 'playwright' 'test' '--config' 'config\/playwright\.config\.ts' 'e2e\/finance\.spec\.ts' '-g' 'rename'$/,
    );
});

test('emulator state maps onto start / reuse / fail plans', () => {
    assert.equal(planEmulatorExecution({ state: 'free' }).mode, 'start');
    assert.equal(planEmulatorExecution({ state: 'verified', pid: 1, command: '', cwd: '' }).mode, 'reuse');
    for (const state of [
        { state: 'partial', auth: true, firestore: false },
        { state: 'foreign', pid: 2, command: 'firebase emulators:start --project anchor-os', cwd: '/tmp' },
        { state: 'unverified' },
        undefined,
    ]) {
        const plan = planEmulatorExecution(state);
        assert.equal(plan.mode, 'fail', JSON.stringify(state));
        assert.ok(plan.message.length > 20, JSON.stringify(state));
    }
});

test('child env pins the run id and never leaks a cloud E2E_BASE_URL', () => {
    const withoutTarget = buildChildEnv({ PATH: '/usr/bin' }, 'run-1');
    assert.equal(withoutTarget.E2E_RUN_ID, 'run-1');
    assert.equal(withoutTarget.FIREBASE_PROJECT_ID, DEMO_PROJECT_ID);
    assert.equal('E2E_BASE_URL' in withoutTarget, false);

    const withTarget = buildChildEnv({ PATH: '/usr/bin', E2E_BASE_URL: 'http://127.0.0.1:5199' }, 'run-2');
    assert.equal(withTarget.E2E_BASE_URL, 'http://127.0.0.1:5199');
});

test('port occupants are described without assuming privileges', async () => {
    const server = net.createServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    try {
        const description = describePortOccupant(port);
        assert.match(description, new RegExp(String(port)));
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
});
