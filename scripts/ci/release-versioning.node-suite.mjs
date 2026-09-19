#!/usr/bin/env node
'use strict';

/**
 * Release-versioning invariants.
 *
 * The product promise is that NOBODY bumps a version by hand: every merge to
 * master produces the bump, the tag and the GitHub Release automatically
 * (docs/OPERATIONS.md "Versions & releases"). This suite pins that promise to
 * the workflow files so it cannot silently regress into "remember to run
 * npm run version:staging".
 *
 * The separation of concerns is the other half of the contract:
 *   version.yml      -> pushes, commits, tags, publishes releases. NEVER deploys.
 *   staging.yml      -> deploys an authorized SHA. NEVER bumps (--skip-version-bump).
 *   production.yml   -> deploys an authorized SHA. NEVER pushes/commits/bumps.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const VERSION_WORKFLOW = fs.readFileSync('.github/workflows/version.yml', 'utf8');
const CI_WORKFLOW = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const STAGING_WORKFLOW = fs.readFileSync('.github/workflows/staging.yml', 'utf8');
const PRODUCTION_WORKFLOW = fs.readFileSync('.github/workflows/production.yml', 'utf8');

test('release versioning is automatic on every merge to master', () => {
    assert.match(VERSION_WORKFLOW, /^name: Release Versioning$/m);
    assert.match(VERSION_WORKFLOW, /on:\n {2}push:\n {4}branches: \[master\]/);
    assert.match(VERSION_WORKFLOW, /\n {2}version-bump:\n/);
    // A release must also be cuttable on demand (e.g. the final production cut).
    assert.match(VERSION_WORKFLOW, /workflow_dispatch:/);
});

test('release versioning refuses to run off master and never races itself', () => {
    assert.match(VERSION_WORKFLOW, /refs\/heads\/master/);
    assert.match(VERSION_WORKFLOW, /group: release-versioning/);
    assert.match(VERSION_WORKFLOW, /cancel-in-progress: false/);
});

test('release versioning is idempotent and loop-safe', () => {
    // Loop guard: the bot's own release commit must never trigger another release.
    assert.match(VERSION_WORKFLOW, /grep -qE '\^chore\\\(release\\\):'/);
    // Idempotence: it must key on HEAD being the tagged release commit. Keying
    // on "package.json equals the latest tag" silently stops every later release
    // once the first prerelease has been cut (regression: no rc.1 was produced).
    assert.match(VERSION_WORKFLOW, /TAG_SHA=\$\(git rev-list -n1 "\$LATEST_TAG"/);
    assert.match(VERSION_WORKFLOW, /\[ "\$TAG_SHA" = "\$HEAD_SHA" \]/);
    assert.match(VERSION_WORKFLOW, /idempotent, nothing to do/);
});

test('the bump is derived from Conventional Commits, never hand-typed', () => {
    assert.match(VERSION_WORKFLOW, /npm run version:staging/);
    assert.match(VERSION_WORKFLOW, /npm run version:production/);
    assert.match(VERSION_WORKFLOW, /npm run version:dev/);
    assert.doesNotMatch(VERSION_WORKFLOW, /npm version (major|minor|patch)/);
});

test('release versioning pushes the commit + tag and publishes the GitHub Release', () => {
    assert.match(VERSION_WORKFLOW, /git tag -a "\$TAG" -m "Release \$TAG"/);
    assert.match(VERSION_WORKFLOW, /git push --no-verify origin HEAD:master/);
    assert.match(VERSION_WORKFLOW, /git push --no-verify origin "refs\/tags\/\$TAG"/);
    assert.match(VERSION_WORKFLOW, /gh release create "\$TAG"/);
    assert.match(VERSION_WORKFLOW, /contents: write/);
});

test('the release push never runs the developer hook and never blocks on input', () => {
    // Regression (run 35450947888, 2026-09-19): `.husky/pre-push` runs the FULL test
    // suite for pushes targeting master, so the release bot's own push sat in_progress
    // for 10+ minutes on a version-only commit and the release looked hung rather than
    // failed. The version commit is mechanical and is validated by the ci.yml run that
    // is requested right after, so the hook stays disabled and nothing may wait on a
    // prompt.
    assert.match(VERSION_WORKFLOW, /HUSKY: '0'/);
    assert.match(VERSION_WORKFLOW, /GIT_TERMINAL_PROMPT: '0'/);
    assert.match(VERSION_WORKFLOW, /git commit --no-verify -m "chore\(release\): \$TAG"/);
    // A rejected push must re-apply onto the new tip; a conflicted rebase must stop
    // loudly instead of guessing at a release commit.
    assert.match(VERSION_WORKFLOW, /git rebase --abort/);
    assert.match(VERSION_WORKFLOW, /Rebase onto origin\/master conflicted/);
});

test('the release commit is explicitly validated by CI so it can actually deploy', () => {
    // Without workflow_dispatch on ci.yml this dispatch cannot succeed.
    assert.match(CI_WORKFLOW, /workflow_dispatch:/);
    assert.match(VERSION_WORKFLOW, /gh workflow run ci\.yml --ref master/);
    assert.match(VERSION_WORKFLOW, /actions: write/);
});

test('release versioning never deploys — deployment stays an authorized dispatch', () => {
    assert.doesNotMatch(VERSION_WORKFLOW, /firebase deploy/);
    assert.doesNotMatch(VERSION_WORKFLOW, /deploy-surface-classifier/);
    assert.doesNotMatch(VERSION_WORKFLOW, /deploy_hosting|--surfaces=/);
});

test('the deploy workflows still never version-bump (separation of concerns holds)', () => {
    assert.match(STAGING_WORKFLOW, /--skip-version-bump/);
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /version-bump:/);
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /git push origin master/);
});
