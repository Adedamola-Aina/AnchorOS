'use strict';

/**
 * Focused self-tests for the Workhorse v1 harness.
 * Run: node --test scripts/agent/workhorse.node-suite.mjs
 *
 * These tests exercise the project-local Cline hooks with synthetic payloads
 * using the current documented hook names and structure, plus throwaway Git
 * repositories. They are intentionally small — no simulation framework.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..');
const PRETOOL_HOOK = path.join(REPO_ROOT, '.clinerules', 'hooks', 'PreToolUse');
const TASKSTART_HOOK = path.join(REPO_ROOT, '.clinerules', 'hooks', 'TaskStart');
const RECEIPT = path.join(REPO_ROOT, 'scripts', 'agent', 'receipt.sh');

function git(cwd, args) {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function runHookRaw(hookPath, raw, cwd) {
    const out = execFileSync(process.execPath, [hookPath], {
        input: raw,
        cwd,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
    return JSON.parse(out.trim());
}

function runHook(hookPath, payload, cwd) {
    return runHookRaw(hookPath, JSON.stringify(payload), cwd);
}

function makeRepo({ branch = 'chore/test' } = {}) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workhorse-selftest-'));
    git(dir, ['init', '-q', '-b', 'master']);
    git(dir, ['config', 'user.email', 'test@example.com']);
    git(dir, ['config', 'user.name', 'Workhorse Test']);
    fs.writeFileSync(path.join(dir, 'README.md'), 'root\n');
    git(dir, ['add', 'README.md']);
    git(dir, ['commit', '-q', '-m', 'init']);
    if (branch !== 'master') {
        git(dir, ['checkout', '-q', '-b', branch]);
    }
    return dir;
}

function makeBare() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workhorse-bare-'));
    git(dir, ['init', '-q', '--bare']);
    return dir;
}

function makeLinkedWorktree(repo, { recordBase }) {
    const wt = fs.mkdtempSync(path.join(os.tmpdir(), 'workhorse-wt-'));
    fs.rmdirSync(wt);
    git(repo, ['worktree', 'add', '-q', '-b', 'task/linked', wt, 'master']);
    if (recordBase) {
        const base = git(wt, ['rev-parse', 'HEAD']);
        setWorktreeConfig(wt, 'workhorse.baseSha', base);
    }
    return wt;
}

function setWorktreeConfig(repo, key, value) {
    git(repo, ['config', 'extensions.worktreeConfig', 'true']);
    git(repo, ['config', '--worktree', key, value]);
}

function removeRepo(dir) {
    fs.rmSync(dir, { recursive: true, force: true });
}

function toolPayload(workspace, toolName, parameters) {
    return {
        clineVersion: 'test',
        hookName: 'PreToolUse',
        timestamp: new Date().toISOString(),
        taskId: 'task-1',
        workspaceRoots: [workspace],
        userId: 'tester',
        agent_id: 'agent-1',
        parent_agent_id: null,
        preToolUse: { toolName, parameters },
    };
}

function commandResult(workspace, command) {
    return runHook(PRETOOL_HOOK, toolPayload(workspace, 'execute_command', { command, requires_approval: 'false' }), workspace);
}

function assertBlocked(result, label) {
    assert.equal(result.cancel, true, `expected BLOCK for: ${label}`);
    assert.ok(typeof result.errorMessage === 'string' && result.errorMessage.length > 0, `expected reason for: ${label}`);
}

function assertAllowed(result, label) {
    assert.notEqual(result.cancel, true, `expected ALLOW for: ${label} (got: ${result.errorMessage || ''})`);
}

// ---------------------------------------------------------------------------
// PreToolUse — BLOCK
// ---------------------------------------------------------------------------

const BLOCKED_COMMANDS = [
    'git add .',
    'git add ./',
    'git add -A',
    'git add --all',
    'git add -u',
    'git add --update',
    'git push --force',
    'git push -f origin chore/test',
    'git push --force-with-lease',
    'git reset --hard HEAD~1',
    'git clean -fd',
    'git clean -xdf',
    'git checkout master',
    'git switch master',
    'git switch master && git commit -m x',
    'git checkout -b master',
    '/usr/bin/git push --force',
    'git -C /tmp/other-worktree commit -m x',
    'cd /tmp/other-worktree && git commit -m x',
    'cd .. && git reset --hard',
    'firebase deploy',
    'firebase deploy --only hosting',
    'npm run deploy:staging',
    'npm run deploy:production',
    './scripts/DEPLOY_PIPELINE.sh --env=staging',
    'bash scripts/DEPLOY_PIPELINE.sh --env=production',
    'git push origin master',
    'git push origin HEAD:master',
    'git push origin feature:refs/heads/master',
    'gh pr merge 42 --merge',
    'npm run runMigration',
    'firebase firestore:delete --all-collections',
];

for (const command of BLOCKED_COMMANDS) {
    test(`PreToolUse blocks: ${command}`, () => {
        const repo = makeRepo();
        try {
            assertBlocked(commandResult(repo, command), command);
        } finally {
            removeRepo(repo);
        }
    });
}

// ---------------------------------------------------------------------------
// PreToolUse — forbidden paths
// ---------------------------------------------------------------------------

test('PreToolUse blocks reading .env via read_file', () => {
    const repo = makeRepo();
    try {
        assertBlocked(runHook(PRETOOL_HOOK, toolPayload(repo, 'read_file', { path: '.env' }), repo), 'read_file .env');
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks reading .env.production via execute_command', () => {
    const repo = makeRepo();
    try {
        assertBlocked(commandResult(repo, 'cat .env.production'), 'cat .env.production');
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks reading e2e/.auth via execute_command', () => {
    const repo = makeRepo();
    try {
        assertBlocked(commandResult(repo, 'cat e2e/.auth/user.json'), 'cat e2e/.auth/user.json');
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks reading e2e/.auth via read_file', () => {
    const repo = makeRepo();
    try {
        assertBlocked(
            runHook(PRETOOL_HOOK, toolPayload(repo, 'read_file', { path: 'e2e/.auth/user.json' }), repo),
            'read_file e2e/.auth/user.json'
        );
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks writing e2e/.auth via write_to_file', () => {
    const repo = makeRepo();
    try {
        assertBlocked(
            runHook(PRETOOL_HOOK, toolPayload(repo, 'write_to_file', { path: 'e2e/.auth/user.json', content: '{}' }), repo),
            'write_to_file e2e/.auth/user.json'
        );
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse allows safe file content that merely mentions .env', () => {
    const repo = makeRepo();
    try {
        assertAllowed(
            runHook(
                PRETOOL_HOOK,
                toolPayload(repo, 'write_to_file', {
                    path: 'src/config.ts',
                    content: 'export const ENV_FILE = ".env";\nexport const AUTH = "e2e/.auth/x";\n',
                }),
                repo
            ),
            'write_to_file src/config.ts mentioning .env'
        );
    } finally {
        removeRepo(repo);
    }
});

// ---------------------------------------------------------------------------
// PreToolUse — fail closed on malformed / invalid payloads
// ---------------------------------------------------------------------------

test('PreToolUse blocks malformed JSON payload', () => {
    const repo = makeRepo();
    try {
        assertBlocked(runHookRaw(PRETOOL_HOOK, '{ not valid json', repo), 'malformed JSON');
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks a payload with no preToolUse block', () => {
    const repo = makeRepo();
    try {
        const raw = JSON.stringify({ hookName: 'PreToolUse', workspaceRoots: [repo] });
        assertBlocked(runHookRaw(PRETOOL_HOOK, raw, repo), 'missing preToolUse');
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks a non-string toolName', () => {
    const repo = makeRepo();
    try {
        const raw = JSON.stringify({ hookName: 'PreToolUse', workspaceRoots: [repo], preToolUse: { toolName: 123 } });
        assertBlocked(runHookRaw(PRETOOL_HOOK, raw, repo), 'invalid toolName');
    } finally {
        removeRepo(repo);
    }
});

test('PreToolUse blocks mutating git when the branch cannot be determined', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workhorse-nogit-'));
    try {
        assertBlocked(commandResult(dir, 'git commit -m x'), 'commit without branch context');
        assertAllowed(commandResult(dir, 'git status'), 'status without branch context');
    } finally {
        removeRepo(dir);
    }
});

test('PreToolUse blocks mutating git while on master, allows read-only git', () => {
    const repo = makeRepo({ branch: 'master' });
    try {
        assertBlocked(commandResult(repo, 'git commit -m "x"'), 'commit on master');
        assertBlocked(commandResult(repo, 'git push origin master'), 'push on master');
        assertAllowed(commandResult(repo, 'git status'), 'status on master');
    } finally {
        removeRepo(repo);
    }
});

// ---------------------------------------------------------------------------
// PreToolUse — ALLOW
// ---------------------------------------------------------------------------

const ALLOWED_COMMANDS = [
    'git status',
    'git status --short',
    'git diff',
    'git diff --stat',
    'git log --oneline -5',
    'git show HEAD',
    'git rev-parse HEAD',
    'git add config/vitest.config.ts',
    'git add file1.ts file2.ts',
    'git commit -m "chore: workhorse harness"',
    'git push origin chore/test',
    'git push',
    'npm run test:run',
    'npm run lint',
    'npm run test:ci-infra',
    'node --test scripts/agent',
];

for (const command of ALLOWED_COMMANDS) {
    test(`PreToolUse allows: ${command}`, () => {
        const repo = makeRepo();
        try {
            assertAllowed(commandResult(repo, command), command);
        } finally {
            removeRepo(repo);
        }
    });
}

// ---------------------------------------------------------------------------
// TaskStart — accept only a linked Workhorse worktree with valid metadata
// ---------------------------------------------------------------------------

function taskStartPayload(workspace) {
    return {
        clineVersion: 'test',
        hookName: 'TaskStart',
        timestamp: new Date().toISOString(),
        taskId: 'task-1',
        workspaceRoots: [workspace],
        userId: 'tester',
        agent_id: 'agent-1',
        parent_agent_id: null,
        taskStart: { taskMetadata: {} },
    };
}

test('TaskStart rejects a master workspace', () => {
    const repo = makeRepo({ branch: 'master' });
    try {
        const result = runHook(TASKSTART_HOOK, taskStartPayload(repo), repo);
        assert.equal(result.cancel, true);
        assert.match(result.errorMessage, /master/i);
    } finally {
        removeRepo(repo);
    }
});

test('TaskStart rejects the primary working tree even on a feature branch', () => {
    const repo = makeRepo({ branch: 'chore/test' });
    try {
        const result = runHook(TASKSTART_HOOK, taskStartPayload(repo), repo);
        assert.equal(result.cancel, true);
        assert.match(result.errorMessage, /primary working tree/i);
    } finally {
        removeRepo(repo);
    }
});

test('TaskStart rejects a linked worktree missing base metadata', () => {
    const repo = makeRepo();
    const wt = makeLinkedWorktree(repo, { recordBase: false });
    try {
        const result = runHook(TASKSTART_HOOK, taskStartPayload(wt), wt);
        assert.equal(result.cancel, true);
        assert.match(result.errorMessage, /base metadata/i);
    } finally {
        removeRepo(wt);
        removeRepo(repo);
    }
});

test('TaskStart rejects a linked worktree with an invalid base SHA', () => {
    const repo = makeRepo();
    const wt = makeLinkedWorktree(repo, { recordBase: false });
    try {
        setWorktreeConfig(wt, 'workhorse.baseSha', '0'.repeat(40));
        const result = runHook(TASKSTART_HOOK, taskStartPayload(wt), wt);
        assert.equal(result.cancel, true);
    } finally {
        removeRepo(wt);
        removeRepo(repo);
    }
});

test('TaskStart allows a linked worktree with valid base metadata', () => {
    const repo = makeRepo();
    const wt = makeLinkedWorktree(repo, { recordBase: true });
    try {
        const result = runHook(TASKSTART_HOOK, taskStartPayload(wt), wt);
        assert.notEqual(result.cancel, true);
        assert.match(result.contextModification, /workhorse_base_sha: [0-9a-f]{40}/);
    } finally {
        removeRepo(wt);
        removeRepo(repo);
    }
});

test('TaskStart rejects a malformed payload', () => {
    const repo = makeRepo();
    try {
        const result = runHookRaw(TASKSTART_HOOK, 'not json', repo);
        assert.equal(result.cancel, true);
    } finally {
        removeRepo(repo);
    }
});

// ---------------------------------------------------------------------------
// receipt.sh — verification must be bound to the current HEAD
// ---------------------------------------------------------------------------

function runReceipt(cwd) {
    const out = execFileSync(RECEIPT, [], {
        cwd,
        encoding: 'utf8',
        env: { ...process.env, PWD: cwd },
    });
    return JSON.parse(out);
}

test('receipt FAILs on stale verification until re-verified at the new HEAD', () => {
    const dir = makeRepo({ branch: 'chore/test' });
    const bare = makeBare();
    try {
        git(dir, ['remote', 'add', 'origin', bare]);
        git(dir, ['push', '-q', '-u', 'origin', 'HEAD']);
        const base = git(dir, ['rev-parse', 'HEAD']);
        setWorktreeConfig(dir, 'workhorse.baseSha', base);
        setWorktreeConfig(
            dir,
            'workhorse.verification',
            JSON.stringify({ base_sha: base, head_sha: base, changed_files: [], checks: [], unverified: [] })
        );

        let receipt = runReceipt(dir);
        assert.equal(receipt.head_sha, base);
        assert.equal(receipt.conditions.verification_head_matches, true);
        assert.equal(receipt.conditions.changed_files_match, true);
        assert.equal(receipt.status, 'PASS');

        // New commit B on top of A.
        fs.writeFileSync(path.join(dir, 'f2.txt'), 'b\n');
        git(dir, ['add', 'f2.txt']);
        git(dir, ['commit', '-q', '-m', 'B']);
        git(dir, ['push', '-q', '-u', 'origin', 'HEAD']);
        const headB = git(dir, ['rev-parse', 'HEAD']);

        receipt = runReceipt(dir);
        assert.equal(receipt.head_sha, headB);
        assert.equal(receipt.conditions.verification_head_matches, false);
        assert.equal(receipt.conditions.changed_files_match, false);
        assert.equal(receipt.status, 'FAIL');
        assert.ok(receipt.failed_conditions.includes('verification_head_matches'));

        // Re-verify at B.
        setWorktreeConfig(
            dir,
            'workhorse.verification',
            JSON.stringify({ base_sha: base, head_sha: headB, changed_files: ['f2.txt'], checks: [], unverified: [] })
        );
        receipt = runReceipt(dir);
        assert.equal(receipt.conditions.verification_head_matches, true);
        assert.equal(receipt.status, 'PASS');
    } finally {
        removeRepo(dir);
        removeRepo(bare);
    }
});