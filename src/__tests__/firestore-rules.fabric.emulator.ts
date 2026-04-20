/**
 * Firestore Rules — Fabric AI subcollections (owner-only)
 *
 * Covers:
 * - mood_entries: owner read/write, non-owner denied
 * - fabric_settings: owner read/write, non-owner denied
 * - fabric_behavior, fabric_predictions: owner write, non-owner denied
 * - fabric_conversations, fabric_reports: owner read/write
 * - fabric_analytics, fabric_nudge_log: owner read-only (server write)
 *
 * @vitest-environment node
 */
// @ts-nocheck

import { doc, getDoc, setDoc, describe, it, beforeAll, afterAll, beforeEach, assertSucceeds, assertFails, PREFIX, makeTestEnv } from './firestore-rules.helpers';

const ctx = makeTestEnv();

beforeAll(ctx.setupAll);
afterAll(ctx.teardownAll);
beforeEach(ctx.clearAll);

// ─── Fabric documents (owner-only) ─────────────────────────────────────────
describe('fabric documents (owner-only)', () => {
  const userRoot = (uid: string) => `${PREFIX}/users/${uid}`;

  it('owner can write and read mood_entries for today', async () => {
    const db = ctx.authedDb('user1');
    const today = '2026-03-11';
    const moodDoc = doc(db, `${userRoot('user1')}/mood_entries`, today);

    await assertSucceeds(
      setDoc(moodDoc, {
        date: today,
        mood: 4,
        createdAt: new Date().toISOString(),
      })
    );
    await assertSucceeds(getDoc(moodDoc));
  });

  it('non-owner cannot write another users mood_entries', async () => {
    const db = ctx.authedDb('user1');
    await assertFails(
      setDoc(doc(db, `${userRoot('user2')}/mood_entries`, '2026-03-11'), {
        date: '2026-03-11',
        mood: 5,
        createdAt: new Date().toISOString(),
      })
    );
  });

  it('owner can read and write fabric_settings', async () => {
    const db = ctx.authedDb('user1');
    const settingsDoc = doc(db, `${userRoot('user1')}/fabric_settings`, 'state');

    await assertSucceeds(
      setDoc(settingsDoc, { enabled: true, dataCollectionEnabled: true })
    );
    await assertSucceeds(getDoc(settingsDoc));
  });

  it('non-owner cannot read another users fabric_settings', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), `${userRoot('user2')}/fabric_settings`, 'state'), {
        enabled: true,
        dataCollectionEnabled: true,
      });
    });
    const db = ctx.authedDb('user1');
    await assertFails(getDoc(doc(db, `${userRoot('user2')}/fabric_settings`, 'state')));
  });

  it('owner can write fabric_behavior', async () => {
    const db = ctx.authedDb('user1');
    await assertSucceeds(
      setDoc(doc(db, `${userRoot('user1')}/fabric_behavior`, 'state'), {
        patterns: [],
        confirmedPatterns: [],
        recentActions: [],
        dismissedPatterns: [],
      })
    );
  });

  it('non-owner cannot write another users fabric_predictions', async () => {
    const db = ctx.authedDb('user1');
    await assertFails(
      setDoc(doc(db, `${userRoot('user2')}/fabric_predictions`, 'state'), { active: [] })
    );
  });

  it('owner can write and read fabric_conversations subcollection', async () => {
    const db = ctx.authedDb('user1');
    const convDoc = doc(db, `${userRoot('user1')}/fabric_conversations`, '2026-03-09');

    await assertSucceeds(setDoc(convDoc, { messages: [] }));
    await assertSucceeds(getDoc(convDoc));
  });

  it('owner can write and read fabric_reports subcollection', async () => {
    const db = ctx.authedDb('user1');
    const reportDoc = doc(db, `${userRoot('user1')}/fabric_reports`, '2026-03-02');

    await assertSucceeds(setDoc(reportDoc, { report: { insights: [] } }));
    await assertSucceeds(getDoc(reportDoc));
  });

  it('owner can read fabric_analytics but cannot write it directly', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), `${userRoot('user1')}/fabric_analytics`, '2026-03'), {
        fabric_nudge_received: [{ nudge_type: 'streak' }],
      });
    });
    const db = ctx.authedDb('user1');
    await assertSucceeds(getDoc(doc(db, `${userRoot('user1')}/fabric_analytics`, '2026-03')));
    await assertFails(
      setDoc(doc(db, `${userRoot('user1')}/fabric_analytics`, '2026-03'), {
        fabric_nudge_received: [{ nudge_type: 'budget' }],
      })
    );
  });

  it('owner can read fabric_nudge_log but cannot write it directly', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), `${userRoot('user1')}/fabric_nudge_log`, '2026-03-15'), {
        streak: true,
      });
    });
    const db = ctx.authedDb('user1');
    await assertSucceeds(getDoc(doc(db, `${userRoot('user1')}/fabric_nudge_log`, '2026-03-15')));
    await assertFails(
      setDoc(doc(db, `${userRoot('user1')}/fabric_nudge_log`, '2026-03-15'), {
        streak: true,
        budget_mid_month: true,
      })
    );
  });

  it('non-owner cannot read another users fabric_analytics or fabric_nudge_log', async () => {
    await ctx.getEnv().withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), `${userRoot('user2')}/fabric_analytics`, '2026-03'), {
        fabric_nudge_received: [{ nudge_type: 'surplus' }],
      });
      await setDoc(doc(c.firestore(), `${userRoot('user2')}/fabric_nudge_log`, '2026-03-15'), {
        surplus: true,
      });
    });
    const db = ctx.authedDb('user1');
    await assertFails(getDoc(doc(db, `${userRoot('user2')}/fabric_analytics`, '2026-03')));
    await assertFails(getDoc(doc(db, `${userRoot('user2')}/fabric_nudge_log`, '2026-03-15')));
  });
});
