'use strict';

/**
 * Focused tests for the emulator-only development environment.
 * Run: node --test scripts/ci/dev-env.node-suite.mjs
 *
 * Locks in:
 *   - exactly ONE canonical Firebase config (root firebase.json)
 *   - no dead "dev" Hosting target / deploy:dev
 *   - every local emulator command runs under --project demo-anchor-os
 *   - the PR bounded smoke is hermetic (no E2E_VITE_ENV, local emulators,
 *     deterministic seed; deployed E2E_BASE_URL smoke unchanged)
 *   - the seed script refuses non-emulator / non-demo execution
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const PKG = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const FIREBASE_JSON = fs.readFileSync('firebase.json', 'utf8');
const FIREBASERC = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
const ENV_EXAMPLE = fs.readFileSync('.env.example', 'utf8');
const CI_WORKFLOW = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const SMOKE_CONFIG = fs.readFileSync('config/playwright.release-smoke.config.ts', 'utf8');
const FIREBASE_TS = fs.readFileSync('src/config/firebase.ts', 'utf8');
const SEED_SCRIPT = fs.readFileSync('scripts/ci/seed-release-emulator.mjs', 'utf8');
const TEST_WITH_EMULATOR = fs.readFileSync('scripts/test-with-emulator.sh', 'utf8');

const ciSmokeJob = () => CI_WORKFLOW.slice(CI_WORKFLOW.indexOf('  e2e-tests:'), CI_WORKFLOW.indexOf('  # Job 1.7'));

function trackedFiles() {
    return execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
}

// --- 1. Exactly ONE Firebase config ----------------------------------------

test('exactly one Firebase config is tracked (root firebase.json)', () => {
    const configs = trackedFiles().filter((f) => /(^|\/)firebase\.json$/.test(f));
    assert.deepEqual(configs, ['firebase.json']);
    assert.ok(fs.existsSync('firebase.json'), 'root firebase.json must exist');
});

test('no file references the deleted config/firebase.json', () => {
    for (const rel of ['package.json', 'scripts/test-with-emulator.sh', 'docs/OPERATIONS.md',
        'scripts/ci/classify-changes.js', '.github/workflows/ci.yml',
        '.github/workflows/staging.yml', '.github/workflows/production.yml']) {
        const content = fs.readFileSync(rel, 'utf8');
        assert.doesNotMatch(content, /config\/firebase\.json/, `${rel} must not reference config/firebase.json`);
    }
});

// --- 2. Dead dev Hosting surface deleted ------------------------------------

test('canonical firebase.json has ONLY staging and production hosting targets', () => {
    const config = JSON.parse(FIREBASE_JSON);
    const targets = config.hosting.map((h) => h.target);
    assert.deepEqual(targets.sort(), ['production', 'staging']);
});

test('.firebaserc projects are exactly staging/production (no development cloud project)', () => {
    assert.deepEqual(FIREBASERC.projects, {
        default: 'anchor-os',
        staging: 'anchor-os-staging',
        production: 'anchor-os',
    });
    for (const target of Object.keys(FIREBASERC.targets?.['anchor-os']?.hosting ?? {})) {
        assert.notEqual(target, 'dev');
    }
    assert.equal(FIREBASERC.targets?.['anchor-os-staging']?.hosting?.dev, undefined);
});

test('no deploy:dev script and no dev hosting invocation anywhere', () => {
    assert.equal(PKG.scripts['deploy:dev'], undefined);
    const allScripts = Object.values(PKG.scripts).join('\n');
    assert.doesNotMatch(allScripts, /hosting:dev|deploy --only hosting:dev/);
    assert.doesNotMatch(FIREBASE_JSON, /"target"\s*:\s*"dev"/);
});

// --- 3. All emulator commands use the demo project ---------------------------

test('every emulator CLI command uses --project demo-anchor-os', () => {
    const emulatorCommands = [
        PKG.scripts['emulator:start'],
        PKG.scripts['test:rules'],
        PKG.scripts['test:rules:ci'],
        PKG.scripts['test:functions:emulator'],
        PKG.scripts['test:release-smoke:local'],
        TEST_WITH_EMULATOR,
        CI_WORKFLOW,
        DEV_LOCAL,
    ].join('\n');
    const uses = emulatorCommands.match(/firebase emulators:(start|exec)[^\n'"]*/g) || [];
    assert.ok(uses.length >= 6, `expected several emulator invocations, found ${uses.length}`);
    for (const cmd of uses) {
        assert.match(cmd, /--project\s+demo-anchor-os/, `emulator command lacks demo project: ${cmd}`);
        assert.doesNotMatch(cmd, /--config/, `emulator command must use the canonical root config: ${cmd}`);
    }
});


// --- 4. PR bounded smoke is hermetic -----------------------------------------

test('PR smoke contains no E2E_VITE_ENV dependency', () => {
    const job = ciSmokeJob();
    assert.doesNotMatch(job, /E2E_VITE_ENV/);
    // Safe template instead of cloud secrets
    assert.match(job, /cp \.env\.example \.env\.development/);
});

test('PR smoke starts Firebase emulators under demo-anchor-os and seeds deterministically', () => {
    const job = ciSmokeJob();
    assert.match(job, /firebase emulators:start --project demo-anchor-os/);
    assert.match(job, /node scripts\/ci\/seed-release-emulator\.mjs/);
    // Seeding happens BEFORE Playwright runs (step order inside the job)
    assert.ok(
        job.indexOf('seed-release-emulator.mjs') < job.indexOf('test:release-smoke'),
        'seed step must run before the Playwright gate',
    );
});

test('local PR smoke uses a dedicated deterministic Vite port, never the PM2 5173 dev server', () => {
    const localWebServer = SMOKE_CONFIG.slice(SMOKE_CONFIG.indexOf('webServer:'));
    assert.match(localWebServer, /--port 5199 --strictPort/);
    assert.match(localWebServer, /reuseExistingServer: false/);
    assert.match(localWebServer, /VITE_APP_ENV=development/);
    assert.match(localWebServer, /VITE_FIREBASE_PROJECT_ID=demo-anchor-os/);
    assert.doesNotMatch(SMOKE_CONFIG.slice(0, SMOKE_CONFIG.indexOf('webServer:')), /5173/);
});

test('deployed release smoke with E2E_BASE_URL is unchanged (no local emulators/server/seed)', () => {
    assert.match(SMOKE_CONFIG, /process\.env\.E2E_BASE_URL\s*\n?\s*\?\s*undefined/);
    // Bounded gate contract preserved
    assert.match(SMOKE_CONFIG, /retries: 0/);
    assert.match(SMOKE_CONFIG, /timeout: 20000/);
    assert.match(SMOKE_CONFIG, /globalTimeout: 3 \* 60 \* 1000/);
    assert.doesNotMatch(SMOKE_CONFIG, /webkit|Desktop Firefox|iPhone/);
    // Deployment workflows keep testing the deployed URL via test:release-smoke
    const staging = fs.readFileSync('.github/workflows/staging.yml', 'utf8');
    const production = fs.readFileSync('.github/workflows/production.yml', 'utf8');
    assert.match(staging, /config\/playwright\.release-smoke\.config\.ts/);
    assert.match(production, /config\/playwright\.release-smoke\.config\.ts/);
    for (const wf of [staging, production]) {
        assert.doesNotMatch(wf, /emulators:start/);
        assert.doesNotMatch(wf, /seed-release-emulator/);
    }
});

test('.env.example is safe: emulator demo values, no real credentials', () => {
    assert.match(ENV_EXAMPLE, /VITE_APP_ENV=development/);
    assert.match(ENV_EXAMPLE, /VITE_FIREBASE_PROJECT_ID=demo-anchor-os/);
    assert.match(ENV_EXAMPLE, /VITE_FIREBASE_APP_CHECK_SITE_KEY=\s*$/m);
    assert.match(ENV_EXAMPLE, /VITE_FIREBASE_VAPID_KEY=\s*$/m);
    assert.doesNotMatch(ENV_EXAMPLE, /AIza[A-Za-z0-9_-]{20,}/); // no real API keys
    assert.match(ENV_EXAMPLE, /GitHub\s*\n?\s*environment|injected by GitHub/i);
});

// --- 5. firebase.ts development contract -------------------------------------

// --- 6. Seed script: behavioral guard + idempotency ---------------------------

function runSeed(env) {
    return spawnSync(process.execPath, ['scripts/ci/seed-release-emulator.mjs'], {
        encoding: 'utf8',
        env: { ...process.env, ...env },
    });
}

test('seed refuses to execute without emulator host env variables', () => {
    const r = runSeed({ FIREBASE_AUTH_EMULATOR_HOST: '', FIRESTORE_EMULATOR_HOST: '' });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /REFUSED/);
    assert.match(r.stderr, /FIREBASE_AUTH_EMULATOR_HOST/);
});

test('seed refuses any non-demo project ID (never seeds a cloud project)', () => {
    for (const pid of ['anchor-os', 'anchor-os-staging']) {
        const r = runSeed({
            FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
            FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
            FIREBASE_PROJECT_ID: pid,
        });
        assert.notEqual(r.status, 0, `seed must refuse project ${pid}`);
        assert.match(r.stderr, /REFUSED/);
        assert.match(r.stderr, /demo-anchor-os/);
    }
});

test('seed refuses non-loopback emulator hosts', () => {
    const r = runSeed({
        FIREBASE_AUTH_EMULATOR_HOST: '10.0.0.5:9099',
        FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
        FIREBASE_PROJECT_ID: 'demo-anchor-os',
    });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /REFUSED/);
    assert.match(r.stderr, /loopback/);
});

test('seed reuses the canonical TEST_USER fixture (single source of truth)', () => {
    // The identity is parsed in exactly one place: scripts/ci/release-identity.mjs.
    assert.match(SEED_SCRIPT, /readFixtureIdentity/);
    assert.doesNotMatch(SEED_SCRIPT, /TEST_USER = |loadFixtureUser/);
    // The canonical parser reads the fixture file (not duplicated literals here).
    const identityModule = fs.readFileSync('scripts/ci/release-identity.mjs', 'utf8');
    assert.match(identityModule, /e2e\/fixtures\/test-data\.ts|'fixtures', 'test-data\.ts/);
    assert.doesNotMatch(SEED_SCRIPT, /TestPass123!/);
    // Never prints credentials or tokens
    assert.doesNotMatch(SEED_SCRIPT, /console\.(log|error)[^;]*(password|idToken|refreshToken)/);
});

test('seed is idempotent and succeeds against the running local emulators', { skip: !isAuthEmulatorUp() }, () => {
    const env = {
        FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
        FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
        FIREBASE_PROJECT_ID: 'demo-anchor-os',
    };
    const first = runSeed(env);
    assert.equal(first.status, 0, `first seed failed: ${first.stderr || first.stdout}`);
    const second = runSeed(env);
    assert.equal(second.status, 0, `second (idempotent) seed failed: ${second.stderr || second.stdout}`);
    assert.match(second.stdout, /verified/, 'second run must verify the existing account, not fail');
    assert.doesNotMatch(second.stdout + second.stderr, /TestPass123!|test@anchor-os\.com/);
});

function isAuthEmulatorUp() {
    try {
        spawnSync('curl', ['-s', '-o', '/dev/null', 'http://127.0.0.1:9099'], { timeout: 3000 });
        const probe = spawnSync('bash', ['-c', 'curl -s -o /dev/null http://127.0.0.1:9099 && echo UP'], { encoding: 'utf8', timeout: 3000 });
        return probe.stdout.trim() === 'UP';
    } catch {
        return false;
    }
}


test('development connects Auth/Firestore/Functions/Storage to the emulator ports', () => {
    assert.match(FIREBASE_TS, /connectAuthEmulator\(auth, `http:\/\/\$\{EMULATOR_HOST\}:\$\{EMULATOR_PORTS\.auth\}`/);
    assert.match(FIREBASE_TS, /connectFirestoreEmulator\(db, EMULATOR_HOST, EMULATOR_PORTS\.firestore\)/);
    assert.match(FIREBASE_TS, /connectFunctionsEmulator\(functions, EMULATOR_HOST, EMULATOR_PORTS\.functions\)/);
    assert.match(FIREBASE_TS, /connectStorageEmulator\(storage, EMULATOR_HOST, EMULATOR_PORTS\.storage\)/);
    assert.match(FIREBASE_TS, /\{ auth: 9099, firestore: 8080, functions: 5001, storage: 9199 \}/);
    assert.match(FIREBASE_TS, /127\.0\.0\.1/);
});

test('development rejects real/cloud project IDs and App Check/FCM stay disabled', () => {
    assert.match(FIREBASE_TS, /isEmulatorDevelopment && firebaseConfig\.projectId !== DEMO_PROJECT_ID/);
    assert.match(FIREBASE_TS, /DEMO_PROJECT_ID = 'demo-anchor-os'/);
    // App Check gated OFF in emulator development
    assert.match(FIREBASE_TS, /!isEmulatorDevelopment && appCheckSiteKey/);
    // Messaging resolves to null in emulator development before any VAPID check
    assert.match(FIREBASE_TS, /if \(isEmulatorDevelopment \|\| !import\.meta\.env\.VITE_FIREBASE_VAPID_KEY\)/);
    // No opt-back-in flag for cloud development
    assert.doesNotMatch(FIREBASE_TS, /VITE_ALLOW_CLOUD|USE_CLOUD_FIREBASE|DISABLE_EMULATOR/i);
});

test('no local emulator command relies on the .firebaserc default project', () => {
    const emulatorCommands = [
        PKG.scripts['emulator:start'],
        PKG.scripts['test:rules'],
        PKG.scripts['test:rules:ci'],
        PKG.scripts['test:functions:emulator'],
    ].join('\n');
    assert.doesNotMatch(emulatorCommands, /emulators:(start|exec)(?![^\n]*--project)/);
});

// --- 7. Simple remote (Tailscale) dev access ----------------------------------

const VITE_CONFIG = fs.readFileSync('config/vite.config.ts', 'utf8');
const DEV_LOCAL = fs.readFileSync('scripts/dev-local.sh', 'utf8');
const FIREBASE_JSON_CONFIG = JSON.parse(FIREBASE_JSON);

test('Vite dev server binds 0.0.0.0 and accepts the Tailscale hostname', () => {
    const serverBlock = VITE_CONFIG.slice(VITE_CONFIG.indexOf('server:'));
    assert.match(serverBlock, /host:\s*'0\.0\.0\.0'/);
    assert.match(serverBlock, /allowedHosts:/);
    assert.match(serverBlock, /anchor\.tail2fa2e\.ts\.net/);
    // 5173 stays the canonical dev port (Vite default; no port override)
    assert.doesNotMatch(serverBlock, /port:\s*\d+/);
});

test('dev:local is one command and the emulator suite listens on all interfaces', () => {
    assert.equal(PKG.scripts['dev:local'], 'bash scripts/dev-local.sh');
    // RA-14 / PR #173: the one-command path must scope the suite to the four local
    // services. Without --only the CLI also boots hosting, which fails closed
    // because firebase.json hosting targets are not configured for the demo
    // project — so the script never worked. Assert the contract (project + scoped
    // services) rather than an exact flag string, which rots silently: this
    // assertion is only executed when CI infrastructure files change.
    assert.match(PKG.scripts['emulator:start'], /^firebase emulators:start --project demo-anchor-os /);
    const scoped = PKG.scripts['emulator:start'].match(/--only ([a-z,]+)/);
    assert.ok(scoped, 'emulator:start must scope the suite with --only');
    assert.deepEqual(scoped[1].split(',').sort(), ['auth', 'firestore', 'functions', 'storage']);
    // All four emulator ports from the contract stay pinned, and every
    // emulator listens on 0.0.0.0 so the Tailscale hostname can reach it.
    for (const [name, port] of [['auth', 9099], ['firestore', 8080], ['functions', 5001], ['storage', 9199]]) {
        assert.equal(FIREBASE_JSON_CONFIG.emulators[name].port, port);
        assert.equal(FIREBASE_JSON_CONFIG.emulators[name].host, '0.0.0.0');
    }
});

test('dev:local runner: demo project only, all interfaces, never kills anything', () => {
    assert.match(DEV_LOCAL, /firebase emulators:start --project demo-anchor-os/);
    assert.match(DEV_LOCAL, /CANONICAL_PORT=5173/);
    assert.match(DEV_LOCAL, /FALLBACK_PORT=5199/);
    // Reports the owner of an occupied 5173 and falls back — never destructive
    assert.match(DEV_LOCAL, /lsof[^\n]*5173|lsof[^\n]*CANONICAL_PORT/);
    assert.doesNotMatch(DEV_LOCAL, /pkill|fuser|pm2 (delete|stop|kill)/);
});

test('emulator host selection exists and is development-only', () => {
    assert.match(FIREBASE_TS, /export function resolveEmulatorHost/);
    assert.match(FIREBASE_TS, /isEmulatorDevelopment \? resolveEmulatorHost\(currentBrowserHostname\(\)\) : '127\.0\.0\.1'/);
});
