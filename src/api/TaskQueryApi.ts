// @ts-nocheck
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { APP_ID, db } from '../config/firebase';
import type { AnchorTask } from '../types';

export async function fetchTasksForUser(userId: string): Promise<AnchorTask[]> {
  const tasksQuery = query(
    collection(db, 'artifacts', APP_ID, 'users', userId, 'commitments'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  const snapshot = await getDocs(tasksQuery);
  return snapshot.docs.map((taskDoc) => ({ id: taskDoc.id, ...taskDoc.data() } as AnchorTask));
}
