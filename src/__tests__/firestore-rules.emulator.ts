/**
 * Firestore Security Rules Unit Tests
 *
 * Tests the hardened Firestore rules for:
 * - SEC-1: family_invitations (owner/invitee-only access)
 * - SEC-2: family_connections (party-only access)
 * - SEC-6: legacy invitations (auth required for get)
 * - Core collections (users, accounts, audit_log, feedback)
 *
 * Run: firebase emulators:exec --only firestore "npx vitest run src/__tests__/firestore-rules.test.ts"
 *
 * @vitest-environment node
 */
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, setLogLevel } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

const PROJECT_ID = `rules-test-${Date.now()}`;
const RULES_PATH = resolve(__dirname, '../../firestore.rules');

let testEnv: RulesTestEnvironment;

// Helper: get Firestore for a specific authenticated user
function authedDb(uid: string, email = `${uid}@test.com`) {
  return testEnv
    .authenticatedContext(uid, { email })
    .firestore();
}

// Helper: get Firestore for unauthenticated user
function unauthDb() {
  return testEnv.unauthenticatedContext().firestore();
}

// Collection path prefix
const PREFIX = 'artifacts/anchor-os';

beforeAll(async () => {
  setLogLevel('error');
  const rules = readFileSync(RULES_PATH, 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

// ─── SEC-1: family_invitations ──────────────────────────────────────────────
describe('family_invitations (SEC-1)', () => {
  const collPath = `${PREFIX}/family_invitations`;

  it('owner can read their own invitation', async () => {
    const db = authedDb('owner1');
    // Seed data as admin
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'inv1'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    await assertSucceeds(getDoc(doc(db, collPath, 'inv1')));
  });

  it('invitee can read invitation by email', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'inv2'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = authedDb('bob', 'bob@test.com');
    await assertSucceeds(getDoc(doc(db, collPath, 'inv2')));
  });

  it('random user cannot read another users invitation', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'inv3'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = authedDb('stranger');
    await assertFails(getDoc(doc(db, collPath, 'inv3')));
  });

  it('owner can create invitation with their uid', async () => {
    const db = authedDb('owner1');
    await assertSucceeds(
      setDoc(doc(db, collPath, 'inv4'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      })
    );
  });

  it('user cannot create invitation for another user', async () => {
    const db = authedDb('attacker');
    await assertFails(
      setDoc(doc(db, collPath, 'inv5'), {
        ownerUid: 'victim',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      })
    );
  });

  it('owner can delete their invitation', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'inv6'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = authedDb('owner1');
    await assertSucceeds(deleteDoc(doc(db, collPath, 'inv6')));
  });

  it('invitee cannot delete the invitation', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'inv7'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = authedDb('bob', 'bob@test.com');
    await assertFails(deleteDoc(doc(db, collPath, 'inv7')));
  });

  it('unauthenticated user cannot read invitations', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'inv8'), {
        ownerUid: 'owner1',
        inviteeEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = unauthDb();
    await assertFails(getDoc(doc(db, collPath, 'inv8')));
  });
});

// ─── SEC-2: family_connections ──────────────────────────────────────────────
describe('family_connections (SEC-2)', () => {
  const collPath = `${PREFIX}/family_connections`;

  it('owner party can read their connection', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = authedDb('owner1');
    await assertSucceeds(
      getDoc(doc(db, collPath, 'owner1_member1'))
    );
  });

  it('member party can read their connection', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = authedDb('member1');
    await assertSucceeds(
      getDoc(doc(db, collPath, 'owner1_member1'))
    );
  });

  it('random user cannot read others connection', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = authedDb('stranger');
    await assertFails(
      getDoc(doc(db, collPath, 'owner1_member1'))
    );
  });

  it('party can create connection where they are owner', async () => {
    const db = authedDb('owner1');
    await assertSucceeds(
      setDoc(doc(db, collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      })
    );
  });

  it('non-party cannot create connection for others', async () => {
    const db = authedDb('attacker');
    await assertFails(
      setDoc(doc(db, collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      })
    );
  });

  it('party can update their connection (disconnect)', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'owner1_member1'), {
        ownerUid: 'owner1',
        memberUid: 'member1',
        status: 'active',
      });
    });
    const db = authedDb('member1');
    await assertSucceeds(
      updateDoc(doc(db, collPath, 'owner1_member1'), {
        status: 'disconnected',
      })
    );
  });
});

// ─── SEC-6: legacy invitations ──────────────────────────────────────────────
describe('legacy invitations (SEC-6)', () => {
  const collPath = `${PREFIX}/invitations`;

  it('authenticated user can get invitation by token', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'token123'), {
        senderUid: 'sender1',
        recipientEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = authedDb('anyuser');
    await assertSucceeds(getDoc(doc(db, collPath, 'token123')));
  });

  it('unauthenticated user cannot get invitation token', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'token456'), {
        senderUid: 'sender1',
        recipientEmail: 'bob@test.com',
        status: 'pending',
      });
    });
    const db = unauthDb();
    await assertFails(getDoc(doc(db, collPath, 'token456')));
  });
});

// ─── Core: audit_log (no client access) ─────────────────────────────────────
describe('audit_log (locked down)', () => {
  const collPath = `${PREFIX}/audit_log`;

  it('authenticated user cannot read audit log', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'log1'), {
        action: 'test',
      });
    });
    const db = authedDb('admin');
    await assertFails(getDoc(doc(db, collPath, 'log1')));
  });

  it('authenticated user cannot write audit log', async () => {
    const db = authedDb('admin');
    await assertFails(
      setDoc(doc(db, collPath, 'log2'), { action: 'inject' })
    );
  });
});

// ─── Core: users collection (owner-only) ────────────────────────────────────
describe('users collection (owner-only)', () => {
  const userPath = (uid: string) => `${PREFIX}/users/${uid}`;

  it('user can read their own document', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), userPath('user1')), {
        displayName: 'Test User',
      });
    });
    const db = authedDb('user1');
    await assertSucceeds(getDoc(doc(db, userPath('user1'))));
  });

  it('user cannot read another users document', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), userPath('user2')), {
        displayName: 'Other User',
      });
    });
    const db = authedDb('user1');
    await assertFails(getDoc(doc(db, userPath('user2'))));
  });
});

// ─── Core: feedback (write-only) ────────────────────────────────────────────
describe('feedback (write-only)', () => {
  const collPath = `${PREFIX}/feedback`;

  it('authenticated user can create feedback', async () => {
    const db = authedDb('user1');
    await assertSucceeds(
      setDoc(doc(db, collPath, 'fb1'), { message: 'Great app!' })
    );
  });

  it('no one can read feedback', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), collPath, 'fb2'), {
        message: 'Secret',
      });
    });
    const db = authedDb('user1');
    await assertFails(getDoc(doc(db, collPath, 'fb2')));
  });
});

// ─── Default deny ───────────────────────────────────────────────────────────
describe('default deny', () => {
  it('unmatched paths are denied', async () => {
    const db = authedDb('user1');
    await assertFails(
      setDoc(doc(db, 'random/collection'), { data: 'test' })
    );
  });
});
