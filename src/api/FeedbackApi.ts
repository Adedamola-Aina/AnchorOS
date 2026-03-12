// @ts-nocheck
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

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
  const submitFeedback = httpsCallable(functions, 'submitFeedback');
  await submitFeedback(payload);
}
