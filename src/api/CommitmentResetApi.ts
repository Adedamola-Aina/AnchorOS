// @ts-nocheck
import { doc, updateDoc, db } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';

export async function resetCommitmentCompletion(userUid: string, commitmentId: string): Promise<void> {
    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', userUid, 'commitments', commitmentId), {
        completed: false,
    });
}

export async function resetCommitmentStreak(userUid: string, commitmentId: string): Promise<void> {
    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', userUid, 'commitments', commitmentId), {
        currentStreak: 0,
    });
}