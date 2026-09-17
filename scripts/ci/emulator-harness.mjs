#!/usr/bin/env node
'use strict';

/**
 * Shared local Firebase Emulator harness (probes, guards, REST helpers).
 *
 * One place for the "is the local emulator suite really the demo project"
 * logic used by the local authenticated E2E path, so the seed scripts and the
 * runner cannot disagree about the environment:
 *
 *   - Loopback-only: every guard refuses a non-loopback emulator host, and the
 *     local E2E origin resolver refuses a non-loopback target origin. A local
 *     E2E run can therefore never send repository fixture credentials to a
 *     cloud project.
 *   - Demo-project-only: only `demo-anchor-os` is ever accepted or seeded.
 *   - Identity is verified, never assumed: a DEVELOPMENT banner in the app is
 *     not proof that the running emulator serves demo-anchor-os. We read the
 *     emulator Hub's pid file and inspect the owning process command line.
 *
 * Nothing in this module prints credentials, tokens or API keys.
 */

import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

export const DEMO_PROJECT_ID = 'demo-anchor-os';
export const APP_ID = 'anchor-os';
export const LOOPBACK_HOST = '127.0.0.1';
export const LOOPBACK_HOSTS = Object.freeze(['127.0.0.1', 'localhost', '::1', '[::1]']);
export const EMULATOR_PORTS = Object.freeze({ auth: 9099, firestore: 8080, functions: 5001, storage: 9199, hub: 4400 });
export const DEFAULT_LOCAL_ORIGIN = 'http://127.0.0.1:5273';
export const REQUEST_TIMEOUT_MS = 5000;

/** Expected failure (reported as a one-line message, not a stack trace). */
export class HarnessError extends Error {}

function run(command, args) {
    try {
        return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
        return '';
    }
}

/** Command line of a pid (Linux/macOS), or '' when unavailable. */
export function processCommand(pid) {
    return run('ps', ['-p', String(pid), '-o', 'args=']) || run('ps', ['-p', String(pid), '-o', 'command=']);
}

/** Working directory of a pid, or '' when unavailable. */
export function processCwd(pid) {
    try {
        return fs.readlinkSync(`/proc/${pid}/cwd`);
    } catch {
        const out = run('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn']);
        const line = out.split('\n').find((l) => l.startsWith('n'));
        return line ? line.slice(1) : '';
    }
}

/** True when something is accepting TCP connections on host:port. */
export function probePort(host, port, timeoutMs = 800) {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host, port });
        const done = (result) => {
            socket.removeAllListeners();
            socket.destroy();
            resolve(result);
        };
        socket.setTimeout(timeoutMs);
        socket.once('connect', () => done(true));
        socket.once('timeout', () => done(false));
        socket.once('error', () => done(false));
    });
}

/** Wait (bounded) for host:port to accept connections. */
export async function waitForPort(host, port, { timeoutMs = 30000, intervalMs = 250 } = {}) {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
        if (await probePort(host, port)) return true;
        if (Date.now() >= deadline) return false;
        await new Promise((r) => setTimeout(r, intervalMs));
    }
}

/**
 * Fail with a clear, actionable message when an emulator endpoint is missing.
 * (A raw "fetch failed" tells the operator nothing about which service is down.)
 */
export async function assertEmulatorReachable(hostPort, service, { timeoutMs = 3000 } = {}) {
    const [host, portRaw] = String(hostPort).split(':');
    const port = Number(portRaw);
    if (!host || !Number.isInteger(port) || port <= 0) {
        throw new HarnessError(`${service} emulator host "${hostPort}" must be "<host>:<port>".`);
    }
    if (await waitForPort(host, port, { timeoutMs, intervalMs: 250 })) return;
    throw new HarnessError(
        `${service} emulator is not reachable at ${hostPort}. Start the local emulator suite with ` +
            '`npx firebase emulators:start --project demo-anchor-os --only auth,firestore` (or run the tests ' +
            'through `npm run test:e2e:local`, which starts and verifies it for you).',
    );
}

/** Best-effort human description of whatever holds a listening port. */
export function describePortOccupant(port) {
    let pid = '';
    const ssOut = run('ss', ['-ltnp']);
    for (const line of ssOut.split('\n')) {
        if (!line.includes(`:${port} `)) continue;
        const match = line.match(/pid=(\d+)/);
        if (match) {
            pid = match[1];
            break;
        }
    }
    if (!pid) {
        pid = run('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']).split('\n')[0] || '';
    }
    if (!pid) return `port ${port} is occupied (owner could not be determined)`;

    const command = processCommand(pid) || '(command unavailable)';
    const cwd = processCwd(pid) || '(cwd unavailable)';
    return `port ${port} is occupied by pid ${pid}\n    command: ${command}\n    cwd:     ${cwd}`;
}

async function getHubInfo() {
    try {
        const res = await fetch(`http://${LOOPBACK_HOST}:${EMULATOR_PORTS.hub}/emulators`, {
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/**
 * Find the pid behind the local emulator Hub.
 * The Hub writes `hub-<projectId>.json` (containing its pid) into the temp dir;
 * the file name is the only project-id hint the Hub exposes.
 */
function findHubPid() {
    let entries = [];
    try {
        entries = fs.readdirSync(os.tmpdir());
    } catch {
        return null;
    }
    for (const name of entries.filter((entry) => /^hub-.*\.json$/.test(entry))) {
        try {
            const info = JSON.parse(fs.readFileSync(path.join(os.tmpdir(), name), 'utf8'));
            if (!info || typeof info.pid !== 'number') continue;
            const origins = Array.isArray(info.origins) ? info.origins : [];
            // Only the suite whose Hub answers on our Hub port is relevant.
            if (origins.length && !origins.some((origin) => String(origin).includes(`:${EMULATOR_PORTS.hub}`))) continue;
            if (!processCommand(info.pid)) continue;
            return { pid: info.pid, projectHint: name.replace(/^hub-/, '').replace(/\.json$/, '') };
        } catch {
            /* ignore unreadable hub files */
        }
    }
    return null;
}

/**
 * Classify the local emulator suite.
 *
 * @returns {Promise<{state: 'free'|'partial'|'verified'|'foreign'|'unverified',
 *   command?: string, cwd?: string, projectHint?: string, pid?: number}>}
 */
export async function readEmulatorSuite() {
    const [authOpen, firestoreOpen] = await Promise.all([
        probePort(LOOPBACK_HOST, EMULATOR_PORTS.auth),
        probePort(LOOPBACK_HOST, EMULATOR_PORTS.firestore),
    ]);

    if (!authOpen && !firestoreOpen) return { state: 'free' };
    if (authOpen !== firestoreOpen) {
        return {
            state: 'partial',
            auth: authOpen,
            firestore: firestoreOpen,
            authOccupant: authOpen ? describePortOccupant(EMULATOR_PORTS.auth) : null,
            firestoreOccupant: firestoreOpen ? describePortOccupant(EMULATOR_PORTS.firestore) : null,
        };
    }

    const hub = await getHubInfo();
    const hubPid = findHubPid();
    if (!hub || !hubPid) return { state: 'unverified' };

    const command = processCommand(hubPid.pid);
    const cwd = processCwd(hubPid.pid);
    const servesDemoProject = new RegExp(`--project[=\\s]${DEMO_PROJECT_ID}(\\s|$)`).test(command);
    if (!servesDemoProject) {
        return { state: 'foreign', pid: hubPid.pid, command, cwd, projectHint: hubPid.projectHint };
    }
    return { state: 'verified', pid: hubPid.pid, command, cwd, projectHint: hubPid.projectHint };
}

/** Loopback-only emulator host env value, with a loopback default. */
export function requireLoopbackHostEnv(env, name, fallback) {
    const value = (env[name] || '').trim() || fallback;
    if (!value) {
        throw new HarnessError(
            `${name} is not set. Pass a loopback emulator host such as ${LOOPBACK_HOST}:${EMULATOR_PORTS.auth}.`,
        );
    }
    const host = value.split(':')[0];
    if (!LOOPBACK_HOSTS.includes(host)) {
        throw new HarnessError(`${name} must point at a loopback host (${LOOPBACK_HOST}), got "${value}".`);
    }
    return value;
}

/** Refuse any project identity other than the disposable demo project. */
export function requireDemoProjectId(env) {
    const projectId = (env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID || '').trim();
    if (!projectId) {
        throw new HarnessError('FIREBASE_PROJECT_ID (or VITE_FIREBASE_PROJECT_ID) is not set.');
    }
    if (projectId !== DEMO_PROJECT_ID) {
        throw new HarnessError(
            `project ID "${projectId}" is not the demo identity "${DEMO_PROJECT_ID}". Cloud projects are never seeded.`,
        );
    }
    return projectId;
}

/**
 * Resolve the local E2E origin (loopback only).
 * `E2E_BASE_URL` may point at an already-running local target; anything that is
 * not loopback is refused, so repository fixture credentials are never sent to
 * a deployed project by this local command.
 */
export function resolveLocalOrigin(env = process.env) {
    const raw = (env.E2E_BASE_URL || '').trim() || DEFAULT_LOCAL_ORIGIN;
    let url;
    try {
        url = new URL(raw);
    } catch {
        throw new HarnessError(`E2E_BASE_URL="${raw}" is not a valid URL.`);
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new HarnessError(`E2E_BASE_URL="${raw}" must use http or https.`);
    }
    const host = url.hostname.toLowerCase();
    if (!LOOPBACK_HOSTS.includes(host)) {
        throw new HarnessError(
            `E2E_BASE_URL="${raw}" is not a loopback origin. This local command seeds the disposable ` +
                `emulator identity and must never target a cloud project.`,
        );
    }
    return { origin: url.origin, host, port: url.port || (url.protocol === 'https:' ? '443' : '80') };
}

/**
 * Refuse a non-loopback target origin.
 *
 * Repository fixture credentials (e2e/fixtures/test-data.ts) are disposable and
 * emulator-only: they must never be submitted to a deployed project. Returns the
 * normalized origin, or null when no target was provided.
 */
export function assertLoopbackTarget(rawTarget, { what = 'target' } = {}) {
    const value = String(rawTarget ?? '').trim();
    if (!value) return null;
    let url;
    try {
        url = new URL(value);
    } catch {
        throw new HarnessError(`${what} "${value}" is not a valid URL.`);
    }
    if (!LOOPBACK_HOSTS.includes(url.hostname.toLowerCase())) {
        throw new HarnessError(
            `${what} "${value}" is not a loopback origin. The repository fixture identity ` +
                '(e2e/fixtures/test-data.ts) is emulator-only and is never sent to a cloud project.',
        );
    }
    return url.origin;
}

/**
 * Credential-bearing cloud Firebase Auth endpoints.
 *
 * A loopback page URL does NOT prove the Firebase backend is local: a stale
 * checkout can be served from loopback while its Firebase config still points
 * at a cloud project. Development must only ever talk to the local emulator, so
 * anything on these hosts is a cloud auth request that must be blocked before
 * fixture credentials are transmitted.
 */
export function isCloudFirebaseAuthUrl(rawUrl) {
    let url;
    try {
        url = new URL(String(rawUrl));
    } catch {
        return false;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    // Loopback auth requests are the local emulator (or a local stub), never cloud.
    if (LOOPBACK_HOSTS.includes(host)) return false;
    if (host === 'identitytoolkit.googleapis.com' || host.endsWith('.identitytoolkit.googleapis.com')) return true;
    if (host === 'securetoken.googleapis.com' || host.endsWith('.securetoken.googleapis.com')) return true;
    return url.pathname.includes('/identitytoolkit/');
}

/**
 * Emulator-only Vite environment pinned inline for the local dev server.
 * Shell env overrides Vite's .env files, so a developer's local configuration
 * can never leak cloud credentials into a local E2E run.
 */
export const PINNED_LOCAL_VITE_ENV = Object.freeze({
    VITE_APP_ENV: 'development',
    VITE_FIREBASE_PROJECT_ID: DEMO_PROJECT_ID,
    VITE_FIREBASE_API_KEY: 'demo-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: `${DEMO_PROJECT_ID}.firebaseapp.com`,
    VITE_FIREBASE_STORAGE_BUCKET: `${DEMO_PROJECT_ID}.appspot.com`,
    VITE_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
    VITE_FIREBASE_APP_ID: `1:000000000000:web:${DEMO_PROJECT_ID}`,
    VITE_FIREBASE_APP_CHECK_SITE_KEY: '',
    VITE_FIREBASE_VAPID_KEY: '',
    VITE_SENTRY_DSN: '',
});

/** The pinned local dev-server command that serves THIS worktree on host:port. */
export function buildLocalDevCommand(host, port) {
    const bindHost = host === '[::1]' ? '::1' : host;
    const pinned = Object.entries(PINNED_LOCAL_VITE_ENV)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');
    return `${pinned} npm run dev -- --host ${bindHost} --port ${port} --strictPort`;
}

function localWebServerPlan(host, port, origin) {
    return {
        command: buildLocalDevCommand(host, port),
        url: origin,
        timeout: 60 * 1000,
        // Never reuse a process this command did not start: an unrelated dev
        // server could silently serve a different (stale) checkout.
        reuseExistingServer: false,
    };
}

/**
 * Resolve the Playwright server plan for one target.
 *
 * The canonical local runner ALWAYS starts its own app server from the current
 * worktree. A loopback `E2E_BASE_URL` only chooses the host/port the server is
 * started on — it never disables startup and never allows reuse. A non-loopback
 * `E2E_BASE_URL` is a deployed target (the staging/release workflows invoke
 * config/playwright.config.ts directly) and must never start a local server.
 *
 * @returns {{mode: 'local'|'deployed', origin: string, host: string, port: string,
 *   baseURL: string, webServer: object|null}}
 */
export function resolvePlaywrightServerPlan(env = process.env) {
    const raw = String(env.E2E_BASE_URL ?? '').trim();
    if (!raw) {
        const url = new URL(DEFAULT_LOCAL_ORIGIN);
        return {
            mode: 'local',
            origin: url.origin,
            host: url.hostname,
            port: url.port,
            baseURL: url.origin,
            webServer: localWebServerPlan(url.hostname, url.port, url.origin),
        };
    }
    let url;
    try {
        url = new URL(raw);
    } catch {
        throw new HarnessError(`E2E_BASE_URL="${raw}" is not a valid URL.`);
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new HarnessError(`E2E_BASE_URL="${raw}" must use http or https.`);
    }
    const host = url.hostname.toLowerCase();
    if (!LOOPBACK_HOSTS.includes(host)) {
        // Deployed target: the invoking workflow owns the origin; no local server.
        return { mode: 'deployed', origin: url.origin, host, port: url.port || '', baseURL: url.origin, webServer: null };
    }
    const port = url.port || (url.protocol === 'https:' ? '443' : '80');
    return {
        mode: 'local',
        origin: url.origin,
        host,
        port,
        baseURL: url.origin,
        webServer: localWebServerPlan(host, port, url.origin),
    };
}

/** POSIX shell quoting for values forwarded to `sh -c` (Playwright args, paths). */
export function shellQuote(value) {
    return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

/** JSON POST with a bounded timeout. */
export async function postJson(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
}

function firestoreBaseUrl(host, projectId = DEMO_PROJECT_ID) {
    return `http://${host}/v1/projects/${projectId}/databases/(default)/documents`;
}

/** Firestore emulator REST GET of a document path. */
export async function getFirestoreDoc(host, docPath, idToken) {
    const res = await fetch(`${firestoreBaseUrl(host)}/${docPath}`, {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
}

/** Create a document in a collection (Firestore emulator REST). */
export async function createFirestoreDoc(host, collectionPath, fields, idToken) {
    const res = await fetch(`${firestoreBaseUrl(host)}/${collectionPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ fields }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
}

/**
 * Write a document (Firestore emulator REST PATCH, idempotent).
 *
 * Without a mask this writes the given fields as the whole document (used for
 * full seeds). Pass `{ updateMask: ['field', ...] }` to change only those field
 * paths while keeping the rest of the document — required for updates that must
 * still satisfy document-validity rules (an unmasked partial PATCH would blank
 * every other field).
 */
export async function patchFirestoreDoc(host, docPath, fields, idToken, { updateMask } = {}) {
    const params = new URLSearchParams();
    for (const fieldPath of updateMask ?? []) params.append('updateMask.fieldPaths', fieldPath);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${firestoreBaseUrl(host)}/${docPath}${query}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ fields }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
}
