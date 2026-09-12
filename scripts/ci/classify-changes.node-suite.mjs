'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyFiles } from './classify-changes.js';

test('docs-only is engineering-only and runs no code surface', () => {
    const r = classifyFiles(['docs/ARCHITECTURE.md', 'README.md']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.release, false);
    assert.equal(r.frontend_changed, false);
    assert.equal(r.backend_changed, false);
    assert.equal(r.ci_infra_changed, false);
    assert.equal(r.engineering_code_changed, false);
    assert.equal(r.smoke_required, false);
});

test('CI-only selects only CI infrastructure', () => {
    const r = classifyFiles(['.github/workflows/ci.yml', 'scripts/ci/pr-ci-gate.node-suite.mjs']);
    assert.equal(r.category, 'CI_INFRA');
    assert.equal(r.ci_infra_changed, true);
    assert.equal(r.frontend_changed, false);
    assert.equal(r.backend_changed, false);
    assert.equal(r.engineering_code_changed, false);
    assert.equal(r.smoke_required, false);
    assert.equal(r.release, false);
});

test('engineering script selects engineering checks without product release', () => {
    const r = classifyFiles(['scripts/dev-local.sh']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.engineering_code_changed, true);
    assert.equal(r.frontend_changed, false);
    assert.equal(r.release, false);
});

test('frontend runtime selects frontend checks and bounded smoke', () => {
    const r = classifyFiles(['src/App.tsx']);
    assert.equal(r.frontend_changed, true);
    assert.equal(r.smoke_required, true);
    assert.equal(r.backend_changed, false);
    assert.equal(r.release, true);
});

test('frontend test-only change selects unit validation but no browser smoke', () => {
    const r = classifyFiles(['src/features/finance/FinanceView.test.tsx']);
    assert.equal(r.frontend_changed, true);
    assert.equal(r.smoke_required, false);
});

test('query change adds the targeted query coverage gate', () => {
    const r = classifyFiles(['src/services/fabric/query/parser.ts']);
    assert.equal(r.frontend_changed, true);
    assert.equal(r.query_changed, true);
});

test('Functions-only selects Functions + integration, not rules or browser', () => {
    const r = classifyFiles(['functions/src/reminderSender.ts']);
    assert.equal(r.backend_changed, true);
    assert.equal(r.functions_changed, true);
    assert.equal(r.rules_changed, false);
    assert.equal(r.frontend_changed, false);
    assert.equal(r.smoke_required, false);
});

test('rules-only selects rules + integration, not Functions', () => {
    const r = classifyFiles(['config/firestore.rules']);
    assert.equal(r.backend_changed, true);
    assert.equal(r.rules_changed, true);
    assert.equal(r.functions_changed, false);
    assert.equal(r.frontend_changed, false);
});

test('firebase.json fails safe across both backend deployment surfaces', () => {
    const r = classifyFiles(['firebase.json']);
    assert.equal(r.backend_changed, true);
    assert.equal(r.functions_changed, true);
    assert.equal(r.rules_changed, true);
});

test('mixed frontend + Functions takes the union', () => {
    const r = classifyFiles(['src/App.tsx', 'functions/src/index.ts']);
    assert.equal(r.frontend_changed, true);
    assert.equal(r.functions_changed, true);
    assert.equal(r.backend_changed, true);
    assert.equal(r.smoke_required, true);
});

test('release-smoke test/config changes exercise the bounded smoke without becoming product release', () => {
    const r = classifyFiles(['e2e/release-auth.setup.ts', 'config/playwright.release-smoke.config.ts']);
    assert.equal(r.category, 'ENGINEERING_ONLY');
    assert.equal(r.engineering_code_changed, true);
    assert.equal(r.smoke_required, true);
    assert.equal(r.release, false);
});

test('dependency manifest remains product runtime', () => {
    const r = classifyFiles(['package-lock.json']);
    assert.equal(r.category, 'PRODUCT_RUNTIME');
    assert.equal(r.frontend_changed, true);
    assert.equal(r.smoke_required, true);
    assert.equal(r.release, true);
});

test('unknown and empty sets fail safe to broad runtime validation', () => {
    for (const files of [['mystery/unknown.bin'], []]) {
        const r = classifyFiles(files);
        assert.equal(r.release, true);
        assert.equal(r.frontend_changed, true);
        if (files.length === 0) {
            assert.equal(r.functions_changed, true);
            assert.equal(r.rules_changed, true);
            assert.equal(r.smoke_required, true);
        }
    }
});
