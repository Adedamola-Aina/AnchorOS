/**
 * Firestore Rules — Financial goals (PRD-007 onboarding step 3)
 *
 * Covers:
 * - owner-only create/read/update/delete
 * - cross-user denial (read and write)
 * - unauthenticated denial
 * - payload validation (title, targetAmountCents, currency, goalType)
 *
 * Regression context: `users/{uid}/goals` had no rule at all, so the onboarding
 * "Set a Goal" write was rejected by the default deny.
 *
 * @vitest-environment node
 */
// @ts-nocheck

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  describe, it, beforeAll, afterAll, beforeEach,
  assertSucceeds, assertFails, PREFIX, makeTestEnv,
} from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

const goalPath = (uid: string, id = 'goal1') => `${PREFIX}/users/${uid}/goals/${id}`;

const validGoal = {
  title: 'Emergency Fund',
  targetAmountCents: 500000,
  currentAmountCents: 0,
  currency: 'USD',
  goalType: 'emergency_fund',
  createdAt: '2026-09-17T00:00:00.000Z',
  updatedAt: '2026-09-17T00:00:00.000Z',
};

const seed = (uid: string) =>
  ctx.getEnv().withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), goalPath(uid)), validGoal);
  });

describe('goals (PRD-007)', () => {
  it('owner can create a valid goal — the onboarding step 3 write path', async () => {
    const db = ctx.authedDb('owner1');
    await assertSucceeds(setDoc(doc(db, goalPath('owner1')), validGoal));
  });

  it('owner can read, update and delete their own goal', async () => {
    await seed('owner1');
    const db = ctx.authedDb('owner1');

    await assertSucceeds(getDoc(doc(db, goalPath('owner1'))));
    await assertSucceeds(updateDoc(doc(db, goalPath('owner1')), { currentAmountCents: 1000 }));
    await assertSucceeds(deleteDoc(doc(db, goalPath('owner1'))));
  });

  it('another user cannot read or write the goal', async () => {
    await seed('owner1');
    const db = ctx.authedDb('intruder');

    await assertFails(getDoc(doc(db, goalPath('owner1'))));
    await assertFails(setDoc(doc(db, goalPath('owner1')), validGoal));
    await assertFails(updateDoc(doc(db, goalPath('owner1')), { currentAmountCents: 999 }));
    await assertFails(deleteDoc(doc(db, goalPath('owner1'))));
  });

  it('unauthenticated callers are denied', async () => {
    await seed('owner1');
    const db = ctx.unauthDb();

    await assertFails(getDoc(doc(db, goalPath('owner1'))));
    await assertFails(setDoc(doc(db, goalPath('owner1')), validGoal));
  });

  it('rejects invalid goal payloads', async () => {
    const db = ctx.authedDb('owner1');

    await assertFails(setDoc(doc(db, goalPath('owner1')), { ...validGoal, title: '' }));
    await assertFails(setDoc(doc(db, goalPath('owner1')), { ...validGoal, targetAmountCents: 0 }));
    await assertFails(setDoc(doc(db, goalPath('owner1')), { ...validGoal, currency: 'EUR' }));
    await assertFails(setDoc(doc(db, goalPath('owner1')), { ...validGoal, goalType: 'bogus' }));
    await assertFails(setDoc(doc(db, goalPath('owner1')), { ...validGoal, targetAmountCents: '500000' }));
  });
});
