/**
 * Firestore Rules — Family Revocation Integrity (FS-01 / FS-01b, bundle B1)
 *
 * Regression suite proving the security invariant:
 *   "Once a family connection is authoritatively disconnected, neither party
 *    can continue reading family-scoped resources solely because that
 *    historical connection once existed."
 *
 * Covers the real shared lifecycle with full fixtures (account with
 * sharedWith + family scope, finance rows via family scope AND stale
 * accountShares, family-category commitment, dashboard subtree), both
 * connection-document UID orderings, direct-path AND collection-group
 * authorization, stranger denial, owner retention, and write denial.
 *
 * @vitest-environment node
 */
// @ts-nocheck

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, collectionGroup, getDocs, query, where,
  describe, it, beforeAll, afterAll, beforeEach, assertSucceeds, assertFails,
  PREFIX, makeTestEnv,
} from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

const OWNER = 'owner-a';
const MEMBER = 'member-b';
const STRANGER = 'stranger-c';

const connPath = (id) => `${PREFIX}/family_connections/${id}`;
const accountPath = `${PREFIX}/users/${OWNER}/accounts/acc1`;
const scopeRowPath = `${PREFIX}/users/${OWNER}/finance/tx-scope-row`;
const indexRowPath = `${PREFIX}/users/${OWNER}/finance/tx-index-row`;
const commitmentPath = `${PREFIX}/users/${OWNER}/commitments/com1`;
const dashboardPath = `${PREFIX}/users/${OWNER}/dashboard/summary`;

/**
 * Seeds a realistic shared-account lifecycle for the (OWNER, MEMBER) pair.
 *
 * `grantMember` controls whether the modern `sharedWith` grant is still present
 * on the account (post-disconnect stale state has it removed by the Functions
 * cleanup while `scope: 'family'` may linger — the worst case the rules must
 * reject).
 */
async function seedLifecycle({ connId = `${OWNER}_${MEMBER}`, status, grantMember = true } = {}) {
  await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
    const fs = c.firestore();

    await setDoc(doc(fs, connPath(connId)), {
      ownerUid: OWNER,
      memberUid: MEMBER,
      status,
      ownerDisplayName: 'Owner A',
      memberDisplayName: 'Member B',
      connectedAt: '2026-01-01T00:00:00.000Z',
    });

    await setDoc(doc(fs, accountPath), {
      name: 'Joint Checking',
      balanceCents: 123456,
      type: 'checking',
      currency: 'NGN',
      scope: 'family',
      shares: {},
      sharedWith: grantMember
        ? { [MEMBER]: { grantedAt: '2026-01-01T00:00:00.000Z', grantedBy: OWNER, permission: 'transact' } }
        : {},
    });

    // Finance row readable via family scope branch (no accountShares).
    await setDoc(doc(fs, scopeRowPath), {
      title: 'Groceries',
      amountCents: 5000,
      type: 'expense',
      date: '2026-01-02',
      accountId: 'acc1',
      accountOwnerId: OWNER,
      scope: 'family',
      isSoftDeleted: false,
    });

    // Finance row readable via the stale row-embedded accountShares index.
    await setDoc(doc(fs, indexRowPath), {
      title: 'Transfer',
      amountCents: 7000,
      type: 'expense',
      date: '2026-01-03',
      accountId: 'acc1',
      accountOwnerId: OWNER,
      isSoftDeleted: false,
      accountShares: { [MEMBER]: true },
    });

    await setDoc(doc(fs, commitmentPath), {
      title: 'Family savings plan',
      completed: false,
      category: 'family',
    });

    await setDoc(doc(fs, dashboardPath), { householdSummary: 'seeded' });
  });
}

// ─── Active connection: legitimate sharing must keep working ────────────────
describe('FS-01 active family: legitimate sharing preserved', () => {
  it.each([`${OWNER}_${MEMBER}`, `${MEMBER}_${OWNER}`])(
    'member CAN read intended resources while connection active (conn doc %s)',
    async (connId) => {
      await seedLifecycle({ connId, status: 'active' });
      const b = ctx.authedDb(MEMBER);

      await assertSucceeds(getDoc(doc(b, accountPath))); // sharedWith grant
      await assertSucceeds(getDoc(doc(b, scopeRowPath))); // family scope + active connection
      await assertSucceeds(getDoc(doc(b, indexRowPath))); // accountShares backed by live grant
      await assertSucceeds(getDoc(doc(b, commitmentPath))); // family-category commitment
      await assertSucceeds(getDoc(doc(b, dashboardPath))); // dashboard subtree
    }
  );

  it('member retains permitted write surface (balance update via transact grant)', async () => {
    await seedLifecycle({ status: 'active' });
    const b = ctx.authedDb(MEMBER);
    await assertSucceeds(updateDoc(doc(b, accountPath), {
      balanceCents: 123457,
      updatedAt: '2026-01-04T00:00:00.000Z',
    }));
  });

  it('member CANNOT mutate authorization surfaces or non-shared resources', async () => {
    await seedLifecycle({ status: 'active' });
    const b = ctx.authedDb(MEMBER);

    await assertFails(updateDoc(doc(b, accountPath), { scope: 'personal' }));
    await assertFails(updateDoc(doc(b, accountPath), { [`sharedWith.${MEMBER}`]: null }));
    await assertFails(updateDoc(doc(b, commitmentPath), { completed: true }));
    await assertFails(updateDoc(doc(b, dashboardPath), { householdSummary: 'hacked' }));
    await assertFails(deleteDoc(doc(b, indexRowPath)));
  });

  it('owner retains full access and stranger remains denied', async () => {
    await seedLifecycle({ status: 'active' });
    const a = ctx.authedDb(OWNER);
    const c = ctx.authedDb(STRANGER);

    for (const p of [accountPath, scopeRowPath, indexRowPath, commitmentPath, dashboardPath]) {
      await assertSucceeds(getDoc(doc(a, p)));
      await assertFails(getDoc(doc(c, p)));
    }
    await assertSucceeds(updateDoc(doc(a, dashboardPath), { householdSummary: 'owned' }));
    await assertFails(updateDoc(doc(c, dashboardPath), { householdSummary: 'nope' }));
  });

  it('non-owner collection-group finance queries are no longer authorized by the stale row index alone', async () => {
    // Rules implication of FS-01b hardening: the mirror rule now requires the
    // CURRENT authoritative account grant per document, which a collection-group
    // query cannot prove from query constraints alone. Members read shared rows
    // via direct paths (covered above); there is no client collection-group
    // finance consumer in the product (verified by code search) — the previous
    // stale-index CG authorization was the FS-01b hole.
    await seedLifecycle({ status: 'active', grantMember: true });
    const b = ctx.authedDb(MEMBER);
    await assertFails(getDocs(collectionGroup(b, 'finance')));
  });
});



// ─── After disconnect: ex-member access must be revoked ─────────────────────
describe('FS-01/FS-01b after disconnect: ex-member denied on every branch', () => {
  // Worst-case stale state: connection disconnected, modern grant removed
  // (Functions cleanup), but `scope: 'family'` and the row-level
  // `accountShares` snapshot linger — exactly what the old rules honored.
  it.each([`${OWNER}_${MEMBER}`, `${MEMBER}_${OWNER}`])(
    'ex-member CANNOT read family resources via stale scope/index (conn doc %s)',
    async (connId) => {
      await seedLifecycle({ connId, status: 'disconnected', grantMember: false });
      const b = ctx.authedDb(MEMBER);

      // 1. account document / balance via scope:'family'
      await assertFails(getDoc(doc(b, accountPath)));
      // 2. finance row via family scope
      await assertFails(getDoc(doc(b, scopeRowPath)));
      // 3. finance row via stale accountShares
      await assertFails(getDoc(doc(b, indexRowPath)));
      // 5. family-category commitment
      await assertFails(getDoc(doc(b, commitmentPath)));
      // 6. dashboard subtree
      await assertFails(getDoc(doc(b, dashboardPath)));
    }
  );

  it('collection-group finance mirror rejects stale accountShares after disconnect', async () => {
    await seedLifecycle({ status: 'disconnected', grantMember: false });
    const b = ctx.authedDb(MEMBER);
    // 4. collection-group finance mirror — stale index must not authorize.
    await assertFails(
      getDocs(query(collectionGroup(b, 'finance'), where(`accountShares.${MEMBER}`, '==', true)))
    );
  });

  it('ex-member CANNOT mutate the resources', async () => {
    await seedLifecycle({ status: 'disconnected', grantMember: false });
    const b = ctx.authedDb(MEMBER);

    await assertFails(updateDoc(doc(b, accountPath), { balanceCents: 1 }));
    await assertFails(updateDoc(doc(b, scopeRowPath), { title: 'x' }));
    await assertFails(updateDoc(doc(b, indexRowPath), { title: 'x' }));
    await assertFails(updateDoc(doc(b, commitmentPath), { completed: true }));
    await assertFails(updateDoc(doc(b, dashboardPath), { householdSummary: 'hacked' }));
  });

  it('intermediate revoking state (post-containment) denies every family branch', async () => {
    // In the real disconnect the containment transaction removes the modern
    // grant ATOMICALLY with the status flip, so the realistic revoking state is
    // grant-removed. Every family-membership branch must already be severed.
    await seedLifecycle({ status: 'revoking', grantMember: false });
    const b = ctx.authedDb(MEMBER);

    await assertFails(getDoc(doc(b, accountPath)));
    await assertFails(getDoc(doc(b, scopeRowPath)));
    await assertFails(getDoc(doc(b, indexRowPath)));
    await assertFails(getDoc(doc(b, commitmentPath)));
    await assertFails(getDoc(doc(b, dashboardPath)));
  });

  it('owner access is unaffected and stranger remains denied after disconnect', async () => {
    await seedLifecycle({ status: 'disconnected', grantMember: false });
    const a = ctx.authedDb(OWNER);
    const c = ctx.authedDb(STRANGER);

    for (const p of [accountPath, scopeRowPath, indexRowPath, commitmentPath, dashboardPath]) {
      await assertSucceeds(getDoc(doc(a, p)));
      await assertFails(getDoc(doc(c, p)));
    }
  });

  it('unrelated user with no connection history cannot read family docs', async () => {
    await seedLifecycle({ status: 'disconnected', grantMember: false });
    const c = ctx.authedDb(STRANGER);
    await assertFails(getDoc(doc(c, accountPath)));
    await assertFails(getDoc(doc(c, indexRowPath)));
  });
});

// ─── accountShares without current authoritative backing ────────────────────
describe('FS-01b edge: accountShares row without current grant or account', () => {
  it('row index alone never authorizes: missing account doc denies member, owner still reads', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      const fs = c.firestore();
      await setDoc(doc(fs, indexRowPath), {
        title: 'Orphan row',
        amountCents: 100,
        type: 'expense',
        date: '2026-01-05',
        accountId: 'deleted-account',
        accountOwnerId: OWNER,
        isSoftDeleted: false,
        accountShares: { [MEMBER]: true },
      });
    });
    const b = ctx.authedDb(MEMBER);
    const a = ctx.authedDb(OWNER);
    await assertFails(getDoc(doc(b, indexRowPath)));
    await assertSucceeds(getDoc(doc(a, indexRowPath))); // owner branch unaffected
  });

  it('active grant on the account keeps the row readable (active sharing intact)', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      const fs = c.firestore();
      await setDoc(doc(fs, connPath(`${OWNER}_${MEMBER}`)), {
        ownerUid: OWNER, memberUid: MEMBER, status: 'active',
      });
      await setDoc(doc(fs, accountPath), {
        name: 'Joint Checking', balanceCents: 1, type: 'checking', currency: 'NGN',
        scope: 'family', shares: {},
        sharedWith: { [MEMBER]: { grantedAt: 'x', grantedBy: OWNER, permission: 'transact' } },
      });
      await setDoc(doc(fs, indexRowPath), {
        title: 'Shared row', amountCents: 100, type: 'expense', date: '2026-01-05',
        accountId: 'acc1', accountOwnerId: OWNER, isSoftDeleted: false,
        accountShares: { [MEMBER]: true },
      });
    });
    const b = ctx.authedDb(MEMBER);
    await assertSucceeds(getDoc(doc(b, indexRowPath)));
  });
});
