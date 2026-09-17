/**
 * Firestore Rules — user subcollections found unruled by the RA-15 gate
 * (custom categories, monthly Fabric reflections).
 *
 * @vitest-environment node
 */
// @ts-nocheck

import {
  doc, getDoc, setDoc, deleteDoc,
  describe, it, beforeAll, afterAll, beforeEach,
  assertSucceeds, assertFails, PREFIX, makeTestEnv,
} from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

const categoryPath = (uid: string, id = 'cat1') => `${PREFIX}/users/${uid}/categories/${id}`;
const reflectionPath = (uid: string, month = '2026-09') => `${PREFIX}/users/${uid}/fabric_monthly_reviews/${month}`;
const validCategory = { name: 'Coffee', createdAt: '2026-09-17T00:00:00.000Z' };

const seed = (path: string, data: Record<string, unknown>) =>
  ctx.getEnv().withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), path), data);
  });

describe('custom categories (PRD-010)', () => {
  it('owner can create and read a category', async () => {
    const db = ctx.authedDb('owner1');

    await assertSucceeds(setDoc(doc(db, categoryPath('owner1')), validCategory));
    await assertSucceeds(getDoc(doc(db, categoryPath('owner1'))));
  });

  it('owner can delete a category', async () => {
    await seed(categoryPath('owner1'), validCategory);

    await assertSucceeds(deleteDoc(doc(ctx.authedDb('owner1'), categoryPath('owner1'))));
  });

  it('another user cannot read or write the category', async () => {
    await seed(categoryPath('owner1'), validCategory);
    const db = ctx.authedDb('intruder');

    await assertFails(getDoc(doc(db, categoryPath('owner1'))));
    await assertFails(setDoc(doc(db, categoryPath('owner1')), validCategory));
    await assertFails(deleteDoc(doc(db, categoryPath('owner1'))));
  });

  it('unauthenticated callers are denied', async () => {
    await seed(categoryPath('owner1'), validCategory);

    await assertFails(getDoc(doc(ctx.unauthDb(), categoryPath('owner1'))));
  });

  it('rejects invalid category payloads', async () => {
    const db = ctx.authedDb('owner1');

    await assertFails(setDoc(doc(db, categoryPath('owner1')), { ...validCategory, name: '' }));
    await assertFails(setDoc(doc(db, categoryPath('owner1')), { ...validCategory, name: 'x'.repeat(51) }));
    await assertFails(setDoc(doc(db, categoryPath('owner1')), { ...validCategory, name: 42 }));
  });
});

describe('fabric_monthly_reviews', () => {
  it('owner can read a reflection', async () => {
    await seed(reflectionPath('owner1'), { month: '2026-09', summary: 'ok' });

    await assertSucceeds(getDoc(doc(ctx.authedDb('owner1'), reflectionPath('owner1'))));
  });

  it('client writes are denied (Cloud Functions only)', async () => {
    await assertFails(setDoc(doc(ctx.authedDb('owner1'), reflectionPath('owner1')), { month: '2026-09' }));
  });

  it('another user and unauthenticated callers cannot read it', async () => {
    await seed(reflectionPath('owner1'), { month: '2026-09' });

    await assertFails(getDoc(doc(ctx.authedDb('intruder'), reflectionPath('owner1'))));
    await assertFails(getDoc(doc(ctx.unauthDb(), reflectionPath('owner1'))));
  });
});
