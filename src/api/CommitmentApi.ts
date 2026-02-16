// @ts-nocheck
import { addDoc, collection, deleteDoc, doc, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
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

export async function updateCommitment(
  userUid: string,
  id: string,
  updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>
) {
  await updateDoc(doc(db, 'artifacts', APP_ID, 'users', userUid, 'commitments', id), updates);
}
