/**
 * Firebase Storage Security Rules Unit Tests
 *
 * Covers finance account artwork uploads.
 *
 * @vitest-environment node
 */
// @ts-nocheck

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';

const PROJECT_ID = 'anchor-os';
const FIRESTORE_RULES_PATH = resolve(__dirname, '../../config/firestore.rules');
const RULES_PATH = resolve(__dirname, '../../config/storage.rules');
const BUCKET = `gs://${PROJECT_ID}`;

let testEnv: RulesTestEnvironment;

function ownerStorage(uid: string) {
  return testEnv.authenticatedContext(uid).storage(BUCKET);
}

function unauthStorage() {
  return testEnv.unauthenticatedContext().storage(BUCKET);
}

beforeAll(async () => {
  const firestoreRules = readFileSync(FIRESTORE_RULES_PATH, 'utf8');
  const rules = readFileSync(RULES_PATH, 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: firestoreRules },
    storage: { rules },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.clearStorage();
});

describe('storage account artwork rules', () => {
  const artworkPath = 'artifacts/anchor-os/users/owner-1/accounts/acc-1/artwork/card.png';

  async function seedAccount(sharedUserId?: string) {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'artifacts/anchor-os/users/owner-1/accounts/acc-1'), {
        id: 'acc-1',
        ownerId: 'owner-1',
        name: 'Family Savings',
        type: 'savings',
        currency: 'USD',
        balanceCents: 400000,
        color: '#1d4ed8',
        scope: 'family',
        sharedWith: sharedUserId
          ? {
              [sharedUserId]: {
                grantedAt: '2026-04-05T00:00:00.000Z',
                grantedBy: 'owner-1',
                permission: 'read',
              },
            }
          : {},
      });
    });
  }

  async function seedArtwork() {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.storage(BUCKET).ref(artworkPath).putString('image-data', 'raw', {
        contentType: 'image/png',
      });
    });
  }

  it('allows the owner to upload image artwork', async () => {
    await assertSucceeds(
      ownerStorage('owner-1').ref(artworkPath).putString('image-data', 'raw', {
        contentType: 'image/png',
      }),
    );
  });

  it('allows a shared viewer to read artwork for an account shared with them', async () => {
    await seedAccount('viewer-1');
    await seedArtwork();

    await assertSucceeds(ownerStorage('viewer-1').ref(artworkPath).getMetadata());
  });

  it('rejects read access for an unrelated authenticated user', async () => {
    await seedAccount('viewer-1');
    await seedArtwork();

    await assertFails(ownerStorage('stranger-1').ref(artworkPath).getMetadata());
  });

  it('rejects upload from a different authenticated user', async () => {
    await assertFails(
      ownerStorage('viewer-1').ref(artworkPath).putString('image-data', 'raw', {
        contentType: 'image/png',
      }),
    );
  });

  it('rejects unauthenticated upload', async () => {
    await assertFails(
      unauthStorage().ref(artworkPath).putString('image-data', 'raw', {
        contentType: 'image/png',
      }),
    );
  });

  it('rejects non-image uploads even for the owner', async () => {
    await assertFails(
      ownerStorage('owner-1').ref(artworkPath).putString('not-an-image', 'raw', {
        contentType: 'text/plain',
      }),
    );
  });
});