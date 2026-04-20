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

import { doc, getDoc, setDoc, deleteDoc, describe, it, beforeAll, afterAll, beforeEach, assertSucceeds, assertFails, PREFIX, makeTestEnv } from './firestore-rules.helpers';

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
        title: 'Private transaction',
        amountCents: 5000,
        ownerId: 'victim',
      });
    });
  });

  it('attacker cannot read another user account', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(getDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1`)));
  });

  it('attacker cannot write to another user account', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(
      setDoc(doc(db, `${PREFIX}/users/victim/accounts/acct2`), {
        ownerId: 'attacker',
        name: 'Injected',
        balance: 0,
      })
    );
  });

  it('attacker cannot read another user transaction', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(
      getDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1/transactions/tx1`))
    );
  });

  it('attacker cannot delete another user account', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(deleteDoc(doc(db, `${PREFIX}/users/victim/accounts/acct1`)));
  });
});

// ─── Post-disconnect access revocation ───────────────────────────────────────
describe('post-disconnect access revocation', () => {
  beforeEach(async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), `${PREFIX}/users/owner/accounts/shared-acct`), {
        ownerId: 'owner',
        name: 'Joint Account',
        sharedWith: {},
      });
    });
  });

  it('ex-member has no read access after disconnect', async () => {
    const db = ctx.authedDb('ex-member');
    await assertFails(getDoc(doc(db, `${PREFIX}/users/owner/accounts/shared-acct`)));
  });

  it('unauthenticated user has no access to any account', async () => {
    const db = ctx.unauthDb();
    await assertFails(getDoc(doc(db, `${PREFIX}/users/owner/accounts/shared-acct`)));
  });
});

// ─── Security invariants ─────────────────────────────────────────────────────
describe('security invariants', () => {
  it('owner field cannot be overwritten by a non-owner', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), `${PREFIX}/users/alice/accounts/acct99`), {
        ownerId: 'alice',
        name: 'Alice Savings',
        sharedWith: {},
      });
    });
    const db = ctx.authedDb('mallory');
    await assertFails(
      setDoc(doc(db, `${PREFIX}/users/alice/accounts/acct99`), {
        ownerId: 'mallory',
        name: 'Hijacked',
        sharedWith: {},
      })
    );
  });

  it('unauthenticated requests are always denied', async () => {
    const db = ctx.unauthDb();
    await assertFails(
      setDoc(doc(db, `${PREFIX}/users/anyuser/accounts/acct1`), {
        ownerId: 'anyuser',
        name: 'Should fail',
        balance: 0,
      })
    );
  });

  it('random collection paths are denied for authenticated users', async () => {
    const db = ctx.authedDb('user1');
    await assertFails(setDoc(doc(db, 'internal/config'), { secret: 'stolen' }));
  });
});
