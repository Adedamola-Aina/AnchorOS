'use strict';

/**
 * Focused tests for Cloud Function retirement.
 * Run: node --test scripts/ci/retire-functions.node-suite.mjs
 *
 * Locks in the fix for the failure that blocked the first production deployment: firebase
 * deploy aborts (after releasing rules and uploading hosting) when a deployed function is
 * absent from source, so retirements must be applied explicitly and BEFORE the deploy.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { RETIRED_FUNCTIONS, resolveProject, isAlreadyGone } from './retire-functions.mjs';

const PRODUCTION_WORKFLOW = fs.readFileSync('.github/workflows/production.yml', 'utf8');
const FIREBASERC = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));

test('the RA-01 security retirement is listed and justified', () => {
    const entry = RETIRED_FUNCTIONS.find((fn) => fn.name === 'resetRateLimit');
    assert.ok(entry, 'resetRateLimit must be retired: production still had it deployed');
    assert.equal(entry.region, 'us-central1', 'it was deployed in us-central1');
    assert.match(entry.reason, /RA-01/);
    assert.match(entry.reason, /#147/);
    assert.match(entry.reason, /remediation/i, 'the reason must say that deleting it IS the fix');
});

test('every retired function carries a name, a region and a reason', () => {
    for (const fn of RETIRED_FUNCTIONS) {
        assert.match(fn.name, /^[A-Za-z][A-Za-z0-9_]*$/, `${fn.name} must be a valid function name`);
        assert.match(fn.region, /^[a-z0-9-]+$/, `${fn.name} must state its region`);
        assert.ok(fn.reason.length > 20, `${fn.name} must explain why it is retired`);
    }
});

test('the project id comes from .firebaserc, not a restated literal', () => {
    assert.equal(resolveProject('production'), FIREBASERC.projects.production);
    assert.equal(resolveProject('staging'), FIREBASERC.projects.staging);
    assert.throws(() => resolveProject('nope'), /no project mapped/);
});

test('an absent function is tolerated, a real failure is not', () => {
    assert.equal(isAlreadyGone('Error: Function resetRateLimit does not exist'), true);
    assert.equal(isAlreadyGone('HTTP Error: 404, Function not found'), true);
    assert.equal(isAlreadyGone('Error: HTTP Error: 403, The caller does not have permission'), false);
    assert.equal(isAlreadyGone(''), false);
});

test('the retirement runs before the deploy, with the token, for production', () => {
    const retireAt = PRODUCTION_WORKFLOW.indexOf('Retire functions deleted from source');
    const deployAt = PRODUCTION_WORKFLOW.indexOf('Deploy selected normal surfaces via guarded pipeline');
    assert.ok(retireAt !== -1, 'the retirement step must exist');
    assert.ok(deployAt !== -1, 'the deploy step must exist');
    assert.ok(retireAt < deployAt, 'retirement must run BEFORE the deploy, or the deploy aborts again');

    const step = PRODUCTION_WORKFLOW.slice(retireAt, deployAt);
    assert.match(step, /node scripts\/ci\/retire-functions\.mjs --env production/);
    assert.match(step, /FIREBASE_TOKEN: \$\{\{ secrets\.FIREBASE_TOKEN \}\}/);
});