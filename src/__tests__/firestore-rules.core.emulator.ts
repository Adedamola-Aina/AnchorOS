/**
 * Firestore Rules — Core collections (audit_log, users, feedback)
 *
 * Covers:
 * - SEC-6: legacy invitations (auth required for get)
 * - audit_log: no client access
 * - users: owner-only read/write
 * - feedback: Cloud Functions-only write, no client read
 *
 * @vitest-environment node
 */
// @ts-nocheck

import { doc, getDoc, setDoc, describe, it, beforeAll, afterAll, beforeEach, assertSucceeds, assertFails, PREFIX, makeTestEnv } from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

// ─── SEC-6: legacy invitations ──────────────────────────────────────────────
describe('legacy invitations (SEC-6)', () => {
  const collPath = `${PREFIX}/invitations`;

  it('authenticated user can get invitation by token', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'token123'), {
        senderUid: 'sender1',
        recipientEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.authedDb('anyuser');
    await assertSucceeds(getDoc(doc(db, collPath, 'token123')));
  });

  it('unauthenticated user cannot get invitation token', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'token456'), {
        senderUid: 'sender1',
        recipientEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.unauthDb();
    await assertFails(getDoc(doc(db, collPath, 'token456')));
  });
});

// ─── Core: audit_log (no client access) ─────────────────────────────────────
describe('audit_log (locked down)', () => {
  const collPath = `${PREFIX}/audit_log`;

  it('authenticated user cannot read audit log', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'log1'), { action: 'test' });
    });
    const db = ctx.authedDb('admin');
    await assertFails(getDoc(doc(db, collPath, 'log1')));
  });

  it('authenticated user cannot write audit log', async () => {
    const db = ctx.authedDb('admin');
    await assertFails(setDoc(doc(db, collPath, 'log2'), { action: 'inject' }));
  });
});

// ─── Core: users collection (owner-only) ────────────────────────────────────
describe('users collection (owner-only)', () => {
  const userPath = (uid: string) => `${PREFIX}/users/${uid}`;

  it('user can read their own document', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), userPath('user1')), { displayName: 'Test User' });
    });
    const db = ctx.authedDb('user1');
    await assertSucceeds(getDoc(doc(db, userPath('user1'))));
  });

  it('user cannot read another users document', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), userPath('user2')), { displayName: 'Other User' });
    });
    const db = ctx.authedDb('user1');
    await assertFails(getDoc(doc(db, userPath('user2'))));
  });
});

// ─── Core: feedback (Cloud Functions-only) ──────────────────────────────────
describe('feedback (Cloud Functions-only)', () => {
  const collPath = `${PREFIX}/feedback`;

  it('authenticated user cannot create feedback directly', async () => {
    const db = ctx.authedDb('user1');
    await assertFails(
      setDoc(doc(db, collPath, 'fb1'), {
        subject: 'Feedback',
        message: 'Great app!',
        name: 'Test User',
        email: 'user1@test.com',
        userId: 'user1',
        appVersion: '1.10.0-rc.0',
        deviceType: 'Mozilla/5.0',
        platform: 'Linux x86_64',
        currentPage: 'settings',
        timestamp: '2026-03-10T20:00:00.000Z',
        createdAt: new Date(),
        status: 'new',
      })
    );
  });

  it('still rejects malformed or oversized direct writes', async () => {
    const db = ctx.authedDb('user1');
    await assertFails(
      setDoc(doc(db, collPath, 'fb-bad'), {
        subject: 'Feedback',
        message: 'x'.repeat(5001),
        name: 'Test User',
        email: 'user1@test.com',
        userId: 'user1',
        appVersion: '1.10.0-rc.0',
        deviceType: 'Mozilla/5.0',
        platform: 'Linux x86_64',
        currentPage: 'settings',
        timestamp: '2026-03-10T20:00:00.000Z',
        createdAt: new Date(),
        status: 'new',
      })
    );
  });

  it('no one can read feedback', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'fb2'), { message: 'Secret' });
    });
    const db = ctx.authedDb('user1');
    await assertFails(getDoc(doc(db, collPath, 'fb2')));
  });
});
