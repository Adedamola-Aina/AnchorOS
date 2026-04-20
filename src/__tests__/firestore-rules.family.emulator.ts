/**
 * Firestore Rules — Family collections (SEC-1, SEC-2, legacy invitations)
 *
 * Covers:
 * - SEC-1: family_invitations (owner/invitee-only access)
 * - SEC-2: family_connections (party-only access)
 *
 * @vitest-environment node
 */
// @ts-nocheck

import { doc, getDoc, setDoc, deleteDoc, updateDoc, describe, it, beforeAll, afterAll, beforeEach, assertSucceeds, assertFails, PREFIX, makeTestEnv } from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

// ─── SEC-1: family_invitations ──────────────────────────────────────────────
describe('family_invitations (SEC-1)', () => {
  const collPath = `${PREFIX}/family_invitations`;

  it('owner can read their own invitation', async () => {
    const db = ctx.authedDb('owner1');
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'inv1'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    await assertSucceeds(getDoc(doc(db, collPath, 'inv1')));
  });

  it('invitee can read invitation by email', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'inv2'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.authedDb('bob', 'bob@test.com');
    await assertSucceeds(getDoc(doc(db, collPath, 'inv2')));
  });

  it('random user cannot read another users invitation', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'inv3'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.authedDb('stranger');
    await assertFails(getDoc(doc(db, collPath, 'inv3')));
  });

  it('owner cannot create invitation directly (server-only write path)', async () => {
    const db = ctx.authedDb('owner1');
    await assertFails(
      setDoc(doc(db, collPath, 'inv4'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      })
    );
  });

  it('user cannot create invitation for another user', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(
      setDoc(doc(db, collPath, 'inv5'), {
        ownerUid: 'victim',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      })
    );
  });

  it('owner cannot delete invitation directly (server-only write path)', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'inv6'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.authedDb('owner1');
    await assertFails(deleteDoc(doc(db, collPath, 'inv6')));
  });

  it('invitee cannot delete the invitation', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'inv7'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.authedDb('bob', 'bob@test.com');
    await assertFails(deleteDoc(doc(db, collPath, 'inv7')));
  });

  it('unauthenticated user cannot read invitations', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'inv8'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = ctx.unauthDb();
    await assertFails(getDoc(doc(db, collPath, 'inv8')));
  });
});

// ─── SEC-2: family_connections ──────────────────────────────────────────────
describe('family_connections (SEC-2)', () => {
  const collPath = `${PREFIX}/family_connections`;

  it('owner party can read their connection', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = ctx.authedDb('owner1');
    await assertSucceeds(getDoc(doc(db, collPath, 'owner1_member1')));
  });

  it('member party can read their connection', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = ctx.authedDb('member1');
    await assertSucceeds(getDoc(doc(db, collPath, 'owner1_member1')));
  });

  it('random user cannot read others connection', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = ctx.authedDb('stranger');
    await assertFails(getDoc(doc(db, collPath, 'owner1_member1')));
  });

  it('party cannot create connection directly (server-only write path)', async () => {
    const db = ctx.authedDb('owner1');
    await assertFails(
      setDoc(doc(db, collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      })
    );
  });

  it('non-party cannot create connection for others', async () => {
    const db = ctx.authedDb('attacker');
    await assertFails(
      setDoc(doc(db, collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      })
    );
  });

  it('party cannot update connection directly (server-only write path)', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = ctx.authedDb('member1');
    await assertFails(
      updateDoc(doc(db, collPath, 'owner1_member1'), { status: 'disconnected' })
    );
  });
});

