'use strict';

/**
 * Focused tests for the deterministic change classifier.
 * Run: node --test scripts/ci/classify-changes.node-suite.mjs
 * (also executed by the CI classify job via `node --test` when CI
 * infrastructure changes; intentionally NOT discoverable by Vitest so the
 * Node-native node:test suite is not bundled by the root Vitest run).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyFiles } from './classify-changes.js';

test('CASE A: agent contract + clinerules changes are engineering-only', () => {
    const r = classifyFiles(['AGENTS.md', '.clinerules/00-core.md']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('CASE B: dashboard + MCP server changes are engineering-only', () => {
    const r = classifyFiles([
        'tools/dashboard/server/index.js',
        'tools/mcp-server/index.js',
    ]);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('CASE C: app runtime change is product runtime', () => {
    const r = classifyFiles(['src/App.tsx']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('CASE D: backend function change is backend runtime', () => {
    const r = classifyFiles(['functions/src/index.ts']);
    assert.equal(r.category, 'BACKEND_RUNTIME');
    assert.equal(r.release, true);
});

test('CASE E: mixed docs + app change is treated as runtime', () => {
    const r = classifyFiles(['docs/foo.md', 'src/App.tsx']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('CASE F: CI-only change validates CI without product release', () => {
    const r = classifyFiles(['.github/workflows/ci-cd.yml']);
    assert.equal(r.category, 'CI_INFRA');
    assert.equal(r.release, false);
});

test('security rules and indexes are backend runtime', () => {
    const r = classifyFiles(['config/firestore.rules', 'config/firestore.indexes.json']);
    assert.equal(r.category, 'BACKEND_RUNTIME');
    assert.equal(r.release, true);
});

test('firebase deployment config is backend runtime', () => {
    const r = classifyFiles(['firebase.json']);
    assert.equal(r.category, 'BACKEND_RUNTIME');
    assert.equal(r.release, true);
});

test('native app runtime code is product runtime', () => {
    const r = classifyFiles(['android/app/src/main/AndroidManifest.xml']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('dependency changes are conservatively product runtime', () => {
    const r = classifyFiles(['package-lock.json']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('CI change mixed with runtime change is classified as runtime', () => {
    const r = classifyFiles(['.github/workflows/ci-cd.yml', 'src/main.tsx']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('CI change mixed with backend change is classified as backend', () => {
    const r = classifyFiles(['scripts/ci/classify-changes.js', 'functions/src/api.ts']);
    assert.equal(r.category, 'BACKEND_RUNTIME');
    assert.equal(r.release, true);
});

test('unknown ambiguous path fails safe as product runtime', () => {
    const r = classifyFiles(['some/unknown/mystery-file.bin']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('engineering-only CI scripts and docs do not trigger release', () => {
    const r = classifyFiles([
        'docs/architecture.md',
        'scripts/maintenance/cleanup.sh',
        'tools/ci/some-tool.js',
    ]);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});


// --- CTO review corrections (PR #110) --------------------------------------

test('root application manifest is product runtime', () => {
    const r = classifyFiles(['package.json']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('engineering-tool manifest is engineering-only (scope, not basename)', () => {
    const r = classifyFiles(['tools/mcp-server/package.json']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('engineering console lockfile is engineering-only', () => {
    const r = classifyFiles(['tools/dashboard/client/package-lock.json']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('functions dependency manifests are backend runtime', () => {
    const r = classifyFiles(['functions/package.json', 'functions/package-lock.json']);
    assert.equal(r.category, 'BACKEND_RUNTIME');
    assert.equal(r.release, true);
});

test('packages workspace manifests stay product runtime', () => {
    const r = classifyFiles(['packages/types/package.json']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});

test('retired .anchor engineering paths are engineering-only', () => {
    const r = classifyFiles(['.anchor/WORKFLOW.md']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('retired .github/.agent paths are engineering-only', () => {
    const r = classifyFiles(['.github/.agent/rules/00-WORKFLOW.md']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('retired .github/agents, instructions, .claude/skills, tools/hooks are engineering-only', () => {
    const r = classifyFiles([
        '.github/agents/engineer.md',
        '.github/instructions/typescript.md',
        '.claude/skills/review/SKILL.md',
        'tools/hooks/pre-commit.sh',
    ]);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
});

test('config/firebase.json is backend runtime', () => {
    const r = classifyFiles(['config/firebase.json']);
    assert.equal(r.category, 'BACKEND_RUNTIME');
    assert.equal(r.release, true);
});

test('empty changed-file set fails safe to product runtime', () => {
    const r = classifyFiles([]);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.release, true);
});
