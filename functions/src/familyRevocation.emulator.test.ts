/**
 * Family Revocation — Functions integration tests (FS-01/FS-01b/FS-04, bundle B1)
 *
 * Runs against the REAL Firestore emulator (firebase-admin → FIRESTORE_EMULATOR_HOST)
 * so transaction, concurrency and idempotency properties are proven against
 * actual backend behavior — not mocked away.
 *
 * Usage:
 *   npm run test:functions:emulator
 *   (firebase emulators:exec --only firestore "npx vitest run
 *        --config functions/vitest.emulator.config.ts")
 *
 * @vitest-environment node
 */

import { beforeEach, afterAll, describe, expect, it, vi } from 'vitest';

// Must be set before ./config initializes firebase-admin.
//
// The project id is PINNED, never inherited: `firebase emulators:exec --project
// demo-anchor-os` exports GCLOUD_PROJECT, so inheriting it would point this suite
// (and its fixtures) at shared development data.
vi.hoisted(() => {
  process.env.GCLOUD_PROJECT = 'anchor-os-family-emulator-test';
  // FIREBASE_CONFIG takes precedence for project resolution, so pin it as well.
  process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: 'anchor-os-family-emulator-test' });

  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
    throw new Error('Family revocation tests require a loopback Firestore emulator');
  }
  process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
});

// Expose the raw handlers (skip the onCall/AppCheck wrapper), keep everything
// else — config, helpers (audit/notification writes), cleanup — REAL.
vi.mock('./callable', () => ({
  secureOnCall: <T, R>(handler: (request: T) => R) => handler,
}));
vi.mock('./rateLimit', () => ({
  enforceRateLimit: async () => undefined,
}));

import { db, APP_ID } from './config';
import { disconnectFamilyCore } from './familyDisconnect';
import { shareAccountCore } from './familySharing';
import {
  cleanupFamilyGrants,
  CLEANUP_BATCH_SIZE,
  type FamilyGrantCleanupCounts,
} from './familyRevocationCleanup';
import { migration002FamilyRevocationCleanup } from './migrations/migrations/002_family_revocation_cleanup';

const connRef = (connId: string) =>
  db.doc(`artifacts/${APP_ID}/family_connections/${connId}`);
const accountRef = (uid: string, id: string) =>
  db.doc(`artifacts/${APP_ID}/users/${uid}/accounts/${id}`);
const financeRef = (uid: string, id: string) =>
  db.doc(`artifacts/${APP_ID}/users/${uid}/finance/${id}`);

const OWNER = 'fn-owner';
const MEMBER = 'fn-member';
const connId = `${OWNER}_${MEMBER}`;

/**
 * B1 rollout-safety: migration apply mode is fail-closed. The existing
 * migration apply tests set a valid bound; the dedicated fail-closed suite
 * below manipulates the bound directly to prove the invariant.
 */
const APPLY_BOUND = '10';
function enableApplyBound(): void {
  process.env.FS01_CLEANUP_MAX_CONNECTIONS = APPLY_BOUND;
}
function disableApplyBound(): void {
  delete process.env.FS01_CLEANUP_MAX_CONNECTIONS;
}

async function seedActivePair({ withStaleRow = true } = {}) {
  await connRef(connId).set({
    ownerUid: OWNER,
    memberUid: MEMBER,
    status: 'active',
    ownerDisplayName: 'Owner',
    memberDisplayName: 'Member',
    connectedAt: '2026-01-01T00:00:00.000Z',
  });
  await accountRef(OWNER, 'acc1').set({
    name: 'Joint Checking',
    balanceCents: 1234,
    type: 'checking',
    currency: 'NGN',
    scope: 'family',
    shares: {},
    sharedWith: {
      [MEMBER]: { grantedAt: '2026-01-01T00:00:00.000Z', grantedBy: OWNER, permission: 'transact' },
    },
  });
  if (withStaleRow) {
    // Row embedding the member in accountShares (FS-01b stale index).
    await financeRef(OWNER, 'tx1').set({
      title: 'seed',
      amountCents: 500,
      type: 'expense',
      date: '2026-01-02',
      accountId: 'acc1',
      accountOwnerId: OWNER,
      scope: 'family',
      isSoftDeleted: false,
      accountShares: { [MEMBER]: true },
    });
    // Row in the MEMBER's tree embedding the OWNER (ex-member read direction).
    await financeRef(MEMBER, 'tx-m1').set({
      title: 'member row',
      amountCents: 300,
      type: 'expense',
      date: '2026-01-03',
      accountId: 'acc-m1',
      accountOwnerId: MEMBER,
      isSoftDeleted: false,
      accountShares: { [OWNER]: true },
    });
  }
}

async function getConnectionStatus(): Promise<string | undefined> {
  const snap = await connRef(connId).get();
  return snap.data()?.status;
}

async function getAccount(): Promise<Record<string, any>> {
  const snap = await accountRef(OWNER, 'acc1').get();
  return snap.data() ?? {};
}

afterAll(async () => {
  await db.terminate();
});

describe('disconnectFamilyCore (FS-01/FS-04)', () => {
  beforeEach(async () => {
    await db.recursiveDelete(db.doc(`artifacts/${APP_ID}`));
  });

  it('disconnect removes grants, resets family scope and strips stale row indexes', async () => {
    await seedActivePair();

    const result = await disconnectFamilyCore(OWNER);

    expect(result.success).toBe(true);
    expect(result.alreadyDisconnected).toBeFalsy();
    expect(await getConnectionStatus()).toBe('disconnected');

    const account = await getAccount();
    expect(account.sharedWith?.[MEMBER]).toBeUndefined();
    expect(account.scope).toBe('personal'); // canonical non-family scope
    expect(account.balanceCents).toBe(1234); // unrelated state preserved
    expect(account.name).toBe('Joint Checking');

    const ownerRow = (await financeRef(OWNER, 'tx1').get()).data() ?? {};
    expect(ownerRow.accountShares?.[MEMBER]).toBeUndefined();
    expect(ownerRow.amountCents).toBe(500); // financial content untouched
    expect(ownerRow.accountId).toBe('acc1');

    const memberRow = (await financeRef(MEMBER, 'tx-m1').get()).data() ?? {};
    expect(memberRow.accountShares?.[OWNER]).toBeUndefined(); // both directions

    const counts = result.cleanup as FamilyGrantCleanupCounts;
    // The modern grant is removed ATOMICALLY in the containment transaction,
    // so phase-2 cleanup finds nothing left to remove on the account — only
    // the stale scope flag and the stale row indexes remain for it.
    expect(counts.accountsUpdated).toBe(0);
    expect(counts.accountScopesReset).toBe(1);
    expect(counts.financeRowsUpdated).toBe(2);
  });

  it('works when initiated by the member (either party can disconnect)', async () => {
    await seedActivePair();
    const result = await disconnectFamilyCore(MEMBER);
    expect(result.success).toBe(true);
    expect(await getConnectionStatus()).toBe('disconnected');
    expect((await getAccount()).sharedWith?.[MEMBER]).toBeUndefined();
  });

  it('repeated disconnect is idempotent — no corruption, no grant resurrection', async () => {
    await seedActivePair();

    const first = await disconnectFamilyCore(OWNER);
    expect(first.success).toBe(true);

    const second = await disconnectFamilyCore(OWNER);
    expect(second.success).toBe(true);
    expect(second.alreadyDisconnected).toBe(true);

    const account = await getAccount();
    expect(account.sharedWith?.[MEMBER]).toBeUndefined();
    expect(account.scope).toBe('personal');
    expect(await getConnectionStatus()).toBe('disconnected');

    const ownerRow = (await financeRef(OWNER, 'tx1').get()).data() ?? {};
    expect(ownerRow.accountShares?.[MEMBER]).toBeUndefined();
  });

  it('partial failure: authorization already revoked, retry completes cleanup safely', async () => {
    await seedActivePair();

    // Inject failure at the first finance cleanup batch.
    const injected = new Error('injected cleanup failure');
    await expect(
      disconnectFamilyCore(OWNER, {
        cleanupOptions: {
          failBatchPredicate: (phase: string, batchIndex: number) =>
            phase === 'finance' && batchIndex === 0 ? injected : null,
        },
      })
    ).rejects.toThrow('injected cleanup failure');

    // Containment (status flip + atomic grant removal) committed BEFORE the
    // failure — a failed disconnect must not leave modern grants live.
    expect(await getConnectionStatus()).toBe('revoking');
    expect((await getAccount()).sharedWith?.[MEMBER]).toBeUndefined();

    // Retry after unknown client/network result is safe and resumable.
    const retry = await disconnectFamilyCore(OWNER);
    expect(retry.success).toBe(true);
    expect(retry.resumed).toBe(true);
    expect(await getConnectionStatus()).toBe('disconnected');

    const ownerRow = (await financeRef(OWNER, 'tx1').get()).data() ?? {};
    expect(ownerRow.accountShares?.[MEMBER]).toBeUndefined();
    expect((await getAccount()).scope).toBe('personal');
  });

  it('rejects disconnect when no connection exists', async () => {
    await expect(disconnectFamilyCore('nobody')).rejects.toMatchObject({
      code: 'failed-precondition',
    });
  });
});



describe('shareAccountCore vs disconnect race (FS-04)', () => {
  beforeEach(async () => {
    await db.recursiveDelete(db.doc(`artifacts/${APP_ID}`));
  });

  it('a share racing an in-flight disconnect can never resurrect access', async () => {
    // Run several interleavings — whichever wins, the invariant must hold:
    // final state is disconnected with NO member grant and NO family scope.
    for (let i = 0; i < 4; i++) {
      await seedActivePair({ withStaleRow: false });

      const sharePromise = shareAccountCore(OWNER, 'acc1', true).catch(
        (err: { code?: string }) => ({ rejected: true, code: err.code })
      );
      const disconnectPromise = disconnectFamilyCore(OWNER);

      const [shareOutcome] = await Promise.all([sharePromise, disconnectPromise]);

      expect(await getConnectionStatus()).toBe('disconnected');
      const account = await getAccount();
      expect(account.sharedWith?.[MEMBER]).toBeUndefined();
      expect(account.scope).toBe('personal');

      // If the share transaction lost the race it must have been rejected —
      // never silently re-applied on top of a revoked connection.
      if (shareOutcome && typeof shareOutcome === 'object' && 'rejected' in shareOutcome) {
        expect(shareOutcome.code).toBe('failed-precondition');
      }

      await db.recursiveDelete(db.doc(`artifacts/${APP_ID}`));
    }
  });

  it('share is rejected at the write boundary once the connection ceased being active', async () => {
    await seedActivePair({ withStaleRow: false });

    // Simulate the disconnect winning the race: containment committed
    // (grants atomically removed + status revoking), then a stale share
    // request arrives with a pre-check that no longer reflects reality.
    await disconnectFamilyCore(OWNER);
    await expect(shareAccountCore(OWNER, 'acc1', true)).rejects.toMatchObject({
      code: 'failed-precondition',
    });
    expect((await getAccount()).sharedWith?.[MEMBER]).toBeUndefined();
    expect((await getAccount()).scope).toBe('personal');

    // Even with the status field manually reverted to 'active', the
    // authoritative write-boundary re-check runs against the actual
    // connection document — grants are only created from a truly active
    // state, never resurrected from cleanup residue.
    await connRef(connId).update({ status: 'active' });
    await shareAccountCore(OWNER, 'acc1', true);
    const account = await getAccount();
    expect(account.sharedWith?.[MEMBER]?.permission).toBe('transact');
    expect(account.scope).toBe('family');
  });

  it('unshare returns the account to personal scope when the last grant is removed', async () => {
    await seedActivePair({ withStaleRow: false });

    await shareAccountCore(OWNER, 'acc1', false);

    const account = await getAccount();
    expect(account.sharedWith?.[MEMBER]).toBeUndefined();
    expect(account.scope).toBe('personal');
  });
});

describe('cleanupFamilyGrants idempotency', () => {
  beforeEach(async () => {
    await db.recursiveDelete(db.doc(`artifacts/${APP_ID}`));
  });

  it('rerunning produces no further changes (converges to no-op)', async () => {
    await seedActivePair();

    const first: FamilyGrantCleanupCounts = await cleanupFamilyGrants(db, OWNER, MEMBER);
    expect(first.accountsUpdated).toBe(1);
    expect(first.accountScopesReset).toBe(1);
    expect(first.financeRowsUpdated).toBe(2);

    const second: FamilyGrantCleanupCounts = await cleanupFamilyGrants(db, OWNER, MEMBER);
    expect(second.accountsUpdated).toBe(0);
    expect(second.accountScopesReset).toBe(0);
    expect(second.financeRowsUpdated).toBe(0);
  });

  it('rotates the account WriteBatch after each full commit (> CLEANUP_BATCH_SIZE accounts)', async () => {
    // A Firestore WriteBatch is single-use after commit. Force MORE than one
    // full account-cleanup chunk to prove a fresh batch is allocated after
    // each commit — the second chunk must commit successfully, not throw on
    // the reused batch.
    const qualifyingAccounts = CLEANUP_BATCH_SIZE + 1; // 251

    const seed = db.batch();
    for (let i = 0; i < qualifyingAccounts; i++) {
      seed.set(accountRef(OWNER, `acc-${i}`), {
        name: `Account ${i}`,
        balanceCents: i,
        type: 'checking',
        currency: 'NGN',
        scope: 'family',
        shares: {},
        sharedWith: {
          [MEMBER]: { grantedAt: '2026-01-01T00:00:00.000Z', grantedBy: OWNER, permission: 'transact' },
        },
      });
    }
    await seed.commit();

    const counts: FamilyGrantCleanupCounts = await cleanupFamilyGrants(db, OWNER, MEMBER);

    // First chunk (250) AND second chunk (1) both committed.
    expect(counts.batchesCommitted).toBe(2);
    expect(counts.accountsScanned).toBe(qualifyingAccounts);
    expect(counts.accountsUpdated).toBe(qualifyingAccounts);
    expect(counts.accountScopesReset).toBe(qualifyingAccounts);

    // Every qualifying account — across BOTH chunks — was corrected.
    const accountsSnap = await db
      .collection(`artifacts/${APP_ID}/users/${OWNER}/accounts`)
      .get();
    let personal = 0;
    let withGrant = 0;
    accountsSnap.forEach((d: { data: () => Record<string, any> }) => {
      const data = d.data();
      if (data.scope === 'personal') personal += 1;
      if (data.sharedWith?.[MEMBER] !== undefined) withGrant += 1;
    });
    expect(personal).toBe(qualifyingAccounts);
    expect(withGrant).toBe(0);

    // Rerun is a no-op (idempotent).
    const second: FamilyGrantCleanupCounts = await cleanupFamilyGrants(db, OWNER, MEMBER);
    expect(second.accountsUpdated).toBe(0);
    expect(second.accountScopesReset).toBe(0);
    expect(second.financeRowsUpdated).toBe(0);
    expect(second.batchesCommitted).toBe(0);
  });
});

describe('migration 002 — family revocation cleanup', () => {
  const ACTIVE_OWNER = 'mig-active-owner';
  const ACTIVE_MEMBER = 'mig-active-member';
  const activeConn = `${ACTIVE_OWNER}_${ACTIVE_MEMBER}`;

  beforeEach(async () => {
    enableApplyBound();
    await db.recursiveDelete(db.doc(`artifacts/${APP_ID}`));
  });

  afterAll(() => {
    disableApplyBound();
  });

  it('dry-run reports counts without mutation', async () => {
    await seedActivePair();
    await connRef(connId).update({ status: 'disconnected' });

    const result = await migration002FamilyRevocationCleanup.up({
      db,
      appId: APP_ID,
      dryRun: true,
      callerUid: 'migration-test',
    });

    expect(result.processed).toBe(1);
    expect(result.modified).toBe(1);
    expect(result.errors).toEqual([]);

    // Nothing mutated.
    expect((await getAccount()).sharedWith?.[MEMBER]).toBeDefined();
    expect((await getAccount()).scope).toBe('family');
    expect(((await financeRef(OWNER, 'tx1').get()).data() ?? {}).accountShares?.[MEMBER]).toBe(true);
    expect(await getConnectionStatus()).toBe('disconnected');
  });

  it('apply corrects only disconnected pairs and leaves active pairs untouched', async () => {
    // Disconnected pair with stale state.
    await seedActivePair();
    await connRef(connId).update({ status: 'disconnected' });

    // Active pair with identical stale-looking state — must NOT be touched.
    await connRef(activeConn).set({
      ownerUid: ACTIVE_OWNER, memberUid: ACTIVE_MEMBER, status: 'active',
      ownerDisplayName: 'O', memberDisplayName: 'M',
    });
    await accountRef(ACTIVE_OWNER, 'acc-a').set({
      name: 'Active', balanceCents: 10, type: 'checking', currency: 'NGN',
      scope: 'family', shares: {},
      sharedWith: { [ACTIVE_MEMBER]: { grantedAt: 'x', grantedBy: ACTIVE_OWNER, permission: 'transact' } },
    });
    await financeRef(ACTIVE_OWNER, 'tx-a').set({
      title: 'active row', amountCents: 1, type: 'expense', date: '2026-01-01',
      accountId: 'acc-a', accountOwnerId: ACTIVE_OWNER, isSoftDeleted: false,
      accountShares: { [ACTIVE_MEMBER]: true },
    });

    const result = await migration002FamilyRevocationCleanup.up({
      db,
      appId: APP_ID,
      dryRun: false,
      callerUid: 'migration-test',
    });

    expect(result.processed).toBe(1); // only the disconnected pair is in scope

    // Disconnected pair corrected.
    const account = await getAccount();
    expect(account.sharedWith?.[MEMBER]).toBeUndefined();
    expect(account.scope).toBe('personal');
    expect(((await financeRef(OWNER, 'tx1').get()).data() ?? {}).accountShares?.[MEMBER]).toBeUndefined();

    // Active pair untouched.
    const activeAccount = (await accountRef(ACTIVE_OWNER, 'acc-a').get()).data() ?? {};
    expect(activeAccount.scope).toBe('family');
    expect(activeAccount.sharedWith?.[ACTIVE_MEMBER]).toBeDefined();
    expect(((await financeRef(ACTIVE_OWNER, 'tx-a').get()).data() ?? {}).accountShares?.[ACTIVE_MEMBER]).toBe(true);
    expect((await connRef(activeConn).get()).data()?.status).toBe('active');
  });

  it('second apply is a no-op (idempotent)', async () => {
    await seedActivePair();
    await connRef(connId).update({ status: 'disconnected' });

    const first = await migration002FamilyRevocationCleanup.up({
      db, appId: APP_ID, dryRun: false, callerUid: 'migration-test',
    });
    expect(first.processed).toBe(1);
    expect(first.modified).toBe(1);

    const second = await migration002FamilyRevocationCleanup.up({
      db, appId: APP_ID, dryRun: false, callerUid: 'migration-test',
    });
    expect(second.processed).toBe(1);
    expect(second.modified).toBe(0);
    expect(second.skipped).toBe(1);
  });
});

/**
 * B1 rollout-safety (initiative #118): the per-invocation connection bound
 * `FS01_CLEANUP_MAX_CONNECTIONS` must be fail-closed in apply mode. Every
 * invalid configuration aborts BEFORE processing/mutating any connection;
 * a valid bound caps the number of connections processed per invocation;
 * dry-run intentionally remains unbounded when the bound is absent.
 */
describe('migration 002 connection bound (fail-closed apply)', () => {
  beforeEach(async () => {
    disableApplyBound();
    await db.recursiveDelete(db.doc(`artifacts/${APP_ID}`));
  });
  afterAll(() => {
    disableApplyBound();
  });

  const BOUND_OWNER = 'b1-owner';
  const BOUND_MEMBER = 'b1-member';
  const pairConnId = (owner: string, member: string) => `${owner}_${member}`;

  /** Seed `count` DISCONNECTED pairs, each with stale grant state. */
  async function seedDisconnectedPairs(count: number): Promise<void> {
    for (let i = 0; i < count; i += 1) {
      const owner = `${BOUND_OWNER}-${i}`;
      const member = `${BOUND_MEMBER}-${i}`;
      await connRef(pairConnId(owner, member)).set({
        ownerUid: owner, memberUid: member, status: 'disconnected',
        ownerDisplayName: `O-${i}`, memberDisplayName: `M-${i}`,
      });
      await accountRef(owner, `acc-${i}`).set({
        name: `Joint ${i}`, balanceCents: 100 + i, type: 'checking',
        currency: 'NGN', scope: 'family', shares: {},
        sharedWith: {
          [member]: { grantedAt: '2026-01-01T00:00:00.000Z', grantedBy: owner, permission: 'transact' },
        },
      });
      await financeRef(owner, `tx-${i}`).set({
        title: `stale row ${i}`, amountCents: 10 + i, type: 'expense',
        date: '2026-01-02', accountId: `acc-${i}`, accountOwnerId: owner,
        isSoftDeleted: false, accountShares: { [member]: true },
      });
    }
  }

  const pairAccount = (i: number) => accountRef(`${BOUND_OWNER}-${i}`, `acc-${i}`);
  const pairRow = (i: number) => financeRef(`${BOUND_OWNER}-${i}`, `tx-${i}`);

  async function expectUntouched(i: number): Promise<void> {
    const account = (await pairAccount(i).get()).data() ?? {};
    expect(account.sharedWith?.[`${BOUND_MEMBER}-${i}`]).toBeDefined();
    expect(account.scope).toBe('family');
    expect(((await pairRow(i).get()).data() ?? {}).accountShares?.[`${BOUND_MEMBER}-${i}`]).toBe(true);
  }

  async function expectCleaned(i: number): Promise<void> {
    const account = (await pairAccount(i).get()).data() ?? {};
    expect(account.sharedWith?.[`${BOUND_MEMBER}-${i}`]).toBeUndefined();
    expect(account.scope).toBe('personal');
    expect(((await pairRow(i).get()).data() ?? {}).accountShares?.[`${BOUND_MEMBER}-${i}`]).toBeUndefined();
  }

  async function runBound(dryRun: boolean) {
    return migration002FamilyRevocationCleanup.up({
      db, appId: APP_ID, dryRun, callerUid: 'b1-bound-test',
    });
  }

  const EXPECTED_BOUND_ERROR = 'FS01_CLEANUP_MAX_CONNECTIONS must be a positive integer for apply mode';

  async function expectApplyFailsBeforeMutation(boundValue: string | undefined): Promise<void> {
    await seedDisconnectedPairs(1);

    if (boundValue === undefined) {
      delete process.env.FS01_CLEANUP_MAX_CONNECTIONS;
    } else {
      process.env.FS01_CLEANUP_MAX_CONNECTIONS = boundValue;
    }

    await expect(runBound(false)).rejects.toThrow(EXPECTED_BOUND_ERROR);

    // Fail-closed proof: product data is EXACTLY as seeded — the run aborted
    // before processing/mutating any connection.
    await expectUntouched(0);
  }

  it('apply + missing bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation(undefined);
  });

  it('apply + non-numeric bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation('12abc');
  });

  it('apply + non-integer bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation('2.5');
  });

  it('apply + zero bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation('0');
  });

  it('apply + negative bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation('-3');
  });

  it('apply + whitespace-only bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation('   ');
  });

  it('apply + numeric-injection bound fails before mutation', async () => {
    await expectApplyFailsBeforeMutation('1e2');
  });

  it('apply + valid bound processes at most that many connections', async () => {
    await seedDisconnectedPairs(2);
    process.env.FS01_CLEANUP_MAX_CONNECTIONS = '1';

    const result = await runBound(false);

    // Exactly one connection processed — the second is out of scope.
    expect(result.processed).toBe(1);
    expect(result.errors).toEqual([]);
    await expectCleaned(0);
    await expectUntouched(1);
  });

  it('apply + bound larger than the target set cleans everything', async () => {
    await seedDisconnectedPairs(2);
    process.env.FS01_CLEANUP_MAX_CONNECTIONS = '10';

    const result = await runBound(false);

    expect(result.processed).toBe(2);
    expect(result.errors).toEqual([]);
    await expectCleaned(0);
    await expectCleaned(1);
  });

  it('dry-run without a bound remains intentionally unbounded (full counting, no mutation)', async () => {
    await seedDisconnectedPairs(2);

    const result = await runBound(true);

    // Both pairs counted — dry-run counting is intentionally unbounded.
    expect(result.processed).toBe(2);
    expect(result.errors).toEqual([]);

    // Nothing mutated.
    await expectUntouched(0);
    await expectUntouched(1);
  });

  it('dry-run honors a present valid bound without mutation', async () => {
    await seedDisconnectedPairs(2);
    process.env.FS01_CLEANUP_MAX_CONNECTIONS = '1';

    const result = await runBound(true);

    expect(result.processed).toBe(1);
    await expectUntouched(0);
    await expectUntouched(1);
  });

  it('dry-run with an invalid bound fails (bound must be valid whenever present)', async () => {
    await seedDisconnectedPairs(1);
    process.env.FS01_CLEANUP_MAX_CONNECTIONS = 'abc';

    await expect(runBound(true)).rejects.toThrow(EXPECTED_BOUND_ERROR);
    await expectUntouched(0);
  });
});

