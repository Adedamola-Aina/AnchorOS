// @ts-nocheck
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

type FeedbackPayload = {
  subject: string;
  message: string;
  name: string;
  email: string;
  userId: string;
  appVersion: string;
  deviceType: string;
  platform: string;
  currentPage: string;
  timestamp: string;
};

export async function createFeedbackBackup(payload: FeedbackPayload): Promise<void> {
  await addDoc(collection(db, 'artifacts', APP_ID, 'feedback'), {
    ...payload,
    createdAt: serverTimestamp(),
    status: 'new',
  });
}
