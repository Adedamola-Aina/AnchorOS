/**
 * Firestore Rules — Security invariants (IDOR, post-disconnect, default deny)
 *
 * Covers:
 * - IDOR: cross-user data access prevention
 * - Post-disconnect access revocation
 * - Default deny for unmatched paths
 * - Security invariants (ownerId immutability, unauth always denied)
 *
 * @vitest-environment node
 */
// @ts-nocheck

import { doc, getDoc, setDoc, deleteDoc, describe, it, beforeAll, afterAll, beforeEach, assertFails, PREFIX, makeTestEnv } from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

// ─── Default deny ───────────────────────────────────────────────────────────
describe('default deny', () => {
  it('unmatched paths are denied', async () => {
    const db = ctx.authedDb('user1');
    await assertFails(setDoc(doc(db, 'random/collection'), { data: 'test' }));
  });
});

// ─── IDOR: cross-user data access ────────────────────────────────────────────
describe('IDOR: cross-user data access', () => {
  beforeEach(async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      const db = c.firestore();
      await setDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1`), {
        ownerId: 'victim',
        name: 'Victim Checking',
        balance: 100000,
      });
      await setDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1/transactions/tx1`), {
        title: 'Private transaction', amount: 5000,
      });
    });
  });

  it('attacker cannot read another user account', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(getDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1`)));
  });

  it('attacker cannot write another user account', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(setDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1`), { ownerId: 'attacker' }));
  });

  it('attacker cannot delete another user account', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(deleteDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1`)));
  });
});

// ─── Unauthenticated access ─────────────────────────────────────────────────
describe('unauthenticated access', () => {
  it('cannot read user data', async () => {
    const db = ctx.unauthDb();
    await assertFails(getDoc(doc(db, `${PREFIX}/users/user1`)));
  });

  it('cannot write user data', async () => {
    const db = ctx.unauthDb();
    await assertFails(setDoc(doc(db, `${PREFIX}/users/user1`), { name: 'x' }));
  });
});

// ─── Post-disconnect access revocation ──────────────────────────────────────
describe('post-disconnect family access revocation', () => {
  beforeEach(async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      const db = c.firestore();
      await setDoc(doc(db, `${PREFIX}/users/owner/accounts/family-acct`), {
        ownerId: 'owner', name: 'Family Account', balanceCents: 100000,
        type: 'checking', currency: 'NGN', scope: 'family', sharedWith: {}, shares: {},
      });
    });
  });

  it('family-scoped account is denied when no active connection exists', async () => {
    const db = ctx.authedDb('member');
    await assertFails(getDoc(doc(db, `${PREFIX}/users/owner/accounts/family-acct`)));
  });
});
