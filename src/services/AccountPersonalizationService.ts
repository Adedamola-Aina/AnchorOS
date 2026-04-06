/** Account personalization operations — extracted per ARCH-001 (200-line rule). */

import { doc, updateDoc, type Firestore } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type { AnchorAccount } from '../types';

export async function updateAccountPersonalization(
  firestore: Firestore,
  userId: string,
  account: AnchorAccount,
  updates: { cardColor?: string; cardArtwork?: string; cardArtworkPath?: string; cardArtworkPreset?: string },
): Promise<void> {
  const ownerId = account.ownerId || userId;
  if (ownerId !== userId) {
    throw new AnchorError('Permission denied: Only the account owner can personalize this account.', 'PERMISSION');
  }

  const payload = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(payload).length === 0) return;

  try {
    const accRef = doc(firestore, 'artifacts', APP_ID, 'users', ownerId, 'accounts', account.id);
    await updateDoc(accRef, payload);
  } catch (error) {
    throw new AnchorError('Failed to update account personalization', 'DATABASE', error);
  }
}
