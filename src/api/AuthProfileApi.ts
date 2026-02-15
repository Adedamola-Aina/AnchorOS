import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import type { DocumentSnapshot, Unsubscribe } from 'firebase/firestore';
import { APP_ID, db } from '../config/firebase';
import type { UserProfile } from '../types';

/**
 * Subscribe to a user's profile document in real-time.
 * Returns an unsubscribe function.
 */
export function subscribeToProfile(
  uid: string,
  onNext: (snapshot: DocumentSnapshot) => void,
): Unsubscribe {
  const profRef = doc(db, 'artifacts', APP_ID, 'users', uid);
  return onSnapshot(profRef, onNext);
}

/**
 * Update an existing user profile with partial data.
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'artifacts', APP_ID, 'users', uid), updates);
}

/**
 * Create a new user profile document (used during sign-up or first-login).
 */
export async function createUserProfile(uid: string, data: UserProfile): Promise<void> {
  await setDoc(doc(db, 'artifacts', APP_ID, 'users', uid), data);
}

/**
 * Queue a welcome email via the mail collection trigger.
 */
export async function queueWelcomeEmail(toAddress: string, html: string): Promise<void> {
  await addDoc(collection(db, 'mail'), {
    to: [toAddress],
    message: { subject: 'Welcome to Anchor OS!', html },
  });
}
