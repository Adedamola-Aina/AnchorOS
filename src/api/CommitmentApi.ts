
import { addDoc, collection, deleteDoc, deleteField, doc, runTransaction, serverTimestamp, updateDoc, db } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';
import type { AnchorTask } from '../types';

export async function createCommitment(userUid: string, task: Omit<AnchorTask, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'artifacts', APP_ID, 'users', userUid, 'commitments'), {
    ...task,
    createdAt: serverTimestamp(),
    currentStreak: 0,
    longestStreak: 0,
  });
}

export async function toggleCommitmentCompletion(userUid: string, id: string, currentStatus: boolean) {
  const taskRef = doc(db, 'artifacts', APP_ID, 'users', userUid, 'commitments', id);

  await runTransaction(db, async (transaction) => {
    const taskDoc = await transaction.get(taskRef);
    if (!taskDoc.exists()) return;

    const task = taskDoc.data() as AnchorTask;
    const updates: Partial<AnchorTask> = { completed: !currentStatus };

    if (!currentStatus) {
      updates.lastCompletedAt = new Date().toISOString();
      const currentStreak = task.currentStreak || 0;
      const newStreak = currentStreak + 1;
      updates.currentStreak = newStreak;
      updates.longestStreak = Math.max(newStreak, task.longestStreak || 0);
    } else {
      const currentStreak = task.currentStreak || 0;
      if (currentStreak > 0) {
        updates.currentStreak = currentStreak - 1;
      }
    }

    transaction.update(taskRef, updates);
  });
}

export async function deleteCommitment(userUid: string, id: string) {
  await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', userUid, 'commitments', id));
}

/**
 * Turn an `undefined` value into an explicit field deletion.
 *
 * The edit form expresses "this field is empty" as `undefined` — an unset end
 * date, an interval back at 1, cleared notes. The Firestore SDK refuses a write
 * containing `undefined` outright, and the database-level
 * `ignoreUndefinedProperties` (which stops that crash) would otherwise *ignore*
 * those keys, leaving the previously-stored value in place — so "Clear" would
 * silently fail to clear. `deleteField()` is the one value that means "remove
 * this field", so the intent is preserved exactly.
 */
function toUpdatePayload(updates: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    payload[key] = value === undefined ? deleteField() : value;
  }
  return payload;
}

export async function updateCommitment(
  userUid: string,
  id: string,
  updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>
) {
  await updateDoc(
    doc(db, 'artifacts', APP_ID, 'users', userUid, 'commitments', id),
    toUpdatePayload(updates as Record<string, unknown>)
  );
}
