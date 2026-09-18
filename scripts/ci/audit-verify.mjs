#!/usr/bin/env node
'use strict';

/**
 * Audit §17 data verification (read-only, aggregate counts only).
 *
 * Implements the decision-critical questions from
 * docs/audits/2026-09-whole-product/12-FINAL-SYNTHESIS-REMEDIATION-PLAN.md §17.
 *
 *   AUDIT_PROJECT_ID=anchor-os-staging node scripts/ci/audit-verify.mjs
 *
 * Auth: `gcloud auth print-access-token` + the Firestore REST API (the local
 * ADC refresh token is unusable — invalid_grant — while the gcloud user token
 * is valid, and REST avoids requiring an interactive re-login).
 *
 * Safety: aggregates only — never prints document values, ids or PII.
 * Read-only: no writes, no deploy.
 */

import { execFileSync } from 'node:child_process';

const projectId = process.env.AUDIT_PROJECT_ID;
if (!projectId) {
    console.error('Refusing to run: set AUDIT_PROJECT_ID (e.g. anchor-os-staging).');
    process.exit(1);
}

const BASE = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const ROOT = 'artifacts/anchor-os';
const PAGE = 300;

const token = execFileSync('gcloud', ['auth', 'print-access-token'], { encoding: 'utf8' }).trim();
const HEADERS = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

async function listCollection(collectionPath, fieldPaths = null) {
    const out = [];
    let pageToken = null;
    do {
        const params = new URLSearchParams({ pageSize: String(PAGE) });
        if (pageToken) params.set('pageToken', pageToken);
        if (fieldPaths) for (const f of fieldPaths) params.append('mask.fieldPaths', f);
        const res = await fetch(`${BASE}/${collectionPath}?${params}`, { headers: HEADERS });
        if (!res.ok) throw new Error(`${collectionPath} -> ${res.status} ${(await res.text()).slice(0, 160)}`);
        const body = await res.json();
        out.push(...(body.documents ?? []));
        pageToken = body.nextPageToken ?? null;
    } while (pageToken);
    return out;
}

/** Firestore REST value -> plain JS (shallow; enough for key/count checks). */
function value(v) {
    if (!v) return undefined;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, value(x)]));
    if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(value);
    return undefined;
}
function fields(doc) {
    return Object.fromEntries(Object.entries(doc.fields ?? {}).map(([k, v]) => [k, value(v)]));
}
const idOf = (doc) => doc.name.split('/').pop();
async function getUserIds() {
    const docs = await listCollection(`${ROOT}/users`, null);
    return docs.map(idOf);
}

async function getDoc(path) {
    const res = await fetch(`${BASE}/${path}`, { headers: HEADERS });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`${path} -> ${res.status}`);
    return fields(await res.json());
}

async function listCollectionIds(docPath) {
    const res = await fetch(`${BASE}/${docPath}:listCollectionIds`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ pageSize: 100 }),
    });
    if (!res.ok) return [];
    const body = await res.json();
    return body.collectionIds ?? [];
}

const report = { projectId, generatedAt: new Date().toISOString(), findings: {} };

async function v1_connections(statusOf) {
    const docs = await listCollection(`${ROOT}/family_connections`, ['status', 'ownerUid']);
    const byStatus = {};
    const perOwner = new Map();
    for (const d of docs) {
        const f = fields(d);
        const status = f.status ?? '<missing>';
        byStatus[status] = (byStatus[status] ?? 0) + 1;
        if (statusOf(f.status)) perOwner.set(f.ownerUid ?? '<missing>', (perOwner.get(f.ownerUid ?? '<missing>') ?? 0) + 1);
    }
    return {
        total: docs.length,
        byStatus,
        activeOwners: perOwner.size,
        ownersWithMoreThanOneActive: [...perOwner.values()].filter((n) => n > 1).length,
    };
}

async function scanPerUser(userIds, sub, fieldPaths, predicate, label) {
    let total = 0;
    let hits = 0;
    for (const uid of userIds) {
        const docs = await listCollection(`${ROOT}/users/${uid}/${sub}`, fieldPaths);
        total += docs.length;
        for (const d of docs) if (predicate(fields(d))) hits += 1;
    }
    return { [label]: { total, hits } };
}

const users = await getUserIds();
report.findings.totals = { users: users.length };

try {
    report.findings.V1_and_V4_familyConnections = await v1_connections((s) => s === 'active');
} catch (e) { report.findings.V1_and_V4_familyConnections = { error: String(e.message) }; }

try {
    // One pass over accounts answers V2 (legacy shares), V5 (ownerless) and the
    // AM-3 stop-condition "zero scope:'family' docs in production (V1)".
    let accounts = 0;
    let legacyShares = 0;
    let ownerless = 0;
    let scopeFamily = 0;
    for (const uid of users) {
        const docs = await listCollection(`${ROOT}/users/${uid}/accounts`, ['shares', 'ownerId', 'scope', 'sharedWith']);
        accounts += docs.length;
        for (const d of docs) {
            const f = fields(d);
            if (Object.keys(f.shares ?? {}).length > 0) legacyShares += 1;
            if (!f.ownerId) ownerless += 1;
            if (f.scope === 'family') scopeFamily += 1;
        }
    }
    report.findings.V2_legacyShares = { accounts, hits: legacyShares };
    report.findings.V5_ownerlessAccounts = { accounts, hits: ownerless };
    report.findings.V1_scopeFamily = { accounts, hits: scopeFamily };
} catch (e) {
    report.findings.V2_legacyShares = { error: String(e.message) };
}

try {
    Object.assign(report.findings, await scanPerUser(
        users, 'finance', ['accountShares'],
        (f) => Object.keys(f.accountShares ?? {}).length > 0,
        'V3_staleAccountShares',
    ));
} catch (e) { report.findings.V3_staleAccountShares = { error: String(e.message) }; }

try {
    let missing = 0;
    let malformed = 0;
    for (const uid of users) {
        const doc = await getDoc(`${ROOT}/users/${uid}`);
        const prefs = doc?.notificationPreferences;
        if (prefs === undefined) { missing += 1; continue; }
        if (typeof prefs !== 'object' || prefs === null || typeof prefs.enabled !== 'boolean') malformed += 1;
    }
    report.findings.V9_preferences = { users: users.length, withoutPreferences: missing, malformed };
} catch (e) { report.findings.V9_preferences = { error: String(e.message) }; }

try {
    let present = 0;
    let enabled = 0;
    for (const uid of users) {
        const state = await getDoc(`${ROOT}/users/${uid}/fabric_settings/state`);
        if (!state) continue;
        present += 1;
        if (state.enabled === true) enabled += 1;
    }
    report.findings.V12_fabricEnabled = { withSettingsDoc: present, enabled };
} catch (e) { report.findings.V12_fabricEnabled = { error: String(e.message) }; }

try {
    const names = new Map();
    let tokenDocs = 0;
    for (const uid of users) {
        for (const c of await listCollectionIds(`${ROOT}/users/${uid}`)) {
            names.set(c, (names.get(c) ?? 0) + 1);
            if (/token|device|push/i.test(c)) {
                tokenDocs += (await listCollection(`${ROOT}/users/${uid}/${c}`, ['token'])).length;
            }
        }
    }
    report.findings.V8_pushTokens = {
        userSubcollections: [...names.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
        tokenDocs,
    };
} catch (e) { report.findings.V8_pushTokens = { error: String(e.message) }; }

console.log(JSON.stringify(report, null, 2));